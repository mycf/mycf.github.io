https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/

|                                                                                                                           |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17 | Exception in thread "main" java.lang.reflect.InaccessibleObjectException:   <br>Unable to make protected final java.lang.Class java.lang.ClassLoader.defineClass(java.lang.String,  <br>byte[],int,int,java.security.ProtectionDomain) throws java.lang.ClassFormatError accessible:  <br>module java.base does not "opens java.lang" to unnamed module @d2cc05a  <br>	at java.base/java.lang.reflect.AccessibleObject.checkCanSetAccessible(AccessibleObject.java:354)  <br>	at java.base/java.lang.reflect.AccessibleObject.checkCanSetAccessible(AccessibleObject.java:297)  <br>	at java.base/java.lang.reflect.Method.checkCanSetAccessible(Method.java:199)  <br>	at java.base/java.lang.reflect.Method.setAccessible(Method.java:193)  <br>	at javassist.util.proxy.SecurityActions.setAccessible(SecurityActions.java:159)  <br>	at javassist.util.proxy.DefineClassHelper$JavaOther.defineClass(DefineClassHelper.java:213)  <br>	at javassist.util.proxy.DefineClassHelper$Java11.defineClass(DefineClassHelper.java:52)  <br>	at javassist.util.proxy.DefineClassHelper.toClass(DefineClassHelper.java:260)  <br>	at javassist.ClassPool.toClass(ClassPool.java:1232)  <br>	at javassist.ClassPool.toClass(ClassPool.java:1090)  <br>	at javassist.ClassPool.toClass(ClassPool.java:1048)  <br>	at javassist.CtClass.toClass(CtClass.java:1290)  <br>	at com.ssdmbbl.javassist.DemoTest.main(DemoTest.java:19) |

需要加上VM参数

|     |                                             |
| --- | ------------------------------------------- |
| 1   | --add-opens=java.base/java.lang=ALL-UNNAMED |

# [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E4%B8%80-%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E4%B8%80-%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5 "一 基本概念")一 基本概念

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-1-%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-1-%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86 "1.1 基础知识")1.1 基础知识

Javassist 是一个开源的分析、编辑和创建Java字节码的类库. 其主要优点在于简单快速. 直接使用 java 编码的形式, 而不需要了解虚拟机指令, 就能动态改变类的结构, 或者动态生成类.

Javassist中最为重要的是`ClassPool`,`CtClass`, `CtMethod`以及`CtField`这几个类.

- `ClassPool`: 一个基于`Hashtable`实现的`CtClass`对象容器, 其中键是类名称, 值是表示该类的`CtClass`对象
- `CtClass`: `CtClass`表示类, 一个`CtClass`(编译时类)对象可以处理一个class文件, 这些`CtClass`对象可以从`ClassPool`获得
- `CtMethods`: 表示类中的方法
- `CtFields`: 表示类中的字段

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-2-ClassPool%E7%9A%84%E7%9B%B8%E5%85%B3%E6%96%B9%E6%B3%95)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-2-ClassPool%E7%9A%84%E7%9B%B8%E5%85%B3%E6%96%B9%E6%B3%95 "1.2 ClassPool的相关方法")1.2 ClassPool的相关方法

- `getDefault`: 返回默认的`ClassPool`是单例模式的，一般通过该方法创建我们的`ClassPool`；
- `appendClassPath`, `insertClassPath` : 将一个`ClassPath`加到类搜索路径的末尾位置 或 插入到起始位置。通常通过该方法写入额外的类搜索路径，以解决多个类加载器环境中找不到类的尴尬；
- `toClass` : 将修改后的`CtClass`加载至当前线程的上下文类加载器中，`CtClass`的`toClass`方法是通过调用本方法实现。需要注意的是一旦调用该方法，则无法继续修改已经被加载的class；
- `get` , `getCtClass`: 根据类路径名获取该类的`CtClass`对象，用于后续的编辑。

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4|// 获取ClassPool对象, 使用系统默认类路径  <br>ClassPool pool = new ClassPool(true);  <br>// 效果与 new ClassPool(true) 一致  <br>ClassPool pool1 = ClassPool.getDefault();|

为减少ClassPool可能导致的内存消耗. 可以从ClassPool中删除不必要的CtClass对象. 或者每次创建新的ClassPool对象.

|                        |                                                                                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1  <br>2  <br>3  <br>4 | // 从ClassPool中删除CtClass对象  <br>ctClass.detach();  <br>// 也可以每次创建一个新的ClassPool, 而不是ClassPool.getDefault(), 避免内存溢出  <br>ClassPool pool2 = new ClassPool(true); |

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-3-CtClass%E7%9A%84%E7%9B%B8%E5%85%B3%E6%96%B9%E6%B3%95)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-3-CtClass%E7%9A%84%E7%9B%B8%E5%85%B3%E6%96%B9%E6%B3%95 "1.3 CtClass的相关方法")1.3 CtClass的相关方法

- freeze: 冻结一个类，使其不可修改；
- isFrozen : 判断一个类是否已被冻结；
- prune : 删除类不必要的属性，以减少内存占用。调用该方法后，许多方法无法将无法正常使用，慎用；
- defrost : 解冻一个类，使其可以被修改。如果事先知道一个类会被defrost， 则禁止调用 prune 方法；
- detach : 将该class从ClassPool中删除；
- writeFile : 根据CtClass生成 .class 文件；
- toClass : 通过类加载器加载该CtClass。
- setInterfaces: 添加父接口
- setSuperclass: 添加父类

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-3-1-%E8%8E%B7%E5%8F%96CtClass)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-3-1-%E8%8E%B7%E5%8F%96CtClass "1.3.1 获取CtClass")1.3.1 获取CtClass

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4|// 通过类名获取 CtClass, 未找到会抛出异常  <br>CtClass ctClass = pool.get("com.kawa.ssist.JustRun");  <br>// 通过类名获取 CtClass, 未找到返回 null, 不会抛出异常  <br>CtClass ctClass1 = pool.getOrNull("com.kawa.ssist.JustRun");|

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-3-2-%E5%88%9B%E5%BB%BACtClass)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-3-2-%E5%88%9B%E5%BB%BACtClass "1.3.2 创建CtClass")1.3.2 创建CtClass

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6|// 复制一个类  <br>CtClass ctClass2 = pool.getAndRename("com.kawa.ssist.JustRun", "com.kawa.ssist.JustRunq");  <br>// 创建一个新类  <br>CtClass ctClass3 = pool.makeClass("com.kawa.ssist.JustRuna");  <br>// 通过class文件创建一个新类  <br>CtClass ctClass4 = pool.makeClass(new FileInputStream(new File("/home/un/test/JustRun.class")));|

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-3-3-CtClass%E5%9F%BA%E7%A1%80%E4%BF%A1%E6%81%AF)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-3-3-CtClass%E5%9F%BA%E7%A1%80%E4%BF%A1%E6%81%AF "1.3.3 CtClass基础信息")1.3.3 CtClass基础信息

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17  <br>18  <br>19  <br>20  <br>21  <br>22  <br>23  <br>24  <br>25  <br>26  <br>27  <br>28  <br>29  <br>30  <br>31  <br>32|// 类名  <br>String simpleName = ctClass.getSimpleName();  <br>// 类全名  <br>String name = ctClass.getName();  <br>// 包名  <br>String packageName = ctClass.getPackageName();  <br>// 接口  <br>CtClass[] interfaces = ctClass.getInterfaces();  <br>// 继承类  <br>CtClass superclass = ctClass.getSuperclass();  <br>// 获取类方法  <br>CtMethod ctMethod = ctClass.getDeclaredMethod("getName()", new CtClass[] {pool.get(String.class.getName()), pool.get(String.class.getName())});  <br>// 获取类字段  <br>CtField ctField = ctClass.getField("name");  <br>// 判断数组类型  <br>ctClass.isArray();  <br>// 判断原生类型  <br>ctClass.isPrimitive();  <br>// 判断接口类型  <br>ctClass.isInterface();  <br>// 判断枚举类型  <br>ctClass.isEnum();  <br>// 判断注解类型  <br>ctClass.isAnnotation();  <br>// 冻结一个类，使其不可修改  <br>ctClass.freeze ()   <br>// 判断一个类是否已被冻结  <br>ctClass.isFrozen()  <br>// 删除类不必要的属性，以减少内存占用。调用该方法后，许多方法无法将无法正常使用，慎用  <br>ctClass.prune()   <br>//解冻一个类，使其可以被修改。如果事先知道一个类会被defrost， 则禁止调用prune方法  <br>ctClass.defrost()|

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-3-4-CtClass%E7%B1%BB%E6%93%8D%E4%BD%9C)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-3-4-CtClass%E7%B1%BB%E6%93%8D%E4%BD%9C "1.3.4 CtClass类操作")1.3.4 CtClass类操作

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8|// 添加接口  <br>ctClass.addInterface(...);  <br>// 添加构造器  <br>ctClass.addConstructor(...);  <br>// 添加字段  <br>ctClass.addField(...);  <br>// 添加方法  <br>ctClass.addMethod(...);|

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-3-5-CtClass%E7%B1%BB%E7%BC%96%E8%AF%91)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-3-5-CtClass%E7%B1%BB%E7%BC%96%E8%AF%91 "1.3.5 CtClass类编译")1.3.5 CtClass类编译

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6|// 获取字节码文件 需要注意的是一旦调用该方法，则无法继续修改已经被加载的class  <br>Class clazz = ctClass.toClass();  <br>// 类的字节码文件  <br>ClassFile classFile = ctClass.getClassFile();  <br>// 编译成字节码文件, 使用当前线程上下文类加载器加载类, 如果类已存在或者编译失败将抛出异常  <br>byte[] bytes = ctClass.toBytecode();|

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-4-CtMethod%E7%9A%84%E7%9B%B8%E5%85%B3%E6%96%B9%E6%B3%95)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-4-CtMethod%E7%9A%84%E7%9B%B8%E5%85%B3%E6%96%B9%E6%B3%95 "1.4 CtMethod的相关方法")1.4 CtMethod的相关方法

上面我们创建一个新的方法使用了`CtMethod`类。`CtMthod`代表类中的某个方法，可以通过`CtClass`提供的API获取或者`CtNewMethod`新建，通过`CtMethod`对象可以实现对方法的修改。

- insertBefore : 在方法的起始位置插入代码；
    
- insterAfter : 在方法的所有 return 语句前插入代码以确保语句能够被执行，除非遇到exception；
    
- insertAt : 在指定的位置插入代码；
- setBody: 将方法的内容设置为要写入的代码，当方法被 abstract修饰时，该修饰符被移除；
- make : 创建一个新的方法。

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-4-1-%E8%8E%B7%E5%8F%96CtMethod%E5%B1%9E%E6%80%A7)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-4-1-%E8%8E%B7%E5%8F%96CtMethod%E5%B1%9E%E6%80%A7 "1.4.1  获取CtMethod属性")1.4.1 获取CtMethod属性

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17  <br>18  <br>19  <br>20  <br>21  <br>22  <br>23|CtClass ctClass5 = pool.get(TestService.class.getName());  <br>CtMethod ctMethod = ctClass5.getDeclaredMethod("selectOrder");  <br>// 方法名  <br>String methodName = ctMethod.getName();  <br>// 返回类型  <br>CtClass returnType = ctMethod.getReturnType();  <br>// 方法参数, 通过此种方式得到方法参数列表  <br>// 格式: com.kawa.TestService.getOrder(java.lang.String,java.util.List)  <br>ctMethod.getLongName();  <br>// 方法签名 格式: (Ljava/lang/String;Ljava/util/List;Lcom/test/Order;)Ljava/lang/Integer;  <br>ctMethod.getSignature();  <br>  <br>// 获取方法参数名称, 可以通过这种方式得到方法真实参数名称  <br>List<String> argKeys = new ArrayList<>();  <br>MethodInfo methodInfo = ctMethod.getMethodInfo();  <br>CodeAttribute codeAttribute = methodInfo.getCodeAttribute();  <br>LocalVariableAttribute attr = (LocalVariableAttribute) codeAttribute.getAttribute(LocalVariableAttribute.tag);  <br>int len = ctMethod.getParameterTypes().length;  <br>// 非静态的成员函数的第一个参数是this  <br>int pos = Modifier.isStatic(ctMethod.getModifiers()) ? 0 : 1;  <br>for (int i = pos; i < len; i++) {  <br>    argKeys.add(attr.variableName(i));  <br>}|

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-4-2-CtMethod%E6%96%B9%E6%B3%95%E4%BD%93%E4%BF%AE%E6%94%B9)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-4-2-CtMethod%E6%96%B9%E6%B3%95%E4%BD%93%E4%BF%AE%E6%94%B9 "1.4.2 CtMethod方法体修改")1.4.2 CtMethod方法体修改

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14|// 在方法体前插入代码块  <br>ctMethod.insertBefore("");  <br>// 在方法体后插入代码块  <br>ctMethod.insertAfter("");  <br>// 在某行 字节码 后插入代码块  <br>ctMethod.insertAt(10, "");  <br>// 添加参数  <br>ctMethod.addParameter(CtClass);  <br>// 设置方法名  <br>ctMethod.setName("newName");  <br>// 设置方法体 $0=this / $1,$2,$3... 代表方法参数  <br>ctMethod.setBody("{$0.name = $1;}");  <br>//创建一个新的方法  <br>ctMethod.make("kawa",CtClass);|

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-4-3-%E5%BC%82%E5%B8%B8%E5%9D%97-addCatch)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-4-3-%E5%BC%82%E5%B8%B8%E5%9D%97-addCatch "1.4.3 异常块 addCatch()")1.4.3 异常块 addCatch()

在方法中加入try catch块, 需要注意的是, 必须在插入的代码中, 加入return值$e代表异常信息.插入的代码片段必须以throw或return语句结束

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10|CtMethod m = ...;  <br>CtClass etype = ClassPool.getDefault().get("java.io.IOException");  <br>m.addCatch("{ System.out.println($e); throw $e; }", etype);  <br>// 等同于添加如下代码:   <br>try {  <br>    // the original method body  <br>} catch (java.io.IOException e) {  <br>    System.out.println(e);  <br>    throw e;  <br>}|

# [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E4%BA%8C-%E7%B1%BB%E6%90%9C%E7%B4%A2%E8%B7%AF%E5%BE%84)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E4%BA%8C-%E7%B1%BB%E6%90%9C%E7%B4%A2%E8%B7%AF%E5%BE%84 "二 类搜索路径")二 类搜索路径

通过`ClassPool.getDefault()`获取的`ClassPool`使用 JVM 的类搜索路径。如果程序运行在JBoss或者Tomcat等 Web 服务器上，`ClassPool`可能无法找到用户的类，因为 Web 服务器使用多个类加载器作为系统类加载器。在这种情况下，`ClassPool` 必须添加额外的类搜索路径。

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14|//默认加载方式如pool.insertClassPath(new ClassClassPath(this.getClass()));  <br>ClassPool pool = ClassPool.getDefault();  <br>//从file加载classpath  <br>pool.insertClassPath("/usr/local/javalib")  <br>//从URL中加载  <br>ClassPath cp = new URLClassPath("www.javassist.org", 80, "/java/", "org.javassist.");  <br>pool.insertClassPath(cp);  <br>//从byte[] 中加载  <br>byte[] b = a byte array;  <br>String name = class name;  <br>cp.insertClassPath(new ByteArrayClassPath(name, b));  <br>//可以从输入流中加载class  <br>InputStream ins = an input stream for reading a class file;  <br>CtClass cc = cp.makeClass(ins);|

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#2-1-%E9%80%9A%E8%BF%87ClassClassPath%E6%B7%BB%E5%8A%A0%E6%90%9C%E7%B4%A2%E8%B7%AF%E5%BE%84)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#2-1-%E9%80%9A%E8%BF%87ClassClassPath%E6%B7%BB%E5%8A%A0%E6%90%9C%E7%B4%A2%E8%B7%AF%E5%BE%84 "2.1 通过ClassClassPath添加搜索路径")2.1 通过`ClassClassPath`添加搜索路径

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9|pool.insertClassPath(new ClassClassPath(Person.getClass()));  <br>  <br>// 将classpath插入到指定classpath之前  <br>pool.insertClassPath(new ClassClassPath(this.getClass()));  <br>// 将classpath添加到指定classpath之后  <br>pool.appendClassPath(new ClassClassPath(this.getClass()));  <br>// 将一个目录作为classpath  <br>pool.insertClassPath("/xxx/lib");|

上面的语句将Person类添加到pool的类加载路径中。但在实践中，我发现通过这个可以将Person类所在的整个jar包添加到类加载路径中。

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#2-2-%E9%80%9A%E8%BF%87%E6%8C%87%E5%AE%9A%E7%9B%AE%E5%BD%95%E6%9D%A5%E6%B7%BB%E5%8A%A0%E6%90%9C%E7%B4%A2%E8%B7%AF%E5%BE%84)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#2-2-%E9%80%9A%E8%BF%87%E6%8C%87%E5%AE%9A%E7%9B%AE%E5%BD%95%E6%9D%A5%E6%B7%BB%E5%8A%A0%E6%90%9C%E7%B4%A2%E8%B7%AF%E5%BE%84 "2.2 通过指定目录来添加搜索路径")2.2 通过指定目录来添加搜索路径

也可以注册一个目录作为类搜索路径：如`pool.insertClassPath("/usr/javalib")`;则是将 `/usr/javalib`目录添加到类搜索路径中。

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#2-3-%E9%80%9A%E8%BF%87URL%E6%8C%87%E5%AE%9A%E6%90%9C%E7%B4%A2%E8%B7%AF%E5%BE%84)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#2-3-%E9%80%9A%E8%BF%87URL%E6%8C%87%E5%AE%9A%E6%90%9C%E7%B4%A2%E8%B7%AF%E5%BE%84 "2.3 通过URL指定搜索路径")2.3 通过URL指定搜索路径

|   |   |
|---|---|
|1  <br>2  <br>3|ClassPool pool = ClassPool.getDefault();  <br>ClassPath cp = new URLClassPath("www.sample.com", 80, "/out/", "com.test.");  <br>pool.insertClassPath(cp);|

上述代码将[http://www.sample.com:80/out添加到类搜索路径。并且这个URL只能搜索](http://www.sample.com/out%E6%B7%BB%E5%8A%A0%E5%88%B0%E7%B1%BB%E6%90%9C%E7%B4%A2%E8%B7%AF%E5%BE%84%E3%80%82%E5%B9%B6%E4%B8%94%E8%BF%99%E4%B8%AAURL%E5%8F%AA%E8%83%BD%E6%90%9C%E7%B4%A2) `com.test`包里面的类。例如，为了加载 `com.test.Person`，它的类文件会从获取`http://www.sample.com:80/out/com/test/Person.class`获取。

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#2-4-%E9%80%9A%E8%BF%87ByteArrayPath%E6%B7%BB%E5%8A%A0%E6%90%9C%E7%B4%A2%E8%B7%AF%E5%BE%84)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#2-4-%E9%80%9A%E8%BF%87ByteArrayPath%E6%B7%BB%E5%8A%A0%E6%90%9C%E7%B4%A2%E8%B7%AF%E5%BE%84 "2.4 通过ByteArrayPath添加搜索路径")2.4 通过`ByteArrayPath`添加搜索路径

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5|ClassPool cp = ClassPool.getDefault();  <br>byte[] buf = 字节数组;  <br>String name = 类名;  <br>cp.insertClassPath(new ByteArrayClassPath(name, buf));  <br>CtClass cc = cp.get(name);|

示例中的 `CtClass` 对象是字节数据`buf`代表的class文件。将对应的类名传递给`ClassPool`的`get()`方法，就可以从字节数组中读取到对应的类文件。

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#2-5-%E9%80%9A%E8%BF%87%E8%BE%93%E5%85%A5%E6%B5%81%E5%8A%A0%E8%BD%BDclass)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#2-5-%E9%80%9A%E8%BF%87%E8%BE%93%E5%85%A5%E6%B5%81%E5%8A%A0%E8%BD%BDclass "2.5 通过输入流加载class")2.5 通过输入流加载class

如果你不知道类的全名，可以使用`makeClass()`方法：

|   |   |
|---|---|
|1  <br>2  <br>3|ClassPool cp = ClassPool.getDefault();  <br>InputStream ins =  class文件对应的输入流;  <br>CtClass cc = cp.makeClass(ins);|

`makeClass()`返回从给定输入流构造的`CtClass`对象。你可以使用`makeClass()`将类文件提供给`ClassPool`对象。如果搜索路径包含大的jar文件，这可能会提高性能。由于`ClassPool`对象按需读取类文件，它可能会重复搜索整个jar文件中的每个类文件。`makeClass()`可以用于优化此搜索。由`makeClass()`构造的`CtClass`保存在`ClassPool`对象中，从而使得类文件不会再被读取。

# [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E4%B8%89-%E8%AF%BB%E5%86%99%E5%AD%97%E8%8A%82%E7%A0%81)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E4%B8%89-%E8%AF%BB%E5%86%99%E5%AD%97%E8%8A%82%E7%A0%81 "三 读写字节码")三 读写字节码

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-1-bytecode%E8%AF%BB%E5%86%99)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-1-bytecode%E8%AF%BB%E5%86%99 "3.1 bytecode读写")3.1 bytecode读写

Javassist是用来处理java字节码的类库， java字节码一般存放在后缀名称为class的二进制文件中。每个二进制文件都包含一个java类或者是java接口。

Javasist.CtClass是对类文件的抽象，处于编译中的此对象可以用来处理类文件。下面的代码用来展示一下其简单用法：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4|ClassPool pool = ClassPool.getDefault();  <br>CtClass cc = pool.get("test.Rectangle");  <br>cc.setSuperclass(pool.get("test.Point"));  <br>cc.writeFile();|

这段程序首先获取`ClassPool`的实例，它主要用来修改字节码的，里面存储着基于二进制文件构建的`CtClass`对象，它能够按需创建出`CtClass`对象并提供给后续处理流程使用。当需要进行类修改操作的时候，用户需要通过`ClassPool`实例的`.get()`方法，获取`CtClass`对象。从上面代码中我们可以看出，`ClassPool`的`getDefault()`方法将会查找系统默认的路径来搜索`test.Rectable`对象，然后将获取到的`CtClass`对象赋值给cc变量。

从易于扩展使用的角度来说，`ClassPool`是由装载了很多`CtClass`对象的`HashTable`组成。其中，类名为`key`，`CtClass`对象为`Value`，这样就可以通过搜索`HashTable`的`Key`来找到相关的`CtClass`对象了。如果对象没有被找到，那么`get()`方法就会创建出一个默认的`CtClass`对象，然后放入到`HashTable`中，同时将当前创建的对象返回。

从`ClassPool`中获取的`CtClass`对象，是可以被修改的。从上面的 代码中，我们可以看到，原先的父类，由`test.Rectangle`被改成了`test.Point`。这种更改可以通过调用`CtClass().writeFile()`将其持久化到文件中。同时，Javassist还提供了`toBytecode()`方法来直接获取修改的字节码:

|   |   |
|---|---|
|1|byte[] b = cc.toBytecode();|

你可以通过如下代码直接加载CtClass：

|   |   |
|---|---|
|1|Class clazz = cc.toClass();|

`toClass()`方法被调用，将会使得当前线程中的context class loader加载此CtClass类，然后生成`java.lang.Class`对象。更多的细节 ，请参见[this section below](http://www.javassist.org/tutorial/tutorial.html#toclass).

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-1-1-%E6%96%B0%E5%BB%BA%E7%B1%BB)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-1-1-%E6%96%B0%E5%BB%BA%E7%B1%BB "3.1.1 新建类")3.1.1 新建类

新建一个类，可以使用`ClassPool.makeClass()`方法来实现：

|   |   |
|---|---|
|1  <br>2|ClassPool pool = ClassPool.getDefault();  <br>CtClass cc = pool.makeClass("Point");|

上面的代码展示的是创建无成员方法的`Point`类，如果需要附带方法的话，我们可以用`CtNewMethod`附带的工厂方法创建，然后利用`CtClass.addMethod()`将其追加就可以了 。

`makeClass()`不能用于创建新的接口。但是`makeInterface()`可以。接口的方法可以用`CtNewmethod.abstractMethod()`方法来创建，需要注意的是，在这里，一个接口方法其实是一个abstract方法。

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-1-2-%E5%86%BB%E7%BB%93%E7%B1%BB)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-1-2-%E5%86%BB%E7%BB%93%E7%B1%BB "3.1.2 冻结类")3.1.2 冻结类

如果`CtClass`对象被`writeFile()`,`toClass()`或者`toBytecode()`转换成了类对象，Javassist将会冻结此`CtClass`对象。任何对此对象的后续更改都是不允许的。之所以这样做，主要是因为此类已经被JVM加载，由于JVM本身不支持类的重复加载操作，所以不允许更改。

一个冻结的`CtClass`对象，可以通过如下的代码进行解冻，如果想更改类的话，代码如下：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5|CtClasss cc = ...;  <br>    :  <br>cc.writeFile();  <br>cc.defrost();  <br>cc.setSuperclass(...);    // OK since the class is not frozen.|

调用了`defrost()`方法之后，`CtClass`对象就可以随意修改了。

如果`ClassPool.doPruning`被设置为true，那么Javassist将会把已冻结的`CtClass`对象中的数据结构进行精简，此举主要是为了防止过多的内存消耗。而精简掉的部分，都是一些不必要的属性(attriute_info结构)。因此，当一个`CtClass`对象被精简之后，方法是无法被访问和调用的，但是方法名称，签名，注解可以被访问。被精简过的`CtClass`对象可以被再次解冻。需要注意的是，`ClassPool.doPruning`的默认值为false。

为了防止`CtClass`类被无端的精简，需要优先调用`stopPruning()`方法来进行阻止：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5|CtClasss cc = ...;  <br>cc.stopPruning(true);  <br>    :  <br>cc.writeFile();                             // convert to a class file.  <br>// cc is not pruned.|

这样，`CtClass`对象就不会被精简了。当`writeFile()`方法调用之后，我们就可以进行解冻，然后为所欲为了。

需要注意的是：在调试的时候，`debugWriteFile()`方法可以很方便的防止`CtClass`对象精简和冻住。

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-2%E7%B1%BB%E6%90%9C%E7%B4%A2%E8%B7%AF%E5%BE%84)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-2%E7%B1%BB%E6%90%9C%E7%B4%A2%E8%B7%AF%E5%BE%84 "3.2类搜索路径")3.2类搜索路径

`ClassPool.getDefault()`方法的搜索路径和JVM的搜索路径是一致的。如果程序运行在JBoss或者Tomcat服务器上，那么`ClassPool`对象也许不能够找到用户类，原因是应用服务器用的是多个class loader，其中包括系统的class loader来加载对象。正因如此，`ClassPool`需要 附加特定的类路径才行。 假设如下的pool实例代表`ClassPool`对象：

|   |   |
|---|---|
|1|pool.insertClassPath(new ClassClassPath(this.getClass()));|

上面的代码段注册了this所指向的类路径下面的类对象。你可以用其他的类对象来代替`this.getClass()`。这样就可以加载其他不同的类对象了。

你也可以注册一个目录名字来作为类搜索路径。比如下面代码中，使用`/usr/local/javalib`目录作为搜索路径：

|   |   |
|---|---|
|1  <br>2|ClassPool pool = ClassPool.getDefault();  <br>pool.insertClassPath("/usr/local/javalib");|

也可以使用url来作为搜索路径：

|   |   |
|---|---|
|1  <br>2  <br>3|ClassPool pool = ClassPool.getDefault();  <br>ClassPath cp = new URLClassPath("www.javassist.org", 80, "/java/", "org.javassist.");  <br>pool.insertClassPath(cp);|

上面这段代码将会添加“[http://www.javassist.org:80/java/”到类搜索路径。这个URL主要用来搜索org.javassist包下面的类。比如加载org.javassist.test.Main类，此类将会从如下路径获取：](http://www.javassist.org/java/%E2%80%9D%E5%88%B0%E7%B1%BB%E6%90%9C%E7%B4%A2%E8%B7%AF%E5%BE%84%E3%80%82%E8%BF%99%E4%B8%AAURL%E4%B8%BB%E8%A6%81%E7%94%A8%E6%9D%A5%E6%90%9C%E7%B4%A2org.javassist%E5%8C%85%E4%B8%8B%E9%9D%A2%E7%9A%84%E7%B1%BB%E3%80%82%E6%AF%94%E5%A6%82%E5%8A%A0%E8%BD%BDorg.javassist.test.Main%E7%B1%BB%EF%BC%8C%E6%AD%A4%E7%B1%BB%E5%B0%86%E4%BC%9A%E4%BB%8E%E5%A6%82%E4%B8%8B%E8%B7%AF%E5%BE%84%E8%8E%B7%E5%8F%96%EF%BC%9A)

|   |   |
|---|---|
|1|http://www.javassist.org:80/java/org/javassist/test/Main.class|

此外，你甚至可以直接使用一串字节码，然后创建出`CtClass`对象。示例如下：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5|ClassPool cp = ClassPool.getDefault();  <br>byte[] b = a byte array;  <br>String name = class name;  <br>cp.insertClassPath(new ByteArrayClassPath(name, b));  <br>CtClass cc = cp.get(name);|

从上面代码可以看出，`ClassPool`加载了`ByteArrayClasPath`构建的对象，然后利用`get()`方法并通过类名，将对象赋值给了`CtClass`对象。

如果你不知道类的全名，你也可以用`makeClass()`来实现：

|   |   |
|---|---|
|1  <br>2  <br>3|ClassPool cp = ClassPool.getDefault();  <br>InputStream ins = an input stream for reading a class file;  <br>CtClass cc = cp.makeClass(ins);|

`makeClass()`方法利用给定的输入流构建出`CtClass`对象。你可以用饿汉方式直接创建出`ClassPool`对象，这样当搜索路径中有大点的jar文件需要加载的时候，可以提升一些性能，之所以 这样做，原因是`ClassPool`对象按需加载类文件，所以它可能会重复搜索整个jar包中的每个类文件，正因为如此，`makeClass()`可以用于优化查找的性能。被`makeClass()`方法加载过的`CtClass`对象将会留存于`ClassPool`对象中，不会再进行读取。

用户可以扩展类搜索路径。可以通过定义一个新的类，扩展自`ClassPath`接口，然后返回一个`insertClassPath`即可。这种做法可以允许其他资源被包含到搜索路径中。

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-3-ClassPool)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-3-ClassPool "3.3 ClassPool")3.3 ClassPool

一个`ClassPool`里面包含了诸多的`CtClass`对象。每当一个`CtClass`对象被创建的时候，都会在`ClassPool`中做记录。之所以这样做，是因为编译器后续的源码编译操作可能会通过此类关联的`CtClass`来获取。

比如，一个代表了Point类的`CtClass`对象，新加一个`getter()`方法。之后，程序将会尝试编译包含了`getter()`方法的Point类，然后将编译好的`getter()`方法体，添加到另外一个Line类上面。如果`CtClass`对象代表的Point类不存在的话，那么编译器就不会成功的编译`getter()`方法。需要注意的是原来的类定义中并不包含`getter()`方法 。因此，要想正确的编译此方法，`ClassPool`对象必须包含程序运行时候的所有的`CtClass`对象。

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-3-1%E9%81%BF%E5%85%8D%E5%86%85%E5%AD%98%E6%BA%A2%E5%87%BA)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-3-1%E9%81%BF%E5%85%8D%E5%86%85%E5%AD%98%E6%BA%A2%E5%87%BA "3.3.1避免内存溢出")3.3.1避免内存溢出

`CtClass`对象非常多的时候，`ClassPool`将会消耗内存巨大。为了避免个问题，你可以移除掉一些不需要的`CtClass`对象。你可以通过调用`CtClass.detach()`方法来实现，那样的话此`CtClass`对象将会从`ClassPool`移除。代码如下：

|   |   |
|---|---|
|1  <br>2  <br>3|CtClass cc = ... ;  <br>cc.writeFile();  <br>cc.detach();|

此`CtClass`对象被移除后，不能再调用其任何方法。但是你可以调用`ClassPool.get()`方法来创建一个新的`CtClass`实例。

另一个方法就是用新的`ClassPool`对象来替代旧的`ClassPool`对象。如果旧的`ClassPool`对象被垃圾回收了，那么其内部的`CtClass`对象也都会被垃圾回收掉。下面的代码可以用来创建一个新的`ClassPool`对象：

|   |   |
|---|---|
|1  <br>2|ClassPool cp = new ClassPool(true);  <br>// if needed, append an extra search path by appendClassPath()|

上面的代码和`ClassPool.getDefault()`来创建`ClassPool`，效果是一样的。需要注意的是，`ClasssPool.getDefault()`是一个单例工厂方法，它能够创建出一个唯一的`ClassPool`对象并进行重复利用。`new ClassPool(true)`是一个很快捷的构造方法，它能够创建一个`ClassPool`对象然后追加系统搜索路径到其中。和如下的代码创建行为表现一致：

|   |   |
|---|---|
|1  <br>2|ClassPool cp = new ClassPool();  <br>cp.appendSystemPath();  // or append another path by appendClassPath()|

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-3-2-%E7%BA%A7%E8%81%94ClassPools)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-3-2-%E7%BA%A7%E8%81%94ClassPools "3.3.2 级联ClassPools")3.3.2 级联ClassPools

如果应用运行在JBOSS/Tomcat上, 那么创建多个`ClassPool`对象将会很有必要。因为每个类加载其都将会持有一个`ClassPool`的实例。应用此时最好不用`getDefault()`方法来创建`ClassPool`对象，而是使用构造来创建。

多个`ClassPool`对象像`java.lang.ClassLoader`一样做级联，代码如下：

|   |   |
|---|---|
|1  <br>2  <br>3|ClassPool parent = ClassPool.getDefault();  <br>ClassPool child = new ClassPool(parent);  <br>child.insertClassPath("./classes");|

如果`child.get()`被调用，子`ClassPool`将会首先从父`ClassPool`进行查找。当父`ClassPool`查找不到后，然后将会尝试从`./classes`目录进行查找。

如果`child.childFirstLookup = true`, 子`ClassPool`将会首先查找自己的目录，然后查找父`ClassPool`，代码如下：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4|ClassPool parent = ClassPool.getDefault();  <br>ClassPool child = new ClassPool(parent);  <br>child.appendSystemPath();         // the same class path as the default one.  <br>child.childFirstLookup = true;    // changes the behavior of the child.|

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-3-3%E4%B8%BA%E6%96%B0%E7%B1%BB%E9%87%8D%E5%91%BD%E5%90%8D)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-3-3%E4%B8%BA%E6%96%B0%E7%B1%BB%E9%87%8D%E5%91%BD%E5%90%8D "3.3.3为新类重命名")3.3.3为新类重命名

可以从已有类创建出新的类，代码如下：

|   |   |
|---|---|
|1  <br>2  <br>3|ClassPool pool = ClassPool.getDefault();  <br>CtClass cc = pool.get("Point");  <br>cc.setName("Pair");|

此代码首先从Point类创建了`CtClass`对象，然后调用`setName()`重命名为Pair。之后，所有对`CtClass`对象的引用，将会由Point变成Pair。

需要注意的是`setName()`方法改变`ClassPool`对象中的标记。从可扩展性来看，`ClassPool`对象是`HashTable`的合集，`setName()`方法只是改变了`key`和`Ctclass`对象的关联。

因此，对于`get("Point")`方法之后的所有调用，将不会返回`CtClasss`对象。`ClassPool`对象再次读取`Point.class`的时候，将会创建一个新的`CtClass`，这是因为和Point关联的`CtClass`对象已经不存在了，请看如下代码：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6|ClassPool pool = ClassPool.getDefault();  <br>CtClass cc = pool.get("Point");  <br>CtClass cc1 = pool.get("Point");   // cc1 is identical to cc.  <br>cc.setName("Pair");  <br>CtClass cc2 = pool.get("Pair");    // cc2 is identical to cc.  <br>CtClass cc3 = pool.get("Point");   // cc3 is not identical to cc.|

cc1和cc2将会指向cc，但是cc3却不会。需要注意的是，在`cc.setName("Pair")`执行后，cc和cc1指向的`CtClass`对象都变成了指向Pair类。

`ClassPool`对象用来维护类之间和`CtClass`对象之间一对一的映射关系。Javassist不允许两个不同的`CtClass`对象指向同一个类，除非两个独立的`ClassPool`存在的情况下。这是为实现程序转换而保证其一致性的最鲜明的特点。

我们知道，可以利用`ClassPool.getDefault()`方法创建`ClassPool`的实例，代码片段如下（之前已经展示过）：

|   |   |
|---|---|
|1|ClassPool cp = new ClassPool(true);|

如果你有两个`ClassPool`对象，那么你可以从这两个对象中分别取出具有相同类文件，但是隶属于不同的`CtClass`对象生成的，此时可以通过修改这俩`CtClass`对象来生成不同的类。

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-3-4-%E4%BB%8E%E5%86%BB%E7%BB%93%E7%B1%BB%E4%B8%AD%E5%88%9B%E5%BB%BA%E6%96%B0%E7%B1%BB)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-3-4-%E4%BB%8E%E5%86%BB%E7%BB%93%E7%B1%BB%E4%B8%AD%E5%88%9B%E5%BB%BA%E6%96%B0%E7%B1%BB "3.3.4 从冻结类中创建新类")3.3.4 从冻结类中创建新类

当`CtClass`对象通过`writeFile()`方法或者`toBytecode()`转变成类文件的时候，Javassist将不允许对这个`CtClass`对象有任何修改。因此，当代表Point类的`CtClass`对象被转换成了类文件，你不能够先拷贝Point类，然后修改名称为Pair类，因为Point类中的`setName()`方法是无法被执行的，错误使用示例如下：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4|ClassPool pool = ClassPool.getDefault();  <br>CtClass cc = pool.get("Point");  <br>cc.writeFile();  <br>cc.setName("Pair");    // wrong since writeFile() has been called.|

为了能够避免这种限制，你应该使用`getAndRename()`方法，正确示例如下：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4|ClassPool pool = ClassPool.getDefault();  <br>CtClass cc = pool.get("Point");  <br>cc.writeFile();  <br>CtClass cc2 = pool.getAndRename("Point", "Pair");|

如果`getAndRename()`方法被调用，那么`ClassPool`首先会基于`Point.class`来创建一个新的`CtClass`对象。之后，在`CtClass`对象被放到`HashTable`前，它将`CtClass`对象名称从Point修改为Pair。因此，`getAndRename()`方法可以在`writeFile()`方法或者`toBytecode()`方法执行后去修改`CtClass`对象。

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-3-%E7%B1%BB%E5%8A%A0%E8%BD%BD%E5%99%A8)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-3-%E7%B1%BB%E5%8A%A0%E8%BD%BD%E5%99%A8 "3.3 类加载器")3.3 类加载器

如果预先知道需要修改什么类，最简单的修改方式如下：

1. 调用ClassPool.get()方法获取CtClass对象
    
2. 修改此对象
    
3. 调用CtClass对象的writeFile()方法或者toBytecode()方法来生成类文件。
    

如果检测类是否修改行为发生在程序加载的时候，那么对于用户说来，Javassist最好提供这种与之匹配的类加载检测行为。事实上，javassist可以做到在类加载的时候来修改二进制数据。使用Javassist的用户可以定义自己的类加载器，当然也可以采用Javassist自身提供的。

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-3-1-CtClass%E4%B8%AD%E7%9A%84toClass%E6%96%B9%E6%B3%95)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-3-1-CtClass%E4%B8%AD%E7%9A%84toClass%E6%96%B9%E6%B3%95 "3.3.1 CtClass中的toClass方法")3.3.1 CtClass中的toClass方法

`CtClass`提供的toClass()方法，可以很方便的加载当前线程中通过`CtClass`对象创建的类。但是为了使用此方法，调用方必须拥有足够的权限才行，否则将会报`SecurityException`错误。

下面的代码段展示了如何使用toClass()方法：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17|public class Hello {  <br>    public void say() {  <br>        System.out.println("Hello");  <br>    }  <br>}  <br>  <br>public class Test {  <br>    public static void main(String[] args) throws Exception {  <br>        ClassPool cp = ClassPool.getDefault();  <br>        CtClass cc = cp.get("Hello");  <br>        CtMethod m = cc.getDeclaredMethod("say");  <br>        m.insertBefore("{ System.out.println(\"Hello.say():\"); }");  <br>        Class c = cc.toClass();  <br>        Hello h = (Hello)c.newInstance();  <br>        h.say();  <br>    }  <br>}|

`Test.main()`方法中， `say()`方法被插入了`println()`方法，之后这个被修改的`Hello`类实例被创建，`say()`方法被调用。

需要注意的是，上面代码中，`Hello`类是放在`toClass()`之后被调用的，如果不这么做的话，JVM将会先加载Hello类，而不是在`toClass()`方法加载`Hello`类之后再调用`Hello`类，这样做会导致加载失败(会抛出`LinkageError`错误)。比如，如果`Test.main()`方法中的代码如下：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6|public static void main(String[] args) throws Exception {  <br>    Hello orig = new Hello();  <br>    ClassPool cp = ClassPool.getDefault();  <br>    CtClass cc = cp.get("Hello");  <br>        :  <br>}|

main方法中，第一行的Hello类会被加载，之后调用toClass()将会报错，因为一个类加载器无法在同一时刻加载两个不同的Hello类版本。

如果程序跑在JBoss/Tomcat上，利用toClass()方法可能会有些问题。在这种情况下，你将会遇到`ClassCastException`错误，为了避免这种错误，你必须为`toClass()`方法提供非常明确的类加载器。比如，在如下代码中，bean代表你的业务bean对象的时候：

|   |   |
|---|---|
|1  <br>2|CtClass cc = ...;  <br>Class c = cc.toClass(bean.getClass().getClassLoader());|

则就不会出现上述问题。你应当为`toClass()`方法提供已经加载过程序的类加载器才行。

`toClass()`的使用会带来诸多方便，但是如果你需要更多更复杂的功能，你应当实现自己的类加载器。

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-4-java%E4%B8%AD%E7%9A%84%E7%B1%BB%E5%8A%A0%E8%BD%BD)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-4-java%E4%B8%AD%E7%9A%84%E7%B1%BB%E5%8A%A0%E8%BD%BD "3.4 java中的类加载")3.4 java中的类加载

在java中，多个类加载器可以共存，不同的类加载器会创建自己的应用区域。不同的类加载器可以加载具有相同类名称但是内容不尽相同的类文件。这种特性可以让我们在一个JVM上并行运行多个应用。

需要注意的是JVM不支持动态的重新加载一个已加载的类。一旦类加载器加载了一个类，那么这个类或者基于其修改的类，在JVM运行时，都不能再被加载。因此，你不能够修改已经被JVM加载的类。但是，JPDA(Java Platform Debugger Architecture)支持这种做法。具体请见 [Section 3.6](https://www.javassist.org/tutorial/tutorial.html#hotswap).

如果一个类被两个不同的类加载器加载，那么JVM会将此类分成两个不同的类，但是这两个类具有相同的类名和定义。我们一般把这两个类当做是不同的类，所以一个类不能够被转换成另一个类，一旦这么做，那么这种强转操作将会抛出错误`ClassCastException`。

比如，下面的例子会抛错：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4|MyClassLoader myLoader = new MyClassLoader();  <br>Class clazz = myLoader.loadClass("Box");  <br>Object obj = clazz.newInstance();  <br>Box b = (Box)obj;    // this always throws ClassCastException.|

Box类被两个类加载器所加载，试想一下，假设CL类加载器加载的类包含此代码段，由于此代码段指向`MyClassLoader`,`Class`,`Object`,`Box`,所以CL加载器也会将这些东西加载进来（除非它是其它类加载器的代理）。因此变量b就是CL中的Box类。从另一方面说来，myLoader也加载了Box类，obj对象是Box类的实例，因此，代码的最后一行将一直抛出`ClassCastException`错误，因为obj和b是Box类的不同实例副本。

多个类加载器会形成树状结构，除了底层引导的类加载器外，每一个类加载器都有能够正常的加载子加载器的父加载器。由于加载类的请求可以被类加载器所代理，所以一个类可能会被你所不希望看到的类加载器所加载。因此，类C可能会被你所不希望看到的类加载器所加载，也可能会被你所希望的加载器所加载。为了区分这种现象，我们称前一种加载器为类C的虚拟引导器，后一种加载器为类C的真实加载器。

此外，如果类加载器CL（此类加载器为类C的虚拟引导器）让其父加载器PL来加载类C，那么相当于CL没有加载任何类C相关的东西。此时，CL就不能称作虚拟引导器。相反，其父类加载器PL将会变成虚拟引导器。所有指向类C定义的类，都会被类C的真实加载器所加载。

为了理解这种行为，让我们看看如下的例子：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16|public class Point {    // loaded by PL  <br>    private int x, y;  <br>    public int getX() { return x; }  <br>        :  <br>}  <br>  <br>public class Box {      // the initiator is L but the real loader is PL  <br>    private Point upperLeft, size;  <br>    public int getBaseX() { return upperLeft.x; }  <br>        :  <br>}  <br>  <br>public class Window {    // loaded by a class loader L  <br>    private Box box;  <br>    public int getBaseX() { return box.getBaseX(); }  <br>}|

假如Window类被L加载器所加载，那么Window的虚拟加载器和实际加载器都是L。由于Window类中引用了Box类，JVM将会加载Box类，这里，假设L将此加载任务代理给了其父加载器PL，那么Box的类加载器将会变成L，但是其实际加载器将会是PL。因此，在此种情况下，Point类的虚拟加载器将不是L，而是PL，因为它和Box的实际加载器是一样的。因此L加载器将永远不会加载Point类。

接下来，让我们看一个少量更改过的例子：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17  <br>18  <br>19|public class Point {  <br>    private int x, y;  <br>    public int getX() { return x; }  <br>        :  <br>}  <br>  <br>public class Box {      // the initiator is L but the real loader is PL  <br>    private Point upperLeft, size;  <br>    public Point getSize() { return size; }  <br>        :  <br>}  <br>  <br>public class Window {    // loaded by a class loader L  <br>    private Box box;  <br>    public boolean widthIs(int w) {  <br>        Point p = box.getSize();  <br>        return w == p.getX();  <br>    }  <br>}|

现在看来，Window类指向了Point，因此类加载器L要想加载Point的话，它必须代理PL。必须杜绝的情况是，两个类加载器加载同一个类的情况。其中一个类加载器必须能够代理另一个才行。

当Point类加载后，L没有代理PL，那么`widthIs()`将会抛出`ClassCastExceptioin`。由于Box类的实际加载器是PL，所以指向Box类的Point类将也会被PL所加载。因此，`getSize()`方法的最终结果将是被PL加载的Point对象的实例。反之，`widthIs()`方法中的p变量的类型将是被L所加载的Point类。对于这种情况，JVM会将其视为不同的类型，从而因为类型不匹配而抛出错误。

这种情况，虽然不方便，但是却很有必要，来看一下如下代码段：

|   |   |
|---|---|
|1|Point p = box.getSize();|

没有抛出错误，Window将会破坏Point对象的包装。举个例子吧，被PL加载的Point类中，x字段是私有的。但是，如果L利用如下的定义加载了Point类的话，那么Window类是可以直接访问x字段的：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5|public class Point {  <br>    public int x, y;    // not private  <br>    public int getX() { return x; }  <br>        :  <br>}|

想要了解java中更多的类加载器信息，以下信息也许有帮助：

|   |   |
|---|---|
|1  <br>2|Sheng Liang and Gilad Bracha, "Dynamic Class Loading in the Java Virtual Machine",  <br>ACM OOPSLA'98, pp.36-44, 1998.|

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-5-%E4%BD%BF%E7%94%A8javassist-Loader)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-5-%E4%BD%BF%E7%94%A8javassist-Loader "3.5 使用javassist.Loader")3.5 使用javassist.Loader

Javassist提供了`javassist.Loader`这个类加载器。它使用`javassist.ClassPool`对象来读取类文件。

举个例子，使用`javassist.Loader`来加载Javassist修改过的类：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16|import javassist.*;  <br>import test.Rectangle;  <br>  <br>public class Main {  <br>  public static void main(String[] args) throws Throwable {  <br>     ClassPool pool = ClassPool.getDefault();  <br>     Loader cl = new Loader(pool);  <br>  <br>     CtClass ct = pool.get("test.Rectangle");  <br>     ct.setSuperclass(pool.get("test.Point"));  <br>  <br>     Class c = cl.loadClass("test.Rectangle");  <br>     Object rect = c.newInstance();  <br>         :  <br>  }  <br>}|

上面的程序就修改了`test.Rectangle`类，先是`test.Point`类被设置成了`test.Rectangle`类的父类，之后程序会加载这个修改的类并创建`test.Rectangle`类的实例出来。

如果一个类被加载后，用户想要修改成自己想要的东西进来，那么用户可以通过添加事件监听器到javassist.Loader上。每当类加载器加载了类进来，那么事件监听器将会发出通知。此监听器必须实现如下的接口：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6|public interface Translator {  <br>    public void start(ClassPool pool)  <br>        throws NotFoundException, CannotCompileException;  <br>    public void onLoad(ClassPool pool, String classname)  <br>        throws NotFoundException, CannotCompileException;  <br>}|

当利用`javassist.Loader.addTranslator()`将事件监听器添加到`javassist.Loader`对象上的时候，上面的start()方法将会被触发。而`onLoad()`方法的触发先于`javassist.Loader`加载一个类，因此`onLoad()`方法可以改变已加载的类的定义。

举个例子，下面的事件监听器将会在类被加载器加载之前，修改其类型为`public`：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10|public class MyTranslator implements Translator {  <br>    void start(ClassPool pool)  <br>        throws NotFoundException, CannotCompileException {}  <br>    void onLoad(ClassPool pool, String classname)  <br>        throws NotFoundException, CannotCompileException  <br>    {  <br>        CtClass cc = pool.get(classname);  <br>        cc.setModifiers(Modifier.PUBLIC);  <br>    }  <br>}|

需要注意的是，`onLoad()`方法不需要调用`toBytecode`方法或者`writeFile`方法，因为`javassistLoader`会调用这些方法来获取类文件。

为了能够运行MyApp类中的`MyTranslator`对象，写了一个主方法如下：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11|import javassist.*;  <br>  <br>public class Main2 {  <br>  public static void main(String[] args) throws Throwable {  <br>     Translator t = new MyTranslator();  <br>     ClassPool pool = ClassPool.getDefault();  <br>     Loader cl = new Loader();  <br>     cl.addTranslator(pool, t);  <br>     cl.run("MyApp", args);  <br>  }  <br>}|

想要运行它，可以按照如下命令来：

|   |   |
|---|---|
|1|% java Main2 arg1 arg2...|

MyApp类和其他的一些类，会被MyTranslator所翻译。

需要注意的是，类似MyApp这种应用类，是不能够访问Main2，MyTranslator，ClassPool这些类的，因为这些类是被不同加载器所加载的。应用类是被javassist.Loader所加载，而Main2这些是被java的默认类加载器所加载的。

javassist.Loader搜寻需要加载的类的时候，和java.lang.ClassLoader.ClassLoader是截然不同的。后者先使用父类加载器进行加载，如果父类加载器找不到类，则尝试用当前加载器进行加载。而javassist.Load在如下情况下，则尝试直接加载：

- ClassPool对象上，无法找到get方法
    
- 父类使用delegateLoadingOf()方法进行加载
    

Javassist可以按照搜索的顺序来加载已修改的类，但是，如果它无法找到已修改的类，那么将会由父类加载器进行加载操作。一旦当一个类被父加载器所加载，那么指向此类的其他类，也将被此父加载器所加载，因为，这些被加载类是不会被修改的。如果你的程序无法加载一个已修改的类，你需要确认所有的类是否是被javassist.Loader所加载。

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-5-%E6%89%93%E9%80%A0%E4%B8%80%E4%B8%AA%E7%B1%BB%E5%8A%A0%E8%BD%BD%E5%99%A8)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-5-%E6%89%93%E9%80%A0%E4%B8%80%E4%B8%AA%E7%B1%BB%E5%8A%A0%E8%BD%BD%E5%99%A8 "3.5 打造一个类加载器")3.5 打造一个类加载器

用javassist打造一个简单的类加载器，代码如下：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17  <br>18  <br>19  <br>20  <br>21  <br>22  <br>23  <br>24  <br>25  <br>26  <br>27  <br>28  <br>29  <br>30  <br>31  <br>32  <br>33  <br>34  <br>35  <br>36  <br>37|import javassist.*;  <br>  <br>public class SampleLoader extends ClassLoader {  <br>    /* Call MyApp.main().  <br>     */  <br>    public static void main(String[] args) throws Throwable {  <br>        SampleLoader s = new SampleLoader();  <br>        Class c = s.loadClass("MyApp");  <br>        c.getDeclaredMethod("main", new Class[] { String[].class })  <br>         .invoke(null, new Object[] { args });  <br>    }  <br>  <br>    private ClassPool pool;  <br>  <br>    public SampleLoader() throws NotFoundException {  <br>        pool = new ClassPool();  <br>        pool.insertClassPath("./class"); // MyApp.class must be there.  <br>    }  <br>  <br>    /* Finds a specified class.  <br>     * The bytecode for that class can be modified.  <br>     */  <br>    protected Class findClass(String name) throws ClassNotFoundException {  <br>        try {  <br>            CtClass cc = pool.get(name);  <br>            // modify the CtClass object here  <br>            byte[] b = cc.toBytecode();  <br>            return defineClass(name, b, 0, b.length);  <br>        } catch (NotFoundException e) {  <br>            throw new ClassNotFoundException();  <br>        } catch (IOException e) {  <br>            throw new ClassNotFoundException();  <br>        } catch (CannotCompileException e) {  <br>            throw new ClassNotFoundException();  <br>        }  <br>    }  <br>}|

MyApp类是一个应用程序。为了执行这个应用，我们首先需要将类文件放到./class文件夹下，需要确保当前文件夹不在类搜索目录下，否则将会被SampleLoader的父类加载器，也就是系统默认的类加载器所加载。./class目录名称在insertClassPath方法中必须要有所体现，当然此目录名称是可以随意改变的。接下来我们运行如下命令：

|   |   |
|---|---|
|1|% java SampleLoader|

此时，类加载器将会加载MyApp类`（./class/MyApp.class）`并调用`MyApp.main`方法。

这是使用基于Javassist类加载器最简单的方式。然而，如果你想写一个更加复杂的类加载器，你需要对Java的类加载器机制有足够的了解。比如，上面的代码中，MyApp类的命名空间和`SampleLoader`类的命名空间是不同的，是因为这两个类是被不同的类加载器锁加载的。因此，MyApp类无法直接访问`SampleLoader`类。

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-5-%E4%BF%AE%E6%94%B9%E7%B3%BB%E7%BB%9F%E7%B1%BB)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-5-%E4%BF%AE%E6%94%B9%E7%B3%BB%E7%BB%9F%E7%B1%BB "3.5 修改系统类")3.5 修改系统类

系统类，比如`java.lang.String`，会优先被系统的类加载器所加载。因此，上面展示的`SampleLoader`或者`javassist.Loader`在进行类加载的时候，是无法修改系统类的。

如果需要进行修改的话，系统类必须被静态的修改。比如，下面的代码将会给`java.lang.String`添加一个`hiddenValue`的字段：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6|ClassPool pool = ClassPool.getDefault();  <br>CtClass cc = pool.get("java.lang.String");  <br>CtField f = new CtField(CtClass.intType, "hiddenValue", cc);  <br>f.setModifiers(Modifier.PUBLIC);  <br>cc.addField(f);  <br>cc.writeFile(".");|

此段代码会产生`./java/lang/String.class`文件。

为了能够让更改的String类在MyApp中运行，可以按照如下的方式来进行：

|   |   |
|---|---|
|1|% java -Xbootclasspath/p:. MyApp arg1 arg2...|

假设MyApp的代码如下：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5|public class MyApp {  <br>    public static void main(String[] args) throws Exception {  <br>        System.out.println(String.class.getField("hiddenValue").getName());  <br>    }  <br>}|

此更改的String类成功的被加载，然后打印出了hiddenValue。

需要注意的是：用如上的方式来修改rt.jar中的系统类并进行部署，会违反_Java 2 Runtime Environment binary code license._

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-6-%E8%BF%90%E8%A1%8C%E7%8A%B6%E6%80%81%E4%B8%8B%E9%87%8D%E6%96%B0%E5%8A%A0%E8%BD%BD%E7%B1%BB)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-6-%E8%BF%90%E8%A1%8C%E7%8A%B6%E6%80%81%E4%B8%8B%E9%87%8D%E6%96%B0%E5%8A%A0%E8%BD%BD%E7%B1%BB "3.6 运行状态下重新加载类")3.6 运行状态下重新加载类

如果JVM中的JPDA（Java Platform Debugger Architecture）是可用状态,那么一个类是可以被动态加载的。JVM加载类后，此类的之前版本将会被卸载，而新版本将会被加载。所以，从这里看出，在运行时状态，类是可以被动态更改的。然而，新的类必须能够和旧的类兼容，是因为JVM不允许直接更改类的整体框架，他们必须有相同的方法和字段。

Javassist提供了简单易用的方式来重新加载运行时的类。想要获取更多内容，请翻阅`javassist.tools.HotSwapper`的API文档。

# [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E5%9B%9B-%E5%AE%9A%E5%88%B6%E5%8C%96)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E5%9B%9B-%E5%AE%9A%E5%88%B6%E5%8C%96 "四 定制化")四 定制化

`CtClass`提供了很多方法来用进行定制化。Javassist可以和Java的反射API进行联合定制。`CtClass`提供了`getName`方法，`getSuperclass`方法，`getMethods`方法等等。`CtClass`同时也提供了方法来修改类定义，允许添加新的字段，构造，方法等。即便对于检测方法体这种事情来说，也是可行的。

方法都是被`CtMethod`对象所代表，它提供了多个方法用于改变方法的定义，需要注意的是，如果方法继承自父类，那么在父类中的同样方法将也会被`CtMethod`所代表。`CtMethod`对象可以正确的代表任何方法声明。

比如，Point类有一个move方法，其子类`ColorPoint`不会重写move方法， 那么在这里，两个move方法，将会被`CtMethod`对象正确的识别。如果`CtMethod`对象的方法定义被修改，那么此修改将会反映到两个方法上。如果你想只修改`ColorPoint`类中的`move`方法，你需要首先创建`ColorPoint`的副本，那么其`CtMethod`对象将也会被复制，`CtMethod`对象可以使用`CtNewMethod.copy`方法来实现。

Javassist不支持移除方法或者字段，但是支持修改名字。所以如果一个方法不再需要的话，可以在`CtMethod`中对其进行重命名并利用`setName`方法和`setModifiers`方法将其设置为私有方法。

Javassist不支持为已有的方法添加额外的参数。但是可以通过为一个新的方法创建额外的参数。比如，如果你想添加一个额外的int参数newZ到Point类的方法中：

|   |   |
|---|---|
|1|void move(int newX, int newY) { x = newX; y = newY; }|

你应当在Point类中添加如下方法

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4|void move(int newX, int newY, int newZ) {  <br>    // do what you want with newZ.  <br>    move(newX, newY);  <br>}|

Javassist同时也提供底层的API来直接修改原生的类文件。比如，`CtClass`类中的`getClassFile`方法可以返回一个`ClassFile`对象来代表一个原生的类文件。而`CtMethod`中的`getMethodInfo`方法则返回`MethodInfo`对象来代表一个类中的`method_info`结构。底层的API单词大多数来自于JVM，所以用于用起来不会感觉到陌生。更多的内容，可以参看 [`javassist.bytecode` package](http://www.javassist.org/tutorial/tutorial3.html#intro).

Javassist修改类文件的时候，一般不需要`javassist.runtime`包，除非一些特别的以`$`符号开头的。这些特殊符号会在后面进行讲解。更多的内容，可以参考`javassist.runtime`包中的API文档。

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-%E6%96%B9%E6%B3%95%E4%BD%93%E5%89%8D-%E5%90%8E%E7%A9%BF%E6%8F%92%E4%BB%A3%E7%A0%81%E6%AE%B5)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-%E6%96%B9%E6%B3%95%E4%BD%93%E5%89%8D-%E5%90%8E%E7%A9%BF%E6%8F%92%E4%BB%A3%E7%A0%81%E6%AE%B5 "4.1 方法体前/后穿插代码段")4.1 方法体前/后穿插代码段

`CtMethod`和`CtConstructor`提供了`insertBefore`，`insertAfter`，`addCatch`三个方法，它们用于在已存在的方法中插入代码段。使用者可以插入java代码段是因为Javassist内置了一个简易的java编译器来处理这些源码。此编译器会将java源码编译成字节码，然后插入到方法体中。

同时，在指定行号的位置插入代码段也是允许的（只有当行号在当前类中存在）。`CtMethod`和`CtConstructor`中的`insertAt`方法带有源码输入和行号的定义，它能够将编译后的代码段插入到指定了行号的位置。

`insertBefore``，insertAfter`，`addCatch`和`insertAt`方法均接受一个String类型的代表源码块的入参。此代码段可以是简单的控制类语句if和while，也可以是以分号结尾的表达式，都需要用左右大括号`{}`进行包装。因此，下面的示例源码都是符合要求的代码段：

|   |   |
|---|---|
|1  <br>2  <br>3|System.out.println("Hello");  <br>{ System.out.println("Hello"); }  <br>if (i < 0) { i = -i; }|

代码段可以指向字段和方法，也可以为编译器添加-g选项来让其指向插入的方法中的参数。否则，只能利用`$0,$1,$2...`这种如下的变量来进行访问。虽然不允许访问方法中的本地变量，但是在方法体重定义一个新的本地变量是允许的。例外的是，编译器开启了`-g`选项的话，`insertAt`方法是允许代码段访问本地变量的。

`insertBefore`，`insertAfter`，`addCatch`和`insertAt`入参中的String对象，也就是用户输入的代码段，会被Javassist中的编译器编译，由于此编译器支持语言扩展，不同的`$`符号有不同的含义：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12|$0, $1, $2, ...    	this and actual parameters  <br>$args	An array of parameters. The type of $args is Object[].  <br>$$	All actual parameters.  <br>For example, m($$) is equivalent to m($1,$2,...)  <br>   <br>$cflow(...)	cflow variable  <br>$r	The result type. It is used in a cast expression.  <br>$w	The wrapper type. It is used in a cast expression.  <br>$_	The resulting value  <br>$sig	An array of java.lang.Class objects representing the formal parameter types.  <br>$type	A java.lang.Class object representing the formal result type.  <br>$class	A java.lang.Class object representing the class currently edited.|

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-1-0-1-2)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-1-0-1-2 "4.1.1 $0, $1, $2, ...")4.1.1 `$0, $1, $2, ...`

传给目标方法的参数`$1,$2...`将会替换掉原始的参数名称。`$1`代表第一个参数，`$2`代表第二个参数，以此类推。这些参数的类型和原始的参数类型是一致的。`$0`等价于`this`关键字，如果方法为`static`，那么`$0`将不可用。

这些变量的使用方法如下，以Point类为例：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4|class Point {  <br>    int x, y;  <br>    void move(int dx, int dy) { x += dx; y += dy; }  <br>}|

调用`move`方法，打印`dx`和`dy`的值，执行如下的程序

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5|ClassPool pool = ClassPool.getDefault();  <br>CtClass cc = pool.get("Point");  <br>CtMethod m = cc.getDeclaredMethod("move");  <br>m.insertBefore("{ System.out.println($1); System.out.println($2); }");  <br>cc.writeFile();|

需要注意的是，`insertBefore`方法中的代码段是被大括号{}包围的，此方法只接受一个被大括号包围的代码段入参。

更改之后的Point类如下：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7|class Point {  <br>    int x, y;  <br>    void move(int dx, int dy) {  <br>        { System.out.println(dx); System.out.println(dy); }  <br>        x += dx; y += dy;  <br>    }  <br>}|

`$1`和`$2`被`dx`和`dy`替换掉。

从这里可以看出，`$1`,`$2`,`$3`…是可以被更新的。如果一个新的值被赋予了这几个变量中的任意一个，那么这个变量对应的参数值也会被更新。下面来说说其他的参数。

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-2-args)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-2-args "4.1.2 $args")4.1.2 `$args`

`$args`变量代表所有参数列表。其类型为Object数组类型。如果一个参数类型基础数据类型，比如`int`，那么将会被转换为`java.lang.Integer`并放到`$args`中。因此，`$args[0]`一般情况下等价于`$1`，除非第一个参数的类型为基础数据类型。需要注意的是，`$args[0]`和`$0`是不等价的，因为`$0`代表`this`关键字。

如果`object`列表被赋值给`$args`，那么列表中的每个元素将会被分配给对应的参数。如果一个参数的类型为基础数据类型，那么对应的正确的数据类型为包装过的类型。此转换会发生在参数被分配之前。

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-3)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-3 "4.1.3 $$$$")4.1.3 $$$$

$$$$是被逗号分隔的所有参数列表的缩写。比如，如果`move`方法中的参数数量有三个，那么

|   |   |
|---|---|
|1|move($$)|

等价于：

|   |   |
|---|---|
|1|move($1,$2,$3)|

如果`move()`无入参，那么`move($$)`等价于`move().`

$$$$也可以被用于其他的场景，如果你写了如下的表达式：

|   |   |
|---|---|
|1|exMove($$,context)|

那么此表达式等价于：

|   |   |
|---|---|
|1|exMove($1,$2,$3,context)|

需要注意的是，$$$$虽说是方法调用的通用符号，但是一般和`$proceed`联合使用，后面会讲到。

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-4-cflow)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-4-cflow "4.1.4 $cflow")4.1.4 `$cflow`

代表着“流程控制”。这个只读变量会返回方法的递归调用深度。

假设如下的方法代表`CtMethod`中的对象`cm`：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6|int fact(int n) {  <br>    if (n <= 1)  <br>        return n;  <br>    else  <br>        return n * fact(n - 1);  <br>}|

为了使用`$cflow`,首先需要引用`$cflow`，用于监听fact方法的调用

|   |   |
|---|---|
|1  <br>2|CtMethod cm = ...;  <br>cm.useCflow("fact");|

`useCflow()`方法就是用来声明`$cflow`变量。任何可用的java命名都可以用来进行识别。此名称也可以包含`.`(点号)，比如`"my.Test.face"`也是可以的。

然后，`$cflow(fact)`代表着方法cm递归调用的深度。当方法第一次被调用的时候，`$cflow(fact)`的值为0，再调用一次，此值将会变为1.比如：

|   |   |
|---|---|
|1  <br>2|cm.insertBefore("if ($cflow(fact) == 0)"  <br>              + "    System.out.println(\"fact \" + $1);");|

代码段将`fact`方法进行编译以便于能够看到对应的参数。由于`$cflow(fact)`被选中，那么对`fact`方法的递归调用将不会显示参数。

`$cflow`的值是当前线程中，从cm方法中，最上层栈帧到当前栈帧的值。`$cflow`同时和cm方法在同一个方法内部的访问权限也是不一样的。

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-5-r)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-5-r "4.1.5 $r")4.1.5 `$r`

代表着结果类型，必须在转换表达式中用作类型转换。比如，如下用法

|   |   |
|---|---|
|1  <br>2|Object result = ... ;  <br>$_ = ($r)result;|

如果结果类型为基础数据类型，那么`($r)`需要遵循如下的规则：

首先，如果操作数类型是基础数据类型，`($r)`将会被当做普通的转义符。相反的，如果操作数类型是包装类型，那么`($r)`将会把此包装类型转换为结果类型，比如如果结果类型是`int`，那么`($r)`会将`java.lang.Integer`转换为`intl`；如果结果类型是`void`，那么`($r)`将不会进行类型转换；如果当前操作调用了`void`方法，那么`($r)`将会返回`null`。举个例子，如果`foo`方法是`void`方法，那么:

|   |   |
|---|---|
|1|$_ = ($r)foo();|

是一个有效的申明。

转换符号`($r)`同时也用于return申明中，即便返回类型是void，如下的return申明也是有效的：

|   |   |
|---|---|
|1|return ($r)result;|

这里，result是一个本地变量，由于`($r)`这里做了转换，那么返回结果是无效的。此时的return申明和没有任何返回的return申明是等价的:

|   |   |
|---|---|
|1|return;|

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-6-w)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-6-w "4.1.6 $w")4.1.6 `$w`

代表包装类型。必须在转义表达式中用于类型转换。`($w)`将基础类型转换为对应的包装类型，如下代码示例

|   |   |
|---|---|
|1|Integer i = ($w)5;|

结果类型依据`($w)`后面的表达式来确定，如果表达式是double类型，那么包装类型则为`java.lang.Double`。如果`($w)`后面的表达式不是基础类型，那么`($w)`将不进行任何转换。

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-7)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-7 "4.1.7 $_")4.1.7 `$_`

`CtMethod`和`CtConstructor`中的`insertAfter`方法将编译过的代码插入到方法的尾部。之前给过的一些例子有关`insertAfter`的例子中，不仅包括$0.$1这种例子的讲解，而且包括`$_`的这种例子。说道`$_`变量，它用来代表方法的结果值。其变量类型是方法返回的结果类型。如果返回的结果类型是void，那么`$_`的类型是Object类型，但是其值为`null`。

尽管利用`insertAfter`插入的编译过的代码，是在方法返回之前被执行的，但是这种代码也可以在在方法抛出的`exception`中执行。为了能够让其在方法抛出的`exception`中执行，`insertAfter`方法中的第二个参数`asFinally`必须为true。

当`exception`被抛出的时候，利用`insertAfter`方法插入的代码段将会和作为`finally`代码块来执行。此时在编译过的代码中，`$_`的值为0或者null。当此代码段执行完毕后，`exception`会被重新抛给调用端。需要注意的是，`$_`是永远不会被抛给调用端的，它会直接被抛弃掉。

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-8-sig)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-8-sig "4.1.8 $sig")4.1.8 `$sig`

`$type`的值是`java.lang.Class`对象，代表着返回值的正确的类型。如果它指向的是构造器，那么其值为`Void.class`。

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-9-class)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-9-class "4.1.9 $class")4.1.9 `$class`

`$class`的值是`java.lang.Class`对象，代表着当前编辑的方法，此时和`$0`是等价的。

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-10-addCatch)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-10-addCatch "4.1.10 addCatch()")4.1.10 `addCatch()`

此方法用于将代码段插入到方法体中进行执行，在执行过程中一旦方法体抛出`exception`，可以控制给发送给客户端的返回。下面的源码展示了利用特殊的变量`$e`来指向`exception`

|   |   |
|---|---|
|1  <br>2  <br>3|CtMethod m = ...;  <br>CtClass etype = ClassPool.getDefault().get("java.io.IOException");  <br>m.addCatch("{ System.out.println($e); throw $e; }", etype);|

此方法体m被翻译出来后，展示如下：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7|try {  <br>    the original method body  <br>}  <br>catch (java.io.IOException e) {  <br>    System.out.println(e);  <br>    throw e;  <br>}|

需要注意的是，插入的代码段必须以`throw`或者`return`命令结尾。

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-%E4%BF%AE%E6%94%B9%E6%96%B9%E6%B3%95%E4%BD%93)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-%E4%BF%AE%E6%94%B9%E6%96%B9%E6%B3%95%E4%BD%93 "4.2 修改方法体")4.2 修改方法体

`CtMethod`和`CtContructor`提供`setBody`方法来取代整个方法体。此方法能够将传入的代码段编译为Java字节码，然后用此字节码将其原有的方法体给替换掉。如果给定代码段为空，那么被替换的方法体将只有`return 0`声明，如果结果类型为`void`，那么则只有`return null`声明。

外部传入给`setBody`方法的代码段，会包含如下的以`$`开头的识别码，这些识别码有不同的含义：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10|$0, $1, $2, ...    	this and actual parameters  <br>$args	An array of parameters. The type of $args is Object[].  <br>$$	All actual parameters.  <br>$cflow(...)	cflow variable  <br>$r	The result type. It is used in a cast expression.  <br>$w	The wrapper type. It is used in a cast expression.  <br>$sig	An array of java.lang.Class objects representing the formal parameter types.  <br>$type	A java.lang.Class object representing the formal result type.  <br>$class	A java.lang.Class object representing the class that declares the method  <br>currently edited (the type of $0).|

需要注意的是，此时`$_`是不可用的。

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-1-%E5%88%A9%E7%94%A8%E6%BA%90%E6%96%87%E6%9C%AC%E6%9B%BF%E6%8D%A2%E7%8E%B0%E6%9C%89%E8%A1%A8%E8%BE%BE%E5%BC%8F)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-1-%E5%88%A9%E7%94%A8%E6%BA%90%E6%96%87%E6%9C%AC%E6%9B%BF%E6%8D%A2%E7%8E%B0%E6%9C%89%E8%A1%A8%E8%BE%BE%E5%BC%8F "4.2.1 利用源文本替换现有表达式")4.2.1 利用源文本替换现有表达式

Javassist允许修改方法体中的表达式。可以利用`javassist.expr.ExprEditor`类来进行替换操作。用户可以通过定义`ExprEditor`的子类来修改表达式。为了运行`ExprEditor`对象，用户必须调用`CtMethod`或者`CtClass`中的`instrument`方法来进行，示例如下

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11|CtMethod cm = ... ;  <br>cm.instrument(  <br>    new ExprEditor() {  <br>        public void edit(MethodCall m)  <br>                      throws CannotCompileException  <br>        {  <br>            if (m.getClassName().equals("Point")  <br>                          && m.getMethodName().equals("move"))  <br>                m.replace("{ $1 = 0; $_ = $proceed($$); }");  <br>        }  <br>    });|

上面例子可以看出，通过搜索cm方法体中，通过替换掉Point类中的move方法为如下代码后，

|   |   |
|---|---|
|1|{ $1 = 0; $_ = $proceed($$); }|

`move`方法中的第一个参数将永远为`0`，需要注意的替换的代码不仅仅是表达式，也可以是声明或者代码块，但是不能是`try-catch`声明。

`instrument`方法可以用来搜索方法体，如果找到了待替换的表达式，比如说方法体，字段，创建的类等，之后它会调用`ExprEditor`对象中的`edit`方法来进行修改。传递给`edit`方法的参数是找寻到的表达式对象，然后`edit`方法就可以通过此表达式对象来进行替换操作。

通过调用传递给`edit`方法的表达式对象中的`replace`方法，可以用来替换成给定的的表达式声明或者代码段。如果给定的代码段是空的，那么也就是说，将会执行`replace("{}")`方法，那么之前的代码段将会在方法体中被移除。如果你仅仅是想在表达式之前或者之后插入代码段操作，那么你需要将下面的代码段传递给`replace`方法：

|   |   |
|---|---|
|1  <br>2  <br>3|{ before-statements;  <br>  $_ = $proceed($$);  <br>  after-statements; }|

此代码段可以是方法调用，字段访问，对象创建等等。

再来看看第二行声明：

|   |   |
|---|---|
|1|$_ = $proceed();|

上面表达式代表着读访问操作，也可以用如下声明来代表写访问操作:

|   |   |
|---|---|
|1|$proceed($$);|

目标表达式中的本地变量是可以通过`replace`方法传递到被`instrument`方法查找到的代码段中的，如果编译的时候开启了`-g`选项的话。

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-2-javassist-expr-MethodCall)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-2-javassist-expr-MethodCall "4.2.2 javassist.expr.MethodCall")4.2.2 javassist.expr.MethodCall

`MethodCall`对象代表了一个方法调用，它里面的`replace`方法可以对方法调用进行替换，它通过接收准备传递给`insertBefore`方法中的以`$`开头的识别符号来进行替换操作：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12|$0	The target object of the method call.  <br>This is not equivalent to this, which represents the caller-side this object.  <br>$0 is null if the method is static.  <br>   <br>   <br>$1, $2, ...    	The parameters of the method call.  <br>$_	The resulting value of the method call.  <br>$r	The result type of the method call.  <br>$class    	A java.lang.Class object representing the class declaring the method.  <br>$sig    	An array of java.lang.Class objects representing the formal parameter types.  <br>$type    	A java.lang.Class object representing the formal result type.  <br>$proceed    	The name of the method originally called in the expression.|

这里，方法调用是指`MethodCall`对象。$$w`,`$args`和`$$$在这里都是可用的，除非方法调用的结果类型为`void`，此时，`$_`必须被赋值且`$_`的类型就是返回类型。如果调用的结果类型为`Object`，那么`$_`的类型就是`Object`类型且赋予`$_`的值可以被忽略。

`$proceed`不是字符串，而是特殊的语法，它后面必须利用小括号`（）`来包上参数列表。

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-3-javassist-expr-ConstructorCall)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-3-javassist-expr-ConstructorCall "4.2.3 javassist.expr.ConstructorCall")4.2.3 javassist.expr.ConstructorCall

代表构造器调用，比如`this()`调用和构造体中的`super`调用。其中的`replace`方法可以用来替换代码段。它通过接收`insertBefore`方法中传入的含有以`$`开头的代码段来进行替换操作：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5|$0	The target object of the constructor call. This is equivalent to this.  <br>$1, $2, ...    	The parameters of the constructor call.  <br>$class    	A java.lang.Class object representing the class declaring the constructor.  <br>$sig    	An array of java.lang.Class objects representing the formal parameter types.  <br>$proceed    	The name of the constructor originally called in the expression.|

这里，构造器调用代表着`ContructorCall`对象，其他的符号，比如$$w`,`$args`和`$$$也是可用的。

由于构造器调用，要么是父类调用，要么是类中的其他构造器调用，所以被替换的方法体必须包含构造器调用操作，一般情况下都是调用`$proceed()`.

`$proceed`不是字符串，而是特殊的语法，它后面必须利用小括号`（）`来包上参数列表。

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-4-javassist-expr-FieldAccess)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-4-javassist-expr-FieldAccess "4.2.4 javassist.expr.FieldAccess")4.2.4 javassist.expr.FieldAccess

此对象代表着字段访问。`ExprEditor`中的`edit`方法中如果有字段访问被找到，那么就会接收到这个对象。`FieldAccess`中的`replace`方法接收待替换的字段。

在代码段中，以`$`开头的识别码有如下特殊的含义：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17|$0	The object containing the field accessed by the expression. This is not equivalent to this.  <br>this represents the object that the method including the expression is invoked on.  <br>$0 is null if the field is static.  <br>   <br>   <br>$1	The value that would be stored in the field if the expression is write access.  <br>Otherwise, $1 is not available.  <br>   <br>$_	The resulting value of the field access if the expression is read access.  <br>Otherwise, the value stored in $_ is discarded.  <br>   <br>$r	The type of the field if the expression is read access.  <br>Otherwise, $r is void.  <br>   <br>$class    	A java.lang.Class object representing the class declaring the field.  <br>$type	A java.lang.Class object representing the field type.  <br>$proceed    	The name of a virtual method executing the original field access. .|

其他的识别符，例如$$w`,`$args`和`$$$都是可用的。如果表达式是可访问的，代码段中，`$_`必须被赋值，且`$_`的类型就是此字段的类型。

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-5-javassist-expr-NewExpr)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-5-javassist-expr-NewExpr "4.2.5 javassist.expr.NewExpr")4.2.5 javassist.expr.NewExpr

`NewExpr`对象代表利用`new`操作符来进行对象创建。其`edit`方法接收对象创建行为，其`replace`方法则可以接收传入的代码段，将现有的对象创建的表达式进行替换。

在代码段中，以`$`开头的识别码有如下含义：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9|$0	null.  <br>$1, $2, ...    	The parameters to the constructor.  <br>$_	The resulting value of the object creation.  <br>A newly created object must be stored in this variable.  <br>   <br>$r	The type of the created object.  <br>$sig    	An array of java.lang.Class objects representing the formal parameter types.  <br>$type    	A java.lang.Class object representing the class of the created object.  <br>$proceed    	The name of a virtual method executing the original object creation. .|

其他的识别码，比如$$w`,`$args`和`$$$也都是可用的。

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-6-javassist-expr-NewArray)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-6-javassist-expr-NewArray "4.2.6 javassist.expr.NewArray")4.2.6 javassist.expr.NewArray

此对象表示利用`new`操作符进行的数组创建操作。其`edit`方法接收数组创建操作的行为，其`replace`方法则可以接收传入的代码段，将现有的数组创建的表达式进行替换。

在代码段中，以`$`开头的识别码有如下含义：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8|$0	null.  <br>$1, $2, ...    	The size of each dimension.  <br>$_	The resulting value of the array creation.  <br>A newly created array must be stored in this variable.  <br>   <br>$r	The type of the created array.  <br>$type    	A java.lang.Class object representing the class of the created array.  <br>$proceed    	The name of a virtual method executing the original array creation. .|

其他的识别码，比如$$w`,`$args`和`$$$也是可用的。

比如，如果数组创建的表达式如下：

|   |   |
|---|---|
|1|String[][] s = new String[3][4];|

那么，`$1`和`$2`的值将分别为`3`和`4`，而`$3`则是不可用的。

但是，如果数组创建的表达式如下：

|   |   |
|---|---|
|1|String[][] s = new String[3][];|

那么，`$1`的值为`3`，而`$2`是不可用的。

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-7-javassist-expr-Instanceof)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-7-javassist-expr-Instanceof "4.2.7 javassist.expr.Instanceof")4.2.7 javassist.expr.Instanceof

此对象代表`instanceof`表达式。其`edit`方法接收`instanceof`表达式行为，其`replace`方法则可以接收传入的代码段，将现有的表达式进行替换。

在代码段中，以`$`开头的识别码有如下含义：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9|$0	null.  <br>$1	The value on the left hand side of the original instanceof operator.  <br>$_	The resulting value of the expression. The type of $_ is boolean.  <br>$r	The type on the right hand side of the instanceof operator.  <br>$type	A java.lang.Class object representing the type on the right hand side of the instanceof operator.  <br>$proceed    	The name of a virtual method executing the original instanceof expression.  <br>It takes one parameter (the type is java.lang.Object) and returns true  <br>if the parameter value is an instance of the type on the right hand side of  <br>the original instanceof operator. Otherwise, it returns false.|

其他的识别码，比如$$w`,`$args`和`$$$也是可用的。

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-8-javassist-expr-Cast)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-8-javassist-expr-Cast "4.2.8 javassist.expr.Cast")4.2.8 javassist.expr.Cast

此对象代表显式类型转换。其`edit`方法接收显式类型转换的行为，其`replace`方法则可以接收传入的代码段，将现有的代码段进行替换。

在代码段中，以`$`开头的识别码有如下的含义：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10|$0	null.  <br>$1	The value the type of which is explicitly cast.  <br>$_	The resulting value of the expression. The type of $_ is the same as the type  <br>after the explicit casting, that is, the type surrounded by ( ).  <br>   <br>$r	the type after the explicit casting, or the type surrounded by ( ).  <br>$type	A java.lang.Class object representing the same type as $r.  <br>$proceed    	The name of a virtual method executing the original type casting.  <br>It takes one parameter of the type java.lang.Object and returns it after  <br>the explicit type casting specified by the original expression.|

其他的识别码，比如$$w`,`$args`和`$$$也是可用的。

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-9-javassist-expr-Handler)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-9-javassist-expr-Handler "4.2.9 javassist.expr.Handler")4.2.9 javassist.expr.Handler

此对象代表`try-catch`申明中的`catch`子句。其`edit`方法接收`catch`表达式行为，其`insertBefore`方法将接收的代码段进行编译，然后将其插入到`catch`子句的开始部分。

在代码段中，以`$`开头的识别码有如下的含义：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5|$1	The exception object caught by the catch clause.  <br>$r	the type of the exception caught by the catch clause. It is used in a cast expression.  <br>$w	The wrapper type. It is used in a cast expression.  <br>$type    	A java.lang.Class object representing  <br>the type of the exception caught by the catch clause.|

如果一个新的`exception`对象被赋值给`$1`，那么它将会将此`exception`传递给原有的`catch`子句并被捕捉。

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-3-%E6%B7%BB%E5%8A%A0%E6%96%B0%E6%96%B9%E6%B3%95%E6%88%96%E5%AD%97%E6%AE%B5)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-3-%E6%B7%BB%E5%8A%A0%E6%96%B0%E6%96%B9%E6%B3%95%E6%88%96%E5%AD%97%E6%AE%B5 "4.3 添加新方法或字段")4.3 添加新方法或字段

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-3-1-%E6%B7%BB%E5%8A%A0%E4%B8%80%E4%B8%AA%E6%96%B9%E6%B3%95)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-3-1-%E6%B7%BB%E5%8A%A0%E4%B8%80%E4%B8%AA%E6%96%B9%E6%B3%95 "4.3.1 添加一个方法")4.3.1 添加一个方法

Javassist一开始就允许用户创建新的方法和构造，`CtNewMethod`和`CtNewConstructor`提供了多种静态工厂方法来创建`CtMethod`或者`CtConstructor`对象。特别说明一下，其`make`方法可以从给定的代码段中创建`CtMethod`或者`CtContructor`对象。

比如，如下程序：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5|CtClass point = ClassPool.getDefault().get("Point");  <br>CtMethod m = CtNewMethod.make(  <br>                 "public int xmove(int dx) { x += dx; }",  <br>                 point);  <br>point.addMethod(m);|

添加了一个公共方法`xmove`到Point类中，此例子中，x是Point类中的int字段。

`make`方法中的代码段可以包含以`$`开头的识别码，但是`setBydy`方法中的`$_`除外。如果目标对象和目标方法的名字也传递给了`make`方法，那么此方法也可以包含`$proceed`。比如：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4|CtClass point = ClassPool.getDefault().get("Point");  <br>CtMethod m = CtNewMethod.make(  <br>                 "public int ymove(int dy) { $proceed(0, dy); }",  <br>                 point, "this", "move");|

上面代码创建如下`ymove`方法定义:

|   |   |
|---|---|
|1|public int ymove(int dy) { this.move(0, dy); }|

需要注意的是，`$proceed`已经被`this.move`替换掉了。

Javassist也提供另一种方式来添加新方法，你可以首先创建一个`abstract`方法，然后赋予它方法体：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6|CtClass cc = ... ;  <br>CtMethod m = new CtMethod(CtClass.intType, "move",  <br>                          new CtClass[] { CtClass.intType }, cc);  <br>cc.addMethod(m);  <br>m.setBody("{ x += $1; }");  <br>cc.setModifiers(cc.getModifiers() & ~Modifier.ABSTRACT);|

如果一个`abstract`方法被添加到了类中，此时Javassist会将此类也变为`abstract`，为了解决这个问题，你不得不利用`setBody`方法将此类变回非`abstract`状态。

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-3-2-%E7%9B%B8%E4%BA%92%E9%80%92%E5%BD%92%E8%B0%83%E7%94%A8%E6%96%B9%E6%B3%95)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-3-2-%E7%9B%B8%E4%BA%92%E9%80%92%E5%BD%92%E8%B0%83%E7%94%A8%E6%96%B9%E6%B3%95 "4.3.2 相互递归调用方法")4.3.2 相互递归调用方法

当一个方法调用另一个为添加到操作类中的方法时，Javassist是无法编译此方法的（Javassist可以编译自己调用自己的递归方法）。为了添加相互递归调用的方法到类中，你需要如下的窍门来进行。假设你想添加m和n方法到cc中:

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8|CtClass cc = ... ;  <br>CtMethod m = CtNewMethod.make("public abstract int m(int i);", cc);  <br>CtMethod n = CtNewMethod.make("public abstract int n(int i);", cc);  <br>cc.addMethod(m);  <br>cc.addMethod(n);  <br>m.setBody("{ return ($1 <= 0) ? 1 : (n($1 - 1) * $1); }");  <br>n.setBody("{ return m($1); }");  <br>cc.setModifiers(cc.getModifiers() & ~Modifier.ABSTRACT);|

首先，你需要创建两个`abstract`方法并把他们添加到类中。

然后，为方法设置方法体，方法体内部可以实现相互调用。

最后，将类变为非`abstract`的，因为`addMethod`添加`abstract`方法的时候，会自动将类变为`abstract`的。

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-3-3-%E6%B7%BB%E5%8A%A0%E5%AD%97%E6%AE%B5)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-3-3-%E6%B7%BB%E5%8A%A0%E5%AD%97%E6%AE%B5 "4.3.3 添加字段")4.3.3 添加字段

Javassist允许用户创建一个新的字段：

|   |   |
|---|---|
|1  <br>2  <br>3|CtClass point = ClassPool.getDefault().get("Point");  <br>CtField f = new CtField(CtClass.intType, "z", point);  <br>point.addField(f);|

上面的diam会添加z字段到Point类中。

如果添加的字段需要设定初始值的话，代码需要被改为如下方式来进行：

|   |   |
|---|---|
|1  <br>2  <br>3|CtClass point = ClassPool.getDefault().get("Point");  <br>CtField f = new CtField(CtClass.intType, "z", point);  <br>point.addField(f, "0");    // initial value is 0.|

现在，`addField`方法接收了第二个用于计算初始值的参数。此参数可以为任何符合要求的java表达式。需要注意的是，此表达式不能够以分号结束`(;)`。

此外，上面的代码可以被重写为如下更简单的方式：

|   |   |
|---|---|
|1  <br>2  <br>3|CtClass point = ClassPool.getDefault().get("Point");  <br>CtField f = CtField.make("public int z = 0;", point);  <br>point.addField(f);|

### [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-3-4-%E6%88%90%E5%91%98%E7%A7%BB%E9%99%A4)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-3-4-%E6%88%90%E5%91%98%E7%A7%BB%E9%99%A4 "4.3.4 成员移除")4.3.4 成员移除

为了移除字段或者方法，可以调用`CtClass`类中的`removeField`或者`removeMethod`来进行。而移除`CtConstructor`，可以通过调用`removeConstructor`方法来进行。

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-4-Annotations)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-4-Annotations "4.4 Annotations")4.4 Annotations

`CtClass`，`CtMethod`，`CtField`和`CtConstructor`提供了`getAnnotations`这个快捷的方法来进行注解的读取操作，它会返回注解类型对象。

比如，如下注解方式：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4|public @interface Author {  <br>    String name();  <br>    int year();  <br>}|

可以按照如下方式来使用:

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4|@Author(name="Chiba", year=2005)  <br>public class Point {  <br>    int x, y;  <br>}|

此时，这些注解的值就可以用getAnnotations方法来获取，此方法将会返回包含了注解类型的对象列表。

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6|CtClass cc = ClassPool.getDefault().get("Point");  <br>Object[] all = cc.getAnnotations();  <br>Author a = (Author)all[0];  <br>String name = a.name();  <br>int year = a.year();  <br>System.out.println("name: " + name + ", year: " + year);|

上面代码打印结果如下：

|   |   |
|---|---|
|1|name: Chiba, year: 2005|

由于Point类的注解只有`@Author`,所以`all`列表的长度只有一个，且`all[0]`就是`Author`对象。名字和年龄这俩注解字段值可以通过调用`Author`对象中的`name`方法和`year`来获取。

为了使用`getAnnotations`方法，类似`Author`这种注解类型必须被包含在当前的类路径中，同时必须能够被`ClassPool`对象所访问，如果类的注解类型无法被找到，Javassist就无法获取此注解类型的默认注解值。

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-5-%E8%BF%90%E8%A1%8C%E6%97%B6%E7%B1%BB%E6%94%AF%E6%8C%81)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-5-%E8%BF%90%E8%A1%8C%E6%97%B6%E7%B1%BB%E6%94%AF%E6%8C%81 "4.5 运行时类支持")4.5 运行时类支持

在大部分情况下，在Javassist中修改类并不需要Javassist运行时的支持。但是，有些基于Javassist编译器生成的字节码，则需要`javassist.runtime`这种运行时支持类包的支持（更多细节请访问此包的API）。需要注意的是，`javassist.runtime`包是Javassist中进行类修改的时候，唯一可能需要调用的包。

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-6%E5%AF%BC%E5%85%A5)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-6%E5%AF%BC%E5%85%A5 "4.6导入")4.6导入

所有的源码中的类名，必须是完整的（必须包含完整的包名），但是`java.lang`包例外，比如，Javassist编译器可以将`java.lang`包下的Object转换为`java.lang.Object`。

为了让编译器能够找到类名锁对应的包，可以通过调用`ClassPool`的`importPackage`方法来进行，示例如下：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5|ClassPool pool = ClassPool.getDefault();  <br>pool.importPackage("java.awt");  <br>CtClass cc = pool.makeClass("Test");  <br>CtField f = CtField.make("public Point p;", cc);  <br>cc.addField(f);|

第二行代表引入`java.awt`包，那么第三行就不会抛出错误，因为编译器可以将Point类识别为`java.awt.Point`。

需要注意的是，`importPckage`方法不会影响到`ClassPool`中的`get`方法操作，只会影响到编译器的包导入操作。`get`方法中的参数在任何情况下，必须是完整的，包含包路径的。

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-7%E9%99%90%E5%88%B6)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-7%E9%99%90%E5%88%B6 "4.7限制")4.7限制

在当前扩展中，Javassist中的Java编译器有语言层面的几大限制，具体如下：

不支持J2SE 5.0中的新语法(包括enums和generics)。Javassist底层API才会支持注解，具体内容可以查看`javassist.bytecode.annotation`包（`CtClass`和`CtBehavior`中的`getAnnotations`方法）。泛型被部分支持，可以查看[后面的章节](http://www.javassist.org/tutorial/tutorial3.html#generics)来了解更详细的内容。

数组初始化，也就是被双括号包围的以逗号分隔的表达式，不支持同时初始化多个。

不支持内部类或者匿名类。需要注意的是，这仅仅是因为编译器不支持，所以无法编译匿名表达式。但是Javassist本身是可以读取和修改内部类或者匿名类的。

`continue`和`break`关键字不支持。

编译器不能够正确的识别java的方法派发模型，如果使用了这种方式，将会造成编译器解析的混乱。比如：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8|class A {}   <br>class B extends A {}   <br>class C extends B {}   <br>  <br>class X {   <br>    void foo(A a) { .. }   <br>    void foo(B b) { .. }   <br>}|

如果编译的表达式是`x.foo(new C())`，其中x变量指向了X类实例，此时编译器尽管可以正确的编译`foo((B)new C())`，但是它依旧会将会调用`foo(A)`。

推荐用户使用`#`号分隔符来分隔类名和静态方法或者字段名。比如在java中，正常情况下我们会这么调用：

|   |   |
|---|---|
|1|javassist.CtClass.intType.getName()|

我们会访问`javassist.Ctclass`中的静态字段`intType`，然后调用其`getName`方法。而在Javassist中，我们可以按照如下的表达式来书写：

|   |   |
|---|---|
|1|javassist.CtClass#intType.getName()|

这样编译器就能够快速的解析此表达式了。

# [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E4%BA%94-%E5%AD%97%E8%8A%82%E7%A0%81API)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E4%BA%94-%E5%AD%97%E8%8A%82%E7%A0%81API "五 字节码API")五 字节码API

为了直接修改类文件，Javassist也提供了底层的API，想使用这些API的话，你需要有良好的Java字节码知识储备和类文件格式的认知，这样，你使用这些API修改类文件的时候，才可以随心所欲而不逾矩。

如果你只是想生成一个简单的类文件，那么`javassist.bytecode.ClassFileWriter`类可以做到。它虽然体积小，但是是比`javassist.bytecode.ClassFile`更为快速的存在。

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#5-1-%E8%8E%B7%E5%8F%96ClassFile%E5%AF%B9%E8%B1%A1)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#5-1-%E8%8E%B7%E5%8F%96ClassFile%E5%AF%B9%E8%B1%A1 "5.1 获取ClassFile对象")5.1 获取ClassFile对象

一个`javassist.bytecode.ClassFile`对象就代表着一个类文件，为了获取这个对象，`CtClass`中的`getClassFile`方法可以做到。如果不想这么做的话，你也可以直接在类文件中构造一个`javassist.bytecode.ClassFile`，代码如下：

|   |   |
|---|---|
|1  <br>2  <br>3|BufferedInputStream fin  <br>    = new BufferedInputStream(new FileInputStream("Point.class"));  <br>ClassFile cf = new ClassFile(new DataInputStream(fin));|

这个代码片段展示了从Point.class类中创建出一个ClassFile对象出来。

既然可以从类文件中创建出`ClassFile`，那么也能将`ClassFile`回写到类文件中。`ClassFile`中的`write`方法就可以将类文件内容回写到给定的`DataOutputStream`中。让我们全程展示一下这种做法：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8|ClassFile cf = new ClassFile(false, "test.Foo", null);  <br>cf.setInterfaces(new String[] { "java.lang.Cloneable" });  <br>   <br>FieldInfo f = new FieldInfo(cf.getConstPool(), "width", "I");  <br>f.setAccessFlags(AccessFlag.PUBLIC);  <br>cf.addField(f);  <br>  <br>cf.write(new DataOutputStream(new FileOutputStream("Foo.class")));|

上面的代码生成了`Foo.class`这个类文件，它包含了对如下类的扩展：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4|package test;  <br>class Foo implements Cloneable {  <br>    public int width;  <br>}|

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#5-2-%E6%B7%BB%E5%8A%A0%E5%92%8C%E5%88%A0%E9%99%A4%E6%88%90%E5%91%98)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#5-2-%E6%B7%BB%E5%8A%A0%E5%92%8C%E5%88%A0%E9%99%A4%E6%88%90%E5%91%98 "5.2 添加和删除成员")5.2 添加和删除成员

`ClassFile`提供了`addField`方法和`addMethod`方法来添加字段或者方法（需要注意的是，在字节码层面上说来，构造器也被视为方法），同时也提供了`addAttribute`方法来为类文件添加属性。

需要注意的是`FiledInfo``MethodInfo`和`AttributeInfo`对象包含了对`ConstPool（const pool table）`对象的指向。此`ConstPool`对象被添加到`ClassFile`对象中后，在`ClassFile`对象和`FiledInfo`对象（或者是`MethodInfo`对象等）中必须是共享的。换句话说，`FiledInfo`对象（或者`MethodInfo`对象等）在不同的`ClassFile`中是不能共享的。

为了从`ClassFile`对象中移除字段或者方法，你必须首先通过类的`getFields`方法获取所有的字段以及`getMethods`方法获取所有的方法来生成`java.util.List`对象，然后将此对象返回。之后就可以通过`List`对象上的`remove`方法来移除字段或者方法了，属性的移除方式也不例外，只需要通过`FiledInfo`或者`MethodInfo`中的`getAttributes`方法来获取到属性列表后，然后将相关属性从中移除即可。

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#5-3-%E9%81%8D%E5%8E%86%E6%96%B9%E6%B3%95%E4%BD%93)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#5-3-%E9%81%8D%E5%8E%86%E6%96%B9%E6%B3%95%E4%BD%93 "5.3 遍历方法体")5.3 遍历方法体

为了校验方法体中的每个字节码指令，`CodeIterator`则非常有用。想要获取这个对象的话，需要如下步骤:

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4|ClassFile cf = ... ;  <br>MethodInfo minfo = cf.getMethod("move");    // we assume move is not overloaded.  <br>CodeAttribute ca = minfo.getCodeAttribute();  <br>CodeIterator i = ca.iterator();|

`CodeIterator`对象允许你从前到后挨个访问字节码指令。如下的方法是`CodeIterator`中的一部分：

- `void begin()`  
    移到第一个指令处.
- `void move(int index)`  
    移到指定索引处
- `boolean hasNext()`  
    如果存在指令的话，返回true
- `int next()`  
    返回下一个指令的索引  
    _需要注意的是，此方法并不会返回下一个指令的操作码_
- `int byteAt(int index)`  
    返回指定索引处的无符号8bit位长值.
- `int u16bitAt(int index)`  
    返回指定索引处的无符号16bit位长值.
- `int write(byte[] code, int index)`  
    在指定索引处写入字节数组.
- `void insert(int index, byte[] code)`  
    在指定索引处写入字节数组，其他字节码的offset等将会自适应更改。

下面的代码段展示了方法体中的所有指令:

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6|CodeIterator ci = ... ;  <br>while (ci.hasNext()) {  <br>    int index = ci.next();  <br>    int op = ci.byteAt(index);  <br>    System.out.println(Mnemonic.OPCODE[op]);  <br>}|

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#5-4-%E5%AD%97%E8%8A%82%E7%A0%81%E5%BA%8F%E5%88%97%E7%9A%84%E7%94%9F%E6%88%90)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#5-4-%E5%AD%97%E8%8A%82%E7%A0%81%E5%BA%8F%E5%88%97%E7%9A%84%E7%94%9F%E6%88%90 "5.4 字节码序列的生成")5.4 字节码序列的生成

Bytecode对象代表了字节码序列，它是一组在持续不断进行增长的字节码的简称，来看看下面简单的代码片段：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5|ConstPool cp = ...;    // constant pool table  <br>Bytecode b = new Bytecode(cp, 1, 0);  <br>b.addIconst(3);  <br>b.addReturn(CtClass.intType);  <br>CodeAttribute ca = b.toCodeAttribute();|

代码将会产生如下的序列：

|   |   |
|---|---|
|1  <br>2|iconst_3  <br>ireturn|

你也可以利用`Bytecode`中的`get`方法来获取一个字节码数组序列，之后可以将此数组插入到另一个代码段中。

虽然`Bytecode`提供了一系列的方法添加特殊的指令到序列中，它同时也提供了`addOpcode`方法来添加8bit操作码，提供了`addIndex`方法来添加索引。8bit操作码的值是在`Opcode`接口中被定义的。

`addOpcode`方法和其他添加特殊指令的方法可以自动的维持堆栈的深度，除非操作流程出现了分歧，在这里，我们可以使用`Bytecode`的`getMaxStack`方法来获取堆栈最大深度。同时，堆栈深度和`Bytecode`对象内创建的`CodeAtrribute`对象也有关系，为了重新计算方法体中的最大堆栈深度，可以使用`CodeAttribute`中的`computeMaxStack`来进行。

`Bytecode`可以用来构建一个方法，示例如下：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10|ClassFile cf = ...  <br>Bytecode code = new Bytecode(cf.getConstPool());  <br>code.addAload(0);  <br>code.addInvokespecial("java/lang/Object", MethodInfo.nameInit, "()V");  <br>code.addReturn(null);  <br>code.setMaxLocals(1);  <br>  <br>MethodInfo minfo = new MethodInfo(cf.getConstPool(), MethodInfo.nameInit, "()V");  <br>minfo.setCodeAttribute(code.toCodeAttribute());  <br>cf.addMethod(minfo);|

上面的代码流程是创建了默认的构造函数后，然后将其添加到cf指向的类中。具体说来就是，Bytecode对象首先被转换成了CodeAttribute对象，接着被添加到minfo所指向的方法中。此方法最终被添加到cf类文件中。

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#5-5-%E6%B3%A8%E8%A7%A3-Meta-tags)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#5-5-%E6%B3%A8%E8%A7%A3-Meta-tags "5.5 注解 (Meta tags)")5.5 注解 (Meta tags)

注解在运行时态，作为一个可见或者不可见的属性被保存在类文件中。它们可以从`ClassFile`，`MethodInfo`或者`FieldInfo`对象中通过`getAttribute(AnnotationsAttribute.invisibleTag)`方法来获取。更多的谢洁，可以看看javadoc中关于`javassist.bytecode.AnnotationsAttribute`类和`javassist.bytecode.annotation`包的描述。

Javassist也能够让你利用一些应用层的API来访问注解。只需要利用`CtClass`或者`CtBehavior`中的的`getAnnotations方法接口。`

# [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E5%85%AD-%E6%B3%9B%E5%9E%8B)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E5%85%AD-%E6%B3%9B%E5%9E%8B "六 泛型")六 泛型

Javassist底层的API可以完全支持Java5中的泛型。另一方面，其更高级别的API，诸如`CtClass`是无法直接支持泛型的。对于字节码转换来说，这也不是什么大问题。

Java的泛型，采用的是擦除技术。当编译完毕后，所有的类型参数都将会被擦掉。比如，假设你的源码定义了一个参数类型`Vector<String>`:

|   |   |
|---|---|
|1  <br>2  <br>3|Vector<String> v = new Vector<String>();  <br>  :  <br>String s = v.get(0);|

编译后的字节码等价于如下代码：

|   |   |
|---|---|
|1  <br>2  <br>3|Vector v = new Vector();  <br>  :  <br>String s = (String)v.get(0);|

所以，当你写了一套字节码转换器后，你可以移除掉所有的类型参数。由于嵌入在Javassist的编译器不支持泛型，所以利用其编译的时候，你不得不在调用端做显式的类型转换。比如，`CtMethod.make`方法。但是如果源码是利用常规的Java编译器，比如javac，来编译的话，是无需进行类型转换的。

如果你有一个类，示例如下：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4|public class Wrapper<T> {  <br>  T value;  <br>  public Wrapper(T t) { value = t; }  <br>}|

想添加`Getter<T>`接口到`Wrapper<T>`类中：

|   |   |
|---|---|
|1  <br>2  <br>3|public interface Getter<T> {  <br>  T get();  <br>}|

那么实际上，你需要添加的接口是`Getter`(类型参数`<T>`已经被抹除)，需要添加到`Wrapper`中的方法如下：

|   |   |
|---|---|
|1|public Object get() { return value; }|

需要注意的是，非类型参数是必须的。由于`get`方法返回了`Object`类型，那么调用端如果用Javassist编译的话，就需要进行显式类型转换。比如，如下例子，类型参数`T`是`String`类型，那么(`String`)就必须被按照如下方式插入：

|   |   |
|---|---|
|1  <br>2|Wrapper w = ...  <br>String s = (String)w.get();|

当使用常规的Java编译器编译的时候，类型转换是不需要的，因为编译器会自动进行类型转换。

如果你想在运行时态，通过反射来访问类型参数，那么你不得不在类文件中添加泛型符号。更多详细信息，请参阅API文档`CtClass`中的`setGenericSignature`方法。

# [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E4%B8%83-%E5%8F%AF%E5%8F%98%E5%8F%82%E6%95%B0)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E4%B8%83-%E5%8F%AF%E5%8F%98%E5%8F%82%E6%95%B0 "七 可变参数")七 可变参数

目前，Javassist无法直接支持可变参数。为了让方法可以支持它，你需要显式设置方法修改器，其实很简单，假设你想生成如下的方法：

|   |   |
|---|---|
|1|public int length(int... args) { return args.length; }|

下面的Javassist代码将会生成如上的方法：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4|CtClass cc = /* target class */;  <br>CtMethod m = CtMethod.make("public int length(int[] args) { return args.length; }", cc);  <br>m.setModifiers(m.getModifiers() \| Modifier.VARARGS);  <br>cc.addMethod(m);|

参数类型`int...`变成了`int[]`数组，`Modifier.VARARGS`被添加到了方法修改器中。

为了能够在Javassist编译器中调用此方法，你需要这样来：

|   |   |
|---|---|
|1|length(new int[] { 1, 2, 3 });|

而不是这样来：

|   |   |
|---|---|
|1|length(1, 2, 3);|

# [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E5%85%AB-J2ME)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E5%85%AB-J2ME "八  J2ME")八 J2ME

如果你想在J2ME执行环境中修改类文件，你需要进行预校验操作，此操作会产生栈Map对象，此对象和JDK1.6中的J2SE栈map表有些相似。当且仅当`javassist.bytecode.MethodInfo.doPreverify`为`true`的时候，Javassist会维护J2ME中的栈map。

你也可以为修改的方法手动生成一个栈map，比如，一个给定的`CtMethod`对象中的m，你可以调用如下方法来生成一个栈map：

|   |   |
|---|---|
|1|m.getMethodInfo().rebuildStackMapForME(cpool);|

这里，`cpool`是`ClassPool`对象，此对象可以利用`CtClass`对象中的`getClassPool`来获取，它负责利用给定的类路径来找寻类文件。为了获取所有的`CtMethods`对象，可以通过调用`CtClass`对象的`getDeclaredMethods`来进行。

# [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E4%B9%9D-%E8%A3%85%E7%AE%B1-%E6%8B%86%E7%AE%B1)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E4%B9%9D-%E8%A3%85%E7%AE%B1-%E6%8B%86%E7%AE%B1 "九 装箱/拆箱")九 装箱/拆箱

在Java中，装箱和拆箱操作是语法糖。对于字节码说来，是不存在装箱和拆箱的。所以Javassist的编译器不支持装箱拆箱操作。比如，如下的描述，在java中是可行的：

|   |   |
|---|---|
|1|Integer i = 3;|

可以看出，此装箱操作是隐式的。但是在Javassist中，你必须显式的将值类型从int转为Integer:

|   |   |
|---|---|
|1|Integer i = new Integer(3);|

# [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E5%8D%81-%E8%B0%83%E8%AF%95)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E5%8D%81-%E8%B0%83%E8%AF%95 "十 调试")十 调试

将`CtClass.debugDump`设置为目录名称之后，所有被Javassist生成或修改的类文件将会被保存到此目录中。如果不想这么做，可以将`CtClass.debugDump`设置为null，需要注意的是，它的默认值就是null。

示例代码：

|   |   |
|---|---|
|1|CtClass.debugDump = "./dump";|

此时，所有的被修改的类文件将会被保存到`./dump`目录中。

# [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E5%8D%81%E4%B8%80-javassist%E4%BD%BF%E7%94%A8%E7%A4%BA%E4%BE%8B%E4%BB%A3%E7%A0%81)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E5%8D%81%E4%B8%80-javassist%E4%BD%BF%E7%94%A8%E7%A4%BA%E4%BE%8B%E4%BB%A3%E7%A0%81 "十一 javassist使用示例代码")十一 javassist使用示例代码

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#11-1-%E7%94%9F%E6%88%90%E5%AD%97%E6%AE%B5%E5%92%8C%E6%96%B9%E6%B3%95)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#11-1-%E7%94%9F%E6%88%90%E5%AD%97%E6%AE%B5%E5%92%8C%E6%96%B9%E6%B3%95 "11.1 生成字段和方法")11.1 生成字段和方法

原始代码如下

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6|package com.ssdmbbl.javassist;  <br>  <br>public class Hello {  <br>    public Hello() {  <br>    }  <br>}|

使用以下代码

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17  <br>18  <br>19  <br>20  <br>21  <br>22  <br>23  <br>24  <br>25  <br>26  <br>27  <br>28  <br>29  <br>30  <br>31  <br>32  <br>33  <br>34  <br>35  <br>36  <br>37  <br>38  <br>39  <br>40  <br>41  <br>42  <br>43  <br>44  <br>45  <br>46  <br>47  <br>48  <br>49  <br>50  <br>51  <br>52  <br>53  <br>54  <br>55  <br>56  <br>57  <br>58|package com.ssdmbbl.javassist;  <br>  <br>import javassist.*;  <br>  <br>  <br>public class JavassistTest2 {  <br>  <br>  <br>    public static void main(String[] args) throws Exception {  <br>        final ClassPool pool = ClassPool.getDefault();  <br>        //2.新建一个空类，叫Hello类  <br>        final CtClass makeClass = pool.makeClass("com.ssdmbbl.javassist.Hello");  <br>        // 3.新增一个字段 private String name；  <br>        // 字段名为name  <br>        final CtField nameField = new CtField(pool.get("java.lang.String"), "name", makeClass);  <br>        // 设置字段的访问类型为private  <br>        nameField.setModifiers(Modifier.PRIVATE);  <br>  <br>        // 新增age字段，也可以使用make方法快速创建  <br>        final CtField ageField = CtField.make("private int age;", makeClass);  <br>  <br>        // 给字段进行默认初始化，并添加到Hello类中  <br>        makeClass.addField(nameField, CtField.Initializer.constant("小明"));  <br>        makeClass.addField(ageField, CtField.Initializer.constant(20));  <br>  <br>        // 3.生成getter、setter方法  <br>        makeClass.addMethod(CtNewMethod.setter("setName", nameField));  <br>        makeClass.addMethod(CtNewMethod.getter("getName", nameField));  <br>        makeClass.addMethod(CtNewMethod.setter("setAge", ageField));  <br>        makeClass.addMethod(CtNewMethod.getter("getAge", ageField));  <br>  <br>        // 4.添加无参数的构造方法  <br>        final CtConstructor constructor = new CtConstructor(new CtClass[]{}, makeClass);  <br>        // 设置构造方法的方法体  <br>        constructor.setBody("{name=\"老王\";age=30;}");  <br>        makeClass.addConstructor(constructor);  <br>        // 5.添加有参的构造函数  <br>        final CtConstructor constructor1 = new CtConstructor(new CtClass[]{pool.get("java.lang.String"), CtClass.intType}, makeClass);  <br>        // $0=this, $1,$2,$3...代表第几个参数  <br>        constructor1.setBody("{$0.name=$1;$0.age=$2;}");  <br>        // 添加到person类中  <br>        makeClass.addConstructor(constructor1);  <br>          <br>  <br>        // 6.创建一个名为printName的方法，无参数，无返回值，输出name值  <br>        final CtMethod printName = new CtMethod(CtClass.voidType, "printName", new CtClass[]{}, makeClass);  <br>        // 设置方法访问类型  <br>        printName.setModifiers(Modifier.PUBLIC);  <br>        printName.setBody("{System.out.println(name);}");  <br>        // 上面的方式可以换成这种快速创建  <br>        final CtMethod printAge = CtMethod.make("public void printAge(){System.out.println(age);}", makeClass);  <br>  <br>        // 添加到Hello类中  <br>        makeClass.addMethod(printName);  <br>        makeClass.addMethod(printAge);  <br>        makeClass.writeFile("./aa");  <br>    }  <br>}|

VM参数

|   |   |
|---|---|
|1|--add-opens=java.base/java.lang=ALL-UNNAMED|

生成构造方法时可以用以下代码:

|   |   |
|---|---|
|1  <br>2  <br>3|// 创建构造方法  <br>       CtConstructor constructor = CtNewConstructor  <br>               .make("public User(String name, String age) { this.name = name;this.age = age;}", ctClass);|

生成普通方法可以使用以下代码

|   |   |
|---|---|
|1|CtMethod ctMethod = CtMethod.make("public int calcute(int a,int b){ return a + b ;}", ctClass);|

运行后，会在`aa`目录下生成`Hello.class`文件，该文件反编译后的内容为

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17  <br>18  <br>19  <br>20  <br>21  <br>22  <br>23  <br>24  <br>25  <br>26  <br>27  <br>28  <br>29  <br>30  <br>31  <br>32  <br>33  <br>34  <br>35  <br>36  <br>37  <br>38  <br>39  <br>40  <br>41  <br>42  <br>43  <br>44  <br>45|//  <br>// Source code recreated from a .class file by IntelliJ IDEA  <br>// (powered by FernFlower decompiler)  <br>//  <br>  <br>package com.ssdmbbl.javassist;  <br>  <br>public class Hello {  <br>    private String name = "小明";  <br>    private int age = 20;  <br>  <br>    public void setName(String var1) {  <br>        this.name = var1;  <br>    }  <br>  <br>    public String getName() {  <br>        return this.name;  <br>    }  <br>  <br>    public void setAge(int var1) {  <br>        this.age = var1;  <br>    }  <br>  <br>    public int getAge() {  <br>        return this.age;  <br>    }  <br>  <br>    public Hello() {  <br>        this.name = "老王";  <br>        this.age = 30;  <br>    }  <br>  <br>    public Hello(String var1, int var2) {  <br>        this.name = var1;  <br>        this.age = var2;  <br>    }  <br>  <br>    public void printName() {  <br>        System.out.println(this.name);  <br>    }  <br>  <br>    public void printAge() {  <br>        System.out.println(this.age);  <br>    }  <br>}|

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#11-2-%E9%80%9A%E8%BF%87%E5%8F%8D%E5%B0%84%E8%B0%83%E7%94%A8)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#11-2-%E9%80%9A%E8%BF%87%E5%8F%8D%E5%B0%84%E8%B0%83%E7%94%A8 "11.2 通过反射调用")11.2 通过反射调用

通过CtClass的toClass方法可以转化成Class对象，然后就可以通过反射的操作来操作目标类的成员了

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17  <br>18  <br>19|public class ClassUse {  <br>    public static void main(String[] args) throws Exception {  <br>        // 1.创建classPool  <br>        final ClassPool pool = ClassPool.getDefault();  <br>        // 2.添加目标类的搜索路径  <br>        pool.insertClassPath("./aa");  <br>        // 3.获取Hello.class的CtClass对象  <br>        final CtClass ctClass = pool.get("com.ssdmbbl.javassist.Hello");  <br>        // 4.创建Hello对象  <br>        // 先通过CtClass的toClass让类加载器加载该CtClass，然后使用反射创建对象  <br>        Object personObj = ctClass.toClass().newInstance();  <br>        // 5.反射调用setter方法  <br>        Method setName = personObj.getClass().getMethod("setName", String.class);  <br>        setName.invoke(personObj, "老王");  <br>        // 6.反射执行printName方法  <br>        Method printName = personObj.getClass().getMethod("printName");  <br>        printName.invoke(personObj);  <br>    }  <br>}|

VM参数

|   |   |
|---|---|
|1|--add-opens=java.base/java.lang=ALL-UNNAMED|

运行代码，得到的结果为

|   |   |
|---|---|
|1|老王|

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#11-3-%E9%80%9A%E8%BF%87%E6%8E%A5%E5%8F%A3%E8%B0%83%E7%94%A8)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#11-3-%E9%80%9A%E8%BF%87%E6%8E%A5%E5%8F%A3%E8%B0%83%E7%94%A8 "11.3 通过接口调用")11.3 通过接口调用

以上面生成的class为例

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17  <br>18  <br>19  <br>20  <br>21  <br>22  <br>23  <br>24  <br>25  <br>26  <br>27  <br>28  <br>29  <br>30  <br>31  <br>32  <br>33  <br>34  <br>35  <br>36  <br>37  <br>38  <br>39  <br>40  <br>41  <br>42  <br>43  <br>44  <br>45|//  <br>// Source code recreated from a .class file by IntelliJ IDEA  <br>// (powered by FernFlower decompiler)  <br>//  <br>  <br>package com.ssdmbbl.javassist;  <br>  <br>public class Hello {  <br>    private String name = "小明";  <br>    private int age = 20;  <br>  <br>    public void setName(String var1) {  <br>        this.name = var1;  <br>    }  <br>  <br>    public String getName() {  <br>        return this.name;  <br>    }  <br>  <br>    public void setAge(int var1) {  <br>        this.age = var1;  <br>    }  <br>  <br>    public int getAge() {  <br>        return this.age;  <br>    }  <br>  <br>    public Hello() {  <br>        this.name = "老王";  <br>        this.age = 30;  <br>    }  <br>  <br>    public Hello(String var1, int var2) {  <br>        this.name = var1;  <br>        this.age = var2;  <br>    }  <br>  <br>    public void printName() {  <br>        System.out.println(this.name);  <br>    }  <br>  <br>    public void printAge() {  <br>        System.out.println(this.age);  <br>    }  <br>}|

接着新建一个IPerson接口类：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10|package com.demo;  <br>  <br>  <br>public interface IPerson {  <br>    void setName(String name);  <br>  <br>    String getName();  <br>  <br>    void printName();  <br>}|

针对以下代码

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17  <br>18  <br>19  <br>20  <br>21  <br>22  <br>23  <br>24|package com;  <br>  <br>import com.demo.IPerson;  <br>import javassist.ClassPool;  <br>import javassist.CtClass;  <br>  <br>public class JavassistTest2 {  <br>  <br>  <br>    public static void main(String[] args) throws Exception {  <br>        final ClassPool pool = ClassPool.getDefault();  <br>        // 获取接口  <br>        CtClass codeClassI = pool.get("com.demo.IPerson");  <br>        // 获取上面生成的类  <br>        CtClass ctClass = pool.get("com.ssdmbbl.Hello");  <br>        // 使代码生成的类，实现 PersonI 接口  <br>        ctClass.setInterfaces(new CtClass[]{codeClassI});  <br>  <br>        // 以下通过接口直接调用 强转  <br>        IPerson person = (IPerson) ctClass.toClass().newInstance();  <br>        System.out.println(person.getName());  <br>  <br>    }  <br>}|

VM参数

|   |   |
|---|---|
|1|--add-opens=java.base/java.lang=ALL-UNNAMED|

运行结果为

|   |   |
|---|---|
|1|老王|

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#11-4-%E4%BF%AE%E6%94%B9%E7%8E%B0%E6%9C%89%E7%9A%84%E7%B1%BB%E5%AF%B9%E8%B1%A1)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#11-4-%E4%BF%AE%E6%94%B9%E7%8E%B0%E6%9C%89%E7%9A%84%E7%B1%BB%E5%AF%B9%E8%B1%A1 "11.4 修改现有的类对象")11.4 修改现有的类对象

有如下类对象

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8|package com.demo;  <br>  <br>public class PersonService {  <br>  <br>    public void fly() {  <br>        System.out.println("我飞起来了");  <br>    }  <br>}|

针对以下代码

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17  <br>18  <br>19  <br>20  <br>21  <br>22  <br>23  <br>24  <br>25  <br>26  <br>27  <br>28  <br>29  <br>30  <br>31  <br>32  <br>33  <br>34  <br>35  <br>36  <br>37  <br>38  <br>39  <br>40  <br>41  <br>42  <br>43  <br>44  <br>45  <br>46  <br>47  <br>48  <br>49  <br>50  <br>51  <br>52  <br>53  <br>54  <br>55  <br>56|package com.ssdmbbl.javassist;  <br>  <br>import javassist.*;  <br>  <br>public class JavassistTest2 {  <br>  <br>  <br>    public static void main(String[] args) throws Exception {  <br>        final ClassPool pool = ClassPool.getDefault();  <br>        //2.新建一个空类，叫Hello类  <br>        final CtClass makeClass = pool.makeClass("com.ssdmbbl.javassist.Hello");  <br>        // 3.新增一个字段 private String name；  <br>        // 字段名为name  <br>        final CtField nameField = new CtField(pool.get("java.lang.String"), "name", makeClass);  <br>        // 设置字段的访问类型为private  <br>        nameField.setModifiers(Modifier.PRIVATE);  <br>  <br>        // 新增age字段，也可以使用make方法快速创建  <br>        final CtField ageField = CtField.make("private int age;", makeClass);  <br>  <br>        // 给字段进行默认初始化，并添加到Hello类中  <br>        makeClass.addField(nameField, CtField.Initializer.constant("小明"));  <br>        makeClass.addField(ageField, CtField.Initializer.constant(20));  <br>  <br>        // 3.生成getter、setter方法  <br>        makeClass.addMethod(CtNewMethod.setter("setName", nameField));  <br>        makeClass.addMethod(CtNewMethod.getter("getName", nameField));  <br>        makeClass.addMethod(CtNewMethod.setter("setAge", ageField));  <br>        makeClass.addMethod(CtNewMethod.getter("getAge", ageField));  <br>  <br>        // 4.添加无参数的构造方法  <br>        final CtConstructor constructor = new CtConstructor(new CtClass[]{}, makeClass);  <br>        // 设置构造方法的方法体  <br>        constructor.setBody("{name=\"老王\";age=30;}");  <br>        makeClass.addConstructor(constructor);  <br>        // 5.添加有参的构造函数  <br>        final CtConstructor constructor1 = new CtConstructor(new CtClass[]{pool.get("java.lang.String"), CtClass.intType}, makeClass);  <br>        // $0=this, $1,$2,$3...代表第几个参数  <br>        constructor1.setBody("{$0.name=$1;$0.age=$2;}");  <br>        // 添加到person类中  <br>        makeClass.addConstructor(constructor1);  <br>  <br>        // 6.创建一个名为printName的方法，无参数，无返回值，输出name值  <br>        final CtMethod printName = new CtMethod(CtClass.voidType, "printName", new CtClass[]{}, makeClass);  <br>        // 设置方法访问类型  <br>        printName.setModifiers(Modifier.PUBLIC);  <br>        printName.setBody("{System.out.println(name);}");  <br>        // 上面的方式可以换成这种快速创建  <br>        final CtMethod printAge = CtMethod.make("public void printAge(){System.out.println(age);}", makeClass);  <br>  <br>        // 添加到Hello类中  <br>        makeClass.addMethod(printName);  <br>        makeClass.addMethod(printAge);  <br>        makeClass.writeFile("./aa");  <br>    }  <br>}|

VM参数

|   |   |
|---|---|
|1|--add-opens=java.base/java.lang=ALL-UNNAMED|

运行结果为

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4|起飞前准备降落伞  <br>我飞起来了  <br>成功落地  <br>加个好友吧|

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#11-5-%E5%AE%9E%E7%8E%B0%E5%8A%A8%E6%80%81%E4%BB%A3%E7%90%86)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#11-5-%E5%AE%9E%E7%8E%B0%E5%8A%A8%E6%80%81%E4%BB%A3%E7%90%86 "11.5 实现动态代理")11.5 实现动态代理

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17  <br>18  <br>19  <br>20  <br>21  <br>22  <br>23  <br>24  <br>25  <br>26  <br>27  <br>28  <br>29  <br>30  <br>31  <br>32  <br>33  <br>34  <br>35  <br>36  <br>37  <br>38  <br>39  <br>40  <br>41  <br>42  <br>43  <br>44|package com.ssdmbbl.javassist;  <br>  <br>import com.demo.PersonService;  <br>import javassist.ClassPool;  <br>import javassist.CtClass;  <br>import javassist.util.proxy.ProxyFactory;  <br>import javassist.util.proxy.ProxyObject;  <br>  <br>/**  <br> * @author yishui  <br> * @version 1.0.0  <br> * @since 1.0.0  <br> */  <br>public class ClassUse {  <br>    public static void main(String[] args) throws Exception {  <br>        // 1.创建classPool  <br>        final ClassPool pool = ClassPool.getDefault();  <br>        // 2.获取要修改的class  <br>        final CtClass ctClass = pool.get("com.demo.PersonService");  <br>        // // 实例化代理类工厂  <br>        ProxyFactory factory = new ProxyFactory();  <br>        // 设置代理类的父类，ProxyFactory将会动态生成一个类，继承该父类  <br>        factory.setSuperclass(ctClass.toClass());  <br>        // 设置过滤器，判断哪些方法调用需要被拦截  <br>        factory.setFilter(m -> m.getName() == "fly");  <br>        // 创建代理类型  <br>        final Class<?> aClass = factory.createClass();  <br>        // 创建代理实例,强转成父类  <br>        final PersonService personService = (PersonService) aClass.newInstance();  <br>        ((ProxyObject) personService).setHandler((self, thisMethod, proceed, args1) -> {  <br>            //thisMethod为被代理方法 proceed为代理方法 self为代理实例 args为方法参数  <br>            System.out.println((thisMethod.getName() + "被调用前输出"));  <br>            try {  <br>                Object ret = proceed.invoke(self, args1);  <br>                System.out.println(thisMethod.getName() + "正在调用，返回值: " + ret);  <br>                return ret;  <br>            } finally {  <br>                System.out.println(thisMethod.getName() + "被调用后输出");  <br>            }  <br>        });  <br>        // 调用代理类的fly方法  <br>        personService.fly();  <br>    }  <br>}|

VM参数

|   |   |
|---|---|
|1|--add-opens=java.base/java.lang=ALL-UNNAMED|

运行结果为

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4|fly被调用前输出  <br>我飞起来了  <br>fly正在调用，返回值: null  <br>fly被调用后输出|

# [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E5%8D%81%E4%BA%8C-%E9%87%8D%E6%96%B0%E7%94%9F%E6%88%90%E7%B1%BB%E7%9A%84%E5%AD%97%E8%8A%82%E7%A0%81%E6%96%87%E4%BB%B6)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E5%8D%81%E4%BA%8C-%E9%87%8D%E6%96%B0%E7%94%9F%E6%88%90%E7%B1%BB%E7%9A%84%E5%AD%97%E8%8A%82%E7%A0%81%E6%96%87%E4%BB%B6 "十二 重新生成类的字节码文件")十二 重新生成类的字节码文件

原始类

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11|package com.demo;  <br>  <br>public class Person {  <br>    public int hello(String s) {  <br>        return s.length();  <br>    }  <br>  <br>    public String hello2(String s) {  <br>        return s;  <br>    }  <br>}|

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#12-1-%E7%BB%99%E7%B1%BB%E6%B7%BB%E5%8A%A0%E6%96%B9%E6%B3%95)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#12-1-%E7%BB%99%E7%B1%BB%E6%B7%BB%E5%8A%A0%E6%96%B9%E6%B3%95 "12.1 给类添加方法")12.1 给类添加方法

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17  <br>18  <br>19  <br>20  <br>21  <br>22  <br>23  <br>24  <br>25  <br>26  <br>27  <br>28  <br>29  <br>30  <br>31  <br>32  <br>33|package com.ssdmbbl.javassist;  <br>  <br>import javassist.*;  <br>  <br>/**  <br> * @author yishui  <br> * @version 1.0.0  <br> * @since 1.0.0  <br> */  <br>public class ClassUse {  <br>    public static void main(String[] args) throws Exception {  <br>        ClassPool pool = ClassPool.getDefault();  <br>        CtClass cc = pool.get("com.demo.Person");  <br>  <br>        //方式一  <br>        //第一种方式，完整的方法以字符串形式传递过去  <br>        CtMethod cm1 = CtMethod.make("public int add1(int a, String b){return a+b.length();}", cc);  <br>        cc.addMethod(cm1);  <br>        //cc.removeMethod(cm3) 删除一个方法  <br>  <br>        //方式二  <br>        CtClass[] parameters = new CtClass[]{CtClass.intType, pool.get("java.lang.String")};  <br>        //第二种方式，返回值类型，方法名，参数，对象  <br>        CtMethod cm2 = new CtMethod(CtClass.intType, "add2", parameters, cc);  <br>        //访问范围  <br>        cm2.setModifiers(Modifier.PUBLIC);  <br>        //方法体  <br>        cm2.setBody("{return $1+$2.length();}");  <br>        cc.addMethod(cm2);  <br>        //保存到指定位置  <br>        cc.writeFile("./demo");  <br>    }  <br>}|

输出结果反编译为

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17  <br>18  <br>19  <br>20  <br>21  <br>22  <br>23  <br>24  <br>25  <br>26  <br>27|//  <br>// Source code recreated from a .class file by IntelliJ IDEA  <br>// (powered by FernFlower decompiler)  <br>//  <br>  <br>package com.demo;  <br>  <br>public class Person {  <br>    public Person() {  <br>    }  <br>  <br>    public int hello(String s) {  <br>        return s.length();  <br>    }  <br>  <br>    public String hello2(String s) {  <br>        return s;  <br>    }  <br>  <br>    public int add1(int var1, String var2) {  <br>        return var1 + var2.length();  <br>    }  <br>  <br>    public int add2(int var1, String var2) {  <br>        return var1 + var2.length();  <br>    }  <br>}|

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#12-2-%E7%BB%99%E7%B1%BB%E6%B7%BB%E5%8A%A0%E5%B1%9E%E6%80%A7)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#12-2-%E7%BB%99%E7%B1%BB%E6%B7%BB%E5%8A%A0%E5%B1%9E%E6%80%A7 "12.2 给类添加属性")12.2 给类添加属性

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17  <br>18  <br>19  <br>20  <br>21  <br>22  <br>23  <br>24  <br>25  <br>26  <br>27  <br>28  <br>29  <br>30  <br>31  <br>32  <br>33|package com.ssdmbbl.javassist;  <br>  <br>import javassist.*;  <br>  <br>/**  <br> * @author yishui  <br> * @version 1.0.0  <br> * @since 1.0.0  <br> */  <br>public class ClassUse {  <br>    public static void main(String[] args) throws Exception {  <br>        ClassPool pool = ClassPool.getDefault();  <br>        CtClass cc = pool.get("com.demo.Person");  <br>  <br>  <br>//方式一  <br>        CtField cf = new CtField(CtClass.intType, "age", cc);  <br>        cf.setModifiers(Modifier.PRIVATE);  <br>        cc.addField(cf);  <br>        cc.addMethod(CtNewMethod.getter("getAge", cf));  <br>        cc.addMethod(CtNewMethod.setter("setAge", cf));  <br>  <br>//方式二  <br>        CtField cf2 = CtField.make("private String name;", cc);  <br>        cc.addField(cf2);  <br>        cc.addMethod(CtNewMethod.getter("getName", cf2)); //快捷的添加get/set方法  <br>        cc.addMethod(CtNewMethod.setter("setName", cf2));  <br>  <br>  <br>        //保存到指定位置  <br>        cc.writeFile("./demo");  <br>    }  <br>}|

输出结果反编译为

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17  <br>18  <br>19  <br>20  <br>21  <br>22  <br>23  <br>24  <br>25  <br>26  <br>27  <br>28  <br>29  <br>30  <br>31  <br>32  <br>33  <br>34  <br>35  <br>36  <br>37  <br>38|//  <br>// Source code recreated from a .class file by IntelliJ IDEA  <br>// (powered by FernFlower decompiler)  <br>//  <br>  <br>package com.demo;  <br>  <br>public class Person {  <br>    private int age;  <br>    private String name;  <br>  <br>    public Person() {  <br>    }  <br>  <br>    public int hello(String s) {  <br>        return s.length();  <br>    }  <br>  <br>    public String hello2(String s) {  <br>        return s;  <br>    }  <br>  <br>    public int getAge() {  <br>        return this.age;  <br>    }  <br>  <br>    public void setAge(int var1) {  <br>        this.age = var1;  <br>    }  <br>  <br>    public String getName() {  <br>        return this.name;  <br>    }  <br>  <br>    public void setName(String var1) {  <br>        this.name = var1;  <br>    }  <br>}|

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#12-3-%E4%BF%AE%E6%94%B9%E7%B1%BB%E7%9A%84%E6%96%B9%E6%B3%95)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#12-3-%E4%BF%AE%E6%94%B9%E7%B1%BB%E7%9A%84%E6%96%B9%E6%B3%95 "12.3 修改类的方法")12.3 修改类的方法

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17  <br>18  <br>19  <br>20  <br>21  <br>22  <br>23  <br>24  <br>25  <br>26  <br>27  <br>28  <br>29  <br>30  <br>31  <br>32  <br>33  <br>34  <br>35  <br>36|package com.ssdmbbl.javassist;  <br>  <br>import javassist.*;  <br>  <br>/**  <br> * @author yishui  <br> * @version 1.0.0  <br> * @since 1.0.0  <br> */  <br>public class ClassUse {  <br>    public static void main(String[] args) throws Exception {  <br>        ClassPool pool = ClassPool.getDefault();  <br>        CtClass cc = pool.get("com.demo.Person");  <br>  <br>//方式一  <br>        CtMethod cm = cc.getDeclaredMethod("hello", new CtClass[]{pool.get("java.lang.String")});  <br>        cm.insertBefore("System.out.println(\"调用前2\");");//调用前  <br>        cm.insertBefore("System.out.println(\"调用前1\");");  <br>        cm.insertAt(20094, "System.out.println(\"在指定行插入代码\");");//貌似行号胡乱写也可以  <br>        cm.insertAfter("System.out.println(\"调用后1\");");//调用后  <br>        cm.insertAfter("System.out.println(\"调用后2\");");//调用后  <br>  <br>//方式二  <br>        CtMethod cm2 = cc.getDeclaredMethod("hello2", new CtClass[]{pool.get("java.lang.String")});  <br>        cm2.setBody("{" + // 你只需要正常写代码逻辑就可以了，复制过来时，一些IDE，比如AS会自动帮你添加转义字符  <br>                "if ($1 == null) {\n" + //$0代表的是this，$1代表方法参数的第一个参数、$2代表方法参数的第二个参数  <br>                "\treturn \"\";\n" + //  <br>                "}\n" + //  <br>                "return  \"你好：\" + $1;" + //  <br>                "}");  <br>  <br>  <br>        //保存到指定位置  <br>        cc.writeFile("./demo");  <br>    }  <br>}|

输出结果反编译为

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17  <br>18  <br>19  <br>20  <br>21  <br>22  <br>23  <br>24  <br>25|//  <br>// Source code recreated from a .class file by IntelliJ IDEA  <br>// (powered by FernFlower decompiler)  <br>//  <br>  <br>package com.demo;  <br>  <br>public class Person {  <br>    public Person() {  <br>    }  <br>  <br>    public int hello(String s) {  <br>        System.out.println("调用前1");  <br>        System.out.println("调用前2");  <br>        System.out.println("在指定行插入代码");  <br>        int var3 = s.length();  <br>        System.out.println("调用后1");  <br>        System.out.println("调用后2");  <br>        return var3;  <br>    }  <br>  <br>    public String hello2(String s) {  <br>        return s == null ? "" : "你好：" + s;  <br>    }  <br>}|

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#12-4-%E4%BF%AE%E6%94%B9%E6%B3%A8%E8%A7%A3%E7%9A%84%E5%80%BC)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#12-4-%E4%BF%AE%E6%94%B9%E6%B3%A8%E8%A7%A3%E7%9A%84%E5%80%BC "12.4 修改注解的值")12.4 修改注解的值

原始类

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14|package com.demo;  <br>  <br>import javax.persistence.Column;  <br>  <br>/**  <br> * @author yishui  <br> * @version 1.0.0  <br> * @since 1.0.0  <br> */  <br>public class DemoPerson {  <br>  <br>    @Column(name = "AGE")  <br>    public int age = 28;  <br>}|

修改代码

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17  <br>18  <br>19  <br>20  <br>21  <br>22  <br>23  <br>24  <br>25  <br>26  <br>27  <br>28  <br>29  <br>30  <br>31  <br>32  <br>33  <br>34  <br>35  <br>36  <br>37  <br>38  <br>39  <br>40  <br>41  <br>42  <br>43  <br>44  <br>45|package com.ssdmbbl.javassist;  <br>  <br>import javassist.ClassPool;  <br>import javassist.CtClass;  <br>import javassist.CtField;  <br>import javassist.bytecode.AnnotationsAttribute;  <br>import javassist.bytecode.ConstPool;  <br>import javassist.bytecode.FieldInfo;  <br>import javassist.bytecode.annotation.Annotation;  <br>import javassist.bytecode.annotation.StringMemberValue;  <br>  <br>import javax.persistence.Column;  <br>  <br>/**  <br> * @author yishui  <br> * @version 1.0.0  <br> * @since 1.0.0  <br> */  <br>public class ClassUse {  <br>    public static void main(String[] args) throws Exception {  <br>        ClassPool pool = ClassPool.getDefault();  <br>        CtClass cc = pool.get("com.demo.DemoPerson");  <br>  <br>  <br>        CtField cf = cc.getField("age");  <br>        FieldInfo fInfo = cf.getFieldInfo();  <br>        ConstPool cp = cc.getClassFile().getConstPool();  <br>  <br>        //修改注解的值  <br>        //获取注解  <br>        Annotation annotation = new Annotation(Column.class.getName(), cp);  <br>        //设置注解指定字段的值  <br>        annotation.addMemberValue("name", new StringMemberValue("_AGE", cp));  <br>        //获取注解信息  <br>        AnnotationsAttribute annotationsAttribute = new AnnotationsAttribute(cp, AnnotationsAttribute.visibleTag);  <br>        //设置注解  <br>        annotationsAttribute.setAnnotation(annotation);  <br>        //添加(覆盖)注解信息  <br>        fInfo.addAttribute(annotationsAttribute);  <br>  <br>  <br>        //保存到指定位置  <br>        cc.writeFile("./demo");  <br>    }  <br>}|

输出结果反编译后为

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17  <br>18|//  <br>// Source code recreated from a .class file by IntelliJ IDEA  <br>// (powered by FernFlower decompiler)  <br>//  <br>  <br>package com.demo;  <br>  <br>import javax.persistence.Column;  <br>  <br>public class DemoPerson {  <br>    @Column(  <br>        name = "_AGE"  <br>    )  <br>    public int age = 28;  <br>  <br>    public DemoPerson() {  <br>    }  <br>}|

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#12-5-%E4%BF%AE%E6%94%B9%E5%B7%B2%E5%8A%A0%E8%BD%BD%E8%BF%87%E7%9A%84%E7%B1%BB)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#12-5-%E4%BF%AE%E6%94%B9%E5%B7%B2%E5%8A%A0%E8%BD%BD%E8%BF%87%E7%9A%84%E7%B1%BB "12.5 修改已加载过的类")12.5 修改已加载过的类

原始类

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7|package com.demo;  <br>  <br>public class Person {  <br>    public void hello(String s) {  <br>        System.out.println(s);  <br>    }  <br>}|

使用以下代码

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6|public class ClassUse {  <br>    public static void main(String[] args) throws Exception {  <br>        new Person().hello("包青天");  <br>        ClassPool.getDefault().get("com.demo.Person").toClass();  <br>    }  <br>}|

运行结果如下

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17  <br>18  <br>19  <br>20  <br>21|包青天  <br>Exception in thread "main" javassist.CannotCompileException: by java.lang.reflect.InvocationTargetException  <br>	at javassist.util.proxy.DefineClassHelper$JavaOther.defineClass(DefineClassHelper.java:220)  <br>	at javassist.util.proxy.DefineClassHelper$Java11.defineClass(DefineClassHelper.java:52)  <br>	at javassist.util.proxy.DefineClassHelper.toClass(DefineClassHelper.java:260)  <br>	at javassist.ClassPool.toClass(ClassPool.java:1232)  <br>	at javassist.ClassPool.toClass(ClassPool.java:1090)  <br>	at javassist.ClassPool.toClass(ClassPool.java:1048)  <br>	at javassist.CtClass.toClass(CtClass.java:1290)  <br>	at com.ssdmbbl.javassist.ClassUse.main(ClassUse.java:14)  <br>Caused by: java.lang.reflect.InvocationTargetException  <br>	at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)  <br>	at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:77)  <br>	at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)  <br>	at java.base/java.lang.reflect.Method.invoke(Method.java:568)  <br>	at javassist.util.proxy.DefineClassHelper$JavaOther.defineClass(DefineClassHelper.java:214)  <br>	... 7 more  <br>Caused by: java.lang.LinkageError: loader 'app' attempted duplicate class definition for com.demo.Person. (com.demo.Person is in unnamed module of loader 'app')  <br>	at java.base/java.lang.ClassLoader.defineClass1(Native Method)  <br>	at java.base/java.lang.ClassLoader.defineClass(ClassLoader.java:1012)  <br>	... 12 more|

解决方法：指定一个未加载的 ClassLoader,为了方便，Javassist 也提供一个 Classloader 供使用

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17  <br>18  <br>19  <br>20  <br>21  <br>22  <br>23  <br>24  <br>25  <br>26  <br>27  <br>28  <br>29  <br>30  <br>31  <br>32  <br>33  <br>34  <br>35  <br>36  <br>37  <br>38  <br>39  <br>40  <br>41  <br>42  <br>43  <br>44  <br>45  <br>46  <br>47  <br>48  <br>49  <br>50  <br>51|package com.ssdmbbl.javassist;  <br>  <br>import com.demo.Person;  <br>import javassist.*;  <br>  <br>/**  <br> * @author yishui  <br> * @version 1.0.0  <br> * @since 1.0.0  <br> */  <br>public class ClassUse {  <br>    public static void main(String[] args) throws Exception {  <br>        new Person().hello("包青天");  <br>        ClassPool pool = ClassPool.getDefault();  <br>        CtClass cc = pool.get("com.demo.Person");  <br>        CtMethod cm = cc.getDeclaredMethod("hello", new CtClass[]{pool.get("java.lang.String")});  <br>        cm.setBody("{" + "System.out.println(\"你好鸭：\" + $1);" + "}");  <br>        //保存到指定目录  <br>        cc.writeFile("./demo");  <br>  <br>        Translator translator = new Translator() {  <br>            @Override  <br>            public void start(ClassPool classPool) throws NotFoundException, CannotCompileException {  <br>                System.out.println("start");  <br>            }  <br>  <br>            @Override  <br>            public void onLoad(ClassPool classPool, String paramString) throws NotFoundException, CannotCompileException {  <br>                //com.demo.Person  <br>                System.out.println("onLoad：" + paramString);  <br>                //调用的是原始类的方法  <br>                new Person().hello("张三飞111");  <br>            }  <br>        };  <br>        //Javassist 提供的 Classloader  <br>        Loader classLoader = new Loader(pool);  <br>        //监听 ClassLoader 的生命周期  <br>        classLoader.addTranslator(pool, translator);  <br>  <br>        Class clazz = classLoader.loadClass("com.demo.Person");  <br>        //调用的是原始类的方法  <br>        new Person().hello("张思飞222");  <br>  <br>        //调用的是新类的方法  <br>        clazz.getDeclaredMethod("hello", String.class).invoke(clazz.newInstance(), "调用的是新类的方法");  <br>  <br>        Class clazz2 = Class.forName("com.demo.Person");  <br>        //调用原始类的方法  <br>        clazz2.getDeclaredMethod("hello", String.class).invoke(clazz2.newInstance(), "调用原始类的方法");  <br>    }  <br>}|

运行结果

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7|包青天  <br>start  <br>onLoad：com.demo.Person  <br>张三飞111  <br>张思飞222  <br>你好鸭：调用的是新类的方法  <br>调用原始类的方法|

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#12-6-%E4%BF%AE%E6%94%B9%E6%9C%AA%E5%8A%A0%E8%BD%BD%E8%BF%87%E7%9A%84%E7%B1%BB)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#12-6-%E4%BF%AE%E6%94%B9%E6%9C%AA%E5%8A%A0%E8%BD%BD%E8%BF%87%E7%9A%84%E7%B1%BB "12.6 修改未加载过的类")12.6 修改未加载过的类

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9|ClassPool pool = ClassPool.getDefault();  <br>CtClass cc = pool.get("com.demo.Person");  <br>CtMethod cm = cc.getDeclaredMethod("hello", new CtClass[] { pool.get("java.lang.String") });  <br>cm.setBody("{" + "System.out.println(\"你好：\" + $1);" + "}");  <br>//保存到指定目录  <br>cc.writeFile("./demo");  <br> //加载修改后的类，注意：必须保证调用前此类未加载  <br>cc.toClass();  <br>new Person().hello("包青天");|

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#12-7-%E8%8E%B7%E5%8F%96%E7%B1%BB%E5%9F%BA%E6%9C%AC%E4%BF%A1%E6%81%AF)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#12-7-%E8%8E%B7%E5%8F%96%E7%B1%BB%E5%9F%BA%E6%9C%AC%E4%BF%A1%E6%81%AF "12.7 获取类基本信息")12.7 获取类基本信息

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17|ClassPool pool = ClassPool.getDefault();  <br>CtClass cc = pool.get("com.demo.Person");  <br>  <br>byte[] bytes = cc.toBytecode();//得到字节码    <br>System.out.println(bytes.length);  <br>System.out.println(cc.getName());//获取类名    <br>System.out.println(cc.getSimpleName());//获取简要类名    <br>System.out.println(cc.getSuperclass().getName());//获取父类    <br>System.out.println(Arrays.toString(cc.getInterfaces()));//获取接口    <br>  <br>for (CtConstructor con : cc.getConstructors()) {//获取构造方法  <br>    System.out.println("构造方法 "+con.getLongName());  <br>}  <br>  <br>for (CtMethod method : cc.getMethods()) {//获取方法  <br>    System.out.println(method.getLongName());  <br>}|

打印内容：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17  <br>18  <br>19|562  <br>com.demo.Person  <br>Person  <br>java.lang.Object  <br>[]  <br>构造方法 com.demo.Person()  <br>java.lang.Object.equals(java.lang.Object)  <br>java.lang.Object.finalize()  <br>com.demo.Person.hello2(java.lang.String)  <br>java.lang.Object.toString()  <br>java.lang.Object.getClass()  <br>java.lang.Object.notifyAll()  <br>java.lang.Object.hashCode()  <br>java.lang.Object.wait()  <br>java.lang.Object.notify()  <br>com.demo.Person.hello(java.lang.String)  <br>java.lang.Object.wait(long)  <br>java.lang.Object.wait(long,int)  <br>java.lang.Object.clone()|

获取注解信息

|   |   |
|---|---|
|1  <br>2  <br>3|Object[] annotations = cf.getAnnotations(); //获取类、方法、字段等上面定义的注解信息  <br>SerializedName annotation = (SerializedName) annotations[0]; //遍历判断注解类型  <br>System.out.println(annotation.value()); //获取注解的值|

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#12-8-%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E6%96%B0%E7%B1%BB)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#12-8-%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E6%96%B0%E7%B1%BB "12.8 创建一个新类")12.8 创建一个新类

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17|ClassPool pool = ClassPool.getDefault();  <br>CtClass cc = pool.makeClass("com.demo.Person");  <br>  <br>//创建属性  <br>cc.addField(CtField.make("private int id;", cc));  <br>cc.addField(CtField.make("private String name;", cc));  <br>  <br>//创建方法  <br>cc.addMethod(CtMethod.make("public String getName(){return name;}", cc));  <br>cc.addMethod(CtMethod.make("public void setName(String name){this.name = name;}", cc));  <br>  <br>//添加构造器  <br>CtConstructor constructor = new CtConstructor(new CtClass[] { CtClass.intType, pool.get("java.lang.String") }, cc);  <br>constructor.setBody("{this.id=id;this.name=name;}");  <br>cc.addConstructor(constructor);  <br>  <br>cc.writeFile("./demo");|

输出结果反编译后的信息为

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17  <br>18  <br>19  <br>20  <br>21  <br>22  <br>23  <br>24|//  <br>// Source code recreated from a .class file by IntelliJ IDEA  <br>// (powered by FernFlower decompiler)  <br>//  <br>  <br>package com.demo;  <br>  <br>public class Person {  <br>    private int id;  <br>    private String name;  <br>  <br>    public String getName() {  <br>        return this.name;  <br>    }  <br>  <br>    public void setName(String var1) {  <br>        this.name = var1;  <br>    }  <br>  <br>    public Person(int var1, String var2) {  <br>        this.id = this.id;  <br>        this.name = this.name;  <br>    }  <br>}|

## [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#12-9-%E4%BD%BF%E7%94%A8-Javassist-%E8%A7%A3%E6%9E%90%E6%96%B9%E6%B3%95%E4%BF%A1%E6%81%AF)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#12-9-%E4%BD%BF%E7%94%A8-Javassist-%E8%A7%A3%E6%9E%90%E6%96%B9%E6%B3%95%E4%BF%A1%E6%81%AF "12.9 使用 Javassist 解析方法信息")12.9 使用 Javassist 解析方法信息

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17  <br>18  <br>19  <br>20  <br>21  <br>22  <br>23  <br>24  <br>25  <br>26|// 创建新的 ClassPool，避免内存溢出  <br>ClassPool classPool = new ClassPool(true);  <br>// 将当前类加载路径加入 ClassPool 的 ClassPath 中，避免找不到类  <br>classPool.insertClassPath(new ClassClassPath(this.getClass()));  <br>// 使用 ClassPool 加载类  <br>CtClass ctClass = classPool.get(classMetadata.getClassName());  <br>// 去除接口、注解、枚举、原生、数组等类型的类，以及代理类不解析  <br>if (ctClass.isInterface() \| ctClass.isAnnotation() \| ctClass.isEnum() \| ctClass.isPrimitive() \| ctClass.isArray() \| ctClass.getSimpleName().contains("$")) {  <br>    return;  <br>}  <br>// 获取所有声明的方法  <br>CtMethod[] methods = ctClass.getDeclaredMethods();  <br>for (CtMethod method : methods) {  <br>    // 代理方法不解析  <br>    if (method.getName().contains("$")) {  <br>        continue;  <br>    }  <br>    // 包名  <br>    String packageName = ctClass.getPackageName();  <br>    // 类名  <br>    String className = ctClass.getSimpleName();  <br>    // 方法名  <br>    String methodName = method.getName();  <br>    // 参数：method.getLongName() 返回格式：com.test.TestService.selectOrder(java.lang.String,java.util.List,com.test.Order)，所以截取括号中的即可  <br>    String methodSignature = StringUtils.defaultIfBlank(StringUtils.substringBetween(method.getLongName(), "(", ")"), null);  <br>}|

# [](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E5%8D%81%E4%B8%89-springboot%E6%95%B4%E5%90%88javassist)[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E5%8D%81%E4%B8%89-springboot%E6%95%B4%E5%90%88javassist "十三 springboot整合javassist")十三 springboot整合javassist

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7  <br>8  <br>9  <br>10  <br>11  <br>12  <br>13  <br>14  <br>15  <br>16  <br>17  <br>18  <br>19  <br>20  <br>21  <br>22  <br>23  <br>24  <br>25  <br>26  <br>27  <br>28  <br>29  <br>30  <br>31  <br>32  <br>33  <br>34  <br>35  <br>36  <br>37  <br>38  <br>39  <br>40  <br>41  <br>42  <br>43  <br>44  <br>45  <br>46  <br>47  <br>48  <br>49  <br>50  <br>51  <br>52  <br>53  <br>54  <br>55  <br>56  <br>57  <br>58  <br>59  <br>60  <br>61  <br>62  <br>63  <br>64  <br>65  <br>66  <br>67  <br>68  <br>69  <br>70  <br>71  <br>72  <br>73  <br>74  <br>75  <br>76  <br>77  <br>78  <br>79  <br>80  <br>81  <br>82  <br>83  <br>84  <br>85  <br>86  <br>87  <br>88  <br>89  <br>90  <br>91  <br>92  <br>93  <br>94  <br>95  <br>96  <br>97  <br>98  <br>99  <br>100  <br>101  <br>102  <br>103  <br>104  <br>105  <br>106|package com.yishuifengxiao.app.file_browser.support;  <br>  <br>import org.aspectj.lang.JoinPoint;  <br>import org.aspectj.lang.annotation.AfterReturning;  <br>import org.aspectj.lang.annotation.Aspect;  <br>import org.aspectj.lang.annotation.Before;  <br>import org.aspectj.lang.annotation.Pointcut;  <br>import org.slf4j.Logger;  <br>import org.slf4j.LoggerFactory;  <br>import org.springframework.stereotype.Component;  <br>  <br>import com.alibaba.fastjson.JSON;  <br>  <br>import javassist.ClassClassPath;  <br>import javassist.ClassPool;  <br>import javassist.CtClass;  <br>import javassist.CtMethod;  <br>import javassist.Modifier;  <br>import javassist.NotFoundException;  <br>import javassist.bytecode.CodeAttribute;  <br>import javassist.bytecode.LocalVariableAttribute;  <br>import javassist.bytecode.MethodInfo;  <br>  <br>@Aspect  <br>@Component  <br>public class MethodLogAop {  <br>  <br>  <br>    /**  <br>     * 切点  <br>     * 配置需要添加切面通知的包路径  <br>     */  <br>    @Pointcut("(execution(* com.yishuifengxiao.app.file_browser.service..*.*(..)))")  <br>//\|(execution(* com.wolfgy.demo.web..*.*(..)))  <br>    public void webLog() {  <br>    }  <br>  <br>    /**  <br>     * 前置通知  <br>     *  <br>     * @param joinPoint 切点  <br>     * @throws Throwable 异常  <br>     */  <br>    @Before("webLog()")  <br>    public void doBefore(JoinPoint joinPoint) throws Throwable {  <br>        String classType = joinPoint.getTarget().getClass().getName();  <br>        Class<?> clazz = Class.forName(classType);  <br>        String clazzName = clazz.getName();  <br>        System.out.println(" doBefore 类名：" + clazzName);  <br>        String methodName = joinPoint.getSignature().getName();  <br>        System.out.println(" doBefore 方法名：" + methodName);  <br>        String[] paramNames = getFieldsName(this.getClass(), clazzName, methodName);  <br>        Object[] args = joinPoint.getArgs();  <br>        for (int k = 0; k < args.length; k++) {  <br>            System.out.println(" doBefore 参数名：" + paramNames[k] + "，参数值：" + JSON.toJSONString(args[k]));  <br>        }  <br>    }  <br>  <br>  <br>    /**  <br>     * 得到方法参数的名称  <br>     *  <br>     * @param cls        类  <br>     * @param clazzName  类名  <br>     * @param methodName 方法名  <br>     * @return 参数名数组  <br>     * @throws NotFoundException 异常  <br>     */  <br>    private static String[] getFieldsName(Class<?> cls, String clazzName, String methodName) throws NotFoundException {  <br>        ClassPool pool = ClassPool.getDefault();  <br>        ClassClassPath classPath = new ClassClassPath(cls);  <br>        pool.insertClassPath(classPath);  <br>  <br>        CtClass cc = pool.get(clazzName);  <br>        CtMethod cm = cc.getDeclaredMethod(methodName);  <br>        MethodInfo methodInfo = cm.getMethodInfo();  <br>        CodeAttribute codeAttribute = methodInfo.getCodeAttribute();  <br>  <br>        LocalVariableAttribute attr = (LocalVariableAttribute) codeAttribute.getAttribute(LocalVariableAttribute.tag);  <br>  <br>        String[] paramNames = new String[cm.getParameterTypes().length];  <br>        int pos = Modifier.isStatic(cm.getModifiers()) ? 0 : 1;  <br>        for (int i = 0; i < paramNames.length; i++) {  <br>            paramNames[i] = attr.variableName(i + pos); //paramNames即参数名  <br>        }  <br>        return paramNames;  <br>    }  <br>  <br>    /**  <br>     * 后置通知  <br>     * 打印返回值日志  <br>     *  <br>     * @param ret 返回值  <br>     * @throws Throwable 异常  <br>     */  <br>    @AfterReturning(returning = "ret", pointcut = "webLog()")  <br>    public void doAfterReturning(JoinPoint joinPoint, Object ret) throws Throwable {  <br>        String classType = joinPoint.getTarget().getClass().getName();  <br>        Class<?> clazz = Class.forName(classType);  <br>        String clazzName = clazz.getName();  <br>        System.out.println("doAfterReturning 类名：" + clazzName);  <br>        String methodName = joinPoint.getSignature().getName();  <br>        System.out.println("doAfterReturning 方法名：" + methodName);  <br>        System.out.println("doAfterReturning 返回值 : " + JSON.toJSONString(ret));  <br>    }  <br>}|

运行结果为：

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7|doBefore 类名：com.yishuifengxiao.app.file_browser.service.impl.UserServiceImpl  <br> doBefore 方法名：findUserByUsername  <br> doBefore 参数名：username，参数值："admin"  <br>   <br>doAfterReturning 类名：com.yishuifengxiao.app.file_browser.service.impl.UserServiceImpl  <br>doAfterReturning 方法名：findUserByUsername  <br>doAfterReturning 返回值 : {"id":"1","name":"系统超级管理员","pwd":"473A1E15AEB92A70","role":"role","stat":1,"username":"admin"}|

**execution语法**

**语法表达式：**  
`execution(<修饰符> <返回类型> <类路径> <方法名>(<参数列表>) <异常模式> )`  
其中，修饰符和异常是可选的,如果不加类路径，则默认对所有的类生效。

**常用实例：**

1.通过方法签名、返回值定义切点：

- `execution(public * *Service(..))`：定位于所有类下返回值任意、方法入参类型、数量任意，public类型的方法
- `execution(public String *Service(..))`：定位于所有类下返回值为String、方法入参类型、数量任意，public类型的方法
    
    2.通过类包定义切点：
    
- `execution(* com.yc.controller.BaseController+.*(..))`:匹配任意返回类型，对应包下BaseController类及其子类等任意方法。
    
- `execution(* com.*.(..))`:匹配任意返回类型，com包下所有类的所有方法
- `execution(* com..*.(..))`:匹配任意返回类型，com包、子包下所有类的所有方法
    
    (注意:`.`表示该包下所有类，`..`则涵括其子包。)
    
    3.通过方法入参定义切点
    
    (这里`*`表示任意类型的一个参数，`..`表示任意类型任意数量的参数)
    
- `execution(* speak(Integer,*))`:匹配任意返回类型，所有类中只有两个入参，第一个入参为Integer，第二个入参任意的方法
    
- `execution(* speak(..,Integer,..))`:匹配任意返回类型，所有类中至少有一个Integer入参，但位置任意的方法。

---

- [← PREVIOUS POST](https://www.yishuifengxiao.com/2023/04/06/linux%E5%9F%BA%E6%9C%AC%E5%B8%B8%E7%94%A8%E5%8A%9F%E8%83%BD%E9%85%8D%E7%BD%AE/)
- [NEXT POST →](https://www.yishuifengxiao.com/2023/03/10/springboot-%E6%95%B4%E5%90%88-apache-camel/)

**Contents**

1. [1. 一 基本概念](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E4%B8%80-%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5)
    1. [1.1. 1.1 基础知识](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-1-%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86)
    2. [1.2. 1.2 ClassPool的相关方法](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-2-ClassPool%E7%9A%84%E7%9B%B8%E5%85%B3%E6%96%B9%E6%B3%95)
    3. [1.3. 1.3 CtClass的相关方法](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-3-CtClass%E7%9A%84%E7%9B%B8%E5%85%B3%E6%96%B9%E6%B3%95)
        1. [1.3.1. 1.3.1 获取CtClass](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-3-1-%E8%8E%B7%E5%8F%96CtClass)
        2. [1.3.2. 1.3.2 创建CtClass](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-3-2-%E5%88%9B%E5%BB%BACtClass)
        3. [1.3.3. 1.3.3 CtClass基础信息](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-3-3-CtClass%E5%9F%BA%E7%A1%80%E4%BF%A1%E6%81%AF)
        4. [1.3.4. 1.3.4 CtClass类操作](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-3-4-CtClass%E7%B1%BB%E6%93%8D%E4%BD%9C)
        5. [1.3.5. 1.3.5 CtClass类编译](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-3-5-CtClass%E7%B1%BB%E7%BC%96%E8%AF%91)
    4. [1.4. 1.4 CtMethod的相关方法](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-4-CtMethod%E7%9A%84%E7%9B%B8%E5%85%B3%E6%96%B9%E6%B3%95)
        1. [1.4.1. 1.4.1 获取CtMethod属性](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-4-1-%E8%8E%B7%E5%8F%96CtMethod%E5%B1%9E%E6%80%A7)
        2. [1.4.2. 1.4.2 CtMethod方法体修改](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-4-2-CtMethod%E6%96%B9%E6%B3%95%E4%BD%93%E4%BF%AE%E6%94%B9)
        3. [1.4.3. 1.4.3 异常块 addCatch()](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#1-4-3-%E5%BC%82%E5%B8%B8%E5%9D%97-addCatch)
2. [2. 二 类搜索路径](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E4%BA%8C-%E7%B1%BB%E6%90%9C%E7%B4%A2%E8%B7%AF%E5%BE%84)
    1. [2.1. 2.1 通过ClassClassPath添加搜索路径](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#2-1-%E9%80%9A%E8%BF%87ClassClassPath%E6%B7%BB%E5%8A%A0%E6%90%9C%E7%B4%A2%E8%B7%AF%E5%BE%84)
    2. [2.2. 2.2 通过指定目录来添加搜索路径](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#2-2-%E9%80%9A%E8%BF%87%E6%8C%87%E5%AE%9A%E7%9B%AE%E5%BD%95%E6%9D%A5%E6%B7%BB%E5%8A%A0%E6%90%9C%E7%B4%A2%E8%B7%AF%E5%BE%84)
    3. [2.3. 2.3 通过URL指定搜索路径](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#2-3-%E9%80%9A%E8%BF%87URL%E6%8C%87%E5%AE%9A%E6%90%9C%E7%B4%A2%E8%B7%AF%E5%BE%84)
    4. [2.4. 2.4 通过ByteArrayPath添加搜索路径](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#2-4-%E9%80%9A%E8%BF%87ByteArrayPath%E6%B7%BB%E5%8A%A0%E6%90%9C%E7%B4%A2%E8%B7%AF%E5%BE%84)
    5. [2.5. 2.5 通过输入流加载class](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#2-5-%E9%80%9A%E8%BF%87%E8%BE%93%E5%85%A5%E6%B5%81%E5%8A%A0%E8%BD%BDclass)
3. [3. 三 读写字节码](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E4%B8%89-%E8%AF%BB%E5%86%99%E5%AD%97%E8%8A%82%E7%A0%81)
    1. [3.1. 3.1 bytecode读写](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-1-bytecode%E8%AF%BB%E5%86%99)
        1. [3.1.1. 3.1.1 新建类](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-1-1-%E6%96%B0%E5%BB%BA%E7%B1%BB)
        2. [3.1.2. 3.1.2 冻结类](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-1-2-%E5%86%BB%E7%BB%93%E7%B1%BB)
    2. [3.2. 3.2类搜索路径](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-2%E7%B1%BB%E6%90%9C%E7%B4%A2%E8%B7%AF%E5%BE%84)
    3. [3.3. 3.3 ClassPool](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-3-ClassPool)
        1. [3.3.1. 3.3.1避免内存溢出](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-3-1%E9%81%BF%E5%85%8D%E5%86%85%E5%AD%98%E6%BA%A2%E5%87%BA)
        2. [3.3.2. 3.3.2 级联ClassPools](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-3-2-%E7%BA%A7%E8%81%94ClassPools)
        3. [3.3.3. 3.3.3为新类重命名](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-3-3%E4%B8%BA%E6%96%B0%E7%B1%BB%E9%87%8D%E5%91%BD%E5%90%8D)
        4. [3.3.4. 3.3.4 从冻结类中创建新类](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-3-4-%E4%BB%8E%E5%86%BB%E7%BB%93%E7%B1%BB%E4%B8%AD%E5%88%9B%E5%BB%BA%E6%96%B0%E7%B1%BB)
    4. [3.4. 3.3 类加载器](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-3-%E7%B1%BB%E5%8A%A0%E8%BD%BD%E5%99%A8)
        1. [3.4.1. 3.3.1 CtClass中的toClass方法](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-3-1-CtClass%E4%B8%AD%E7%9A%84toClass%E6%96%B9%E6%B3%95)
    5. [3.5. 3.4 java中的类加载](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-4-java%E4%B8%AD%E7%9A%84%E7%B1%BB%E5%8A%A0%E8%BD%BD)
    6. [3.6. 3.5 使用javassist.Loader](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-5-%E4%BD%BF%E7%94%A8javassist-Loader)
    7. [3.7. 3.5 打造一个类加载器](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-5-%E6%89%93%E9%80%A0%E4%B8%80%E4%B8%AA%E7%B1%BB%E5%8A%A0%E8%BD%BD%E5%99%A8)
    8. [3.8. 3.5 修改系统类](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-5-%E4%BF%AE%E6%94%B9%E7%B3%BB%E7%BB%9F%E7%B1%BB)
    9. [3.9. 3.6 运行状态下重新加载类](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#3-6-%E8%BF%90%E8%A1%8C%E7%8A%B6%E6%80%81%E4%B8%8B%E9%87%8D%E6%96%B0%E5%8A%A0%E8%BD%BD%E7%B1%BB)
4. [4. 四 定制化](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E5%9B%9B-%E5%AE%9A%E5%88%B6%E5%8C%96)
    1. [4.1. 4.1 方法体前/后穿插代码段](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-%E6%96%B9%E6%B3%95%E4%BD%93%E5%89%8D-%E5%90%8E%E7%A9%BF%E6%8F%92%E4%BB%A3%E7%A0%81%E6%AE%B5)
        1. [4.1.1. 4.1.1 $0, $1, $2, ...](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-1-0-1-2)
        2. [4.1.2. 4.1.2 $args](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-2-args)
        3. [4.1.3. 4.1.3 $$$$](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-3)
        4. [4.1.4. 4.1.4 $cflow](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-4-cflow)
        5. [4.1.5. 4.1.5 $r](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-5-r)
        6. [4.1.6. 4.1.6 $w](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-6-w)
        7. [4.1.7. 4.1.7 $_](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-7)
        8. [4.1.8. 4.1.8 $sig](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-8-sig)
        9. [4.1.9. 4.1.9 $class](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-9-class)
        10. [4.1.10. 4.1.10 addCatch()](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-1-10-addCatch)
    2. [4.2. 4.2 修改方法体](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-%E4%BF%AE%E6%94%B9%E6%96%B9%E6%B3%95%E4%BD%93)
        1. [4.2.1. 4.2.1 利用源文本替换现有表达式](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-1-%E5%88%A9%E7%94%A8%E6%BA%90%E6%96%87%E6%9C%AC%E6%9B%BF%E6%8D%A2%E7%8E%B0%E6%9C%89%E8%A1%A8%E8%BE%BE%E5%BC%8F)
        2. [4.2.2. 4.2.2 javassist.expr.MethodCall](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-2-javassist-expr-MethodCall)
        3. [4.2.3. 4.2.3 javassist.expr.ConstructorCall](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-3-javassist-expr-ConstructorCall)
        4. [4.2.4. 4.2.4 javassist.expr.FieldAccess](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-4-javassist-expr-FieldAccess)
        5. [4.2.5. 4.2.5 javassist.expr.NewExpr](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-5-javassist-expr-NewExpr)
        6. [4.2.6. 4.2.6 javassist.expr.NewArray](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-6-javassist-expr-NewArray)
        7. [4.2.7. 4.2.7 javassist.expr.Instanceof](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-7-javassist-expr-Instanceof)
        8. [4.2.8. 4.2.8 javassist.expr.Cast](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-8-javassist-expr-Cast)
        9. [4.2.9. 4.2.9 javassist.expr.Handler](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-2-9-javassist-expr-Handler)
    3. [4.3. 4.3 添加新方法或字段](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-3-%E6%B7%BB%E5%8A%A0%E6%96%B0%E6%96%B9%E6%B3%95%E6%88%96%E5%AD%97%E6%AE%B5)
        1. [4.3.1. 4.3.1 添加一个方法](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-3-1-%E6%B7%BB%E5%8A%A0%E4%B8%80%E4%B8%AA%E6%96%B9%E6%B3%95)
        2. [4.3.2. 4.3.2 相互递归调用方法](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-3-2-%E7%9B%B8%E4%BA%92%E9%80%92%E5%BD%92%E8%B0%83%E7%94%A8%E6%96%B9%E6%B3%95)
        3. [4.3.3. 4.3.3 添加字段](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-3-3-%E6%B7%BB%E5%8A%A0%E5%AD%97%E6%AE%B5)
        4. [4.3.4. 4.3.4 成员移除](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-3-4-%E6%88%90%E5%91%98%E7%A7%BB%E9%99%A4)
    4. [4.4. 4.4 Annotations](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-4-Annotations)
    5. [4.5. 4.5 运行时类支持](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-5-%E8%BF%90%E8%A1%8C%E6%97%B6%E7%B1%BB%E6%94%AF%E6%8C%81)
    6. [4.6. 4.6导入](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-6%E5%AF%BC%E5%85%A5)
    7. [4.7. 4.7限制](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#4-7%E9%99%90%E5%88%B6)
5. [5. 五 字节码API](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E4%BA%94-%E5%AD%97%E8%8A%82%E7%A0%81API)
    1. [5.1. 5.1 获取ClassFile对象](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#5-1-%E8%8E%B7%E5%8F%96ClassFile%E5%AF%B9%E8%B1%A1)
    2. [5.2. 5.2 添加和删除成员](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#5-2-%E6%B7%BB%E5%8A%A0%E5%92%8C%E5%88%A0%E9%99%A4%E6%88%90%E5%91%98)
    3. [5.3. 5.3 遍历方法体](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#5-3-%E9%81%8D%E5%8E%86%E6%96%B9%E6%B3%95%E4%BD%93)
    4. [5.4. 5.4 字节码序列的生成](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#5-4-%E5%AD%97%E8%8A%82%E7%A0%81%E5%BA%8F%E5%88%97%E7%9A%84%E7%94%9F%E6%88%90)
    5. [5.5. 5.5 注解 (Meta tags)](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#5-5-%E6%B3%A8%E8%A7%A3-Meta-tags)
6. [6. 六 泛型](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E5%85%AD-%E6%B3%9B%E5%9E%8B)
7. [7. 七 可变参数](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E4%B8%83-%E5%8F%AF%E5%8F%98%E5%8F%82%E6%95%B0)
8. [8. 八 J2ME](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E5%85%AB-J2ME)
9. [9. 九 装箱/拆箱](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E4%B9%9D-%E8%A3%85%E7%AE%B1-%E6%8B%86%E7%AE%B1)
10. [10. 十 调试](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E5%8D%81-%E8%B0%83%E8%AF%95)
11. [11. 十一 javassist使用示例代码](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E5%8D%81%E4%B8%80-javassist%E4%BD%BF%E7%94%A8%E7%A4%BA%E4%BE%8B%E4%BB%A3%E7%A0%81)
    1. [11.1. 11.1 生成字段和方法](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#11-1-%E7%94%9F%E6%88%90%E5%AD%97%E6%AE%B5%E5%92%8C%E6%96%B9%E6%B3%95)
    2. [11.2. 11.2 通过反射调用](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#11-2-%E9%80%9A%E8%BF%87%E5%8F%8D%E5%B0%84%E8%B0%83%E7%94%A8)
    3. [11.3. 11.3 通过接口调用](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#11-3-%E9%80%9A%E8%BF%87%E6%8E%A5%E5%8F%A3%E8%B0%83%E7%94%A8)
    4. [11.4. 11.4 修改现有的类对象](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#11-4-%E4%BF%AE%E6%94%B9%E7%8E%B0%E6%9C%89%E7%9A%84%E7%B1%BB%E5%AF%B9%E8%B1%A1)
    5. [11.5. 11.5 实现动态代理](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#11-5-%E5%AE%9E%E7%8E%B0%E5%8A%A8%E6%80%81%E4%BB%A3%E7%90%86)
12. [12. 十二 重新生成类的字节码文件](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E5%8D%81%E4%BA%8C-%E9%87%8D%E6%96%B0%E7%94%9F%E6%88%90%E7%B1%BB%E7%9A%84%E5%AD%97%E8%8A%82%E7%A0%81%E6%96%87%E4%BB%B6)
    1. [12.1. 12.1 给类添加方法](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#12-1-%E7%BB%99%E7%B1%BB%E6%B7%BB%E5%8A%A0%E6%96%B9%E6%B3%95)
    2. [12.2. 12.2 给类添加属性](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#12-2-%E7%BB%99%E7%B1%BB%E6%B7%BB%E5%8A%A0%E5%B1%9E%E6%80%A7)
    3. [12.3. 12.3 修改类的方法](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#12-3-%E4%BF%AE%E6%94%B9%E7%B1%BB%E7%9A%84%E6%96%B9%E6%B3%95)
    4. [12.4. 12.4 修改注解的值](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#12-4-%E4%BF%AE%E6%94%B9%E6%B3%A8%E8%A7%A3%E7%9A%84%E5%80%BC)
    5. [12.5. 12.5 修改已加载过的类](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#12-5-%E4%BF%AE%E6%94%B9%E5%B7%B2%E5%8A%A0%E8%BD%BD%E8%BF%87%E7%9A%84%E7%B1%BB)
    6. [12.6. 12.6 修改未加载过的类](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#12-6-%E4%BF%AE%E6%94%B9%E6%9C%AA%E5%8A%A0%E8%BD%BD%E8%BF%87%E7%9A%84%E7%B1%BB)
    7. [12.7. 12.7 获取类基本信息](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#12-7-%E8%8E%B7%E5%8F%96%E7%B1%BB%E5%9F%BA%E6%9C%AC%E4%BF%A1%E6%81%AF)
    8. [12.8. 12.8 创建一个新类](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#12-8-%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E6%96%B0%E7%B1%BB)
    9. [12.9. 12.9 使用 Javassist 解析方法信息](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#12-9-%E4%BD%BF%E7%94%A8-Javassist-%E8%A7%A3%E6%9E%90%E6%96%B9%E6%B3%95%E4%BF%A1%E6%81%AF)
13. [13. 十三 springboot整合javassist](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#%E5%8D%81%E4%B8%89-springboot%E6%95%B4%E5%90%88javassist)

##### [FEATURED TAGS](https://www.yishuifengxiao.com/tags/)

[入门教程](https://www.yishuifengxiao.com/tags/#%E5%85%A5%E9%97%A8%E6%95%99%E7%A8%8B "入门教程") [jvm](https://www.yishuifengxiao.com/tags/#jvm "jvm")

---

##### FRIENDS

- [易水组件](https://doc.yishuifengxiao.com/)
 - [CSDN](https://www.csdn.net/)
 - [W3C菜鸟](http://www.runoob.com/)
 - [spring boot](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#getting-started-installing-the-cli)
 - [spring cloud](https://cloud.spring.io/spring-cloud-static/Finchley.SR2/single/spring-cloud.html#spring-cloud-eureka-server)
 - [spring security](https://docs.spring.io/spring-security/site/docs/5.1.2.RELEASE/reference/htmlsingle/#jc-method)
 - [spring](https://docs.spring.io/spring/docs/4.3.14.BUILD-SNAPSHOT/spring-framework-reference/htmlsingle/)
 - [码云](https://gitee.com/zhiyubujian)

- [](https://github.com/yishuifengxiao)
 - [](https://twitter.com/yishuifengxiao)
 - [](https://www.facebook.com/yishuifengxiao)
 - [_知_](https://www.zhihu.com/people/yishuifengxiao)

Copyright ©   [yishuifengxiao](mailto:zhiyubujian@163.com)   2024  
     
Theme by [Hux](http://huangxuan.me/) | re-Ported by [_hexo-theme-snail_](https://github.com/dusign/hexo-theme-snail)  

[鄂ICP备16025261号-1](https://beian.miit.gov.cn/) [鄂公网安备 42010602001350号](http://www.beian.gov.cn/)

[](https://www.yishuifengxiao.com/2023/04/04/javassist%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E7%AC%94%E8%AE%B0/#top)

![](chrome-extension://ofpnmcalabcbjgholdjcjblkibolbppb/static/global/src/static/monicaLogo.png)⌘M