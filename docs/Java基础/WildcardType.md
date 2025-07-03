· WildcardType表示的是通配符泛型，例如？extends Number和？super Integer。

WildcardType接口有两个方法，分别是：

〇 Type[] getUpperBounds（）—返回泛型变量的上界。

〇 Type[] getLowerBounds（）—返回泛型变量的下界。