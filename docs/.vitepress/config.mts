import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "YCF的文档",
  // description: "A VitePress Site",
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
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
