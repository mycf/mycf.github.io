import { defineConfig } from 'vitepress'
// import { configureDiagramsPlugin } from "vitepress-plugin-diagrams";

import markdownItTextualUml from 'markdown-it-textual-uml'
// 改为静态导入
import MarkdownIt from 'markdown-it';
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "YCF的文档",
  description: "A VitePress Site",
  markdown: {
    config: (md) => {
      // configureDiagramsPlugin(md, {
      //   diagramsDir: "docs/public/diagrams", // 可选：自定义 SVG 文件目录
      //   publicPath: "/diagrams", // 可选：自定义公共路径
      // });
      md.use(markdownItTextualUml);
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],
    sidebar: {
      '/java基础/': [{

        text: 'java基础',
        items: [
          { text: 'arrayList', link: '/java基础/arraylist' },
          { text: 'volatile', link: '/java基础/volatile' },
          { text: 'linkedlist', link: '/java基础/linkedlist' }
        ]

      }],
      '/netty/': [{

        text: 'netty',
        items: [
          { text: 'nio', link: '/java基础/arraylist' },
          { text: 'linkedlist', link: '/linkedlist' }
        ]

      }]

    },

    // sidebar: [
    //   {
    //     text: 'java基础',
    //     items: [
    //       { text: 'arrayList', link: '/java基础/arraylist' },
    //       { text: 'linkedlist', link: '/linkedlist' }
    //     ]
    //   }, {
    //     text: 'java',
    //     items: [
    //       { text: 'arrayList', link: '/java基础/arraylist' },
    //       { text: 'linkedlist', link: '/java基础/linkedlist' }
    //     ]
    //   }
    //
    // ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mycf/mycf.github.io' }
    ]
  }
})
