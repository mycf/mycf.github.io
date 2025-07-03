简单介绍一下，通过`META-INF/services`中创建一个对应接口的文件，里面指定实现类，可以是多个。

```java
public interface UserService {
    void getName();
}
```

```java
public class UserServiceImpl implements UserService {
    @Override
    public void getName() {
        System.out.println(this.getClass().getName() + "hello spi");
    }
}

```

```java
public class YuUserServiceImpl implements UserService {
    @Override
    public void getName() {
        System.out.println(this.getClass().getName() + "hello yu");
    }
}
```

`META-INF/services/com.example.demo.java.UserService`
```txt
com.example.demo.java.UserServiceImpl
com.example.demo.java.YuUserServiceImpl
```


```java
    ServiceLoader<UserService> serviceLoader = ServiceLoader.load(UserService.class);
    Iterator<UserService> serviceIterator = serviceLoader.iterator();
    while (serviceIterator.hasNext()) {
      UserService service = serviceIterator.next();
      service.getName();
    }
```
执行后打印如下：
```sh
> Task :SPITest.main()
com.example.demo.java.UserServiceImplhello spi
com.example.demo.java.YuUserServiceImplhello yu
```

