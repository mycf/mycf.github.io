---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠==


# Text Elements
    public ConcurrentHashMap() {
        this(DEFAULT_INITIAL_CAPACITY, DEFAULT_LOAD_FACTOR, DEFAULT_CONCURRENCY_LEVEL);
    }

    public ConcurrentHashMap(int initialCapacity,
                             float loadFactor, int concurrencyLevel) {
        if (!(loadFactor > 0) || initialCapacity < 0 || concurrencyLevel <= 0)
            throw new IllegalArgumentException();
        if (concurrencyLevel > MAX_SEGMENTS)
            concurrencyLevel = MAX_SEGMENTS;
        // Find power-of-two sizes best matching arguments
        int sshift = 0;
        int ssize = 1;
        while (ssize < concurrencyLevel) {
            ++sshift;
            ssize <<= 1;
        }
        this.segmentShift = 32 - sshift;
        this.segmentMask = ssize - 1;
        if (initialCapacity > MAXIMUM_CAPACITY)
            initialCapacity = MAXIMUM_CAPACITY;
        int c = initialCapacity / ssize;
        if (c * ssize < initialCapacity)
            ++c;
        int cap = MIN_SEGMENT_TABLE_CAPACITY;
        while (cap < c)
            cap <<= 1;
        // create segments and segments[0]
        Segment<K,V> s0 =
            new Segment<K,V>(loadFactor, (int)(cap * loadFactor),
                             (HashEntry<K,V>[])new HashEntry[cap]);
        Segment<K,V>[] ss = (Segment<K,V>[])new Segment[ssize];
        UNSAFE.putOrderedObject(ss, SBASE, s0); // ordered write of segments[0]
        this.segments = ss;
    }
 ^Dj7sTXPf

segment的长度 ^7sQfTwf4

找到大于等于并发级别2的次幂 ^8C6dpZ93

因为segment的下标
也是&hash得到的，所以需要2的次幂 ^URdbFWep

不能超过最大值 ^Rm4xsPJ2

假设初始cap为17，ssize为16，
每个segment里面要存放两个 ^zEDgNGbU

获取每个segment
存放的数量 ^SQ9SgDHc

这里为了往上取整等同于
Math.ceil(initialCapacity%ssize) ^H0iMCPFK

HashEntry数组的下标也要&hash获取下标，
所以也要2的次幂 ^gQhmCLq6

预初始化了0号segment
segment中保存了负载因子、阈值，
后面方便提供这些属性给其他位置需要初始化的segment使用
扩容是针对segment的部分扩容 ^QV4srs4m

ssize左移了多少位（乘了多少2） ^0YnyCfBv

hashcode右移的位数，方便与segment长度&获取下标
ssize-1=n个1，segmentShift=n
hashcode >> segmentShift = n位，再&就方便了 ^yBPewI0n

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
			"version": 54,
			"versionNonce": 1905593039,
			"isDeleted": false,
			"id": "Dj7sTXPf",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -319.6957702636719,
			"y": -325.3351165771484,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 815.625,
			"height": 691.1999999999999,
			"seed": 1908817551,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704625442894,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "    public ConcurrentHashMap() {\n        this(DEFAULT_INITIAL_CAPACITY, DEFAULT_LOAD_FACTOR, DEFAULT_CONCURRENCY_LEVEL);\n    }\n\n    public ConcurrentHashMap(int initialCapacity,\n                             float loadFactor, int concurrencyLevel) {\n        if (!(loadFactor > 0) || initialCapacity < 0 || concurrencyLevel <= 0)\n            throw new IllegalArgumentException();\n        if (concurrencyLevel > MAX_SEGMENTS)\n            concurrencyLevel = MAX_SEGMENTS;\n        // Find power-of-two sizes best matching arguments\n        int sshift = 0;\n        int ssize = 1;\n        while (ssize < concurrencyLevel) {\n            ++sshift;\n            ssize <<= 1;\n        }\n        this.segmentShift = 32 - sshift;\n        this.segmentMask = ssize - 1;\n        if (initialCapacity > MAXIMUM_CAPACITY)\n            initialCapacity = MAXIMUM_CAPACITY;\n        int c = initialCapacity / ssize;\n        if (c * ssize < initialCapacity)\n            ++c;\n        int cap = MIN_SEGMENT_TABLE_CAPACITY;\n        while (cap < c)\n            cap <<= 1;\n        // create segments and segments[0]\n        Segment<K,V> s0 =\n            new Segment<K,V>(loadFactor, (int)(cap * loadFactor),\n                             (HashEntry<K,V>[])new HashEntry[cap]);\n        Segment<K,V>[] ss = (Segment<K,V>[])new Segment[ssize];\n        UNSAFE.putOrderedObject(ss, SBASE, s0); // ordered write of segments[0]\n        this.segments = ss;\n    }\n",
			"rawText": "    public ConcurrentHashMap() {\n        this(DEFAULT_INITIAL_CAPACITY, DEFAULT_LOAD_FACTOR, DEFAULT_CONCURRENCY_LEVEL);\n    }\n\n    public ConcurrentHashMap(int initialCapacity,\n                             float loadFactor, int concurrencyLevel) {\n        if (!(loadFactor > 0) || initialCapacity < 0 || concurrencyLevel <= 0)\n            throw new IllegalArgumentException();\n        if (concurrencyLevel > MAX_SEGMENTS)\n            concurrencyLevel = MAX_SEGMENTS;\n        // Find power-of-two sizes best matching arguments\n        int sshift = 0;\n        int ssize = 1;\n        while (ssize < concurrencyLevel) {\n            ++sshift;\n            ssize <<= 1;\n        }\n        this.segmentShift = 32 - sshift;\n        this.segmentMask = ssize - 1;\n        if (initialCapacity > MAXIMUM_CAPACITY)\n            initialCapacity = MAXIMUM_CAPACITY;\n        int c = initialCapacity / ssize;\n        if (c * ssize < initialCapacity)\n            ++c;\n        int cap = MIN_SEGMENT_TABLE_CAPACITY;\n        while (cap < c)\n            cap <<= 1;\n        // create segments and segments[0]\n        Segment<K,V> s0 =\n            new Segment<K,V>(loadFactor, (int)(cap * loadFactor),\n                             (HashEntry<K,V>[])new HashEntry[cap]);\n        Segment<K,V>[] ss = (Segment<K,V>[])new Segment[ssize];\n        UNSAFE.putOrderedObject(ss, SBASE, s0); // ordered write of segments[0]\n        this.segments = ss;\n    }\n",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "    public ConcurrentHashMap() {\n        this(DEFAULT_INITIAL_CAPACITY, DEFAULT_LOAD_FACTOR, DEFAULT_CONCURRENCY_LEVEL);\n    }\n\n    public ConcurrentHashMap(int initialCapacity,\n                             float loadFactor, int concurrencyLevel) {\n        if (!(loadFactor > 0) || initialCapacity < 0 || concurrencyLevel <= 0)\n            throw new IllegalArgumentException();\n        if (concurrencyLevel > MAX_SEGMENTS)\n            concurrencyLevel = MAX_SEGMENTS;\n        // Find power-of-two sizes best matching arguments\n        int sshift = 0;\n        int ssize = 1;\n        while (ssize < concurrencyLevel) {\n            ++sshift;\n            ssize <<= 1;\n        }\n        this.segmentShift = 32 - sshift;\n        this.segmentMask = ssize - 1;\n        if (initialCapacity > MAXIMUM_CAPACITY)\n            initialCapacity = MAXIMUM_CAPACITY;\n        int c = initialCapacity / ssize;\n        if (c * ssize < initialCapacity)\n            ++c;\n        int cap = MIN_SEGMENT_TABLE_CAPACITY;\n        while (cap < c)\n            cap <<= 1;\n        // create segments and segments[0]\n        Segment<K,V> s0 =\n            new Segment<K,V>(loadFactor, (int)(cap * loadFactor),\n                             (HashEntry<K,V>[])new HashEntry[cap]);\n        Segment<K,V>[] ss = (Segment<K,V>[])new Segment[ssize];\n        UNSAFE.putOrderedObject(ss, SBASE, s0); // ordered write of segments[0]\n        this.segments = ss;\n    }\n",
			"lineHeight": 1.2,
			"baseline": 687
		},
		{
			"type": "arrow",
			"version": 211,
			"versionNonce": 1714490785,
			"isDeleted": false,
			"id": "WkJUqlEh363c346WeP1jG",
			"fillStyle": "solid",
			"strokeWidth": 1,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 255.54451751708984,
			"y": 281.4114017486572,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 347.4748229980469,
			"height": 306.6098403930664,
			"seed": 1070260961,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"boundElements": [],
			"updated": 1704625442894,
			"link": null,
			"locked": false,
			"startBinding": null,
			"endBinding": null,
			"lastCommittedPoint": null,
			"startArrowhead": null,
			"endArrowhead": "triangle",
			"points": [
				[
					0,
					0
				],
				[
					-33.336029052734375,
					-250.0777816772461
				],
				[
					-347.4748229980469,
					-306.6098403930664
				]
			]
		},
		{
			"type": "arrow",
			"version": 142,
			"versionNonce": 459856111,
			"isDeleted": false,
			"id": "G7kV5THU_PKLlNNf_l2Dx",
			"fillStyle": "solid",
			"strokeWidth": 1,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -96.43309783935547,
			"y": -30.640581130981445,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 40.81840515136719,
			"height": 55.02246856689453,
			"seed": 1229959425,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"boundElements": [],
			"updated": 1704625442894,
			"link": null,
			"locked": false,
			"startBinding": null,
			"endBinding": null,
			"lastCommittedPoint": null,
			"startArrowhead": null,
			"endArrowhead": "triangle",
			"points": [
				[
					0,
					0
				],
				[
					20.584793090820312,
					-49.40591812133789
				],
				[
					-20.233612060546875,
					-55.02246856689453
				]
			]
		},
		{
			"type": "text",
			"version": 114,
			"versionNonce": 1840306529,
			"isDeleted": false,
			"id": "7sQfTwf4",
			"fillStyle": "solid",
			"strokeWidth": 1,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -73.25606536865234,
			"y": -93.44522285461426,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 113.625,
			"height": 19.2,
			"seed": 1996549857,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704625442894,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "segment的长度",
			"rawText": "segment的长度",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "segment的长度",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "rectangle",
			"version": 114,
			"versionNonce": 627878191,
			"isDeleted": false,
			"id": "77qSwD1KpMjvoh2BVT6yz",
			"fillStyle": "solid",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 92.63809967041016,
			"y": 272.31540870666504,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 183.14476013183594,
			"height": 16.890792846679688,
			"seed": 1786801103,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [],
			"updated": 1704625442894,
			"link": null,
			"locked": false
		},
		{
			"type": "arrow",
			"version": 199,
			"versionNonce": 1551748591,
			"isDeleted": false,
			"id": "AyUoC2fyVcmNDSOkaVEBz",
			"fillStyle": "solid",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 80.86006927490234,
			"y": -85.11447715759277,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 1.102294921875,
			"height": 75.28579711914062,
			"seed": 152802017,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"boundElements": [],
			"updated": 1704632250408,
			"link": null,
			"locked": false,
			"startBinding": null,
			"endBinding": {
				"elementId": "8C6dpZ93",
				"focus": 0.5962953345257678,
				"gap": 14.581790065337053
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
					1.102294921875,
					75.28579711914062
				]
			]
		},
		{
			"type": "text",
			"version": 317,
			"versionNonce": 780941327,
			"isDeleted": false,
			"id": "8C6dpZ93",
			"fillStyle": "solid",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -43.98221683509951,
			"y": -38.317215251494304,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 157.32498168945312,
			"height": 13.906745147705102,
			"seed": 1104193263,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [
				{
					"id": "AyUoC2fyVcmNDSOkaVEBz",
					"type": "arrow"
				}
			],
			"updated": 1704632250408,
			"link": null,
			"locked": false,
			"fontSize": 11.588954289754252,
			"fontFamily": 3,
			"text": "找到大于等于并发级别2的次幂",
			"rawText": "找到大于等于并发级别2的次幂",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "找到大于等于并发级别2的次幂",
			"lineHeight": 1.2,
			"baseline": 11
		},
		{
			"type": "text",
			"version": 465,
			"versionNonce": 1851628833,
			"isDeleted": false,
			"id": "URdbFWep",
			"fillStyle": "solid",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 126.28614057618654,
			"y": -48.35911171763979,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 202.31640625,
			"height": 29.423111562214096,
			"seed": 294726529,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704632252127,
			"link": null,
			"locked": false,
			"fontSize": 12.259629817589207,
			"fontFamily": 3,
			"text": "因为segment的下标\n也是&hash得到的，所以需要2的次幂",
			"rawText": "因为segment的下标\n也是&hash得到的，所以需要2的次幂",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "因为segment的下标\n也是&hash得到的，所以需要2的次幂",
			"lineHeight": 1.2,
			"baseline": 27
		},
		{
			"type": "text",
			"version": 143,
			"versionNonce": 206530817,
			"isDeleted": false,
			"id": "Rm4xsPJ2",
			"fillStyle": "solid",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 123.0653073252621,
			"y": 40.36542846032813,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 88.82991027832031,
			"height": 15.233508064778256,
			"seed": 703359553,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704625442894,
			"link": null,
			"locked": false,
			"fontSize": 12.69459005398188,
			"fontFamily": 3,
			"text": "不能超过最大值",
			"rawText": "不能超过最大值",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "不能超过最大值",
			"lineHeight": 1.2,
			"baseline": 12
		},
		{
			"type": "text",
			"version": 709,
			"versionNonce": 2061279983,
			"isDeleted": false,
			"id": "zEDgNGbU",
			"fillStyle": "solid",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 175.97800008842972,
			"y": 91.40991236663308,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 145.051513671875,
			"height": 23.140531796997305,
			"seed": 766999727,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704625446640,
			"link": null,
			"locked": false,
			"fontSize": 9.641888248748877,
			"fontFamily": 3,
			"text": "假设初始cap为17，ssize为16，\n每个segment里面要存放两个",
			"rawText": "假设初始cap为17，ssize为16，\n每个segment里面要存放两个",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "假设初始cap为17，ssize为16，\n每个segment里面要存放两个",
			"lineHeight": 1.2,
			"baseline": 21
		},
		{
			"type": "text",
			"version": 353,
			"versionNonce": 1203231937,
			"isDeleted": false,
			"id": "SQ9SgDHc",
			"fillStyle": "solid",
			"strokeWidth": 1,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 58.45331307720335,
			"y": 76.83378683995659,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 79.07122802734375,
			"height": 23.431640582785715,
			"seed": 662441729,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704625442894,
			"link": null,
			"locked": false,
			"fontSize": 9.763183576160715,
			"fontFamily": 3,
			"text": "获取每个segment\n存放的数量",
			"rawText": "获取每个segment\n存放的数量",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "获取每个segment\n存放的数量",
			"lineHeight": 1.2,
			"baseline": 21
		},
		{
			"type": "text",
			"version": 256,
			"versionNonce": 366087119,
			"isDeleted": false,
			"id": "H0iMCPFK",
			"fillStyle": "solid",
			"strokeWidth": 1,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 59.60035836779468,
			"y": 103.60523789196299,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 186.37451171875,
			"height": 23.871949911925444,
			"seed": 1517687535,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704625442895,
			"link": null,
			"locked": false,
			"fontSize": 9.946645796635602,
			"fontFamily": 3,
			"text": "这里为了往上取整等同于\nMath.ceil(initialCapacity%ssize)",
			"rawText": "这里为了往上取整等同于\nMath.ceil(initialCapacity%ssize)",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "这里为了往上取整等同于\nMath.ceil(initialCapacity%ssize)",
			"lineHeight": 1.2,
			"baseline": 21
		},
		{
			"type": "text",
			"version": 242,
			"versionNonce": 1456235183,
			"isDeleted": false,
			"id": "gQhmCLq6",
			"fillStyle": "solid",
			"strokeWidth": 1,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -75.28224402800842,
			"y": 165.12623088502846,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 174.95892333984375,
			"height": 20.800313408706185,
			"seed": 44577647,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704625727020,
			"link": null,
			"locked": false,
			"fontSize": 8.666797253627577,
			"fontFamily": 3,
			"text": "HashEntry数组的下标也要&hash获取下标，\n所以也要2的次幂",
			"rawText": "HashEntry数组的下标也要&hash获取下标，\n所以也要2的次幂",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "HashEntry数组的下标也要&hash获取下标，\n所以也要2的次幂",
			"lineHeight": 1.2,
			"baseline": 18
		},
		{
			"type": "text",
			"version": 527,
			"versionNonce": 715556591,
			"isDeleted": false,
			"id": "QV4srs4m",
			"fillStyle": "solid",
			"strokeWidth": 1,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 278.24335398388143,
			"y": 196.5361001636488,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"width": 262.34295654296875,
			"height": 46.51937988158015,
			"seed": 64623407,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704626749118,
			"link": null,
			"locked": false,
			"fontSize": 9.691537475329199,
			"fontFamily": 3,
			"text": "预初始化了0号segment\nsegment中保存了负载因子、阈值，\n后面方便提供这些属性给其他位置需要初始化的segment使用\n扩容是针对segment的部分扩容",
			"rawText": "预初始化了0号segment\nsegment中保存了负载因子、阈值，\n后面方便提供这些属性给其他位置需要初始化的segment使用\n扩容是针对segment的部分扩容",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "预初始化了0号segment\nsegment中保存了负载因子、阈值，\n后面方便提供这些属性给其他位置需要初始化的segment使用\n扩容是针对segment的部分扩容",
			"lineHeight": 1.2,
			"baseline": 44
		},
		{
			"id": "0YnyCfBv",
			"type": "text",
			"x": 107.01848981059265,
			"y": -102.28002263738341,
			"width": 206.83898824710298,
			"height": 15.997214800984404,
			"angle": 0,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 1,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 454687791,
			"version": 203,
			"versionNonce": 847480591,
			"isDeleted": false,
			"boundElements": [
				{
					"id": "2KYKjTtvpI9V842Y-u__m",
					"type": "arrow"
				}
			],
			"updated": 1704632259426,
			"link": null,
			"locked": false,
			"text": "ssize左移了多少位（乘了多少2）",
			"rawText": "ssize左移了多少位（乘了多少2）",
			"fontSize": 13.331012334153666,
			"fontFamily": 3,
			"textAlign": "left",
			"verticalAlign": "top",
			"baseline": 13.000000000000004,
			"containerId": null,
			"originalText": "ssize左移了多少位（乘了多少2）",
			"lineHeight": 1.2
		},
		{
			"id": "2KYKjTtvpI9V842Y-u__m",
			"type": "arrow",
			"x": 111.62286205234852,
			"y": -84.96220987182465,
			"width": 242.1958436956865,
			"height": 39.74701342216326,
			"angle": 0,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 1,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"seed": 1755285729,
			"version": 92,
			"versionNonce": 687013103,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704632259426,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					-242.1958436956865,
					39.74701342216326
				]
			],
			"lastCommittedPoint": null,
			"startBinding": {
				"elementId": "0YnyCfBv",
				"focus": 0.27621955171934093,
				"gap": 1.3205979645743469
			},
			"endBinding": null,
			"startArrowhead": null,
			"endArrowhead": "triangle"
		},
		{
			"id": "yBPewI0n",
			"type": "text",
			"x": 204.90536598890827,
			"y": -12.170724833253018,
			"width": 298.4568905974294,
			"height": 44.080157973489946,
			"angle": 0,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 1,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 1308643617,
			"version": 473,
			"versionNonce": 1205124353,
			"isDeleted": false,
			"boundElements": [
				{
					"id": "X56tXqmYyazxL1I_bGR8m",
					"type": "arrow"
				}
			],
			"updated": 1704632539622,
			"link": null,
			"locked": false,
			"text": "hashcode右移的位数，方便与segment长度&获取下标\nssize-1=n个1，segmentShift=n\nhashcode >> segmentShift = n位，再&就方便了",
			"rawText": "hashcode右移的位数，方便与segment长度&获取下标\nssize-1=n个1，segmentShift=n\nhashcode >> segmentShift = n位，再&就方便了",
			"fontSize": 12.244488325969424,
			"fontFamily": 3,
			"textAlign": "left",
			"verticalAlign": "top",
			"baseline": 40.00000000000002,
			"containerId": null,
			"originalText": "hashcode右移的位数，方便与segment长度&获取下标\nssize-1=n个1，segmentShift=n\nhashcode >> segmentShift = n位，再&就方便了",
			"lineHeight": 1.2
		},
		{
			"id": "X56tXqmYyazxL1I_bGR8m",
			"type": "arrow",
			"x": 197.87398749384272,
			"y": 10.21375844855038,
			"width": 156.18967156661185,
			"height": 0.43906763980271535,
			"angle": 0,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 1,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"seed": 697727727,
			"version": 85,
			"versionNonce": 866158881,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704632539622,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					-156.18967156661185,
					0.43906763980271535
				]
			],
			"lastCommittedPoint": null,
			"startBinding": {
				"elementId": "yBPewI0n",
				"focus": 0.00422361238545186,
				"gap": 7.031378495065553
			},
			"endBinding": null,
			"startArrowhead": null,
			"endArrowhead": "triangle"
		}
	],
	"appState": {
		"theme": "light",
		"viewBackgroundColor": "#ffffff",
		"currentItemStrokeColor": "#2f9e44",
		"currentItemBackgroundColor": "transparent",
		"currentItemFillStyle": "solid",
		"currentItemStrokeWidth": 1,
		"currentItemStrokeStyle": "dashed",
		"currentItemRoughness": 1,
		"currentItemOpacity": 100,
		"currentItemFontFamily": 3,
		"currentItemFontSize": 20,
		"currentItemTextAlign": "left",
		"currentItemStartArrowhead": null,
		"currentItemEndArrowhead": "triangle",
		"scrollX": 235.34401081002247,
		"scrollY": 486.1374474776421,
		"zoom": {
			"value": 0.9500000000000001
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