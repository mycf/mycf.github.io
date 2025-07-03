首先看下他的出现位置,在`@SpringBootApplication`注解上的`@EnableAutoConfiguration`注解中有一个`@Import(AutoConfigurationImportSelector.class)`

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage
@Import(AutoConfigurationImportSelector.class)
public @interface EnableAutoConfiguration {
``` 

## `AutoConfigurationImportSelector`
`AutoConfigurationImportSelector`实现了`DeferredImportSelector`接口，`DeferredImportSelector`又继承了`ImportSelector`

![image.png](https://gitee.com/ycfan/images/raw/master/img/20231206114306.png)

```java
public class AutoConfigurationImportSelector implements DeferredImportSelector, BeanClassLoaderAware,
		ResourceLoaderAware, BeanFactoryAware, EnvironmentAware, Ordered {
```


@Import模式向容器导入Bean是一种非常重要的方式，特别是在注解驱动的Spring项目中，@Enablexxx的设计模式中有大量的使用，在当下最流行的Spring Boot中，被用来做底层抽象、组件式的设计。

比如我们熟悉的：@EnableAsync、@EnableAspectJAutoProxy、@EnableMBeanExport、@EnableTransactionManagement…等等统一采用的都是借助@Import注解来实现的。

> 需要注意的是：ImportSelector、DeferredImportSelector、ImportBeanDefinitionRegistrar这三个接口都必须依赖于@Import一起使用，而@Import可以单独使用。

## @Import注解

这里单独使用@Import的例子，使用它有一个非常方便的地方在于：它可以导入Jar包里面的类（因为我们的@ComponentScan是不会扫描jar包的），可以看看下面这个例子：

```java
//@Configuration换成@Component效果也是一样的，习惯上放在@Configuration而已
@Configuration
@Import({AntPathMatcher.class}) // 这是Spring-code包里面的Bean，我随便找的一个
public class MyConfig {

}
```

ImportSelector和DeferredImportSelector

使用@Import的时候，它的类可以是实现了ImportSelector或者DeferredImportSelector接口的类。

先来看看ImportSelector接口的定义，其中有两个方法：
- String[] selectImports(AnnotationMetadata importingClassMetadata) 返回一个包含了类全限定名的数组，这些类会注入到Spring容器当中。
- Predicate\<String\> getExclusionFilter() 返回一个谓词接口，该方法制定了一个对类全限定名的排除规则来过滤一些候选的导入类，默认不排除过滤。该接口可以不实现。
Spring容器会实例化这个实现类，并且执行其selectImports方法。
我们先来看一个ImportSelector的例子：

```java
public class MyImportSelector implements ImportSelector
        //虽然不能@Autowired，但是实现了这些接口是可以感知到的，下面看源码会发现，Spring会给它注入进去
        // 这样我们就可以根据特定的条件，来决定某些Bean能注入，有些Bean不能注入了
        //,BeanClassLoaderAware,BeanFactoryAware,EnvironmentAware,ResourceLoaderAware
{


    // 备注：这里各种@Autowired的注入都是不生效的，都是null
    // 了解Spring容器刷新过程的时候就知道，这个时候还没有开始解析@Autowired，所以肯定是不生效的
    @Autowired
    private HelloService helloService;

    /**
     * 容器在会在特定的时机，帮我们调用这个方法，向容器里注入Bean信息
     *
     * @param importingClassMetadata 包含配置类上面所有的注解信息，以及该配置类本身
     *                               若有需要，可以根据这些其它注解信息，来判断哪些Bean应该注册进去，哪些不需要
     * @return 返回String数组，注意：都必须是类的全类名，才会被注册进去的（若你返回的全类名不存在该类，容器会抛错）
     */
    @Override
    public String[] selectImports(AnnotationMetadata importingClassMetadata) {
        System.out.println("this MyImportSelector...");
        //return new String[]{"com.buqiong.bean.Child"};
        // 一般建议这么玩 用字符串写死的方式只是某些特殊场合（比如这个类不一定存在之类的。。。）
        return new String[]{Child.class.getName()};
        
    }
}
```

这里我提一个Spring的默认实现AdviceModeImportSelector（它通过解析注解信息，选择合适的Bean加入），这个类在事务的处理和AOP处理上有用到。

再来一个DeferredImportSelector的示例：

```java
public class MyDeferredImportSelector implements DeferredImportSelector {

    // 同样的，它也只需要实现这个方法即可 但是它还提供了一些更高级的功能
    @Override
    public String[] selectImports(AnnotationMetadata importingClassMetadata) {
        System.out.println("this MyDeferredImportSelector...");
        // 这里面若容器里已经有名为`com.fsx.bean.Child`的Bean，就不会再注册进去了的
        return new String[]{"com.buqiong.bean.Child"};
    }
}
```

我们发现使用方式几乎一样，真的一样吗？其实容器启动的时候还有一个细节输出：

```plaintext
this MyImportSelector...
this MyDeferredImportSelector...
```

从现象和名字中，我们能够更加直观的看出来：DeferredImportSelector显然是属于延迟加载、靠后加载的，那到底有多延迟，他们执行时机都是啥时候呢？ 这就是我们接下来讨论的重点。

> 再次强调一次：实现此接口的Bean必须是放在@Import进去的才会生效，而不能直接@Bean加入进去

## **ImportSelector和DeferredImportSelector的区别：**

- DeferredImportSelector是ImportSelector的一个扩展
- ImportSelector实例的selectImports方法的执行时机，是在@Configuration注解中的其他逻辑被处理**之前**，所谓的其他逻辑，包括对@ImportResource、@Bean这些注解的处理（注意，这里只是对@Bean修饰的方法的处理，并不是立即调用@Bean修饰的方法，这个区别很重要！）
- DeferredImportSelector实例的selectImports方法的执行时机，是在@Configuration注解中的其他逻辑被处理**完毕之后**
- DeferredImportSelector的实现类可以用Order注解，或者实现Ordered接口来对selectImports的执行顺序排序（ImportSelector不支持）
- ImportSelector是Spring3.1提供的，DeferredImportSelector是Spring4.0提供的
- Spring Boot的自动配置功能就是通过DeferredImportSelector接口的实现类EnableAutoConfigurationImportSelector做到的（因为自动配置必须在我们自定义配置后执行才行，注意SpringBoot高版本已换成AutoConfigurationImportSelector）

**分析Spring源码中对此两个接口的处理**

结合 [Spring解析@Configuration注解的处理器：ConfigurationClassPostProcessor（ConfigurationClassParser）](https://www.cnblogs.com/xfeiyun/p/15666689.html) 分析。public void parse(Set\<BeanDefinitionHolder\> configCandidates){ ... }的最后一步，才去处理实现了DeferredImportSelector接口的类，因此是非常滞后的（此时已经处理好了@Bean、@ComponentScan、@ImportResource等等事宜）。

> ImportSelector 被设计成其实和@Import注解的类同样的导入效果，但是实现 ImportSelector的类可以条件性地决定导入哪些配置。
> 
> DeferredImportSelector 的设计目的是在所有其他的配置类被处理后才处理。这也正是该语句被放到本函数最后一行的原因。

看看前面做了些什么，我们直接来到核心处理方法doProcessConfigurationClass：

```java
@Nullable
protected final SourceClass doProcessConfigurationClass(ConfigurationClass configClass, SourceClass sourceClass)
		throws IOException {

	// Recursively process any member (nested) classes first
	// 递归循环的解析内部类的配置类（因此，即使是内部类的配置类，我们Spring也是支持的，很强大有木有）
	processMemberClasses(configClass, sourceClass);

	// Process any @PropertySource annotations
	// 处理@PropertySources注解和@PropertySource注解，交给processPropertySource去解析
	// 显然必须是ConfigurableEnvironment的环境采取解析，否则发出警告：会忽略这个不进行解析
	for (AnnotationAttributes propertySource : AnnotationConfigUtils.attributesForRepeatable(
			sourceClass.getMetadata(), PropertySources.class,
			org.springframework.context.annotation.PropertySource.class)) {
		if (this.environment instanceof ConfigurableEnvironment) {
			processPropertySource(propertySource);
		}
		else {
			logger.warn("Ignoring @PropertySource annotation on [" + sourceClass.getMetadata().getClassName() +
					"]. Reason: Environment must implement ConfigurableEnvironment");
		}
	}

	// Process any @ComponentScan annotations
	// 解析@ComponentScans和@ComponentScan注解，进行包扫描。最终交给ComponentScanAnnotationParser#parse方法进行处理
	Set<AnnotationAttributes> componentScans = AnnotationConfigUtils.attributesForRepeatable(
			sourceClass.getMetadata(), ComponentScans.class, ComponentScan.class);
	if (!componentScans.isEmpty() &&
			!this.conditionEvaluator.shouldSkip(sourceClass.getMetadata(), ConfigurationPhase.REGISTER_BEAN)) {
		for (AnnotationAttributes componentScan : componentScans) {
			// The config class is annotated with @ComponentScan -> perform the scan immediately
			Set<BeanDefinitionHolder> scannedBeanDefinitions =
					this.componentScanParser.parse(componentScan, sourceClass.getMetadata().getClassName());
			// Check the set of scanned definitions for any further config classes and parse recursively if needed
			// 这一步非常重要：如果被扫描的Bean定义信息，还是属于@Configuration的配置组件，那就继续调用本类的parse方法，进行递归解析==============
			// 所以我们在进行包扫描的时候，也是会扫描到@Configuration并且进行解析的。。。
			for (BeanDefinitionHolder holder : scannedBeanDefinitions) {
				BeanDefinition bdCand = holder.getBeanDefinition().getOriginatingBeanDefinition();
				if (bdCand == null) {
					bdCand = holder.getBeanDefinition();
				}
				if (ConfigurationClassUtils.checkConfigurationClassCandidate(bdCand, this.metadataReaderFactory)) {
					parse(bdCand.getBeanClassName(), holder.getBeanName());
				}
			}
		}
	}

	// Process any @Import annotations
	// 这里是今天的主菜：解析@Import注解，后面详解processImports方法
	processImports(configClass, sourceClass, getImports(sourceClass), true);

	// Process any @ImportResource annotations
	// 显然，先是处理了@Import，才过来解析@ImportResource的====最终交给environment.resolveRequiredPlaceholders(resource)去处理了
	AnnotationAttributes importResource =
			AnnotationConfigUtils.attributesFor(sourceClass.getMetadata(), ImportResource.class);
	if (importResource != null) {
		String[] resources = importResource.getStringArray("locations");
		Class<? extends BeanDefinitionReader> readerClass = importResource.getClass("reader");
		for (String resource : resources) {
			String resolvedResource = this.environment.resolveRequiredPlaceholders(resource);
			configClass.addImportedResource(resolvedResource, readerClass);
		}
	}

	// Process individual @Bean methods
	// 处理被标注了@Bean注解的方法们
	// 遍历@Bean注释的方法,添加到configClass中的BeanMethod
	// 这里需要注意的是：最终会实例化的时候是执行此工厂方法来获取到对应实例的
	// if (mbd.getFactoryMethodName() != null) { ... }  这里会是true，从而执行此方法内部逻辑。   原理同XML中的FactoryMethod方式创建Bean
	Set<MethodMetadata> beanMethods = retrieveBeanMethodMetadata(sourceClass);
	for (MethodMetadata methodMetadata : beanMethods) {
		configClass.addBeanMethod(new BeanMethod(methodMetadata, configClass));
	}

	// Process default methods on interfaces
	// 这个特别有意思：处理接口中被@Bean注解默认方法,代码如下
	// 因为JDK8以后接口可以写default方法了，所以接口竟然也能给容器里注册Bean了
	// 但是需要注意：这里的意思并不是说你写个接口然后标注上@Configuration注解，然后@Bean注入就可以了
	// 这个解析的意思是我们的配置类可以实现接口，然后在所实现的接口里面若有@Bean的注解默认方法，是会加入到容器的
	processInterfaces(configClass, sourceClass);

	// Process superclass, if any
	// 如果有父类的话,则返回父类进行进一步的解析,否则返回null
	// 这个也是很厉害的，如果有父类，也是能够继续解析的。@EnableWebMvc中的DelegatingWebMvcConfiguration就是这么玩的
	// 它自己标注了@Configuration注解，但是真正@Bean注入，都是它父类去干的
	if (sourceClass.getMetadata().hasSuperClass()) {
		String superclass = sourceClass.getMetadata().getSuperClassName();
		if (superclass != null && !superclass.startsWith("java") &&
				!this.knownSuperclasses.containsKey(superclass)) {
			this.knownSuperclasses.put(superclass, configClass);
			// Superclass found, return its annotation metadata and recurse
			// 若找到了父类，会返回然后继续处理
			return sourceClass.getSuperClass();
		}
	}

	// No superclass -> processing is complete
	// 没有父类，就停止了，处理结束
	return null;
}
```

我们重点来看看processImports这个方法，如下：

```java
private void processImports(ConfigurationClass configClass, SourceClass currentSourceClass,
		Collection<SourceClass> importCandidates, boolean checkForCircularImports) {
	
	// 相当于没有找到@Import注解，那就不处理了
	// 说明：获取@Import是递归获取，任意子类父类上标注有都行的
	if (importCandidates.isEmpty()) {
		return;
	}
	
	//循环依赖检查：如果存在循环依赖的话,则直接抛出异常(比如你@Import我，我@Import你这种情况)
	if (checkForCircularImports && isChainedImportOnStack(configClass)) {
		this.problemReporter.error(new CircularImportProblem(configClass, this.importStack));
	}
	else {
		this.importStack.push(configClass);
		try {
			// 依次处理每个@Import里面候选的Bean们
			for (SourceClass candidate : importCandidates) {
				
				// 分之一：如果实现了ImportSelector接口（又分为两种，因为有子接口DeferredImportSelector呢）
				if (candidate.isAssignable(ImportSelector.class)) {
					// Candidate class is an ImportSelector -> delegate to it to determine imports
					Class<?> candidateClass = candidate.loadClass();
		
					// 根据空的构造函数，把这个Bean实例化出来，
					ImportSelector selector = BeanUtils.instantiateClass(candidateClass, ImportSelector.class);
					// 这里面注入了一下感知接口的元素，包括environment、resourceLoader、registry等等（实现了DeferredImportSelector也在此处注入了哦）
					ParserStrategyUtils.invokeAwareMethods(selector, this.environment, this.resourceLoader, this.registry);

					// 判断是否是DeferredImportSelectorHolder的子类，是的话先加入进入  不处理先
					if (this.deferredImportSelectors != null && selector instanceof DeferredImportSelector) {
						this.deferredImportSelectors.add(
								new DeferredImportSelectorHolder(configClass, (DeferredImportSelector) selector));
					}
					
					// 否则立马调用它的`selectImports`方法，拿到一个BeanName的数组
					else {
						String[] importClassNames = selector.selectImports(currentSourceClass.getMetadata());
						Collection<SourceClass> importSourceClasses = asSourceClasses(importClassNames);
						// 这里面高级了：因为我们这里放进去的Bean，有可能是普通Bean，当然也还有可能是实现了ImportSelector等等接口的，因此此处继续调用processImports进行处理，递归的效果~~~~
						processImports(configClass, currentSourceClass, importSourceClasses, false);
					}
				}
				//如果实现了ImportBeanDefinitionRegistrar这个接口的
				else if (candidate.isAssignable(ImportBeanDefinitionRegistrar.class)) {
					// Candidate class is an ImportBeanDefinitionRegistrar ->
					// delegate to it to register additional bean definitions
					Class<?> candidateClass = candidate.loadClass();
					ImportBeanDefinitionRegistrar registrar =
							BeanUtils.instantiateClass(candidateClass, ImportBeanDefinitionRegistrar.class);
					ParserStrategyUtils.invokeAwareMethods(
							registrar, this.environment, this.resourceLoader, this.registry);

					// 完成了实例化后和Aware方法后，添加进configClass类的属性importBeanDefinitionRegistrars里先缓存着（至于执行时机，留给下面讲吧）
					configClass.addImportBeanDefinitionRegistrar(registrar, currentSourceClass.getMetadata());
				}
				else {
					// Candidate class not an ImportSelector or ImportBeanDefinitionRegistrar ->
					// process it as an @Configuration class
					// 什么都接口都没有实现，那就是普通的配置类嘛，那就直接交给processConfigurationClass()去处理了
					// 备注：这个方法的处理流程，请参照上面哦
					// 这里面有个特别重要的地方：是candidate.asConfigClass(configClass)这一句，给包装陈一个ConfigurationClass去处理
					// 因为传入了configClass属于它的importedBy属性，这样一来ConfigurationClass#isImported()就返回true了，表面这个Bean是被单纯的、单纯的、单纯的的导入进来的
					this.importStack.registerImport(
							currentSourceClass.getMetadata(), candidate.getMetadata().getClassName());
					processConfigurationClass(candidate.asConfigClass(configClass));
				}
			}
		}
		catch (BeanDefinitionStoreException ex) {
			throw ex;
		}
		catch (Throwable ex) {
			throw new BeanDefinitionStoreException(
					"Failed to process import candidates for configuration class [" +
					configClass.getMetadata().getClassName() + "]", ex);
		}
		finally {
			// 上面push，下面pop出来
			this.importStack.pop();
		}
	}
}
```

从上面的源码处理过程，我们可以很清楚的知道了ImportSelector#selectImports执行时机，然后并且把DeferredImportSelector和ImportBeanDefinitionRegistrar都先装起来了。

doProcessConfigurationClass执行完成之后，processConfigurationClass也就执行完了，接下来就开始执行顶层parse方法内部的：processDeferredImportSelectors()：

DeferredImportSelector的源码：（Spring4和Spring5差异很大） 本文都是基于Spring5进行讲解的

```java
// Spring4的源码，啥都木有
public interface DeferredImportSelector extends ImportSelector {
}

// Sparing5的源码，加了不少东西
public interface DeferredImportSelector extends ImportSelector {
	@Nullable
	default Class<? extends Group> getImportGroup() {
		return null;
	}
	
	// 内部接口
	interface Group {
		void process(AnnotationMetadata metadata, DeferredImportSelector selector);
		Iterable<Entry> selectImports();
		
		// 内部的内部类
		class Entry {
			private final AnnotationMetadata metadata;
			private final String importClassName;
			
			public Entry(AnnotationMetadata metadata, String importClassName) {
				this.metadata = metadata;
				this.importClassName = importClassName;
			}


			public AnnotationMetadata getMetadata() {
				return this.metadata;
			}
			public String getImportClassName() {
				return this.importClassName;
			}

			@Override
			public boolean equals(Object o) {
				if (this == o) {
					return true;
				}
				if (o == null || getClass() != o.getClass()) {
					return false;
				}
				Entry entry = (Entry) o;
				return Objects.equals(this.metadata, entry.metadata) &&
						Objects.equals(this.importClassName, entry.importClassName);
			}

			@Override
			public int hashCode() {
				return Objects.hash(this.metadata, this.importClassName);
			}
		}
	}
}
```

源码的差异很大，就造成了processDeferredImportSelectors的处理方式不尽相同。

```java
private void processDeferredImportSelectors() {
	List<DeferredImportSelectorHolder> deferredImports = this.deferredImportSelectors;
	this.deferredImportSelectors = null;
	if (deferredImports == null) {
		return;
	}
	
	// 排序：注意这个比较器。它是按照PriorityOrdered、Ordered等进行优先级排序的
	// 因此我们可以看到一大特性：DeferredImportSelector是支持Order排序的
	deferredImports.sort(DEFERRED_IMPORT_COMPARATOR);
	// 这个Map厉害了，key竟然是Object。。。
	Map<Object, DeferredImportSelectorGrouping> groupings = new LinkedHashMap<>();
	Map<AnnotationMetadata, ConfigurationClass> configurationClasses = new HashMap<>();

	// 对这些个DeferredImportSelector一个个处理吧
	//遍历DeferredImportSelector接口集合，获取Group集合类，默认为DefaultDeferredImportSelectorGroup
	for (DeferredImportSelectorHolder deferredImport : deferredImports) {
		
		// getImportGroup()方法是DeferredImportSelector接口的default方法，若不复写，默认return null
		// 该接口的作用是：子类可以对一些Import的类进行分类 
		//Group 为DeferredImportSelector的一个内部接口~~~~~~~~~~~
		Class<? extends Group> group = deferredImport.getImportSelector().getImportGroup();
		
		// 按照group 或者 deferredImport 进行分组
		DeferredImportSelectorGrouping grouping = groupings.computeIfAbsent((group == null ? deferredImport : group), (key) -> new DeferredImportSelectorGrouping(createGroup(group)));
		grouping.add(deferredImport);
		configurationClasses.put(deferredImport.getConfigurationClass().getMetadata(),
				deferredImport.getConfigurationClass());
	}
	
	//遍历Group集合，作用也是调用processImport()方法用于解析@Import
	for (DeferredImportSelectorGrouping grouping : groupings.values()) {
		grouping.getImports().forEach((entry) -> {
			ConfigurationClass configurationClass = configurationClasses.get(
					entry.getMetadata());
			try {
				processImports(configurationClass, asSourceClass(configurationClass),
						asSourceClasses(entry.getImportClassName()), false);
			}
			catch (BeanDefinitionStoreException ex) {
				throw ex;
			}
			catch (Throwable ex) {
				throw new BeanDefinitionStoreException(
						"Failed to process import candidates for configuration class [" +
								configurationClass.getMetadata().getClassName() + "]", ex);
			}
		});
	}
```

DeferredImportSelector接口在Spring-core/Context中没有实现类。但是在Spring Boot的自动配置中有大量的实现。

ImportBeanDefinitionRegistrar

> 该接口功能非常强大，能够实现快速的、批量的、扫描式的注册。比如我们熟悉的ServletComponentScanRegistrar就是去解析注解@ServletComponentScan实现批量注册Bean定义。
> 
> MapperScannerRegistrar就是MyBatis用来解析@MapperScan注解，来扫描的 等等还有很多类似的设计方式。

先看一个最简单的效果吧：

```java
@Configuration
@Import({Parent.class, AntPathMatcher.class, MyImportSelector.class, MyDeferredImportSelector.class, MyImportBeanDefinitionRegistrar.class})
public class MyConfig {

}


public class MyImportBeanDefinitionRegistrar implements ImportBeanDefinitionRegistrar {

    // 同样的，这种注入都是不好使的（相同的，那些感知接口是可以实现的，从而注入对应组件）
    @Autowired
    private HelloService helloService;

    /**
     * 实现了该接口让我们的这个类成为了拥有注册bean的能力
     * 也可以让我们实现动态注入（根据条件、逻辑进行动态注入）
     *
     * @param importingClassMetadata 注解信息和本类信息
     * @param registry               注册器，我们可以向容器里面注册[Bean定义信息]
     */
    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {
        System.out.println("this MyImportBeanDefinitionRegistrar");
        RootBeanDefinition beanDefinition = new RootBeanDefinition();
        beanDefinition.setBeanClass(GenericBean.class);
        registry.registerBeanDefinition("genericBean", beanDefinition);
    }
}
```

发现：genericBean成功被注入容器了。

从另外一个日志的打印来看：MyImportBeanDefinitionRegistrar是更加滞后执行的。那么下面我们就要看看它到底啥时候执行的呢？

```plaintext
this MyImportSelector...
this MyDeferredImportSelector...
this MyImportBeanDefinitionRegistrar
```

在ConfigurationClassParser中，如果实现了ImportBeanDefinitionRegistrar接口的，最后是这么一句话给缓存下来了（还木有执行）：

```java
// registrar是已经被实例化了的当前类
configClass.addImportBeanDefinitionRegistrar(registrar, currentSourceClass.getMetadata());
```

下面重点看看，该接口到底什么时候执行的呢？根据断点，跟踪到它的加载时机是在ConfigurationClassPostProcessor这句代码里：

this.reader.loadBeanDefinitions(configClasses);：

```java
public void loadBeanDefinitions(Set<ConfigurationClass> configurationModel) {
	TrackedConditionEvaluator trackedConditionEvaluator = new TrackedConditionEvaluator();
	// 依次解析每一个配置类，这里面注意了configClass 比如我们的RootConfig这个对象里有个字段
	//importBeanDefinitionRegistrars是记录着了我们前面add进去的ImportBeanDefinitionRegistrar的，因此它会在此处开始执行了
	for (ConfigurationClass configClass : configurationModel) {
		loadBeanDefinitionsForConfigurationClass(configClass, trackedConditionEvaluator);
	}
}

// 这个方法很重要：它处理了多种方式（@Bean、实现接口类注册等等）完成向容器里注册Bean定义信息
private void loadBeanDefinitionsForConfigurationClass(
		ConfigurationClass configClass, TrackedConditionEvaluator trackedConditionEvaluator) {
	
	// 如果这咯Config不需要被解析，做一些清理、移除的操作~~~~
	if (trackedConditionEvaluator.shouldSkip(configClass)) {
		String beanName = configClass.getBeanName();
		if (StringUtils.hasLength(beanName) && this.registry.containsBeanDefinition(beanName)) {
			this.registry.removeBeanDefinition(beanName);
		}
		this.importRegistry.removeImportingClass(configClass.getMetadata().getClassName());
		return;
	}

///稍微注意一下Spring处理这些Bean定义的顺序，在某些判断逻辑中或许能用到///
	
	// 如果是被单纯@Import进来的，这个值是true的，默认值是false哦
	if (configClass.isImported()) {
		// 这个处理源码这里不分析了，比较简单。支持@Scope、@Lazy、@Primary、@DependsOn、@Role、@Description等等一些通用的基本属性
		registerBeanDefinitionForImportedConfigurationClass(configClass);
	}
	
	//处理方法上的@Bean 解析@Bean上面各种属性值。也处理上面提到的那些通用注解@Lazy等等吧
	//这里面只说一个内部比较重要的方法isOverriddenByExistingDefinition(beanMethod, beanName)  
	// 该方法目的主要是去重。其实如果是@Configuration里面Bean重名了，IDEA类似工具发现，但是无法判断xml是否也存在（注意，发现归发现，但并不是编译报错哦~~~）
	// 它的处理策略为：若来自同一个@Configuration配置类，那就保留之前的。若来自不同配置类，那就覆盖
	for (BeanMethod beanMethod : configClass.getBeanMethods()) {
		loadBeanDefinitionsForBeanMethod(beanMethod);
	}
	//处理@ImportResource，里面解析xml就是上面说到的解析xml的XmlBeanDefinitionReader
	//所以，咱们@Configuration和xml是可以并行使用的
	loadBeanDefinitionsFromImportedResources(configClass.getImportedResources());
	
	// 最后，这里就是咱们今天的主菜了：解析咱们的ImportBeanDefinitionRegistrars
	// configClass.getImportBeanDefinitionRegistrars()：就是我们上面异步add进去的那些注册器们
	loadBeanDefinitionsFromRegistrars(configClass.getImportBeanDefinitionRegistrars());
}
```

loadBeanDefinitionsFromRegistrars完整解析：

```java
// 没什么多余的代码  所有的注册逻辑（哪些Bean需要注册，哪些不需要之类的，全部交给子类去实现）
// 用处：上面有提到，比如@MapperScan这种批量扫描的===
private void loadBeanDefinitionsFromRegistrars(Map<ImportBeanDefinitionRegistrar, AnnotationMetadata> registrars) {
	registrars.forEach((registrar, metadata) ->
			registrar.registerBeanDefinitions(metadata, this.registry));
}
```

应用场景分析

根据各个接口的特点，有各自的应用场景。因为直接@Import普通类的场景相对较少，这里主要说说实现接口的方式的场景：

**ImportSelector接口应用场景**

AdviceModeImportSelector：它是个抽象类。（实现类有出名的AsyncConfigurationSelector、CachingConfigurationSelector等，因为都是基于代理来做的，所以都继承了此抽象）。

它拿到泛型类型（比如@EnableAsync或者@EnableCaching），然后解析注解为AnnotationAttributes，最后由子类去实现select逻辑（具体要向容器注入的Class全类名）,比如注入ProxyAsyncConfiguration，或者其它的。

总之，像这种还不能决定去注入哪个处理器（如果你能决定，那就直接@Import那个类好了，没必要实现接口了嘛），然后可以实现此接口，写出一些判断逻辑，不同的配置情况注入不同的处理类。

**DeferredImportSelector接口应用场景**

它和上面只是执行的时机不同。在Spring内部没有应用，但是在Spring Boot中却有大量的应用，比如：AutoConfigurationImportSelector、EnableCircuitBreakerImportSelector等等。

实现这个接口的基本思想是：默认处理（以用户配置的为准，若用户没管，那就执行我的默认配置呗）。执行生效的一个先后顺序的简单控制

**ImportBeanDefinitionRegistrar接口应用场景**

它的应用场景特别的有用，因此也是最常使用的。因为它直接可以向工厂里注册Bean的定义信息（当然也可以拿出来Bean定义信息，做出对应的修改）

下面两个实现，都和@EnableAspectJAutoProxy注解相关：

- AspectJAutoProxyRegistrar：它能解析注解的时候，从BeanFactory拿出指定的Bean，设置一些参数值等等
- AutoProxyRegistrar：自动代理的注册器。它和上面的区别在于它和代理的类型无关（它可以指定mode类型），而上面是表示就是用AspectJ来做切面代理。

实现它的基本思想是：当自己需要操作BeanFactory里面的Bean的时候，那就必须只有它才能做到了。而且它还有个方便的地方，那就是做包扫描的时候，比如@MapperScan类似这种的时候，用它处理更为方便（因为扫描到了直接注册即可）。

> @Mapper的扫描依赖于ClassPathMapperScanner，它由mybatis-spring提供。它继承于ClassPathBeanDefinitionScanner，由Spring底层提供

总结

注意，完成了所有的这些注解、配置文件的解析，Bean们都还只是被加载了，还没有加入到Bean的定义信息里面，更别谈实例化了。要加入到Bean的定义信息里面存储好，还得这一步：

```java
//configClasses就是parser.parse(candidates);上面解析完成了的配置类
//根据这些已经解析好了的配置类，由这个ConfigurationClassBeanDefinitionReader去加载Bean定义信息
this.reader.loadBeanDefinitions(configClasses);
```

|   |
|---|
|参考：<br><br>- [【小家Spring】Spring向容器注册Bean的高级应用：@Import、DeferredImportSelector、ImportBeanDefinitionRegistrar的使用](https://fangshixiang.blog.csdn.net/article/details/88554592)|

  

