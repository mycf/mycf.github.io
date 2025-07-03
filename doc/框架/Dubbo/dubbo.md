
```java
List<T> org.apache.dubbo.common.extension.ExtensionLoader.getActivateExtension(URL url, String key)
```


| 层次名 | 作用 |
| ---- | ---- |
| Service | 业务层。包括业务代码的接口与实现，即开发者实现的业务代码。 |
| config | 配置层。主要围绕ServiceConfig（暴露的服务配置）和ReferenceConfig（引用的服务配置）两个实现类展开，初始化配置信息，可以理解该层管理了整个Dubbo的配置。 |
| proxy | 服务代理层。在 Dubbo 中，无论生产者还是消费者，框架都会生成一个代理类，整个过程对上层是透明的。当调用一个远程接口时,看起来就像是调用了一个本地的接口一样,代理层会自动做远程调用并返回结果，即让业务层对远程调用完全无感 |
| registry<br> | 注册层。负责 Dubbo 框架的服务注册与发现。当有新的服务加入或旧服务下线时，注册中心都会感知并通知给所有订阅方。整个过程不需要人工参与 |
| cluster | 集群容错层。该层主要负责:远程调用失败时的容错策略(如失败重试、快速失败);选择具体调用节点时的负载均衡策略(如随机、一致性 Hash 等);特殊调用路径的路由策略(如某个消费者只会调用某个 的生产者) |
| monitor | 监控层。这一层主要负责监控统计调用次数和调用时间等 |
| protocol | 远程调用层。封装 RPC 调用具体过程，Protocol是 Invoker 暴露(发布一个服务让别人可以调用)和引用(引用一个远程服务到本地)的主功能入口，它负责管理Invoker 的整个生命周期。Invoker 是 Dubbo 的核心模型，框架中所有其他模型都向它靠拢，或者转换成它，它代表一个可执行体。允许向它发起invoke 调用，它可能是执行一个本地的接口实现，也可能是一个远程的实现，还可能一个集群实现 |
| exchange | 信息交换层。建立 Request-Response 模型，封装请求响应模式，如把同步请求转化为异步请求 |
| transport | 网络传输层。把网络传输抽象为统一的接口，如 Mina 和 Netty 虽然接口不一样，但是Dubbo 在它们上面又封装了统一的接口。用户也可以根据其扩展接口添加更多的网络传输方式 |
| Serialize |  序列化层。如果数据要通过网络进行发送，则需要先做序列化，变成二进制流。序列化层负责管理整个框架网络传输时的序列化/反序列化工作 |





# 负载均衡

![img](https://img-blog.csdnimg.cn/20210508201651489.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MzkzNDYwNw==,size_16,color_FFFFFF,t_70)

