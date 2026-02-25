如图，Spring Bean 的整个生命周期可以分为 3个大的阶段：创建、使用和销毁；还可以分为6个小的阶段:实例化、初始化、注册 Destruction 回调、Bean 的正常使用和 Bean 的销毁。
![[Spring bean的创建过程]]
接下来让我们看下其他几个过程
1. 注册 Destruction 回调
	- 如果 Spring Bean 实现了 DisposableBean 接口或者在 Bean 定义中自定义了销毁方法，Spring 会为这些 Bean 注册一个销毁的回调，确保在容器关闭时能够正确的清理资源。
	- 源码可以参考 [[AbstractAutowireCapableBeanFactory#registerDisposableBeanlfNecessary]]。
2. Bean 的正常使用,
3. 调用 DisposableBean#destory().
	- 当容器关闭时，如果 Bean 实现了 DisposableBean 接口，destory()就会被调用。
	- 源码可以参考 [[DisposableBeanAdapter#destroy]]。
1. 调用自定义的 destory-method.
	- 如果 Bean 在配置文件中定义了销毁方法，那么该方法就会被调用。
	- 源码可以参考 [[DisposableBeanAdapter#destroy]]。



![image.png](https://gitee.com/ycfan/images/raw/master/img/20231215194322.png)

1.处理名称，检查缓存

  - 先把缓存解析为实际名称，再进行后续处理
  - 若要取FactoryBean本身，需要使用&名称获取
  - `singletonObjects`是一级缓存，放单例成品对象
  - `singletonFactories`是三级缓存,放单例工厂
  - `earlySingletonObjects`是二级缓存,放单例工厂的产品,可称为提前单例对象

2.处理父子容器
  - 父子容器的bean名称可以重复
  - 优先找子容器的bean，找到了直接返回，找不到继续到父容器找

好接下来我们来看阶段二, 刚才呢我们在阶段一两说过一嘴, 就是啊, 我们会首先去查找那个缓存对吧, 哎缓存力如果有了, 就直接返回, 那缓存力如果没有呢, 他是不是会立刻去创建这个病呢, 也不是啊, 如果我们的这个容器中啊又配置了副容器的话, 它缓存里没有找到的话, 他会到副容器里去查找这个地啊, 看看副容器里有没有进行创建好对应, 如果有, 那直接用副容器的病就完了啊, 就不会走下面的创建流程, 那如果是输容器里还是没有, 那它才会继续向下走后面的后续流程, 当然了, 这是我们配置了副容器的情况下, 它就会到副容器里找了, 那这里大家要注意个规则, 就是副容器跟子容器中的bean是可以, 名字是可以重复的啊, 也就是副容器比如说已经有一个a了, 子容器呢也可以有一个b名字也叫a, 当然如果这种名字发生了重复, 它优先的话, 还是会找子容器的病的啊, 找到了就会返回了, 找不到呢才会继续到副容器去进行查找啊, 好这是我们第二个阶段, 也就是他会考虑这种有父子容器的情况, 会考虑查找副容器, 好这段这个阶段比较简单, 我们就过了啊, 继续看第三个阶段, 第三个阶段先说一下, 下面这些都是当时我讲那个原版的时候, 扩展讲解的, 我们其实第三个阶段, 主要知道一下什么叫depends on就可以了啊, 下面这些暂时不用了解, 那什么是depends on呢, 我们都知道, 大部分b之间是有这种依赖关系的啊, 比如说我a依赖于b那这种有依赖关系的bean, 他们的创建其实次序是可以得到保障的啊, 比如说我刚才说的a依赖于b, 那你是不是得先把b创建出来, 然后才能创建a啊啊, 所以这种有依赖关系的bean啊, 他们的创建次序是有保障的, 但是有一些病啊, 他们之间没有依赖关系啊, 比如说a和b之间没有这种显示的依赖, 那我又想控制他们的创建次序怎么办呢, 哎那我就得用这个depends on了, 比如说还是刚才那个例子, a和b没有依赖关系, 那我就想让b先创建, 然后a后创建, 那你就让a depends on b, 这样就可以了啊, 然后a depends on b, 那就是b先创建, 回过头来才会创建a所以对我们总结一下, 这个底喷脏啊, 就是用在这种没有显示依赖的病, 他们创建次序你想控制的话, 就可以用depend on来控制啊, 这个我们用的比较少, 大家了解一下就可以了, 好这是我们的第三个阶段啊, 就是他在get bean时, 他发现了有这些depend on的病, 他会提前把这些depend on后面的bean先创建, 然后回过头来再创建你当前的地方, 好, 这是第三个阶段


3.dependsOn

`dependsOn`用在非显式依赖的bean的创建顺序控制

3.按`scope`

- singleton scope表示从单例池内获取bean，如果没有，则创建并放入单例池
- prototype scope表示从不缓存bean，每次都获取新的
- request scope表示从request对象范围内获取bean，如果没有，创建并放入request

```java
public class Bean1 {

    @PostConstruct
    public void init() {
        System.out.println("精力满满");
    }

    @PreDestroy
    public void des() {
        System.out.println("我把坏掉了");
    }
}
```
### 单例bean
```java
public static void testSingletonScope() {
    GenericApplicationContext context = new GenericApplicationContext();
    context.registerBean("bean", Bean1.class);
    context.registerBean(CommonAnnotationBeanPostProcessor.class);

    context.refresh();
    context.close();
}
```

运行后得到如下结果：
```plainText
精力满满
我把坏掉了
```
### prototype
```java
public static void testPrototypeScope() {
    GenericApplicationContext context = new GenericApplicationContext();
    context.registerBean("bean", Bean1.class, bd -> bd.setScope("prototype"));
    context.registerBean(CommonAnnotationBeanPostProcessor.class);

    context.refresh();
    context.close();
}
```
运行后无任何输出。
```java
public static void testPrototypeScope() {
    GenericApplicationContext context = new GenericApplicationContext();
    context.registerBean("bean", Bean1.class, bd -> bd.setScope("prototype"));
    context.registerBean(CommonAnnotationBeanPostProcessor.class);

    context.refresh();
    Bean1 bean = context.getBean(Bean1.class);
    // 需要自己调用销毁方法
    context.getDefaultListableBeanFactory().destroyBean(bean);

    context.close();
}
```
运行后得到如下结果：
```
精力满满
我把坏掉了
```

### request

## 注册可销毁bean

- 判断并登记可销毁Bean
 - 判断依据
   - 如果实现了DisposableBean或者AutoCloseable接口，则为可销毁bean
   - 如果自定义了destroyMethod，则可销毁Bean
   - @bean没有指定destroyMethod，则采用自动推断方式获取销毁方法名（close,shutdown)
   - @PreDestroy标注的方法
- 存储位置
  - singleton scope可销毁bean会存储于beanFactory中
  - 自定义scope的可销毁bean会存储到对于的域对象中
  - prototype scope不会存储，需要自己找到对象销毁
- 存储时都会被封装为DisposableBeanAdapter类型对销毁方法的调用进行适配



## 销毁bean

要点
  singleton bean 的销毁时机
  自定义 scope bean 的销毁时机
  prototype bean 的销毁时机
  同一 bean 中不同形式销毁方法的调用次序
总结
  - singleton bean 的销毁在 ApplicationContext.close 时，此时会找到所有 DisposableBean 的名字，逐一销毁自定义 scope bean 的销毁在作用域对象生命周期结束时
  - prototype bean 的销毁可以通过自己手动调用AutowireCapableBeanFactorv.destrovBean 方法执行销毁
  - 同一 bean 中不同形式销毁方法的调用次序
  - 优先后处理器销毁，即 @PreDestrov
  - 其次 DisposableBean 接口销毁
  - 最后 destroyMethod 毁 (包括自定义名称，推名称，AutoCloseable 接口 多选一)


