## 排除文件类型
```sh
rg "搜索内容" -g '!*.min.js' -g '!*.min.css'  # 排除 .min.js 和 .min.css
```

```sh
rg "搜索内容" --glob '!*.min.js' --glob '!*.min.css'
```


