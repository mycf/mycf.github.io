
```java
@CallerSensitive
public static Class<?> forName(String className)
			throws ClassNotFoundException {
	Class<?> caller = Reflection.getCallerClass();
	return forName0(className, true, ClassLoader.getClassLoader(caller), caller);
}
```

