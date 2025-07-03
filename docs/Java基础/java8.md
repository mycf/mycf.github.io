函数式接口就是只定义一个抽象方法的接口。

@FunctionalInterface又是怎么回事?  
如果你去看看新的Java API，会发现函数式接口带有@FunctionalInterface的标注(3.4 节中会深入研究函数式接口，并会给出一个长长的列表)。==这个标注用于表示该接口会设计成一个函数式接口。如果你用@FunctionalInterface定义了一个接口，而它却不是函数式接口的话，编译器将返回一个提示原因的错误。==例如，错误消息可能是“Multiple non-overriding abstract methods found in interface Foo”，表明存在多个抽象方法。请注意，@FunctionalInterface不是必需的，但对于为此设计的接口而言，使用它是比较好的做法。它就像是@Override 标注表示方法被重写了。
# 方法引用
方法引用让你可以重复使用现有的方法定义，并像Lambda一样传递它们。

方法引用主要有三类。  
(1) 指向静态方法的方法引用（例如Integer的parseInt方法，写作`Integer::parseInt`）。
(2) 指向任意类型实例方法的方法引用（例如String的length方法，写作 `String::length`）。
(3) 指向现有对象的实例方法的方法引用（假设你有一个局部变量expensiveTransaction 用于存放Transaction类型的对象，它支持实例方法getValue，那么你就可以写expensiveTransaction::getValue）。

类似于String::length的第二种方法引用的思想就是你在引用一个对象的方法，而这个对象本身是Lambda的一个参数。例如，Lambda 表达式(String s) -> s.toUppeCase()可以写作String::toUpperCase。但第三种方法引用 指的是，你在Lambda中调用一个已经存在的外部对象中的方法。例如，Lambda表达式 ()->expensiveTransaction.getValue()可以写作expensiveTransaction::getValue。

