import { defineConfig } from 'vitepress'
import { configureDiagramsPlugin } from "vitepress-plugin-diagrams";
let excalidrawAPI = ref(null);   // 存储 API 实例

import { ref, onMounted } from "vue";
// import { createExcalidrawPlugin } from '@excalidraw/excalidraw/vite';
// import markdownItTextualUml from 'markdown-it-textual-uml'
// 改为静态导入
import MarkdownIt from 'markdown-it';
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "YCF的文档",
  description: "A VitePress Site",
  lang: 'zh-CN',
  // vite: {
  //   plugins: [
  //     createExcalidrawPlugin(), // 启用 Excalidraw 支持
  //   ],
  // },
  define: {
    'process.env': {}
  },
  // locales: {
  //   root: {
  //     label: '中文',
  //     lang: 'ch'
  //   }
  //
  // },
  markdown: {
    config: (md) => {
      configureDiagramsPlugin(md, {
        diagramsDir: "docs/public/diagrams", // 可选：自定义 SVG 文件目录
        publicPath: "/diagrams", // 可选：自定义公共路径
      });


      const defaultImg = md.renderer.rules.image
      md.renderer.rules.image = (tokens, idx, options, env, slf) => {
        const token = tokens[idx];
        console.log(token)
        const src = token.attrGet('src');
        if (src.endsWith('.excalidraw')) {
          // 如果是 .excalidraw 文件，渲染为 Excalidraw 组件
          return `<Excalidraw data-src="${src}"/>`;
        }
        // 默认图片渲染
        return defaultImg(token, idx, options, env, slf)
      };
    },
  },
  themeConfig: {
    search: {
      provider: 'local'
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],
    sidebar: {
      '/java基础/': [{

        text: 'java基础',
        collapsed: true,
        items: [
          { text: 'arrayList', link: '/java基础/arraylist' },
          { text: 'volatile', link: '/java基础/volatile' },
          { text: 'linkedlist', link: '/java基础/linkedlist' },
          { text: 'jvm', link: '/java基础/jvm/g1收集器' }
        ]

      }],

      '/java基础/jvm/': [{

        text: 'jvm',
        collapsed: true,
        items: [

          { text: 'g1收集器', link: '/java基础/jvm/g1收集器' },
          { text: 'ZGC收集器', link: '/java基础/jvm/zgc收集器' },
        ]

      }],
      '/netty/': [{

        text: 'netty',
        collapsed: true,
        items: [
        ]

      }],
      '/设计模式/': [{
        text: '设计模式',
        collapsed: true,
        items: [
          {
            text: '六大设计原则', link: '/设计模式/六大设计原则',
            items: [

              { text: '单一职责原则', link: '/设计模式/六大设计原则#单一职责原则' },
              { text: '里氏替换原则', link: '/设计模式/六大设计原则#里氏替换原则' },
              { text: '依赖倒置原则', link: '/设计模式/六大设计原则#依赖倒置原则' },
              { text: '接口隔离原则', link: '/设计模式/六大设计原则#接口隔离原则' },
              { text: '迪米特法则', link: '/设计模式/六大设计原则#迪米特法则' },
              { text: '开闭原则', link: '/设计模式/六大设计原则#开闭原则' },

            ]
          },
          {
            text: '创建型模式', link: '/设计模式/创建型模式', items: [

              { text: '抽象工厂模式', link: '/设计模式/创建型模式#抽象工厂' },
              { text: '建造者模式', link: '/设计模式/创建型模式#建造者模式' },
              { text: '工厂方法模式', link: '/设计模式/创建型模式#工厂方法模式' },
            ]
          },
          { text: '行为型模式', link: '/设计模式/行为型模式' },
        ]
      }]

    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/mycf/mycf.github.io' }
    ]
  }
})
