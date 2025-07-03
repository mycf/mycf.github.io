1. 基于 XML 配置 bean。这是最古老的使用方式，虽说这种方式简单且使用灵活，但是小项目还好，一旦项目业务复杂一点，我们则需要配置更多的 bean，非常不利于维护。随着注解定义 bean 方式的兴起，目前这种方式已经使用的很少了。代码示例如下:

2. 使用 @Component 等派生注解定义 bean。鉴于 XML 定义 bean 方式的诸多缺点，Spring 2.5 版本开始支持@Component、@Controller、@Service、@Repository 注解定义 bean，其中后面三种注解都是基于 @Component 注解派生而来的。@Component 等注解的出现给我们定义 bean 提供了极大的便利，这也是目前我们项目中使用较多的一种方式。但是，需要特别注意的是，通过 @Component 注解定义 bean 的前提是:需要先配置扫描路径。代码示例如下:
3. 使用 @Configuration + @Bean 注解的方式定义 bean。@Component 等派生注解定义 bean 虽说使用起来非常方便，但是 bean 的创建过程完全交给 Spring 容器来完成，我们没办法自己控制。Spring 3.0 版本以后，开始支持JavaConfig 的方式定义 bean。代码示例如下:

4. 基于 @lmport 注解的方式定义 bean。虽说 @Configuration 和 @Bean 相结合的方式，我们可以通过代码自定义bean。但是，它只能创建该类中定义对象的 bean 实例、不能创建其他类的 bean 实例。而 Spring 提供的 @Import 注解则可以创建其他类的 bean 实例，该注解是在 Spring 3.0 版本引入的，但是真正支持导入普通组件类的功能则是在Spring 4.2 版本开始的。另外，@lmport 注解还有一个功能强大的地方在于即使该类不在 Spring 指定的扫描目录或者子目录下，一样可以导入!注意，基于 @lmport 注解的方式定义的 bean 名字为该类的全类名，比如org.weige.entity.User。代码示例如下:
5. 基于 @lmport + @Configuration 注解的方式定义 bean。单独使用 @lmport 注解可以导入普通的组件类，而基于@lmport + @Configuration 组合的方式可以导入添加了 @Configuration 注解的配置类，该功能是从 Spring 3.0 版本开始支持的。注意，通过这种方式，配置类中定义的 bean 名字为首字母为小写字母的标准 beanName，换句话说就是可以通过 @Autowired 注解实现依赖注入的功能。代码示例如下:
6. 基于 @lmport + ImportSelector 接口的方式定义 bean。使用这种方式我们可以把功能相关的类放在一起，方便管理和维护，而且可以非常灵活的定制 bean 的实例化。代码示例如下:
7. 基于 @lmport + lmportBeanDefinitionRegistrar 接口的方式定义 bean。这种方式和第6种方式很相似，但是该方式可以指定 bean 的名字和作用域等属性。代码示例如下:
8. 基于 FactoryBean 接口的方式定义 bean。FactoryBean 是 Spring 为我们提供的一种可以自定义 bean 的接口，其代码示例如下:
9. 基于 BeanDefinitionRegistryPostProcessor 的方式定义 bean。Spring 提供的BeanDefinitionRegistryPostProcessor 接口的 postProcessBeanDefinitionRegistry()方法，它允许对beanDefinition 进行后置处理，我们可以在这个方法中调整 10C 容器中的 beanDefinition 的定义信息，从而干扰到后面bean 初始化的过程。其代码示例如下:
10. 基于 BeanFactoryPostProcessor 的方式定义 bean。BeanFactoryPostProcessor 是BeanDefinitionRegistryPostProcessor 接口的父接口，它同样可以实现注册 bean 的功能。两者的主要区别是:BeanDefinitionRegistryPostProcessor 侧重于 bean 的注册;而 BeanFactoryPostProcessor 则更侧重于对已经注册的 bean 的属性进行修改，虽然也可以注册 bean。代码示例如下:
11. 基于 @ComponentScan 注解的 includeFilters 属性定义 bean。该属性一旦进行了配置，即便组件类上没有被@Component 注解，它也会被扫描为一个成为一个 bean。代码示例如下:
12. 基于 AnnotatedBeanDefinitionReader 读取器的方式定义 bean。这种定义 bean 的方式虽说我们实际开发中使用的不多，但是在 Spring 源码中却有大量的使用。代码示例如下:
