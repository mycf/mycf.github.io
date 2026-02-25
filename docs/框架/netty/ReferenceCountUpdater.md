
满足了 `(rawCnt & 1) != 0` 条件的情况一定满足 `rawCnt != 2 && rawCnt != 4` 这里为什么还要&&相连
1. `x == y` 的性能优于 `x & y`
2. 这里对常见的低值进行了优化（1、2）

```java
private static int realRefCnt(int rawCnt) {
	return rawCnt != 2 && rawCnt != 4 && (rawCnt & 1) != 0 ? 0 : rawCnt >>> 1;
}
```
## 为什么要用2的倍数作为引用计数？

因为某次性能优化，把retain0方法中的CAS修改引用计数，改为了getAndAdd，这样性能更好。但是随之而来的就是一个bug，当多线程操作同一个buffer的引用计数时，会发生问题。

考虑场景：一个object的refCnt为1。有3个线程修改这个object的引用计数。

- 线程1调用obj.release()，修改refCnt为0，此时obj应该被进一步执行deallocate。
- 线程2调用obj.retain()，修改refCnt为1，发现oldRef为0，然后去进行回滚getAndAdd(-1)并抛出异常。
- 由于上一步的修改和回滚是两步操作，并不是原子的。所以在回滚前refCnt还是1，此时线程3调用obj.retain()，修改refCnt为2，oldRef为1，**线程3认为这是一个存活的对象，并不会抛出异常**。
- 线程1调用obj.deallocate()，释放了obj。

经过修复后，一个object的refCnt初始值为2j，代表有一个引用。有3个线程修改这个object的引用计数。

- 线程1调用 obj.release()，修改 refCnt 为奇数，实现里是修改为1，此时 obj 应该被进一步执行deallocate。
- 线程2调用 obj.retain()，修改 refCnt 为3，发现oldRef为1是奇数，直接抛出异常。
- 此时线程3调用 obj.retain()，修改 refCnt 为5，发现oldRef为3是奇数，直接抛出异常。

  
