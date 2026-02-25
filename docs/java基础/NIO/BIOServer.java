package Java基础.NIO;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

public class BIOServer {
  public static void main(String[] args) throws IOException {
    int port = 9910;
    try (ServerSocket server = new ServerSocket(port)) {
      System.out.println("开始监听端口：" + port);
      while (true) {
        final Socket socket = server.accept();
        new Thread(() -> extracted(socket)).start();
      }
    }
  }

  private static void extracted(Socket socket) {
    try {
      BufferedReader in = null;
      PrintWriter out = null;
      in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
      out = new PrintWriter(socket.getOutputStream());
      String body = null;
      while (true) {
        body = in.readLine();
        if (body == null) {
          break;
        }
        System.out.println("The server recived :" + body);
        // out.write("我收到了" + body + "\n");
        // out.flush();
        out.println("server ok");
        out.flush();

      }

    } catch (IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
  }
}
