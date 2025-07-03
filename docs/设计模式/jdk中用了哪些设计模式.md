Java JDK中使用了多种设计模式来实现不同的功能和特性。以下是一些常见的设计模式及其在Java JDK中的应用：

1. 单例模式（Singleton Pattern）：
    - `java.lang.Runtime`：通过`Runtime.getRuntime()`方法获取Runtime对象的实例。

2. 工厂模式（Factory Pattern）：
    - `java.util.Calendar`：通过`Calendar.getInstance()`方法获取Calendar对象的实例。

3. 观察者模式（Observer Pattern）：
    - `java.util.Observable`和`java.util.Observer`：用于实现对象之间的观察和通知机制。

4. 适配器模式（Adapter Pattern）：
    - `java.util.Arrays`：提供了一些静态方法，用于将数组转换为集合。

5. 策略模式（Strategy Pattern）：
    - `java.util.Comparator`：用于比较对象的顺序，可以根据不同的策略进行排序。

6. 迭代器模式（Iterator Pattern）：
    - `java.util.Iterator`：用于遍历集合中的元素。

7. 模板方法模式（Template Method Pattern）：
    - `java.io.InputStream`和`java.io.OutputStream`：定义了一些抽象方法，子类可以根据需要实现具体的行为。

这只是一些常见的例子，Java JDK中还使用了其他设计模式来实现不同的功能。设计模式的使用可以提高代码的可维护性、可扩展性和重用性。