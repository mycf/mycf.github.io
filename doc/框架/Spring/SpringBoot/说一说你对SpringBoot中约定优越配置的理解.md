#面试 
首先***约定优于配置***是一种软件设计范式，它的核心思想是==减少软件开发人员对于配置项的维护，从而让开发人员更加聚焦在业务逻辑上。==

spring boot 就是约定优于配置这一理念下的产物，它类似于 spring 框架下的一个脚手架，通过 spring boot 我们可以快速开发基于spring生态下的应用程序。

基于传统的 spring 框架开发 web 应用，我们需要做很多和业务开发无关的并且只做一次的配置，比如说管理 jar 包的依赖，web.xml 文件的维护，dispatchServlet.xml 配置项的一个维护，应用部署到web容器以及第三方组件集成、spring IOC 容器中的配置项的维护，而在 spring boot 中我们不需要再去做这些繁琐的配置，spring boot 已经自动帮我们去完成，这就是约定优于配置思想的体现。

spring boot 约定优于配置的体现有很多，比如spring-boot-starter启动依赖项，它能帮助我们管理所有jar包的版本。其次如果当前应用依赖了spring mvc相关的jar包，那么 spring boot会帮我们自动内置它们；开启容器来运行 web 应用，我们不需要再去单独做应用部署，以及 spring boot 的自动装配机制的实现中，通过扫描约定路径下的 *spring.factories* 文件来识别配置类，实现bean的自动装配。最后还有默认加载的配置文件 *application.properties* 等等。

总的来说 约定优于配置是一个比较常见的软件设计思想，它的核心本质都是为了更高效以及更加便捷地实现软件系统的开发和维护。