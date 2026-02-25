#### TC (Transaction Coordinator) - 事务协调者[​](https://seata.io/zh-cn/docs/overview/terminology#tc-transaction-coordinator---%E4%BA%8B%E5%8A%A1%E5%8D%8F%E8%B0%83%E8%80%85 "TC (Transaction Coordinator) - 事务协调者的直接链接")

维护全局和分支事务的状态，驱动全局事务提交或回滚。

#### TM (Transaction Manager) - 事务管理器[​](https://seata.io/zh-cn/docs/overview/terminology#tm-transaction-manager---%E4%BA%8B%E5%8A%A1%E7%AE%A1%E7%90%86%E5%99%A8 "TM (Transaction Manager) - 事务管理器的直接链接")

定义全局事务的范围：开始全局事务、提交或回滚全局事务。

#### RM (Resource Manager) - 资源管理器[​](https://seata.io/zh-cn/docs/overview/terminology#rm-resource-manager---%E8%B5%84%E6%BA%90%E7%AE%A1%E7%90%86%E5%99%A8 "RM (Resource Manager) - 资源管理器的直接链接")

管理分支事务处理的资源，与TC交谈以注册分支事务和报告分支事务的状态，并驱动分支事务提交或回滚。
