如图，Spring 中 Bean 的创建大概可以分为以下几个阶段:
1. **实例化**
	- 该阶段主要通过推断构造方法并调用，完成该 Bean 的实例化。
	- 源码可以参考 [[AbstractAutowireCapableBeanFactory#createBeanInstance]]。
2. **属性填充，也就是依赖注入。**
	- 该阶段主要是找出实例中需要填充的属性并进行赋值，完成依赖注入。
	- 源码可以参考 [[AbstractAutowireCapableBeanFactory#populateBean]]。
3. **Aware 接口方法回调**
	- 依赖注入完成后，Spring 会判断该对象是否实现了 BeanNameAware/BeanClassLoaderAware/BeanFactoryAware 接口。
	- 如果实现了，Spring 就会相应的调用 setBeanName()/setBeanClassLoader()/setBeanFactory()方法并传入相应的参数。
	- 源码可以参考 [[AbstractAutowireCapableBeanFactory#invokeAwareMethods]]。
4. **初始化前，主要是 BeanPostProcessor 的前置处理。**
	- BeanPostProcessor 是 Spring IOC 容器给我们提供的一个扩展接口，它的主要作用是帮助我们在 Bean的初始化前后可以添加一些自己的处理逻辑，Spring 中内置了很多 BeanPostProcessor，当然，我们也可以自定义一个或多个BeanPostProcessor 接口的实现，然后注册到容器中。
	- 该阶段主要是遍历所有的 BeanPostProcessor 的实现，并执行它的 postProcessBeforelnitialization() 方法。
	- 源码可以参考 [[AbstractAutowireCapableBeanFactory#applyBeanPostProcessorsBeforelnitialization]]。
5. **初始化，主要是 InitializingBean 接口方法的回调和自定义初始化方法的调用。**
	- 该阶段，Spring 会判断该对象是否实现了 InitializingBean 接口，如果实现了，则会调用当前对象中的afterPropertiesSet()方法。
	- 另外，如果 Bean 在配置文件中定义了初始化方法，那么该方法将会被调用。
	- 源码可以参考 [[AbstractAutowireCapableBeanFactory#invokelnitMethods]]。
6. **初始化后，主要是 BeanPostProcessor 的后置处理**
	- 该阶段主要是遍历所有的 BeanPostProcessor 的实现，并执行它的 postProcessAfterinitialization()方法。
	- 此阶段中，有一个 BeanPostProcessor 的实现:AnnotationAwareAspectJAutoProxyCreator 比较重要，因为它的postProcessAfterlnitialization()中完成了 AOP 代理对象的创建。
	- 源码可以参考 [[AbstractAutowireCapableBeanFactory#applyBeanPostProcessorsAfterlnitialization]]。

此外，对于非懒加载的单例 Bean、懒加载的单例 Bean 以及原型 Bean，它们创建的过程也是有区别的：
1. 非懒加载的单例 Bean：lOC 容器初始化的时候会完成创建;
2. 懒加载的单例 Bean：也就是设置了 lazy-init 属性或者使用了 @Lazy 注解的 Bean，这类 Bean，IOC 容器初始化的时候并不会创建，当使用的时候才会去创建;
3. 上面这两种单例 Bean，创建完之后会被存入到一个 Map<String,Object>中，我们称之为单例池，单例池 的 key 为beanName，value 为 Bean 对象，下次 getBean()时会直接从单例池中获取;
4. 原型 Bean:也就是设置了 @Scope("prototype")的 Bean，这类 Bean，每次使用的时候都会创建一个新的 Bean 对象，并且Spring 容器并不会管理这些 Bean。