---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠==


# Text Elements
        private void rehash(HashEntry<K,V> node) {
            HashEntry<K,V>[] oldTable = table;
            int oldCapacity = oldTable.length;
            int newCapacity = oldCapacity << 1;
            threshold = (int)(newCapacity * loadFactor);
            HashEntry<K,V>[] newTable =
                (HashEntry<K,V>[]) new HashEntry[newCapacity];
            int sizeMask = newCapacity - 1;
            for (int i = 0; i < oldCapacity ; i++) {
                HashEntry<K,V> e = oldTable[i];
                if (e != null) {
                    HashEntry<K,V> next = e.next;
                    int idx = e.hash & sizeMask;
                    if (next == null)   //  Single node on list
                        newTable[idx] = e;
                    else { // Reuse consecutive sequence at same slot
                        HashEntry<K,V> lastRun = e;
                        int lastIdx = idx;
                        for (HashEntry<K,V> last = next;
                             last != null;
                             last = last.next) {
                            int k = last.hash & sizeMask;
                            if (k != lastIdx) {
                                lastIdx = k;
                                lastRun = last;
                            }
                        }
                        newTable[lastIdx] = lastRun;
                        // Clone remaining nodes
                        for (HashEntry<K,V> p = e; p != lastRun; p = p.next) {
                            V v = p.value;
                            int h = p.hash;
                            int k = h & sizeMask;
                            HashEntry<K,V> n = newTable[k];
                            newTable[k] = new HashEntry<K,V>(h, p.key, v, n);
                        }
                    }
                }
            }
            int nodeIndex = node.hash & sizeMask; // add the new node
            node.setNext(newTable[nodeIndex]);
            newTable[nodeIndex] = node;
            table = newTable;
        }
 ^zbmDvqGP

找到最后的相同下标连续串
比如下标为：
1010111001 
lastRun=1
1010111000
lastRun=000
感觉没啥用 ^bhBTVWOX

把lastRun前面的数据重新处理一下 ^BwF3pwXh

101011100 ^Za69g85Z


1010111 ^Vqo0Pdc9

单个元素直接放入 ^64jnQ80z

新节点插入数组，不用扩容的数组会在前面代码插入 ^kjHjgkDp

新容量为2倍 ^x243VqKq

%%
# Drawing
```json
{
	"type": "excalidraw",
	"version": 2,
	"source": "https://github.com/zsviczian/obsidian-excalidraw-plugin/releases/tag/2.0.13",
	"elements": [
		{
			"id": "zbmDvqGP",
			"type": "text",
			"x": -166.8270263671875,
			"y": -310.13511657714844,
			"width": 914.0625,
			"height": 1080,
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
			"seed": 790045153,
			"version": 16,
			"versionNonce": 720520737,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704638823896,
			"link": null,
			"locked": false,
			"text": "        private void rehash(HashEntry<K,V> node) {\n            HashEntry<K,V>[] oldTable = table;\n            int oldCapacity = oldTable.length;\n            int newCapacity = oldCapacity << 1;\n            threshold = (int)(newCapacity * loadFactor);\n            HashEntry<K,V>[] newTable =\n                (HashEntry<K,V>[]) new HashEntry[newCapacity];\n            int sizeMask = newCapacity - 1;\n            for (int i = 0; i < oldCapacity ; i++) {\n                HashEntry<K,V> e = oldTable[i];\n                if (e != null) {\n                    HashEntry<K,V> next = e.next;\n                    int idx = e.hash & sizeMask;\n                    if (next == null)   //  Single node on list\n                        newTable[idx] = e;\n                    else { // Reuse consecutive sequence at same slot\n                        HashEntry<K,V> lastRun = e;\n                        int lastIdx = idx;\n                        for (HashEntry<K,V> last = next;\n                             last != null;\n                             last = last.next) {\n                            int k = last.hash & sizeMask;\n                            if (k != lastIdx) {\n                                lastIdx = k;\n                                lastRun = last;\n                            }\n                        }\n                        newTable[lastIdx] = lastRun;\n                        // Clone remaining nodes\n                        for (HashEntry<K,V> p = e; p != lastRun; p = p.next) {\n                            V v = p.value;\n                            int h = p.hash;\n                            int k = h & sizeMask;\n                            HashEntry<K,V> n = newTable[k];\n                            newTable[k] = new HashEntry<K,V>(h, p.key, v, n);\n                        }\n                    }\n                }\n            }\n            int nodeIndex = node.hash & sizeMask; // add the new node\n            node.setNext(newTable[nodeIndex]);\n            newTable[nodeIndex] = node;\n            table = newTable;\n        }\n",
			"rawText": "        private void rehash(HashEntry<K,V> node) {\n            HashEntry<K,V>[] oldTable = table;\n            int oldCapacity = oldTable.length;\n            int newCapacity = oldCapacity << 1;\n            threshold = (int)(newCapacity * loadFactor);\n            HashEntry<K,V>[] newTable =\n                (HashEntry<K,V>[]) new HashEntry[newCapacity];\n            int sizeMask = newCapacity - 1;\n            for (int i = 0; i < oldCapacity ; i++) {\n                HashEntry<K,V> e = oldTable[i];\n                if (e != null) {\n                    HashEntry<K,V> next = e.next;\n                    int idx = e.hash & sizeMask;\n                    if (next == null)   //  Single node on list\n                        newTable[idx] = e;\n                    else { // Reuse consecutive sequence at same slot\n                        HashEntry<K,V> lastRun = e;\n                        int lastIdx = idx;\n                        for (HashEntry<K,V> last = next;\n                             last != null;\n                             last = last.next) {\n                            int k = last.hash & sizeMask;\n                            if (k != lastIdx) {\n                                lastIdx = k;\n                                lastRun = last;\n                            }\n                        }\n                        newTable[lastIdx] = lastRun;\n                        // Clone remaining nodes\n                        for (HashEntry<K,V> p = e; p != lastRun; p = p.next) {\n                            V v = p.value;\n                            int h = p.hash;\n                            int k = h & sizeMask;\n                            HashEntry<K,V> n = newTable[k];\n                            newTable[k] = new HashEntry<K,V>(h, p.key, v, n);\n                        }\n                    }\n                }\n            }\n            int nodeIndex = node.hash & sizeMask; // add the new node\n            node.setNext(newTable[nodeIndex]);\n            newTable[nodeIndex] = node;\n            table = newTable;\n        }\n",
			"fontSize": 20,
			"fontFamily": 3,
			"textAlign": "left",
			"verticalAlign": "top",
			"baseline": 1075,
			"containerId": null,
			"originalText": "        private void rehash(HashEntry<K,V> node) {\n            HashEntry<K,V>[] oldTable = table;\n            int oldCapacity = oldTable.length;\n            int newCapacity = oldCapacity << 1;\n            threshold = (int)(newCapacity * loadFactor);\n            HashEntry<K,V>[] newTable =\n                (HashEntry<K,V>[]) new HashEntry[newCapacity];\n            int sizeMask = newCapacity - 1;\n            for (int i = 0; i < oldCapacity ; i++) {\n                HashEntry<K,V> e = oldTable[i];\n                if (e != null) {\n                    HashEntry<K,V> next = e.next;\n                    int idx = e.hash & sizeMask;\n                    if (next == null)   //  Single node on list\n                        newTable[idx] = e;\n                    else { // Reuse consecutive sequence at same slot\n                        HashEntry<K,V> lastRun = e;\n                        int lastIdx = idx;\n                        for (HashEntry<K,V> last = next;\n                             last != null;\n                             last = last.next) {\n                            int k = last.hash & sizeMask;\n                            if (k != lastIdx) {\n                                lastIdx = k;\n                                lastRun = last;\n                            }\n                        }\n                        newTable[lastIdx] = lastRun;\n                        // Clone remaining nodes\n                        for (HashEntry<K,V> p = e; p != lastRun; p = p.next) {\n                            V v = p.value;\n                            int h = p.hash;\n                            int k = h & sizeMask;\n                            HashEntry<K,V> n = newTable[k];\n                            newTable[k] = new HashEntry<K,V>(h, p.key, v, n);\n                        }\n                    }\n                }\n            }\n            int nodeIndex = node.hash & sizeMask; // add the new node\n            node.setNext(newTable[nodeIndex]);\n            newTable[nodeIndex] = node;\n            table = newTable;\n        }\n",
			"lineHeight": 1.2
		},
		{
			"id": "fUGIwPxAkUGib8aalf2Ye",
			"type": "rectangle",
			"x": 501.0886569552954,
			"y": 81.87892489963122,
			"width": 184.8095703125002,
			"height": 186.96854654947927,
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
			"roundness": {
				"type": 3
			},
			"seed": 57940367,
			"version": 110,
			"versionNonce": 1206311425,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "bhBTVWOX"
				}
			],
			"updated": 1704638823896,
			"link": null,
			"locked": false
		},
		{
			"id": "bhBTVWOX",
			"type": "text",
			"x": 506.0886569552954,
			"y": 98.56319817437085,
			"width": 160,
			"height": 153.6,
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
			"seed": 374269761,
			"version": 180,
			"versionNonce": 839680655,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704638823896,
			"link": null,
			"locked": false,
			"text": "找到最后的相同下标连\n续串\n比如下标为：\n1010111001 \nlastRun=1\n1010111000\nlastRun=000\n感觉没啥用",
			"rawText": "找到最后的相同下标连续串\n比如下标为：\n1010111001 \nlastRun=1\n1010111000\nlastRun=000\n感觉没啥用",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "left",
			"verticalAlign": "middle",
			"baseline": 149,
			"containerId": "fUGIwPxAkUGib8aalf2Ye",
			"originalText": "找到最后的相同下标连续串\n比如下标为：\n1010111001 \nlastRun=1\n1010111000\nlastRun=000\n感觉没啥用",
			"lineHeight": 1.2
		},
		{
			"id": "mDBqg4pMo_OavzXvPR4Fv",
			"type": "rectangle",
			"x": 533.8943752712678,
			"y": 415.17848544650633,
			"width": 148.09176974826389,
			"height": 49,
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
			"roundness": {
				"type": 3
			},
			"seed": 652676545,
			"version": 208,
			"versionNonce": 614505313,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "BwF3pwXh"
				},
				{
					"id": "994K_V6yKd6A74gh_o807",
					"type": "arrow"
				}
			],
			"updated": 1704638868501,
			"link": null,
			"locked": false
		},
		{
			"id": "BwF3pwXh",
			"type": "text",
			"x": 543.1277601453997,
			"y": 420.47848544650634,
			"width": 129.625,
			"height": 38.4,
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
			"seed": 1761264897,
			"version": 203,
			"versionNonce": 2086766913,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704638947579,
			"link": null,
			"locked": false,
			"text": "把lastRun前面的\n数据重新处理一下",
			"rawText": "把lastRun前面的数据重新处理一下",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 34,
			"containerId": "mDBqg4pMo_OavzXvPR4Fv",
			"originalText": "把lastRun前面的数据重新处理一下",
			"lineHeight": 1.2
		},
		{
			"id": "994K_V6yKd6A74gh_o807",
			"type": "arrow",
			"x": 598.5264010959206,
			"y": 165.87316724989176,
			"width": 95.9064398871526,
			"height": 246.94461398654516,
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
			"seed": 2118557135,
			"version": 197,
			"versionNonce": 225373441,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "Za69g85Z"
				}
			],
			"updated": 1704638948353,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					95.9064398871526,
					67.80527750651044
				],
				[
					18.655734592013687,
					246.94461398654516
				]
			],
			"lastCommittedPoint": null,
			"startBinding": null,
			"endBinding": {
				"elementId": "mDBqg4pMo_OavzXvPR4Fv",
				"gap": 2.360704210069457,
				"focus": -0.027671709849544875
			},
			"startArrowhead": null,
			"endArrowhead": "triangle"
		},
		{
			"id": "Za69g85Z",
			"type": "text",
			"x": 652.2453409830732,
			"y": 224.0784447564022,
			"width": 84.375,
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
			"seed": 66466863,
			"version": 10,
			"versionNonce": 869530881,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704638881588,
			"link": null,
			"locked": false,
			"text": "101011100",
			"rawText": "101011100",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 15,
			"containerId": "994K_V6yKd6A74gh_o807",
			"originalText": "101011100",
			"lineHeight": 1.2
		},
		{
			"id": "jFM2GteS14johKgaJA2-E",
			"type": "arrow",
			"x": 598.6243286132817,
			"y": 202.04772101508274,
			"width": 66.08398437499977,
			"height": 120.04835340711804,
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
			"seed": 248887247,
			"version": 97,
			"versionNonce": 1959297697,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "Vqo0Pdc9"
				}
			],
			"updated": 1704638912853,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					47.8656684027776,
					40.403103298611086
				],
				[
					66.08398437499977,
					120.04835340711804
				]
			],
			"lastCommittedPoint": null,
			"startBinding": null,
			"endBinding": null,
			"startArrowhead": null,
			"endArrowhead": "triangle"
		},
		{
			"id": "Vqo0Pdc9",
			"type": "text",
			"x": 613.6774970160593,
			"y": 223.25082431369384,
			"width": 65.625,
			"height": 38.4,
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
			"seed": 1599037775,
			"version": 12,
			"versionNonce": 158258593,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704638903500,
			"link": null,
			"locked": false,
			"text": "\n1010111",
			"rawText": "\n1010111",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 34,
			"containerId": "jFM2GteS14johKgaJA2-E",
			"originalText": "\n1010111",
			"lineHeight": 1.2
		},
		{
			"id": "QJ2UeRjz70qRdnXQXDMv4",
			"type": "rectangle",
			"x": 360.724073621962,
			"y": 24.152586195203924,
			"width": 139.43264431423614,
			"height": 29.2,
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
			"roundness": {
				"type": 3
			},
			"seed": 1173071073,
			"version": 148,
			"versionNonce": 212536623,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "64jnQ80z"
				}
			],
			"updated": 1704639133087,
			"link": null,
			"locked": false
		},
		{
			"id": "64jnQ80z",
			"type": "text",
			"x": 366.44039577908006,
			"y": 29.152586195203924,
			"width": 128,
			"height": 19.2,
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
			"seed": 1810756097,
			"version": 169,
			"versionNonce": 52512655,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704639133087,
			"link": null,
			"locked": false,
			"text": "单个元素直接放入",
			"rawText": "单个元素直接放入",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 15,
			"containerId": "QJ2UeRjz70qRdnXQXDMv4",
			"originalText": "单个元素直接放入",
			"lineHeight": 1.2
		},
		{
			"id": "lrAxEIOV4slG6FM3kLkeQ",
			"type": "rectangle",
			"x": 384.56020100911473,
			"y": 660.6512366400825,
			"width": 220.13617621527777,
			"height": 49,
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
			"roundness": {
				"type": 3
			},
			"seed": 413202593,
			"version": 103,
			"versionNonce": 1513628751,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "kjHjgkDp"
				}
			],
			"updated": 1704639357752,
			"link": null,
			"locked": false
		},
		{
			"id": "kjHjgkDp",
			"type": "text",
			"x": 390.62828911675365,
			"y": 665.9512366400825,
			"width": 208,
			"height": 38.4,
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
			"seed": 1155650593,
			"version": 60,
			"versionNonce": 1303550991,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704639357683,
			"link": null,
			"locked": false,
			"text": "新节点插入数组，不用扩容的\n数组会在前面代码插入",
			"rawText": "新节点插入数组，不用扩容的数组会在前面代码插入",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 34,
			"containerId": "lrAxEIOV4slG6FM3kLkeQ",
			"originalText": "新节点插入数组，不用扩容的数组会在前面代码插入",
			"lineHeight": 1.2
		},
		{
			"id": "tVnBeMDX1PTQepEIgl0rV",
			"type": "rectangle",
			"x": 393.30314805772593,
			"y": -244.506573147244,
			"width": 125.74083116319446,
			"height": 29.59404839409723,
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
			"roundness": {
				"type": 3
			},
			"seed": 1929905359,
			"version": 59,
			"versionNonce": 2030217313,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "x243VqKq"
				}
			],
			"updated": 1704639456275,
			"link": null,
			"locked": false
		},
		{
			"id": "x243VqKq",
			"type": "text",
			"x": 411.48606363932316,
			"y": -239.3095489501954,
			"width": 89.375,
			"height": 19.2,
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
			"seed": 1796514831,
			"version": 15,
			"versionNonce": 191807105,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704639463733,
			"link": null,
			"locked": false,
			"text": "新容量为2倍",
			"rawText": "新容量为2倍",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 15,
			"containerId": "tVnBeMDX1PTQepEIgl0rV",
			"originalText": "新容量为2倍",
			"lineHeight": 1.2
		},
		{
			"id": "XTzW-tYZodvIwblN2gGkC",
			"type": "arrow",
			"x": 511.57476806640653,
			"y": 82.94381883409301,
			"width": 26.959635416666686,
			"height": 206.2218899197049,
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
				"type": 2
			},
			"seed": 774425327,
			"version": 37,
			"versionNonce": 1758816367,
			"isDeleted": true,
			"boundElements": null,
			"updated": 1704638823896,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					26.959635416666686,
					206.2218899197049
				]
			],
			"lastCommittedPoint": null,
			"startBinding": null,
			"endBinding": null,
			"startArrowhead": null,
			"endArrowhead": "arrow"
		},
		{
			"id": "ZTyAp-jEyy85U4kSoD32j",
			"type": "arrow",
			"x": 531.6436699761289,
			"y": 418.945507473416,
			"width": 70.11488172743043,
			"height": 67.19597710503479,
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
			"roundness": {
				"type": 2
			},
			"seed": 838464943,
			"version": 22,
			"versionNonce": 618525153,
			"isDeleted": true,
			"boundElements": null,
			"updated": 1704638823896,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					70.11488172743043,
					67.19597710503479
				]
			],
			"lastCommittedPoint": null,
			"startBinding": null,
			"endBinding": null,
			"startArrowhead": null,
			"endArrowhead": "arrow"
		}
	],
	"appState": {
		"theme": "light",
		"viewBackgroundColor": "#ffffff",
		"currentItemStrokeColor": "#e03131",
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
		"scrollX": 221.4635620117185,
		"scrollY": 600.2264658610027,
		"zoom": {
			"value": 0.9
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