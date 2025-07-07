# vitepress使用


# 集成[Kroki](https://kroki.io/)插件

```sh
npm install --save-dev vitepress-plugin-diagrams
```


```javascript
import { defineConfig } from "vitepress";
import { configureDiagramsPlugin } from "vitepress-plugin-diagrams";

export default defineConfig({
  markdown: {
    config: (md) => {
      configureDiagramsPlugin(md, {
        diagramsDir: "docs/public/diagrams", // 可选：自定义 SVG 文件目录
        publicPath: "/diagrams", // 可选：自定义公共路径
      });
    },
  },
});
```
