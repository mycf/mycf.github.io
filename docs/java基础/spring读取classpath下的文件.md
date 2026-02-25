1.使用ResourceUtils
```java
		File file = ResourceUtils.getFile("classpath:foo.txt");
```
2.使用ClassPathResource
```java
		ClassPathResource classPathResource = new ClassPathResource("foo.txt");
```

