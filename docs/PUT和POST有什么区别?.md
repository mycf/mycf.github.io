# PUT和POST有什么区别?


(来自于)[https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/PUT-vs-POST-Whats-the-difference]

PUT方法和POST方法之间的关键区别在于，PUT方法仅限于创建或更新操作，而POST操作可以执行任何类型的处理。与POST不同，PUT操作只能操作由提供的URL标识的资源。不论URL如何，HTTP POST都允许在任何服务器端资源上进行处理。

POST操作应优先考虑与URL标识的资源有从属关系的资源。RESTful API和操作应在它们操作资源和生成结果的方式上具有可预测性。

# HTTP PUT方法示例

想象一个航班跟踪系统，用户可以在以下URL上查找美国航空公司航班123的状态：
```markdown
www.example.com/AA123
```
要更新AA123航班的状态，Web服务执行PUT操作到该URL。
PUT操作包括一个JSON或XML有效负载，完整描述了新状态：
PUT URL：www.example.com/flights/AA123
有效负载：{"status":"ontime", "gate":"b12"}

##### HTTP PUT创建示例
现在，假设我们需要为加拿大航空公司航班789创建一个新条目。
尚不存在描述该航班的URL，但我们知道在创建后URL将为：
```
www.example.com/AC789
```
由于在请求其创建之前我们知道资源的期望URL，因此我们必须使用PUT操作。
```
PUT URL: www.example.com/flights/AC789
PAYLOAD: {"status":"late", "gate":"c17"}
```

# HTTP POST方法示例
当客户端请求在服务器上创建资源时，它并不总是知道服务器将为该资源分配的URL。
当使用POST操作在服务器上创建资源时，该资源被创建为URL提供的POST操作的从属资源。这使得HTTP PUT和POST方法形成了鲜明对比，因为PUT操作需要准确的要创建或更新的资源URL。

在数据库驱动应用程序中，在资源数据写入表后生成的值用于标识新创建的资源时，不知道资源的确切URL是常见情况。
基于主键的标识符属于这一类别。
如果需要创建一个从属于提供的URL的资源，应使用POST方法，而不是HTTP PUT方法。
例如，要创建一个新客户，RESTful微服务使用HTTP协议的POST方法。提供用于创建新客户所需的所有信息作为请求有效负载中的JSON或XML：
```
POST URL: www.example.com/customers
PAYLOAD: {"name":"Joe", "age":"29", "city":"ajax"}
```

### HTTP POST创建示例

当服务器完成此请求时，它将创建一个唯一标识新资源的新URL。
以下示例显示了数据库驱动应用程序为此新客户生成的可能URL：
```
www.example.com/customers/j567
```
当POST操作创建一个新URL时，REST要求将新URL作为位置标头发送回调用程序。这允许调用程序将来使用PUT操作进行更新。
这就是为什么PUT和POST操作之间的区别通常被表述为：要创建对象，请使用POST。更新应使用PUT。这是对HTTP动词目的的过度简化，并且绝不应将HTTP方法映射到基于SQL的CRUD操作。然而，作为高级简化，这是允许的。

## POST和PUT幂等性
HTTP协议对PUT操作施加的一个规则是它们必须是幂等的。幂等性从未对POST操作提出要求。
要具有幂等性，一个操作可以被调用一次或100次，服务器上的结果都将相同。

## PUT 和 POST 方法的幂等性示例
例如，我执行 PUT 操作将我的银行帐户余额设置为 100 美元。即使我执行该操作 100 次，最终结果也是 100 美元的余额。

相反，如果我执行 100 个 POST 操作，每个操作都会使我的帐户余额增加 10%，则每次交互的结果都会产生不同的结果。这不是幂等操作。

PUT 方法仅允许幂等操作。POST 方法不受幂等性要求的约束。

PUT是幂等的，POST不是。

## 我应该使用PUT还是POST？
HTTP规范[RFC 7231](https://www.rfc-editor.org/rfc/rfc7231#section-4.3.4) 非常明确地指出，PUT方法仅用于执行幂等的创建或更新操作：
*PUT方法请求使用请求消息有效负载中封装的表示定义来创建或替换目标资源的状态。*

与PUT不同，POST操作不仅限于创建和更新。HTTP规范还指出，收到POST调用时，服务器可以选择并实现任何逻辑来支持该请求：
```
POST方法请求目标资源根据资源自身的特定语义处理请求中所包含的表示形式。
```
这就是为什么许多 RESTful API 广泛使用 HTTP 协议的 POST 方法。如果某个功能或服务没有完全映射到 HTTP 协议的 GET、PUT、PATCH 或 DELETE 方法之一，则会使用 POST 方法。

当软件架构师构建和设计 RESTful API 时，尊重 HTTP 协议各种方法的使用方式非常重要。这包括了解何时使用 HTTP PUT 与 POST 操作之间的区别。

