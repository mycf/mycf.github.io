1. 加锁 setnx(set if not exists)
2. 解锁 del解锁
3. 超时 expire 同时设置超时时间
4. 可重入