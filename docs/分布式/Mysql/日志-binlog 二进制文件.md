二进制日志（binary log）记录了对MySQL数据库执行更改的所有操作，但是不包括SELECT和SHOW这类操作，因为这类操作对数据本身并没有修改。然而，若操作本身并没有导致数据库发生变化，那么该操作可能也会写入二进制日志。

## 作用

二进制日志主要有以下几种作用。
❑*恢复（recovery）：* 某些数据的恢复需要二进制日志，例如，在一个数据库全备文件恢复后，用户可以通过二进制日志进行point-in-time的恢复。
❑*复制（replication）：* 其原理与恢复类似，通过复制和执行二进制日志使一台远程的MySQL数据库（一般称为slave或standby）与一台MySQL数据库（一般称为master或primary）进行实时同步。
❑审计（audit）：用户可以通过二进制日志中的信息来进行审计，判断是否有对数据库进行注入的攻击。

通过配置参数log_bin=[ON/OFF]可以启动二进制日志。如果不指定name(参数[`log_bin_basename`](https://dev.mysql.com/doc/refman/5.7/en/replication-options-binary-log.html#sysvar_log_bin_basename))，则默认二进制日志文件名为主机名，后缀名为二进制日志的序列号，所在路径为数据库所在目录（datadir）
二进制日志文件在==默认情况下并没有启动==，需要手动指定参数来启动。可能有人会质疑，开启这个选项是否会==对数据库整体性能有所影响。==
不错，开启这个选项的确会影响性能，但是性能的损失十分有限。根据MySQL官方手册中的测试表明，开启二进制日志会使性能`下降1%`。但考虑到可以使用复制（replication）和point-in-time的恢复，这些性能损失绝对是可以且应该被接受的。

当使用事务的表存储引擎（如InnoDB存储引擎）时，所有未提交（uncommitted）的二进制日志会被记录到一个缓存中去，等该事务提交（committed）时直接将缓冲中的二进制日志写入二进制日志文件，而该缓冲的大小由binlog_cache_size决定，默认大小为32K。

在默认情况下，二进制日志并不是在每次写的时候同步到磁盘（用户可以理解为==缓冲写==）。因此，当数据库所在操作系统发生宕机时，可能会有最后一部分数据没有写入二进制日志文件中，这会给恢复和复制带来问题。

- [`sync_binlog=0`](https://dev.mysql.com/doc/refman/8.2/en/replication-options-binary-log.html#sysvar_sync_binlog)：禁用 MySQL 服务器将二进制日志同步到磁盘。相反，MySQL 服务器依赖操作系统将二进制日志刷新到磁盘，就像处理任何其他文件一样。此设置提供==最佳性能==，但在发生电源故障或操作系统崩溃时，服务器可能已提交尚未同步到二进制日志的事务。
  
- [`sync_binlog=1`](https://dev.mysql.com/doc/refman/8.2/en/replication-options-binary-log.html#sysvar_sync_binlog)：在提交事务之前启用二进制日志到磁盘的同步。这是最安全的设置，但由于磁盘写入次数增加，可能会对性能产生负面影响。如果发生电源故障或操作系统崩溃，二进制日志中丢失的事务仅处于准备状态。这允许自动恢复例程回滚事务，从而保证二进制日志中不会丢失任何事务。
  
- [``sync_binlog=_`N`_``](https://dev.mysql.com/doc/refman/8.2/en/replication-options-binary-log.html#sysvar_sync_binlog)，其中_`N`_是非 0 或 1 的值： 收集`N`个二进制日志提交组后，将二进制日志同步到磁盘。如果发生电源故障或操作系统崩溃，可能出现服务器已提交但尚未刷新到二进制日志的事务。

由于磁盘写入次数增加，此设置可能会对性能产生负面影响。较高的值可以提高性能，但数据丢失的风险也会增加。


参数`sync_binlog=[N]`表示每写缓冲多少次就同步到磁盘。
如果`sync_binlog=1`表示采用同步写磁盘的方式来写二进制日志，这时写操作不使用操作系统的缓冲来写二进制日志。
sync_binlog的默认值为0，如果使用InnoDB存储引擎进行复制，并且想得到最大的高可用性，建议将该值设为ON。不过该值为ON时，确实会对数据库的IO系统带来一定的影响。

​    

`InnoDB`为了在与事务一起 使用的复制设置中获得最大可能的持久性和一致性，请使用以下设置：

- [`sync_binlog=1`](https://dev.mysql.com/doc/refman/8.2/en/replication-options-binary-log.html#sysvar_sync_binlog)。
  
- [`innodb_flush_log_at_trx_commit=1`](https://dev.mysql.com/doc/refman/8.2/en/innodb-parameters.html#sysvar_innodb_flush_log_at_trx_commit)。
- 
[[日志-redolog 重做日志]]