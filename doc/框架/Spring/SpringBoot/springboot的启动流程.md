![image.png](https://gitee.com/ycfan/images/raw/master/img/20231218150541.png)


1、当启动springboot应用程序的时候，会先创建SpringApplication的对象，在对象的构造方法中会进行某些参数的初始化工作，最主要的是判断当前应用程序的类型以及初始化器和监听器，在这个过程中会加载整个应用程序中的spring.factories文件，将文件的内容放到缓存对象中，方便后续获取

2、SpringApplication对象创建完成之后，开始执行run方法，来完成整个启动，启动过程中最主要的有两个方法，第一个叫做prepareContext，第二个叫做refreshcontext,在这两个关键步骤中完整了自动装配的核心功能，前面的处理逻辑包含了上下文对象的创建，banner的打印，异常报告器的准备等各个准备工作，方便后续来进行调用。

3、茌prepareContext方法中主要完成的是对上下文对象的初始化操作，包括了属性值的设置，比如环境对象，在整个过程中有一个非常重要的方法，叫做load，将当前启动类做为一个beanDefinition注册到registry中，方便后续在进行BeanFactoryPostProcessor调用执行的时候，找到对应的主类，来完成@SpringBootApplicaiton,@EnableAutoConfiguration等注解的解析工作

4、在refreshcontext方法中会进行整个容器刷新过程，会调用中spring中的refresh方法，refresh中有13个非常关键的方法，来完成整个spring应用程序的启动，在自动装配过程中，会调用invokeBeanFactoryPostProcessor方法，在此方法中主要是对ConfigurationClassPostProcessor类的处理，它是BFPP的子类也是BDRPP的子类，在调用的时候会先调用BDRPP中的postProcessBeanDefinitionRegistry方法，然后调用postProcessBeanfactory方法，在执行postProcesseanDefinitionRegistry的时候回解析处理各种注解，包含@PropertySource,@componentscan,@Componentscans，@Bean,@lmport等注解，最主要的是@Import注解的解析

5、在解析@lmport注解的时候，会有一个getlmports的方法，从主类开始递归解析注解，把所有包含@lmport的注解都解析到，然后在processlmport方法中对lmport的类进行分类，此处主要识别的时候AutoConfigurationlmportselect归属于Importselect的子类，在后续过程中会调用deferredlmportSelectorHandler中的process方法，来完整EnableAutoConfiguration的加载
```java
public AnnotationConfigServletWebServerApplicationContext() {
	// 这里会注册ConfigurationClassPostProcessor
	this.reader = new AnnotatedBeanDefinitionReader(this);
	this.scanner = new ClassPathBeanDefinitionScanner(this);
}

```



# [SpringBoot自动配置原理](https://www.cnblogs.com/Xianhuii/p/17105291.html)

传统的Spring项目，需要我们对每个引入的组件进行手动配置。

这需要开发者对组件有深入的了解，否则很容易遗漏某些细节。对于业务开发人员/公司来说，他们只需要知道如何使用组件即可，不需要过多了解底层配置原理。如果有多个项目，则需要将配置进行多次拷贝，会增大无意义的工作量。

实际上，每个第三方组件的配置都是相对固定的，只有其中一些参数可能需要根据运行环境进行修改。例如`spring-mvc`有它自己的一套配置，`spring-mybatis`也有它自己的一套配置。我们可以将这些第三方组件的基础配置抽取出来，通过配置文件动态修改其中的运行参数。后续需要重复使用时，只需要将相同的基础依赖，可以大大减小重复开发的工作量。

另一方面，组件开发者肯定要比我们这些使用者更加熟悉底层细节。因此，最稳妥的方法是由组件开发者去抽象对应组件的基础配置。我们使用者只需要熟悉组件暴露的配置文件即可。这些由组件开发者抽象出的基础配置，在Spring Boot中就是`starter`。

Spring Boot就是为了解决上述问题而开发出来的。它提供自动配置的`SPI`机制，制定了从`starter`读取配置的规则。第三方组件根据规则编写基础配置信息。后续引入依赖时，我们只要开启`EnableAutoConfiguration`注解，Spring Boot会根据SPI规则读取配置。

[![](https://img2023.cnblogs.com/blog/2078841/202302/2078841-20230209145026973-589094636.png)](https://img2023.cnblogs.com/blog/2078841/202302/2078841-20230209145026973-589094636.png)

上图Spring Boot自动配置`SPI`机制的相关类图，主要可以分为3个模块：

1. `ConfigurationClassPostProcessor`：基于`@Configuration`的`BeanFactoryPostProcessor`。
2. `AutoConfigurationImportSelector`：注册指定目录文件中的配置类。
3. `Registrar`：注册指定路径下的类。

Spring Boot自动配置的`SPI`机制原理基于`ConfigurationClassPostProcessor`，它是一个`BeanFactoryPostProcessor`，会在读取依赖配置后，对配置类`BeanDefinition`进行处理。自动配置机制使用了其中的`@Import`功能。

`@Import`注解可以注册指定依赖配置：

1. `ImportSelector`：根据选择规则注册。
2. `ImportBeanDefinitionRegistrar`：注册额外依赖配置。
3. 其他：作为配置类注册。

通过`org.springframework.boot.autoconfigure.AutoConfigurationPackages.Registrar`和`org.springframework.boot.autoconfigure.AutoConfigurationImportSelector`，自动配置`SPI`机制会自动注册以下依赖：

1. 标注`@EnableAutoConfiguration`注解的配置类所在包下的所有注解依赖。
2. 注册`META-INF/spring.factories`中键为`org.springframework.boot.autoconfigure.EnableAutoConfiguration`的类。
3. 注册`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`中的所有类。

对于`starter`来说，它只需要定义要相关配置，然后在`META-INF/spring.factories`或`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`中指定配置类就可以了。

# 1 @EnableAutoConfiguration详解[#](https://www.cnblogs.com/Xianhuii/p/17105291.html#1-enableautoconfiguration%E8%AF%A6%E8%A7%A3)

`@EnableAutoConfiguration`可以开启Spring Boot的自动注册功能，由于它基于`ConfigurationClassPostProcessor`，所以需要同时添加`@Configuration`注解：

```java
@Configuration
@EnableAutoConfiguration
public class AppConfig {
}
```

`@EnableAutoConfiguration`核心源码如下，它会使用`AutoConfigurationImportSelector`，注册`META-INF/spring.factories`和`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`中的类。：

```java
@AutoConfigurationPackage  
@Import(AutoConfigurationImportSelector.class)  
public @interface EnableAutoConfiguration {  
   // environment变量是否可以覆盖starter中的配置变量
   String ENABLED_OVERRIDE_PROPERTY = "spring.boot.enableautoconfiguration";  
   // 指定排除的类
   Class<?>[] exclude() default {};  
   // 指定排除的类名
   String[] excludeName() default {};  
}
```

元注解`@AutoConfigurationPackage`的核心源码如下，默认会扫描标注该注解的类所在的包路径：

```java
@Import(AutoConfigurationPackages.Registrar.class)  
public @interface AutoConfigurationPackage {  
   // 指定扫描包路径
   String[] basePackages() default {};  
   // 指定类，会扫描该类所在包路径
   Class<?>[] basePackageClasses() default {};  
}
```

需要注意的是，我们通常不会直接使用`@EnableAutoConfiguration`，而是使用集成自动配置功能的`@SpringBootApplication`，它与自动配置相关的核心源码如下：

```java
@SpringBootConfiguration  // 集成@Configuration功能
@EnableAutoConfiguration  
@ComponentScan(excludeFilters = { @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),  
      @Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })  
public @interface SpringBootApplication {  
   // 指定自动配置的排除类
   @AliasFor(annotation = EnableAutoConfiguration.class)  
   Class<?>[] exclude() default {};  
   // 指定自动配置的排除类名
   @AliasFor(annotation = EnableAutoConfiguration.class)  
   String[] excludeName() default {};  
}
```

# 2 自动注册SPI机制原理[#](https://www.cnblogs.com/Xianhuii/p/17105291.html#2-%E8%87%AA%E5%8A%A8%E6%B3%A8%E5%86%8Cspi%E6%9C%BA%E5%88%B6%E5%8E%9F%E7%90%86)

## 2.1 @Import功能[#](https://www.cnblogs.com/Xianhuii/p/17105291.html#21-import%E5%8A%9F%E8%83%BD)

`@Import`是`ConfigurationClassPostProcessor`针对`@Configuration`配置类提供的增强功能，具体原理可以查看相关文章（[@Configuration的基本使用和工作原理](https://www.cnblogs.com/Xianhuii/p/17090626.html)），这里主要介绍@Import的相关原理。

`ConfigurationClassParser#processImports()`定义了具体导入流程：

```java
private void processImports(ConfigurationClass configClass, SourceClass currentSourceClass,  
      Collection<SourceClass> importCandidates, Predicate<String> exclusionFilter,  
      boolean checkForCircularImports) {  
  
   if (importCandidates.isEmpty()) {  
      return;  
   }  
  
   if (checkForCircularImports && isChainedImportOnStack(configClass)) {  
      this.problemReporter.error(new CircularImportProblem(configClass, this.importStack));  
   }  
   else {  
      this.importStack.push(configClass);  
      try {  
         for (SourceClass candidate : importCandidates) {  
            // ImportSelector导入流程
            if (candidate.isAssignable(ImportSelector.class)) {  
               // Candidate class is an ImportSelector -> delegate to it to determine imports  
               Class<?> candidateClass = candidate.loadClass();  
               ImportSelector selector = ParserStrategyUtils.instantiateClass(candidateClass, ImportSelector.class,  
                     this.environment, this.resourceLoader, this.registry);  
               Predicate<String> selectorFilter = selector.getExclusionFilter();  
               if (selectorFilter != null) {  
                  exclusionFilter = exclusionFilter.or(selectorFilter);  
               }  
               if (selector instanceof DeferredImportSelector) {  
                  this.deferredImportSelectorHandler.handle(configClass, (DeferredImportSelector) selector);  
               }  
               else {  
                  String[] importClassNames = selector.selectImports(currentSourceClass.getMetadata());  
                  Collection<SourceClass> importSourceClasses = asSourceClasses(importClassNames, exclusionFilter);  
                  processImports(configClass, currentSourceClass, importSourceClasses, exclusionFilter, false);  
               }  
            }  
            // ImportBeanDefinitionRegistrar导入流程
            else if (candidate.isAssignable(ImportBeanDefinitionRegistrar.class)) {  
               // Candidate class is an ImportBeanDefinitionRegistrar ->  
               // delegate to it to register additional bean definitions               
               Class<?> candidateClass = candidate.loadClass();  
               ImportBeanDefinitionRegistrar registrar =  
                     ParserStrategyUtils.instantiateClass(candidateClass, ImportBeanDefinitionRegistrar.class,  
                           this.environment, this.resourceLoader, this.registry);  
               configClass.addImportBeanDefinitionRegistrar(registrar, currentSourceClass.getMetadata());  
            }  
            // 配置类导入流程
            else {  
               // Candidate class not an ImportSelector or ImportBeanDefinitionRegistrar ->  
               // process it as an @Configuration class               
               this.importStack.registerImport(  
                     currentSourceClass.getMetadata(), candidate.getMetadata().getClassName());  
               processConfigurationClass(candidate.asConfigClass(configClass), exclusionFilter);  
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
         this.importStack.pop();  
      }  
   }  
}
```

### 2.1.1 DeferredImportSelector[#](https://www.cnblogs.com/Xianhuii/p/17105291.html#211-deferredimportselector)

对于`DeferredImportSelector`，导入入口位于`ConfigurationClassParser.DeferredImportSelectorHandler#handle()`：

```java
public void handle(ConfigurationClass configClass, DeferredImportSelector importSelector) {  
   DeferredImportSelectorHolder holder = new DeferredImportSelectorHolder(configClass, importSelector);  
   if (this.deferredImportSelectors == null) {  
      DeferredImportSelectorGroupingHandler handler = new DeferredImportSelectorGroupingHandler();  
      handler.register(holder);  
      // 实际导入逻辑
      handler.processGroupImports();  
   }  
   else {  
      this.deferredImportSelectors.add(holder);  
   }  
}
```

它会从DeferredImportSelector实现类中获取需要导入的类，然后继续按照按ImportSelector、ImportBeanDefinitionRegistrar和配置类递归进行导入。`ConfigurationClassParser.DeferredImportSelectorGroupingHandler#processGroupImports()`：

```java
public void processGroupImports() {  
   for (DeferredImportSelectorGrouping grouping : this.groupings.values()) {  
      Predicate<String> exclusionFilter = grouping.getCandidateFilter();  
      // 获取分组导入的类，递归进行导入（按ImportSelector、ImportBeanDefinitionRegistrar和配置类）
      grouping.getImports().forEach(entry -> {  
         ConfigurationClass configurationClass = this.configurationClasses.get(entry.getMetadata());  
         try {  
            processImports(configurationClass, asSourceClass(configurationClass, exclusionFilter),  
                  Collections.singleton(asSourceClass(entry.getImportClassName(), exclusionFilter)),  
                  exclusionFilter, false);  
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
}
```

`ConfigurationClassParser.DeferredImportSelectorGrouping#getImports()`中会对每个分组进行处理，然后再获取配置类：

```java
public Iterable<Group.Entry> getImports() {  
   for (DeferredImportSelectorHolder deferredImport : this.deferredImports) {  
      // 执行分组规则
      this.group.process(deferredImport.getConfigurationClass().getMetadata(),  
            deferredImport.getImportSelector());  
   }  
   // 获取分组的导入配置
   return this.group.selectImports();  
}
```

### 2.1.2 ImportBeanDefinitionRegistrar[#](https://www.cnblogs.com/Xianhuii/p/17105291.html#212-importbeandefinitionregistrar)

对于`ImportBeanDefinitionRegistrar`，它会调用实现类的`ImportBeanDefinitionRegistrar#registerBeanDefinitions()`方法进行注册：

```java
default void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {  
}
```

## 2.2 AutoConfigurationImportSelector[#](https://www.cnblogs.com/Xianhuii/p/17105291.html#22-autoconfigurationimportselector)

### 2.2.1 执行导入规则[#](https://www.cnblogs.com/Xianhuii/p/17105291.html#221-%E6%89%A7%E8%A1%8C%E5%AF%BC%E5%85%A5%E8%A7%84%E5%88%99)

在导入配置时，会先执行导入规则，从`META-INF/spring.factories`和`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`中读取需要注册的类。

具体入口位于`AutoConfigurationImportSelector.AutoConfigurationGroup#process()`方法：

```java
public void process(AnnotationMetadata annotationMetadata, DeferredImportSelector deferredImportSelector) {  
   // 获取目录文件中的类
   AutoConfigurationEntry autoConfigurationEntry = ((AutoConfigurationImportSelector) deferredImportSelector)  
         .getAutoConfigurationEntry(annotationMetadata);  
   // 添加到缓存
   this.autoConfigurationEntries.add(autoConfigurationEntry);  
   for (String importClassName : autoConfigurationEntry.getConfigurations()) {  
      this.entries.putIfAbsent(importClassName, annotationMetadata);  
   }  
}
```

`AutoConfigurationImportSelector#getAutoConfigurationEntry()`方法获取导入配置信息：

```java
protected AutoConfigurationEntry getAutoConfigurationEntry(AnnotationMetadata annotationMetadata) {  
   if (!isEnabled(annotationMetadata)) {  
      return EMPTY_ENTRY;  
   }  
   AnnotationAttributes attributes = getAttributes(annotationMetadata);  
   // 获取指定目录文件中的所有类名
   List<String> configurations = getCandidateConfigurations(annotationMetadata, attributes);  
   // 去重
   configurations = removeDuplicates(configurations);  
   // 去除需要排除的类名
   Set<String> exclusions = getExclusions(annotationMetadata, attributes);  
   checkExcludedClasses(configurations, exclusions);  
   configurations.removeAll(exclusions);  
   // 过滤类名
   configurations = getConfigurationClassFilter().filter(configurations);  
   // 出发自动配置导入事件
   fireAutoConfigurationImportEvents(configurations, exclusions);  
   return new AutoConfigurationEntry(configurations, exclusions);  
}
```

核心代码位于`AutoConfigurationImportSelector#getCandidateConfigurations()`方法，会使用`SPI`机制从`META-INF/spring.factories`和`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`获取需要导入的类：

```java
protected List<String> getCandidateConfigurations(AnnotationMetadata metadata, AnnotationAttributes attributes) {  
   // 导入META-INF/spring.factories中键为org.springframework.boot.autoconfigure.EnableAutoConfiguration的类
   List<String> configurations = new ArrayList<>(  
         SpringFactoriesLoader.loadFactoryNames(getSpringFactoriesLoaderFactoryClass(), getBeanClassLoader()));  
   // 导入META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports中的类
   ImportCandidates.load(AutoConfiguration.class, getBeanClassLoader()).forEach(configurations::add);   
   return configurations;  
}
```

对于`SpringFactoriesLoader#loadFactoryNames()`，它会读取`META-INF/spring.factories`中的指定键的所有值：

```java
public static List<String> loadFactoryNames(Class<?> factoryType, @Nullable ClassLoader classLoader) {  
   ClassLoader classLoaderToUse = classLoader;  
   if (classLoaderToUse == null) {  
      classLoaderToUse = SpringFactoriesLoader.class.getClassLoader();  
   }  
   String factoryTypeName = factoryType.getName();  
   return loadSpringFactories(classLoaderToUse).getOrDefault(factoryTypeName, Collections.emptyList());  
}
```

对于`ImportCandidates#load()`，它会读取`META-INF/spring/%s.imports`中的所有值：

```java
public static ImportCandidates load(Class<?> annotation, ClassLoader classLoader) {  
   Assert.notNull(annotation, "'annotation' must not be null");  
   ClassLoader classLoaderToUse = decideClassloader(classLoader);  
   String location = String.format(LOCATION, annotation.getName());  
   Enumeration<URL> urls = findUrlsInClasspath(classLoaderToUse, location);  
   List<String> importCandidates = new ArrayList<>();  
   while (urls.hasMoreElements()) {  
      URL url = urls.nextElement();  
      importCandidates.addAll(readCandidateConfigurations(url));  
   }  
   return new ImportCandidates(importCandidates);  
}
```

### 2.2.2 获取自动导入配置[#](https://www.cnblogs.com/Xianhuii/p/17105291.html#222-%E8%8E%B7%E5%8F%96%E8%87%AA%E5%8A%A8%E5%AF%BC%E5%85%A5%E9%85%8D%E7%BD%AE)

通过`AutoConfigurationImportSelector.AutoConfigurationGroup#selectImports()`方法，可以获取处理后的自动导入配置：

```java
public Iterable<Entry> selectImports() {  
   if (this.autoConfigurationEntries.isEmpty()) {  
      return Collections.emptyList();  
   }  
   // 过滤
   Set<String> allExclusions = this.autoConfigurationEntries.stream()  
         .map(AutoConfigurationEntry::getExclusions).flatMap(Collection::stream).collect(Collectors.toSet());  
   Set<String> processedConfigurations = this.autoConfigurationEntries.stream()  
         .map(AutoConfigurationEntry::getConfigurations).flatMap(Collection::stream)  
         .collect(Collectors.toCollection(LinkedHashSet::new));  
   processedConfigurations.removeAll(allExclusions);  
  
   // 排序并返回
   return sortAutoConfigurations(processedConfigurations, getAutoConfigurationMetadata()).stream()  
         .map((importClassName) -> new Entry(this.entries.get(importClassName), importClassName))  
         .collect(Collectors.toList());  
}
```

## 2.3 AutoConfigurationPackages.Registrar[#](https://www.cnblogs.com/Xianhuii/p/17105291.html#23-autoconfigurationpackagesregistrar)

`AutoConfigurationPackages.Registrar`是`ImportBeanDefinitionRegistrar`实现类，所以会通过`AutoConfigurationPackages.Registrar#registerBeanDefinitions()`方法注册：

```java
public void registerBeanDefinitions(AnnotationMetadata metadata, BeanDefinitionRegistry registry) {  
   register(registry, new PackageImports(metadata).getPackageNames().toArray(new String[0]));  
}
```

它会调用`AutoConfigurationPackages#register()`方法扫描指定包路径：

```java
public static void register(BeanDefinitionRegistry registry, String... packageNames) {  
   if (registry.containsBeanDefinition(BEAN)) {  
      BasePackagesBeanDefinition beanDefinition = (BasePackagesBeanDefinition) registry.getBeanDefinition(BEAN);  
      beanDefinition.addBasePackages(packageNames);  
   }  
   else {  
      registry.registerBeanDefinition(BEAN, new BasePackagesBeanDefinition(packageNames));  
   }  
}
```

`PackageImports`会从`@AutoConfigurationPackage`的属性中获取包路径，如果没有指定注解属性，则会获取标注该注解的类所在的包路径：

```java
PackageImports(AnnotationMetadata metadata) {  
   // 获取注解属性
   AnnotationAttributes attributes = AnnotationAttributes  
         .fromMap(metadata.getAnnotationAttributes(AutoConfigurationPackage.class.getName(), false));  
   // 获取注解中的包路径
   List<String> packageNames = new ArrayList<>(Arrays.asList(attributes.getStringArray("basePackages")));  
   for (Class<?> basePackageClass : attributes.getClassArray("basePackageClasses")) {  
      packageNames.add(basePackageClass.getPackage().getName());  
   }  
   // 没有指定包路径，获取标注类的包路径
   if (packageNames.isEmpty()) {  
      packageNames.add(ClassUtils.getPackageName(metadata.getClassName()));  
   }  
   this.packageNames = Collections.unmodifiableList(packageNames);  
}
```

# 3 总结[#](https://www.cnblogs.com/Xianhuii/p/17105291.html#3-%E6%80%BB%E7%BB%93)

自动配置`SPI`功能是Spring Boot引入第三方组件的基础，也是它如此便利的根本原因。

在学习第三方组件时，可以首先看它的`META-INF/spring.factories`和`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`文件，这是它们的入口。

在创建自己的`starter`，也可以使用这个机制，既遵守官方标准，又方便使用。

自动配置基于`SPI`机制，是SPI的灵活应用（类似的还有JDBC的`DriverManager`）。我们在日常项目中也可以参照它实现逻辑，进行设计和开发。

