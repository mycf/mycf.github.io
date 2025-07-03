`org.springframework.context.annotation.EnableAspectJAutoProxy` 注解提供了多个属性，用于配置和控制AspectJ的自动代理行为。下面是各个属性的详细作用：

1. `proxyTargetClass`（默认值：`false`）：
   - 作用：指定是否使用CGLIB代理而不是默认的JDK动态代理。
   - 如果设置为 `true`，Spring将使用CGLIB代理来创建代理对象，即使目标类没有实现接口。
   - 如果设置为 `false`，Spring将使用JDK动态代理来创建代理对象，仅支持实现了接口的目标类。

2. `exposeProxy`（默认值：`false`）：
   - 作用：指定是否将当前代理对象暴露给AopContext，以便在切面内部进行自我调用。
   - 如果设置为 `true`，Spring会将当前的代理对象暴露给AopContext，切面内部可以通过 `AopContext.currentProxy()` 方法获取当前的代理对象。
   - 如果设置为 `false`，切面内部的自我调用将直接执行目标对象的方法，而不会经过切面的拦截逻辑。

需要注意的是，`org.springframework.context.annotation.EnableAspectJAutoProxy` 注解通常与 `@Configuration` 注解一起使用，用于启用AspectJ的自动代理功能。使用时，可以根据需要配置以上属性来自定义代理行为。

`org.springframework.context.annotation.EnableAspectJAutoProxy#proxyTargetClass` 是一个用于配置 Spring 的 `@EnableAspectJAutoProxy` 注解的属性，用于指定是否使用 CGLIB 代理而不是默认的 JDK 动态代理。

在 Spring AOP 中，默认情况下，当目标类实现接口时，Spring 使用 JDK 动态代理来创建代理对象；当目标类没有实现接口时，Spring 使用 CGLIB 代理来创建代理对象。

通过设置 `proxyTargetClass` 属性可以控制在目标类没有实现接口的情况下是否使用 CGLIB 代理。

- 如果将 `proxyTargetClass` 设置为 `true`：
  - 当目标类没有实现接口时，Spring 将使用 CGLIB 代理来创建代理对象。
  - 当目标类实现接口时，Spring 仍然可以使用 CGLIB 代理来创建代理对象，而不是使用 JDK 动态代理。
- 如果将 `proxyTargetClass` 设置为 `false`（默认值）：
  - 当目标类没有实现接口时，Spring 仍然使用 CGLIB 代理来创建代理对象。
  - 当目标类实现接口时，Spring 使用 JDK 动态代理来创建代理对象。

使用 CGLIB 代理可以代理那些没有实现接口的类，而 JDK 动态代理只能代理实现了接口的类。通过设置 `proxyTargetClass` 为 `true`，您可以确保在所有情况下都使用 CGLIB 代理，以便对目标类进行代理处理。

以下是使用 `proxyTargetClass` 属性的示例：

```java
@Configuration
@EnableAspectJAutoProxy(proxyTargetClass = true)
public class AppConfig {
    // 配置其他 Bean...
}
```

在上述示例中，通过将 `proxyTargetClass` 属性设置为 `true`，启用了使用 CGLIB 代理来创建代理对象。

`org.springframework.context.annotation.EnableAspectJAutoProxy#exposeProxy` 是一个用于配置Spring的`@EnableAspectJAutoProxy`注解的属性，用于控制是否将当前代理对象暴露给AopContext，以便在切面内部进行自我调用。

默认情况下，`exposeProxy`属性的值为`false`，即不会将代理对象暴露给AopContext。这意味着在切面内部调用目标对象的方法时，不会经过切面的拦截逻辑，而是直接执行目标对象的方法。这是因为Spring默认使用基于JDK动态代理或CGLIB生成的代理对象，而不是真正的目标对象。

但是，在某些情况下，您可能需要在切面内部通过AopContext访问当前的代理对象，以便在自我调用时也经过切面的拦截逻辑。这时，您可以将`exposeProxy`属性设置为`true`。

当`exposeProxy`属性设置为`true`时，Spring会将当前的代理对象暴露给AopContext。这样，在切面内部通过`AopContext.currentProxy()`方法可以获取到当前的代理对象，并且在自我调用时也会经过切面的拦截逻辑。

以下是使用`exposeProxy`属性的示例：

```java
@Configuration
@EnableAspectJAutoProxy(exposeProxy = true)
public class AppConfig {
    // 配置其他Bean...
}
```

在上述示例中，通过将`exposeProxy`属性设置为`true`，启用了对当前代理对象的暴露。

需要注意的是，为了使用`AopContext.currentProxy()`方法获取当前的代理对象，您还需要确保切面类被Spring容器管理，即切面类需要被声明为一个Bean，并由Spring进行实例化和管理。
