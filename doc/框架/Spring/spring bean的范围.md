在Spring框架中，Bean的范围（Scope）定义了Bean对象的生命周期和可见性。Spring框架提供了以下几种常见的Bean范围：

1. Singleton（单例）：在整个应用程序中只存在一个Bean实例。Spring容器仅创建一个Bean对象，并将其重用于所有对该Bean的请求。

2. Prototype（原型）：每次请求Bean时，Spring容器都会创建一个新的Bean实例。每个请求都会返回一个独立的Bean对象。

3. Request（请求）：每个HTTP请求都会创建一个新的Bean实例，该实例仅在当前请求的范围内可见。适用于Web应用程序。

4. Session（会话）：每个用户会话（Session）都会创建一个新的Bean实例，该实例仅在当前用户会话范围内可见。适用于Web应用程序。

5. Global Session（全局会话）：仅适用于基于Portlet的Web应用程序，它表示整个应用程序的全局会话范围。

除了以上常见的范围之外，Spring还允许自定义Bean的范围，通过实现`org.springframework.beans.factory.config.Scope`接口来定义自定义范围。

要指定Bean的范围，可以使用Spring的注解或XML配置。使用注解时，可以在Bean定义上使用`@Scope`注解，并指定范围类型。例如：

```java
@Component
@Scope("prototype")
public class MyBean {
    // Bean的定义
}
```

使用XML配置时，可以在Bean定义中使用`<bean>`元素的`scope`属性来指定范围。例如：

```xml
<bean id="myBean" class="com.example.MyBean" scope="prototype">
    <!-- Bean的定义 -->
</bean>
```

通过设置合适的Bean范围，可以控制Bean对象的生命周期和可见性，以满足应用程序的需求。
