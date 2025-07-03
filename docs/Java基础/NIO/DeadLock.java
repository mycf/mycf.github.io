package Java基础.NIO;

import java.util.concurrent.TimeUnit;

/**
 * DeadLock
 */
public class DeadLock {

  static Object a = new Object();
  static Object b = new Object();

  public static void main(String[] args) {
    new Thread(() -> getLock(a, b), "线程1").start();
    new Thread(() -> getLock(b, a), "线程2").start();
  }

  private static void getLock(Object o1, Object o2) {
    synchronized (o1) {
      System.out.println("getLock " + o1);
      try {
        TimeUnit.MILLISECONDS.sleep(200);
      } catch (InterruptedException e) {
      }

      synchronized (o2) {
        System.out.println("getLock " + o2);
      }
    }

  }
}
