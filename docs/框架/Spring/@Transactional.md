
# 使用
## java
```java
@Configuration
@EnableTransactionManagement
public class AppConfig {

  @Bean
  public FooRepository fooRepository() {
	  // configure and return a class having @Transactional methods
	  return new JdbcFooRepository(dataSource());
  }

  @Bean
  public DataSource dataSource() {
	  // configure and return the necessary JDBC DataSource
  }

  @Bean
  public PlatformTransactionManager txManager() {
	  return new DataSourceTransactionManager(dataSource());
  }
}
```
## xml
在 Spring 中，要开启事务，你可以按照以下步骤进行操作：

1. 配置事务管理器：首先，在 Spring 配置文件中配置事务管理器（Transaction Manager）。事务管理器负责管理事务的生命周期，它与数据源（如数据库）进行交互，并协调事务的提交或回滚。你需要选择适合你的数据源的事务管理器，如 DataSourceTransactionManager、HibernateTransactionManager 等，并将其配置在 Spring 配置文件中。

   例如，使用 DataSourceTransactionManager 配置事务管理器：

```xml
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
   <property name="dataSource" ref="dataSource" />
</bean>
```

2. 开启事务支持：在 Spring 配置文件中，需要添加 `<tx:annotation-driven>` 元素来开启事务的支持。这会告诉 Spring 在执行带有 `@Transactional` 注解的方法时，启动事务管理器。

```xml
<tx:annotation-driven />
```

3. 声明事务边界：在需要进行事务管理的方法上，使用 `@Transactional` 注解来声明事务的边界。`@Transactional` 注解可以应用在方法级别或类级别上。

   例如，对于方法级别的事务声明：

```java
@Transactional
public void myTransactionalMethod() {
   // 方法体
}
```

   或者对于类级别的事务声明：

```java
@Transactional
public class MyTransactionalClass {
   // 方法和业务逻辑
}
```

`@Transactional` 注解可以接受一些属性，如隔离级别、传播行为、只读等，你可以根据需求进行配置。

4. 启动 Spring 容器：确保你的 Spring 容器已经启动，以便 Spring 能够扫描并识别带有 `@Transactional` 注解的方法，以及启动事务管理器。

当带有 `@Transactional` 注解的方法被调用时，Spring AOP 和事务管理器会协同工作，自动启动、提交或回滚事务，以保证数据的一致性和完


[AnnotationTransactionAspect](https://github.com/spring-projects/spring-framework/blob/main/spring-aspects/src/main/java/org/springframework/transaction/aspectj/AbstractTransactionAspect.aj)