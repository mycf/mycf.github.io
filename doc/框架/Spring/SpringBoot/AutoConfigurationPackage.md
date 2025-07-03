直接打开代码看下作用
```java
@Import(AutoConfigurationPackages.Registrar.class)
public @interface AutoConfigurationPackage {
```

上面代码看到`@Import`，我们就直接去查看`AutoConfigurationPackages.Registrar.class`
```java
static class Registrar implements ImportBeanDefinitionRegistrar, DeterminableImports {

	@Override
	public void registerBeanDefinitions(AnnotationMetadata metadata, BeanDefinitionRegistry registry) {
		register(registry, new PackageImports(metadata).getPackageNames().toArray(new String[0]));
	}

```
这里直接断点看下，传入的是我们启动类的metadata，所以得到的是我们启动类的包名
![image.png](https://gitee.com/ycfan/images/raw/master/img/20231225221045.png)
还是看一下源码吧，获取`AutoConfigurationPackage`的注解`basePackageClasses`，使用了默认配置所有为空，下面使用了启动类的包名
![image.png](https://gitee.com/ycfan/images/raw/master/img/20231225221444.png)

这里可以看到注册了一个`BasePackages`的bean
```java
public static void register(BeanDefinitionRegistry registry, String... packageNames) {
	if (registry.containsBeanDefinition(BEAN)) {
		addBasePackages(registry.getBeanDefinition(BEAN), packageNames);
	}
	else {
		RootBeanDefinition beanDefinition = new RootBeanDefinition(BasePackages.class);
		beanDefinition.setRole(BeanDefinition.ROLE_INFRASTRUCTURE);
		addBasePackages(beanDefinition, packageNames);
		registry.registerBeanDefinition(BEAN, beanDefinition);
	}
}

```
可以看到`BasePackages`这个bean把启动类包名传入构造函数中
```java
private static void addBasePackages(BeanDefinition beanDefinition, String[] additionalBasePackages) {
	ConstructorArgumentValues constructorArgumentValues = beanDefinition.getConstructorArgumentValues();
	if (constructorArgumentValues.hasIndexedArgumentValue(0)) {
		String[] existingPackages = (String[]) constructorArgumentValues.getIndexedArgumentValue(0, String[].class)
			.getValue();
		constructorArgumentValues.addIndexedArgumentValue(0,
				Stream.concat(Stream.of(existingPackages), Stream.of(additionalBasePackages))
					.distinct()
					.toArray(String[]::new));
	}
	else {
		constructorArgumentValues.addIndexedArgumentValue(0, additionalBasePackages);
	}
}

```

看下`BasePackages`的源码，看到里面头部的注释还有要打印的日志，可以看出作为默认包扫描的路径
```java
/**
 * Holder for the base package (name may be null to indicate no scanning).
 */
static final class BasePackages {

	private final List<String> packages;

	private boolean loggedBasePackageInfo;

	BasePackages(String... names) {
		List<String> packages = new ArrayList<>();
		for (String name : names) {
			if (StringUtils.hasText(name)) {
				packages.add(name);
			}
		}
		this.packages = packages;
	}

	List<String> get() {
		if (!this.loggedBasePackageInfo) {
			if (this.packages.isEmpty()) {
				if (logger.isWarnEnabled()) {
					logger.warn("@EnableAutoConfiguration was declared on a class "
							+ "in the default package. Automatic @Repository and "
							+ "@Entity scanning is not enabled.");
				}
			}
			else {
				if (logger.isDebugEnabled()) {
					String packageNames = StringUtils.collectionToCommaDelimitedString(this.packages);
					logger.debug("@EnableAutoConfiguration was declared on a class in the package '" + packageNames
							+ "'. Automatic @Repository and @Entity scanning is enabled.");
				}
			}
			this.loggedBasePackageInfo = true;
		}
		return this.packages;
	}

}

```

直接搜一下用到的代码，可以看出只用在了外部的jar包里面。
<mark>!!!所以说这个注解不是把我们当前包下所有带有 @Bean 注解的方法注册到组件中。</mark>
那当前包作为扫描路径是哪里做的呢？
![image.png](https://gitee.com/ycfan/images/raw/master/img/20231225222612.png)
