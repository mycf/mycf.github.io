1. 根据 Spring Boot 提供的 spring-boot-maven-plugin 插件把应用程序打包成一个可执行的 Jar 包文件;
2. 通过 java -jar 命令执行该 Jar 包文件;
3. 首先 JVM 还是会使用 AppClassLoader 加载 MANIFEST.MF 文件中的 Main-Class，即 JarLauncher 启动类，并执行其 main方法;
4. 创建一个 LaunchedURLClassLoader 的类加载器并设置到当前线程中。该类加载器的作用就是负责加载 BOOT-INF/classes 下的应用程序编译后的 class 文件和 BOOT-INF/lib 下的应用程序依赖的第三方 Jar 包文件;
5. 通过反射执行获取我们自己开发的启动类的类对象，并执行其 main()。
6. 开启 Spring Boot 的启动流程。