

  本文首先需要大家对SpringBoot的自动装配比较清楚，如果不清楚的可以移步我之前介绍的自动装配的相关视频和文章。

## 一、疑惑点

  我们之前在分析SpringBoot自动装配源码的时候讲过在 `@EnableAutoConfiguration`注解上通过 `@Import`注解导入了一个 `ImportSelector`接口的实现类 `AutoConfigurationImportSelector`。按照之前对 `@Import` 注解的理解，应该会执行重写的 `selectImports` 方法，但调试的时候，执行的流程好像和我们期待的不一样哦，没有走 `selectImports`方法。

  通过Debug模式，端点定位我们能够发现进入到了getAutoConfigurationEntry方法中。

![image.png](https://ask.qcloudimg.com/http-save/yehe-4919348/862888162855f5ba804f509c29489011.png)

image.png

  但是没有进入selectImports方法。

![image.png](https://ask.qcloudimg.com/http-save/yehe-4919348/a564e7c04269cfb3473431629bcce705.png)

image.png

  这是什么原因呢？他不是实现了ImportSelector接口吗？怎么和我们之前理解的不一样呢？这就需要我们再来细说下@Import注解了。

## 二、@Import

  我们前面介绍过@Import注解可以根据添加的不同类型做出不同的操作

|导入类型|注入方式|
|---|---|
|实现了ImportSelector接口|不注入该类型的对象，调用selectImports方法，将返回的数据注入到容器中|
|实现了ImportBeanDefinitionRegistrar接口|不注入该类型的对象，调用registerBeanDefinitions方法，通过注册器注入|
|普通类型|直接注入该类型的对象|

  而在自动装配中导入的AutoConfigurationImportSelector这个类型有点特殊。具体看下类图结构

![image.png](https://ask.qcloudimg.com/http-save/yehe-4919348/69a322457c015fa66898ae660e6856a1.png)

image.png

  那这个DeferredImportSelector这个接口的作用是什么呢？字面含义是延迟导入的意思。具体怎么实现的后面再说，我们先来说下他的作用。

## 三、DeferredImportSelector接口

  DeferredImportSelector接口本身也有ImportSelector接口的功能，如果我们仅仅是实现了DeferredImportSelector接口，重写了selectImports方法，那么selectImports方法还是会被执行的，来看代码。

```javascript
public class MyDeferredImportSelector implements DeferredImportSelector {

    @Override
    public String[] selectImports(AnnotationMetadata importingClassMetadata) {
        System.out.println("selectImports方法执行了---->");
        return new String[0];
    }


}
```

复制

对应的配置启动类

```javascript
@Configuration
@Import(MyDeferredImportSelector.class)
public class JavaConfig {

    public static void main(String[] args) {
        ApplicationContext ac = new AnnotationConfigApplicationContext(JavaConfig.class);
    }
}
```

复制

启动效果：

![image.png](https://ask.qcloudimg.com/http-save/yehe-4919348/d7e2286edd983f32c6b7ea29dbc0602c.png)

image.png

但是如果我们重写了DeferredImportSelector中的Group接口，并重写了getImportGroup，那么[容器](https://cloud.tencent.com/product/tke?from_column=20065&from=20065)在启动的时候就不会执行selectImports方法了，而是执行getImportGroup方法。进而执行Group中重写的方法。

```javascript
public class MyDeferredImportSelector implements DeferredImportSelector {

    @Override
    public String[] selectImports(AnnotationMetadata importingClassMetadata) {
        System.out.println("selectImports方法执行了---->");
        return new String[0];
    }

    @Override
    public Class<? extends Group> getImportGroup() {
        System.out.println("getImportGroup");
        return MyDeferredImportSelectorGroup.class;
    }

    public static class MyDeferredImportSelectorGroup implements Group{
        private final List<Entry> imports = new ArrayList<>();
        @Override
        public void process(AnnotationMetadata metadata, DeferredImportSelector selector) {
            System.out.println("MyDeferredImportSelectorGroup.Group");
        }

        @Override
        public Iterable<Entry> selectImports() {
            System.out.println("Group中的：selectImports方法");
            return imports;
        }
    }
}
```

复制

执行效果：

![image.png](https://ask.qcloudimg.com/http-save/yehe-4919348/000a8992cede7d177c307f82913c4463.png)

image.png

通过上面的效果解释了为什么在SpringBoot自动装配的时候没有走selectImports方法。那么DeferredImportSelector接口的作用是什么呢？为什么要这么设计呢？我们接下来继续分析

## 四、DeferredImportSelector的作用

  通过前面的类图结构我们知道DeferredImportSelector是ImportSelector接口的一个扩展。

![image.png](https://ask.qcloudimg.com/http-save/yehe-4919348/e0bb3d7b47c1c84c088b69c0762842e0.png)

image.png

**ImportSelector**实例的selectImports方法的执行时机，是在@Configguration注解中的其他逻辑被处理之前，所谓的其他逻辑，包括对@ImportResource、@Bean这些注解的处理（注意，这里只是对@Bean修饰的方法的处理，并不是立即调用@Bean修饰的方法，这个区别很重要！)

**DeferredImportSelector**实例的selectImports方法的执行时机，是在@Configguration注解中的其他逻辑被处理完毕之后，所谓的其他逻辑，包括对@ImportResource、@Bean这些注解的处理.

上面的结论我们可以直接在源码中看到对应的答案。首先定位到ConfigurationClassParser中的parse方法。

![image.png](https://ask.qcloudimg.com/http-save/yehe-4919348/19c7aec7bdde4df848309a90130838c7.png)

image.png

上面代码有两个非常重要的分支，我们在下面逐一的介绍

### 1.parse方法

我们先看parse方法，也就是解析注解类的方法。进入

![image.png](https://ask.qcloudimg.com/http-save/yehe-4919348/bd3645033041996c962abcd53ad3e819.png)

image.png

看到调用的是processConfigurationClass，翻译过来就比较好理解了，处理配置类

![image.png](https://ask.qcloudimg.com/http-save/yehe-4919348/4dd27346145aa1cff16dcf31c9701c84.png)

image.png

再进入到循环的方法中。

![image.png](https://ask.qcloudimg.com/http-save/yehe-4919348/3f808f0b0ae4e0df146a021c0e77e070.png)

image.png

继续往下看

![image.png](https://ask.qcloudimg.com/http-save/yehe-4919348/77af238a66f67c3248aa68e52b661318.png)

image.png

![image.png](https://ask.qcloudimg.com/http-save/yehe-4919348/45e214851e64aa9e1f4fc8b62e79341d.png)

image.png

逻辑处理还是非常清楚的。然后我们需要回到上面的处理@Import注解的方法中。在这个方法中我们可以看到@Import注解的实现逻辑

![image.png](https://ask.qcloudimg.com/http-save/yehe-4919348/077785ebd29e69f019ea88447d803209.png)

image.png

也就是前面给大家回顾的@Import注解的作用

![image.png](https://ask.qcloudimg.com/http-save/yehe-4919348/435e84bb9541ffcfbab188a6ea825b87.png)

image.png

然后来看下导入的类型是ImportSelector接口的逻辑。

![image.png](https://ask.qcloudimg.com/http-save/yehe-4919348/702b18588d8438af5ece3daed6a913a8.png)

image.png

上面的代码重点解决了ImportSelector接口的不同类型的实现。

![image.png](https://ask.qcloudimg.com/http-save/yehe-4919348/9e1c81ec9fce152c1c4770bf71a95e12.png)

image.png

对应的实例存储了起来

![image.png](https://ask.qcloudimg.com/http-save/yehe-4919348/34786a2e10c9fc9ae039b54250790c9e.png)

image.png

### 2.process方法

  好了上面的[代码分析](https://cloud.tencent.com/product/tcap?from_column=20065&from=20065)清楚了，然后我们再回到process方法中来看下DeferredImportSelectorHandler是如何处理的。

![image.png](https://ask.qcloudimg.com/http-save/yehe-4919348/1cf2a58944c03069343628be255c0047.png)

image.png

进入process方法

![image.png](https://ask.qcloudimg.com/http-save/yehe-4919348/671a8317c708dde8b043f98c75f82eb0.png)

image.png

先看register方法

![image.png](https://ask.qcloudimg.com/http-save/yehe-4919348/b13c9f980977372ee6f936f2f089c60f.png)

image.png

然后再看processGroupImports方法。

![image.png](https://ask.qcloudimg.com/http-save/yehe-4919348/bb4ed60a1ea254e6b55d30005333ceb1.png)

image.png

进去后我们需要进入getImports方法中。

![image.png](https://ask.qcloudimg.com/http-save/yehe-4919348/2b7894b4d646108da30d4ad84519a26a.png)

image.png

然后我们进入到process方法中，可以看到自动装配的方法被执行了！

![image.png](https://ask.qcloudimg.com/http-save/yehe-4919348/8a74512f15fd9ae259fcf5d9b7861b32.png)

image.png

到这儿是不是帮助大家解决了自动装配为什么没有走 `AutoConfigurationImportSelector`中的 `selectImports` 方法了!!!

同时也介绍清楚了ImportSelector与DeferredImportSelector的区别，就是selectImports方法执行时机有差别，这个差别期间，spring容器对此Configguration类做了些其他的逻辑：包括对@ImportResource、@Bean这些注解的处理

