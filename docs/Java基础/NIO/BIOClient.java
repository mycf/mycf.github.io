package Java基础.NIO;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.net.UnknownHostException;

/**
 * TimeClient
 */
public class BIOClient {

  public static void main(String[] args) throws UnknownHostException, IOException {
    try (Socket socket = new Socket("localhost", 9910)) {
      BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
      PrintWriter out = new PrintWriter(socket.getOutputStream());
      System.out.println("开始链接");
      out.println("我是client");
      out.flush();
      String resp = in.readLine();
      System.out.println("收到:" + resp);
    }

  }
}
