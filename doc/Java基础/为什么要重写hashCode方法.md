hashCode通用规范： ==在每个覆盖了equals方法的类中，都必须覆盖hashCode方法。==

如果对象之间是否相等需要根据对象的内容判断而不是通过对象引用地址判断。这种情况下就需要重写equals和hashcode，因为在object类上约定**相等对象**hashCode方法需要返回相同的值。因此，要重写hashcode。
 