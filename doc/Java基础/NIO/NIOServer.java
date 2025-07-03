package Java基础.NIO;

import java.io.IOException;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.util.Iterator;
import java.util.Set;

// https://github.com/kevinm6/nvim/blob/c7ca0fc9a0b4ccea734181dce0c541a3aeee46dd/after/ftplugin/markdown.lua
/**
 * NIOClient
 */
public class NIOServer {
  static ServerSocketChannel acceptor = null;
  static Selector selector = null;

  public static void main(String[] args) throws IOException {

    acceptor = ServerSocketChannel.open();

    int port = 9910;
    acceptor.socket().bind(new InetSocketAddress(InetAddress.getLocalHost(), port));

    acceptor.configureBlocking(false);

    selector = Selector.open();
    acceptor.register(selector, SelectionKey.OP_ACCEPT);
    System.out.println("NIO server is start in port :" + port);
    new Thread(() -> reatorTask()).start();
  }

  private static void reatorTask() {
    while (true) {
      try {
        selector.select(1000);
        Set<SelectionKey> selectedKeys = selector.selectedKeys();
        Iterator<SelectionKey> it = selectedKeys.iterator();
        while (it.hasNext()) {
          SelectionKey key = it.next();
          it.remove();
          try {
            handleInput(key);
          } catch (IOException e) {
            if (key != null) {
              key.cancel();
              if (key.channel() != null) {
                key.channel().close();
              }
            }
          }
        }
      } catch (IOException e) {
      }

    }
  }

  private static void handleInput(SelectionKey key) throws IOException {
    if (!key.isValid()) {
      return;
    }
    if (key.isAcceptable()) {
      ServerSocketChannel ssc = ((ServerSocketChannel) key.channel());

      SocketChannel sc = ssc.accept();
      sc.configureBlocking(false);

      sc.register(selector, SelectionKey.OP_READ);
    }
    if (key.isReadable()) {
      SocketChannel sc = ((SocketChannel) key.channel());
      ByteBuffer readBuffer = ByteBuffer.allocate(1024);
      int i = sc.read(readBuffer);
      if (i > 0) {
        readBuffer.flip();
        byte[] bytes = new byte[readBuffer.remaining()];

        readBuffer.get(bytes);

        String body = new String(bytes);
        System.out.println("nio server recived:" + body);

        doWrite(sc);

      }
    }
  }

  private static void doWrite(SocketChannel sc) throws IOException {
    String string = "你是大可爱";
    ByteBuffer writeBuffer = ByteBuffer.allocate(string.getBytes().length);
    writeBuffer.put(string.getBytes());
    writeBuffer.flip();
    sc.write(writeBuffer);

  }
}
