---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠==


# Text Elements
    final void runWorker(Worker w) {
        Thread wt = Thread.currentThread();
        Runnable task = w.firstTask;
        w.firstTask = null;
        w.unlock(); // allow interrupts
        boolean completedAbruptly = true;
        try {
            while (task != null || (task = getTask()) != null) {
                w.lock();
                // If pool is stopping, ensure thread is interrupted;
                // if not, ensure thread is not interrupted.  This
                // requires a recheck in second case to deal with
                // shutdownNow race while clearing interrupt
                if ((runStateAtLeast(ctl.get(), STOP) ||
                     (Thread.interrupted() &&
                      runStateAtLeast(ctl.get(), STOP))) &&
                    !wt.isInterrupted())
                    wt.interrupt();
                try {
                    beforeExecute(wt, task);
                    try {
                        task.run();
                        afterExecute(task, null);
                    } catch (Throwable ex) {
                        afterExecute(task, ex);
                        throw ex;
                    }
                } finally {
                    task = null;
                    w.completedTasks++;
                    w.unlock();
                }
            }
            completedAbruptly = false;
        } finally {
            processWorkerExit(w, completedAbruptly);
        }
    }

    private Runnable getTask() {
        boolean timedOut = false; // Did the last poll() time out?

        for (;;) {
            int c = ctl.get();

            // Check if queue empty only if necessary.
            if (runStateAtLeast(c, SHUTDOWN)
                && (runStateAtLeast(c, STOP) || workQueue.isEmpty())) {
                decrementWorkerCount();
                return null;
            }

            int wc = workerCountOf(c);

            // Are workers subject to culling?
            boolean timed = allowCoreThreadTimeOut || wc > corePoolSize;

            if ((wc > maximumPoolSize || (timed && timedOut))
                && (wc > 1 || workQueue.isEmpty())) {
                if (compareAndDecrementWorkerCount(c))
                    return null;
                continue;
            }

            try {
                Runnable r = timed ?
                    workQueue.poll(keepAliveTime, TimeUnit.NANOSECONDS) :
                    workQueue.take();
                if (r != null)
                    return r;
                timedOut = true;
            } catch (InterruptedException retry) {
                timedOut = false;
            }
        }
    }

 ^r7BTOJwb

线程数 ^1Dle7lSO

是否允许过期
1、核心线程允许回收=》所有线程都要超时回收
2、超过核心线程数 ^S4X3xbjr

什么时候会出现线程数大于最大线程数？
我认为只有动态调整了最大线程数会出现这个问题 ^SPYEAGem

未获取到任务会一直阻塞 ^OvNtRpCU

这里会因为超时返回null ^Gn8kPbfq

思考🤔：既然是只有timed为true，timedOut才可能为true这里为什么还要&&，直接timedOut不就好了吗
因为上一次获取task超时了，尝试执行清除线程的时候timed可能发生变化
1、allowCoreThreadTimeOut可能变化
2、其他线程可能被回收了，线程数可能不到核心线程数了 ^iwTvfHhA

1、状态为shutdown并且队列为空
2、状态为stop及以上（不再处理任务了）
这里写的有点绕。。。感觉可以换一种写法 ^UpMR0sSl

处理firstTask ^DnF7lZC2

除了第一次firstTask，后面都getTask了 ^FhiVBt3t

未获取到task，线程就回收了 ^Hrw6YL2a

不用回收的线程，会使用blockqueue阻塞在这 ^GQT0GLdJ

1、至少stop的状态+当前线程非中断
2、清除当前线程中断成功并确保状态至少stop状态+非中断 ^gYHVFgBW

重复判断了至少stop状态防止清除状态的时候调用了shutdowNow进入了stop状态 ^2Q8jSgLD

确保stop状态下是中断状态 ^dVQ2PDTs

shutdownNow会触发中断 ^aRBtUR7S

注意：要防止任务出现异常，如果任务出现异常，就会造成任务执行完，线程就销毁（线程池应该只有队列的作用了） ^zJWPPO0L

正常终止的任务在这里-1 ^o2Z4kccy

异常终止的任务，在终止方法-1 ^5xLI9RxO

重新循环的时候再处理超时，这样可以重新判断状态并且不用写重复代码 ^4Y4cTIhq

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
			"version": 254,
			"versionNonce": 293829871,
			"isDeleted": false,
			"id": "r7BTOJwb",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -240.818257539807,
			"y": -399.09220912884774,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "transparent",
			"width": 855.46875,
			"height": 1872,
			"seed": 925744097,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704514804450,
			"link": null,
			"locked": false,
			"fontSize": 20,
			"fontFamily": 3,
			"text": "    final void runWorker(Worker w) {\n        Thread wt = Thread.currentThread();\n        Runnable task = w.firstTask;\n        w.firstTask = null;\n        w.unlock(); // allow interrupts\n        boolean completedAbruptly = true;\n        try {\n            while (task != null || (task = getTask()) != null) {\n                w.lock();\n                // If pool is stopping, ensure thread is interrupted;\n                // if not, ensure thread is not interrupted.  This\n                // requires a recheck in second case to deal with\n                // shutdownNow race while clearing interrupt\n                if ((runStateAtLeast(ctl.get(), STOP) ||\n                     (Thread.interrupted() &&\n                      runStateAtLeast(ctl.get(), STOP))) &&\n                    !wt.isInterrupted())\n                    wt.interrupt();\n                try {\n                    beforeExecute(wt, task);\n                    try {\n                        task.run();\n                        afterExecute(task, null);\n                    } catch (Throwable ex) {\n                        afterExecute(task, ex);\n                        throw ex;\n                    }\n                } finally {\n                    task = null;\n                    w.completedTasks++;\n                    w.unlock();\n                }\n            }\n            completedAbruptly = false;\n        } finally {\n            processWorkerExit(w, completedAbruptly);\n        }\n    }\n\n    private Runnable getTask() {\n        boolean timedOut = false; // Did the last poll() time out?\n\n        for (;;) {\n            int c = ctl.get();\n\n            // Check if queue empty only if necessary.\n            if (runStateAtLeast(c, SHUTDOWN)\n                && (runStateAtLeast(c, STOP) || workQueue.isEmpty())) {\n                decrementWorkerCount();\n                return null;\n            }\n\n            int wc = workerCountOf(c);\n\n            // Are workers subject to culling?\n            boolean timed = allowCoreThreadTimeOut || wc > corePoolSize;\n\n            if ((wc > maximumPoolSize || (timed && timedOut))\n                && (wc > 1 || workQueue.isEmpty())) {\n                if (compareAndDecrementWorkerCount(c))\n                    return null;\n                continue;\n            }\n\n            try {\n                Runnable r = timed ?\n                    workQueue.poll(keepAliveTime, TimeUnit.NANOSECONDS) :\n                    workQueue.take();\n                if (r != null)\n                    return r;\n                timedOut = true;\n            } catch (InterruptedException retry) {\n                timedOut = false;\n            }\n        }\n    }\n\n",
			"rawText": "    final void runWorker(Worker w) {\n        Thread wt = Thread.currentThread();\n        Runnable task = w.firstTask;\n        w.firstTask = null;\n        w.unlock(); // allow interrupts\n        boolean completedAbruptly = true;\n        try {\n            while (task != null || (task = getTask()) != null) {\n                w.lock();\n                // If pool is stopping, ensure thread is interrupted;\n                // if not, ensure thread is not interrupted.  This\n                // requires a recheck in second case to deal with\n                // shutdownNow race while clearing interrupt\n                if ((runStateAtLeast(ctl.get(), STOP) ||\n                     (Thread.interrupted() &&\n                      runStateAtLeast(ctl.get(), STOP))) &&\n                    !wt.isInterrupted())\n                    wt.interrupt();\n                try {\n                    beforeExecute(wt, task);\n                    try {\n                        task.run();\n                        afterExecute(task, null);\n                    } catch (Throwable ex) {\n                        afterExecute(task, ex);\n                        throw ex;\n                    }\n                } finally {\n                    task = null;\n                    w.completedTasks++;\n                    w.unlock();\n                }\n            }\n            completedAbruptly = false;\n        } finally {\n            processWorkerExit(w, completedAbruptly);\n        }\n    }\n\n    private Runnable getTask() {\n        boolean timedOut = false; // Did the last poll() time out?\n\n        for (;;) {\n            int c = ctl.get();\n\n            // Check if queue empty only if necessary.\n            if (runStateAtLeast(c, SHUTDOWN)\n                && (runStateAtLeast(c, STOP) || workQueue.isEmpty())) {\n                decrementWorkerCount();\n                return null;\n            }\n\n            int wc = workerCountOf(c);\n\n            // Are workers subject to culling?\n            boolean timed = allowCoreThreadTimeOut || wc > corePoolSize;\n\n            if ((wc > maximumPoolSize || (timed && timedOut))\n                && (wc > 1 || workQueue.isEmpty())) {\n                if (compareAndDecrementWorkerCount(c))\n                    return null;\n                continue;\n            }\n\n            try {\n                Runnable r = timed ?\n                    workQueue.poll(keepAliveTime, TimeUnit.NANOSECONDS) :\n                    workQueue.take();\n                if (r != null)\n                    return r;\n                timedOut = true;\n            } catch (InterruptedException retry) {\n                timedOut = false;\n            }\n        }\n    }\n\n",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "    final void runWorker(Worker w) {\n        Thread wt = Thread.currentThread();\n        Runnable task = w.firstTask;\n        w.firstTask = null;\n        w.unlock(); // allow interrupts\n        boolean completedAbruptly = true;\n        try {\n            while (task != null || (task = getTask()) != null) {\n                w.lock();\n                // If pool is stopping, ensure thread is interrupted;\n                // if not, ensure thread is not interrupted.  This\n                // requires a recheck in second case to deal with\n                // shutdownNow race while clearing interrupt\n                if ((runStateAtLeast(ctl.get(), STOP) ||\n                     (Thread.interrupted() &&\n                      runStateAtLeast(ctl.get(), STOP))) &&\n                    !wt.isInterrupted())\n                    wt.interrupt();\n                try {\n                    beforeExecute(wt, task);\n                    try {\n                        task.run();\n                        afterExecute(task, null);\n                    } catch (Throwable ex) {\n                        afterExecute(task, ex);\n                        throw ex;\n                    }\n                } finally {\n                    task = null;\n                    w.completedTasks++;\n                    w.unlock();\n                }\n            }\n            completedAbruptly = false;\n        } finally {\n            processWorkerExit(w, completedAbruptly);\n        }\n    }\n\n    private Runnable getTask() {\n        boolean timedOut = false; // Did the last poll() time out?\n\n        for (;;) {\n            int c = ctl.get();\n\n            // Check if queue empty only if necessary.\n            if (runStateAtLeast(c, SHUTDOWN)\n                && (runStateAtLeast(c, STOP) || workQueue.isEmpty())) {\n                decrementWorkerCount();\n                return null;\n            }\n\n            int wc = workerCountOf(c);\n\n            // Are workers subject to culling?\n            boolean timed = allowCoreThreadTimeOut || wc > corePoolSize;\n\n            if ((wc > maximumPoolSize || (timed && timedOut))\n                && (wc > 1 || workQueue.isEmpty())) {\n                if (compareAndDecrementWorkerCount(c))\n                    return null;\n                continue;\n            }\n\n            try {\n                Runnable r = timed ?\n                    workQueue.poll(keepAliveTime, TimeUnit.NANOSECONDS) :\n                    workQueue.take();\n                if (r != null)\n                    return r;\n                timedOut = true;\n            } catch (InterruptedException retry) {\n                timedOut = false;\n            }\n        }\n    }\n\n",
			"lineHeight": 1.2,
			"baseline": 1866
		},
		{
			"type": "rectangle",
			"version": 142,
			"versionNonce": 946067777,
			"isDeleted": false,
			"id": "eZjB9pwCM6n-TEszVclUg",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -52.74411010742162,
			"y": 963.5912976946152,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 254.67215401785703,
			"height": 33.322579520089214,
			"seed": 1221732449,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"id": "9h9DVq4lCWG7_Vl8fUIBF",
					"type": "arrow"
				}
			],
			"updated": 1704468568364,
			"link": null,
			"locked": false
		},
		{
			"type": "rectangle",
			"version": 41,
			"versionNonce": 1397888847,
			"isDeleted": false,
			"id": "h9WpijYMQd0SZk3CEezC-",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -6.612808954147965,
			"y": 919.739717755999,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 66.95021856398807,
			"height": 30.651884533110206,
			"seed": 1293283375,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"id": "_dXLwFeSmFSkhBEvZ1Tj_",
					"type": "arrow"
				}
			],
			"updated": 1704468568364,
			"link": null,
			"locked": false
		},
		{
			"type": "rectangle",
			"version": 60,
			"versionNonce": 1408829729,
			"isDeleted": false,
			"id": "utEtbES-y4udhnaGLwbV-",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 263.4942641485308,
			"y": -236.43233163016225,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 125.61569940476193,
			"height": 36.13089425223214,
			"seed": 648511535,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [],
			"updated": 1704468568364,
			"link": null,
			"locked": false
		},
		{
			"type": "arrow",
			"version": 229,
			"versionNonce": 231843681,
			"isDeleted": false,
			"id": "f5jJ4bcpTXWh5kcfJr1Xw",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 321.6104285830546,
			"y": -201.518769037156,
			"strokeColor": "#e03131",
			"backgroundColor": "#fcfcfc",
			"width": 713.3103143601184,
			"height": 739.9711390904017,
			"seed": 1974624655,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"boundElements": [
				{
					"type": "text",
					"id": "Hrw6YL2a"
				}
			],
			"updated": 1704512354332,
			"link": null,
			"locked": false,
			"startBinding": null,
			"endBinding": null,
			"lastCommittedPoint": null,
			"startArrowhead": "arrow",
			"endArrowhead": "arrow",
			"points": [
				[
					0,
					0
				],
				[
					435.22553943452317,
					222.5315929594468
				],
				[
					-278.0847749255952,
					739.9711390904017
				]
			]
		},
		{
			"type": "text",
			"version": 36,
			"versionNonce": 289105569,
			"isDeleted": false,
			"id": "Hrw6YL2a",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 650.0859680175778,
			"y": 11.412823922290807,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 213.5,
			"height": 19.2,
			"seed": 686576449,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704468655167,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "未获取到task，线程就回收了",
			"rawText": "未获取到task，线程就回收了",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "f5jJ4bcpTXWh5kcfJr1Xw",
			"originalText": "未获取到task，线程就回收了",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "rectangle",
			"version": 113,
			"versionNonce": 1226652929,
			"isDeleted": false,
			"id": "O44hfkXphfKxj7zSK8AwF",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 210.3434549967451,
			"y": 844.9607522147041,
			"strokeColor": "#e03131",
			"backgroundColor": "#fcfcfc",
			"width": 78.4168061755953,
			"height": 34,
			"seed": 1956953857,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "1Dle7lSO"
				}
			],
			"updated": 1704468568364,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 41,
			"versionNonce": 1344393103,
			"isDeleted": false,
			"id": "1Dle7lSO",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 219.55185808454274,
			"y": 849.9607522147041,
			"strokeColor": "#e03131",
			"backgroundColor": "#fcfcfc",
			"width": 60,
			"height": 24,
			"seed": 1506086721,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704468568364,
			"link": null,
			"locked": false,
			"fontSize": 20,
			"fontFamily": 3,
			"text": "线程数",
			"rawText": "线程数",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "O44hfkXphfKxj7zSK8AwF",
			"originalText": "线程数",
			"lineHeight": 1.2,
			"baseline": 19
		},
		{
			"type": "rectangle",
			"version": 508,
			"versionNonce": 391116001,
			"isDeleted": false,
			"id": "hXDkZY68xdp5JYVquwaT3",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 396.21352568126895,
			"y": 837.0125972202846,
			"strokeColor": "#e03131",
			"backgroundColor": "#fcfcfc",
			"width": 219.0619187127978,
			"height": 87,
			"seed": 1683034177,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "S4X3xbjr"
				},
				{
					"id": "_dXLwFeSmFSkhBEvZ1Tj_",
					"type": "arrow"
				}
			],
			"updated": 1704468568364,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 643,
			"versionNonce": 1031734703,
			"isDeleted": false,
			"id": "S4X3xbjr",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 401.21352568126895,
			"y": 842.1125972202847,
			"strokeColor": "#e03131",
			"backgroundColor": "#fcfcfc",
			"width": 194.75,
			"height": 76.8,
			"seed": 29019649,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704468568364,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "是否允许过期\n1、核心线程允许回收=》所\n有线程都要超时回收\n2、超过核心线程数",
			"rawText": "是否允许过期\n1、核心线程允许回收=》所有线程都要超时回收\n2、超过核心线程数",
			"textAlign": "left",
			"verticalAlign": "middle",
			"containerId": "hXDkZY68xdp5JYVquwaT3",
			"originalText": "是否允许过期\n1、核心线程允许回收=》所有线程都要超时回收\n2、超过核心线程数",
			"lineHeight": 1.2,
			"baseline": 73
		},
		{
			"type": "arrow",
			"version": 608,
			"versionNonce": 1626587201,
			"isDeleted": false,
			"id": "_dXLwFeSmFSkhBEvZ1Tj_",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 61.33740960984014,
			"y": 921.9497786983741,
			"strokeColor": "#e03131",
			"backgroundColor": "#fcfcfc",
			"width": 332.15580822172615,
			"height": 50.40948021968347,
			"seed": 1027802497,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"boundElements": [],
			"updated": 1704618489616,
			"link": null,
			"locked": false,
			"startBinding": {
				"elementId": "h9WpijYMQd0SZk3CEezC-",
				"gap": 1,
				"focus": -0.3863409931026124
			},
			"endBinding": {
				"elementId": "hXDkZY68xdp5JYVquwaT3",
				"gap": 2.7203078497026922,
				"focus": 0.432581515890206
			},
			"lastCommittedPoint": null,
			"startArrowhead": null,
			"endArrowhead": "arrow",
			"points": [
				[
					0,
					0
				],
				[
					332.15580822172615,
					-50.40948021968347
				]
			]
		},
		{
			"type": "rectangle",
			"version": 96,
			"versionNonce": 1983454927,
			"isDeleted": false,
			"id": "UfgN-yPUMh-9HkEtkxhdH",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -284.62265595935617,
			"y": 999.7271910167879,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 214.5726376488095,
			"height": 87,
			"seed": 705756399,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "SPYEAGem"
				}
			],
			"updated": 1704619005268,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 143,
			"versionNonce": 791605409,
			"isDeleted": false,
			"id": "SPYEAGem",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -279.62265595935617,
			"y": 1004.8271910167879,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 192,
			"height": 76.8,
			"seed": 1457829999,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704468568364,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "什么时候会出现线程数大于\n最大线程数？\n我认为只有动态调整了最大\n线程数会出现这个问题",
			"rawText": "什么时候会出现线程数大于最大线程数？\n我认为只有动态调整了最大线程数会出现这个问题",
			"textAlign": "left",
			"verticalAlign": "middle",
			"containerId": "UfgN-yPUMh-9HkEtkxhdH",
			"originalText": "什么时候会出现线程数大于最大线程数？\n我认为只有动态调整了最大线程数会出现这个问题",
			"lineHeight": 1.2,
			"baseline": 73
		},
		{
			"type": "arrow",
			"version": 25,
			"versionNonce": 1408148975,
			"isDeleted": false,
			"id": "9h9DVq4lCWG7_Vl8fUIBF",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -45.256549653553634,
			"y": 997.109364100864,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 33.51876395089283,
			"height": 14.711739676339448,
			"seed": 772943841,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"boundElements": [],
			"updated": 1704468568364,
			"link": null,
			"locked": false,
			"startBinding": {
				"elementId": "eZjB9pwCM6n-TEszVclUg",
				"focus": 0.4927055428072657,
				"gap": 1
			},
			"endBinding": null,
			"lastCommittedPoint": null,
			"startArrowhead": null,
			"endArrowhead": "arrow",
			"points": [
				[
					0,
					0
				],
				[
					-33.51876395089283,
					14.711739676339448
				]
			]
		},
		{
			"type": "rectangle",
			"version": 181,
			"versionNonce": 1042244609,
			"isDeleted": false,
			"id": "nY_tjoEEoSVTAECZnteqW",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 205.07710920061413,
			"y": 1210.6945110502697,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 194.16120256696428,
			"height": 29.2,
			"seed": 1150081217,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "OvNtRpCU"
				}
			],
			"updated": 1704618489626,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 143,
			"versionNonce": 393559009,
			"isDeleted": false,
			"id": "OvNtRpCU",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 214.15771048409627,
			"y": 1215.6945110502697,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 176,
			"height": 19.2,
			"seed": 2070491873,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704618489626,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "未获取到任务会一直阻塞",
			"rawText": "未获取到任务会一直阻塞",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "nY_tjoEEoSVTAECZnteqW",
			"originalText": "未获取到任务会一直阻塞",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "rectangle",
			"version": 71,
			"versionNonce": 80870497,
			"isDeleted": false,
			"id": "Oh8GzOyqvZu-dyMjjy9xW",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -11.43784150623111,
			"y": 1187.8827667236326,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 179.37825520833337,
			"height": 27.572719029017883,
			"seed": 1183679919,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [],
			"updated": 1704468568364,
			"link": null,
			"locked": false
		},
		{
			"type": "arrow",
			"version": 228,
			"versionNonce": 1721972271,
			"isDeleted": false,
			"id": "YFsD-vBxTQeeVnig4zjMr",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -11.066922142391832,
			"y": 1204.5098477318174,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 165.72980608258925,
			"height": 90.20937965029748,
			"seed": 418266735,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"boundElements": [
				{
					"type": "text",
					"id": "Gn8kPbfq"
				}
			],
			"updated": 1704468568364,
			"link": null,
			"locked": false,
			"startBinding": null,
			"endBinding": null,
			"lastCommittedPoint": null,
			"startArrowhead": null,
			"endArrowhead": "arrow",
			"points": [
				[
					0,
					0
				],
				[
					-165.72980608258925,
					25.498163132440368
				],
				[
					-47.32404436383925,
					90.20937965029748
				]
			]
		},
		{
			"type": "text",
			"version": 62,
			"versionNonce": 821413953,
			"isDeleted": false,
			"id": "Gn8kPbfq",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -262.85922822498105,
			"y": 1210.8080108642578,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 181.5,
			"height": 19.2,
			"seed": 232080239,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704468568364,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "这里会因为超时返回null",
			"rawText": "这里会因为超时返回null",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "YFsD-vBxTQeeVnig4zjMr",
			"originalText": "这里会因为超时返回null",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "rectangle",
			"version": 59,
			"versionNonce": 1776176399,
			"isDeleted": false,
			"id": "hB-lo38wATbadByAR7Quw",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -55.3110162644156,
			"y": 1285.5998193650018,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 192.6045735677083,
			"height": 23.100295293898625,
			"seed": 1948728911,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"id": "pwqsEZWkM4ATkVO2GBdR2",
					"type": "arrow"
				}
			],
			"updated": 1704618476818,
			"link": null,
			"locked": false
		},
		{
			"type": "rectangle",
			"version": 81,
			"versionNonce": 2099295855,
			"isDeleted": false,
			"id": "CbDmvPQl-9kH3195bVLHQ",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 240.16220964704263,
			"y": 965.6085968017575,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 240.46677362351193,
			"height": 31.47693452380952,
			"seed": 381000353,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [],
			"updated": 1704468568364,
			"link": null,
			"locked": false
		},
		{
			"type": "rectangle",
			"version": 513,
			"versionNonce": 470095809,
			"isDeleted": false,
			"id": "EwpSFe_JXDWRYznQeDvLo",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 426.53986031668524,
			"y": 1010.0080108642585,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 394.8096865699408,
			"height": 164.87102399553558,
			"seed": 2075521217,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [
				{
					"type": "text",
					"id": "iwTvfHhA"
				},
				{
					"id": "zFrBqh0kBjnkDvXm1RnXw",
					"type": "arrow"
				}
			],
			"updated": 1704618489629,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 1022,
			"versionNonce": 2137054081,
			"isDeleted": false,
			"id": "iwTvfHhA",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 431.53986031668524,
			"y": 1015.0080108642585,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 377.375,
			"height": 153.6,
			"seed": 256949295,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704618489629,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "思考🤔：既然是只有timed为true，timedOut才可\n能为true这里为什么还要&&，直接timedOut不就好\n了吗\n因为上一次获取task超时了，尝试执行清除线程的时\n候timed可能发生变化\n1、allowCoreThreadTimeOut可能变化\n2、其他线程可能被回收了，线程数可能不到核心线程\n数了",
			"rawText": "思考🤔：既然是只有timed为true，timedOut才可能为true这里为什么还要&&，直接timedOut不就好了吗\n因为上一次获取task超时了，尝试执行清除线程的时候timed可能发生变化\n1、allowCoreThreadTimeOut可能变化\n2、其他线程可能被回收了，线程数可能不到核心线程数了",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": "EwpSFe_JXDWRYznQeDvLo",
			"originalText": "思考🤔：既然是只有timed为true，timedOut才可能为true这里为什么还要&&，直接timedOut不就好了吗\n因为上一次获取task超时了，尝试执行清除线程的时候timed可能发生变化\n1、allowCoreThreadTimeOut可能变化\n2、其他线程可能被回收了，线程数可能不到核心线程数了",
			"lineHeight": 1.2,
			"baseline": 149
		},
		{
			"type": "arrow",
			"version": 102,
			"versionNonce": 1575909281,
			"isDeleted": false,
			"id": "zFrBqh0kBjnkDvXm1RnXw",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 572.5421375697752,
			"y": 982.7063751220708,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 11.538340311125694,
			"height": 26.361839657738074,
			"seed": 1249597807,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704618489629,
			"link": null,
			"locked": false,
			"startBinding": {
				"elementId": "EwpSFe_JXDWRYznQeDvLo",
				"gap": 27.30163574218784,
				"focus": -0.4258648301559145
			},
			"endBinding": null,
			"lastCommittedPoint": null,
			"startArrowhead": null,
			"endArrowhead": "arrow",
			"points": [
				[
					0,
					0
				],
				[
					-11.538340311125694,
					26.361839657738074
				]
			]
		},
		{
			"type": "rectangle",
			"version": 216,
			"versionNonce": 1291602817,
			"isDeleted": false,
			"id": "GG1v9Ez-kBfD96Mn-al3C",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 403.53739565894716,
			"y": 652.9144032796225,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 321.90917968749994,
			"height": 67.80245535714278,
			"seed": 260923279,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [
				{
					"type": "text",
					"id": "UpMR0sSl"
				}
			],
			"updated": 1704613421157,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 238,
			"versionNonce": 424227681,
			"isDeleted": false,
			"id": "UpMR0sSl",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 408.53739565894716,
			"y": 657.9144032796225,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 304,
			"height": 57.599999999999994,
			"seed": 807777103,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704613421157,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "1、状态为shutdown并且队列为空\n2、状态为stop及以上（不再处理任务了）\n这里写的有点绕。。。感觉可以换一种写法",
			"rawText": "1、状态为shutdown并且队列为空\n2、状态为stop及以上（不再处理任务了）\n这里写的有点绕。。。感觉可以换一种写法",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": "GG1v9Ez-kBfD96Mn-al3C",
			"originalText": "1、状态为shutdown并且队列为空\n2、状态为stop及以上（不再处理任务了）\n这里写的有点绕。。。感觉可以换一种写法",
			"lineHeight": 1.2,
			"baseline": 54
		},
		{
			"type": "rectangle",
			"version": 80,
			"versionNonce": 575699151,
			"isDeleted": false,
			"id": "26skqW70UMstnFLxsRvah",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -32.77096557617324,
			"y": -253.22382972354217,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 162.22621372767856,
			"height": 45.09105864025304,
			"seed": 1974276257,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [
				{
					"type": "text",
					"id": "DnF7lZC2"
				}
			],
			"updated": 1704468568365,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 45,
			"versionNonce": 1135312801,
			"isDeleted": false,
			"id": "DnF7lZC2",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -27.77096557617324,
			"y": -248.22382972354217,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 116.375,
			"height": 19.2,
			"seed": 1754078273,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704468568365,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "处理firstTask",
			"rawText": "处理firstTask",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": "26skqW70UMstnFLxsRvah",
			"originalText": "处理firstTask",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "rectangle",
			"version": 105,
			"versionNonce": 1786047873,
			"isDeleted": false,
			"id": "rg5v3LXQOY8IWTrTRJvbp",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -13.798332577661313,
			"y": 276.0039302280952,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 161.45484561011904,
			"height": 23.042747860863066,
			"seed": 555077903,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [
				{
					"id": "9T5J_Rpem9QWpIaawKaLO",
					"type": "arrow"
				}
			],
			"updated": 1704468590662,
			"link": null,
			"locked": false
		},
		{
			"type": "arrow",
			"version": 107,
			"versionNonce": 708413423,
			"isDeleted": false,
			"id": "9T5J_Rpem9QWpIaawKaLO",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -14.209070114863664,
			"y": 290.66498166038684,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 192.01561337425596,
			"height": 508.1532796223958,
			"seed": 1812661295,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"boundElements": [
				{
					"type": "text",
					"id": "FhiVBt3t"
				}
			],
			"updated": 1704468624898,
			"link": null,
			"locked": false,
			"startBinding": {
				"elementId": "rg5v3LXQOY8IWTrTRJvbp",
				"focus": -0.9337096179660197,
				"gap": 1
			},
			"endBinding": null,
			"lastCommittedPoint": null,
			"startArrowhead": null,
			"endArrowhead": "arrow",
			"points": [
				[
					0,
					0
				],
				[
					-192.01561337425596,
					-253.8555036272321
				],
				[
					-87.3440406436012,
					-508.1532796223958
				]
			]
		},
		{
			"type": "text",
			"version": 49,
			"versionNonce": 9411023,
			"isDeleted": false,
			"id": "FhiVBt3t",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -288.4121834891196,
			"y": 17.609478033154733,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 212.375,
			"height": 38.4,
			"seed": 236907407,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704468623930,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "除了第一次firstTask，后面\n都getTask了",
			"rawText": "除了第一次firstTask，后面都getTask了",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "9T5J_Rpem9QWpIaawKaLO",
			"originalText": "除了第一次firstTask，后面都getTask了",
			"lineHeight": 1.2,
			"baseline": 34
		},
		{
			"type": "rectangle",
			"version": 136,
			"versionNonce": 1094041711,
			"isDeleted": false,
			"id": "3qxgcFYpSNZYS8bcqslo4",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 266.8575919015057,
			"y": -309.020890735447,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 154.22828311011904,
			"height": 68,
			"seed": 143757487,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "GQT0GLdJ"
				}
			],
			"updated": 1704468736513,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 113,
			"versionNonce": 1285675663,
			"isDeleted": false,
			"id": "GQT0GLdJ",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 271.97173345656523,
			"y": -303.820890735447,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 144,
			"height": 57.599999999999994,
			"seed": 1221817825,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704468736513,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "不用回收的线程，会\n使用blockqueue阻\n塞在这",
			"rawText": "不用回收的线程，会使用blockqueue阻塞在这",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "3qxgcFYpSNZYS8bcqslo4",
			"originalText": "不用回收的线程，会使用blockqueue阻塞在这",
			"lineHeight": 1.2,
			"baseline": 54
		},
		{
			"type": "rectangle",
			"version": 51,
			"versionNonce": 979040335,
			"isDeleted": false,
			"id": "4SpYSMDe9lTZl-MV6p1C4",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 463.52263096400577,
			"y": -76.40361604236625,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 239.93524460565482,
			"height": 87,
			"seed": 810140367,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "gYHVFgBW"
				}
			],
			"updated": 1704512235690,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 156,
			"versionNonce": 984474657,
			"isDeleted": false,
			"id": "gYHVFgBW",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 468.52263096400577,
			"y": -71.30361604236626,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 217.375,
			"height": 76.8,
			"seed": 1584322337,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704513087063,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "1、至少stop的状态+当前线程\n非中断\n2、清除当前线程中断成功并确\n保状态至少stop状态+非中断",
			"rawText": "1、至少stop的状态+当前线程非中断\n2、清除当前线程中断成功并确保状态至少stop状态+非中断",
			"textAlign": "left",
			"verticalAlign": "middle",
			"containerId": "4SpYSMDe9lTZl-MV6p1C4",
			"originalText": "1、至少stop的状态+当前线程非中断\n2、清除当前线程中断成功并确保状态至少stop状态+非中断",
			"lineHeight": 1.2,
			"baseline": 73
		},
		{
			"type": "rectangle",
			"version": 68,
			"versionNonce": 1565855375,
			"isDeleted": false,
			"id": "pL_KibyXWDNHFT2Ob0knR",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 681.2403955373828,
			"y": -128.4142809095493,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 176.08596075148807,
			"height": 87,
			"seed": 199654735,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "2Q8jSgLD"
				}
			],
			"updated": 1704513325841,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 113,
			"versionNonce": 1609721007,
			"isDeleted": false,
			"id": "2Q8jSgLD",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 686.5333759131269,
			"y": -123.3142809095493,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 165.5,
			"height": 76.8,
			"seed": 1743643137,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704513325841,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "重复判断了至少stop状\n态防止清除状态的时候\n调用了shutdowNow进\n入了stop状态",
			"rawText": "重复判断了至少stop状态防止清除状态的时候调用了shutdowNow进入了stop状态",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "pL_KibyXWDNHFT2Ob0knR",
			"originalText": "重复判断了至少stop状态防止清除状态的时候调用了shutdowNow进入了stop状态",
			"lineHeight": 1.2,
			"baseline": 73
		},
		{
			"type": "rectangle",
			"version": 300,
			"versionNonce": 864181711,
			"isDeleted": false,
			"id": "dkM04gF89L8hF8_szKMiH",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -156.12286059610318,
			"y": -35.27400976285617,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 143.31966435186746,
			"height": 52.16745314244605,
			"seed": 1247167727,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "dVQ2PDTs"
				}
			],
			"updated": 1704515330615,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 291,
			"versionNonce": 1064181569,
			"isDeleted": false,
			"id": "dVQ2PDTs",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -151.12286059610318,
			"y": -28.39028319163314,
			"strokeColor": "#1971c2",
			"backgroundColor": "transparent",
			"width": 117.5,
			"height": 38.4,
			"seed": 734995617,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704613421175,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "确保stop状态下\n是中断状态",
			"rawText": "确保stop状态下是中断状态",
			"textAlign": "left",
			"verticalAlign": "middle",
			"containerId": "dkM04gF89L8hF8_szKMiH",
			"originalText": "确保stop状态下是中断状态",
			"lineHeight": 1.2,
			"baseline": 34
		},
		{
			"type": "rectangle",
			"version": 69,
			"versionNonce": 1330604673,
			"isDeleted": false,
			"id": "aYGklveSOi1pUSz4V9STM",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 355.9916917927753,
			"y": 1297.0252311958143,
			"strokeColor": "#1971c2",
			"backgroundColor": "transparent",
			"width": 236.1920270725022,
			"height": 33.55381408671565,
			"seed": 1767752001,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "aRBtUR7S"
				}
			],
			"updated": 1704514573218,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 75,
			"versionNonce": 1105228385,
			"isDeleted": false,
			"id": "aRBtUR7S",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 382.52520532902645,
			"y": 1304.2021382391722,
			"strokeColor": "#1971c2",
			"backgroundColor": "transparent",
			"width": 183.125,
			"height": 19.2,
			"seed": 310340495,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704514573218,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "shutdownNow会触发中断",
			"rawText": "shutdownNow会触发中断",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "aYGklveSOi1pUSz4V9STM",
			"originalText": "shutdownNow会触发中断",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "arrow",
			"version": 79,
			"versionNonce": 1254995919,
			"isDeleted": false,
			"id": "xplyDxUzD8oEHF5f45vSb",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -4.844759768382687,
			"y": 166.78804322949304,
			"strokeColor": "#1971c2",
			"backgroundColor": "transparent",
			"width": 191.6892053993608,
			"height": 287.0172572269783,
			"seed": 1305120545,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"boundElements": [
				{
					"type": "text",
					"id": "zJWPPO0L"
				}
			],
			"updated": 1704613629592,
			"link": null,
			"locked": false,
			"startBinding": null,
			"endBinding": null,
			"lastCommittedPoint": null,
			"startArrowhead": "arrow",
			"endArrowhead": "arrow",
			"points": [
				[
					0,
					0
				],
				[
					-191.6892053993608,
					106.6683505915318
				],
				[
					-103.98217869715853,
					287.0172572269783
				]
			]
		},
		{
			"type": "text",
			"version": 221,
			"versionNonce": 350504367,
			"isDeleted": false,
			"id": "zJWPPO0L",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -276.5339651677435,
			"y": 215.85639382102485,
			"strokeColor": "#1971c2",
			"backgroundColor": "transparent",
			"width": 208,
			"height": 76.8,
			"seed": 363502287,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704613628666,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "注意：要防止任务出现异常，\n如果任务出现异常，就会造成\n任务执行完，线程就销毁（线\n程池应该只有队列的作用了）",
			"rawText": "注意：要防止任务出现异常，如果任务出现异常，就会造成任务执行完，线程就销毁（线程池应该只有队列的作用了）",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "xplyDxUzD8oEHF5f45vSb",
			"originalText": "注意：要防止任务出现异常，如果任务出现异常，就会造成任务执行完，线程就销毁（线程池应该只有队列的作用了）",
			"lineHeight": 1.2,
			"baseline": 73
		},
		{
			"type": "arrow",
			"version": 41,
			"versionNonce": 260927151,
			"isDeleted": false,
			"id": "mtX4Kj0lqZCO6OXdkgYpP",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 390.1289721994448,
			"y": 1029.4633312885062,
			"strokeColor": "#1971c2",
			"backgroundColor": "transparent",
			"width": 302.71764331815575,
			"height": 137.12834086640373,
			"seed": 1280018351,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"boundElements": [],
			"updated": 1704614634725,
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
					302.71764331815575,
					-137.12834086640373
				]
			]
		},
		{
			"type": "text",
			"version": 41,
			"versionNonce": 254188929,
			"isDeleted": false,
			"id": "o2Z4kccy",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 710.5914546164755,
			"y": 875.7574099663672,
			"strokeColor": "#1971c2",
			"backgroundColor": "transparent",
			"width": 178.75,
			"height": 19.2,
			"seed": 1549098785,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [
				{
					"id": "vO-mTv6M71oLpCddR8GgE",
					"type": "arrow"
				}
			],
			"updated": 1704614748909,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "正常终止的任务在这里-1",
			"rawText": "正常终止的任务在这里-1",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "正常终止的任务在这里-1",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "arrow",
			"version": 95,
			"versionNonce": 1712589825,
			"isDeleted": false,
			"id": "fkWrqgIE80wGKxhJlw1q7",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 271.2321281909997,
			"y": 204.14968541209078,
			"strokeColor": "#1971c2",
			"backgroundColor": "transparent",
			"width": 27.18371008788472,
			"height": 243.54880835384586,
			"seed": 2124493999,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"boundElements": [
				{
					"type": "text",
					"id": "5xLI9RxO"
				}
			],
			"updated": 1704614741396,
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
					27.18371008788472,
					243.54880835384586
				]
			]
		},
		{
			"type": "text",
			"version": 45,
			"versionNonce": 1130215457,
			"isDeleted": false,
			"id": "5xLI9RxO",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 204.82398323494203,
			"y": 306.7240895890137,
			"strokeColor": "#1971c2",
			"backgroundColor": "transparent",
			"width": 217.375,
			"height": 38.4,
			"seed": 686936111,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704614739926,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "异常终止的任务，在终止方法-\n1",
			"rawText": "异常终止的任务，在终止方法-1",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "fkWrqgIE80wGKxhJlw1q7",
			"originalText": "异常终止的任务，在终止方法-1",
			"lineHeight": 1.2,
			"baseline": 34
		},
		{
			"type": "arrow",
			"version": 108,
			"versionNonce": 1362861569,
			"isDeleted": false,
			"id": "vO-mTv6M71oLpCddR8GgE",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 850.9577696799572,
			"y": 873.0998366070701,
			"strokeColor": "#1971c2",
			"backgroundColor": "transparent",
			"width": 515.7297464491676,
			"height": 544.7849810107197,
			"seed": 1522391247,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"boundElements": [],
			"updated": 1704614757920,
			"link": null,
			"locked": false,
			"startBinding": {
				"elementId": "o2Z4kccy",
				"focus": 0.5910211877357398,
				"gap": 2.657573359297089
			},
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
					-106.04163530072128,
					-381.25402131563476
				],
				[
					-515.7297464491676,
					-544.7849810107197
				]
			]
		},
		{
			"id": "pwqsEZWkM4ATkVO2GBdR2",
			"type": "arrow",
			"x": -57.43350755702181,
			"y": 1290.662024714203,
			"width": 262.5809652764553,
			"height": 316.2224741286659,
			"angle": 0,
			"strokeColor": "#1971c2",
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
			"seed": 1693566081,
			"version": 264,
			"versionNonce": 962100801,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "4Y4cTIhq"
				}
			],
			"updated": 1704619010791,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					-262.5809652764553,
					-141.43328896039543
				],
				[
					-45.59706913541902,
					-316.2224741286659
				]
			],
			"lastCommittedPoint": null,
			"startBinding": {
				"elementId": "hB-lo38wATbadByAR7Quw",
				"focus": -0.7336086362623034,
				"gap": 2.122491292606213
			},
			"endBinding": null,
			"startArrowhead": null,
			"endArrowhead": "triangle"
		},
		{
			"id": "4Y4cTIhq",
			"type": "text",
			"x": -407.4530460697782,
			"y": 1159.4234050429602,
			"width": 176,
			"height": 57.599999999999994,
			"angle": 0,
			"strokeColor": "#1971c2",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"groupIds": [],
			"frameId": null,
			"roundness": null,
			"seed": 467140655,
			"version": 158,
			"versionNonce": 1502060993,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704618997615,
			"link": null,
			"locked": false,
			"text": "重新循环的时候再处理超\n时，这样可以重新判断状\n态并且不用写重复代码",
			"rawText": "重新循环的时候再处理超时，这样可以重新判断状态并且不用写重复代码",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 54,
			"containerId": "pwqsEZWkM4ATkVO2GBdR2",
			"originalText": "重新循环的时候再处理超时，这样可以重新判断状态并且不用写重复代码",
			"lineHeight": 1.2
		}
	],
	"appState": {
		"theme": "light",
		"viewBackgroundColor": "#ffffff",
		"currentItemStrokeColor": "#1971c2",
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
		"scrollX": 738.6785492039081,
		"scrollY": -479.18368610772336,
		"zoom": {
			"value": 1.0411031529333854
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