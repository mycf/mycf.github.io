// // See https://www.npmjs.com/package/@excalidraw/excalidraw documentation.
// import * as ExcalidrawLib from 'https://esm.sh/@excalidraw/excalidraw@0.18.0/dist/dev/index.js?external=react,react-dom';
// import React from "https://esm.sh/react@19.0.0";
// import { createRoot } from "https://esm.sh/react-dom@19.0.0/client";
// import ReactDOM from "https://esm.sh/react-dom@19.0.0"
//
// window.ExcalidrawLib = ExcalidrawLib;
// console.log("Excalidraw library", ExcalidrawLib);
//
// const App = () => {
//   const [excalidrawAPI, setExcalidrawAPI] = React.useState(null);
//   const excalidrawWrapperRef = React.useRef(null);
//   const [dimensions, setDimensions] = React.useState({
//     width: undefined,
//     height: undefined,
//   });
//
//   const [viewModeEnabled, setViewModeEnabled] = React.useState(false);
//   const [zenModeEnabled, setZenModeEnabled] = React.useState(false);
//   const [gridModeEnabled, setGridModeEnabled] = React.useState(false);
//
//   React.useEffect(() => {
//     setDimensions({
//       width: excalidrawWrapperRef.current.getBoundingClientRect().width,
//       height: excalidrawWrapperRef.current.getBoundingClientRect().height,
//     });
//     const onResize = () => {
//       setDimensions({
//         width: excalidrawWrapperRef.current.getBoundingClientRect().width,
//         height:
//           excalidrawWrapperRef.current.getBoundingClientRect().height,
//       });
//     };
//
//     window.addEventListener("resize", onResize);
//
//     return () => window.removeEventListener("resize", onResize);
//   }, [excalidrawWrapperRef]);
//
//   const updateScene = () => {
//     const sceneData = {
//       elements: [
//         {
//           type: "rectangle",
//           version: 141,
//           versionNonce: 361174001,
//           isDeleted: false,
//           id: "oDVXy8D6rom3H1-LLH2-f",
//           fillStyle: "hachure",
//           strokeWidth: 1,
//           strokeStyle: "solid",
//           roughness: 1,
//           opacity: 100,
//           angle: 0,
//           x: 100.50390625,
//           y: 93.67578125,
//           strokeColor: "#c92a2a",
//           backgroundColor: "transparent",
//           width: 186.47265625,
//           height: 141.9765625,
//           seed: 1968410350,
//           groupIds: [],
//         },
//       ],
//       appState: {
//         viewBackgroundColor: "#edf2ff",
//       },
//     };
//
//     excalidrawAPI.updateScene(sceneData);
//   };
//
//   return React.createElement(
//     React.Fragment,
//     null,
//     React.createElement(
//       "div",
//       { className: "button-wrapper" },
//       React.createElement(
//         "button",
//         {
//           className: "update-scene",
//           onClick: updateScene,
//         },
//         "Update Scene"
//       ),
//       React.createElement(
//         "button",
//         {
//           className: "reset-scene",
//           onClick: () => excalidrawAPI.resetScene(),
//         },
//         "Reset Scene"
//       ),
//       React.createElement(
//         "label",
//         null,
//         React.createElement("input", {
//           type: "checkbox",
//           checked: viewModeEnabled,
//           onChange: () => setViewModeEnabled(!viewModeEnabled),
//         }),
//         "View mode"
//       ),
//       React.createElement(
//         "label",
//         null,
//         React.createElement("input", {
//           type: "checkbox",
//           checked: zenModeEnabled,
//           onChange: () => setZenModeEnabled(!zenModeEnabled),
//         }),
//         "Zen mode"
//       ),
//       React.createElement(
//         "label",
//         null,
//         React.createElement("input", {
//           type: "checkbox",
//           checked: gridModeEnabled,
//           onChange: () => setGridModeEnabled(!gridModeEnabled),
//         }),
//         "Grid mode"
//       )
//     ),
//     React.createElement(
//       "div",
//       {
//         className: "excalidraw-wrapper",
//         ref: excalidrawWrapperRef,
//       },
//       React.createElement(ExcalidrawLib.Excalidraw, {
//         excalidrawAPI: (api) => setExcalidrawAPI(api),
//         zenModeEnabled,
//         gridModeEnabled,
//         viewModeEnabled,
//         langCode: "en-US",
//       })
//     )
//   );
// };
//
// const excalidrawWrapper = document.getElementById("app");
// const root = createRoot(excalidrawWrapper);
// root.render(React.createElement(App)); window.EXCALIDRAW_ASSET_PATH = "https://esm.sh/@excalidraw/excalidraw@0.18.0/dist/prod/";
//
// {
//   "imports": {
//     "react": "https://esm.sh/react@19.0.0",
//       "react/jsx-runtime": "https://esm.sh/react@19.0.0/jsx-runtime",
//         "react-dom": "https://esm.sh/react-dom@19.0.0"
//   }
// }
