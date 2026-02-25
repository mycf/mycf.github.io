[`ONLY_FULL_GROUP_BY`](https://dev.mysql.com/doc/refman/8.0/en/sql-mode.html#sqlmode_only_full_group_by)

`ONLY_FULL_GROUP_BY`是MySQL中的一个SQL模式，它用于设置查询中GROUP BY子句的行为。当启用了`ONLY_FULL_GROUP_BY`模式时，如果SELECT列表、HAVING条件或ORDER BY列表引用了非聚合列，并且这些列既没有在GROUP BY子句中命名，也不是依赖于（由GROUP BY列唯一确定的）GROUP BY列的函数依赖关系，则会拒绝这些查询。

在SQL中，GROUP BY子句用于将行分组为汇总结果，并对每个组应用聚合函数。聚合函数对每个组返回一个单一的结果，而非聚合列则是指除了聚合函数之外的其他列。

函数依赖是指在关系数据库中，一个或多个列的值可以唯一确定另一个列的值。在GROUP BY子句中，只有那些与GROUP BY列具有函数依赖关系的非聚合列才能被引用。

通过启用ONLY_FULL_GROUP_BY模式，可以确保所有的非聚合列要么在GROUP BY子句中命名，要么与GROUP BY列具有函数依赖关系，从而避免了潜在的查询结果不确定性和错误。

添加`ONLY_FULL_GROUP_BY`
```mysql
SET SESSION sql_mode = sys.list_add(@@session.sql_mode, 'ONLY_FULL_GROUP_BY');
```

删除`ONLY_FULL_GROUP_BY`
```mysql
SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));
```

```sh
mysql> select @@sql_mode;
+----------------------------------------------------------------------------------------------------+
| @@sql_mode                                                                                         |
+----------------------------------------------------------------------------------------------------+
| STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION |
+----------------------------------------------------------------------------------------------------+
1 row in set (0.00 sec)

mysql> select id from ht group by amount;
+----+
| id |
+----+
|  1 |
|  2 |
|  3 |
|  4 |
+----+
4 rows in set (0.00 sec)

mysql> SET SESSION sql_mode = sys.list_add(@@session.sql_mode, 'ONLY_FULL_GROUP_BY');
Query OK, 0 rows affected (0.32 sec)

mysql> select id from ht group by amount;                                           ERROR 1055 (42000): Expression #1 of SELECT list is not in GROUP BY clause and contains nonaggregated column 'yu.ht.id' which is not functionally dependent on columns in GROUP BY clause; this is incompatible with sql_mode=only_full_group_by
mysql> select @@sql_mode;
+-----------------------------------------------------------------------------------------------------------------------+
| @@sql_mode                                                                                                            |
+-----------------------------------------------------------------------------------------------------------------------+
| ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION |
+-----------------------------------------------------------------------------------------------------------------------+
1 row in set (0.00 sec)
```