import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug/',
    component: ComponentCreator('/__docusaurus/debug/', 'abc'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config/',
    component: ComponentCreator('/__docusaurus/debug/config/', '32c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content/',
    component: ComponentCreator('/__docusaurus/debug/content/', '195'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData/',
    component: ComponentCreator('/__docusaurus/debug/globalData/', '35c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata/',
    component: ComponentCreator('/__docusaurus/debug/metadata/', '839'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry/',
    component: ComponentCreator('/__docusaurus/debug/registry/', '3e2'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes/',
    component: ComponentCreator('/__docusaurus/debug/routes/', 'df7'),
    exact: true
  },
  {
    path: '/blog/',
    component: ComponentCreator('/blog/', '1f6'),
    exact: true
  },
  {
    path: '/blog/archive/',
    component: ComponentCreator('/blog/archive/', 'f00'),
    exact: true
  },
  {
    path: '/blog/first-blog-post/',
    component: ComponentCreator('/blog/first-blog-post/', '7f2'),
    exact: true
  },
  {
    path: '/blog/long-blog-post/',
    component: ComponentCreator('/blog/long-blog-post/', '7df'),
    exact: true
  },
  {
    path: '/blog/mdx-blog-post/',
    component: ComponentCreator('/blog/mdx-blog-post/', 'f3b'),
    exact: true
  },
  {
    path: '/blog/tags/',
    component: ComponentCreator('/blog/tags/', '977'),
    exact: true
  },
  {
    path: '/blog/tags/docusaurus/',
    component: ComponentCreator('/blog/tags/docusaurus/', 'c9c'),
    exact: true
  },
  {
    path: '/blog/tags/facebook/',
    component: ComponentCreator('/blog/tags/facebook/', 'b21'),
    exact: true
  },
  {
    path: '/blog/tags/hello/',
    component: ComponentCreator('/blog/tags/hello/', 'e9a'),
    exact: true
  },
  {
    path: '/blog/tags/hola/',
    component: ComponentCreator('/blog/tags/hola/', 'f42'),
    exact: true
  },
  {
    path: '/blog/welcome/',
    component: ComponentCreator('/blog/welcome/', '84c'),
    exact: true
  },
  {
    path: '/docs/tags/',
    component: ComponentCreator('/docs/tags/', 'ade'),
    exact: true
  },
  {
    path: '/docs/tags/开始上手/',
    component: ComponentCreator('/docs/tags/开始上手/', 'ac3'),
    exact: true
  },
  {
    path: '/docs/tags/演示/',
    component: ComponentCreator('/docs/tags/演示/', '955'),
    exact: true
  },
  {
    path: '/markdown-page/',
    component: ComponentCreator('/markdown-page/', 'f50'),
    exact: true
  },
  {
    path: '/docs/',
    component: ComponentCreator('/docs/', 'be3'),
    routes: [
      {
        path: '/docs/',
        component: ComponentCreator('/docs/', 'dc5'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/brew/',
        component: ComponentCreator('/docs/brew/', 'd58'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/category/mybatis/',
        component: ComponentCreator('/docs/category/mybatis/', '417'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/category/tutorial---basics/',
        component: ComponentCreator('/docs/category/tutorial---basics/', '843'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/category/tutorial---extras/',
        component: ComponentCreator('/docs/category/tutorial---extras/', 'e82'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/git/',
        component: ComponentCreator('/docs/git/', '202'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/intro/',
        component: ComponentCreator('/docs/intro/', '688'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/mybatis/',
        component: ComponentCreator('/docs/mybatis/', 'bad'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial-basics/congratulations/',
        component: ComponentCreator('/docs/tutorial-basics/congratulations/', 'cb6'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial-basics/create-a-blog-post/',
        component: ComponentCreator('/docs/tutorial-basics/create-a-blog-post/', '927'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial-basics/create-a-document/',
        component: ComponentCreator('/docs/tutorial-basics/create-a-document/', '304'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial-basics/create-a-page/',
        component: ComponentCreator('/docs/tutorial-basics/create-a-page/', 'cd5'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial-basics/deploy-your-site/',
        component: ComponentCreator('/docs/tutorial-basics/deploy-your-site/', 'fa7'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial-basics/markdown-features/',
        component: ComponentCreator('/docs/tutorial-basics/markdown-features/', '920'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial-extras/manage-docs-versions/',
        component: ComponentCreator('/docs/tutorial-extras/manage-docs-versions/', 'bc2'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial-extras/translate-your-site/',
        component: ComponentCreator('/docs/tutorial-extras/translate-your-site/', 'dad'),
        exact: true,
        sidebar: "tutorialSidebar"
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'c27'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
