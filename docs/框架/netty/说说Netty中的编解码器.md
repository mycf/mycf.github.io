# 概述
编码(Encode)，也称为序列化，它主要是将对象转化为字节数组，以便于网络传输或者数据持久化;
解码(Decode)，也称为反序列化，它的主要作用是将网络或者磁盘中读取的字节数组转化为原始对象。

我们知道，网络通信中数据都是以二进制字节流的形式进行传输的，因此我们需要使用编解码器来对数据进行处理。编码器的主要作用是将对象转化为二进制字节流，而解码器的主要作用是将二进制字节流转化为原始对象。

`Netty` 中提供了一系列的编解码器来供我们使用，它们都是 `ChannelHandlerAdapter` 类的子类，因此也是一种特殊的 `ChannelHandler`。

# 编码器
对于编码器，Netty 中提供了两个抽象基类：MessageToByteEncoder 与 MessageToMessageEncoder。其中MessageToByteEncoder 会将消息编码为字节，MessageToMessageEncoder 会将消息编码为另一种消息。我们可以通过继承这两个基类的其中一个来自定义我们自己的编码器。

Netty 内置的基于 MessageToByteEncoder 的常见子类主要是编码对象的 ObjectEncoder。而基于 MessageToMessageEncoder 的常见子类包括：StringEncoder、ProtobufEncoder、LineEncoder、Base64Encoder 等。

# 解码器
对于解码器，Netty 同样也提供了两个抽象基类：ByteToMessageDecoder与 MessageToMessageDecoder。其中 ByteToMessageDecoder 会将字节解码为消息，MessageToMessageDecoder 会将消息解码为另一种消息。我们可以通过继承这两个基类的其中一个来自定义我们自己的解码器。

Netty 内置的基于 ByteToMessageDecoder 的常见子类有：ObjectDecoder、FixedLengthFrameDecoder、LineBasedFrameDecoder、 DelimiterBasedFrameDecoder、LengthFieldBasedFrameDecoder 等。而基于MessageToMessageDecoder 的常见子类包括：StringDecoder、ProtobufDecoder、Base64Decoder 等。

# 编解码器

Netty 中还提供了一种同时具有编码与解码功能的编解码器，它同样有2个抽象基类：ByteToMessageCodec 和 MessageToMessageCodec，它们继承自适配器类 ChannelDuplexHandler。
