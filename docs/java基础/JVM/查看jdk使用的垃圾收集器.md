### 在命令行中，可以使用 `java` 命令的 `-XX:+PrintCommandLineFlags` 参数来查看 Java 虚拟机（JVM）的默认垃圾收集器。

执行以下命令：

```sh
java -XX:+PrintCommandLineFlags -version
```

这将打印出 JVM 的启动参数信息，包括垃圾收集器相关的参数。在输出中，你可以查找类似于 `-XX:+UseParallelGC`、`-XX:+UseConcMarkSweepGC` 或 `-XX:+UseG1GC` 等参数，它们指示了当前使用的垃圾收集器。

请注意，不同的 JVM 实现和版本可能具有不同的默认垃圾收集器。因此，输出结果可能会有所不同。此外，如果在启动命令中显式指定了垃圾收集器参数（如 `-XX:+UseParallelGC`、`-XX:+UseConcMarkSweepGC` 或 `-XX:+UseG1GC`），那么将显示所指定的垃圾收集器。

另外，你也可以使用 `jinfo` 命令来查看正在运行的 Java 进程的垃圾收集器信息。例如，执行以下命令来查看进程 ID 为 `<pid>` 的 Java 进程的垃圾收集器信息：

```sh
jinfo -flag UseParallelGC <pid>
```

以上命令将显示是否启用了并行垃圾收集器。你可以将 `-flag` 参数替换为其他垃圾收集器相关的标志来查看相应的信息。

请注意，命令行选项和工具的可用性可能会因 JVM 实现和版本的不同而有所差异。因此，建议查阅特定 JVM 实现的文档以了解更多关于垃圾收集器的信息。



### 要查看 Java 中使用的垃圾收集器，可以使用以下代码片段：

```java
public class GarbageCollectorInfo {
    public static void main(String[] args) {
        List<GarbageCollectorMXBean> gcBeans = ManagementFactory.getGarbageCollectorMXBeans();
        
        for (GarbageCollectorMXBean gcBean : gcBeans) {
            System.out.println("Name: " + gcBean.getName());
            System.out.println("Collection count: " + gcBean.getCollectionCount());
            System.out.println("Collection time: " + gcBean.getCollectionTime() + "ms");
            System.out.println("Memory pools: " + Arrays.toString(gcBean.getMemoryPoolNames()));
            System.out.println();
        }
    }
}
```

运行上述代码，将打印出每个垃圾收集器的名称、垃圾收集次数、垃圾收集时间以及关联的内存池。

请注意，此代码使用 `ManagementFactory.getGarbageCollectorMXBeans()` 方法获取所有的垃圾收集器的管理 bean。然后，通过遍历这些 bean，可以获取每个垃圾收集器的详细信息。

另外，你也可以使用一些第三方工具（如 VisualVM、jstat 等）来查看更详细的垃圾收集器信息和监控。这些工具提供了图形界面和更丰富的功能，方便进行垃圾收集器的监测和分析。