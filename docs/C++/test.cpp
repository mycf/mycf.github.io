#include <fstream>
#include <iostream>
#include <string>

int main() {
  std::ifstream file("example.txt"); // 打开文件
  if (file.is_open()) {              // 检查文件是否成功打开
    std::string line;
    while (std::getline(file, line)) { // 逐行读取文件内容
      std::cout << line << std::endl;
    }
    file.close(); // 关闭文件
  } else {
    std::cout << "Unable to open file" << std::endl;
  }
  return 0;
}
