# 前言

有一天在看Unsafe.getUnsafe()源码时，发现该方法上有一个@CallerSensitive注解。类似的，在Class.forName方法也有该注解。它们的源码分别如下：

```java
@CallerSensitive
public static Unsafe getUnsafe() {
    Class var0 = Reflection.getCallerClass();
    if (!VM.isSystemDomainLoader(var0.getClassLoader())) {
        throw new SecurityException("Unsafe");
    } else {
        return theUnsafe;
    }
}
```

```java
@CallerSensitive
public static Class<?> forName(String className)
            throws ClassNotFoundException {
    Class<?> caller = Reflection.getCallerClass();
    return forName0(className, true, ClassLoader.getClassLoader(caller), caller);
}
```

这2个方法有个共同点，就是内部都调用了==Reflection.getCallerClass()==，这是一个native方法。凑巧的是，Reflection.getCallerClass()也有@CallerSensitive注解

```java
@CallerSensitive
public static native Class<?> getCallerClass();
```

# 解释

- Caller=调用者，Sensitive=敏感的/易感知的。顾名思义，主要是针对于方法调用者所做的一些控制。
    
- Reflection.getCallerClass()要求调用者必须有@CallerSensitive注解，并且必须有权限（由bootstrap class loader或者extension class loader加载的类）才可以调用。本地测试需要加上启动参数  
    ![在这里插入图片描述](https://img-blog.csdnimg.cn/2020091709553261.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzI4ODM0MzU1,size_16,color_FFFFFF,t_70#pic_center)
    
- Reflection.getCallerClass()加了@CallerSensitive注解后，能够跟踪到最初的调用者。==例如 method-1 -> method-2 -> method-3 -> method-4 -> Reflection.getCallerClass，最终返回的是method-1==
    
- @CallerSensitive能够堵住反射的漏洞，当你尝试用反射调用Reflection.getCallerClass()，结果会抛出异常
    

# 其他

- 这个方法没找到太多的资料，在我们日常开发中，可以说作用不大，了解就行
- 主要还是JDK底层控制权限的地方使用。
