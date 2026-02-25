
先简单看下类结构
![image.png](https://gitee.com/ycfan/images/raw/master/img/20231214141157.png)
![image.png](https://gitee.com/ycfan/images/raw/master/img/20231214141755.png)

```java
// Vector中实际存储元素的数组
protected Object[] elementData;
// 实际存储元素的个数
protected int elementCount;
// 下次自增的数量
protected int capacityIncrement;
```

可以看到`Vector`默认初始容量是10，默认自增是加一倍

```java
public Vector() {
	// 默认初始容量10
	this(10);
}
// initialCapacity 初始容量
// capacityIncrement 下次自增的大小
public Vector(int initialCapacity, int capacityIncrement) {
	super();
	if (initialCapacity < 0)
		throw new IllegalArgumentException("Illegal Capacity: "+
										   initialCapacity);
	this.elementData = new Object[initialCapacity];
	this.capacityIncrement = capacityIncrement;
}

public Vector(int initialCapacity) {
	this(initialCapacity, 0);
}

public Vector(Collection<? extends E> c) {
	Object[] a = c.toArray();
	elementCount = a.length;
	if (c.getClass() == ArrayList.class) {
	elementData = a;
	} else {
	elementData = Arrays.copyOf(a, elementCount, Object[].class);
	}
}

```

```java
private Object[] grow() {
	// 最小容量为现有元素数+1
	return grow(elementCount + 1);
}

private Object[] grow(int minCapacity) {
	int oldCapacity = elementData.length;
	int newCapacity = ArraysSupport.newLength(oldCapacity,
			// 这里获取的是最小增长的值
			minCapacity - oldCapacity, /* minimum growth */
			// capacityIncrement一般默认送空（0），所以优先增长值为原数组大小
			capacityIncrement > 0 ? capacityIncrement : oldCapacity
									   /* preferred growth */);
	return elementData = Arrays.copyOf(elementData, newCapacity);
}

```