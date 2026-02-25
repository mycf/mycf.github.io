首先，Spring MVC 是 Spring Framework 项目中的一个模块，它是在 Servlet 的基础上进行构建的一个Web 框架，它是一个典型的 MVC 软件设计模型。

Spring MVC 的整体架构设计对传统的 MVC 架构模式做了增强和扩展，主要体现在以下几个方面
1. 把传统 MVC 框架中的 Controller 控制器拆分成了前端控制器 DispatcherServlet 和后端处理器 Handler两部分;
2. 把 Model 模型拆分成了业务逻辑层和数据访问层
	- `Service 层`：业务逻辑层。
	- `DAO 层`：数据访问层，与底层 MySQL、Oracle、HBase 等进行数据交互。
3. 在视图层，可以支持不同的视图，比如:JSP、Freemark、Thymeleaf 等。

Spring MVC 包含以下几个核心组件:
1. 前端控制器 DispatcherServlet
2. 处理器映射器 HandlerMapping
3. 处理器适配器 HandlerAdapter
4. 视图解析器 ViewResolver。它的主要作用是将视图名解析为具体的视图对象。Spring MVC 提供了多种类型的 ViewResolver，不同类型的 ViewResolver 会使用不同的解析策略和算法，比如
  InternalResourceViewResolver 主要用于解析 JSP 或 HTML 等资源文件;
  FreeMarkerViewResolver 主要用于解析 FreeMarker 模板;
  TilesViewResolver 主要用于解析 Tiles 布局;
  ContentNegotiatingViewResolver 则是一个复合视图解析器，可以根据请求的 Accept 头信息来选择对应的视图解析器进行解析 
