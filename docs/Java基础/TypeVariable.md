TypeVariable表示的是类型变量，它用来反映在JVM编译该泛型前的信息。例如List＜T＞中的T就是类型变量，它在编译时需被转换为一个具体的类型后才能正常使用。

该接口中常用的方法有三个，分别是：

〇 Type[] getBounds（）—获取类型变量的上边界，如果未明确声明上边界则默认为Object。例如class Test＜K extends Person＞中K的上界就是Person。

〇 D getGenericDeclaration（）—获取声明该类型变量的原始类型，例如class Test＜K extends Person＞中的原始类型是Test。

〇 String getName（）—获取在源码中定义时的名字，上例中为K。

· GenericArrayType表示的是数组类型且组成元素是ParameterizedType或TypeVariable。例如List＜String＞[]或T[]。该接口只有Type getGenericComponentType（）一个方法，它返回数组的组成元素。

