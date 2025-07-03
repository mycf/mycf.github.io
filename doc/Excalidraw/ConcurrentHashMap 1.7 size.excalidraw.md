---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠==


# Text Elements
    public int size() {
        // Try a few times to get accurate count. On failure due to
        // continuous async changes in table, resort to locking.
        final Segment<K,V>[] segments = this.segments;
        int size;
        boolean overflow; // true if size overflows 32 bits
        long sum;         // sum of modCounts
        long last = 0L;   // previous sum
        int retries = -1; // first iteration isn't retry
        try {
            for (;;) {
                if (retries++ == RETRIES_BEFORE_LOCK) {
                    for (int j = 0; j < segments.length; ++j)
                        ensureSegment(j).lock(); // force creation
                }
                sum = 0L;
                size = 0;
                overflow = false;
                for (int j = 0; j < segments.length; ++j) {
                    Segment<K,V> seg = segmentAt(segments, j);
                    if (seg != null) {
                        sum += seg.modCount;
                        int c = seg.count;
                        if (c < 0 || (size += c) < 0)
                            overflow = true;
                    }
                }
                if (sum == last)
                    break;
                last = sum;
            }
        } finally {
            if (retries > RETRIES_BEFORE_LOCK) {
                for (int j = 0; j < segments.length; ++j)
                    segmentAt(segments, j).unlock();
            }
        }
        return overflow ? Integer.MAX_VALUE : size;
    }
 ^Ujh1zeGj

两次计算不相等 ^USIJo2qS

两次计算相等 ^OBGayJ9L

否则 ^qh4mCfJS

每个Segment加锁强行计算 ^5F8I7owz

计算segment数量之和 ^iTmDTe7P

解锁 ^MVOWGcNB

%%
# Drawing
```json
{
	"type": "excalidraw",
	"version": 2,
	"source": "https://github.com/zsviczian/obsidian-excalidraw-plugin/releases/tag/2.0.13",
	"elements": [
		{
			"id": "Ujh1zeGj",
			"type": "text",
			"x": 180.75,
			"y": -247.390625,
			"width": 785.15625,
			"height": 960,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 1887793656,
			"version": 9,
			"versionNonce": 768439432,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1709096955545,
			"link": null,
			"locked": false,
			"text": "    public int size() {\n        // Try a few times to get accurate count. On failure due to\n        // continuous async changes in table, resort to locking.\n        final Segment<K,V>[] segments = this.segments;\n        int size;\n        boolean overflow; // true if size overflows 32 bits\n        long sum;         // sum of modCounts\n        long last = 0L;   // previous sum\n        int retries = -1; // first iteration isn't retry\n        try {\n            for (;;) {\n                if (retries++ == RETRIES_BEFORE_LOCK) {\n                    for (int j = 0; j < segments.length; ++j)\n                        ensureSegment(j).lock(); // force creation\n                }\n                sum = 0L;\n                size = 0;\n                overflow = false;\n                for (int j = 0; j < segments.length; ++j) {\n                    Segment<K,V> seg = segmentAt(segments, j);\n                    if (seg != null) {\n                        sum += seg.modCount;\n                        int c = seg.count;\n                        if (c < 0 || (size += c) < 0)\n                            overflow = true;\n                    }\n                }\n                if (sum == last)\n                    break;\n                last = sum;\n            }\n        } finally {\n            if (retries > RETRIES_BEFORE_LOCK) {\n                for (int j = 0; j < segments.length; ++j)\n                    segmentAt(segments, j).unlock();\n            }\n        }\n        return overflow ? Integer.MAX_VALUE : size;\n    }\n",
			"rawText": "    public int size() {\n        // Try a few times to get accurate count. On failure due to\n        // continuous async changes in table, resort to locking.\n        final Segment<K,V>[] segments = this.segments;\n        int size;\n        boolean overflow; // true if size overflows 32 bits\n        long sum;         // sum of modCounts\n        long last = 0L;   // previous sum\n        int retries = -1; // first iteration isn't retry\n        try {\n            for (;;) {\n                if (retries++ == RETRIES_BEFORE_LOCK) {\n                    for (int j = 0; j < segments.length; ++j)\n                        ensureSegment(j).lock(); // force creation\n                }\n                sum = 0L;\n                size = 0;\n                overflow = false;\n                for (int j = 0; j < segments.length; ++j) {\n                    Segment<K,V> seg = segmentAt(segments, j);\n                    if (seg != null) {\n                        sum += seg.modCount;\n                        int c = seg.count;\n                        if (c < 0 || (size += c) < 0)\n                            overflow = true;\n                    }\n                }\n                if (sum == last)\n                    break;\n                last = sum;\n            }\n        } finally {\n            if (retries > RETRIES_BEFORE_LOCK) {\n                for (int j = 0; j < segments.length; ++j)\n                    segmentAt(segments, j).unlock();\n            }\n        }\n        return overflow ? Integer.MAX_VALUE : size;\n    }\n",
			"fontSize": 20,
			"fontFamily": 3,
			"textAlign": "left",
			"verticalAlign": "top",
			"baseline": 956,
			"containerId": null,
			"originalText": "    public int size() {\n        // Try a few times to get accurate count. On failure due to\n        // continuous async changes in table, resort to locking.\n        final Segment<K,V>[] segments = this.segments;\n        int size;\n        boolean overflow; // true if size overflows 32 bits\n        long sum;         // sum of modCounts\n        long last = 0L;   // previous sum\n        int retries = -1; // first iteration isn't retry\n        try {\n            for (;;) {\n                if (retries++ == RETRIES_BEFORE_LOCK) {\n                    for (int j = 0; j < segments.length; ++j)\n                        ensureSegment(j).lock(); // force creation\n                }\n                sum = 0L;\n                size = 0;\n                overflow = false;\n                for (int j = 0; j < segments.length; ++j) {\n                    Segment<K,V> seg = segmentAt(segments, j);\n                    if (seg != null) {\n                        sum += seg.modCount;\n                        int c = seg.count;\n                        if (c < 0 || (size += c) < 0)\n                            overflow = true;\n                    }\n                }\n                if (sum == last)\n                    break;\n                last = sum;\n            }\n        } finally {\n            if (retries > RETRIES_BEFORE_LOCK) {\n                for (int j = 0; j < segments.length; ++j)\n                    segmentAt(segments, j).unlock();\n            }\n        }\n        return overflow ? Integer.MAX_VALUE : size;\n    }\n",
			"lineHeight": 1.2
		},
		{
			"id": "Kq3VAGmBLEIdJPAGIclT1",
			"type": "arrow",
			"x": 951.0803741544664,
			"y": 30.495691664503227,
			"width": 251.8837890625001,
			"height": 506.67838060112234,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"seed": 1511665288,
			"version": 730,
			"versionNonce": 1870442376,
			"isDeleted": false,
			"boundElements": [],
			"updated": 1709097070393,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					46.71796568928369,
					47.18261237195503
				],
				[
					-25.609833789883055,
					440.3456983094556
				],
				[
					-205.16582337321643,
					506.67838060112234
				]
			],
			"lastCommittedPoint": null,
			"startBinding": {
				"elementId": "USIJo2qS",
				"focus": -0.955328961811935,
				"gap": 8.762351525156305
			},
			"endBinding": null,
			"startArrowhead": null,
			"endArrowhead": "arrow"
		},
		{
			"id": "USIJo2qS",
			"type": "text",
			"x": 830.3180226293101,
			"y": 18.690891450026974,
			"width": 112,
			"height": 19.2,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 651325688,
			"version": 317,
			"versionNonce": 1082132728,
			"isDeleted": false,
			"boundElements": [
				{
					"id": "Kq3VAGmBLEIdJPAGIclT1",
					"type": "arrow"
				},
				{
					"id": "T5zq1uI241XI2AHqQYVCS",
					"type": "arrow"
				}
			],
			"updated": 1709097064300,
			"link": null,
			"locked": false,
			"text": "两次计算不相等",
			"rawText": "两次计算不相等",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "left",
			"verticalAlign": "top",
			"baseline": 15,
			"containerId": null,
			"originalText": "两次计算不相等",
			"lineHeight": 1.2
		},
		{
			"id": "OBGayJ9L",
			"type": "text",
			"x": 487.05290836027314,
			"y": 424.8181427352732,
			"width": 96,
			"height": 19.2,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 2130721784,
			"version": 198,
			"versionNonce": 46721160,
			"isDeleted": false,
			"boundElements": [],
			"updated": 1709097082382,
			"link": null,
			"locked": false,
			"text": "两次计算相等",
			"rawText": "两次计算相等",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "left",
			"verticalAlign": "top",
			"baseline": 15,
			"containerId": null,
			"originalText": "两次计算相等",
			"lineHeight": 1.2
		},
		{
			"id": "T5zq1uI241XI2AHqQYVCS",
			"type": "arrow",
			"x": 612.9837295707615,
			"y": 436.37163652346027,
			"width": 325.70659411999645,
			"height": 395.97457126214545,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"seed": 1412072952,
			"version": 494,
			"versionNonce": 602351096,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "qh4mCfJS"
				}
			],
			"updated": 1709097082670,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					182.69520025143675,
					-86.19123203576254
				],
				[
					316.4044259608477,
					-220.73007986038533
				],
				[
					325.70659411999645,
					-395.97457126214545
				]
			],
			"lastCommittedPoint": null,
			"startBinding": null,
			"endBinding": {
				"elementId": "USIJo2qS",
				"focus": -0.938157944120933,
				"gap": 2.5061738112878515
			},
			"startArrowhead": null,
			"endArrowhead": "arrow"
		},
		{
			"id": "qh4mCfJS",
			"type": "text",
			"x": 851.0380806656588,
			"y": 278.32714348053526,
			"width": 40,
			"height": 24,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 120502920,
			"version": 17,
			"versionNonce": 1370134408,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1709097082405,
			"link": null,
			"locked": false,
			"text": "否则",
			"rawText": "否则",
			"fontSize": 20,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 20,
			"containerId": "T5zq1uI241XI2AHqQYVCS",
			"originalText": "否则",
			"lineHeight": 1.2
		},
		{
			"id": "5F8I7owz",
			"type": "text",
			"x": 259.0920718839798,
			"y": 68.97572484509726,
			"width": 193.625,
			"height": 19.2,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 957106424,
			"version": 129,
			"versionNonce": 20504200,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1709097111119,
			"link": null,
			"locked": false,
			"text": "每个Segment加锁强行计算",
			"rawText": "每个Segment加锁强行计算",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "left",
			"verticalAlign": "top",
			"baseline": 15,
			"containerId": null,
			"originalText": "每个Segment加锁强行计算",
			"lineHeight": 1.2
		},
		{
			"id": "S5P_f4pvzeAqzpCEVhWiZ",
			"type": "arrow",
			"x": 688.2152422323994,
			"y": 126.02586761359291,
			"width": 5.987988606488057,
			"height": 451.9027805401533,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 0,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"seed": 2101828488,
			"version": 173,
			"versionNonce": 1645478136,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1709097146982,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					0.49097926766868477,
					-0.5238629974959599
				],
				[
					5.987988606488057,
					451.37891754265735
				]
			],
			"lastCommittedPoint": [
				10.467599452226978,
				486.97180035470546
			],
			"startBinding": null,
			"endBinding": null,
			"startArrowhead": null,
			"endArrowhead": "arrow"
		},
		{
			"id": "wYt4C4kFRjVfT9VSqzyC6",
			"type": "rectangle",
			"x": 330.8355305989583,
			"y": 194.26280054552822,
			"width": 30,
			"height": 202,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 0,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"seed": 71047560,
			"version": 283,
			"versionNonce": 162308856,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "iTmDTe7P"
				}
			],
			"updated": 1709097220075,
			"link": null,
			"locked": false
		},
		{
			"id": "iTmDTe7P",
			"type": "text",
			"x": 336.4605305989583,
			"y": 199.26280054552822,
			"width": 18.75,
			"height": 192,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 0,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 1017889160,
			"version": 356,
			"versionNonce": 990741496,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1709097220075,
			"link": null,
			"locked": false,
			"text": "计\n算\nse\ngm\nen\nt\n数\n量\n之\n和",
			"rawText": "计算segment数量之和",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 188,
			"containerId": "wYt4C4kFRjVfT9VSqzyC6",
			"originalText": "计算segment数量之和",
			"lineHeight": 1.2
		},
		{
			"id": "MVOWGcNB",
			"type": "text",
			"x": 792.7996138649428,
			"y": 574.8268565912359,
			"width": 32,
			"height": 19.2,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 0,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 1497630968,
			"version": 57,
			"versionNonce": 474072056,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1709097247551,
			"link": null,
			"locked": false,
			"text": "解锁",
			"rawText": "解锁",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "left",
			"verticalAlign": "top",
			"baseline": 15,
			"containerId": null,
			"originalText": "解锁",
			"lineHeight": 1.2
		},
		{
			"id": "QOSpgp5iH-_CSiWbpUaGb",
			"type": "rectangle",
			"x": 823.86328125,
			"y": 29.001749674479186,
			"width": 132.65885416666663,
			"height": 129.16951497395837,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"seed": 1959396232,
			"version": 51,
			"versionNonce": 2002253816,
			"isDeleted": true,
			"boundElements": null,
			"updated": 1709096955545,
			"link": null,
			"locked": false
		},
		{
			"id": "UFC5m70u",
			"type": "text",
			"x": 1028.1536458333335,
			"y": 93.79703776041663,
			"width": 11.71875,
			"height": 24,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 755554808,
			"version": 6,
			"versionNonce": 1652963576,
			"isDeleted": true,
			"boundElements": null,
			"updated": 1709096955545,
			"link": null,
			"locked": false,
			"text": "",
			"rawText": "",
			"fontSize": 20,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 20,
			"containerId": "Kq3VAGmBLEIdJPAGIclT1",
			"originalText": "",
			"lineHeight": 1.2
		},
		{
			"id": "7Hh0d3Tf",
			"type": "text",
			"x": 615.1216437679598,
			"y": 421.7896910919542,
			"width": 160,
			"height": 24,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 276020104,
			"version": 15,
			"versionNonce": 1467066248,
			"isDeleted": true,
			"boundElements": null,
			"updated": 1709096951522,
			"link": null,
			"locked": false,
			"text": "刚一开始不加锁，",
			"rawText": "刚一开始不加锁，",
			"fontSize": 20,
			"fontFamily": 3,
			"textAlign": "left",
			"verticalAlign": "top",
			"baseline": 20,
			"containerId": null,
			"originalText": "刚一开始不加锁，",
			"lineHeight": 1.2
		},
		{
			"id": "BkOnCVfu",
			"type": "text",
			"x": 1026.6158966415228,
			"y": -64.41720545976986,
			"width": 160,
			"height": 24,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 960718216,
			"version": 2,
			"versionNonce": 809785848,
			"isDeleted": true,
			"boundElements": null,
			"updated": 1709096955545,
			"link": null,
			"locked": false,
			"text": "刚一开始不加锁，",
			"rawText": "刚一开始不加锁，",
			"fontSize": 20,
			"fontFamily": 3,
			"textAlign": "left",
			"verticalAlign": "top",
			"baseline": 20,
			"containerId": null,
			"originalText": "刚一开始不加锁，",
			"lineHeight": 1.2
		}
	],
	"appState": {
		"theme": "light",
		"viewBackgroundColor": "#ffffff",
		"currentItemStrokeColor": "#e03131",
		"currentItemBackgroundColor": "transparent",
		"currentItemFillStyle": "solid",
		"currentItemStrokeWidth": 2,
		"currentItemStrokeStyle": "dashed",
		"currentItemRoughness": 0,
		"currentItemOpacity": 100,
		"currentItemFontFamily": 3,
		"currentItemFontSize": 16,
		"currentItemTextAlign": "left",
		"currentItemStartArrowhead": null,
		"currentItemEndArrowhead": "arrow",
		"scrollX": -155.35152882543113,
		"scrollY": 104.89852729885027,
		"zoom": {
			"value": 0.8700000000000001
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