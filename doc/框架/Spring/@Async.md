`@Async` 是 Spring 框架中提供的一个可以标注一个方法或一个类中的方法为异步执行的注解。@Async 注解底层也是基于 SpringAOP 实现的，Spring 容器在启动初始化 bean 时，会判断类中是否使用了 `@Async` 注解，如果使用了该注解，则会为其创建切入点和切入点处理器。当标注了 `@Async` 注解的方法被调用时，会调用切入点处理器的 invoke 方法，在 invoke 方法中会为标注了 `@Async` 注解的方法生成一个 `Callable` 对象，并提交给线程池的一个线程来执行，从而实现了该方法的异步执行。
那么，为什么不建议直接使用 @Async 注解呢?问题的根源就在这个线程池身上。接下来让我们根据源码看下 Spring 是怎么选择这个线程池的，
Spring 为 `@Async` 注解选定线程池的源码在 [[AsyncExecutionlnterceptor#getDefaultExecutor]] 方法中:

以上两段源码大概逻辑如下:首先尝试获取 `TaskExecutor` 实现类的 bean 对象，如果能找到且只能找到唯一一个，则返回该对象，如果找不到或者找到了多个，则会进入 catch 语句块分支，获取 beanName 为 taskExecutor 的 bean 对象，如果获取不到，则会创建一个 SimpleAsyncTaskExecutor 线程池对象。
换句话说，**如果直接使用 @Async 注解，Spring 就会直接使用 SimpleAsyncTaskExecutor 线程池**。接下来让我们看下这个线程池到底是怎么执行的:

是的，你没有看错!它不会重用线程，并且每次调用都会创建一个新的线程，也没有最大线程数的设置，所以在并发量大的时候会产生严重的性能问题。
一般生产环境，我们建议使用自定义线程池配合 @Async 注解一起使用，而不应该直接使用 @Async 注解。

那么怎么自定义线程池呢?
在 Spring 中，我们可以通过实现 AsyncConfigurer 接口或者直接继承 AsyncConfigurerSupport 类来自定义线程池，线程池可以直接使用 JDK 中提供的 ThreadPoolExecutor;当然，Spring 本身也提供了许多 TaskExecutor 的实现类，其中使用最多的就是ThreadPoolTaskExecutor。接下来，我们就以 ThreadPoolTaskExecutor 为例来自定义一个线程池:
