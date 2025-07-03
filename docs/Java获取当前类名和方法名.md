## 获取class名:
```java
this.getClass().getName();
或者
Thread.currentThread().getStackTrace()[1].getClassName();

```
## 获取方法名:
```java
Thread.currentThread().getStackTrace()[1].getMethodName();
```

## 获取行号:

```java
Thread.currentThread().getStackTrace()[1].getLineNumber();
```

## 获取文件名(带后缀):

```java
Thread.currentThread().getStackTrace()[1].getFileName();
```