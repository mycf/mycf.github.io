
```
@SPI(name = "dubbo")
```

META-INF/services/org.apache.dubbo.common.extension.LoadingStrategy

org.apache.dubbo.common.extension.ExtensionFactory


Dubbo SPI  的目的是为了得到一个指定实现类的对象

Dubbo 并未使用 Java  SPI  ,而是重新设计了一套增强版的 SPI 。Dubbo SPI 的相关逻辑封装在了 ExtensionLoader 类中，通过 ExtensionLoader ，我们可以加载指定的实现类。Dubbo SPI  所需要的配置文件在 META-INF/dubbo 路径下。
![640.png](https://ucc.alicdn.com/pic/developer-ecology/55e21eeb43bb48a3823d5044f1dbca96.png "640.png")

  

## **示例**

现在 dubbo 路径下，配置内容如下：

optimusPrime = org.apache.spi.OptimusPrime
bumblebee = org.apache.spi.Bumblebee

通过键值对的方式进行配置，配置完成之后会按照需要加载指定的实现类，另外，在测试 Dubbo SPI 时，需要在 Robot 接口上标注 @SPI 注解。

```java
public class DubboSPITest {
    @Test    public void sayHello() throws Exception {        ExtensionLoader<Robot> extensionLoader =            ExtensionLoader.getExtensionLoader(Robot.class);        Robot optimusPrime = extensionLoader.getExtension("optimusPrime");        optimusPrime.sayHello();        Robot bumblebee = extensionLoader.getExtension("bumblebee");        bumblebee.sayHello();    }
}
```

## **实现原理**

1.通过 ExtensionLoader 的 getExtensionLoader 方法获取一个 ExtensionLoader 实例，getExtensionLoader 方法用于从环城中获取与拓展类相对应的 ExtensionLoader,如果没有命中，会新建一个实例。2.通过 ExtensionLoader 的 getExtension 方法获取拓展类对象。

获取扩展对象实现代码如下：

```java
private T createExtension(String name) {
    // 从配置文件中加载所有的拓展类，可得到“配置项名称”到“配置类”的映射关系表
    Class<?> clazz = getExtensionClasses().get(name);
    if (clazz == null) {
        throw findException(name);
    }
    try {
        T instance = (T) EXTENSION_INSTANCES.get(clazz);
        if (instance == null) {
            // 通过反射创建实例
            EXTENSION_INSTANCES.putIfAbsent(clazz, clazz.newInstance());
            instance = (T) EXTENSION_INSTANCES.get(clazz);
        }
        // 向实例中注入依赖 set 注入
        injectExtension(instance);
        Set<Class<?>> wrapperClasses = cachedWrapperClasses;
        if (wrapperClasses != null && !wrapperClasses.isEmpty()) {
            // 循环创建 Wrapper 实例
            for (Class<?> wrapperClass : wrapperClasses) {
                // 将当前 instance 作为参数传给 Wrapper 的构造方法，并通过反射创建 Wrapper 实例。
                // 然后向 Wrapper 实例中注入依赖，最后将 Wrapper 实例再次赋值给 instance 变量
                instance = injectExtension(
                    (T) wrapperClass.getConstructor(type).newInstance(instance));
            }
        }
        return instance;
    } catch (Throwable t) {
        throw new IllegalStateException("...");
    }
}
```

1. 先检查缓存，缓存未命中，然后创建拓展对象。

public T getExtension(String name) {
    if (name == null || name.length() == 0)        throw new IllegalArgumentException("Extension name == null");    if ("true".equals(name)) {        // 获取默认的拓展实现类        return getDefaultExtension();    }    // Holder，顾名思义，用于持有目标对象    Holder<Object> holder = cachedInstances.get(name);    if (holder == null) {        cachedInstances.putIfAbsent(name, new Holder<Object>());        holder = cachedInstances.get(name);    }    Object instance = holder.get();    // 双重检查    if (instance == null) {        synchronized (holder) {            instance = holder.get();            if (instance == null) {                // 创建拓展实例                instance = createExtension(name);                // 设置实例到 holder 中                holder.set(instance);            }        }    }    return (T) instance;
}

2） 创建拓展对象

- 通过 getExtensionClasses 获取索引的拓展类
- 通过**反射**创建拓展对象
- 向拓展对象中**注入依赖**
- 将拓展对象包括在对应的 Wrapper 对象中

  

### 如何获得所有扩展类

  

getExtensionClasses 代码，先检查缓存，如果缓存未命中，则通过 synchronized 加锁，加锁后，再次检查缓存，并判空。如果 classes 为 null 则通过 loadExtensionClases 加载拓展类。

  

private Map<String, Class<?>> getExtensionClasses() {
   // 从缓存中获取已加载的拓展类   Map<String, Class<?>> classes = cachedClasses.get();   // 双重检查   if (classes == null) {       synchronized (cachedClasses) {           classes = cachedClasses.get();           if (classes == null) {               // 加载拓展类               classes = loadExtensionClasses();               cachedClasses.set(classes);           }       }   }   return classes;
}

### 通过加载配置文件的方式获得扩展类

  

- 一是对 SPI 注解进行解析
- 二是调用 loadDirectory 方法加载指定文件夹配置文件

  

private Map<String, Class<?>> loadExtensionClasses() {
    // 获取 SPI 注解，这里的 type 变量是在调用 getExtensionLoader 方法时传入的    final SPI defaultAnnotation = type.getAnnotation(SPI.class);    if (defaultAnnotation != null) {        String value = defaultAnnotation.value();        if ((value = value.trim()).length() > 0) {            // 对 SPI 注解内容进行切分            String[] names = NAME_SEPARATOR.split(value);            // 检测 SPI 注解内容是否合法，不合法则抛出异常            if (names.length > 1) {                throw new IllegalStateException("more than 1 default extension name on extension...");            }            // 设置默认名称，参考 getDefaultExtension 方法            if (names.length == 1) {                cachedDefaultName = names[0];            }        }    }    Map<String, Class<?>> extensionClasses = new HashMap<String, Class<?>>();    // 加载指定文件夹下的配置文件    loadDirectory(extensionClasses, DUBBO_INTERNAL_DIRECTORY);    loadDirectory(extensionClasses, DUBBO_DIRECTORY);    loadDirectory(extensionClasses, SERVICES_DIRECTORY);    return extensionClasses;
}

loadDirectory 方法先通过 classLoader 获取所有资源链接，然后再通过 loadResource 方法加载资源。我们继续跟下去，看一下 loadResource 方法的实现。

  

private void loadDirectory(Map<String, Class<?>> extensionClasses, String dir) {
    // fileName = 文件夹路径 + type 全限定名    String fileName = dir + type.getName();    try {        Enumeration<java.net.URL> urls;        ClassLoader classLoader = findClassLoader();        // 根据文件名加载所有的同名文件        if (classLoader != null) {            urls = classLoader.getResources(fileName);        } else {            urls = ClassLoader.getSystemResources(fileName);        }        if (urls != null) {            while (urls.hasMoreElements()) {                java.net.URL resourceURL = urls.nextElement();                // 加载资源                loadResource(extensionClasses, classLoader, resourceURL);            }        }    } catch (Throwable t) {        logger.error("...");    }
}

loadResource 方法用于读取和解析配置文件，并通过**反射加载类**，最后调用 loadClass 方法进行其他操作。loadClass 方法用于主要用于操作缓存，该方法的逻辑如下：

  

private void loadClass(Map<String, Class<?>> extensionClasses, java.net.URL resourceURL,
    Class<?> clazz, String name) throws NoSuchMethodException {    
    if (!type.isAssignableFrom(clazz)) {        throw new IllegalStateException("...");    }    // 检测目标类上是否有 Adaptive 注解    if (clazz.isAnnotationPresent(Adaptive.class)) {        if (cachedAdaptiveClass == null) {            // 设置 cachedAdaptiveClass缓存            cachedAdaptiveClass = clazz;        } else if (!cachedAdaptiveClass.equals(clazz)) {            throw new IllegalStateException("...");        }        
    // 检测 clazz 是否是 Wrapper 类型    } else if (isWrapperClass(clazz)) {        Set<Class<?>> wrappers = cachedWrapperClasses;        if (wrappers == null) {            cachedWrapperClasses = new ConcurrentHashSet<Class<?>>();            wrappers = cachedWrapperClasses;        }        // 存储 clazz 到 cachedWrapperClasses 缓存中        wrappers.add(clazz);        
    // 程序进入此分支，表明 clazz 是一个普通的拓展类    } else {        // 检测 clazz 是否有默认的构造方法，如果没有，则抛出异常        clazz.getConstructor();        if (name == null || name.length() == 0) {            // 如果 name 为空，则尝试从 Extension 注解中获取 name，或使用小写的类名作为 name            name = findAnnotationName(clazz);            if (name.length() == 0) {                throw new IllegalStateException("...");            }        }        // 切分 name        String[] names = NAME_SEPARATOR.split(name);        if (names != null && names.length > 0) {            Activate activate = clazz.getAnnotation(Activate.class);            if (activate != null) {                // 如果类上有 Activate 注解，则使用 names 数组的第一个元素作为键，                // 存储 name 到 Activate 注解对象的映射关系                cachedActivates.put(names[0], activate);            }            for (String n : names) {                if (!cachedNames.containsKey(clazz)) {                    // 存储 Class 到名称的映射关系                    cachedNames.put(clazz, n);                }                Class<?> c = extensionClasses.get(n);                if (c == null) {                    // 存储名称到 Class 的映射关系                    extensionClasses.put(n, clazz);                } else if (c != clazz) {                    throw new IllegalStateException("...");                }            }        }    }
}

## **Dubbo SPI  和 Java  SPI  区别**

原始 JDK SPI 实现

  

ServiceLoader<Command> serviceLoader=ServiceLoader.load(Command.class);
  for(Command command:serviceLoader){      command.execute();  }

- 原始的 JDK spi不支持缓存，Dubbo  SPI 使用了缓存对象。SPI 的key value 缓存在cachedInstances 对象中，它是个concurrenthashmap
- 原始的 JDK SPI 不支持默认值，dubbo 设计默认值：@SPI("dubbo") 代表默认的spi对象，例如Protocol的@SPI("dubbo")就是 DubboProtocol。
- JDK 要使用 for 循环判断对象，dubbo 设计 getExtension 灵活方便，动态获取 spi 对象。例如 ExtensionLoader.getExtensionLoader(Protocol.class).getExtension(spi的key)来提取对象
- 原始 JDK spi 不支持 AOP 功能，dubbo设计增加了AOP功能,在cachedWrapperClasses，在原始spi类，包装了XxxxFilterWrapper XxxxListenerWrapper
- 原始JDK spi不支持 IOC功能，dubbo设计增加了IOC,通过构造函数注入,代码为：wrapperClass.getConstructor(type).newInstance(instance),

  

## **总结**

Dubbo SPI  实现途径：

  

ExtensionLoader.getExtension(String name)

实现路径：

  

getExtensionLoader(Class<T> type) 就是为该接口new 一个ExtensionLoader，然后缓存起来。
getAdaptiveExtension() 获取一个扩展类，如果@Adaptive注解在类上就是一个装饰类；如果注解在方法上就是一个动态代理类，例如Protocol$Adaptive对象。
getExtension(String name) 获取一个指定对象。
-----------------------ExtensionLoader.getExtensionLoader(Class<T> type)
ExtensionLoader.getExtensionLoader(Container.class)
  -->this.type = type;  -->objectFactory = (type == ExtensionFactory.class ? null : ExtensionLoader.getExtensionLoader(ExtensionFactory.class).getAdaptiveExtension());     -->ExtensionLoader.getExtensionLoader(ExtensionFactory.class).getAdaptiveExtension()       -->this.type = type;       -->objectFactory =null;

执行以上代码完成了2个属性的初始化.

1. 每个一个ExtensionLoader都包含了2个值 type 和 objectFactory Class<?> type；//构造器  初始化时要得到的接口名 ExtensionFactory objectFactory//构造器  初始化时 AdaptiveExtensionFactory[SpiExtensionFactory,SpringExtensionFactory]
2. new 一个ExtensionLoader 存储在ConcurrentMap<Class, ExtensionLoader> EXTENSION_LOADERS

  

#### 关于这个objectFactory的一些细节：

  

1.objectFactory就是ExtensionFactory，它也是通过ExtensionLoader.getExtensionLoader(ExtensionFactory.class)来实现的，但是它的objectFactory=null 2.objectFactory作用，它就是为dubbo的IOC提供所有对象。

  

#### 为什么要设计adaptive？注解在类上和注解在方法上的区别？

  

adaptive设计的目的是为了识别固定已知类和扩展未知类。

1. 注解在类上：代表人工实现，实现一个装饰类（设计模式中的装饰模式），它主要作用于固定已知类，目前整个系统只有2个，AdaptiveCompiler、AdaptiveExtensionFactory。

  

##### 为什么AdaptiveCompiler这个类是固定已知的？

  

因为整个框架仅支持Javassist和JdkCompiler。

  

##### 为什么AdaptiveExtensionFactory这个类是固定已知的？

  

因为整个框架仅支持2个objFactory,一个是spi,另一个是spring

2. 注解在方法上：代表自动生成和编译一个动态的Adpative类，它主要是用于SPI，因为spi的类是不固定、未知的扩展类，所以设计了动态Adaptive的类，通过ExtensionLoader.getExtensionLoader(Protocol.class).getExtension(spi类);来提取对象

- [https://dubbo.gitbooks.io/dubbo-dev-book/SPI.html](https://dubbo.gitbooks.io/dubbo-dev-book/SPI.html)