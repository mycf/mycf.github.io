
在 Java 8 及更高版本中，使用 `-parameters` 编译标志可以开启参数名称的保留。这个标志告诉 Java 编译器在编译源代码时保留方法和构造函数的参数名称信息。

默认情况下，Java 编译器在编译过程中会丢弃方法和构造函数的参数名称。这意味着在编译后的字节码中，参数名称会被替换为类似 arg0、arg1 等的形式，而不是实际的参数名称。

通过使用 -parameters 标志编译源代码，编译后的字节码将保留方法和构造函数的参数名称，使得在运行时可以通过反射等方式获取参数的实际名称。这对于某些框架、库和工具在运行时需要访问参数名称的情况非常有用。
```xml
  <plugin>
	<groupId>org.apache.maven.plugins</groupId>
	<artifactId>maven-compiler-plugin</artifactId>
	<configuration>
	  <parameters>true</parameters>
	</configuration>
  </plugin>
```
https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.2-Release-Notes#parameter-name-discovery