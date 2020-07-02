# Homework

> 环境：MacBook Pro

## 0

0. VSCode C++ 插件安装
1. 安装 CMake
2. `brew install eigen`
3. `eigen3` 依赖问题使用 `include_directories(**)` 解决

```c++
#include<cmath>
#include<eigen3/Eigen/Core>
#include<eigen3/Eigen/Dense>
#include<iostream>

int main(){
    std::cout << "作业描述： \n";
    std::cout << "给定一个点 P =(2,1), 将该点绕原点先逆时针旋转 45◦，再平移 (1,2), 计算出 变换后点的坐标(要求用齐次坐标进行计算)。 \n";
    
    Eigen::Vector3f p(2.0f, 1.0f, 1.0f); // P =(2,1)
    Eigen::Matrix3f matrix; // 齐次坐标矩阵
    float angle = 45.0f / 180.0f * M_PI; // 计算弧度

    // 旋转 + 平移
    matrix << std::cos(angle),-std::sin(angle), 1.0f,
              std::sin(angle), std::cos(angle), 2.0f,
              0.0f, 0.0f, 1.0f;

    std::cout << matrix * p << std::endl;

    return 0;
}
```
