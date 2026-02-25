方法句柄（Method Handle）是Java中的一种引用，它提供了对方法的动态调用和访问的能力。在Java虚拟机中，有四种类型的方法句柄，分别是：`REF_getStatic`、`REF_putStatic`、`REF_invokeStatic`和`REF_newInvokeSpecial`。下面给出每种类型方法句柄的示例：

1. `REF_getStatic`：用于获取静态字段的值。

```java
import java.lang.invoke.MethodHandle;
import java.lang.invoke.MethodHandles;

public class GetStaticExample {
    public static int staticField = 42;

    public static void main(String[] args) throws Throwable {
        MethodHandles.Lookup lookup = MethodHandles.lookup();
        MethodHandle getter = lookup.findStaticGetter(GetStaticExample.class, "staticField", int.class);
        int value = (int) getter.invokeExact();
        System.out.println(value); // Output: 42
    }

}
```

在上述示例中，通过`MethodHandles.Lookup`类的`findGetter`方法获取了对`staticField`静态字段的`REF_getStatic`方法句柄。然后，使用`invokeExact`方法调用该方法句柄，获取静态字段的值并打印输出。

2. `REF_putStatic`：用于设置静态字段的值。

```java
import java.lang.invoke.MethodHandle;
import java.lang.invoke.MethodHandles;

public class PutStaticExample {
    public static int staticField;

    public static void main(String[] args) throws Throwable {
        MethodHandles.Lookup lookup = MethodHandles.lookup();
        MethodHandle setter = lookup.findStaticSetter(PutStaticExample.class, "staticField", int.class);
        setter.invokeExact(42);
        System.out.println(staticField); // Output: 42
    }
}
```

在上述示例中，通过`MethodHandles.Lookup`类的`findSetter`方法获取了对`staticField`静态字段的`REF_putStatic`方法句柄。然后，使用`invokeExact`方法调用该方法句柄，将值`42`设置给静态字段，并打印输出。

3. `REF_invokeStatic`：用于调用静态方法。

```java
import java.lang.invoke.MethodHandle;
import java.lang.invoke.MethodHandles;
import java.lang.invoke.MethodType;

public class InvokeStaticExample {
    public static void staticMethod(int value) {
        System.out.println("Static method called with value: " + value);
    }

    public static void main(String[] args) throws Throwable {
        MethodHandles.Lookup lookup = MethodHandles.lookup();
        MethodType methodType = MethodType.methodType(void.class, int.class);
        MethodHandle methodHandle = lookup.findStatic(InvokeStaticExample.class, "staticMethod", methodType);
        methodHandle.invokeExact(42);
    }
}
```

在上述示例中，通过`MethodHandles.Lookup`类的`findStatic`方法获取了对`staticMethod`静态方法的`REF_invokeStatic`方法句柄。然后，使用`invokeExact`方法调用该方法句柄，将值`42`作为参数传递给静态方法，并输出相应的结果。

4. `REF_newInvokeSpecial`：用于调用构造函数。

```java
import java.lang.invoke.MethodHandle;
import java.lang.invoke.MethodHandles;
import java.lang.invoke.MethodType;

public class NewInvokeSpecialExample {
    public static class MyClass {
        private int value;

        public MyClass(int value) {
            this.value = value;
        }

        public void printValue() {
            System.out.println("Value: " + value);
        }
    }

    public static void main(String[] args) throws Throwable {
        MethodHandles.Lookup lookup = MethodHandles.lookup();
        MethodType constructorType = MethodType.methodType(void.class, int.class);
        MethodHandle constructorHandle = lookup.findConstructor(MyClass.class, constructorType);
        MyClass instance = (MyClass) constructorHandle.invokeExact(42);
        instance.printValue(); // Output: Value: 42
    }
}
```

在上述示例中，通过`MethodHandles.Lookup`类的`findConstructor`方法获取了对`MyClass`构造函数的`REF_newInvokeSpecial`方法句柄。然后，使用`invokeExact`方法调用该方法句柄，创建了一个新的`MyClass`实例，并将值`42`作为参数传递给构造函数。最后，通过该实例调用`printValue`方法来输出结果。

这些示例展示了四种不同类型的方法句柄的用法。每种类型的方法句柄都有其特定的用途，可以灵活地进行方法调用和访问操作。