```java
// 默认容量为`10`
private static final int DEFAULT_CAPACITY = 10; 
private static final Object[] EMPTY_ELEMENTDATA = {};
private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};
transient Object[] elementData; // non-private to simplify nested class access
private int size;
```



使用无参构造初始化列表时，容量默认是**0**。

```java{2}
    public ArrayList() {
        this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
    }
```

```java{1,3}
    private void add(E e, Object[] elementData, int s) {
        if (s == elementData.length)
            elementData = grow();
        elementData[s] = e;
        size = s + 1;
    }
```

在使用`add`方法时，会自动扩容。

```java{2}
    private Object[] grow() {
        return grow(size + 1);
    }
```


```java
    private Object[] grow(int minCapacity) {
        int oldCapacity = elementData.length;
        if (oldCapacity > 0 || elementData != DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {// [!code highlight]
            int newCapacity = ArraysSupport.newLength(oldCapacity,
                    minCapacity - oldCapacity, /* minimum growth */
                    oldCapacity >> 1           /* preferred growth */);
            return elementData = Arrays.copyOf(elementData, newCapacity);
        } else {
            return elementData = new Object[Math.max(DEFAULT_CAPACITY, minCapacity)]; // [!code highlight]
        }
    }
```

自己指定`initialCapacity`为0，和不指定`initialCapacity`的`elementData`内部数组不同

```java
public ArrayList() {
	this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
}

public ArrayList(int initialCapacity) {
	if (initialCapacity > 0) {
		this.elementData = new Object[initialCapacity];
	} else if (initialCapacity == 0) {
		this.elementData = EMPTY_ELEMENTDATA;
	} else {
		throw new IllegalArgumentException("Illegal Capacity: "+
										   initialCapacity);
	}
}

public ArrayList(Collection<? extends E> c) {
	elementData = c.toArray();
	if ((size = elementData.length) != 0) {
		// c.toArray might (incorrectly) not return Object[] (see 6260652)
		if (elementData.getClass() != Object[].class)
			elementData = Arrays.copyOf(elementData, size, Object[].class);
	} else {
		// replace with empty array.
		this.elementData = EMPTY_ELEMENTDATA;
	}
}

```

这里分别处理了两种情况：
1. `new ArrayList()`无参构造
2. 其他两种有参构造
```java
private Object[] grow(int minCapacity) {
	int oldCapacity = elementData.length;
	// DEFAULTCAPACITY_EMPTY_ELEMENTDATA 使用无参构造
	if (oldCapacity > 0 || elementData != DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
		// 如果上送的最小容量大于原容量1.5倍，最小容量为新容量，否则为原容量1.5倍
		int newCapacity = ArraysSupport.newLength(oldCapacity,
				minCapacity - oldCapacity, /* minimum growth */
				// 右移一位（相当于原容量/2）
				oldCapacity >> 1           /* preferred growth */);
		return elementData = Arrays.copyOf(elementData, newCapacity);
	} else {
		// 这里用于new对象时没有送初始容量的情况
		return elementData = new Object[Math.max(DEFAULT_CAPACITY, minCapacity)];
	}
}

```

# modCount
`modCount` 是 ArrayList 类中的一个字段，用于记录对 ArrayList 进行结构修改的次数。

在 ArrayList 中，结构修改是指会改变 ArrayList 大小或导致迭代器失效的操作，例如添加或删除元素。每当进行这样的结构修改时，modCount 的值都会自增。

modCount 的主要作用是用于支持**快速失败机制（Fail-Fast）**。当使用迭代器遍历 ArrayList 时，迭代器会记录当前的 modCount 值。如果在迭代过程中发现 modCount 的值与初始记录的值不同，就意味着在迭代过程中有其他线程对 ArrayList 进行了结构修改，违反了预期的并发安全性。为了防止出现不确定的行为，迭代器会立即抛出 ConcurrentModificationException 异常，中断遍历过程。

通过使用 modCount，ArrayList 可以在迭代过程中及时检测到结构修改，提供了更好的并发安全性和一致性保证。它帮助开发人员在多线程环境下快速发现并发修改问题，避免潜在的错误。

# 自动扩容
ArrayList 的扩容机制是在容量不足时自动增加其内部数组的大小，以容纳更多的元素。这个过程称为动态扩容。

当 ArrayList 添加元素时，如果当前元素数量已经达到了内部数组的容量上限，就会触发扩容机制。ArrayList 会创建一个新的更大的数组，并将原始数组中的所有元素复制到新数组中。这样，ArrayList 就有了更多的空间来存储新的元素。

ArrayList 的扩容机制大致遵循以下步骤：

1. 当添加元素时，ArrayList 检查当前元素数量是否超过了内部数组的容量（即 `size` 是否等于 `capacity`）。

2. 如果当前元素数量已经达到容量上限，ArrayList 根据一定的策略进行扩容。通常，ArrayList 会将当前容量增加一半，即扩容为原始容量的 1.5 倍。

3. 创建一个新的数组，其长度为新的容量。

4. 将原始数组中的所有元素复制到新数组中。

5. 更新 ArrayList 的内部数组引用为新数组，丢弃原始数组。

6. 继续添加新元素到 ArrayList 中。

通过这种扩容机制，ArrayList 能够在需要时动态调整容量，以适应不断增长的元素数量。这样可以减少频繁的扩容操作，提高性能和效率。

需要注意的是，ArrayList 的扩容机制会带来一定的开销，因为在扩容时需要进行数组复制操作。因此，在预知需要存储大量元素的情况下，为了避免频繁的扩容操作，可以通过构造函数初始化一个足够大的初始容量，以减少扩容次数。

```java
    public boolean add(E e) {
        // 修改次数+1
        modCount++;
        //
        add(e, elementData, size);
        return true;
    }

    private void add(E e, Object[] elementData, int s) {
        // 如果当前容量已满了
        if (s == elementData.length)
            // 开始进行扩容
            elementData = grow();
        elementData[s] = e;
        size = s + 1;
    }
    private Object[] grow() {
        return grow(size + 1);
    }

    private Object[] grow(int minCapacity) {
        return elementData = Arrays.copyOf(elementData,
        newCapacity(minCapacity));
    }

    private int newCapacity(int minCapacity) {
        // overflow-conscious code
        // 获取elementData数组的内存空间长度
        int oldCapacity = elementData.length;
        // 扩容至原来的1.5倍
        int newCapacity = oldCapacity + (oldCapacity >> 1);
        //校验容量是否够
        if (newCapacity - minCapacity <= 0) {
            if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA)
                return Math.max(DEFAULT_CAPACITY, minCapacity);
            if (minCapacity < 0) // overflow
                throw new OutOfMemoryError();
            return minCapacity;
        }
        return (newCapacity - MAX_ARRAY_SIZE <= 0)
                ? newCapacity
                : hugeCapacity(minCapacity);
        }

        private static int hugeCapacity(int minCapacity) {
            if (minCapacity < 0) // overflow
                throw new OutOfMemoryError();
            return (minCapacity > MAX_ARRAY_SIZE)
                    ? Integer.MAX_VALUE
                    : MAX_ARRAY_SIZE;
        }
```


```java
int newCapacity = oldCapacity + (oldCapacity >> 1);
```
这行代码是用于计算新容量的表达式，其中 `oldCapacity` 是原始容量的值。

让我们逐步解释这行代码的含义：

1. `(oldCapacity >> 1)`：这是一j个位运算操作符，表示将 `oldCapacity` 的二进制表示向右移动一位，相当于将 `oldCapacity` 除以 2（即右移一位相当于除以 2 的整数除法）。这个操作可以有效地将原始容量减半j。

2. `oldCapacity + (oldCapacity >> 1)`：这是将原始容量 `oldCapacity` 和减半后的值相加，得到新的容量。这个计算公式可以在需要扩容的情况下，按照一定的策略（通常是增加一半）来计算新的容量。

例如，如果 `oldCapacity` 的值为 10，那么 `(oldCapacity >> 1)` 的结果为 5（10 右移一位得到 5）。然后，通过计算 `oldCapacity + (oldCapacity >> 1)`，新的容量 `newCapacity` 的值为 15（10 + 5）。

这种计算方式常用于动态数组或哈希表等数据结构的扩容操作，以平衡内存使用和性能。通过按比例增加容量，可以在一定程度上减少频繁扩容的次数，提高性能和效率。
