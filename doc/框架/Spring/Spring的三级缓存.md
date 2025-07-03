通过三级缓存的定义可以看到，其实它们本质上就是一个 Map。接下来让我们看一下他们的具体作用
1. **singletonObjects 是一级缓存，也被称作单例池，它存储的是已经创建好的完整的 bean 对象**。在创建一个单例 bean 时，会优先从单例池中尝试获取该 bean 的实例，如果能够获取到则直接返回；如果获取不到则继续创建该单例 bean。
2. **earlySingletonObjects 是二级缓存，存储的是尚未完全创建好的单例 bean 对象**。在创建单例 bean 时，如果发现该 bean 存在循环依赖，则会先创建该 bean 的"半成品"对象，并放入到二级缓存中。如果该 bean 需要进行 AOP，则该"半成品"对象是它的代理对象，否则就是它实例化之后但是尚未属性填充的原始对象。
3. **singletonFactories 是三级缓存，存储的是单例 bean 的创建工厂，其实就是一个 Lambda 表达式**。在每个bean 的创建过程中经过实例化得到一个原始对象后，都会提前基于该原始对象暴露一个 Lambda 表达式，并保存到三级缓存中。这个 Lambda 表达式可能会用到，也可能用不到，主要取决于当前 bean 是否存在循环依赖。如果当前 bean 没有出现循环依赖，那么这个 Lambda表达式就不会被用到，当前 bean 会按照自己的生命周期正常执行，创建完成后会被放入到单例池中；如果当前 bean 在依赖注入时出现了循环依赖，则会从三级缓存中取出 Lambda 表达式并执行，执行返回的对象会被放入到二级缓存。

其实，Spring 解决循环依赖的过程中，除了三级缓存，还有一个缓存也同样比较重要:earyProxyReferences，它记录了某个bean 的原始对象是否已经进行了 AOP。

`org.springframework.beans.factory.support.AbstractBeanFactory#doGetBean`

![[spring三级缓存 2023-12-20 23.08.26.excalidraw]]

> [!NOTE] 为什么在循环依赖的bean 中生成未完成bean
> 比如说A依赖B，B依赖A，A先创建，A创建的时候没法判断A是否发生了循环依赖，A去getBean(B)，B创建发现要注入A（getBean(A))，这时候才能知道A发生了循环依赖


> [!NOTE] 为什么不直接使用二级缓存
> 如果对象实例化的时候直接生成代理bean放入二级缓存，相当于打破了bean的生命周期，而且大部分bean是不会产生循环依赖的

```java
		boolean earlySingletonExposure = (mbd.isSingleton() && this.allowCircularReferences &&
				isSingletonCurrentlyInCreation(beanName));
```

- `mbd.isSingleton()`: `mbd` 是指 BeanDefinition 对象，`isSingleton()` 方法用于检查该 BeanDefinition 是否声明为单例模式。如果该 BeanDefinition 声明为单例，则条件成立。
- `this.allowCircularReferences`: `this` 指的是当前的 BeanFactory 实例，`allowCircularReferences` 是一个属性或配置项，用于指示是否允许循环依赖。如果允许循环依赖，则条件成立。
- `isSingletonCurrentlyInCreation(beanName)`: `isSingletonCurrentlyInCreation(beanName)` 是一个方法，用于检查给定的 beanName 是否当前正在创建中。如果给定的 beanName 正在创建中，条件成立。

只有当上述三个条件同时满足时，`earlySingletonExposure` 才会被设置为 `true`。这意味着在满足以下条件时，早期单例暴露被认为是可行的：
- BeanDefinition 声明为单例模式。
- 允许循环依赖。
- 给定的 beanName 正在创建中。

这个条件的目的是在解决循环依赖时，允许某个正在创建中的单例 bean 提前暴露给其他正在创建的 bean，以满足循环依赖的需求。
