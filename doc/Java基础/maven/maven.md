[官方文档](https://maven.apache.org/download.cgi)


`MAVEN_OPTS`环境变量
用于启动运行 Maven 的 JVM 的参数

`MAVEN_ARGS`环境变量：
从 Maven 3.9.0 开始，此变量包含在 CLI 参数之前传递给 Maven 的参数。

`settings.xml`文件：
位于 USER_HOME/.m2 的设置文件旨在包含跨项目 Maven 使用的任何配置。

`.mvn`目录：
位于项目**顶级目录**中的文件

- `maven.config`
- `jvm.config`
- `extensions.xml`




Maven坐标的元素包括groupId、artifactId、version、packaging、classifier。

- groupId：定义当前Maven项目隶属的实际项目。
  groupId的表示方式与Java包名的表示方式类似，通常与域名反向一一对应。

- artifactId：该元素定义实际项目中的一个Maven项目（模块），推荐的做法是使用实际项目名称作为artifactId的前缀。
  在默认情况下，Maven生成的构件，其文件名会以artifactId作为开头

- version：该元素定义Maven项目当前所处的版本

- packaging：该元素定义Maven项目的打包方式。
  打包方式通常与所生成构件的文件扩展名对应
  打包方式会影响到构建的生命周期，比如jar打包和war打包会使用不同的命令。最后，当不定义packaging的时候，Maven会使用默认值jar。

- classifier：该元素用来帮助定义构建输出的一些附属构件。附属构件与主构件对应，如上例中的主构件是nexus-indexer-2.0.0.jar，该项目可能还会通过使用一些插件生成如nexus-indexer-2.0.0-javadoc.jar、nexus-indexer-2.0.0-sources.jar这样一些附属构件，其包含了Java文档和源代码。这时候，javadoc和sources就是这两个附属构件的classifier。这样，附属构件也就拥有了自己唯一的坐标。还有一个关于classifier的典型例子是TestNG,TestNG的主构件是基于Java 1.4平台的，而它又提供了一个classifier为jdk5的附属构件。
  注意，不能直接定义项目的classifier，因为附属构件不是项目直接默认生成的，而是由附加的插件帮助生成。

groupId、artifactId、version是必须定义的，packaging是可选的（默认为jar），而classifier是不能直接定义的。

Maven内置了一个中央仓库的地址（http://repo1.maven.org/maven2）



```sh
mvn archetype:generate "-DgroupId=com.companyname.bank" "-DartifactId=consumerBanking" "-DarchetypeArtifactId=maven-archetype-quickstart" "-DinteractiveMode=false"
```
POM中没有指定打包类型，使用默认打包类型jar。

执行命令`mvn clean package`进行打包
Maven会在打包之前执行编译、测试等操作。这里jar:jar任务负责打包，实际上就是jar插件的jar目标将项目主代码打包成一个名为hello-world-1.0-SNAP-SHOT.jar的文件。该文件也位于target/输出目录中，它是根据artifact-version.jar规则进行命名的，如有需要，还可以使用finalName来自定义该文件的名称。

让其他的Maven项目直接引用这个jar呢？还需要一个安装的步骤，执行`mvn clean install`
在打包之后，又执行了安装任务install:install。从输出可以看到该任务将项目输出的jar安装到了Maven本地仓库中

默认打包生成的jar是不能够直接运行的，因为带有main方法的类信息不会添加到manifest中（打开jar文件中的META-INF/MANIFEST.MF文件，将无法看到Main-Class一行）。为了生成可执行的jar文件，需要借助`maven-shade-plugin`

```xml
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
        <transformers>
          <transformer
            implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
            <mainClass>com.juvenxu.mvnbook.helloworld.HelloWorld</mainClass>
          </transformer>
        </transformers>
      </configuration>
    </execution>
  </executions>
</plugin>
```


# 依赖的配置

根元素project下的dependencies可以包含一个或者多个dependency元素，以声明一个或者多个项目依赖。每个依赖可以包含的元素有：groupId、artifactId和version：依赖的基本坐标，对于任何一个依赖来说，基本坐标是最重要的，Maven根据坐标才能找到需要的依赖。
- type：依赖的类型，对应于项目坐标定义的packaging。大部分情况下，该元素不必声明，其默认值为jar。
- scope：依赖的范围，见5.5节。
- optional：标记依赖是否可选，见5.8节。
- exclusions：用来排除传递性依赖，见5.9.1节。

## 依赖的范围

### 三种classpath 

编译classpath、测试classpath、运行classpath

1. Maven在**编译**项目主代码的时候需要使用一套classpath。在上例中，编译项目主代码的时候需要用到spring-core，该文件以依赖的方式被引入到classpath中。
2. 其次，Maven在编译和执行测试的时候会使用另外一套classpath。上例中的JUnit就是一个很好的例子，该文件也以依赖的方式引入到测试使用的classpath中，不同的是这里的依赖范围是test。
3. 最后，实际**运行**Maven项目的时候，又会使用一套classpath，上例中的spring-core需要在该classpath中，而JUnit则不需要。

依赖范围就是用来控制依赖与三种classpath的关系，Maven有以下几种依赖范围：

- compile：编译依赖范围。如果没有指定，就会默认使用该依赖范围。使用此依赖范围的Maven依赖，对于编译、测试、运行三种classpath都有效。典型的例子是spring-core，在编译、测试和运行的时候都需要使用该依赖。

- test：测试依赖范围。使用此依赖范围的Maven依赖，只对于测试classpath有效，在编译主代码或者运行项目的使用时将无法使用此类依赖。典型的例子是JUnit，它只有在编译测试代码及运行测试的时候才需要。

- provided：已提供依赖范围。使用此依赖范围的Maven依赖，**对于编译和测试classpath有效，但在运行时无效**。典型的例子是servlet-api，编译和测试项目的时候需要该依赖，但在运行项目的时候，由于容器已经提供，就不需要Maven重复地引入一遍。

- runtime：运行时依赖范围。使用此依赖范围的Maven依赖，**对于测试和运行classpath有效，但在编译主代码时无效**。典型的例子是JDBC驱动实现，项目主代码的编译只需要JDK提供的JDBC接口，只有在执行测试或者运行项目的时候才需要实现上述接口的具体JDBC驱动。

- system：系统依赖范围。该依赖与三种classpath的关系，和provided依赖范围完全一致。但是，使用system范围的依赖时必须通过systemPath元素显式地指定依赖文件的路径。由于此类依赖不是通过Maven仓库解析的，而且往往与本机系统绑定，可能造成构建的不可移植，因此应该谨慎使用。systemPath元素可以引用环境变量，如：

- import（Maven 2.0.9及以上）：导入依赖范围。该依赖范围不会对三种classpath产生实际的影响

依赖范围与classpath的关系

| 依赖范围（scope） | 对于编译classpath有效 | 对于测试classpath有效 | 对于运行时classpath有效 | 例子                            |
|-------------------|-----------------------|-----------------------|-------------------------|---------------------------------|
| compile           | Y                     | Y                     | Y                       | Y                               |
| test              | --                    | Y                     | --                      | JUnit                           |
| provided          | Y                     | Y                     | --                      | servlet-api                     |
| runtime           | --                    | Y                     | Y                       | JDBC 驱动                       |
| system            | Y                     | Y                     | --                      | 本地的，maven仓库之外的类库文件 |


### 传递性依赖和依赖范围
假设A依赖于B,B依赖于C，我们说A对于B是第一直接依赖，B对于C是第二直接依赖，A对于C是传递性依赖。第一直接依赖的范围和第二直接依赖的范围决定了传递性依赖的范围，最左边一列表示第一直接依赖范围，最上面一行表示第二直接依赖范围，中间的交叉单元格则表示传递性依赖范围。

**表 依赖范围影响传递性依赖**

|          | compile  | test | provided |
|----------|----------|------|----------|
| compile  | compile  |      |          |
| test     | test     |      |          |
| provided | provided |      | provided |
| runtime  | runtime  |      |          |



## 依赖调解

**Maven依赖调解（Dependency Mediation）的第一原则是：路径最近者优先。**

例如，项目A有这样的依赖关系：A->B->C->X（1.0）、A->D->X（2.0），X是A的传递性依赖，但是两条依赖路径上有两个版本的X，那么哪个X会被Maven解析使用呢？两个版本都被解析显然是不对的，因为那会造成依赖重复，因此必须选择一个。该例中X（1.0）的路径长度为3，而X（2.0）的路径长度为2，因此X（2.0）会被解析使用。

**Maven依赖调解的第二原则：第一声明者优先。**

A->B->Y（1.0）、A->C->Y（2.0），Y（1.0）和Y（2.0）的依赖路径长度是一样的，都为2。那么到底谁会被解析使用呢？在Maven 2.0.8及之前的版本中，这是不确定的，但是从Maven 2.0.9开始，为了尽可能避免构建的不确定性。在依赖路径长度相等的前提下，在POM中依赖声明的顺序决定了谁会被解析使用，顺序最靠前的那个依赖优胜。该例中，如果B的依赖声明在C之前，那么Y（1.0）就会被解析使用。

## 可选依赖

假设有这样一个依赖关系，项目A依赖于项目B，项目B依赖于项目X和Y,B对于X和Y的依赖都是可选依赖：A->B、B->X（可选）、B->Y（可选）。根据传递性依赖的定义，如果所有这三个依赖的范围都是compile，那么X、Y就是A的compile范围传递性依赖。然而，由于这里X、Y是**可选依赖，依赖将不会得以传递。**

## 排除依赖

使用exclusions元素声明排除依赖，exclusions可以包含一个或者多个exclusion子元素，因此可以排除一个或者多个传递性依赖。需要注意的是，声明exclusion的时候只需要groupId和artifactId，而不需要version元素，这是因为只需要groupId和artifactId就能唯一定位依赖图中的某个依赖。换句话说，Maven解析后的依赖中，不可能出现groupId和artifactId相同，但是version不同的两个依赖


1.Jar包冲突的通常表现
Jar包冲突往往是很诡异的事情，也很难排查，但也会有一些共性的表现。

抛出java.lang.ClassNotFoundException：典型异常，主要是依赖中没有该类。导致原因有两方面：第一，的确没有引入该类；第二，由于Jar包冲突，Maven仲裁机制选择了错误的版本，导致加载的Jar包中没有该类。

抛出java.lang.NoSuchMethodError：找不到特定的方法。Jar包冲突，导致选择了错误的依赖版本，该依赖版本中的类对不存在该方法，或该方法已经被升级。

抛出java.lang.NoClassDefFoundError，java.lang.LinkageError等，原因同上。

没有异常但预期结果不同：加载了错误的版本，不同的版本底层实现不同，导致预期结果不一致。

2.Jar包冲突的本质
Jar包冲突的本质：Java应用程序因某种因素，加载不到正确的类而导致其行为跟预期不一致。

具体分两种情况：

情况一：项目依赖了同一Jar包的多个版本，并且选错了版本；

情况二：同样的类在不同的Jar包中出现，导致JVM加载了错误的类；

　　情况一，同一个依赖引入了多个Jar包版本，不同的Jar包版本有不同的类和方法。由于Maven依赖树的仲裁机制导致Maven加载了错误的Jar包，从而导致Jar包冲突；

　　情况二，同一类在不同的Jar包中出现。这种情况是由于JVM的同一个类加载器对于同一个类只会加载一次，现在加载一个类之后，同全限定名的类便不会进行加载，从而出现Jar包冲突的问题。

　　针对第二种情况，如果不是类冲突抛出了异常，你可能根本意识不到，所以就显得更为棘手。这种情况就可以采用前文所述的通过分析不同类加载器的优先级及加载路径、文件系统的文件加载顺序等进行调整来解决。

3.解决Jar包冲突的方法
　　几种场景下解决Jar冲突的方法：

Maven默认处理：路径最近者优先和第一声明优先；

排除法：使用 Maven Helper，可以将冲突的Jar包在pom.xml中通过exclude来进行排除；

版本锁定法：如果项目中依赖同一Jar包的很多版本，一个个排除非常麻烦，此时可用版本锁定法，即直接明确引入指定版本的依赖。此种方式的优先级最高。

通过设置classpath指定jar包加载的先后顺序　

3.1Mavenhelper 解决冲突

具体步骤：　　

　　　　1.使用mavenHelper 选择 Confilicts；

　　　　2.如果列表存在冲突的依赖，则点击查看冲突的详情

　　　　3.对冲突的依赖可进行右键；使用 exclude 进行排除即可解决冲突

3.2 通过设置 classpath 指定jar包加载的先后顺序
　　第一种方式：
java -jar -classpath C:\dependency\framework.jar:C:\location\otherFramework.jar  test.jar
　　第二种方式（-cp 等于 -classpath）：

java -jar -cp C:\dependency\framework.jar:C:\location\otherFramework.jar  test.jar
　　第三种方式：

-Djava.class.path=a.jar
　　第四种方式：

-Xbootclasspath/a: 


### 归类依赖


### 优化依赖

Maven会自动解析所有项目的直接依赖和传递性依赖，并且根据规则正确判断每个依赖的范围，对于一些依赖冲突，也能进行调节，以确保任何一个构件只有唯一的版本在依赖中存在。在这些工作之后，最后得到的那些依赖被称为已解析依赖（Resolved Dependency）。可以运行如下的命令查看当前项目的已解析依赖：
```sh
mvn dependency:list
```

在此基础上，还能进一步了解已解析依赖的信息。将直接在当前项目POM声明的依赖定义为顶层依赖，而这些顶层依赖的依赖则定义为第二层依赖，以此类推，有第三、第四层依赖。当这些依赖经Maven解析后，就会构成一个依赖树，通过这棵依赖树就能很清楚地看到某个依赖是通过哪条传递路径引入的。可以运行如下命令查看当前项目的依赖树：[
```sh
mvn dependency:tree
```

使用dependency:list和dependency:tree可以帮助我们详细了解项目中所有依赖的具体信息，在此基础上，还有dependency:analyze工具可以帮助分析当前项目的依赖。

该结果中重要的是两个部分。首先是Used undeclared dependencies，意指项目中使用到的，但是没有显式声明的依赖，这里是spring-context。这种依赖意味着潜在的风险，当前项目直接在使用它们，例如有很多相关的Java import声明，而这种依赖是通过直接依赖传递进来的，当升级直接依赖的时候，相关传递性依赖的版本也可能发生变化，这种变化不易察觉，但是有可能导致当前项目出错。例如由于接口的改变，当前项目中的相关代码无法编译。这种隐藏的、潜在的威胁一旦出现，就往往需要耗费大量的时间来查明真相。因此，显式声明任何项目中直接用到的依赖。

结果中还有一个重要的部分是Unused declared dependencies，意指项目中未使用的，但显式声明的依赖，这里有spring-core和spring-beans。需要注意的是，对于这样一类依赖，我们不应该简单地直接删除其声明，而是应该仔细分析。由于dependency:analyze只会分析编译主代码和测试代码需要用到的依赖，一些执行测试和运行时需要的依赖它就发现不了。很显然，该例中的spring-core和spring-beans是运行Spring Framework项目必要的类库，因此不应该删除依赖声明。当然，有时候确实能通过该信息找到一些没用的依赖，但一定要小心测试。


# 仓库

对于Maven来说，仓库只分为两类：本地仓库和远程仓库。当Maven根据坐标寻找构件的时候，它首先会查看本地仓库，如果本地仓库存在此构件，则直接使用；如果本地仓库不存在此构件，或者需要查看是否有更新的构件版本，Maven就会去远程仓库查找，发现需要的构件之后，下载到本地仓库再使用。如果本地仓库和远程仓库都没有需要的构件，Maven就会报错。

中央仓库是Maven核心自带的远程仓库，它包含了绝大部分开源的构件。在默认配置下，当本地仓库没有Maven需要的构件的时候，它就会尝试从中央仓库下载。私服是另一种特殊的远程仓库，为了节省带宽和时间，应该在局域网内架设一个私有的仓库服务器，用其代理所有外部的远程仓库。内部的项目还能部署到私服上供其他项目使用。

## 本地仓库

默认情况下，不管是在Windows还是Linux上，每个用户在自己的用户目录下都有一个路径名为.m2/repository/的仓库目录。

### 自定义本地仓库目录地址
可以编辑文件～/.m2/settings.xml，设置localRepository元素的值为想要的仓库地址。
```xml
<settings>
  <localRepository>D:\java\repository</localRepository>
</settings>
```

一个构件只有在本地仓库中之后，才能由其他Maven项目使用，那么构件如何进入到本地仓库中呢？
最常见的是依赖Maven从远程仓库下载到本地仓库中。
还有一种常见的情况是，将本地项目的构件安装到Maven仓库中。
通过执行`mvn clean install`，Install插件的install目标将项目的构建输出文件安装到本地仓库。

## 远程仓库

## 中央仓库
$M2_HOME/lib/maven-model-builder-3.0.jar（在Maven 2中，jar文件路径类似于$M2_HOME/lib/maven-2.2.1-uber.jar），然后访问路径org/apache/maven/model/pom-4.0.0.xml（maven 2中为org/apache/maven/project/pom-4.0.0.xml
```sh
jar tf maven-model-builder-3.9.4.jar|grep pom
jar xf lib/maven-model-builder-3.9.4.jar org/apache/maven/model/pom-4.0.0.xml
cat org/apache/maven/model/pom-4.0.0.xml 
```
### 部署至远程仓库

在命令行运行mvn clean deploy,Maven就会将项目构建输出的构件部署到配置对应的远程仓库，如果项目当前的版本是快照版本，则部署到快照版本仓库地址，否则就部署到发布版本仓库地址

# 生命周期

内置三种构建生命周期：clean、default和site。default生命周期负责处理项目部署，clean生命周期负责处理项目清理，而site生命周期负责创建项目的网站。

## clean

clean生命周期仅有pre-clean、clean和post-clean三个阶段，其中的clean与maven-clean-plugin:clean绑定。maven-clean-plugin仅有clean这一个目标，其作用就是删除项目的输出目录。

## site

site生命周期有pre-site、site、post-site和site-deploy四个阶段，其中，site和maven-site-plugin:site相互绑定，site-deploy和maven-site-plugin:depoy相互绑定。maven-site-plugin有很多目标，其中，site目标用来生成项目站点，deploy目标用来将项目站点部署到远程服务器上。


当插件目标被绑定到不同的生命周期阶段的时候，其执行顺序会由生命周期阶段的先后顺序决定。如果多个目标被绑定到同一个阶段，它们的执行顺序会是怎样？答案很简单，当多个插件目标绑定到同一个阶段的时候，这些插件声明的先后顺序决定了目标的执行顺序。

### 使用maven-help-plugin描述插件
获取maven-compiler-plugin 2.1版本的信息

```sh
mvn help:describe -Dplugin=org.apache.maven.plugins:maven-compiler-plugin:2.1 
mvn help:describe -Dplugin=compiler                                           
```

目标前缀（Goal Prefix），其作用是方便在命令行直接运行插件。

在描述插件的时候，还可以省去版本信息，让Maven自动获取最新版本来进行表述。
```sh
mvn help:describe -Dplugin=org.apache.maven.plugins:maven-compiler-plugin     
```

## 聚合

Maven聚合（或者称为多模块）可以实现一个命令同时构建多个模块。

对于聚合模块来说，其打包方式packaging的值必须为pom，否则就无法构建。

元素modules，这是实现聚合的最核心的配置。用户可以通过在一个打包方式为pom的Maven项目中声明任意数量的module元素来实现模块的聚合。这里每个module的值都是一个当前POM的相对目录

一般来说，为了方便快速定位内容，模块所处的目录名称应当与其artifactId一致。

为了方便用户构建项目，通常将聚合模块放在项目目录的最顶层，其他模块则作为聚合模块的子目录存在，这样当用户得到源码的时候，第一眼发现的就是聚合模块的POM，不用从多个模块中去寻找聚合模块来构建整个项目。


Maven会首先解析聚合模块的POM、分析要构建的模块、并计算出一个反应堆构建顺序（Reactor Build Order），然后根据这个顺序依次构建各个模块。反应堆是所有模块组成的一个构建结构。


聚合模块仅仅是帮助聚合其他模块构建的工具，聚合模块中一般仅有一个pom.xml文件

Maven会首先解析聚合模块的POM、分析要构建的模块、并计算出一个反应堆构建顺序（Reactor Build Order），然后根据这个顺序依次构建各个模块。反应堆是所有模块组成的一个构建结构。

**account-aggregator pom.xml**

```xml

<project xmlns="http://maven.apache.org/POM/4.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.yu.account</groupId>
  <artifactId>account-aggregator</artifactId>
  <packaging>pom</packaging>
  <version>1.0-SNAPSHOT</version>
  <name>account-aggregator</name>

  <modules>
    <module>account-email</module>
    <module>account-persist</module>
    <module>account-parent</module>
  </modules>
</project>
```


## 继承

父模块只是为了帮助消除配置的重复，因此它本身不包含除POM之外的项目文件，也就不需要src/main/java/之类的文件夹了。

有了父模块，就需要让其他模块来继承它。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.juvenxu.mvnbook.account</groupId>
        <artifactId>account-parent</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <relativePath>../account-parent/pom.xml</relativePath>
    </parent>

    <artifactId>account-email</artifactId>
    <name>Account Email</name>
    <dependencies>
    <build>
        <plugins>……</plugins>
    </build>
</project>
```


子模块隐式地从父模块继承groupId version
对于artifactId元素来说，子模块应该显式声明


## 可继承的pom元素

groupId：项目组ID，项目坐标的核心元素。
version：项目版本，项目坐标的核心元素。
description：项目的描述信息。
organization：项目的组织信息。
inceptionYear：项目的创始年份。
url：项目的URL地址。
developers：项目的开发者信息。
contributors：项目的贡献者信息。
distributionManagement：项目的部署配置。
issueManagement：项目的缺陷跟踪系统信息。

ciManagement：项目的持续集成系统信息。
scm：项目的版本控制系统信息。
mailingLists：项目的邮件列表信息。
properties：自定义的Maven属性。
dependencies：项目的依赖配置。
dependencyManagement：项目的依赖管理配置。
repositories：项目的仓库配置。
build：包括项目的源码目录配置、输出目录配置、插件配置、插件管理配置等。
reporting：包括项目的报告输出目录配置、报告插件配置等。

### 依赖管理

## 反应堆


Maven 中处理多模块项目的机制称为reactor。 Maven 核心的这一部分执行以下操作：

- 收集所有可用的模块来构建
- 将项目排序为正确的构建顺序
- 按顺序构建选定的项目

在一个多模块的Maven项目中，反应堆（Reactor）是指所有模块组成的一个构建结构。对于单模块的项目，反应堆就是该模块本身，但对于多模块项目来说，反应堆就包含了各模块之间继承与依赖的关系，从而能够自动计算出合理的模块构建顺序。

对项目进行排序时遵循以下关系：

- 项目依赖于构建中的另一个模块
- 插件声明，其中插件是构建中的另一个模块
- 插件对构建中另一个模块的依赖
- 构建中另一个模块上的构建扩展声明
- 元素中声明的顺序<modules>（如果没有其他规则适用）

## 命令行选项

-rf,--resume-from 从指定的项目中恢复反应堆（例如当它在中间发生故障时）
-am,--also-make 在反应器中构建指定的项目及其任何依赖项
-amd,--also-make-dependents 构建指定的项目以及任何依赖于它们的项目
--fail-fast 默认行为  每当模块构建失败时，立即停止整体构建
--fail-at-end 如果某个模块构建失败，则继续其余的反应堆并在最后报告所有失败的模块
--non-recursive 不要使用反应堆构建，即使当前项目声明了模块并仅在当前目录中构建项目

### 反应堆的构建顺序

创建maven工程如下
```sh
➜  account tree     
.
├── account-email
│   └── pom.xml
├── account-parent
│   └── pom.xml
├── account-persist
│   └── pom.xml
└── pom.xml

4 directories, 4 files

```
聚合模块pom.xml如下
```xml
➜  account cat pom.xml 
<project xmlns="http://maven.apache.org/POM/4.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.yu.account</groupId>
  <artifactId>account-aggregator</artifactId>
  <packaging>pom</packaging>
  <version>1.0-SNAPSHOT</version>
  <name>account-aggregator</name>

  <modules>
    <module>account-email</module>
    <module>account-persist</module>
    <module>account-parent</module>
  </modules>
</project>
```

查看反应堆
```sh
➜  account mvn clean
[INFO] Scanning for projects...
[INFO] ------------------------------------------------------------------------
[INFO] Reactor Build Order:
[INFO] 
[INFO] account-parent                                                     [pom]
[INFO] account-email                                                      [jar]
[INFO] account-persist                                                    [jar]
[INFO] account-aggregator                                                 [pom]
```


# Maven 属性

最常见的使用Maven属性的方式，通过<properties>元素用户可以自定义一个或多个Maven属性，然后在POM的其他地方使用${属性名称}的方式引用该属性，这种做法的最大意义在于消除重复。

内置属性：主要有两个常用内置属性——${basedir}表示项目根目录，即包含pom.xml文件的目录；${version}表示项目版本。

POM属性：用户可以使用该类属性引用POM文件中对应元素的值。例如${project.artifactId}就对应了<project><artifactId>元素的值，常用的POM属性包括：■${project.build.sourceDirectory}：项目的主源码目录，默认为src/main/java/。
■${project.build.testSourceDirectory}：项目的测试源码目录，默认为src/test/java/。
■${project.build.directory}：项目构建输出目录，默认为target/。
■${project.outputDirectory}：项目主代码编译输出目录，默认为target/classes/。
■${project.testOutputDirectory}：项目测试代码编译输出目录，默认为target/test-classes/。
■${project.groupId}：项目的groupId。
■${project.artifactId}：项目的artifactId。
■${project.version}：项目的version，与${version}等价。
■${project.build.finalName}：项目打包输出文件的名称，默认为${project.artifactId}-${project.version}。
这些属性都对应了一个POM元素，它们中一些属性的默认值都是在超级POM中定义的，可以参考8.5节。

自定义属性：用户可以在POM的<properties>元素下自定义Maven属性。

Settings属性：与POM属性同理，用户使用以settings.开头的属性引用settings.xml文件中XML元素的值，如常用的${settings.localRepository}指向用户本地仓库的地址。

Java系统属性：所有Java系统属性都可以使用Maven属性引用，例如${user.home}指向了用户目录。用户可以使用mvn help:system查看所有的Java系统属性。

环境变量属性：所有环境变量都可以使用以env.开头的Maven属性引用。例如${env.JAVA_HOME}指代了JAVA_HOME环境变量的值。用户可以使用mvn help:system查看所有的环境变量。

## 资源过滤

资源文件的处理其实是maven-resources-plugin做的事情，它默认的行为只是将项目主资源文件复制到主代码编译输出目录中，将测试资源文件复制到测试代码编译输出目录中。

配置插件解析资源文件中的Maven属性，即开启资源过滤。

针对开发环境的数据库配置

```xml
  <profiles>
    <profile>
      <id>dev</id>
      <properties>
        <db.username>lala</db.username>
      </properties>
    </profile>
  </profiles>

```

为测试资源目录开启过滤
```xml
  <build>
    <testResources>
      <testResource>
        <directory>${project.basedir}/src/test/resources</directory>
        <filtering>true</filtering>
      </testResource>
    </testResources>
  </build>

```

test/resources/db.properties

```properties
db.username=${db.username}
```

运行命令`mvn clean install -Pdev`，查看`cat test-classes/db.properties`

```properties
db.username=lala
```

# Profile

1.命令行激活用户可以使用mvn命令行参数-P加上profile的id来激活profile，多个id之间以逗号分隔。

2.settings文件显式激活如果用户希望某个profile默认一直处于激活状态，就可以配置settings.xml文件的active-Profiles元素，表示其配置的profile对于所有项目都处于激活状态

3.系统属性激活用户可以配置当某系统属性存在的时候，自动激活profile

4.操作系统环境激活Profile还可以自动根据操作系统环境激活，如果构建在不同的操作系统有差异，用户完全可以将这些差异写进profile，然后配置它们自动基于操作系统环境激活


5.文件存在与否激活Maven能够根据项目中某个文件存在与否来决定是否激活profile


6.默认激活用户可以在定义profile的时候指定其默认激活
使用activeByDefault元素用户可以指定profile自动激活。不过需要注意的是，如果POM中有任何一个profile通过以上其他任意一种方式被激活了，所有的默认激活配置都会失效。

查看激活的profile

maven-help-plugin提供了一个目标帮助用户了解当前激活的profile：`mvn help:active-profiles`

maven-help-plugin还有另外一个目标用来列出当前所有的profile：`mvn help:all-profiles`

profile的种类
pom.xml：很显然，pom.xml中声明的profile只对当前项目有效。用户settings.xml：用户目录下.m2/settings.xml中的profile对本机上该用户所有的Maven项目有效。全局settings.xml:Maven安装目录下conf/settings.xml中的profile对本机上所有的Maven项目有效。


# 项目站点

配置maven-site-plugin

```xml
<pluginManagement>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-site-plugin</artifactId>
            <version>3.0-beta-1</version>
        </plugin>
    </plugins>
</pluginManagement>
```


生成站点 执行`mvn site`

在默认情况下Maven生成的站点包含了很多项目信息链接，这其实是由一个名为maven-project-info-reports-plugin的插件生成的。
该插件会基于POM配置生成下列项目信息报告：
关于（about）：项目描述。
持续集成（Continuous Integration）：项目持续集成服务器信息。
依赖（Dependencies）：项目依赖信息，包括传递性依赖、依赖图、依赖许可证以及依赖文件的大小、所包含的类数目等。
依赖收敛（Dependency Convergence）：只针对多模块项目生成，提供一些依赖健康状况分析，如各模块使用的依赖版本是否一致、项目中是否有SNAPSHOT依赖。
依赖管理（Dependency Management）：基于项目的依赖管理配置生成的报告。
问题追踪（Issue Tracking）：项目的问题追踪系统信息。
邮件列表（Mailing Lists）：项目的邮件列表信息。
插件管理（Plugin Management）：项目所使用插件的列表。
项目许可证（Project License）：项目许可证信息。
项目概述（Project Summary）：项目概述包括坐标、名称、描述等。
项目团队（Project Team）：项目团队信息。
源码仓库（Source Repository）：项目的源码仓库信息。


