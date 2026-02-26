<template>
  <div ref="excalidraw" classe="excalidraw">Loading...</div>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from 'vue'
import { createRoot } from 'react-dom/client';

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  Children,
  cloneElement,
} from "react";

import { Excalidraw } from "@excalidraw/excalidraw";

import "@excalidraw/excalidraw/index.css";
const excalidraw = ref(null);

let root;
onMounted(async () => {
// 获取 data-src 属性
  const dataSrc = excalidraw.value.getAttribute('data-src');
  console.log('data-src:', dataSrc); // 输出: ../../设计模式/1.excalidraw
  
const excalidrawAPI = ref(null);
console.log(React)
async function fetchSync(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

let data = await fetchSync(dataSrc)
root = createRoot(excalidraw.value);

let updateScene
root.render(React.createElement(Excalidraw, {
    excalidrawAPI: (api) => {
          excalidrawAPI.value = api // 当 Excalidraw 初始化后设置 API
    },
    langCode: "en-US",
    initialData:
    {
    ...data,
          scrollToContent:true

    }
    }
  )
);
 // updateScene = () => {
 //   const sceneData = {
 //     elements: [
 //       {
 //         type: "rectangle",
 //         version: 141,
 //         versionNonce: 361174001,
 //         isDeleted: false,
 //         id: "oDVXy8D6rom3H1-LLH2-f",
 //         fillStyle: "hachure",
 //         strokeWidth: 1,
 //         strokeStyle: "solid",
 //         roughness: 1,
 //         opacity: 100,
 //         angle: 0,
 //         x: 100.50390625,
 //         y: 93.67578125,
 //         strokeColor: "#c92a2a",
 //         backgroundColor: "transparent",
 //         width: 186.47265625,
 //         height: 141.9765625,
 //         seed: 1968410350,
 //         groupIds: [],
 //       },
 //     ],
 //     appState: {
 //       viewBackgroundColor: "#edf2ff",
 //     },
 //   };

    //excalidrawAPI.value.updateScene(sceneData);
  //};
        //updateScene()
})
onUnmounted(() => {
  if (root) {
    root.unmount();
  }
});

</script>
<style>
.excalidraw {
  height: 500px;
  width: 100%;
}
</style>
