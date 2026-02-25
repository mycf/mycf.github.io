`jhsdb` 是 JDK 自带的一个工具，用于执行 Java HotSpot 内部的调试命令。它提供了与 Java HotSpot 虚拟机进行交互，并收集和分析调试信息的功能。以下是一些常见的 `jhsdb` 命令的使用示例：

1. `jhsdb hsdb`：启动 `hsdb` 图形界面调试器。

   ````
   jhsdb hsdb
   ```

   这将打开 `hsdb` 图形界面调试器，允许你浏览和分析 Java HotSpot 虚拟机中的各种信息，如堆栈跟踪、线程状态、对象实例等。

2. `jhsdb jmap`：生成 Java 进程的内存快照。

   ````
   jhsdb jmap --pid <pid> --binaryheap
   ```

   将 `<pid>` 替换为 Java 进程的进程 ID。这将生成 Java 进程的内存快照，并提供有关对象分布和堆使用情况的信息。

3. `jhsdb jinfo`：显示 Java 进程的系统属性和 JVM 参数。

   ````
   jhsdb jinfo --pid <pid>
   ```

   将 `<pid>` 替换为 Java 进程的进程 ID。这将显示 Java 进程的系统属性、环境变量和 JVM 参数等信息。

4. `jhsdb jstack`：生成 Java 进程的线程堆栈跟踪。

   ````
   jhsdb jstack --pid <pid>
   ```

   将 `<pid>` 替换为 Java 进程的进程 ID。这将生成 Java 进程的线程堆栈跟踪信息，包括每个线程的状态和调用栈。

这些只是 `jhsdb` 工具的一些常见用法示例。`jhsdb` 还提供其他命令和选项，可以用于更详细和深入的调试和分析。你可以在 JDK 的安装目录中找到 `jhsdb` 工具，并使用 `jhsdb --help` 命令获取更多帮助信息和用法示例。

请注意，`jhsdb` 是一个高级工具，主要用于虚拟机调试和分析，对于普通的 Java 开发任务可能不常用。

