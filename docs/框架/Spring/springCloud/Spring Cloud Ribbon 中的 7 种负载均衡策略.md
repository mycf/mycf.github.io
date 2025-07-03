#面试 
[负载均衡](https://cloud.tencent.com/product/clb?from_column=20065&from=20065)通器常有两种实现手段，一种是服务端[负载均衡器](https://cloud.tencent.com/product/clb?from_column=20065&from=20065)，另一种是客户端负载均衡器，而我们今天的主角 Ribbon 就属于后者——客户端负载均衡器。

**服务端负载均衡器的问题是，它提供了更强的流量控制权，但无法满足不同的消费者希望使用不同负载均衡策略的需求，而使用不同负载均衡策略的场景确实是存在的，所以客户端负载均衡就提供了这种灵活性。** 然而客户端负载均衡也有其缺点，如果配置不当，可能会导致服务提供者出现热点，或者压根就拿不到任何服务的情况，所以我们本文就来了解一下这 7 种内置负载均衡策略的具体规则。

### Ribbon 介绍

Ribbon 是 Spring Cloud 技术栈中非常重要的基础框架，它为 Spring Cloud 提供了负载均衡的能力，比如 Fegin 和 OpenFegin 都是基于 Ribbon 实现的，就连 Nacos 中的负载均衡也使用了 Ribbon 框架。

Ribbon 框架的强大之处在于，它不仅内置了 7 种负载均衡策略，同时还支持用户自定义负载均衡策略，所以其开放性和便利性也是它得以流行的主要原因。

服务端负载均衡器和客户端负载均衡器的区别如下图所示：

![image.png](https://ask.qcloudimg.com/http-save/yehe-1740031/deaf7758350c0a5cb797b99641783dec.png)

image.png

客户端负载均衡器的实现原理是通过[注册中心](https://cloud.tencent.com/product/tse?from_column=20065&from=20065)，如 Nacos，将可用的服务列表拉取到本地（客户端），再通过客户端负载均衡器（设置的负载均衡策略）获取到某个服务器的具体 ip 和端口，然后再通过 Http 框架请求服务并得到结果，其执行流程如下图所示：

![image.png](https://ask.qcloudimg.com/http-save/yehe-1740031/9bfe3c15443a5f85b9f16999f7425cc3.png)

image.png

### 负载均衡设置

以 Nacos 中的 Ribbon 负载均衡设置为例，在配置文件 application.yml 中设置如下配置即可：

```javascript
springcloud-nacos-provider: # nacos中的服务id
  ribbon:
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RoundRobinRule #设置负载均衡策略
```

复制

因为 Nacos 中已经内置了 Ribbon，所以在实际项目开发中无需再添加 Ribbon 依赖了，这一点我们在 Nacos 的依赖树中就可以看到，如下图所示：

![image.png](https://ask.qcloudimg.com/http-save/yehe-1740031/30578a30e90a01c1c2746ebb7d638421.png)

image.png

Ribbon 默认的负载均衡策略是轮询模式，我们配置 3 个服务提供者的执行结果如下图所示：

![轮询.gif](https://ask.qcloudimg.com/http-save/yehe-1740031/dab009b13cf5a05b117ff91b80536fc8.gif)

轮询.gif

然后，我们再将 Ribbon 负载均衡策略设置为随机模式，配置内容如下：

```javascript
springcloud-nacos-provider: # nacos中的服务id
  ribbon:
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RandomRule #设置随机负载均衡
```

复制

重启客户端，执行结果如下图所示：

![随机策略.gif](https://ask.qcloudimg.com/http-save/yehe-1740031/6bf2ae9d3972b67879d385d95377becf.gif)

随机策略.gif

### 7种负载均衡策略

#### 1.轮询策略

轮询策略：RoundRobinRule，按照一定的顺序依次调用服务实例。比如一共有 3 个服务，第一次调用服务 1，第二次调用服务 2，第三次调用服务3，依次类推。 此策略的配置设置如下：

```javascript
springcloud-nacos-provider: # nacos中的服务id
  ribbon:
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RoundRobinRule #设置负载均衡
```

复制

#### 2.权重策略

权重策略：WeightedResponseTimeRule，根据每个服务提供者的响应时间分配一个权重，响应时间越长，权重越小，被选中的可能性也就越低。 它的实现原理是，刚开始使用轮询策略并开启一个计时器，每一段时间收集一次所有服务提供者的平均响应时间，然后再给每个服务提供者附上一个权重，权重越高被选中的概率也越大。 此策略的配置设置如下：

```javascript
springcloud-nacos-provider: # nacos中的服务id
  ribbon:
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.WeightedResponseTimeRule
```

复制

#### 3.随机策略

随机策略：RandomRule，从服务提供者的列表中随机选择一个服务实例。 此策略的配置设置如下：

```javascript
springcloud-nacos-provider: # nacos中的服务id
  ribbon:
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RandomRule #设置负载均衡
```

复制

#### 4.最小连接数策略

最小连接数策略：BestAvailableRule，也叫最小并发数策略，它是遍历服务提供者列表，选取连接数最小的⼀个服务实例。如果有相同的最小连接数，那么会调用轮询策略进行选取。 此策略的配置设置如下：

```javascript
springcloud-nacos-provider: # nacos中的服务id
  ribbon:
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.BestAvailableRule #设置负载均衡
```

复制

#### 5.重试策略

重试策略：RetryRule，按照轮询策略来获取服务，如果获取的服务实例为 null 或已经失效，则在指定的时间之内不断地进行重试来获取服务，如果超过指定时间依然没获取到服务实例则返回 null。 此策略的配置设置如下：

```javascript
ribbon:
  ConnectTimeout: 2000 # 请求连接的超时时间
  ReadTimeout: 5000 # 请求处理的超时时间
springcloud-nacos-provider: # nacos 中的服务 id
  ribbon:
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RandomRule #设置负载均衡
```

复制

#### 6.可用性敏感策略

可用敏感性策略：AvailabilityFilteringRule，先过滤掉非健康的服务实例，然后再选择连接数较小的服务实例。 此策略的配置设置如下：

```javascript
springcloud-nacos-provider: # nacos中的服务id
  ribbon:
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.AvailabilityFilteringRule
```

复制

#### 7.区域敏感策略

区域敏感策略：ZoneAvoidanceRule，根据服务所在区域（zone）的性能和服务的可用性来选择服务实例，在没有区域的环境下，该策略和轮询策略类似。 此策略的配置设置如下：

```javascript
springcloud-nacos-provider: # nacos中的服务id
  ribbon:
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.ZoneAvoidanceRule
```

复制

### 项目源码

[https://gitee.com/mydb/spring-cloud-alibaba-example](/developer/tools/blog-entry?target=https%3A%2F%2Fgitee.com%2Fmydb%2Fspring-cloud-alibaba-example&source=article&objectId=1998102)

### 总结

Ribbon 为客户端负载均衡器，相比于服务端负载均衡器的统一负载均衡策略来说，它提供了更多的灵活性。Ribbon 内置了 7 种负载均衡策略：轮询策略、权重策略、随机策略、最小连接数策略、重试策略、可用性敏感策略、区域性敏感策略，并且用户可以通过继承 RoundRibbonRule 来实现自定义负载均衡策略。

本文转自 <https://cloud.tencent.com/developer/article/1998102>，如有侵权，请联系删除。