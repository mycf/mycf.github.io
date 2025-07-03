---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠==


# Text Elements
    private void processWorkerExit(Worker w, boolean completedAbruptly) {
        if (completedAbruptly) // If abrupt, then workerCount wasn't adjusted
            decrementWorkerCount();

        final ReentrantLock mainLock = this.mainLock;
        mainLock.lock();
        try {
            completedTaskCount += w.completedTasks;
            workers.remove(w);
        } finally {
            mainLock.unlock();
        }

        tryTerminate();

        int c = ctl.get();
        if (runStateLessThan(c, STOP)) {
            if (!completedAbruptly) {
                int min = allowCoreThreadTimeOut ? 0 : corePoolSize;
                if (min == 0 && ! workQueue.isEmpty())
                    min = 1;
                if (workerCountOf(c) >= min)
                    return; // replacement not needed
            }
            addWorker(null, false);
        }
    }

    final void tryTerminate() {
        for (;;) {
            int c = ctl.get();
            if (isRunning(c) ||
                runStateAtLeast(c, TIDYING) ||
                (runStateLessThan(c, STOP) && ! workQueue.isEmpty()))
                return;
            if (workerCountOf(c) != 0) { // Eligible to terminate
                interruptIdleWorkers(ONLY_ONE);
                return;
            }

            final ReentrantLock mainLock = this.mainLock;
            mainLock.lock();
            try {
                if (ctl.compareAndSet(c, ctlOf(TIDYING, 0))) {
                    try {
                        terminated();
                    } finally {
                        ctl.set(ctlOf(TERMINATED, 0));
                        termination.signalAll();
                    }
                    return;
                }
            } finally {
                mainLock.unlock();
            }
            // else retry on failed CAS
        }
    }

    private void interruptIdleWorkers(boolean onlyOne) {
        final ReentrantLock mainLock = this.mainLock;
        mainLock.lock();
        try {
            for (Worker w : workers) {
                Thread t = w.thread;
                if (!t.isInterrupted() && w.tryLock()) {
                    try {
                        t.interrupt();
                    } catch (SecurityException ignore) {
                    } finally {
                        w.unlock();
                    }
                }
                if (onlyOne)
                    break;
            }
        } finally {
            mainLock.unlock();
        }
    }

 ^vDmZxDyM

意外终止 ^xFRrxMvH

队列中存在任务时，最小线程数为1 ^Fij6yKve

超过最小线程数，可以销毁 ^iFk0LSXg

不足最小线程数，重新生成工作线程，代替本任务继续运行 ^AdIpuA16

running或shutdown状态 ^KskBA1hq

running状态 ^NFVWwE9D

tidying、terminated状态 ^MQWOFxbK

shutdown+队列为空 ^p5xYBZaG

中断线程，之后poll、take会出现中断异常 ^fWv9BCHl

只中断一个，让他们像链表一样，一个个传递下去 ^iXGBUcbp

如果false，说明其他线程正在执行，就没必要重复执行了 ^fWZRQmLo

中断下一个线程 ^BvALQPUl

存在其他线程 ^6bztu0lB

把自己移除 ^AmPBG2LI

这里没有其他线程了 ^29kAdMzM

没有线程的时候，线程池状态为tidying ^BC26TWsD

进入tidying状态就执行terminated方法然后进入terminated状态 ^5zWV7LOF

为什么只有意外终止才-1？
因为正常中止是因为未获取到任务，已经在getTask里面-1了 ^BzQBZZHQ

%%
# Drawing
```json
{
	"type": "excalidraw",
	"version": 2,
	"source": "https://github.com/zsviczian/obsidian-excalidraw-plugin/releases/tag/2.0.13",
	"elements": [
		{
			"id": "vDmZxDyM",
			"type": "text",
			"x": -174.69577026367188,
			"y": -216.93511657714845,
			"width": 721.875,
			"height": 1574.3999999999999,
			"angle": 0,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": null,
			"seed": 397017633,
			"version": 50,
			"versionNonce": 777583375,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704612259351,
			"link": null,
			"locked": false,
			"text": "    private void processWorkerExit(Worker w, boolean completedAbruptly) {\n        if (completedAbruptly) // If abrupt, then workerCount wasn't adjusted\n            decrementWorkerCount();\n\n        final ReentrantLock mainLock = this.mainLock;\n        mainLock.lock();\n        try {\n            completedTaskCount += w.completedTasks;\n            workers.remove(w);\n        } finally {\n            mainLock.unlock();\n        }\n\n        tryTerminate();\n\n        int c = ctl.get();\n        if (runStateLessThan(c, STOP)) {\n            if (!completedAbruptly) {\n                int min = allowCoreThreadTimeOut ? 0 : corePoolSize;\n                if (min == 0 && ! workQueue.isEmpty())\n                    min = 1;\n                if (workerCountOf(c) >= min)\n                    return; // replacement not needed\n            }\n            addWorker(null, false);\n        }\n    }\n\n    final void tryTerminate() {\n        for (;;) {\n            int c = ctl.get();\n            if (isRunning(c) ||\n                runStateAtLeast(c, TIDYING) ||\n                (runStateLessThan(c, STOP) && ! workQueue.isEmpty()))\n                return;\n            if (workerCountOf(c) != 0) { // Eligible to terminate\n                interruptIdleWorkers(ONLY_ONE);\n                return;\n            }\n\n            final ReentrantLock mainLock = this.mainLock;\n            mainLock.lock();\n            try {\n                if (ctl.compareAndSet(c, ctlOf(TIDYING, 0))) {\n                    try {\n                        terminated();\n                    } finally {\n                        ctl.set(ctlOf(TERMINATED, 0));\n                        termination.signalAll();\n                    }\n                    return;\n                }\n            } finally {\n                mainLock.unlock();\n            }\n            // else retry on failed CAS\n        }\n    }\n\n    private void interruptIdleWorkers(boolean onlyOne) {\n        final ReentrantLock mainLock = this.mainLock;\n        mainLock.lock();\n        try {\n            for (Worker w : workers) {\n                Thread t = w.thread;\n                if (!t.isInterrupted() && w.tryLock()) {\n                    try {\n                        t.interrupt();\n                    } catch (SecurityException ignore) {\n                    } finally {\n                        w.unlock();\n                    }\n                }\n                if (onlyOne)\n                    break;\n            }\n        } finally {\n            mainLock.unlock();\n        }\n    }\n\n",
			"rawText": "    private void processWorkerExit(Worker w, boolean completedAbruptly) {\n        if (completedAbruptly) // If abrupt, then workerCount wasn't adjusted\n            decrementWorkerCount();\n\n        final ReentrantLock mainLock = this.mainLock;\n        mainLock.lock();\n        try {\n            completedTaskCount += w.completedTasks;\n            workers.remove(w);\n        } finally {\n            mainLock.unlock();\n        }\n\n        tryTerminate();\n\n        int c = ctl.get();\n        if (runStateLessThan(c, STOP)) {\n            if (!completedAbruptly) {\n                int min = allowCoreThreadTimeOut ? 0 : corePoolSize;\n                if (min == 0 && ! workQueue.isEmpty())\n                    min = 1;\n                if (workerCountOf(c) >= min)\n                    return; // replacement not needed\n            }\n            addWorker(null, false);\n        }\n    }\n\n    final void tryTerminate() {\n        for (;;) {\n            int c = ctl.get();\n            if (isRunning(c) ||\n                runStateAtLeast(c, TIDYING) ||\n                (runStateLessThan(c, STOP) && ! workQueue.isEmpty()))\n                return;\n            if (workerCountOf(c) != 0) { // Eligible to terminate\n                interruptIdleWorkers(ONLY_ONE);\n                return;\n            }\n\n            final ReentrantLock mainLock = this.mainLock;\n            mainLock.lock();\n            try {\n                if (ctl.compareAndSet(c, ctlOf(TIDYING, 0))) {\n                    try {\n                        terminated();\n                    } finally {\n                        ctl.set(ctlOf(TERMINATED, 0));\n                        termination.signalAll();\n                    }\n                    return;\n                }\n            } finally {\n                mainLock.unlock();\n            }\n            // else retry on failed CAS\n        }\n    }\n\n    private void interruptIdleWorkers(boolean onlyOne) {\n        final ReentrantLock mainLock = this.mainLock;\n        mainLock.lock();\n        try {\n            for (Worker w : workers) {\n                Thread t = w.thread;\n                if (!t.isInterrupted() && w.tryLock()) {\n                    try {\n                        t.interrupt();\n                    } catch (SecurityException ignore) {\n                    } finally {\n                        w.unlock();\n                    }\n                }\n                if (onlyOne)\n                    break;\n            }\n        } finally {\n            mainLock.unlock();\n        }\n    }\n\n",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "left",
			"verticalAlign": "top",
			"baseline": 1570,
			"containerId": null,
			"originalText": "    private void processWorkerExit(Worker w, boolean completedAbruptly) {\n        if (completedAbruptly) // If abrupt, then workerCount wasn't adjusted\n            decrementWorkerCount();\n\n        final ReentrantLock mainLock = this.mainLock;\n        mainLock.lock();\n        try {\n            completedTaskCount += w.completedTasks;\n            workers.remove(w);\n        } finally {\n            mainLock.unlock();\n        }\n\n        tryTerminate();\n\n        int c = ctl.get();\n        if (runStateLessThan(c, STOP)) {\n            if (!completedAbruptly) {\n                int min = allowCoreThreadTimeOut ? 0 : corePoolSize;\n                if (min == 0 && ! workQueue.isEmpty())\n                    min = 1;\n                if (workerCountOf(c) >= min)\n                    return; // replacement not needed\n            }\n            addWorker(null, false);\n        }\n    }\n\n    final void tryTerminate() {\n        for (;;) {\n            int c = ctl.get();\n            if (isRunning(c) ||\n                runStateAtLeast(c, TIDYING) ||\n                (runStateLessThan(c, STOP) && ! workQueue.isEmpty()))\n                return;\n            if (workerCountOf(c) != 0) { // Eligible to terminate\n                interruptIdleWorkers(ONLY_ONE);\n                return;\n            }\n\n            final ReentrantLock mainLock = this.mainLock;\n            mainLock.lock();\n            try {\n                if (ctl.compareAndSet(c, ctlOf(TIDYING, 0))) {\n                    try {\n                        terminated();\n                    } finally {\n                        ctl.set(ctlOf(TERMINATED, 0));\n                        termination.signalAll();\n                    }\n                    return;\n                }\n            } finally {\n                mainLock.unlock();\n            }\n            // else retry on failed CAS\n        }\n    }\n\n    private void interruptIdleWorkers(boolean onlyOne) {\n        final ReentrantLock mainLock = this.mainLock;\n        mainLock.lock();\n        try {\n            for (Worker w : workers) {\n                Thread t = w.thread;\n                if (!t.isInterrupted() && w.tryLock()) {\n                    try {\n                        t.interrupt();\n                    } catch (SecurityException ignore) {\n                    } finally {\n                        w.unlock();\n                    }\n                }\n                if (onlyOne)\n                    break;\n            }\n        } finally {\n            mainLock.unlock();\n        }\n    }\n\n",
			"lineHeight": 1.2
		},
		{
			"id": "AxC2fD6xKpZJZ9nDc6Zhh",
			"type": "rectangle",
			"x": 271.6925354003906,
			"y": -245.8647003173828,
			"width": 80.0880126953125,
			"height": 29.2,
			"angle": 0,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"seed": 1294524737,
			"version": 124,
			"versionNonce": 1007894881,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "xFRrxMvH"
				}
			],
			"updated": 1704612259351,
			"link": null,
			"locked": false
		},
		{
			"id": "xFRrxMvH",
			"type": "text",
			"x": 279.7365417480469,
			"y": -240.8647003173828,
			"width": 64,
			"height": 19.2,
			"angle": 0,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": null,
			"seed": 192402799,
			"version": 76,
			"versionNonce": 851755311,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704612259351,
			"link": null,
			"locked": false,
			"text": "意外终止",
			"rawText": "意外终止",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 15,
			"containerId": "AxC2fD6xKpZJZ9nDc6Zhh",
			"originalText": "意外终止",
			"lineHeight": 1.2
		},
		{
			"id": "-vgd3o5KulgWJqn8qpWUW",
			"type": "rectangle",
			"x": 339.4496154785156,
			"y": 149.48793029785156,
			"width": 139.2623291015625,
			"height": 49,
			"angle": 0,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"seed": 368191567,
			"version": 318,
			"versionNonce": 1506176321,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "Fij6yKve"
				}
			],
			"updated": 1704612259351,
			"link": null,
			"locked": false
		},
		{
			"id": "Fij6yKve",
			"type": "text",
			"x": 345.0807800292969,
			"y": 154.78793029785157,
			"width": 128,
			"height": 38.4,
			"angle": 0,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": null,
			"seed": 988397231,
			"version": 426,
			"versionNonce": 1578287951,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704612259351,
			"link": null,
			"locked": false,
			"text": "队列中存在任务时\n，最小线程数为1",
			"rawText": "队列中存在任务时，最小线程数为1",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 34,
			"containerId": "-vgd3o5KulgWJqn8qpWUW",
			"originalText": "队列中存在任务时，最小线程数为1",
			"lineHeight": 1.2
		},
		{
			"id": "6ngkcdn3BAGFzKqcKn_2l",
			"type": "rectangle",
			"x": 326.6816711425781,
			"y": 202.3399200439453,
			"width": 202.18750000000003,
			"height": 29.2,
			"angle": 0,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"seed": 2130485089,
			"version": 226,
			"versionNonce": 1407786273,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "iFk0LSXg"
				}
			],
			"updated": 1704612259351,
			"link": null,
			"locked": false
		},
		{
			"id": "iFk0LSXg",
			"type": "text",
			"x": 331.7754211425781,
			"y": 207.3399200439453,
			"width": 192,
			"height": 19.2,
			"angle": 0,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": null,
			"seed": 1271293697,
			"version": 190,
			"versionNonce": 278626671,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704612259351,
			"link": null,
			"locked": false,
			"text": "超过最小线程数，可以销毁",
			"rawText": "超过最小线程数，可以销毁",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 15,
			"containerId": "6ngkcdn3BAGFzKqcKn_2l",
			"originalText": "超过最小线程数，可以销毁",
			"lineHeight": 1.2
		},
		{
			"id": "lQbaXtxvtYJPM0s3XDbYL",
			"type": "rectangle",
			"x": 157.88955688476562,
			"y": 238.71107482910156,
			"width": 269.406494140625,
			"height": 49,
			"angle": 0,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"seed": 1186558351,
			"version": 383,
			"versionNonce": 2045432065,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "AdIpuA16"
				}
			],
			"updated": 1704612259351,
			"link": null,
			"locked": false
		},
		{
			"id": "AdIpuA16",
			"type": "text",
			"x": 164.59280395507812,
			"y": 244.01107482910157,
			"width": 256,
			"height": 38.4,
			"angle": 0,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": null,
			"seed": 1417671919,
			"version": 543,
			"versionNonce": 195525519,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704612259351,
			"link": null,
			"locked": false,
			"text": "不足最小线程数，重新生成工作线程\n，代替本任务继续运行",
			"rawText": "不足最小线程数，重新生成工作线程，代替本任务继续运行",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 34,
			"containerId": "lQbaXtxvtYJPM0s3XDbYL",
			"originalText": "不足最小线程数，重新生成工作线程，代替本任务继续运行",
			"lineHeight": 1.2
		},
		{
			"id": "Zj4pIBzbSmDn7uCigcrrR",
			"type": "rectangle",
			"x": 206.86331176757812,
			"y": 87.51502990722656,
			"width": 201.99096679687503,
			"height": 29.2,
			"angle": 0,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"seed": 1454433679,
			"version": 146,
			"versionNonce": 21694689,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "KskBA1hq"
				}
			],
			"updated": 1704612259351,
			"link": null,
			"locked": false
		},
		{
			"id": "KskBA1hq",
			"type": "text",
			"x": 213.54629516601562,
			"y": 92.51502990722656,
			"width": 188.625,
			"height": 19.2,
			"angle": 0,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": null,
			"seed": 504160495,
			"version": 168,
			"versionNonce": 1399796143,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704612259351,
			"link": null,
			"locked": false,
			"text": "running或shutdown状态",
			"rawText": "running或shutdown状态",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 15,
			"containerId": "Zj4pIBzbSmDn7uCigcrrR",
			"originalText": "running或shutdown状态",
			"lineHeight": 1.2
		},
		{
			"id": "9S51tvL9dj-akB0u_dveJ",
			"type": "arrow",
			"x": -96.94784545898438,
			"y": 45.40235900878906,
			"width": 144.0628662109375,
			"height": 288.235428858663,
			"angle": 0,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"seed": 1667129281,
			"version": 127,
			"versionNonce": 1134118081,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704612259351,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					-144.0628662109375,
					149.68060302734375
				],
				[
					-44.883593649089676,
					288.235428858663
				]
			],
			"lastCommittedPoint": null,
			"startBinding": null,
			"endBinding": null,
			"startArrowhead": null,
			"endArrowhead": "arrow"
		},
		{
			"id": "5hUY1ZtegOeaLm_ERMmsW",
			"type": "rectangle",
			"x": 116.68621670683751,
			"y": 368.69820173993304,
			"width": 112.9706674632551,
			"height": 29.2,
			"angle": 0,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"seed": 492149761,
			"version": 305,
			"versionNonce": 1360733135,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "NFVWwE9D"
				}
			],
			"updated": 1704612259351,
			"link": null,
			"locked": false
		},
		{
			"id": "NFVWwE9D",
			"type": "text",
			"x": 124.35905043846506,
			"y": 373.69820173993304,
			"width": 97.625,
			"height": 19.2,
			"angle": 0,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": null,
			"seed": 59446273,
			"version": 609,
			"versionNonce": 1014301857,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704612259351,
			"link": null,
			"locked": false,
			"text": "running状态",
			"rawText": "running状态",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 15,
			"containerId": "5hUY1ZtegOeaLm_ERMmsW",
			"originalText": "running状态",
			"lineHeight": 1.2
		},
		{
			"id": "eJw8Q3FvE9OnrUv1W1nVV",
			"type": "rectangle",
			"x": 259.1600829403848,
			"y": 387.7216668785208,
			"width": 221.29091290271685,
			"height": 29.2,
			"angle": 0,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"seed": 1745617761,
			"version": 306,
			"versionNonce": 885248495,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "MQWOFxbK"
				}
			],
			"updated": 1704612259351,
			"link": null,
			"locked": false
		},
		{
			"id": "MQWOFxbK",
			"type": "text",
			"x": 266.11803939174325,
			"y": 392.7216668785208,
			"width": 207.375,
			"height": 19.2,
			"angle": 0,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": null,
			"seed": 834830831,
			"version": 481,
			"versionNonce": 1200474241,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704612259351,
			"link": null,
			"locked": false,
			"text": "tidying、terminated状态",
			"rawText": "tidying、terminated状态",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 15,
			"containerId": "eJw8Q3FvE9OnrUv1W1nVV",
			"originalText": "tidying、terminated状态",
			"lineHeight": 1.2
		},
		{
			"id": "cH4B8s11MSvQM4ejtBpqX",
			"type": "rectangle",
			"x": 479.4262363072089,
			"y": 411.2239470433646,
			"width": 95.03432405429822,
			"height": 49,
			"angle": 0,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"seed": 1023461505,
			"version": 65,
			"versionNonce": 393329679,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "p5xYBZaG"
				}
			],
			"updated": 1704612259351,
			"link": null,
			"locked": false
		},
		{
			"id": "p5xYBZaG",
			"type": "text",
			"x": 484.755898334358,
			"y": 416.5239470433646,
			"width": 84.375,
			"height": 38.4,
			"angle": 0,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": null,
			"seed": 873094817,
			"version": 42,
			"versionNonce": 514003041,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704612259351,
			"link": null,
			"locked": false,
			"text": "shutdown+\n队列为空",
			"rawText": "shutdown+队列为空",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 34,
			"containerId": "cH4B8s11MSvQM4ejtBpqX",
			"originalText": "shutdown+队列为空",
			"lineHeight": 1.2
		},
		{
			"id": "IsP_TKpUOtE-_yZ8kHdqv",
			"type": "arrow",
			"x": -22.00208682319203,
			"y": 485.93993046213734,
			"width": 215.17619993840992,
			"height": 442.2312603951717,
			"angle": 0,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"seed": 100815439,
			"version": 230,
			"versionNonce": 1562206767,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704612259351,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					-215.17619993840992,
					164.71683510624575
				],
				[
					-119.49056823972364,
					442.2312603951717
				]
			],
			"lastCommittedPoint": null,
			"startBinding": null,
			"endBinding": null,
			"startArrowhead": null,
			"endArrowhead": "arrow"
		},
		{
			"id": "mYW9H50EsV9se24j4hg0s",
			"type": "rectangle",
			"x": 178.885403216155,
			"y": 1059.5106868720381,
			"width": 330.35062748643315,
			"height": 29.2,
			"angle": 0,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"seed": 1122971009,
			"version": 705,
			"versionNonce": 394550337,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "fWv9BCHl"
				}
			],
			"updated": 1704612259351,
			"link": null,
			"locked": false
		},
		{
			"id": "fWv9BCHl",
			"type": "text",
			"x": 186.56071695937158,
			"y": 1064.5106868720381,
			"width": 315,
			"height": 19.2,
			"angle": 0,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": null,
			"seed": 731580961,
			"version": 1099,
			"versionNonce": 1454326863,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704612259351,
			"link": null,
			"locked": false,
			"text": "中断线程，之后poll、take会出现中断异常",
			"rawText": "中断线程，之后poll、take会出现中断异常",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 15,
			"containerId": "mYW9H50EsV9se24j4hg0s",
			"originalText": "中断线程，之后poll、take会出现中断异常",
			"lineHeight": 1.2
		},
		{
			"id": "zBZK3Xjq9X-ZlgorrZ0c6",
			"type": "rectangle",
			"x": 91.98634939623105,
			"y": 1179.6670436570087,
			"width": 191.6733094673997,
			"height": 49,
			"angle": 0,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"seed": 1398299265,
			"version": 362,
			"versionNonce": 571550753,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "iXGBUcbp"
				}
			],
			"updated": 1704612259351,
			"link": null,
			"locked": false
		},
		{
			"id": "iXGBUcbp",
			"type": "text",
			"x": 99.8230041299309,
			"y": 1184.9670436570086,
			"width": 176,
			"height": 38.4,
			"angle": 0,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": null,
			"seed": 905633665,
			"version": 454,
			"versionNonce": 603972207,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704612259351,
			"link": null,
			"locked": false,
			"text": "只中断一个，让他们像链\n表一样，一个个传递下去",
			"rawText": "只中断一个，让他们像链表一样，一个个传递下去",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 34,
			"containerId": "zBZK3Xjq9X-ZlgorrZ0c6",
			"originalText": "只中断一个，让他们像链表一样，一个个传递下去",
			"lineHeight": 1.2
		},
		{
			"id": "GYV9TinI73RP6XXbgF0xf",
			"type": "rectangle",
			"x": 213.857611026622,
			"y": 966.6677083716227,
			"width": 158.3700937399851,
			"height": 85.77202673799708,
			"angle": 0,
			"strokeColor": "#1971c2",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"seed": 1383446607,
			"version": 353,
			"versionNonce": 104398849,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "fWZRQmLo"
				}
			],
			"updated": 1704612259351,
			"link": null,
			"locked": false
		},
		{
			"id": "fWZRQmLo",
			"type": "text",
			"x": 218.857611026622,
			"y": 971.6677083716227,
			"width": 144,
			"height": 57.599999999999994,
			"angle": 0,
			"strokeColor": "#1971c2",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": null,
			"seed": 1448715215,
			"version": 465,
			"versionNonce": 1440201871,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704612259351,
			"link": null,
			"locked": false,
			"text": "如果false，说明其\n他线程正在执行，就\n没必要重复执行了",
			"rawText": "如果false，说明其他线程正在执行，就没必要重复执行了",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "left",
			"verticalAlign": "top",
			"baseline": 54,
			"containerId": "GYV9TinI73RP6XXbgF0xf",
			"originalText": "如果false，说明其他线程正在执行，就没必要重复执行了",
			"lineHeight": 1.2
		},
		{
			"id": "A8u6J-HLf6IyqVIrbeEFI",
			"type": "rectangle",
			"x": 266.7051126526657,
			"y": 471.8493476029478,
			"width": 132.30930769494262,
			"height": 29.2,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"seed": 1323276303,
			"version": 191,
			"versionNonce": 1643861985,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "BvALQPUl"
				}
			],
			"updated": 1704612259351,
			"link": null,
			"locked": false
		},
		{
			"id": "BvALQPUl",
			"type": "text",
			"x": 276.859766500137,
			"y": 476.8493476029478,
			"width": 112,
			"height": 19.2,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": null,
			"seed": 1656497455,
			"version": 209,
			"versionNonce": 1341084335,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704612259351,
			"link": null,
			"locked": false,
			"text": "中断下一个线程",
			"rawText": "中断下一个线程",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 15,
			"containerId": "A8u6J-HLf6IyqVIrbeEFI",
			"originalText": "中断下一个线程",
			"lineHeight": 1.2
		},
		{
			"id": "rA5bJJUKEj4GZwh6PFUMF",
			"type": "arrow",
			"x": -71.86177415826143,
			"y": 462.89225850188063,
			"width": 2.156010685474996,
			"height": 69.60729914260094,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"seed": 818422575,
			"version": 145,
			"versionNonce": 1734849473,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "6bztu0lB"
				}
			],
			"updated": 1704612259351,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					2.156010685474996,
					69.60729914260094
				]
			],
			"lastCommittedPoint": null,
			"startBinding": null,
			"endBinding": null,
			"startArrowhead": null,
			"endArrowhead": "triangle"
		},
		{
			"id": "6bztu0lB",
			"type": "text",
			"x": -118.78376881552393,
			"y": 488.0959080731811,
			"width": 96,
			"height": 19.2,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": null,
			"seed": 2036804129,
			"version": 35,
			"versionNonce": 1794057423,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704612259351,
			"link": null,
			"locked": false,
			"text": "存在其他线程",
			"rawText": "存在其他线程",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 15,
			"containerId": "rA5bJJUKEj4GZwh6PFUMF",
			"originalText": "存在其他线程",
			"lineHeight": 1.2
		},
		{
			"id": "AmPBG2LI",
			"type": "text",
			"x": 106.20716044064875,
			"y": -62.919919083290836,
			"width": 80,
			"height": 19.2,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": null,
			"seed": 328254785,
			"version": 64,
			"versionNonce": 1520276385,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704612259351,
			"link": null,
			"locked": false,
			"text": "把自己移除",
			"rawText": "把自己移除",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "left",
			"verticalAlign": "top",
			"baseline": 15,
			"containerId": null,
			"originalText": "把自己移除",
			"lineHeight": 1.2
		},
		{
			"id": "29kAdMzM",
			"type": "text",
			"x": 22.437044076384552,
			"y": 528.0432808896518,
			"width": 144,
			"height": 19.2,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": null,
			"seed": 780638337,
			"version": 135,
			"versionNonce": 1450160879,
			"isDeleted": false,
			"boundElements": [
				{
					"id": "qtQN7WGal4zcxkXRWmcW7",
					"type": "arrow"
				}
			],
			"updated": 1704612259351,
			"link": null,
			"locked": false,
			"text": "这里没有其他线程了",
			"rawText": "这里没有其他线程了",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "left",
			"verticalAlign": "top",
			"baseline": 15,
			"containerId": null,
			"originalText": "这里没有其他线程了",
			"lineHeight": 1.2
		},
		{
			"id": "qtQN7WGal4zcxkXRWmcW7",
			"type": "arrow",
			"x": -46.0607475865919,
			"y": 500.8525552968902,
			"width": 62.94648288226834,
			"height": 34.19697946438879,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"seed": 1877406447,
			"version": 38,
			"versionNonce": 1338800001,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704612259351,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					62.94648288226834,
					34.19697946438879
				]
			],
			"lastCommittedPoint": null,
			"startBinding": null,
			"endBinding": {
				"elementId": "29kAdMzM",
				"focus": -0.8116023721985502,
				"gap": 5.551308780708098
			},
			"startArrowhead": null,
			"endArrowhead": "triangle"
		},
		{
			"id": "fTVPteC3HPldBGYnoE9b_",
			"type": "rectangle",
			"x": 410.6039899545689,
			"y": 597.9527343311278,
			"width": 183.72123878678633,
			"height": 49,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"seed": 1727158447,
			"version": 510,
			"versionNonce": 989429007,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "BC26TWsD"
				},
				{
					"id": "nrvj4XrseEoC-ayrkXNP_",
					"type": "arrow"
				}
			],
			"updated": 1704612259351,
			"link": null,
			"locked": false
		},
		{
			"id": "BC26TWsD",
			"type": "text",
			"x": 422.46460934796204,
			"y": 603.2527343311277,
			"width": 160,
			"height": 38.4,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": null,
			"seed": 1446265071,
			"version": 400,
			"versionNonce": 691265377,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704612259351,
			"link": null,
			"locked": false,
			"text": "没有线程的时候，线程\n池状态为tidying",
			"rawText": "没有线程的时候，线程池状态为tidying",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 34,
			"containerId": "fTVPteC3HPldBGYnoE9b_",
			"originalText": "没有线程的时候，线程池状态为tidying",
			"lineHeight": 1.2
		},
		{
			"id": "nrvj4XrseEoC-ayrkXNP_",
			"type": "arrow",
			"x": 165.81718988831307,
			"y": 545.818583474242,
			"width": 303.79848632708837,
			"height": 50.72110254067104,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"seed": 1488483425,
			"version": 290,
			"versionNonce": 470090543,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704612259352,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					303.79848632708837,
					50.72110254067104
				]
			],
			"lastCommittedPoint": null,
			"startBinding": null,
			"endBinding": {
				"elementId": "fTVPteC3HPldBGYnoE9b_",
				"gap": 1.413048316214656,
				"focus": 0.3516988196350679
			},
			"startArrowhead": null,
			"endArrowhead": "triangle"
		},
		{
			"id": "XllRR519FZZqhG5LOBWDu",
			"type": "arrow",
			"x": 222.28042923998098,
			"y": 680.6954325063978,
			"width": 11.277890949423039,
			"height": 6.0317655718492915,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"seed": 2002542383,
			"version": 115,
			"versionNonce": 682766817,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704612281207,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					11.277890949423039,
					6.0317655718492915
				]
			],
			"lastCommittedPoint": null,
			"startBinding": {
				"elementId": "5zWV7LOF",
				"focus": 1.0894218589342248,
				"gap": 15.331506206476263
			},
			"endBinding": null,
			"startArrowhead": null,
			"endArrowhead": "triangle"
		},
		{
			"id": "5zWV7LOF",
			"type": "text",
			"x": 178.15815201384112,
			"y": 646.1639262999215,
			"width": 493.125,
			"height": 19.2,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": null,
			"seed": 636954703,
			"version": 153,
			"versionNonce": 1094916609,
			"isDeleted": false,
			"boundElements": [
				{
					"id": "XllRR519FZZqhG5LOBWDu",
					"type": "arrow"
				}
			],
			"updated": 1704612281204,
			"link": null,
			"locked": false,
			"text": "进入tidying状态就执行terminated方法然后进入terminated状态",
			"rawText": "进入tidying状态就执行terminated方法然后进入terminated状态",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "left",
			"verticalAlign": "top",
			"baseline": 15,
			"containerId": null,
			"originalText": "进入tidying状态就执行terminated方法然后进入terminated状态",
			"lineHeight": 1.2
		},
		{
			"id": "XtAoeIpWWFaPzgPwcz5e9",
			"type": "arrow",
			"x": 223.99830902830178,
			"y": 622.694612472985,
			"width": 69.16183230549314,
			"height": 23.352789197359357,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [
				"8_bTO0XFSFqLzxhzVj_So"
			],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"seed": 309772111,
			"version": 29,
			"versionNonce": 1274690337,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704612259352,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					-69.16183230549314,
					23.352789197359357
				]
			],
			"lastCommittedPoint": null,
			"startBinding": null,
			"endBinding": null,
			"startArrowhead": null,
			"endArrowhead": "triangle"
		},
		{
			"id": "TvEwKfrFn04Bphsp9QElO",
			"type": "rectangle",
			"x": 141.93180382382855,
			"y": -182.64905916609507,
			"width": 462.9036026440336,
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
			"seed": 1356803023,
			"version": 397,
			"versionNonce": 1310264431,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "BzQBZZHQ"
				}
			],
			"updated": 1704613334185,
			"link": null,
			"locked": false
		},
		{
			"id": "BzQBZZHQ",
			"type": "text",
			"x": 146.93180382382855,
			"y": -177.34905916609506,
			"width": 436.375,
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
			"seed": 895570799,
			"version": 385,
			"versionNonce": 1523021999,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704613333639,
			"link": null,
			"locked": false,
			"text": "为什么只有意外终止才-1？\n因为正常中止是因为未获取到任务，已经在getTask里面-1了",
			"rawText": "为什么只有意外终止才-1？\n因为正常中止是因为未获取到任务，已经在getTask里面-1了",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "left",
			"verticalAlign": "middle",
			"baseline": 34,
			"containerId": "TvEwKfrFn04Bphsp9QElO",
			"originalText": "为什么只有意外终止才-1？\n因为正常中止是因为未获取到任务，已经在getTask里面-1了",
			"lineHeight": 1.2
		},
		{
			"id": "mTM91wNl",
			"type": "text",
			"x": -307.6957702636719,
			"y": -287.13511657714844,
			"width": 10,
			"height": 25,
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
			"seed": 299916271,
			"version": 5,
			"versionNonce": 1723960161,
			"isDeleted": true,
			"boundElements": null,
			"updated": 1704611009183,
			"link": null,
			"locked": false,
			"text": "",
			"rawText": "",
			"fontSize": 20,
			"fontFamily": 1,
			"textAlign": "left",
			"verticalAlign": "top",
			"baseline": 18,
			"containerId": null,
			"originalText": "",
			"lineHeight": 1.25
		},
		{
			"id": "t2mzqnFu",
			"type": "text",
			"x": 337.0027160644531,
			"y": -240.48899841308594,
			"width": 9.375,
			"height": 19.2,
			"angle": 0,
			"strokeColor": "#2f9e44",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 533709249,
			"version": 5,
			"versionNonce": 722265889,
			"isDeleted": true,
			"boundElements": null,
			"updated": 1704611009183,
			"link": null,
			"locked": false,
			"text": "",
			"rawText": "",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 15,
			"containerId": "AxC2fD6xKpZJZ9nDc6Zhh",
			"originalText": "",
			"lineHeight": 1.2
		},
		{
			"id": "8MjXuVYM",
			"type": "text",
			"x": -75.47126881552393,
			"y": 488.0959080731811,
			"width": 9.375,
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
			"seed": 1158552975,
			"version": 2,
			"versionNonce": 721618561,
			"isDeleted": true,
			"boundElements": null,
			"updated": 1704611802992,
			"link": null,
			"locked": false,
			"text": "",
			"rawText": "",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 15,
			"containerId": "rA5bJJUKEj4GZwh6PFUMF",
			"originalText": "",
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
		"currentItemStrokeStyle": "solid",
		"currentItemRoughness": 1,
		"currentItemOpacity": 100,
		"currentItemFontFamily": 3,
		"currentItemFontSize": 16,
		"currentItemTextAlign": "left",
		"currentItemStartArrowhead": null,
		"currentItemEndArrowhead": "triangle",
		"scrollX": 320.8208325937843,
		"scrollY": 656.521048655345,
		"zoom": {
			"value": 1.1004957814203962
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