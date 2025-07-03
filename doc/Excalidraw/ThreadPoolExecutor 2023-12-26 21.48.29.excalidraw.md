---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠==


# Text Elements

    private boolean addWorker(Runnable firstTask, boolean core) {
        retry:
        for (int c = ctl.get();;) {
            // Check if queue empty only if necessary.
            if (runStateAtLeast(c, SHUTDOWN)
                && (runStateAtLeast(c, STOP)
                    || firstTask != null
                    || workQueue.isEmpty()))
                return false;

            for (;;) {
                if (workerCountOf(c)
                    >= ((core ? corePoolSize : maximumPoolSize) & COUNT_MASK))
                    return false;
                if (compareAndIncrementWorkerCount(c))
                    break retry;
                c = ctl.get();  // Re-read ctl
                if (runStateAtLeast(c, SHUTDOWN))
                    continue retry;
                // else CAS failed due to workerCount change; retry inner loop
            }
        }

        boolean workerStarted = false;
        boolean workerAdded = false;
        Worker w = null;
        try {
            w = new Worker(firstTask);
            final Thread t = w.thread;
            if (t != null) {
                final ReentrantLock mainLock = this.mainLock;
                mainLock.lock();
                try {
                    // Recheck while holding lock.
                    // Back out on ThreadFactory failure or if
                    // shut down before lock acquired.
                    int c = ctl.get();

                    if (isRunning(c) ||
                        (runStateLessThan(c, STOP) && firstTask == null)) {
                        if (t.getState() != Thread.State.NEW)
                            throw new IllegalThreadStateException();
                        workers.add(w);
                        workerAdded = true;
                        int s = workers.size();
                        if (s > largestPoolSize)
                            largestPoolSize = s;
                    }
                } finally {
                    mainLock.unlock();
                }
                if (workerAdded) {
                    t.start();
                    workerStarted = true;
                }
            }
        } finally {
            if (! workerStarted)
                addWorkerFailed(w);
        }
        return workerStarted;
    }

   

  
 ^NPcqCzcP

满足return false条件的情况有：
1、stop、tidying、terminated状态
2、shutdown状态+firstTask不为null
3、shutdown状态+工作队列为空
 ^3Yhb8X9L

防止数值超出COUNT_MASK ^QDnp1mor

尝试自增 ^BnthpH9M

cas失败，重新循环 ^M4Poncut

状态变化 ^rMWwuyIW

线程是否启动成功 ^NyTyJsmO

线程是否添加成功，基本可以认为添加成功就能启动成功 ^rxsDpxRS

添加到工作线程集合 ^MSNhqP1k

线程启动 ^P0mIVURa

线程启动失败 ^mGrdNTJH

    public void execute(Runnable command) {
        if (command == null)
            throw new NullPointerException();
        /*
         * Proceed in 3 steps:
         *
         * 1. If fewer than corePoolSize threads are running, try to
         * start a new thread with the given command as its first
         * task.  The call to addWorker atomically checks runState and
         * workerCount, and so prevents false alarms that would add
         * threads when it shouldn't, by returning false.
         *
         * 2. If a task can be successfully queued, then we still need
         * to double-check whether we should have added a thread
         * (because existing ones died since last checking) or that
         * the pool shut down since entry into this method. So we
         * recheck state and if necessary roll back the enqueuing if
         * stopped, or start a new thread if there are none.
         *
         * 3. If we cannot queue task, then we try to add a new
         * thread.  If it fails, we know we are shut down or saturated
         * and so reject the task.
         */
        int c = ctl.get();
        if (workerCountOf(c) < corePoolSize) {
            if (addWorker(command, true))
                return;
            c = ctl.get();
        }
        if (isRunning(c) && workQueue.offer(command)) {
            int recheck = ctl.get();
            if (! isRunning(recheck) && remove(command))
                reject(command);
            else if (workerCountOf(recheck) == 0)
                addWorker(null, false);
        }
        else if (!addWorker(command, false))
            reject(command);
    }
 ^uEgW2oxe

线程数小于核心线程数 ^agqkj0jG

队列未满 ^ItWAXEVb

队列已满，尝试使用非核心线程 ^rILL5G1r

如果核心线程数为0，直接开启一个工作线程正常应该在队列未满之前只有一个线程，如果并发多个线程同时到这个方法，会产生多个线程 ^tk7Hguty

运行状态，尝试放入队列 ^MOo5wHHN

放入队列后，重新检查运行状态，否则移除并拒绝 ^Y0I9J28I

因为ctl前三位是状态，所以COUNT_MAK是线程最大值
 ^OxVDl7XY

占位成功 ^bwdvew9g

正常提交的firstTask，不应该为空
只有这里，核心线程数为空的时候 ^5M0yN7LH

firstTask为null，队列为空，应该也只有上面的情况，原task放入后，队列中的task都被其他线程poll了 ^RNgtVFuR

可能会有把其他线程提交任务执行的情况，队列就为空了 ^TUnUNpdN

添加核心线程 ^lGroBr57

添加失败：1、状态不对，2、线程数满了（核心线程或最大线程） ^wucn5LbN

核心线程数为0的情况 ^xCeLv8rH

状态正常 ^aS9IjQWD

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
			"version": 998,
			"versionNonce": 1843842881,
			"isDeleted": false,
			"id": "NPcqCzcP",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": -201.25662499566073,
			"y": 9129.248388477754,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "#ffffff",
			"width": 731.25,
			"height": 1305.6,
			"seed": 1591035480,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704604110416,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "\n    private boolean addWorker(Runnable firstTask, boolean core) {\n        retry:\n        for (int c = ctl.get();;) {\n            // Check if queue empty only if necessary.\n            if (runStateAtLeast(c, SHUTDOWN)\n                && (runStateAtLeast(c, STOP)\n                    || firstTask != null\n                    || workQueue.isEmpty()))\n                return false;\n\n            for (;;) {\n                if (workerCountOf(c)\n                    >= ((core ? corePoolSize : maximumPoolSize) & COUNT_MASK))\n                    return false;\n                if (compareAndIncrementWorkerCount(c))\n                    break retry;\n                c = ctl.get();  // Re-read ctl\n                if (runStateAtLeast(c, SHUTDOWN))\n                    continue retry;\n                // else CAS failed due to workerCount change; retry inner loop\n            }\n        }\n\n        boolean workerStarted = false;\n        boolean workerAdded = false;\n        Worker w = null;\n        try {\n            w = new Worker(firstTask);\n            final Thread t = w.thread;\n            if (t != null) {\n                final ReentrantLock mainLock = this.mainLock;\n                mainLock.lock();\n                try {\n                    // Recheck while holding lock.\n                    // Back out on ThreadFactory failure or if\n                    // shut down before lock acquired.\n                    int c = ctl.get();\n\n                    if (isRunning(c) ||\n                        (runStateLessThan(c, STOP) && firstTask == null)) {\n                        if (t.getState() != Thread.State.NEW)\n                            throw new IllegalThreadStateException();\n                        workers.add(w);\n                        workerAdded = true;\n                        int s = workers.size();\n                        if (s > largestPoolSize)\n                            largestPoolSize = s;\n                    }\n                } finally {\n                    mainLock.unlock();\n                }\n                if (workerAdded) {\n                    t.start();\n                    workerStarted = true;\n                }\n            }\n        } finally {\n            if (! workerStarted)\n                addWorkerFailed(w);\n        }\n        return workerStarted;\n    }\n\n   \n\n  \n",
			"rawText": "\n    private boolean addWorker(Runnable firstTask, boolean core) {\n        retry:\n        for (int c = ctl.get();;) {\n            // Check if queue empty only if necessary.\n            if (runStateAtLeast(c, SHUTDOWN)\n                && (runStateAtLeast(c, STOP)\n                    || firstTask != null\n                    || workQueue.isEmpty()))\n                return false;\n\n            for (;;) {\n                if (workerCountOf(c)\n                    >= ((core ? corePoolSize : maximumPoolSize) & COUNT_MASK))\n                    return false;\n                if (compareAndIncrementWorkerCount(c))\n                    break retry;\n                c = ctl.get();  // Re-read ctl\n                if (runStateAtLeast(c, SHUTDOWN))\n                    continue retry;\n                // else CAS failed due to workerCount change; retry inner loop\n            }\n        }\n\n        boolean workerStarted = false;\n        boolean workerAdded = false;\n        Worker w = null;\n        try {\n            w = new Worker(firstTask);\n            final Thread t = w.thread;\n            if (t != null) {\n                final ReentrantLock mainLock = this.mainLock;\n                mainLock.lock();\n                try {\n                    // Recheck while holding lock.\n                    // Back out on ThreadFactory failure or if\n                    // shut down before lock acquired.\n                    int c = ctl.get();\n\n                    if (isRunning(c) ||\n                        (runStateLessThan(c, STOP) && firstTask == null)) {\n                        if (t.getState() != Thread.State.NEW)\n                            throw new IllegalThreadStateException();\n                        workers.add(w);\n                        workerAdded = true;\n                        int s = workers.size();\n                        if (s > largestPoolSize)\n                            largestPoolSize = s;\n                    }\n                } finally {\n                    mainLock.unlock();\n                }\n                if (workerAdded) {\n                    t.start();\n                    workerStarted = true;\n                }\n            }\n        } finally {\n            if (! workerStarted)\n                addWorkerFailed(w);\n        }\n        return workerStarted;\n    }\n\n   \n\n  \n",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "\n    private boolean addWorker(Runnable firstTask, boolean core) {\n        retry:\n        for (int c = ctl.get();;) {\n            // Check if queue empty only if necessary.\n            if (runStateAtLeast(c, SHUTDOWN)\n                && (runStateAtLeast(c, STOP)\n                    || firstTask != null\n                    || workQueue.isEmpty()))\n                return false;\n\n            for (;;) {\n                if (workerCountOf(c)\n                    >= ((core ? corePoolSize : maximumPoolSize) & COUNT_MASK))\n                    return false;\n                if (compareAndIncrementWorkerCount(c))\n                    break retry;\n                c = ctl.get();  // Re-read ctl\n                if (runStateAtLeast(c, SHUTDOWN))\n                    continue retry;\n                // else CAS failed due to workerCount change; retry inner loop\n            }\n        }\n\n        boolean workerStarted = false;\n        boolean workerAdded = false;\n        Worker w = null;\n        try {\n            w = new Worker(firstTask);\n            final Thread t = w.thread;\n            if (t != null) {\n                final ReentrantLock mainLock = this.mainLock;\n                mainLock.lock();\n                try {\n                    // Recheck while holding lock.\n                    // Back out on ThreadFactory failure or if\n                    // shut down before lock acquired.\n                    int c = ctl.get();\n\n                    if (isRunning(c) ||\n                        (runStateLessThan(c, STOP) && firstTask == null)) {\n                        if (t.getState() != Thread.State.NEW)\n                            throw new IllegalThreadStateException();\n                        workers.add(w);\n                        workerAdded = true;\n                        int s = workers.size();\n                        if (s > largestPoolSize)\n                            largestPoolSize = s;\n                    }\n                } finally {\n                    mainLock.unlock();\n                }\n                if (workerAdded) {\n                    t.start();\n                    workerStarted = true;\n                }\n            }\n        } finally {\n            if (! workerStarted)\n                addWorkerFailed(w);\n        }\n        return workerStarted;\n    }\n\n   \n\n  \n",
			"lineHeight": 1.2,
			"baseline": 1301
		},
		{
			"type": "text",
			"version": 1269,
			"versionNonce": 1679917391,
			"isDeleted": false,
			"id": "3Yhb8X9L",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 216.99917987829986,
			"y": 9223.79962438632,
			"strokeColor": "#e03131",
			"backgroundColor": "#ffffff",
			"width": 295.625,
			"height": 96,
			"seed": 1380964225,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"boundElements": [
				{
					"id": "PVllQbFBx98HcNm1HMl11",
					"type": "arrow"
				}
			],
			"updated": 1704604110416,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "满足return false条件的情况有：\n1、stop、tidying、terminated状态\n2、shutdown状态+firstTask不为null\n3、shutdown状态+工作队列为空\n",
			"rawText": "满足return false条件的情况有：\n1、stop、tidying、terminated状态\n2、shutdown状态+firstTask不为null\n3、shutdown状态+工作队列为空\n",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "满足return false条件的情况有：\n1、stop、tidying、terminated状态\n2、shutdown状态+firstTask不为null\n3、shutdown状态+工作队列为空\n",
			"lineHeight": 1.2,
			"baseline": 92
		},
		{
			"type": "text",
			"version": 909,
			"versionNonce": 162348833,
			"isDeleted": false,
			"id": "QDnp1mor",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 537.2834835501749,
			"y": 9376.21291101714,
			"strokeColor": "#e03131",
			"backgroundColor": "#ffffff",
			"width": 189.75,
			"height": 19.2,
			"seed": 1145782113,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704604110416,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "防止数值超出COUNT_MASK",
			"rawText": "防止数值超出COUNT_MASK",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "防止数值超出COUNT_MASK",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "text",
			"version": 813,
			"versionNonce": 572686191,
			"isDeleted": false,
			"id": "BnthpH9M",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 313.61395881264707,
			"y": 9416.29126303802,
			"strokeColor": "#e03131",
			"backgroundColor": "#ffffff",
			"width": 64,
			"height": 19.2,
			"seed": 1447996225,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704604110416,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "尝试自增",
			"rawText": "尝试自增",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "尝试自增",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "text",
			"version": 833,
			"versionNonce": 1725608705,
			"isDeleted": false,
			"id": "M4Poncut",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 542.5200546240003,
			"y": 9510.89252370688,
			"strokeColor": "#e03131",
			"backgroundColor": "#ffffff",
			"width": 140.125,
			"height": 19.2,
			"seed": 1354341153,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704604110416,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "cas失败，重新循环",
			"rawText": "cas失败，重新循环",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "cas失败，重新循环",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "arrow",
			"version": 939,
			"versionNonce": 262060431,
			"isDeleted": false,
			"id": "CT31Rn4KSTnW4XvIcaPMm",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 502.5828249116522,
			"y": 9514.803201463397,
			"strokeColor": "#e03131",
			"backgroundColor": "#ffffff",
			"width": 368.23494480852673,
			"height": 141.92377753466644,
			"seed": 1140559617,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"boundElements": [],
			"updated": 1704604110416,
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
					-99.66661811738527,
					-93.24361376656816
				],
				[
					-368.23494480852673,
					-141.92377753466644
				]
			]
		},
		{
			"type": "text",
			"version": 857,
			"versionNonce": 1240378081,
			"isDeleted": false,
			"id": "rMWwuyIW",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 266.9355069435477,
			"y": 9474.138537610426,
			"strokeColor": "#e03131",
			"backgroundColor": "#ffffff",
			"width": 64,
			"height": 19.2,
			"seed": 110364385,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704604110416,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "状态变化",
			"rawText": "状态变化",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "状态变化",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "text",
			"version": 949,
			"versionNonce": 298758063,
			"isDeleted": false,
			"id": "NyTyJsmO",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 158.65848132612393,
			"y": 9592.162316623851,
			"strokeColor": "#e03131",
			"backgroundColor": "#ffffff",
			"width": 128,
			"height": 19.2,
			"seed": 1930592961,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704604110416,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "线程是否启动成功",
			"rawText": "线程是否启动成功",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "线程是否启动成功",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "text",
			"version": 1057,
			"versionNonce": 997762753,
			"isDeleted": false,
			"id": "rxsDpxRS",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 146.2277022965709,
			"y": 9612.714103395927,
			"strokeColor": "#e03131",
			"backgroundColor": "#ffffff",
			"width": 400,
			"height": 19.2,
			"seed": 1712751265,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704604110416,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "线程是否添加成功，基本可以认为添加成功就能启动成功",
			"rawText": "线程是否添加成功，基本可以认为添加成功就能启动成功",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "线程是否添加成功，基本可以认为添加成功就能启动成功",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "text",
			"version": 970,
			"versionNonce": 1390076367,
			"isDeleted": false,
			"id": "MSNhqP1k",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 167.20099940683576,
			"y": 9956.90733655025,
			"strokeColor": "#e03131",
			"backgroundColor": "#ffffff",
			"width": 144,
			"height": 19.2,
			"seed": 2085586561,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"boundElements": [
				{
					"id": "cVq_sJ9i6giQtWwisZ1JO",
					"type": "arrow"
				}
			],
			"updated": 1704604110416,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "添加到工作线程集合",
			"rawText": "添加到工作线程集合",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "添加到工作线程集合",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "text",
			"version": 879,
			"versionNonce": 102246049,
			"isDeleted": false,
			"id": "P0mIVURa",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 81.13462805140273,
			"y": 10146.151976773872,
			"strokeColor": "#e03131",
			"backgroundColor": "#ffffff",
			"width": 64,
			"height": 19.2,
			"seed": 276631137,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"boundElements": [
				{
					"id": "cVq_sJ9i6giQtWwisZ1JO",
					"type": "arrow"
				}
			],
			"updated": 1704604110416,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "线程启动",
			"rawText": "线程启动",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "线程启动",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "text",
			"version": 852,
			"versionNonce": 601608175,
			"isDeleted": false,
			"id": "mGrdNTJH",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 107.17377887483258,
			"y": 10243.664874960066,
			"strokeColor": "#e03131",
			"backgroundColor": "#ffffff",
			"width": 96,
			"height": 19.2,
			"seed": 2037291585,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704604110416,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "线程启动失败",
			"rawText": "线程启动失败",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "线程启动失败",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "text",
			"version": 345,
			"versionNonce": 1954327169,
			"isDeleted": false,
			"id": "uEgW2oxe",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": -201.25662548120576,
			"y": 8370.92261536577,
			"strokeColor": "#1e1e1e",
			"backgroundColor": "#ffffff",
			"width": 656.25,
			"height": 768,
			"seed": 1758843727,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704604110416,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "    public void execute(Runnable command) {\n        if (command == null)\n            throw new NullPointerException();\n        /*\n         * Proceed in 3 steps:\n         *\n         * 1. If fewer than corePoolSize threads are running, try to\n         * start a new thread with the given command as its first\n         * task.  The call to addWorker atomically checks runState and\n         * workerCount, and so prevents false alarms that would add\n         * threads when it shouldn't, by returning false.\n         *\n         * 2. If a task can be successfully queued, then we still need\n         * to double-check whether we should have added a thread\n         * (because existing ones died since last checking) or that\n         * the pool shut down since entry into this method. So we\n         * recheck state and if necessary roll back the enqueuing if\n         * stopped, or start a new thread if there are none.\n         *\n         * 3. If we cannot queue task, then we try to add a new\n         * thread.  If it fails, we know we are shut down or saturated\n         * and so reject the task.\n         */\n        int c = ctl.get();\n        if (workerCountOf(c) < corePoolSize) {\n            if (addWorker(command, true))\n                return;\n            c = ctl.get();\n        }\n        if (isRunning(c) && workQueue.offer(command)) {\n            int recheck = ctl.get();\n            if (! isRunning(recheck) && remove(command))\n                reject(command);\n            else if (workerCountOf(recheck) == 0)\n                addWorker(null, false);\n        }\n        else if (!addWorker(command, false))\n            reject(command);\n    }\n",
			"rawText": "    public void execute(Runnable command) {\n        if (command == null)\n            throw new NullPointerException();\n        /*\n         * Proceed in 3 steps:\n         *\n         * 1. If fewer than corePoolSize threads are running, try to\n         * start a new thread with the given command as its first\n         * task.  The call to addWorker atomically checks runState and\n         * workerCount, and so prevents false alarms that would add\n         * threads when it shouldn't, by returning false.\n         *\n         * 2. If a task can be successfully queued, then we still need\n         * to double-check whether we should have added a thread\n         * (because existing ones died since last checking) or that\n         * the pool shut down since entry into this method. So we\n         * recheck state and if necessary roll back the enqueuing if\n         * stopped, or start a new thread if there are none.\n         *\n         * 3. If we cannot queue task, then we try to add a new\n         * thread.  If it fails, we know we are shut down or saturated\n         * and so reject the task.\n         */\n        int c = ctl.get();\n        if (workerCountOf(c) < corePoolSize) {\n            if (addWorker(command, true))\n                return;\n            c = ctl.get();\n        }\n        if (isRunning(c) && workQueue.offer(command)) {\n            int recheck = ctl.get();\n            if (! isRunning(recheck) && remove(command))\n                reject(command);\n            else if (workerCountOf(recheck) == 0)\n                addWorker(null, false);\n        }\n        else if (!addWorker(command, false))\n            reject(command);\n    }\n",
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "    public void execute(Runnable command) {\n        if (command == null)\n            throw new NullPointerException();\n        /*\n         * Proceed in 3 steps:\n         *\n         * 1. If fewer than corePoolSize threads are running, try to\n         * start a new thread with the given command as its first\n         * task.  The call to addWorker atomically checks runState and\n         * workerCount, and so prevents false alarms that would add\n         * threads when it shouldn't, by returning false.\n         *\n         * 2. If a task can be successfully queued, then we still need\n         * to double-check whether we should have added a thread\n         * (because existing ones died since last checking) or that\n         * the pool shut down since entry into this method. So we\n         * recheck state and if necessary roll back the enqueuing if\n         * stopped, or start a new thread if there are none.\n         *\n         * 3. If we cannot queue task, then we try to add a new\n         * thread.  If it fails, we know we are shut down or saturated\n         * and so reject the task.\n         */\n        int c = ctl.get();\n        if (workerCountOf(c) < corePoolSize) {\n            if (addWorker(command, true))\n                return;\n            c = ctl.get();\n        }\n        if (isRunning(c) && workQueue.offer(command)) {\n            int recheck = ctl.get();\n            if (! isRunning(recheck) && remove(command))\n                reject(command);\n            else if (workerCountOf(recheck) == 0)\n                addWorker(null, false);\n        }\n        else if (!addWorker(command, false))\n            reject(command);\n    }\n",
			"lineHeight": 1.2,
			"baseline": 764
		},
		{
			"type": "rectangle",
			"version": 314,
			"versionNonce": 517601807,
			"isDeleted": false,
			"id": "-C3j5jfWAoxz5SZzIyRtK",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 231.632495030457,
			"y": 8826.901828058033,
			"strokeColor": "#e03131",
			"backgroundColor": "#ffffff",
			"width": 158.90008739796826,
			"height": 27,
			"seed": 1551922913,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "agqkj0jG"
				}
			],
			"updated": 1704604110416,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 529,
			"versionNonce": 1332064865,
			"isDeleted": false,
			"id": "agqkj0jG",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 240.632557039988,
			"y": 8831.94437400866,
			"strokeColor": "#e03131",
			"backgroundColor": "#ffffff",
			"width": 140.89996337890625,
			"height": 16.914908098743915,
			"seed": 661876353,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704604110416,
			"link": null,
			"locked": false,
			"fontSize": 14.095756748953262,
			"fontFamily": 3,
			"text": "线程数小于核心线程数",
			"rawText": "线程数小于核心线程数",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "-C3j5jfWAoxz5SZzIyRtK",
			"originalText": "线程数小于核心线程数",
			"lineHeight": 1.2,
			"baseline": 13
		},
		{
			"type": "rectangle",
			"version": 327,
			"versionNonce": 147709999,
			"isDeleted": false,
			"id": "lJwzhkOrx22ppjaTQTEKu",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": -172.4921531053795,
			"y": 8976.042081182892,
			"strokeColor": "#e03131",
			"backgroundColor": "#ffffff",
			"width": 77.28541820820135,
			"height": 29.2,
			"seed": 1609602305,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "ItWAXEVb"
				}
			],
			"updated": 1704604110416,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 260,
			"versionNonce": 463650369,
			"isDeleted": false,
			"id": "ItWAXEVb",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": -165.8494440012788,
			"y": 8981.042081182892,
			"strokeColor": "#e03131",
			"backgroundColor": "#ffffff",
			"width": 64,
			"height": 19.2,
			"seed": 2081053167,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704604110416,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "队列未满",
			"rawText": "队列未满",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "lJwzhkOrx22ppjaTQTEKu",
			"originalText": "队列未满",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "arrow",
			"version": 136,
			"versionNonce": 1939866191,
			"isDeleted": false,
			"id": "R07j44TcMx88vijDHo1SZ",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": -131.1651109087473,
			"y": 8936.95794184873,
			"strokeColor": "#e03131",
			"backgroundColor": "#ffffff",
			"width": 1.0843701100270664,
			"height": 118.35340001917939,
			"seed": 975670305,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"boundElements": [],
			"updated": 1704604110416,
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
					-1.0843701100270664,
					118.35340001917939
				]
			]
		},
		{
			"type": "rectangle",
			"version": 567,
			"versionNonce": 403918369,
			"isDeleted": false,
			"id": "u9l5avXYvXBs195ZOAMfN",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 216.57948124392306,
			"y": 9057.85020587302,
			"strokeColor": "#e03131",
			"backgroundColor": "#ffffff",
			"width": 236.97541391181426,
			"height": 29.2,
			"seed": 1141601889,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "rILL5G1r"
				}
			],
			"updated": 1704604110416,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 543,
			"versionNonce": 539549807,
			"isDeleted": false,
			"id": "rILL5G1r",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 223.06718819983018,
			"y": 9062.85020587302,
			"strokeColor": "#e03131",
			"backgroundColor": "#ffffff",
			"width": 224,
			"height": 19.2,
			"seed": 155560673,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704604110416,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "队列已满，尝试使用非核心线程",
			"rawText": "队列已满，尝试使用非核心线程",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "u9l5avXYvXBs195ZOAMfN",
			"originalText": "队列已满，尝试使用非核心线程",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "rectangle",
			"version": 794,
			"versionNonce": 2074534401,
			"isDeleted": false,
			"id": "KXM6VuiRur7K_thpxEJZ5",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 269.43725491601793,
			"y": 9009.400890787421,
			"strokeColor": "#1971c2",
			"backgroundColor": "#ffc9c9",
			"width": 676.5975068952836,
			"height": 49,
			"seed": 1369465281,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "tk7Hguty"
				},
				{
					"id": "tNF9R-U8jlwUTz34plAo9",
					"type": "arrow"
				}
			],
			"updated": 1704604110417,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 966,
			"versionNonce": 540080783,
			"isDeleted": false,
			"id": "tk7Hguty",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 275.0485083636597,
			"y": 9014.70089078742,
			"strokeColor": "#1971c2",
			"backgroundColor": "#ffffff",
			"width": 665.375,
			"height": 38.4,
			"seed": 2131517135,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704604110417,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "如果核心线程数为0，直接开启一个工作线程正常应该在队列未满之前只有一个线程，如果并发\n多个线程同时到这个方法，会产生多个线程",
			"rawText": "如果核心线程数为0，直接开启一个工作线程正常应该在队列未满之前只有一个线程，如果并发多个线程同时到这个方法，会产生多个线程",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "KXM6VuiRur7K_thpxEJZ5",
			"originalText": "如果核心线程数为0，直接开启一个工作线程正常应该在队列未满之前只有一个线程，如果并发多个线程同时到这个方法，会产生多个线程",
			"lineHeight": 1.2,
			"baseline": 34
		},
		{
			"type": "rectangle",
			"version": 224,
			"versionNonce": 1935473121,
			"isDeleted": false,
			"id": "j_c6jZrZsJ8IDJhZ1grqM",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 316.37619969327307,
			"y": 8921.938348854463,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 190.06575336520254,
			"height": 29.847522221971303,
			"seed": 40235585,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "MOo5wHHN"
				}
			],
			"updated": 1704604110417,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 319,
			"versionNonce": 946917551,
			"isDeleted": false,
			"id": "MOo5wHHN",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 323.40907637587435,
			"y": 8927.262109965448,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 176,
			"height": 19.2,
			"seed": 1306498383,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704604110417,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "运行状态，尝试放入队列",
			"rawText": "运行状态，尝试放入队列",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "j_c6jZrZsJ8IDJhZ1grqM",
			"originalText": "运行状态，尝试放入队列",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "rectangle",
			"version": 685,
			"versionNonce": 1615140289,
			"isDeleted": false,
			"id": "Rjbnxjn56y020NAZrmU09",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 326.70040116832195,
			"y": 8964.723364910808,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 373.23717152465525,
			"height": 29.2,
			"seed": 1612062671,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "Y0I9J28I"
				}
			],
			"updated": 1704604110417,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 538,
			"versionNonce": 43049679,
			"isDeleted": false,
			"id": "Y0I9J28I",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 337.31898693064954,
			"y": 8969.723364910808,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 352,
			"height": 19.2,
			"seed": 723555617,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704604110417,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "放入队列后，重新检查运行状态，否则移除并拒绝",
			"rawText": "放入队列后，重新检查运行状态，否则移除并拒绝",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "Rjbnxjn56y020NAZrmU09",
			"originalText": "放入队列后，重新检查运行状态，否则移除并拒绝",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "rectangle",
			"version": 390,
			"versionNonce": 1434367393,
			"isDeleted": false,
			"id": "3gimwo_5ZtpnIiwnr9xtI",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 395.2002875447298,
			"y": 9373.111691972746,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 344.9241793112404,
			"height": 25.214576160005915,
			"seed": 690602639,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [],
			"updated": 1704604110417,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 252,
			"versionNonce": 1328132335,
			"isDeleted": false,
			"id": "OxVDl7XY",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "solid",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 390.7075218905611,
			"y": 9347.683885904646,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 372.243896484375,
			"height": 37.1970860796795,
			"seed": 1839231279,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704604110417,
			"link": null,
			"locked": false,
			"fontSize": 15.498785866533126,
			"fontFamily": 3,
			"text": "因为ctl前三位是状态，所以COUNT_MAK是线程最大值\n",
			"rawText": "因为ctl前三位是状态，所以COUNT_MAK是线程最大值\n",
			"textAlign": "center",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "因为ctl前三位是状态，所以COUNT_MAK是线程最大值\n",
			"lineHeight": 1.2,
			"baseline": 33
		},
		{
			"type": "arrow",
			"version": 504,
			"versionNonce": 1446599041,
			"isDeleted": false,
			"id": "v4U7MtJ_5coL_d4thSVZp",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": -11.077440970335033,
			"y": 9502.193100683244,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 177.05639805124605,
			"height": 325.4871323502357,
			"seed": 1427317377,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704604110417,
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
					-171.9059847420948,
					-2.5087918579502
				],
				[
					-177.05639805124605,
					-325.4871323502357
				],
				[
					-120.15910770285188,
					-325.0696679142966
				]
			]
		},
		{
			"type": "arrow",
			"version": 327,
			"versionNonce": 1204009743,
			"isDeleted": false,
			"id": "PrkgU9XaGSvxVk4cM9Ufp",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": -9.944351355516005,
			"y": 9446.894230314172,
			"strokeColor": "#f08c00",
			"backgroundColor": "transparent",
			"width": 118.22659478437623,
			"height": 152.68909478859314,
			"seed": 103422945,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"boundElements": [
				{
					"type": "text",
					"id": "bwdvew9g"
				}
			],
			"updated": 1704604110417,
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
					-118.22659478437623,
					-0.8328277611617523
				],
				[
					-117.1820636233071,
					151.8562670274314
				]
			]
		},
		{
			"type": "text",
			"version": 133,
			"versionNonce": 1404338529,
			"isDeleted": false,
			"id": "bwdvew9g",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": -178.10858796419762,
			"y": 9436.501257996957,
			"strokeColor": "#f08c00",
			"backgroundColor": "transparent",
			"width": 64,
			"height": 19.2,
			"seed": 222010369,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704604110417,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "占位成功",
			"rawText": "占位成功",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "PrkgU9XaGSvxVk4cM9Ufp",
			"originalText": "占位成功",
			"lineHeight": 1.2,
			"baseline": 15
		},
		{
			"type": "arrow",
			"version": 459,
			"versionNonce": 1356300591,
			"isDeleted": false,
			"id": "PVllQbFBx98HcNm1HMl11",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 513.463733761261,
			"y": 9272.176795281044,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 540.2398204461872,
			"height": 236.6101817751478,
			"seed": 1823325423,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"boundElements": [
				{
					"type": "text",
					"id": "5M0yN7LH"
				}
			],
			"updated": 1704604110417,
			"link": null,
			"locked": false,
			"startBinding": {
				"elementId": "3Yhb8X9L",
				"focus": 0.7615097333945993,
				"gap": 1
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
					183.60647939766318,
					-184.0333003422711
				],
				[
					-356.633341048524,
					-236.6101817751478
				]
			]
		},
		{
			"type": "text",
			"version": 173,
			"versionNonce": 1799335233,
			"isDeleted": false,
			"id": "5M0yN7LH",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 566.8827131589242,
			"y": 9068.943494938772,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 260.375,
			"height": 38.4,
			"seed": 1155229057,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704604110417,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "正常提交的firstTask，不应该为空\n只有这里，核心线程数为空的时候",
			"rawText": "正常提交的firstTask，不应该为空\n只有这里，核心线程数为空的时候",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "PVllQbFBx98HcNm1HMl11",
			"originalText": "正常提交的firstTask，不应该为空\n只有这里，核心线程数为空的时候",
			"lineHeight": 1.2,
			"baseline": 34
		},
		{
			"type": "arrow",
			"version": 722,
			"versionNonce": 734888783,
			"isDeleted": false,
			"id": "pZQY8QwPFmd9AEOcbsT_S",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 456.98640291778577,
			"y": 9293.104219168628,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 233.70641393192227,
			"height": 146.40115983419855,
			"seed": 1390175791,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"boundElements": [
				{
					"type": "text",
					"id": "RNgtVFuR"
				}
			],
			"updated": 1704604110417,
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
					224.94845917831344,
					-12.04698094504056
				],
				[
					233.70641393192227,
					-146.40115983419855
				]
			]
		},
		{
			"type": "text",
			"version": 303,
			"versionNonce": 1681546529,
			"isDeleted": false,
			"id": "RNgtVFuR",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 596.9973620960991,
			"y": 9233.057238223588,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 217.875,
			"height": 76.8,
			"seed": 514729025,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704604110417,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "firstTask为null，队列为空\n，应该也只有上面的情况，原t\nask放入后，队列中的task都\n被其他线程poll了",
			"rawText": "firstTask为null，队列为空，应该也只有上面的情况，原task放入后，队列中的task都被其他线程poll了",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "pZQY8QwPFmd9AEOcbsT_S",
			"originalText": "firstTask为null，队列为空，应该也只有上面的情况，原task放入后，队列中的task都被其他线程poll了",
			"lineHeight": 1.2,
			"baseline": 73
		},
		{
			"type": "arrow",
			"version": 247,
			"versionNonce": 1493057903,
			"isDeleted": false,
			"id": "tNF9R-U8jlwUTz34plAo9",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 918.5383137509777,
			"y": 9062.730593624696,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 145.5619302513188,
			"height": 240.91443840201646,
			"seed": 929424623,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"boundElements": [
				{
					"type": "text",
					"id": "TUnUNpdN"
				}
			],
			"updated": 1704604110417,
			"link": null,
			"locked": false,
			"startBinding": {
				"elementId": "KXM6VuiRur7K_thpxEJZ5",
				"focus": -0.9194712632186741,
				"gap": 4.3297028372744535
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
					-7.412718615901781,
					184.17066045551292
				],
				[
					-145.5619302513188,
					240.91443840201646
				]
			]
		},
		{
			"type": "text",
			"version": 148,
			"versionNonce": 1846808833,
			"isDeleted": false,
			"id": "TUnUNpdN",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 831.1255951350761,
			"y": 9218.10125408021,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 208,
			"height": 38.4,
			"seed": 1095826703,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704604110417,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 3,
			"text": "可能会有把其他线程提交任务\n执行的情况，队列就为空了",
			"rawText": "可能会有把其他线程提交任务执行的情况，队列就为空了",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "tNF9R-U8jlwUTz34plAo9",
			"originalText": "可能会有把其他线程提交任务执行的情况，队列就为空了",
			"lineHeight": 1.2,
			"baseline": 34
		},
		{
			"type": "rectangle",
			"version": 301,
			"versionNonce": 967981967,
			"isDeleted": false,
			"id": "32-nCxCtoC_j0wkFstsFm",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 191.05032665348887,
			"y": 8856.049587047337,
			"strokeColor": "#f08c00",
			"backgroundColor": "transparent",
			"width": 96.3636722233283,
			"height": 27,
			"seed": 1127290209,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"boundElements": [
				{
					"type": "text",
					"id": "lGroBr57"
				}
			],
			"updated": 1704604110417,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 362,
			"versionNonce": 508315873,
			"isDeleted": false,
			"id": "lGroBr57",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": 199.24220304835615,
			"y": 8861.546357162857,
			"strokeColor": "#f08c00",
			"backgroundColor": "transparent",
			"width": 79.97991943359375,
			"height": 16.006459768958653,
			"seed": 1067942497,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"boundElements": [],
			"updated": 1704604110417,
			"link": null,
			"locked": false,
			"fontSize": 13.33871647413221,
			"fontFamily": 3,
			"text": "添加核心线程",
			"rawText": "添加核心线程",
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "32-nCxCtoC_j0wkFstsFm",
			"originalText": "添加核心线程",
			"lineHeight": 1.2,
			"baseline": 12
		},
		{
			"id": "SaZdBhsWWCsct4O9NKMG1",
			"type": "arrow",
			"x": 67.42637376069081,
			"y": 10315.844033208083,
			"width": 221.525495700404,
			"height": 138.6667778431456,
			"angle": 0,
			"strokeColor": "#f08c00",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 0,
			"opacity": 100,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"seed": 1412418735,
			"version": 173,
			"versionNonce": 1914827183,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704604110417,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					221.525495700404,
					-56.32138649421904
				],
				[
					118.63685284094504,
					-138.6667778431456
				]
			],
			"lastCommittedPoint": null,
			"startBinding": null,
			"endBinding": null,
			"startArrowhead": "triangle",
			"endArrowhead": null
		},
		{
			"id": "cVq_sJ9i6giQtWwisZ1JO",
			"type": "arrow",
			"x": 120.2185864660006,
			"y": 10137.53308186169,
			"width": 237.2892086242066,
			"height": 151.42934348745257,
			"angle": 0,
			"strokeColor": "#f08c00",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 0,
			"opacity": 100,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"seed": 1468744463,
			"version": 460,
			"versionNonce": 779257025,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704604110417,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					237.2892086242066,
					-94.6376804880656
				],
				[
					82.35156781996818,
					-151.42934348745257
				]
			],
			"lastCommittedPoint": null,
			"startBinding": {
				"elementId": "P0mIVURa",
				"focus": -0.6883668834765602,
				"gap": 8.61889491218244
			},
			"endBinding": {
				"elementId": "MSNhqP1k",
				"focus": 0.9175356646519862,
				"gap": 9.996401823986162
			},
			"startArrowhead": "triangle",
			"endArrowhead": null
		},
		{
			"id": "YzvRTOAIR0clU8033bpDm",
			"type": "rectangle",
			"x": -154.01638811009968,
			"y": 9119.084086387536,
			"width": 507.74245351047443,
			"height": 29.2,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 0,
			"opacity": 100,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"seed": 1682642049,
			"version": 260,
			"versionNonce": 192275407,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "wucn5LbN"
				},
				{
					"id": "GOoZotPe3AeH2dKNDSUgY",
					"type": "arrow"
				}
			],
			"updated": 1704604110417,
			"link": null,
			"locked": false
		},
		{
			"id": "wucn5LbN",
			"type": "text",
			"x": -133.52016135486247,
			"y": 9124.084086387536,
			"width": 466.75,
			"height": 19.2,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 0,
			"opacity": 100,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"seed": 1953724353,
			"version": 303,
			"versionNonce": 2049328289,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704604110417,
			"link": null,
			"locked": false,
			"text": "添加失败：1、状态不对，2、线程数满了（核心线程或最大线程）",
			"rawText": "添加失败：1、状态不对，2、线程数满了（核心线程或最大线程）",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 15,
			"containerId": "YzvRTOAIR0clU8033bpDm",
			"originalText": "添加失败：1、状态不对，2、线程数满了（核心线程或最大线程）",
			"lineHeight": 1.2
		},
		{
			"type": "arrow",
			"version": 232,
			"versionNonce": 1439076847,
			"isDeleted": false,
			"id": "GOoZotPe3AeH2dKNDSUgY",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": -86.64285521498664,
			"y": 8861.88557924061,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"width": 151.96218764427852,
			"height": 271.77405233633,
			"seed": 918398351,
			"groupIds": [
				"h32QGEiwMP9DG9wOPrMIQ",
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"boundElements": [],
			"updated": 1704604110417,
			"link": null,
			"locked": false,
			"startBinding": null,
			"endBinding": {
				"elementId": "YzvRTOAIR0clU8033bpDm",
				"focus": -1.0021353116795937,
				"gap": 6.962149041334214
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
					-151.96218764427852,
					94.56912165949325
				],
				[
					-74.33568193644729,
					271.77405233633
				]
			]
		},
		{
			"id": "54LwCMSSYEJF_RHHRuWem",
			"type": "rectangle",
			"x": 506.0359097424108,
			"y": 9893.92906632711,
			"width": 166.3665221690921,
			"height": 29.2,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 0,
			"opacity": 100,
			"groupIds": [
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"seed": 1347245231,
			"version": 249,
			"versionNonce": 500534095,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "xCeLv8rH"
				},
				{
					"id": "n13A7_BTJQQ-Z3HXwNRdo",
					"type": "arrow"
				}
			],
			"updated": 1704604129472,
			"link": null,
			"locked": false
		},
		{
			"id": "xCeLv8rH",
			"type": "text",
			"x": 512.5316708269569,
			"y": 9898.92906632711,
			"width": 153.375,
			"height": 19.2,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 0,
			"opacity": 100,
			"groupIds": [
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"seed": 1277143663,
			"version": 202,
			"versionNonce": 169638927,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704604110417,
			"link": null,
			"locked": false,
			"text": "核心线程数为0的情况",
			"rawText": "核心线程数为0的情况",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 15,
			"containerId": "54LwCMSSYEJF_RHHRuWem",
			"originalText": "核心线程数为0的情况",
			"lineHeight": 1.2
		},
		{
			"id": "yHku3Eq7_wSk0WAnB7NLe",
			"type": "rectangle",
			"x": -97.33825644019242,
			"y": 9874.013222214979,
			"width": 76.0758087086603,
			"height": 29.2,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 0,
			"opacity": 100,
			"groupIds": [
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": {
				"type": 3
			},
			"seed": 1224277359,
			"version": 144,
			"versionNonce": 285495393,
			"isDeleted": false,
			"boundElements": [
				{
					"type": "text",
					"id": "aS9IjQWD"
				}
			],
			"updated": 1704604110417,
			"link": null,
			"locked": false
		},
		{
			"id": "aS9IjQWD",
			"type": "text",
			"x": -91.30035208586227,
			"y": 9879.013222214979,
			"width": 64,
			"height": 19.2,
			"angle": 0,
			"strokeColor": "#e03131",
			"backgroundColor": "transparent",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 0,
			"opacity": 100,
			"groupIds": [
				"7zkV0g-sdfr1uZQhqngnI"
			],
			"frameId": null,
			"roundness": null,
			"seed": 1991985697,
			"version": 102,
			"versionNonce": 745546287,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704604110417,
			"link": null,
			"locked": false,
			"text": "状态正常",
			"rawText": "状态正常",
			"fontSize": 16,
			"fontFamily": 3,
			"textAlign": "center",
			"verticalAlign": "middle",
			"baseline": 15,
			"containerId": "yHku3Eq7_wSk0WAnB7NLe",
			"originalText": "状态正常",
			"lineHeight": 1.2
		},
		{
			"id": "n13A7_BTJQQ-Z3HXwNRdo",
			"type": "arrow",
			"x": 675.0047575886247,
			"y": 9904.745693389068,
			"width": 153.89396896461494,
			"height": 609.1087949326229,
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
			"seed": 1294090241,
			"version": 70,
			"versionNonce": 850920257,
			"isDeleted": false,
			"boundElements": null,
			"updated": 1704604132006,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					116.67246764469724,
					-305.49936399953003
				],
				[
					153.89396896461494,
					-609.1087949326229
				]
			],
			"lastCommittedPoint": null,
			"startBinding": {
				"elementId": "54LwCMSSYEJF_RHHRuWem",
				"focus": 0.9502200898691734,
				"gap": 2.6023256771218826
			},
			"endBinding": null,
			"startArrowhead": null,
			"endArrowhead": "triangle"
		},
		{
			"type": "arrow",
			"version": 120,
			"versionNonce": 1051609313,
			"isDeleted": true,
			"id": "w7wLFDjlDgPRn0AHBBqR0",
			"fillStyle": "solid",
			"strokeWidth": 2,
			"strokeStyle": "dashed",
			"roughness": 0,
			"opacity": 100,
			"angle": 0,
			"x": -47.96477147454459,
			"y": 9524.275527926653,
			"strokeColor": "#1971c2",
			"backgroundColor": "transparent",
			"width": 34.38165656638864,
			"height": 149.90932530763166,
			"seed": 954942081,
			"groupIds": [],
			"frameId": null,
			"roundness": {
				"type": 2
			},
			"boundElements": [],
			"updated": 1704604001458,
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
					-34.38165656638864,
					-71.91182754488909
				],
				[
					-8.516261361237639,
					-149.90932530763166
				]
			]
		},
		{
			"id": "cRmLjcOj4BSYr2Yg2mABW",
			"type": "arrow",
			"x": 511.28576966926096,
			"y": 9901.808759912741,
			"width": 65.91377790074012,
			"height": 15.791594158064981,
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
			"seed": 978844175,
			"version": 13,
			"versionNonce": 446063727,
			"isDeleted": true,
			"boundElements": null,
			"updated": 1704604001459,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					65.91377790074012,
					15.791594158064981
				]
			],
			"lastCommittedPoint": null,
			"startBinding": null,
			"endBinding": null,
			"startArrowhead": null,
			"endArrowhead": "triangle"
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
		"currentItemTextAlign": "center",
		"currentItemStartArrowhead": null,
		"currentItemEndArrowhead": "triangle",
		"scrollX": 493.17604131948593,
		"scrollY": -8671.026150479085,
		"zoom": {
			"value": 0.7056753611564638
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