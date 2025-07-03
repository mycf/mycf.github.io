

# 简介
`@ConfigurationProperties` 注解的作用是将配置文件中的属性值绑定到 Spring Boot 应用程序中的对象上。

具体来说，`@ConfigurationProperties` 注解可以用于标注一个类或者类的字段，表示这个类或字段是用于接收配置属性值的对象。

使用 `@ConfigurationProperties` 注解时，需要指定一个前缀，用于匹配配置文件中的属性。注解的值可以是一个字符串，表示配置属性的前缀，或者是一个数组，表示多个前缀。

当 Spring Boot 启动时，会自动将配置文件中以指定前缀开头的属性值绑定到带有 `@ConfigurationProperties` 注解的对象上。属性值的绑定是根据对象的属性名称和配置文件中的属性名称进行匹配的。

通过 `@ConfigurationProperties` 注解，可以实现以下功能：

1. 集中管理配置：将应用程序的配置属性集中管理，统一注入到相应的对象中，便于维护和修改。
2. 类型安全的属性绑定：属性值会自动进行类型转换，确保绑定的属性值与目标对象的属性类型匹配。
3. 支持复杂的属性结构：可以处理嵌套属性、集合属性等复杂的属性结构，实现更灵活的配置。
4. 支持属性验证和校验：通过注解和验证器，可以对绑定的属性进行验证和校验，确保属性值的合法性。

通过使用 `@ConfigurationProperties` 注解，可以轻松地将配置文件中的属性值注入到应用程序中的对象中，实现了配置的集中管理和便捷的属性绑定。
# 松散绑定
Relaxed Binding: 绑定的属性不需要严格的和配置文件当中一致。
@ConfigwrationProperties注解，prefix (value): 只能是中横线和小写字母，中横线不能是开头
配置文件可以使用大写字母，小写字母，中横线，下划线以及空格

```yml
tomcat:
	hostName: server1
	host_ip: localhost
	host-port: 8080
	"host desc": 我是tomcat
```

```java
@ConfigurationProperties(prefix = "tomcat")
@Data
public class Tomcat {
	private String hostName;
	private String hostIp;
	private String hostPort;
	private String hostDesc;
}
```

`EnableConfigurationProperties`
```java
@Import(EnableConfigurationPropertiesRegistrar.class)
public @interface EnableConfigurationProperties {
```


```java
class EnableConfigurationPropertiesRegistrar implements ImportBeanDefinitionRegistrar {

	@Override
	public void registerBeanDefinitions(AnnotationMetadata metadata, BeanDefinitionRegistry registry) {
		registerInfrastructureBeans(registry);
		registerMethodValidationExcludeFilter(registry);
		ConfigurationPropertiesBeanRegistrar beanRegistrar = new ConfigurationPropertiesBeanRegistrar(registry);
		getTypes(metadata).forEach(beanRegistrar::register);
	}

```

```java
static void registerInfrastructureBeans(BeanDefinitionRegistry registry) {
	// ConfigurationPropertiesBindingPostProcessor` 是一个后置处理器，用于处理配置属性绑定的过程。
	ConfigurationPropertiesBindingPostProcessor.register(registry);
	// 用于管理和维护已绑定的配置属性
	BoundConfigurationProperties.register(registry);
}
```


