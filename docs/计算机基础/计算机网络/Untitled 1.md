- [常见公式](https://blog.csdn.net/weixin_42782150/article/details/104878759#_1)
- - [1、向量公式](https://blog.csdn.net/weixin_42782150/article/details/104878759#1_35)
    - [2、分段函数](https://blog.csdn.net/weixin_42782150/article/details/104878759#2_46)
    - [3、多行表达公式](https://blog.csdn.net/weixin_42782150/article/details/104878759#3_280)
- [常见公式环境](https://blog.csdn.net/weixin_42782150/article/details/104878759#_302)
- [公式编辑的编号设置](https://blog.csdn.net/weixin_42782150/article/details/104878759#_385)
- [矩阵](https://blog.csdn.net/weixin_42782150/article/details/104878759#_420)
- - [1、不带括号的矩阵](https://blog.csdn.net/weixin_42782150/article/details/104878759#1_448)
    - [2、带小括号的矩阵](https://blog.csdn.net/weixin_42782150/article/details/104878759#2_470)
    - [3、带中括号的矩阵](https://blog.csdn.net/weixin_42782150/article/details/104878759#3_494)
    - [4、带大括号的矩阵](https://blog.csdn.net/weixin_42782150/article/details/104878759#4_518)
    - [5、带省略号的矩阵](https://blog.csdn.net/weixin_42782150/article/details/104878759#5_541)
    - [6、带横线/竖线分割的矩阵：](https://blog.csdn.net/weixin_42782150/article/details/104878759#6_569)
- [上下标符号](https://blog.csdn.net/weixin_42782150/article/details/104878759#_623)
- [括号](https://blog.csdn.net/weixin_42782150/article/details/104878759#_650)
- [分式与根式](https://blog.csdn.net/weixin_42782150/article/details/104878759#_679)
- [开方](https://blog.csdn.net/weixin_42782150/article/details/104878759#_717)
- [累加/累乘](https://blog.csdn.net/weixin_42782150/article/details/104878759#_722)
- [三角函数](https://blog.csdn.net/weixin_42782150/article/details/104878759#_728)
- [对数函数](https://blog.csdn.net/weixin_42782150/article/details/104878759#_741)
- [二元运算符](https://blog.csdn.net/weixin_42782150/article/details/104878759#_748)
- [关系符号](https://blog.csdn.net/weixin_42782150/article/details/104878759#_788)
- [极限](https://blog.csdn.net/weixin_42782150/article/details/104878759#_819)
- [向量](https://blog.csdn.net/weixin_42782150/article/details/104878759#_827)
- [模运算](https://blog.csdn.net/weixin_42782150/article/details/104878759#_832)
- [箭头](https://blog.csdn.net/weixin_42782150/article/details/104878759#_843)
- [集合](https://blog.csdn.net/weixin_42782150/article/details/104878759#_878)
- [微积分](https://blog.csdn.net/weixin_42782150/article/details/104878759#_906)
- [逻辑运算](https://blog.csdn.net/weixin_42782150/article/details/104878759#_917)
- [希腊字母](https://blog.csdn.net/weixin_42782150/article/details/104878759#_928)
- [省略号](https://blog.csdn.net/weixin_42782150/article/details/104878759#_958)
- [空格](https://blog.csdn.net/weixin_42782150/article/details/104878759#_980)
- [其他符号](https://blog.csdn.net/weixin_42782150/article/details/104878759#_992)
- [表格格式设置](https://blog.csdn.net/weixin_42782150/article/details/104878759#_1019)

## 常见公式

一般公式分为两种形式，行内公式和行间公式。==行内公式==是在公式代码块的前后均添加一个`$` ；==行间公式==则是在公式代码块的前后均添加两个`$$` 。

**数学算式：**  
（1）行内公式：Γ ( z ) = ∫ 0 ∞ t z − 1 e − t d t   . \Gamma(z) = \int_0^\infty t^{z-1}e^{-t}dt\,.Γ(z)=∫0∞​tz−1e−tdt.

（2）行间公式：  
Γ ( z ) = ∫ 0 ∞ t z − 1 e − t d t   . \Gamma(z) = \int_0^\infty t^{z-1}e^{-t}dt\,.Γ(z)=∫0∞​tz−1e−tdt.  
**Markdown公式：**

```python
$ \Gamma(z) = \int_0^\infty t^{z-1}e^{-t}dt\,. $
$$\Gamma(z) = \int_0^\infty t^{z-1}e^{-t}dt\,.$$
```

**公式排列：一般使用`\binom{a}{b}`或者`{a \choose b}`实现对a , b a,ba,b两个公式的排列。**

**数学算式：**  
( n + 1 2 k ) \binom{n+1}{2k}(2kn+1​)  
**Markdown公式：**

```python
$$\binom{n+1}{2k} $$
```

**数学算式：**  
( n + 1 2 k ) {n+1 \choose 2k}(2kn+1​)  
**Markdown公式：**

```python
$${n+1 \choose 2k} $$
```

### 1、向量公式

**向量表示：** 使用`\mathbf{x}`来表示向量x \mathbf{x}x。

**数学算式：**  
f ( x ) = w T x f(\mathbf{x})=\mathbf{w}^T\mathbf{x}f(x)=wTx  
**Markdown公式：**

```python
$$f(\mathbf{x})=\mathbf{w}^T\mathbf{x}$$
```

### 2、分段函数

定义函数的时候经常需要分情况给出表达式，使用 `{…`。其中：  
（1）使用`\` 来==分隔分组==；  
（2）使用`&` 来==指示需要对齐的位置==；  
（3）使用`\ + 空格`来表示==空格==；  
（4）如果要使==分类之间的垂直间隔变大==，可以使用`\[2ex]` 代替`\` 来分隔不同的情况。(`3ex,4ex` 也可以用，`1ex` 相当于原始距离）。

**数学算式：**

分段函数  
y = { − x , x ≤ 0 x , x > 0 (1) y=

{−x,x≤0x,x>0{−�,�≤0�,�>0

\tag{1}y={−x,x≤0x,x>0​(1)

**Markdown公式：**

```python
# 分段函数
$$
y=
\begin{cases}
-x,\quad x\leq 0\\
x, \quad x>0
\end{cases}
\tag{1}
$$
```

方程组  
{ a 1 x + b 1 y + c 1 z = d 1 a 2 x + b 2 y + c 2 z = d 2 a 3 x + b 3 y + c 3 z = d 3 \left\{

a1x+b1y+c1z=d1a2x+b2y+c2z=d2a3x+b3y+c3z=d3�1�+�1�+�1�=�1�2�+�2�+�2�=�2�3�+�3�+�3�=�3

\right.⎩⎨⎧​a1​x+b1​y+c1​z=d1​a2​x+b2​y+c2​z=d2​a3​x+b3​y+c3​z=d3​​

```python
# 方程组
$$
\left\{ 
\begin{array}{c}
    a_1x+b_1y+c_1z=d_1 \\ 
    a_2x+b_2y+c_2z=d_2 \\ 
    a_3x+b_3y+c_3z=d_3
\end{array}
\right. 
$$
```

u ( x ) = { exp ⁡ x if  x ≥ 0 1 if  x < 0 u(x) =

{expx1if x≥0if x<0{exp⁡�if �≥01if �<0

u(x)={expx1​if x≥0if x<0​  
均方误差  
J ( θ ) = 1 2 m ∑ i = 0 m ( y i − h θ ( x i ) ) 2 J(\theta) = \frac{1}{2m}\sum_{i = 0} ^m(y^i - h_\theta (x^i))^2J(θ)=2m1​i=0∑m​(yi−hθ​(xi))2

```python
# 均方误差
$$
J(\theta) = \frac{1}{2m}\sum_{i = 0} ^m(y^i - h_\theta (x^i))^2
$$
```

批量梯度下降  
∂ J ( θ ) ∂ θ j = − 1 m ∑ i = 0 m ( y i − h θ ( x i ) ) x j i \frac{\partial J(\theta)}{\partial\theta_j}=-\frac1m\sum_{i=0}^m(y^i-h_\theta(x^i))x^i_j∂θj​∂J(θ)​=−m1​i=0∑m​(yi−hθ​(xi))xji​

```python
# 批量梯度下降
$$
\frac{\partial J(\theta)}{\partial\theta_j}=-\frac1m\sum_{i=0}^m(y^i-h_\theta(x^i))x^i_j 
$$
```

推导过程  
∂ J ( θ ) ∂ θ j = − 1 m ∑ i = 0 m ( y i − h θ ( x i ) ) ∂ ∂ θ j ( y i − h θ ( x i ) ) = − 1 m ∑ i = 0 m ( y i − h θ ( x i ) ) ∂ ∂ θ j ( ∑ j = 0 n θ j x j i − y i ) = − 1 m ∑ i = 0 m ( y i − h θ ( x i ) ) x j i

∂J(θ)∂θj=−1m∑i=0m(yi−hθ(xi))∂∂θj(yi−hθ(xi))=−1m∑i=0m(yi−hθ(xi))∂∂θj(∑j=0nθjxij−yi)=−1m∑i=0m(yi−hθ(xi))xij∂�(�)∂��=−1�∑�=0�(��−ℎ�(��))∂∂��(��−ℎ�(��))=−1�∑�=0�(��−ℎ�(��))∂∂��(∑�=0������−��)=−1�∑�=0�(��−ℎ�(��))���

∂θj​∂J(θ)​​=−m1​i=0∑m​(yi−hθ​(xi))∂θj​∂​(yi−hθ​(xi))=−m1​i=0∑m​(yi−hθ​(xi))∂θj​∂​(j=0∑n​θj​xji​−yi)=−m1​i=0∑m​(yi−hθ​(xi))xji​​

```python
# 推导过程
$$
\begin{aligned}
\frac{\partial J(\theta)}{\partial\theta_j}
& = -\frac1m\sum_{i=0}^m(y^i-h_\theta(x^i)) \frac{\partial}{\partial\theta_j}(y^i-h_\theta(x^i)) \\
& = -\frac1m\sum_{i=0}^m(y^i-h_\theta(x^i)) \frac{\partial}{\partial\theta_j}(\sum_{j=0}^n\theta_jx_j^i-y^i) \\
& = -\frac1m\sum_{i=0}^m(y^i-h_\theta(x^i))x^i_j
\end{aligned}
$$
```

case环境的使用  
a = { ∫ x   d x b 2 a =

{∫xdxb2{∫�d��2

a={∫xdxb2​

```python
# case环境的使用
$$
a =
   \begin{cases}
     \int x\, \mathrm{d} x\\
     b^2
   \end{cases}
$$
```

带方框的等式  
x 2 + y 2 = z 2

x2+y2=z2�2+�2=�2

x2+y2=z2​​

```python
# 带方框的等式
$$
\begin{aligned}
 \boxed{x^2+y^2 = z^2}
\end{aligned}
$$
```

最大（最小）操作符  
arg max ⁡ a f ( a ) = * ⁡ a r g   m a x b f ( b ) arg min ⁡ c f ( c ) = * ⁡ a r g   m i n d f ( d )

argmaxaf(a)=argmaxbf(b)argmincf(c)=argmindf(d)argmax�⁡�(�)=argmax�⁡�(�)argmin�⁡�(�)=argmin�⁡�(�)

argmaxa​f(a)=*argmaxb​f(b)argminc​f(c)=*argmind​f(d)​

```python
$$
\begin{gathered}
\operatorname{arg\,max}_a f(a) 
 = \operatorname*{arg\,max}_b f(b) \\
 \operatorname{arg\,min}_c f(c) 
 = \operatorname*{arg\,min}_d f(d)
\end{gathered}
$$
```

求极限  
lim ⁡ a → ∞ 1 a

lima→∞1alim�→∞1�

a→∞lim​a1​​  
lim ⁡ a → ∞ 1 a

lima→∞1alim�→∞1�

lima→∞​a1​​

```python
$$
\begin{aligned}
  \lim_{a\to \infty} \tfrac{1}{a}
\end{aligned}
$$
$$
\begin{aligned}
   \lim\nolimits_{a\to \infty} \tfrac{1}{a}
\end{aligned}
$$
```

求积分  
∫ a b x 2 d x

∫bax2dx∫���2d�

∫ab​x2dx​  
∫ a b x 2 d x

∫abx2dx∫���2d�

a∫b​x2dx​

```python
$$
\begin{aligned}
   \int_a^b x^2  \mathrm{d} x
\end{aligned}
$$
$$
\begin{aligned}
   \int\limits_a^b x^2  \mathrm{d} x
\end{aligned}
$$
```

使用`\[2ex]` 代替`\` 使分组的垂直间隔增大。

**数学算式：**  
y = { − x , x ≤ 0 x , x > 0 (1) y=

{−x,x≤0x,x>0{−�,�≤0�,�>0

\tag{1}y=⎩⎨⎧​−x,x≤0x,x>0​(1)  
**Markdown公式：**

```python
$$
y=
\begin{cases}
-x,\quad x\leq 0 \\[2ex]
x, \quad x>0
\end{cases}
\tag{1}
$$
```

### 3、多行表达公式

有时候需要将一行公式分多行进行显示，其中`\begin{aligned}` 表示==开始方程==，`\end{equation}` 表示==方程结束==；使用`\\`表示==公式换行==。\begin{gather}表示环境设置。，`&` 表示==对齐的位置==。

**数学算式：**  
J ( w ) = 1 2 m ∑ i = 1 m ( f ( x i ) − y i ) 2 = 1 2 m ∑ i = 1 m [ f ( x i ) ] 2 − 2 f ( x i ) y i + y i 2

J(w)=12m∑i=1m(f(xi)−yi)2=12m∑i=1m[f(xi)]2−2f(xi)yi+y2i�(�)=12�∑�=1�(�(��)−��)2=12�∑�=1�[�(��)]2−2�(��)��+��2

J(w)​=2m1​i=1∑m​(f(xi​)−yi​)2=2m1​i=1∑m​[f(xi​)]2−2f(xi​)yi​+yi2​​  
**Markdown公式：**

```python
$$
\begin{aligned}
J(\mathbf{w})&=\frac{1}{2m}\sum_{i=1}^m(f(\mathbf{x_i})-y_i)^2\\
&=\frac{1}{2m}\sum_{i=1}^m [f(\mathbf{x_i})]^2-2f(\mathbf{x_i)}y_i+y_i^2
\end{aligned}
$$
```

## 常见公式环境

|环境名称|释义|
|---|---|
|align|最基本的对齐环境|
|multline|非对齐环境|
|gather|无对齐的连续方程|

> gathered 允许多行（多组）方程式在彼此之下设置并分配单个方程式编号  
> split 与align *类似，但在另一个显示的数学环境中使用  
> aligned 与align类似，可以在其他数学环境中使用。  
> alignedat 与alignat类似，同样需要一个额外的参数来指定要设置的方程列数。

**备注：** 如果各个方程需要==在某个字符处对齐（如等号对齐），只需在所有要对齐的字符前加上 `&` 符号==。

**数学算式：**  
B ′ = − ∂ × E , E ′ = ∂ × B − 4 π j , } Maxwell’s equations

\begin{aligned} \left.\begin{aligned} B'&=-\partial \times E,\\ %加&指定对齐位置 E'&=\partial \times B - 4\pi j, \end{aligned}\begin{aligned} \left.\begin{aligned} B'&=-\partial \times E,\\ %加&指定对齐位置 E'&=\partial \times B - 4\pi j, \end{aligned}

\right\} %加右} \qquad \text{Maxwell's equations} \end{aligned}B′E′​=−∂×E,=∂×B−4πj,​}Maxwell’s equations​

σ 1 = x + y σ 2 = x y σ 1 ′ = ∂ x + y ∂ x σ 2 ′ = ∂ x y ∂ x

σ1σ′1=x+y=∂x+y∂xσ2σ′2=xy=∂xy∂x�1=�+��2=���1′=∂�+�∂��2′=∂��∂�

σ1​σ1′​​=x+y=∂x∂x+y​​σ2​σ2′​​=yx​=∂x∂yx​​​

a n = 1 π ∫ − π π f ( x ) cos ⁡ n x   d x = 1 π ∫ − π π x 2 cos ⁡ n x   d x

an=1π∫−ππf(x)cosnxdx=1π∫−ππx2cosnxdx��=1�∫−���(�)cos⁡��d�=1�∫−���2cos⁡��d�

an​​=π1​−π∫π​f(x)cosnxdx=π1​−π∫π​x2cosnxdx​

J ( θ ) = − 1 m ∑ i = 1 m y i l o g h θ ( x i ) + ( 1 − y i ) l o g ( 1 − h θ ( x i ) )

J(θ)=−1m∑mi=1yiloghθ(xi)+(1−yi)log(1−hθ(xi))�(θ)=−1�∑�=1������ℎθ(��)+(1−��)���(1−ℎθ(��))

J(θ)=−m1​i=1∑m​yi​loghθ​(xi​)+(1−yi​)log(1−hθ​(xi​))​

```python
$$
\begin{aligned}
J(\mathbf{θ})=-\frac{1}{m}∑_{i=1}^{m}y_ilogh_θ(x_i)+(1−y_i)log(1−h_θ(x_i))
\end{aligned}
$$
```

**Markdown公式：**

```python
$$
\begin{aligned}
 \left.\begin{aligned}
        B'&=-\partial \times E,\\         %加&指定对齐位置
        E'&=\partial \times B - 4\pi j,
       \end{aligned}
 \right\}								%加右}
 \qquad \text{Maxwell's equations}
\end{aligned}
$$

$$
\begin{aligned}
 \sigma_1 &= x + y  &\quad \sigma_2 &= \frac{x}{y} \\	
 \sigma_1' &= \frac{\partial x + y}{\partial x} & \sigma_2' 
    &= \frac{\partial \frac{x}{y}}{\partial x}
\end{aligned}
$$

$$
\begin{aligned}
a_n&=\frac{1}{\pi}\int\limits_{-\pi}^{\pi}f(x)\cos nx\,\mathrm{d}x\\
&=\frac{1}{\pi}\int\limits_{-\pi}^{\pi}x^2\cos nx\,\mathrm{d}x\\[6pt]
\end{aligned}
$$
```

## 公式编辑的编号设置

|符号|功能|
|---|---|
|\tag{标号}|公式宏包序号设置命令，可用于带星号公式环境中的公式行|
|\tag*{标号}|作用与\tag相同，只是标号两侧没有圆括号|

**数学算式：**  
x 2 + y 2 = z 2 ( 1 ′ ) x^2+y^2=z^2 \tag{1$'$}x2+y2=z2(1′)  
x 4 + y 4 = z 4 (*) x^4+y^4=z^4 \tag{*}x4+y4=z4(*)  
x 5 + y 5 = z 5 * x^5+y^5=z^5 \tag*{*}x5+y5=z5*  
x 6 + y 6 = z 6 (1-1) x^6+y^6=z^6 \tag{1-1}x6+y6=z6(1-1)  
**Markdown公式：**

```python
$$
x^2+y^2=z^2 \tag{1$'$}
$$
$$
x^4+y^4=z^4 \tag{*} 
$$
$$
x^5+y^5=z^5 \tag*{*}
$$
$$
x^6+y^6=z^6 \tag{1-1} 
$$
```

## 矩阵

**常见矩阵表现形式：**

**数学算式：**  
( 1 2 3 4 )

(1324)(1234)

(13​24​)  
[ 1 2 3 4 ]

[1324][1234]

[13​24​]  
{ 1 2 3 4 }

{1324}{1234}

{13​24​}  
∣ 1 2 3 4 ∣

∣∣∣1324∣∣∣|1234|

∣∣∣∣​13​24​∣∣∣∣​  
∥ 1 2 3 4 ∥

‖‖‖1324‖‖‖‖1234‖

∥∥∥∥​13​24​∥∥∥∥​

==元素省略==可以使用`\cdots` 表示⋯，`\ddots`表示⋱ ，`\vdots`表示⋮ ，从而省略矩阵中的元素，如：  
( 1 a 1 a 1 2 ⋯ a 1 n 1 a 2 a 2 2 ⋯ a 2 n ⋮ ⋮ ⋮ ⋱ ⋮ 1 a m a m 2 ⋯ a m n )

⎛⎝⎜⎜⎜⎜⎜11⋮1a1a2⋮ama21a22⋮a2m⋯⋯⋱⋯an1an2⋮anm⎞⎠⎟⎟⎟⎟⎟(1�1�12⋯�1�1�2�22⋯�2�⋮⋮⋮⋱⋮1����2⋯���)

⎝⎜⎜⎜⎛​11⋮1​a1​a2​⋮am​​a12​a22​⋮am2​​⋯⋯⋱⋯​a1n​a2n​⋮amn​​⎠⎟⎟⎟⎞​

**Markdown公式：**

```python
$$\begin{pmatrix}1 & 2 \\ 3 &4\\ \end{pmatrix}$$
$$\begin{bmatrix}1 & 2 \\ 3 & 4\\ \end{bmatrix}$$
$$\begin{Bmatrix}1 &2 \\ 3 & 4\\ \end{Bmatrix}$$
$$\begin{vmatrix}1 &2 \\ 3 &4\\ \end{vmatrix}$$ 
$$\begin{Vmatrix}1 &  2 \\ 3 &  4\\ \end{Vmatrix}$$
$$\begin{pmatrix}1&a_1&a_1^2&\cdots&a_1^n\\1&a_2&a_2^2&\cdots&a_2^n\\\vdots&\vdots&\vdots&\ddots&\vdots\\1&a_m&a_m^2&\cdots&a_m^n\\\end{pmatrix}
$$
```

**为公式添加脚注编号使用：`\tag{n}`,其中 n nn 表示第n nn个公式。**

### 1、不带括号的矩阵

**数学算式：**  
1 2 3 4 5 6 7 8 9 (1)

147258369123456789

\tag{1}147​258​369​(1)  
**Markdown公式：**

```python
$$
\begin{matrix}
1 & 2 & 3\\
4 & 5 & 6 \\
7 & 8 & 9
\end{matrix}
\tag{1}
$$
```

### 2、带小括号的矩阵

**数学算式：**  
( 1 2 3 4 5 6 7 8 9 ) (2) \left(

147258369123456789

\right) \tag{2}⎝⎛​147​258​369​⎠⎞​(2)  
**Markdown公式：**

```python
$$\left(
\begin{matrix}
1 & 2 & 3\\
4 & 5 & 6 \\
7 & 8 & 9
\end{matrix}
\right)
\tag{2}
$$
```

### 3、带中括号的矩阵

**数学算式：**  
[ 1 2 3 4 5 6 7 8 9 ] (3) \left[

147258369123456789

\right] \tag{3}⎣⎡​147​258​369​⎦⎤​(3)  
**Markdown公式：**

```python
$$\left[
\begin{matrix}
1 & 2 & 3\\
4 & 5 & 6 \\
7 & 8 & 9
\end{matrix}
\right]
\tag{3}
$$
```

### 4、带大括号的矩阵

**数学算式：**  
{ 1 2 3 4 5 6 7 8 9 } (4) \left\{

147258369123456789

\right\} \tag{4}⎩⎨⎧​147​258​369​⎭⎬⎫​(4)  
**Markdown公式：**

```python
$$\left\{
\begin{matrix}
1 & 2 & 3\\
4 & 5 & 6 \\
7 & 8 & 9
\end{matrix}
\right\}
\tag{4}
$$
```

### 5、带省略号的矩阵

**数学算式：**  
[ a b ⋯ a b b ⋯ b ⋮ ⋮ ⋱ ⋮ c c ⋯ c ] (5) \left[

ab⋮cbb⋮c⋯⋯⋱⋯ab⋮c��⋯���⋯�⋮⋮⋱⋮��⋯�

\right] \tag{5}⎣⎢⎢⎢⎡​ab⋮c​bb⋮c​⋯⋯⋱⋯​ab⋮c​⎦⎥⎥⎥⎤​(5)  
**Markdown公式：**

```python
$$
\left[
\begin{matrix}
a & b & \cdots & a\\
b & b & \cdots & b\\
\vdots & \vdots & \ddots & \vdots\\
c & c & \cdots & c
\end{matrix}
\right]
\tag{5}
$$
```

### 6、带横线/竖线分割的矩阵：

**数学算式：**  
[ 1 2 3 4 5 6 7 8 9 ] (6) \left[

147258369123456789

\right] \tag{6}⎣⎡​147​258​369​⎦⎤​(6)  
**Markdown公式：**

```python
$$
\left[
\begin{array}{c|cc}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{array}
\right]
\tag{6}
$$
```

**横线用 `\hline` 分割，示例如下：**

**数学算式：**  
[ 1 2 3 4 5 6 7 8 9 ] (7) \left[

147258369123456789

\right] \tag{7}⎣⎡​147​258​369​​⎦⎤​(7)  
**Markdown公式：**

```python
$$
\left[
    \begin{array}{c|cc}
    1 & 2 & 3 \\ \hline
    4 & 5 & 6 \\
    7 & 8 & 9
    \end{array}
\right]
\tag{7}
$$
```

## 上下标符号

默认情况下，上、下标符号仅仅对下一个组起作用。一个组即单个字符或者使用`{…}` 包裹起来的内容。

|数学算式|Markdown公式|核心语法|
|---|---|---|
|a i , a p r e a_i , a_{pre}ai​,apre​|a_i , a_{pre}|下标使用`_`|
|a i , a p r e a^i , a^{pre}ai,apre|a^i , a^{pre}|上标使用`^`|
|a ˉ \bar{a}aˉ|\bar{a}||
|a ˊ \acute{a}aˊ|\acute||
|a ˘ \breve{a}a˘|\breve{a}||
|a ˋ \grave{a}aˋ|\grave{a}||
|a ˙ \dot{a}a˙|\dot{a}||
|a ¨ \ddot{a}a¨|\ddot{a}||
|x ˙ ˙ \dot {\dot x}x˙˙|\dot {\dot x}||
|a ^ \hat{a}a^|\hat{a}||
|x y ^ \widehat {xy}xy​|\widehat{xy}|多字符可以使用|
|a ˇ \check{a}aˇ|\check{a}||
|a ˘ \breve{a}a˘|\breve{a}||
|a ~ \tilde{a}a~|\tilde{a}||
|a ⃗ \vec{a}a|\vec{a}|矢量使用 `\vec{}`|
|x y → \overrightarrow {xy}xy​|\overrightarrow {xy}|向量|
|a + b + c + d ‾ \overline{a + b + c + d}a+b+c+d​|\overline{a + b + c + d}||
|a + b + c + d ‾ \underline{a + b + c + d}a+b+c+d​|\underline{a + b + c + d}||
|a + b + c + d ⏞ \overbrace{a + b + c + d}a+b+c+d​|\overbrace{a + b + c + d}||
|a + b + c + d ⏟ \underbrace{a + b + c + d}a+b+c+d​|\underbrace{a + b + c + d}||
|a + b + c ⏟ 1.0 + d ⏞ 2.0 \overbrace{a + \underbrace{b + c}_{1.0} + d}^{2.0}a+1.0b+c​​+d​2.0​|\overbrace{a + \underbrace{b + c}_{1.0} + d}^{2.0}||

## 括号

小括号与方括号  
（1）使用原始的( ) ， [   ] ( ) ，[ \ ]()，[ ]得到的括号大小是固定的，如( 2 + 3 ) [ 4 + 4 ] ( 2 + 3 ) [ 4 + 4 ] ( 2 + 3 ) [ 4 + 4 ] (2+3)[4+4](2+3)[4+4](2+3)[4+4](2+3)[4+4](2+3)[4+4](2+3)[4+4]：  
（2）使用`\left(或\right)`可使括号大小与邻近的公式相适应（该语句适用于所有括号类型），如( x y ) \left(\frac{x}{y}\right)(yx​)：

|数学算式|Markdown公式|核心语法|
|---|---|---|
|( , ) ( , )(,)|( , )||
|[ , ] [ , ][,]|[ , ]||
|⟨ , ⟩ \lang, \rang⟨,⟩|\lang, \rang 或 \langle, \rangle||
|∣ , ∣ ∣,∣∣,∣|\lvert, \rvert||
|∥ , ∥ \lVert, \rVert∥,∥|\lVert, \rVert||
|{ , } \lbrace, \rbrace{,}|\lbrace, \rbrace 或 {, }||

**增大括号的方法：**

|数学算式|Markdown公式|核心语法|
|---|---|---|
|( x ) (x)(x)|(x)||
|( x ) \big( x \big)(x)|\big( x \big)||
|( x ) \Big( x \Big)(x)|\Big( x \Big)||
|( x ) \bigg( x \bigg)(x)|\bigg( x \bigg)||
|( x ) \Bigg( x \Bigg)(x)|\Bigg( x \Bigg)||
|( ( ( ( ( x ) ) ) ) ) \Bigg(\bigg(\Big(\big((x)\big)\Big)\bigg)\Bigg)(((((x)))))|\Bigg(\bigg(\Big(\big((x)\big)\Big)\bigg)\Bigg)||
|[ [ [ [ [ x ] ] ] ] ] \Bigg[\bigg[\Big[\big[[x]\big]\Big]\bigg]\Bigg][[[[[x]]]]]|\Bigg[\bigg[\Big[\big[[x]\big]\Big]\bigg]\Bigg]||
|⟨ ⟨ ⟨ ⟨ ⟨ x ⟩ ⟩ ⟩ ⟩ ⟩ \Bigg \langle \bigg \langle \Big \langle\big\langle\langle x \rangle \big \rangle\Big\rangle\bigg\rangle\Bigg\rangle⟨⟨⟨⟨⟨x⟩⟩⟩⟩⟩|\Bigg \langle \bigg \langle \Big \langle\big\langle\langle x \rangle \big \rangle\Big\rangle\bigg\rangle\Bigg\rangle||
|∣ ∣ ∣ ∣ ∣ x ∣ ∣ ∣ ∣ ∣ \Bigg\lvert\bigg\lvert\Big\lvert\big\lvert\lvert x \rvert\big\rvert\Big\rvert\bigg\rvert\Bigg\rvert∣∣∣∣∣​∣∣∣∣​∣∣∣​∣∣​∣x∣∣∣​∣∣∣​∣∣∣∣​∣∣∣∣∣​|\Bigg\lvert\bigg\lvert\Big\lvert\big\lvert\lvert x \rvert\big\rvert\Big\rvert\bigg\rvert\Bigg\rvert||
|∥ ∥ ∥ ∥ ∥ x ∥ ∥ ∥ ∥ ∥ \Bigg\lVert\bigg\lVert\Big\lVert\big\lVert\lVert x \rVert\big\rVert\Big\rVert\bigg\rVert\Bigg\rVert∥∥∥∥∥​∥∥∥∥​∥∥∥​∥∥​∥x∥∥∥​∥∥∥​∥∥∥∥​∥∥∥∥∥​|\Bigg\lVert\bigg\lVert\Big\lVert\big\lVert\lVert x \rVert\big\rVert\Big\rVert\bigg\rVert\Bigg\rVert||
|{ { { { { x } } } } } \Bigg\{\bigg\{\Big\{\big\{ \{x\} \big\}\Big\}\bigg\}\Bigg\}{{{{{x}}}}}|\Bigg{\bigg{\Big{\big{ {x} \big}\Big}\bigg}\Bigg}||

## 分式与根式

**分式的表示方法：**

（1）使用`\frac{a}{b}`表示分式，比如a + c + 1 b + c + 2 \frac {a+c+1}{b+c+2}b+c+2a+c+1​；

（2）使用`\over`来分隔一个组的前后两部分，如a + 1 b + 1 {a+1\over b+1}b+1a+1​;

（3）==连分数==，使用使用`\cfrac`代替`\frac`或者`\over`，两者效果对比如下：

**`\frac` 表示连分式：**

**数学算式：**  
x = a 0 + 1 2 a 1 + 2 2 a 2 + 3 2 a 3 + 4 2 a 4 + . . . x=a_0 + \frac{1^2}{a_ 1+\frac{2^2}{a_2+\frac{3^2}{a_3+ \frac{4^2}{a_4+...}}}}x=a0​+a1​+a2​+a3​+a4​+...42​32​22​12​  
**Markdown公式：**

```python
$$x=a_0 + \frac{1^2}{a_ 1+\frac{2^2}{a_2+\frac{3^2}{a_3+ \frac{4^2}{a_4+...}}}}$$
```

**`\cfrac` 表示连分式：**

**数学算式：**  
x = a 0 + 1 2 a 1 + 2 2 a 2 + 3 2 a 3 + 4 2 a 4 + . . . x=a_0 + \cfrac{1^2}{a_ 1+\cfrac{2^2}{a_2+\cfrac{3^2}{a_3+ \cfrac{4^2}{a_4+...}}}}x=a0​+a1​+a2​+a3​+a4​+...42​32​22​12​  
**Markdown公式：**

```python
​$$x=a_0 + \cfrac{1^2}{a_ 1+\cfrac{2^2}{a_2+\cfrac{3^2}{a_3+ \cfrac{4^2}{a_4+...}}}}$$
```

**`\cfrac` 表示连分式：**

|数学算式|Markdown公式|核心语法|
|---|---|---|
|a b \frac{a}{b}ba​|\frac{a}{b}|分数使用`\frac{分子}{分母}`|
|a i , a p r e a^i , a^{pre}ai,apre|a^i , a^{pre}|上标使用`^`|

## 开方

|数学算式|Markdown公式|核心语法|
|---|---|---|
|a + b \sqrt{a + b}a+b​|\sqrt{a + b}|开方使用`\sqrt{}`|
|a + b n \sqrt[n]{a + b}na+b​|\sqrt[n]{a + b}|开n次方使用`\sqrt[n]{}`|

## 累加/累乘

|数学算式|Markdown公式|核心语法|
|---|---|---|
|∑ i = 0 n x 2 \sum_{i = 0}^{n} x^2∑i=0n​x2|\sum_{i = 0}^{n} x^2|累加使用`\sum_{下标}^{上标}`|
|∏ i = 0 n 1 x \prod_{i = 0}^{n}\frac{1}{x}∏i=0n​x1​|\prod_{i = 0}^{n}\frac{1}{x}|累乘使用`\prod_{下标}^{上标}`|

## 三角函数

|数学算式|Markdown公式|释义|
|---|---|---|
|sin ⁡ \sinsin|\sin|正弦|
|cos ⁡ \coscos|\cos|余弦|
|tan ⁡ \tantan|\tan|正切|
|cot ⁡ \cotcot|\cot|余切|
|sec ⁡ \secsec|\sec|反正弦|
|csc ⁡ \csccsc|\csc|反余弦|
|⊥ \bot⊥|\bot|垂直|
|∠ \angle∠|\angle|夹角|
|4 0 ∘ 40^\circ40∘|40^\circ|度数|

## 对数函数

|数学算式|Markdown公式|核心语法|
|---|---|---|
|ln ⁡ a + b \ln{a + b}lna+b|\ln{a + b}|以e为底，对数函数使用`\ln{}`|
|log ⁡ a b \log_{a}^{b}logab​|\log_{a}^{b}|对数函数使用`\log_{a}^{b}`|
|lg ⁡ a + b \lg{a + b}lga+b|\lg{a + b}|以10为底，对数函数使用`\ln{}`|

## 二元[运算符](https://so.csdn.net/so/search?q=%E8%BF%90%E7%AE%97%E7%AC%A6&spm=1001.2101.3001.7020)

|数学算式|Markdown公式|核心语法|
|---|---|---|
|± \pm±|\pm|正负号|
|∓ \mp∓|\mp|负正号|
|× \times×|\times|乘号|
|÷ \div÷|\div|除号|
|∗ \ast∗|\ast|星号|
|⋆ \star⋆|\star||
|∣ \mid∣|\mid|竖线|
|∤ \nmid∤|\nmid||
|∘ \circ∘|\circ|圆圈|
|∙ \bullet∙|\bullet||
|⋅ \cdot⋅|\cdot|**点**|
|≀ \wr≀|\wr||
|⋄ \diamond⋄|\diamond||
|◊ \Diamond◊|\Diamond||
|△ \triangle△|\triangle||
|△ \bigtriangleup△|\bigtriangleup||
|▽ \bigtriangledown▽|\bigtriangledown||
|◃ \triangleleft◃|\triangleleft||
|▹ \triangleright▹|\triangleright||
|⊲ \lhd⊲|\lhd||
|⊳ \rhd⊳|\rhd||
|⊴ \unlhd⊴|\unlhd||
|⊵ \unrhd⊵|\unrhd||
|∘ \circ∘|\circ||
|◯ \bigcirc◯|\bigcirc||
|⊙ \odot⊙|\odot||
|⨀ \bigodot⨀|\bigodot|点积|
|⊘ \oslash⊘|\oslash||
|⊖ \ominus⊖|\ominus||
|⊗ \otimes⊗|\otimes||
|⨂ \bigotimes⨂|\bigotimes|克罗内克积|
|⊕ \oplus⊕|\oplus||
|⨁ \bigoplus⨁|\bigoplus|异或|
|† \dagger†|\dagger||
|‡ \ddagger‡|\ddagger||
|⨿ \amalg⨿|\amalg||

## 关系符号

|数学算式|Markdown公式|核心语法|
|---|---|---|
|≤ \leq≤|\leq|小于等于|
|≥ \geq≥|\geq|大于等于|
|≡ \equiv≡|\equiv|全等于|
|⊨ \models⊨|\models||
|≺ \prec≺|\prec||
|≻ \succ≻|\succ||
|∼ \sim∼|\sim||
|⊥ \perp⊥|\perp||
|⪯ \preceq⪯|\preceq||
|⪰ \succeq⪰|\succeq||
|≃ \simeq≃|\simeq||
|∣ \mid∣|\mid||
|≪ \ll≪|\ll||
|≫ \gg≫|\gg||
|≍ \asymp≍|\asymp||
|∥ \parallel∥|\parallel||
|≈ \approx≈|\approx||
|≅ \cong≅|\cong||
|≠ \neq​=|\neq|不等于|
|≐ \doteq≐|\doteq||
|∝ \propto∝|\propto||
|⋈ \bowtie⋈|\bowtie||
|⋈ \Join⋈|\Join||
|⌣ \smile⌣|\smile||
|⌢ \frown⌢|\frown||
|⊢ \vdash⊢|\vdash||
|⊣ \dashv⊣|\dashv||

## 极限

|数学算式|Markdown公式|核心语法|
|---|---|---|
|lim ⁡ \limlim|\lim|极限使用`\lim`|
|→ \rightarrow→|\rightarrow|趋向于使用`\rightarrow`|
|∞ \infty∞|\infty|无穷使用`\infty`|
|lim ⁡ n → + ∞ n \lim_{n\rightarrow+\infty}nlimn→+∞​n|\lim_{n\rightarrow+\infty}n||

## 向量

|数学算式|Markdown公式|核心语法|
|---|---|---|
|a ⃗ \vec{a}a|\vec{a}|向量使用`\vec{a}`|
|J ( w ) J(\mathbf{w})J(w)|J(\mathbf{w})|向量使用`\mathbf{w}`|

## 模运算

模运算使用`\pmod`来表示。示例如下：

**数学算式：**  
a ≡ b ( m o d n ) a \equiv b \pmod na≡b(modn)  
**Markdown公式：**

```python
$a \equiv b \pmod n$
```

## 箭头

|数学算式|Markdown公式|核心语法|
|---|---|---|
|↑ \uparrow↑|\uparrow||
|↓ \downarrow↓|\downarrow||
|↕ \updownarrow↕|\updownarrow||
|⇑ \Uparrow⇑|\Uparrow||
|⇓ \Downarrow⇓|\Downarrow||
|⇕ \Updownarrow⇕|\Updownarrow||
|→ \rightarrow→|\rightarrow||
|← \leftarrow←|\leftarrow||
|↔ \leftrightarrow↔|\leftrightarrow||
|⇒ \Rightarrow⇒|\Rightarrow||
|⇐ \Leftarrow⇐|\Leftarrow||
|⇔ \Leftrightarrow⇔|\Leftrightarrow||
|⟶ \longrightarrow⟶|\longrightarrow||
|⟵ \longleftarrow⟵|\longleftarrow||
|⟷ \longleftrightarrow⟷|\longleftrightarrow||
|⟹ \Longrightarrow⟹|\Longrightarrow||
|⟸ \Longleftarrow⟸|\Longleftarrow||
|⟺ \Longleftrightarrow⟺|\Longleftrightarrow||
|↦ \mapsto↦|\mapsto||
|⟼ \longmapsto⟼|\longmapsto||
|↩ \hookleftarrow↩|\hookleftarrow||
|↪ \hookrightarrow↪|\hookrightarrow||
|⇀ \rightharpoonup⇀|\rightharpoonup||
|↽ \leftharpoondown↽|\leftharpoondown||
|⇌ \rightleftharpoons⇌|\rightleftharpoons||
|↼ \leftharpoonup↼|\leftharpoonup||
|⇁ \rightharpoondown⇁|\rightharpoondown||
|⇝ \leadsto⇝|\leadsto||
|↗ \nearrow↗|\nearrow||
|↘ \searrow↘|\searrow||
|↙ \swarrow↙|\swarrow||
|↖ \nwarrow↖|\nwarrow||

## 集合

|数学算式|Markdown公式|核心语法|
|---|---|---|
|∅ \emptyset∅|\emptyset|空集|
|∅ \varnothing∅|\varnothing|空|
|∈ \in∈|\in|属于|
|∋ \ni∋|\ni||
|∉ \notin∈/​|\notin|不属于|
|⊂ \subset⊂|\subset|子集|
|⊃ \supset⊃|\supset|父集|
|⊄ \not\subset​⊂|\not\subset|非子集|
|⊆ \subseteq⊆|\subseteq|真子集|
|⊊ \subsetneq⊊|\subsetneq|非子集|
|⊇ \supseteq⊇|\supseteq||
|∪ \cup∪|\cup|并集|
|⋃ \bigcup⋃|\bigcup|并集|
|∩ \cap∩|\cap|交集|
|⋂ \bigcap⋂|\bigcap|交集|
|⊎ \uplus⊎|\uplus|多重集|
|⨄ \biguplus⨄|\biguplus|多重集|
|⊏ \sqsubset⊏|\sqsubset||
|⊐ \sqsupset⊐|\sqsupset||
|⊓ \sqcap⊓|\sqcap||
|⊑ \sqsubseteq⊑|\sqsubseteq||
|⊒ \sqsupseteq⊒|\sqsupseteq||
|∨ \vee∨|\vee||
|∧ \wedge∧|\wedge||
|∖ \setminus∖|\setminus|差集|

## 微积分

|数学算式|Markdown公式|核心语法|
|---|---|---|
|′ \prime′|\prime|一阶导数|
|∫ \int∫|\int|一重积分|
|∬ \iint∬|\iint|双重积分|
|∭ \iiint∭|\iiint|三重积分|
|∮ \oint∮|\oint|曲线积分|
|∇ \nabla∇|\nabla|梯度|
|∫ 0 2 x 2 d x \int_0^2 x^2 dx∫02​x2dx|\int_0^2 x^2 dx|其他的积分符号类似|

## 逻辑运算

|数学算式|Markdown公式|核心语法|
|---|---|---|
|∵ \because∵|\because|因为|
|∴ \therefore∴|\therefore|所以|
|∀ \forall∀|\forall|任意|
|∃ \exist∃|\exist|存在|
|∨ \vee∨|\vee|逻辑与|
|∧ \wedge∧|\wedge|逻辑或|
|⋁ \bigvee⋁|\bigvee|逻辑与|
|⋀ \bigwedge⋀|\bigwedge|逻辑或|

## 希腊字母

|大写|Markdown公式|小写|Markdown公式|
|---|---|---|---|
|A \AlphaA|\Alpha|α \alphaα|\alpha|
|B \BetaB|\Beta|β \betaβ|\beta|
|Γ \GammaΓ|\Gamma|γ \gammaγ|\gamma|
|Δ \DeltaΔ|\Delta|δ \deltaδ|\delta|
|E \EpsilonE|\Epsilon|ϵ \epsilonϵ|\epsilon|
|||ε \varepsilonε|\varepsilon|
|Z \ZetaZ|\Zeta|ζ \zetaζ|\zeta|
|H \EtaH|\Eta|η \etaη|\eta|
|Θ \ThetaΘ|\Theta|θ \thetaθ|\theta|
|I \IotaI|\Iota|ι \iotaι|\iota|
|K \KappaK|\Kappa|κ \kappaκ|\kappa|
|Λ \LambdaΛ|\Lambda|λ \lambdaλ|\lambda|
|M \MuM|\Mu|μ \muμ|\mu|
|N \NuN|\Nu|ν \nuν|\nu|
|Ξ \XiΞ|\Xi|ξ \xiξ|\xi|
|O \OmicronO|\Omicron|ο \omicronο|\omicron|
|Π \PiΠ|\Pi|π \piπ|\pi|
|P \RhoP|\Rho|ρ \rhoρ|\rho|
|Σ \SigmaΣ|\Sigma|σ \sigmaσ|\sigma|
|T \TauT|\Tau|τ \tauτ|\tau|
|Υ \UpsilonΥ|\Upsilon|υ \upsilonυ|\upsilon|
|Φ \PhiΦ|\Phi|ϕ \phiϕ|\phi|
|||φ \varphiφ|\varphi|
|X \ChiX|\Chi|χ \chiχ|\chi|
|Ψ \PsiΨ|\Psi|ψ \psiψ|\psi|
|Ω \OmegaΩ|\Omega|ω \omegaω|\omega|

## 省略号

不同省略号的区别是==点的位置不同==，`\ldots` 位置稍低，`\cdots` 位置居中。

|数学算式|Markdown公式|核心语法|
|---|---|---|
|… \dots…|\dots|一般用于有下标的序列|
|… \ldots…|\ldots||
|⋯ \cdots⋯|\cdots|纵向位置比\dots稍高|
|⋮ \vdots⋮|\vdots|竖向|
|⋱ \ddots⋱|\ddots||

示例如下：

**Markdown公式**

```python
$$ 
x_1, x_2, \dots, x_n \quad \quad 1, 2, \cdots, n \quad \quad \vdots \quad\quad \ddots 
$$
```

**数学算式**  
x 1 , x 2 , … , x n 1 , 2 , ⋯   , n ⋮ ⋱ x_1, x_2, \dots, x_n \quad \quad 1, 2, \cdots, n \quad \quad \vdots \quad\quad \ddotsx1​,x2​,…,xn​1,2,⋯,n⋮⋱

## 空格

|数学算式|Markdown公式|核心语法|
|---|---|---|
|123  ⁣ 123 123\!123123123|123\!123|空格距离：-3/18 em|
|123   123 123\,123123123|123\,123|空格距离：3/18 em|
|123   123 123\:123123123|123\:123|空格距离：4/18 em|
|123    123 123\;123123123|123\;123|空格距离：5/18 em|
|123 123 123\quad123123123|123\quad123|空格距离：1 em|
|123 123 123\qquad123123123|123\qquad123|空格距离：2 em|

**上表中的em是指当前文本中文本的字体尺寸**

## 其他符号

|数学算式|Markdown公式|核心语法|
|---|---|---|
|ℵ \alephℵ|\aleph||
|ℏ \hbarℏ|\hbar||
|ı \imathı|\imath||
|ȷ \jmathȷ|\jmath||
|ℓ \ellℓ|\ell||
|℘ \wp℘|\wp||
|ℜ \Reℜ|\Re||
|ℑ \Imℑ|\Im||
|℧ \mho℧|\mho||
|∇ \nabla∇|\nabla||
|√ \surd√|\surd||
|⊤ \top⊤|\top||
|⊥ \bot⊥|\bot||
|¬ \neg¬|\neg||
|♭ \flat♭|\flat||
|♮ \natural♮|\natural||
|♯ \sharp♯|\sharp||
|\ \backslash\|\backslash||
|∂ \partial∂|\partial||
|□ \Box□|\Box||
|♣ \clubsuit♣|\clubsuit||
|♢ \diamondsuit♢|\diamondsuit||
|♡ \heartsuit♡|\heartsuit||
|♠ \spadesuit♠|\spadesuit||

## 表格格式设置

一般使用 `|--|--|`，这样的形式来创建表格。  
（1）==列样式==可以是`c，l，r` 分别表示==居中，左，右对齐==；  
（2）使用 `|` 表示一条竖线；  
（3）表格中各行使用`\` 分隔，各列使用`&` 分隔；  
（4）使用`\hline` 在==本行前加入一条直线==。 例如:  

**Table1 GBDT与AdaBoost 的** **联系** **与** **区别**

|   |   |   |   |   |   |
|---|---|---|---|---|---|
||模型|学习算法|损失函数|处理问题|改进措施（针对基学习器的不足）|
|AdaBoost算法|加法模型|前向分步算法|指数函数|分类问题|通过提升错分数据点的权重来定位模型的不足|
|GBDT算法|加法模型|前向分步算法|平方损失函数|回归问题|通过算梯度来定位模型的不足|
|指数函数|分类问题|
|一般损失函数|一般决策问题|

​

​

  

