---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠==


# Text Elements
    public V put(K key, V value) {
        return putVal(key, value, false);
    }

    /** Implementation for put and putIfAbsent */
    final V putVal(K key, V value, boolean onlyIfAbsent) {
        if (key == null || value == null) throw new NullPointerException();
        int hash = spread(key.hashCode());
        int binCount = 0;
        for (Node<K,V>[] tab = table;;) {
            Node<K,V> f; int n, i, fh; K fk; V fv;
            if (tab == null || (n = tab.length) == 0)
                tab = initTable();
            else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {
                if (casTabAt(tab, i, null, new Node<K,V>(hash, key, value)))
                    break;                   // no lock when adding to empty bin
            }
            else if ((fh = f.hash) == MOVED)
                tab = helpTransfer(tab, f);
            else if (onlyIfAbsent // check first node without acquiring lock
                     && fh == hash
                     && ((fk = f.key) == key || (fk != null && key.equals(fk)))
                     && (fv = f.val) != null)
                return fv;
            else {
                V oldVal = null;
                synchronized (f) {
                    if (tabAt(tab, i) == f) {
                        if (fh >= 0) {
                            binCount = 1;
                            for (Node<K,V> e = f;; ++binCount) {
                                K ek;
                                if (e.hash == hash &&
                                    ((ek = e.key) == key ||
                                     (ek != null && key.equals(ek)))) {
                                    oldVal = e.val;
                                    if (!onlyIfAbsent)
                                        e.val = value;
                                    break;
                                }
                                Node<K,V> pred = e;
                                if ((e = e.next) == null) {
                                    pred.next = new Node<K,V>(hash, key, value);
                                    break;
                                }
                            }
                        }
                        else if (f instanceof TreeBin) {
                            Node<K,V> p;
                            binCount = 2;
                            if ((p = ((TreeBin<K,V>)f).putTreeVal(hash, key,
                                                           value)) != null) {
                                oldVal = p.val;
                                if (!onlyIfAbsent)
                                    p.val = value;
                            }
                        }
                        else if (f instanceof ReservationNode)
                            throw new IllegalStateException("Recursive update");
                    }
                }
                if (binCount != 0) {
                    if (binCount >= TREEIFY_THRESHOLD)
                        treeifyBin(tab, i);
                    if (oldVal != null)
                        return oldVal;
                    break;
                }
            }
        }
        addCount(1L, binCount);
        return null;
    }

    private final void addCount(long x, int check) {
        CounterCell[] cs; long b, s;
        if ((cs = counterCells) != null ||
            !U.compareAndSetLong(this, BASECOUNT, b = baseCount, s = b + x)) {
            CounterCell c; long v; int m;
            boolean uncontended = true;
            if (cs == null || (m = cs.length - 1) < 0 ||
                (c = cs[ThreadLocalRandom.getProbe() & m]) == null ||
                !(uncontended =
                  U.compareAndSetLong(c, CELLVALUE, v = c.value, v + x))) {
                fullAddCount(x, uncontended);
                return;
            }
            if (check <= 1)
                return;
            s = sumCount();
        }
        if (check >= 0) {
            Node<K,V>[] tab, nt; int n, sc;
            while (s >= (long)(sc = sizeCtl) && (tab = table) != null &&
                   (n = tab.length) < MAXIMUM_CAPACITY) {
                int rs = resizeStamp(n) << RESIZE_STAMP_SHIFT;
                if (sc < 0) {
                    if (sc == rs + MAX_RESIZERS || sc == rs + 1 ||
                        (nt = nextTable) == null || transferIndex <= 0)
                        break;
                    if (U.compareAndSetInt(this, SIZECTL, sc, sc + 1))
                        transfer(tab, nt);
                }
                else if (U.compareAndSetInt(this, SIZECTL, sc, rs + 2))
                    transfer(tab, null);
                s = sumCount();
            }
        }
    }

 ^jKzRtqql

获取hash ^W32HTwT1

数组未初始化，先初始化 ^HTHJGQWf

hash对应下标位置不存在数据，直接cas设置 ^KzgloNBK

正在做rehash，帮助迁移 ^shzX0Lxt

只允许不存在时，当前节点存在，直接返回 ^URLgwNC8

头节点加锁 ^0AeifAXd

recheck头节点是否变化，防止其他线程并发修改 ^16FCdxP0

遍历链表，找到就覆盖原值（如果允许），没找到就放末尾（尾插法） ^gwUqg7RF

元素在链表什么位置🤔 ^CyilUEhl

树节点 ^Xd6ZclDY

到了树化阈值，转树 ^AIS6fC2i

计数数组不为空或cas baseCount失败 ^GkZcVC8U

cs对应下标null ^sIGC2udc

cs不存在 ^gwKWmnOx

cs自增失败 ^fyxyxulu

%%
# Drawing
```json
{
	"type": "excalidraw",
	"version": 2,
	"source": "https://github.com/zsviczian/obsidian-excalidraw-plugin/releases/tag/2.0.13",
	"elements": [
		{
			"type": "text",
			"version": 84,
			"versionNonce": 180761733,
			"isDeleted": false,
			"id": "jKzRtqql",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -222.95419311523438,
			"y": -275.28196716308594,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 937.5,
			"height": 2664,
			"seed": 579666095,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1711773705313,
			"link": null,
			"locked": false,
			"fontSize": 20,
			"fontFamily": 3,
			"text": "    public V put(K key, V value) {\n        return putVal(key, value, false);\n    }\n\n    /** Implementation for put and putIfAbsent */\n    final V putVal(K key, V value, boolean onlyIfAbsent) {\n        if (key == null || value == null) throw new NullPointerException();\n        int hash = spread(key.hashCode());\n        int binCount = 0;\n        for (Node<K,V>[] tab = table;;) {\n            Node<K,V> f; int n, i, fh; K fk; V fv;\n            if (tab == null || (n = tab.length) == 0)\n                tab = initTable();\n            else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {\n                if (casTabAt(tab, i, null, new Node<K,V>(hash, key, value)))\n                    break;                   // no lock when adding to empty bin\n            }\n            else if ((fh = f.hash) == MOVED)\n                tab = helpTransfer(tab, f);\n            else if (onlyIfAbsent // check first node without acquiring lock\n                     && fh == hash\n                     && ((fk = f.key) == key || (fk != null && key.equals(fk)))\n                     && (fv = f.val) != null)\n                return fv;\n            else {\n                V oldVal = null;\n                synchronized (f) {\n                    if (tabAt(tab, i) == f) {\n                        if (fh >= 0) {\n                            binCount = 1;\n                            for (Node<K,V> e = f;; ++binCount) {\n                                K ek;\n                                if (e.hash == hash &&\n                                    ((ek = e.key) == key ||\n                                     (ek != null && key.equals(ek)))) {\n                                    oldVal = e.val;\n                                    if (!onlyIfAbsent)\n                                        e.val = value;\n                                    break;\n                                }\n                                Node<K,V> pred = e;\n                                if ((e = e.next) == null) {\n                                    pred.next = new Node<K,V>(hash, key, value);\n                                    break;\n                                }\n                            }\n                        }\n                        else if (f instanceof TreeBin) {\n                            Node<K,V> p;\n                            binCount = 2;\n                            if ((p = ((TreeBin<K,V>)f).putTreeVal(hash, key,\n                                                           value)) != null) {\n                                oldVal = p.val;\n                                if (!onlyIfAbsent)\n                                    p.val = value;\n                            }\n                        }\n                        else if (f instanceof ReservationNode)\n                            throw new IllegalStateException(\"Recursive update\");\n                    }\n                }\n                if (binCount != 0) {\n                    if (binCount >= TREEIFY_THRESHOLD)\n                        treeifyBin(tab, i);\n                    if (oldVal != null)\n                        return oldVal;\n                    break;\n                }\n            }\n        }\n        addCount(1L, binCount);\n        return null;\n    }\n\n    private final void addCount(long x, int check) {\n        CounterCell[] cs; long b, s;\n        if ((cs = counterCells) != null ||\n            !U.compareAndSetLong(this, BASECOUNT, b = baseCount, s = b + x)) {\n            CounterCell c; long v; int m;\n            boolean uncontended = true;\n            if (cs == null || (m = cs.length - 1) < 0 ||\n                (c = cs[ThreadLocalRandom.getProbe() & m]) == null ||\n                !(uncontended =\n                  U.compareAndSetLong(c, CELLVALUE, v = c.value, v + x))) {\n                fullAddCount(x, uncontended);\n                return;\n            }\n            if (check <= 1)\n                return;\n            s = sumCount();\n        }\n        if (check >= 0) {\n            Node<K,V>[] tab, nt; int n, sc;\n            while (s >= (long)(sc = sizeCtl) && (tab = table) != null &&\n                   (n = tab.length) < MAXIMUM_CAPACITY) {\n                int rs = resizeStamp(n) << RESIZE_STAMP_SHIFT;\n                if (sc < 0) {\n                    if (sc == rs + MAX_RESIZERS || sc == rs + 1 ||\n                        (nt = nextTable) == null || transferIndex <= 0)\n                        break;\n                    if (U.compareAndSetInt(this, SIZECTL, sc, sc + 1))\n                        transfer(tab, nt);\n                }\n                else if (U.compareAndSetInt(this, SIZECTL, sc, rs + 2))\n                    transfer(tab, null);\n                s = sumCount();\n            }\n        }\n    }\n\n",
			"rawText": "    public V put(K key, V value) {\n        return putVal(key, value, false);\n    }\n\n    /** Implementation for put and putIfAbsent */\n    final V putVal(K key, V value, boolean onlyIfAbsent) {\n        if (key == null || value == null) throw new NullPointerException();\n        int hash = spread(key.hashCode());\n        int binCount = 0;\n        for (Node<K,V>[] tab = table;;) {\n            Node<K,V> f; int n, i, fh; K fk; V fv;\n            if (tab == null || (n = tab.length) == 0)\n                tab = initTable();\n            else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {\n                if (casTabAt(tab, i, null, new Node<K,V>(hash, key, value)))\n                    break;                   // no lock when adding to empty bin\n            }\n            else if ((fh = f.hash) == MOVED)\n                tab = helpTransfer(tab, f);\n            else if (onlyIfAbsent // check first node without acquiring lock\n                     && fh == hash\n                     && ((fk = f.key) == key || (fk != null && key.equals(fk)))\n                     && (fv = f.val) != null)\n                return fv;\n            else {\n                V oldVal = null;\n                synchronized (f) {\n                    if (tabAt(tab, i) == f) {\n                        if (fh >= 0) {\n                            binCount = 1;\n                            for (Node<K,V> e = f;; ++binCount) {\n                                K ek;\n                                if (e.hash == hash &&\n                                    ((ek = e.key) == key ||\n                                     (ek != null && key.equals(ek)))) {\n                                    oldVal = e.val;\n                                    if (!onlyIfAbsent)\n                                        e.val = value;\n                                    break;\n                                }\n                                Node<K,V> pred = e;\n                                if ((e = e.next) == null) {\n                                    pred.next = new Node<K,V>(hash, key, value);\n                                    break;\n                                }\n                            }\n                        }\n                        else if (f instanceof TreeBin) {\n                            Node<K,V> p;\n                            binCount = 2;\n                            if ((p = ((TreeBin<K,V>)f).putTreeVal(hash, key,\n                                                           value)) != null) {\n                                oldVal = p.val;\n                                if (!onlyIfAbsent)\n                                    p.val = value;\n                            }\n                        }\n                        else if (f instanceof ReservationNode)\n                            throw new IllegalStateException(\"Recursive update\");\n                    }\n                }\n                if (binCount != 0) {\n                    if (binCount >= TREEIFY_THRESHOLD)\n                        treeifyBin(tab, i);\n                    if (oldVal != null)\n                        return oldVal;\n                    break;\n                }\n            }\n        }\n        addCount(1L, binCount);\n        return null;\n    }\n\n    private final void addCount(long x, int check) {\n        CounterCell[] cs; long b, s;\n        if ((cs = counterCells) != null ||\n            !U.compareAndSetLong(this, BASECOUNT, b = baseCount, s = b + x)) {\n            CounterCell c; long v; int m;\n            boolean uncontended = true;\n            if (cs == null || (m = cs.length - 1) < 0 ||\n                (c = cs[ThreadLocalRandom.getProbe() & m]) == null ||\n                !(uncontended =\n                  U.compareAndSetLong(c, CELLVALUE, v = c.value, v + x))) {\n                fullAddCount(x, uncontended);\n                return;\n            }\n            if (check <= 1)\n                return;\n            s = sumCount();\n        }\n        if (check >= 0) {\n            Node<K,V>[] tab, nt; int n, sc;\n            while (s >= (long)(sc = sizeCtl) && (tab = table) != null &&\n                   (n = tab.length) < MAXIMUM_CAPACITY) {\n                int rs = resizeStamp(n) << RESIZE_STAMP_SHIFT;\n                if (sc < 0) {\n                    if (sc == rs + MAX_RESIZERS || sc == rs + 1 ||\n                        (nt = nextTable) == null || transferIndex <= 0)\n                        break;\n                    if (U.compareAndSetInt(this, SIZECTL, sc, sc + 1))\n                        transfer(tab, nt);\n                }\n                else if (U.compareAndSetInt(this, SIZECTL, sc, rs + 2))\n                    transfer(tab, null);\n                s = sumCount();\n            }\n        }\n    }\n\n",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "    public V put(K key, V value) {\n        return putVal(key, value, false);\n    }\n\n    /** Implementation for put and putIfAbsent */\n    final V putVal(K key, V value, boolean onlyIfAbsent) {\n        if (key == null || value == null) throw new NullPointerException();\n        int hash = spread(key.hashCode());\n        int binCount = 0;\n        for (Node<K,V>[] tab = table;;) {\n            Node<K,V> f; int n, i, fh; K fk; V fv;\n            if (tab == null || (n = tab.length) == 0)\n                tab = initTable();\n            else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {\n                if (casTabAt(tab, i, null, new Node<K,V>(hash, key, value)))\n                    break;                   // no lock when adding to empty bin\n            }\n            else if ((fh = f.hash) == MOVED)\n                tab = helpTransfer(tab, f);\n            else if (onlyIfAbsent // check first node without acquiring lock\n                     && fh == hash\n                     && ((fk = f.key) == key || (fk != null && key.equals(fk)))\n                     && (fv = f.val) != null)\n                return fv;\n            else {\n                V oldVal = null;\n                synchronized (f) {\n                    if (tabAt(tab, i) == f) {\n                        if (fh >= 0) {\n                            binCount = 1;\n                            for (Node<K,V> e = f;; ++binCount) {\n                                K ek;\n                                if (e.hash == hash &&\n                                    ((ek = e.key) == key ||\n                                     (ek != null && key.equals(ek)))) {\n                                    oldVal = e.val;\n                                    if (!onlyIfAbsent)\n                                        e.val = value;\n                                    break;\n                                }\n                                Node<K,V> pred = e;\n                                if ((e = e.next) == null) {\n                                    pred.next = new Node<K,V>(hash, key, value);\n                                    break;\n                                }\n                            }\n                        }\n                        else if (f instanceof TreeBin) {\n                            Node<K,V> p;\n                            binCount = 2;\n                            if ((p = ((TreeBin<K,V>)f).putTreeVal(hash, key,\n                                                           value)) != null) {\n                                oldVal = p.val;\n                                if (!onlyIfAbsent)\n                                    p.val = value;\n                            }\n                        }\n                        else if (f instanceof ReservationNode)\n                            throw new IllegalStateException(\"Recursive update\");\n                    }\n                }\n                if (binCount != 0) {\n                    if (binCount >= TREEIFY_THRESHOLD)\n                        treeifyBin(tab, i);\n                    if (oldVal != null)\n                        return oldVal;\n                    break;\n                }\n            }\n        }\n        addCount(1L, binCount);\n        return null;\n    }\n\n    private final void addCount(long x, int check) {\n        CounterCell[] cs; long b, s;\n        if ((cs = counterCells) != null ||\n            !U.compareAndSetLong(this, BASECOUNT, b = baseCount, s = b + x)) {\n            CounterCell c; long v; int m;\n            boolean uncontended = true;\n            if (cs == null || (m = cs.length - 1) < 0 ||\n                (c = cs[ThreadLocalRandom.getProbe() & m]) == null ||\n                !(uncontended =\n                  U.compareAndSetLong(c, CELLVALUE, v = c.value, v + x))) {\n                fullAddCount(x, uncontended);\n                return;\n            }\n            if (check <= 1)\n                return;\n            s = sumCount();\n        }\n        if (check >= 0) {\n            Node<K,V>[] tab, nt; int n, sc;\n            while (s >= (long)(sc = sizeCtl) && (tab = table) != null &&\n                   (n = tab.length) < MAXIMUM_CAPACITY) {\n                int rs = resizeStamp(n) << RESIZE_STAMP_SHIFT;\n                if (sc < 0) {\n                    if (sc == rs + MAX_RESIZERS || sc == rs + 1 ||\n                        (nt = nextTable) == null || transferIndex <= 0)\n                        break;\n                    if (U.compareAndSetInt(this, SIZECTL, sc, sc + 1))\n                        transfer(tab, nt);\n                }\n                else if (U.compareAndSetInt(this, SIZECTL, sc, rs + 2))\n                    transfer(tab, null);\n                s = sumCount();\n            }\n        }\n    }\n\n",
			"lineHeight": 1.2,
			"baseline": 2660
		},
		{
			"type": "rectangle",
			"version": 170,
			"versionNonce": 323551819,
			"isDeleted": false,
			"id": "JC5UXtxz0YMpHtR7lqHoF",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 280.2745853392924,
			"y": -108.97579058800989,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 83.89960819927865,
			"height": 29.2,
			"seed": 1771378383,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "W32HTwT1"
				}
			],
			"updated": 1711773705313,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 181,
			"versionNonce": 1668766693,
			"isDeleted": false,
			"id": "W32HTwT1",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 287.4743894389317,
			"y": -103.97579058800989,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 69.5,
			"height": 19.2,
			"seed": 1038731759,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1711773705313,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "获取hash",
			"rawText": "获取hash",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "JC5UXtxz0YMpHtR7lqHoF",
			"originalText": "获取hash",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "rectangle",
			"version": 344,
			"versionNonce": 925401323,
			"isDeleted": false,
			"id": "HuJqqbK8ptBKIGSfJAeFB",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 170.9859725675368,
			"y": 13.592215402067438,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 192.43978196459506,
			"height": 29.2,
			"seed": 1330125665,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "HTHJGQWf"
				}
			],
			"updated": 1711773705313,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 330,
			"versionNonce": 239900485,
			"isDeleted": false,
			"id": "HTHJGQWf",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 179.20586354983433,
			"y": 18.59221540206744,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 176,
			"height": 19.2,
			"seed": 950799759,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1711773705313,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "数组未初始化，先初始化",
			"rawText": "数组未初始化，先初始化",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "HuJqqbK8ptBKIGSfJAeFB",
			"originalText": "数组未初始化，先初始化",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "rectangle",
			"version": 217,
			"versionNonce": 1004481419,
			"isDeleted": false,
			"id": "yiaSXNjAFQSEiHjVvrbbF",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -210.77706697950453,
			"y": 61.157155470694875,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 162.94276551412872,
			"height": 68,
			"seed": 1214283855,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "KzgloNBK"
				}
			],
			"updated": 1711773705313,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 171,
			"versionNonce": 1436772005,
			"isDeleted": false,
			"id": "KzgloNBK",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -204.05568422244016,
			"y": 66.35715547069488,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 149.5,
			"height": 57.599999999999994,
			"seed": 1984119183,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1711773705314,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "hash对应下标位置不\n存在数据，直接cas\n设置",
			"rawText": "hash对应下标位置不存在数据，直接cas设置",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "yiaSXNjAFQSEiHjVvrbbF",
			"originalText": "hash对应下标位置不存在数据，直接cas设置",
			"lineHeight": 1.2,
			"baseline": 53
		},
		{
			"type": "rectangle",
			"version": 107,
			"versionNonce": 1437041195,
			"isDeleted": false,
			"id": "fq7-Z6VgTEbjVVaSJQcUA",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 312.8185111404315,
			"y": 136.75476472301705,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 140.70991032089012,
			"height": 49,
			"seed": 1702658081,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "shzX0Lxt"
				}
			],
			"updated": 1711773705314,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 40,
			"versionNonce": 1546209797,
			"isDeleted": false,
			"id": "shzX0Lxt",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 323.04846630087656,
			"y": 142.05476472301706,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 120.25,
			"height": 38.4,
			"seed": 1130779457,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1711773705314,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "正在做rehash，\n帮助迁移",
			"rawText": "正在做rehash，帮助迁移",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "fq7-Z6VgTEbjVVaSJQcUA",
			"originalText": "正在做rehash，帮助迁移",
			"lineHeight": 1.2,
			"baseline": 34
		},
		{
			"type": "rectangle",
			"version": 319,
			"versionNonce": 1298924747,
			"isDeleted": false,
			"id": "w_HDEWu2YAZu-86Mve4Pr",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 320.1398616665085,
			"y": 254.83739656403634,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 335.2764689611084,
			"height": 29.2,
			"seed": 2054192815,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "URLgwNC8"
				}
			],
			"updated": 1711773705314,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 473,
			"versionNonce": 316391781,
			"isDeleted": false,
			"id": "URLgwNC8",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 335.7780961470627,
			"y": 259.83739656403634,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 304,
			"height": 19.2,
			"seed": 239524047,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1711773705314,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "只允许不存在时，当前节点存在，直接返回",
			"rawText": "只允许不存在时，当前节点存在，直接返回",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "w_HDEWu2YAZu-86Mve4Pr",
			"originalText": "只允许不存在时，当前节点存在，直接返回",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "rectangle",
			"version": 115,
			"versionNonce": 1791439723,
			"isDeleted": false,
			"id": "Z39o21F7AzP-ZxOqohyVo",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 185.75084095227123,
			"y": 343.852212499305,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 90.34696056260032,
			"height": 29.2,
			"seed": 1284295279,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "0AeifAXd"
				}
			],
			"updated": 1711773705314,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 70,
			"versionNonce": 1862814917,
			"isDeleted": false,
			"id": "0AeifAXd",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 190.9243212335714,
			"y": 348.852212499305,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 80,
			"height": 19.2,
			"seed": 725566127,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1711773705314,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "头节点加锁",
			"rawText": "头节点加锁",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "Z39o21F7AzP-ZxOqohyVo",
			"originalText": "头节点加锁",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "rectangle",
			"version": 780,
			"versionNonce": 503549451,
			"isDeleted": false,
			"id": "kxWqZsy3jxxrw6O_SwWSZ",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 303.6431595663863,
			"y": 375.8887577995962,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 368.79343455273573,
			"height": 29.2,
			"seed": 1656803585,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "16FCdxP0"
				}
			],
			"updated": 1711773705314,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 889,
			"versionNonce": 1615621157,
			"isDeleted": false,
			"id": "16FCdxP0",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 311.2273768427542,
			"y": 380.8887577995962,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 353.625,
			"height": 19.2,
			"seed": 635908993,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1711773705314,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "recheck头节点是否变化，防止其他线程并发修改",
			"rawText": "recheck头节点是否变化，防止其他线程并发修改",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "kxWqZsy3jxxrw6O_SwWSZ",
			"originalText": "recheck头节点是否变化，防止其他线程并发修改",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "rectangle",
			"version": 145,
			"versionNonce": 1780192427,
			"isDeleted": false,
			"id": "kMP55H0TyjSeiV1cy0bib",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 86.86644994405003,
			"y": 443.56352942196617,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 635.4925652468509,
			"height": 381.5300573046439,
			"seed": 159352399,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [],
			"updated": 1711773705314,
			"link": null,
			"locked": false
		},
		{
			"type": "rectangle",
			"version": 235,
			"versionNonce": 110468997,
			"isDeleted": false,
			"id": "aQMuY5rj9Z8dJIu4U16kV",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 455.3708433118117,
			"y": 580.6750825160207,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 188.44580708064734,
			"height": 68,
			"seed": 1448788911,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "gwUqg7RF"
				}
			],
			"updated": 1711773705314,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 262,
			"versionNonce": 247056203,
			"isDeleted": false,
			"id": "gwUqg7RF",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 461.5937468521354,
			"y": 585.8750825160207,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 176,
			"height": 57.599999999999994,
			"seed": 248650031,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1711773705314,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "遍历链表，找到就覆盖原\n值（如果允许），没找到\n就放末尾（尾插法）",
			"rawText": "遍历链表，找到就覆盖原值（如果允许），没找到就放末尾（尾插法）",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "aQMuY5rj9Z8dJIu4U16kV",
			"originalText": "遍历链表，找到就覆盖原值（如果允许），没找到就放末尾（尾插法）",
			"lineHeight": 1.2,
			"baseline": 53
		},
		{
			"type": "rectangle",
			"version": 46,
			"versionNonce": 673277669,
			"isDeleted": false,
			"id": "GhR7teOuyzsRnbOvu386V",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 526.6802409996707,
			"y": 477.87990101490504,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 108.30860640643846,
			"height": 49,
			"seed": 614736833,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"id": "9d0xOvpityzplCHdx1cos",
					"type": "arrow"
				},
				{
					"type": "text",
					"id": "CyilUEhl"
				}
			],
			"updated": 1711773705314,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 35,
			"versionNonce": 1916315115,
			"isDeleted": false,
			"id": "CyilUEhl",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 532.8345442028899,
			"y": 483.17990101490506,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 96,
			"height": 38.4,
			"seed": 1761329103,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1711773705314,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "元素在链表什\n么位置🤔",
			"rawText": "元素在链表什么位置🤔",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "GhR7teOuyzsRnbOvu386V",
			"originalText": "元素在链表什么位置🤔",
			"lineHeight": 1.2,
			"baseline": 34
		},
		{
			"type": "arrow",
			"version": 49,
			"versionNonce": 1736262213,
			"isDeleted": false,
			"id": "9d0xOvpityzplCHdx1cos",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 474.2775874904878,
			"y": 463.5224437361264,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 50.231850033876526,
			"height": 40.10676608258211,
			"seed": 489377473,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"boundElements": [],
			"updated": 1711773705314,
			"link": null,
			"locked": false,
			"startBinding": null,
			"endBinding": {
				"elementId": "GhR7teOuyzsRnbOvu386V",
				"gap": 2.170803475306343,
				"focus": -0.6823457263147499
			},
			"lastCommittedPoint": null,
			"startArrowhead": null,
			"endArrowhead": "triangle",
			"points": [
				[
					0,
					0
				],
				[
					50.231850033876526,
					40.10676608258211
				]
			]
		},
		{
			"type": "rectangle",
			"version": 30,
			"versionNonce": 1268953227,
			"isDeleted": false,
			"id": "F9h7KbmI8K1LepAFRNE3n",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 442.20368160163434,
			"y": 856.2318087302881,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 94.01719078947588,
			"height": 29.2,
			"seed": 773002177,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "Xd6ZclDY"
				}
			],
			"updated": 1711773705314,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 12,
			"versionNonce": 965128613,
			"isDeleted": false,
			"id": "Xd6ZclDY",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 465.2122769963723,
			"y": 861.2318087302881,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 48,
			"height": 19.2,
			"seed": 1488170081,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1711773705314,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "树节点",
			"rawText": "树节点",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "F9h7KbmI8K1LepAFRNE3n",
			"originalText": "树节点",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "rectangle",
			"version": 105,
			"versionNonce": 213018411,
			"isDeleted": false,
			"id": "HW_6O3kTTdhHJVI__0n-l",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 425.10957026854385,
			"y": 1215.5939283901166,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 155.365960219581,
			"height": 29.2,
			"seed": 1245681583,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "AIS6fC2i"
				}
			],
			"updated": 1711773705315,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 132,
			"versionNonce": 460010757,
			"isDeleted": false,
			"id": "AIS6fC2i",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 430.79255037833434,
			"y": 1220.5939283901166,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 144,
			"height": 19.2,
			"seed": 370245295,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1711773705315,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "到了树化阈值，转树",
			"rawText": "到了树化阈值，转树",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "HW_6O3kTTdhHJVI__0n-l",
			"originalText": "到了树化阈值，转树",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "rectangle",
			"version": 286,
			"versionNonce": 198330827,
			"isDeleted": false,
			"id": "5s6W11_I8tS0nkkdMJDdC",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 291.1776421625784,
			"y": 1537.2753455870939,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 308.6007419609453,
			"height": 29.2,
			"seed": 1362758735,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "GkZcVC8U"
				}
			],
			"updated": 1711773705315,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 206,
			"versionNonce": 145247333,
			"isDeleted": false,
			"id": "GkZcVC8U",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 304.54051314305104,
			"y": 1542.2753455870939,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 281.875,
			"height": 19.2,
			"seed": 1161995951,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1711773705315,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "计数数组不为空或cas baseCount失败",
			"rawText": "计数数组不为空或cas baseCount失败",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "5s6W11_I8tS0nkkdMJDdC",
			"originalText": "计数数组不为空或cas baseCount失败",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "rectangle",
			"version": 310,
			"versionNonce": 1847384171,
			"isDeleted": false,
			"id": "ATWKXGrVoh_osuKteCXw9",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 587.0746381594502,
			"y": 1657.7485099431328,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 133.92405931221845,
			"height": 29.2,
			"seed": 2027708065,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "sIGC2udc"
				}
			],
			"updated": 1711773705315,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 405,
			"versionNonce": 822835141,
			"isDeleted": false,
			"id": "sIGC2udc",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 593.9116678155594,
			"y": 1662.7485099431328,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 120.25,
			"height": 19.2,
			"seed": 1857065825,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1711773705315,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "cs对应下标null",
			"rawText": "cs对应下标null",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "ATWKXGrVoh_osuKteCXw9",
			"originalText": "cs对应下标null",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "rectangle",
			"version": 121,
			"versionNonce": 1365021451,
			"isDeleted": false,
			"id": "5MOg-21tGKKnLf8zOD5d2",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 438.86113042870625,
			"y": 1638.2165128183601,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 77.97454702099904,
			"height": 29.2,
			"seed": 169887695,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "gwKWmnOx"
				}
			],
			"updated": 1711773705315,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 205,
			"versionNonce": 1857173285,
			"isDeleted": false,
			"id": "gwKWmnOx",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 444.47340393920575,
			"y": 1643.2165128183601,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 66.75,
			"height": 19.2,
			"seed": 1387294287,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1711773705315,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "cs不存在",
			"rawText": "cs不存在",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "5MOg-21tGKKnLf8zOD5d2",
			"originalText": "cs不存在",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "rectangle",
			"version": 209,
			"versionNonce": 906754475,
			"isDeleted": false,
			"id": "GBDxiyecIuyA9Y-iPT_UD",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 143.75073277831405,
			"y": 1690.8132164019426,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 106.58323286295447,
			"height": 29.2,
			"seed": 1864355329,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "fyxyxulu"
				}
			],
			"updated": 1711773705315,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 258,
			"versionNonce": 2081032837,
			"isDeleted": false,
			"id": "fyxyxulu",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 155.66734920979127,
			"y": 1695.8132164019426,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 82.75,
			"height": 19.2,
			"seed": 1002356161,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1711773705315,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "cs自增失败",
			"rawText": "cs自增失败",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "GBDxiyecIuyA9Y-iPT_UD",
			"originalText": "cs自增失败",
			"lineHeight": 1.2,
			"baseline": 15
		}
	],
	"appState": {
		"theme": "light",
		"viewBackgroundColor": "#ffffff",
		"currentItemStrokeColor": "#2f9e44",
		"currentItemBackgroundColor": "transparent",
		"currentItemFillStyle": "solid",
		"currentItemStrokeWidth": 2,
		"currentItemStrokeStyle": "solid",
		"currentItemRoughness": 1,
		"currentItemOpacity": 100,
		"currentItemFontFamily": 3,
		"currentItemFontSize": 16,
		"currentItemTextAlign": "left",
		"currentItemStartArrowhead": null,
		"currentItemEndArrowhead": "triangle",
		"scrollX": 172.9572802058754,
		"scrollY": 153.7241864224179,
		"zoom": {
			"value": 0.8567947083711625
		},
		"currentItemRoundness": "round",
		"gridSize": null,
		"gridColor": {
			"Bold": "#C9C9C9FF",
			"Regular": "#EDEDEDFF"
		},
		"currentStrokeOptions": null,
		"previousGridSize": null,
		"frameRendering": {
			"enabled": true,
			"clip": true,
			"name": true,
			"outline": true
		}
	},
	"files": {}
}
```
%%