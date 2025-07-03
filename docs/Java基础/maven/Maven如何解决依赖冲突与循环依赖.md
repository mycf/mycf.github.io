

[来自于](http://mprofiler.com/pages/classes04/) 

Java工程的依赖较多，使用Maven会将依赖闭包都会包含到工程中，这难免会将2个或多个不同版本的jar包引入项目，从而引起冲突。如果是Maven项目，通常会使用Maven自带的插件或maven helper插件来查找。另外还有一些情况也让人无能为力，如有些jar包被打包到了一个全新的jar包中，而这个全新的jar包可能含有和你现在依赖jar包冲突的版本。

举个简单的例子如下： 编写一个类，提供一个方法，然后打包为test-0.0.1.jar，代码如下：

```java
public class TestJarConflict {
    public void testMethod(){
        System.out.println("这是test-0.0.1.jar版本");
    }
}
```
将这个类的打印内容更新为 "这是test-0.0.1.jar版本" 后，打包为test-0.0.2.jar，然后编写一个方法调用，如下：

```java
import java.lang.reflect.Method;

public class TestJarConflictMain {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("TestJarConflict");

        Method method = clazz.getMethod("testMethod");
        method.invoke(clazz.newInstance());
    }
}
```
在程序运行之前，指定jar包加载路径，如下： -cp .:/Users/mazhi/IdeaProjects/java-examples/java-example-06-1/target/test-0.0.1.jar:/Users/mazhi/IdeaProjects/java-examples/java-example-06-1/target/test-0.0.2.jar

这时候可能打印出 "这是test-0.0.1.jar版本" 或 "这是test-0.0.2.jar版本" 内容，试想一下，如果某个版本删除了一个方法而恰好又调用这个方法时，Java应用程序将会报错。

下面详细介绍一下解决jar包冲突的问题。

1. 当冲突两者其中一方兼容另外一方时，通过exclusions和exclusion标签解决
exclusions标签可以将对应依赖的依赖进行剔除，这里注意的是不能针对scope为system的属性或者是通过systemPath引入的jar包依赖，它们不受maven管理。举个例子如下：

```xml
<dependency>
    <groupId>com.deepoove</groupId>
    <artifactId>poi-tl</artifactId>
    <version>1.10.0</version>
    <!-- 项目中已经引入了poi包，所以排除这里的引入 --->
    <exclusions>
        <exclusion>
            <groupId>org.apache.poi</groupId>
            <artifactId>poi</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```
2. 当冲突两者互不兼容时，使用maven-shade-plugin管理插件解决
maven-shade-plugin插件可以解决冲突双方的包互相不兼容情况，其原理是修改其中任意一方的依赖路径，来解决。举个例子如下： Maven配置文件pom.xml如下：
```xml
<dependencies>
    <!-- 项目中已经引用3.17 -->
    <dependency>
        <groupId>org.apache.poi</groupId>
        <artifactId>poi</artifactId>
        <version>3.17</version>
    </dependency>
    <!-- 这次新加的功能需要使用poi-tl，最低poi版本4.12 -->
    <dependency>
        <groupId>com.deepoove</groupId>
        <artifactId>poi-tl</artifactId>
        <version>1.10.0</version>
    </dependency>
</dependencies>
```
项目中已经存在poi 3.17的依赖，而poi-tl最低poi版本要求是4.12，将项目中已有的3.17升级到4.12时，因为API兼容性等问题导致旧代码会报错，但是不升级又无法使用poi-tl。 要解决如上的jar冲突，要做的就是把poi-tl中的高版本poi包改个名字，同时poi-tl中引用的地方也改名（自动），并且代码中用高本版的地方也改个名（手动）。

创建一个空maven项目，引入poi-tl的依赖：
```xml
<dependencies>
    <!-- 这次新加的功能需要使用poi-tl -->
    <dependency>
        <groupId>com.deepoove</groupId>
        <artifactId>poi-tl</artifactId>
        <version>1.10.0</version>
    </dependency>
</dependencies>
```
引入插件并且配置好修改的方式：
```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-shade-plugin</artifactId>
            <version>3.2.4</version>
            <executions>
                <execution>
                    <phase>package</phase>
                    <goals>
                        <goal>shade</goal>
                    </goals>
                    <configuration>
                        <createDependencyReducedPom>true</createDependencyReducedPom>
                        <relocations>
                        　　<!-- 多个包需要替换使用多个relocation-->
                            <relocation>
                                <!-- 改名前 -->
                                <pattern>org.apache.poi</pattern>
                                <!-- 改名后 -->
                                <shadedPattern>shaded.org.apache.poi</shadedPattern>
                            </relocation>
                        </relocations>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```
执行mvn package，如果是IDEA直接双击Lifecycle中的package就行了。 这时target目录中会有两个包，一个是original开头的原本包，因为没有新建类，所以这个包是空的。 另一个是artifactId-version.jar的包，artifactId和version是本项目创建时填写的坐标。 如我的这个maven项目叫rename-lib，版本是0.1，所以包名为rename-lib-0.1.jar，把这个shaded包引入项目中使用即可，如果要使用高版本poi只需要import shaded.org.apache.poi下的类即可。



思考：怎么编写一个工具去扫描jar冲突

MProfiler可在运行的应用程序中扫描各个类加载路径，如果在一个类加载器继承体系下（也就是同个一类加载器可加载到不同版本的jar包，或者子类和父类可加载到不同版本的jar包）搜索到了不同版本的jar包，MProfiler将给出提示。如果有些jar包被打包到了一个全新的jar包中，而这个全新的jar包可能含有和你现在依赖jar包冲突的版本，那么jar包冲突是检测不出来的，我们需要依赖类冲突检查Leak Classes (opens new window)。


# 一文理解Maven如何解决依赖冲突与循环依赖


## 依赖冲突

首先介绍下Maven中依赖管理的策略。

依赖传递：如果A依赖B，B依赖C，那么引入A，意味着B和C都会被引入。

最近依赖策略：如果一个项目依赖相同的groupId、artifactId的多个版本，那么在依赖树（mvn dependency:tree）中离项目最近的那个版本将会被使用。

具体如下：

1. 从当前项目出发，对于同一依赖，优先使用路径最短的那个，无论版本号高低。
    

![](https://oss-emcsprod-public.modb.pro/wechatSpider/modb_20210705_d160d094-dd3e-11eb-90b9-00163e068ecd.png)

1. 同级别的引用，若pom.xml直接引用了两个不同版本的同一个依赖，maven会使用后解析的依赖版本。
    

![](https://oss-emcsprod-public.modb.pro/wechatSpider/modb_20210705_d178f426-dd3e-11eb-90b9-00163e068ecd.png)

1. 若两个不同版本的同一依赖都不是直接在pom.xml下引入，而是间接引入。那么哪个依赖先被引用，就使用哪个版本。
    

![](https://oss-emcsprod-public.modb.pro/wechatSpider/modb_20210705_d1950c56-dd3e-11eb-90b9-00163e068ecd.png)

### 解决依赖冲突

1. 使用`<dependencyManagement>`  
    用于子模块的版本一致性，可以在parent工程里统一管理所有工程的依赖版本。
    
2. 使用`<exclusions>`  
    去除多余的依赖，IDEA提供相关可视化的操作。
    
3. 根据最近依赖策略使用`<dependency>`  
    ，直接在当前项目中指定依赖版本。
    

> 实际开发中依赖冲突的问题复杂多变，需要具体问题具体处理。除了上面三种解决方法，工程结构调整也是一个可能的选择。

## 循环依赖

正常情况下，循环依赖是很少见的，当很多个项目互相引用的时候，就可能出现循环依赖，一般根据错误信息就能解决循环依赖。

### 解决循环依赖

1. 使用`build-helper-maven-plugin`  
    插件可以解决无法构建的问题，但是只是一个规避措施，工程的依赖关系依然是混乱的。
    

> 比如A依赖B，B依赖C，C依赖A的情况。这个插件提供了一种规避措施，即临时地将工程A、B、C合并成一个中间工程，编译出临时的模块D。然后A、B、C再分别依赖临时模块D进行编译。

1. 通过重构，从根本上消除循环依赖。
    
2. 如果循环依赖中确实有多余的部分，可以使用`<exclusions>`  
    去除多余的依赖。(IDEA可以通过图像化界面定位循环依赖)
    

## 补充

### Maven的基础知识

- groupId是项目组织唯一的标识符，实际对应JAVA的包的结构，是main目录里java的目录结构。
    

一般分为多个段，第一段为域，第二段为公司名称…域又分为org、com、cn等等许多，其中org为非营利组织，com为商业组织。

- artifactId是项目的唯一的标识符，实际对应项目的名称，就是项目根目录的名称。
    

一个Maven项目，同一个groupId同一个artifactId下，只会加载一个version。

```
例如：<dependency>    <groupId>org.xiaohui</groupId>    <artifactId>maven-desc</artifactId>    <version>5.3.8</version></dependency>
```

依照这个设置，包结构最好是`org.xiaohui.maven-desc`  
。如果有个StudentDao，那全路径就是`org.xiaohui.maven-desc.dao.StudentDao`  
。

### Maven仓库有哪些

![](https://oss-emcsprod-public.modb.pro/wechatSpider/modb_20210705_d1b2527a-dd3e-11eb-90b9-00163e068ecd.png)

1. 本地仓库  
    本地仓库指的是`${user_home}/.m2/repository/`  
    ，Maven默认会先从本地仓库内寻找所需Jar包。如果本地仓库不存在，Maven才会向远程仓库请求下载，同时缓存到本地仓库。
    
2. 远程仓库分为中央仓库，私服和其他公共库。
    

1. 中央仓库  
    Maven自带的远程仓库，不需要特殊配置。如果私服上也不存在Maven所需 Jar包，那么就去中央仓库上下载Jar包，同时缓存在私服和本地仓库。
    
2. 私服  
    为了节省资源，一般是局域网内设置的私有服务器，当本地仓库内不存在Maven 所需Jar包时，会先去私服上下载Jar包。（内网速度要大于从外部仓库拉取镜像的速度）
    
3. 其他公共库  
    为了解决中央仓库网络对于国内不稳定的问题，常用如阿里云镜像仓库。
    

### Maven的打包命令

IDEA中的Maven插件功能如图：

![](https://oss-emcsprod-public.modb.pro/wechatSpider/modb_20210705_d1ca0f64-dd3e-11eb-90b9-00163e068ecd.png)

这个图表示Maven逐次递进（执行下面的命令就会包含上面的）的打包命令。

常用的打包命令：

1. clean：清理本地工程Jar包。
    
2. package：本地工程打成Jar包。会执行clean和compile。
    
3. install：将本地工程Jar上传到本地仓库。
    
4. deploy：上传到远程仓库。
    

### Maven的依赖范围（scope）

代码有编译、测试、运行的过程，显然有些依赖只用于测试，比如Junit；有些依赖编译用不到，只有运行的时候才能用到，比如MySQL的驱动包在编译期就用不到（编译期用的是JDBC接口），而是在运行时用到的；还有些依赖，编译期要用到，而运行期不需要提供，因为有些容器已经提供了，比如servlet-api在tomcat中已经提供了，只需要的是编译期提供而已。

所以Maven支持指定依赖的scope：

1. compile：默认的scope，运行期有效，需要打入包中。
    
2. provided：编译期有效，运行期不需要提供，不会打入包中。
    
3. runtime：编译不需要，在运行期有效，需要导入包中。（接口与实现分离）
    
4. test：测试需要，不会打入包中。
    

  