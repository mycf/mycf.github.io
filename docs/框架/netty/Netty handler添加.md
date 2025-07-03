
首先看一下handler如何添加到ChannelPipeline
```java
  .handler(new ChannelInitializer<SocketChannel>() {

    @Override
    protected void initChannel(SocketChannel ch) throws Exception {
      ch.pipeline()

          .addLast("messageDecoder", new NettyMessageDecoder(1024 * 1024, 4, 4))
          .addLast("messageEncoder", new NettyMessageEncoder())
//                  .addLast("readTimeHandler", new ReadTimeHandler(50))
          .addLast("LoginAuthHandler", (ChannelHandler) new LoginAuthHandler())
          .addLast("HeartBeatHandler", new HeartBeatHandler());
    }

```

```java
asfadasdf
```

```java
llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllljj[jjj]dddddddddddddd
```
```java

llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllljj[jjjj]
```

