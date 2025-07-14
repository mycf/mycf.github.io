import DefaultTheme from 'vitepress/theme'
import Excalidraw from './Excalidraw.vue'
// import { Excalidraw } from "@excalidraw/excalidraw";
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Excalidraw', Excalidraw)
  }
}
