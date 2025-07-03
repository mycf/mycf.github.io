ParameterizedType表示的是参数化类型，例如List＜String＞、Map＜Integer,String＞、Service＜User＞这种带有泛型的类型。

ParameterizedType接口中常用的方法有三个，分别是：

〇 Type getRawType（）—返回参数化类型中的原始类型，例如List＜String＞的原始类型为List。

〇 Type[] getActualTypeArguments（）—获取参数化类型的类型变量或是实际类型列表，例如Map＜Integer, String＞的实际泛型列表Integer和String。需要注意的是，该列表的元素类型都是Type，也就是说，可能存在多层嵌套的情况。

〇 Type getOwnerType（）—返回是类型所属的类型，例如存在A＜T＞类，其中定义了内部类InnerA＜I＞，则InnerA＜I＞所属的类型为A＜T＞，如果是顶层类型则返回null。这种关系比较常见的示例是Map＜K,V＞接口与Map.Entry＜K,V＞接口，Map＜K,V＞接口是Map.Entry＜K,V＞接口的所有者。