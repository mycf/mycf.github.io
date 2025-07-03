
| B+树                                                                                                                                                                                          |                                                                                                      |                       |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------- |
| [类型](https://zh.wikipedia.org/wiki/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E5%88%97%E8%A1%A8 "数据结构列表")                                                                                   | [树](https://zh.wikipedia.org/wiki/%E6%A0%91_(%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84) "树 (数据结构)") |                       |
| 用[大O符号](https://zh.wikipedia.org/wiki/%E5%A4%A7O%E7%AC%A6%E5%8F%B7 "大O符号")表示的[时间复杂度](https://zh.wikipedia.org/wiki/%E6%97%B6%E9%97%B4%E5%A4%8D%E6%9D%82%E5%BA%A6 "时间复杂度") |                                                                                                      |                       |
| 算法                                                                                                                                                                                          | 平均                                                                                                 | 最差                  |
| 空间                                                                                                                                                                                          | $\mathcal{0}( n)$                                                                                    | $\mathcal{0}(n)$      |
| 搜索                                                                                                                                                                                          | $\mathcal{0}(\log n)$                                                                                | $\mathcal{0}(\log n)$ |
| 插入                                                                                                                                                                                          | $\mathcal{0}(\log n)$                                                                                | $\mathcal{0}(\log n)$ |
| 删除                                                                                                                                                                                          | $\mathcal{0}(\log n)$                                                                                | $\mathcal{0}(\log n)$ |

[![](https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Bplustree.png/400px-Bplustree.png)](https://zh.wikipedia.org/wiki/File:Bplustree.png)

把键1-7连接到值 d1-d7 的B+树。链表（红色）用于快速顺序遍历叶子节点。树的分叉因子 �![b](https://wikimedia.org/api/rest_v1/media/math/render/svg/f11423fbb2e967f986e36804a8ae4271734917c3)=4。

**B+树**（英语：B+ tree）是一种[树数据结构](https://zh.wikipedia.org/wiki/%E6%A0%91_(%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84) "树 (数据结构)")，通常用于[数据库](https://zh.wikipedia.org/wiki/%E6%95%B0%E6%8D%AE%E5%BA%93 "数据库")和[操作系统](https://zh.wikipedia.org/wiki/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F "操作系统")的[文件系统](https://zh.wikipedia.org/wiki/%E6%96%87%E4%BB%B6%E7%B3%BB%E7%BB%9F "文件系统")中。B+树的特点是能够保持数据稳定有序，其插入与修改拥有较稳定的对数时间复杂度。B+树元素自底向上插入，这与[二叉树](https://zh.wikipedia.org/wiki/%E4%BA%8C%E5%8F%89%E6%A0%91 "二叉树")恰好相反。

B+树在节点访问时间远远超过节点内部访问时间的时候，比可作为替代的实现有着实在的优势。这通常在多数节点在[次级存储](https://zh.wikipedia.org/w/index.php?title=%E6%AC%A1%E7%BA%A7%E5%AD%98%E5%82%A8&action=edit&redlink=1 "次级存储（页面不存在）")比如[硬盘](https://zh.wikipedia.org/wiki/%E7%A1%AC%E7%9B%98 "硬盘")中的时候出现。通过最大化在每个[内部节点](https://zh.wikipedia.org/w/index.php?title=%E5%86%85%E9%83%A8%E8%8A%82%E7%82%B9&action=edit&redlink=1 "内部节点（页面不存在）")内的[子节点](https://zh.wikipedia.org/w/index.php?title=%E5%AD%90%E8%8A%82%E7%82%B9&action=edit&redlink=1 "子节点（页面不存在）")的数目减少树的高度，平衡操作不经常发生，而且效率增加了。这种价值得以确立通常需要每个节点在次级存储中占据完整的[磁盘块](https://zh.wikipedia.org/w/index.php?title=%E7%A3%81%E7%9B%98%E5%9D%97&action=edit&redlink=1 "磁盘块（页面不存在）")或近似的大小。

B+树背后的想法是内部节点可以有在预定范围内的可变量目的子节点。因此，B+树不需要像其他[自平衡二叉查找树](https://zh.wikipedia.org/wiki/%E8%87%AA%E5%B9%B3%E8%A1%A1%E4%BA%8C%E5%8F%89%E6%9F%A5%E6%89%BE%E6%A0%91 "自平衡二叉查找树")那样经常的重新平衡。对于特定的实现在子节点数目上的低和高边界是固定的。例如，在 2-3 B 树（常简称为**2-3 树**）中，每个内部节点只可能有 2 或 3 个子节点。如果节点有无效数目的子节点则被当作处于违规状态。

B+树的创造者[Rudolf Bayer](https://zh.wikipedia.org/wiki/Rudolf_Bayer "Rudolf Bayer")没有解释“B”的意义，最常见的观点是代表“平衡”（balanced）或其名字“Bayer”。

## 节点结构[[编辑](https://zh.wikipedia.org/w/index.php?title=B%2B%E6%A0%91&action=edit&section=1 "编辑章节：节点结构")]

在B+树中的节点通常被表示为一组有序的元素和子指针。如果此B+树的阶数是m，则除了根之外的每个节点都包含最少 ⌊�/2⌋![\lfloor m/2\rfloor](https://wikimedia.org/api/rest_v1/media/math/render/svg/87be5eefdb8fa8b05d4e77a49222798c08e66318) 个元素最多 �−1![{\displaystyle m-1}](https://wikimedia.org/api/rest_v1/media/math/render/svg/ecbbd201e0d8f1ccc91cb46362c4b72fa1bbe6c2) 个元素，对于任意的结点有最多 m 个子指针。对于所有内部节点，子指针的数目总是比元素的数目多一个。所有叶子都在相同的高度上，叶结点本身按关键字大小从小到大链接。

## 算法[[编辑](https://zh.wikipedia.org/w/index.php?title=B%2B%E6%A0%91&action=edit&section=2 "编辑章节：算法")]

### 查找[[编辑](https://zh.wikipedia.org/w/index.php?title=B%2B%E6%A0%91&action=edit&section=3 "编辑章节：查找")]
j
查找以典型的方式进行，类似于[二叉查找树](https://zh.wikipedia.org/wiki/%E4%BA%8C%E5%8F%89%E6%9F%A5%E6%89%BE%E6%A0%91 "二叉查找树")。起始于根节点，自顶向下遍历树，选择其分离值在要查找值的任意一边的子指针。在节点内部典型的使用是[二分查找](https://zh.wikipedia.org/wiki/%E4%BA%8C%E5%88%86%E6%9F%A5%E6%89%BE "二分查找")来确定这个位置。

### 插入[[编辑](https://zh.wikipedia.org/w/index.php?title=B%2B%E6%A0%91&action=edit&section=4 "编辑章节：插入")]

节点要处于违规状态，它必须包含在可接受范围之外数目的元素。

1. 首先，查找要插入其中的节点的位置。接着把值插入这个节点中。
2. 如果没有节点处于违规状态则处理结束。
3. 如果某个节点有过多元素，则把它分裂为两个节点，每个都有最小数目的元素。在树上递归向上继续这个处理直到到达根节点，如果根节点被分裂，则建立一个新根节点。为了使它工作，元素的最小和最大数目典型的必须选择为使最小数不小于最大数的一半。

### 删除

1. 首先，查找要删除的值。接着从包含它的节点中删除这个值。
2. 如果没有节点处于违规状态则处理结束。
3. 如果节点处于违规状态则有两种可能情况：
    1. 它的兄弟节点，就是同一个父节点的子节点，可以把一个或多个它的子节点转移到当前节点，而把它返回为合法状态。如果是这样，在更改父节点和两个兄弟节点的分离值之后处理结束。
    2. 它的兄弟节点由于处在低边界上而没有额外的子节点。在这种情况下把两个兄弟节点合并到一个单一的节点中，而且我们递归到父节点上，因为它被删除了一个子节点。持续这个处理直到当前节点是合法状态或者到达根节点，在其上根节点的子节点被合并而且合并后的节点成为新的根节点。

