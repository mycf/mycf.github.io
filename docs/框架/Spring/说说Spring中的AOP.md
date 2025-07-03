#面试 
首先说明一点：AOP 并不是 Spring 所特有的，它和 OOP 一样，都是一种编程思想。

AOP，全称 Aspect-Oriented programming，即面向切面编程；而 OOP，全称 Object-Oriented programming，即面向对象编程。AOP 是 OOP 编程思想的一个补充，它在实际编程中，最大的作用就是把系统中公共的逻辑抽取出来，从而让开发者可以更加关注于业务逻辑的开发。

Spring AOP 是基于 Java 中的动态代理实现的，我们知道、Java 的动态代理有两种实现方式：一种是基于 JDK 的动态代理、另外一种则是基于 CGLib 的动态代理。Spring AOP 中的 _ProxyFactory_ 类，在底层对这两种实现方式进行了封装。如果目标类实现了接口，Spring AOP 会默认选择 JDK 的动态代理；否则会选择 CGLib 的动态代理;当然，我们也可以通过配置强制使用 CGLib 的动态代理。

另外，熟悉 Soring IOC 生命周期的小伙伴，应该都清楚：Spring AOP 是在 IOC 的初始化后的阶段进行的。接下来让我们根据源码看下 Spring AOP 的实现流程:
1. 源码位置：[[AbstractAutowireCapableBeanFactory#initializeBean]]。首先让我们看下初始化 bean 的源码中，该方法中会调用applyBeanPostProcessorsAfterinitialization()方法进行初始化后的操作，Spring AOP 就是在该阶段进行的。

2. 源码位置: [[AbstractAutowireCapableBeanFactory#applyBeanPostProcessorsAfterinitialization]]。接下来让我们看下applyBeanPostProcessorsAfterlnitialization 方法，该方法会遍历所有的 BeanPostProcessor，然后调用其postProcessAfterlnitialization 方法。

3. 源码位置:[[AbstractAutoProxyCreator#postProcessAfterinitialization]]。接下来让我们看下 postProcessAfternitialization 方法，该方法中，如果是出现了循环依赖并进行了 AOP，则会直接返回原始对象，否则会进入 wraplfNecessary 方法。该方法就是 正常进行 AOP 的地方。

AOP中的概念
估计会有很多小伙伴和威哥一样，都会觉得 AOP 中的概念十分的生涩难懂!确实，Spring 官网中是这么说的:
>Let us begin by defining some central AOP concepts and terminology. These terms are not Spring-specific. Unfortunately.AOP terminology is not particularly intuitive. However, it would be even more confusing if Spring used its own terminology

翻译过来就是:AOP 中的这些概念不是 Spring 特有的，不幸的是，AOP 中的概念不是特别直观的，但是，如果Spring 重新定义自己的那可能会导致更加混乱。

AOP 中有如下几个概念
1. Aspect：表示切面。比如被 @Aspect 注解的类就是切面，可以在切面中去定义 Pointcut、Advice 等2.Join point:表示连接点。表示一个程序在执行过程中的一个点，比如一个方法的执行，又比如一个异常的处理，在Spring AOP中，一个连接点通常表示一个方法的执行。
3. Advice：表示通知。表示在一个特定连接点上所采取的动作。Advice 分为不同的类型，在很多 AOP 框架中，包括 Spring，会用Interceptor 拦截器来实现 Advice，并且在连接点周围维护一个 Interceptor 链。
4. Pointcut：表示切点。用来匹配一个或多个连接点。
5. Introduction：可以使用 @DeclareParents 注解来给所匹配的类添加一个接口，并指定一个默认实现。
6. Target object：目标对象，即被代理对象。
7. AOP proxy：表示代理工厂。用来创建代理对象，在Spring Framework中，要么是 JDK 动态代理，要么是CGLib 代理:
8. Weaving：表示织入，即创建代理对象的动作。这个动作可以发生在编译时期(比如 Aspejctj)，或者运行时，比如 Spring AOP


通知的类型
1. Before Advice:方法之前执行;
2. After returning advice:方法 return 后执行;
3. After throwing advice:方法抛异常后执行;
4. After (finally) advice:方法执行完 finally之后执行，比 return 更后执行;
5. Around advice:这是功能最强大的Advice，可以自定义执行顺序: