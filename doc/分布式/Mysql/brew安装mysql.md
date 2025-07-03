要启动通过 Homebrew 安装的 MySQL，可以使用以下命令：

```bash
brew services start mysql
```

这将启动 MySQL 服务。如果 MySQL 已经在运行，它将显示一个错误消息。如果你想重新启动 MySQL，可以使用以下命令：

```bash
brew services restart mysql
```

这将停止并重新启动 MySQL 服务。

如果你只想停止 MySQL 服务，可以使用以下命令：

```bash
brew services stop mysql
```

这将停止 MySQL 服务。