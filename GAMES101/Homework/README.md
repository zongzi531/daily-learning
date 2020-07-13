# Homework

> 环境：MacBook Pro

## pa0

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

## Assignment1

0. `brew install opencv` 会安装最新版本，我装了 `opencv@4`
1. 安装期间报 cmake 的链接错误，因为我是使用客户端安装的 cmake ，所以删除客户端，执行链接 `brew link cmake` 就好了。同样的我认为 `brew reinstall cmake` 也可以解决
2. `brew install opencv@2`
3. 使用 `opencv_version` 查看版本
4. `brew unlink opencv@4` 执行解除链接
5. `brew link opencv@2 --force` 链接 `opencv@2`

```c++
Eigen::Matrix4f get_model_matrix(float rotation_angle)
{
    Eigen::Matrix4f model;

    float angle = rotation_angle / 180.0f * MY_PI;

    model <<  std::cos(angle),-std::sin(angle), 0.0f, 0.0f,
              std::sin(angle), std::cos(angle), 0.0f, 0.0f,
              0.0f, 0.0f, 1.0f, 0.0f,
              0.0f, 0.0f, 0.0f, 1.0f;

    return model;
}

Eigen::Matrix4f get_projection_matrix(float eye_fov, float aspect_ratio,
                                      float zNear, float zFar)
{

    Eigen::Matrix4f projection = Eigen::Matrix4f::Identity();
    Eigen::Matrix4f ortho, scale, trans, persp_ortho;
    float angle = eye_fov / 180.0f * MY_PI / 2; // 计算弧度，需要用于公式，所以除 2
    float tb = std::tan(angle) * zNear; // 计算宽（半个）
    float rl = tb * aspect_ratio; // 计算长（半个）

    scale <<  1 / rl, 0.0f, 0.0f, 0.0f, /* 利用公式 2 / (rl * 2) */
              0.0f, 1 / tb, 0.0f, 0.0f, /* 利用公式 2 / (tb * 2) */
              0.0f, 0.0f, 2 / (zNear - zFar), 0.0f,
              0.0f, 0.0f, 0.0f, 1.0f;

    trans <<  1.0f, 0.0f, 0.0f, 0.0f,
              0.0f, 1.0f, 0.0f, 0.0f,
              0.0f, 0.0f, 1.0f, -((zNear + zFar) / 2),
              0.0f, 0.0f, 0.0f, 1.0f;

    ortho = scale * trans;

    persp_ortho <<  zNear, 0.0f, 0.0f, 0.0f,
                    0.0f, zNear, 0.0f, 0.0f,
                    0.0f, 0.0f, zNear + zFar, -(zNear * zFar),
                    0.0f, 0.0f, 1.0f, 0.0f;

    projection = ortho * persp_ortho * projection;

    return projection;
}
```

### [提高项 5 分] 在 main.cpp 中构造一个函数，该函数的作用是得到绕任意 过原点的轴的旋转变换矩阵。

```c++
Eigen::Matrix4f get_rotation(Vector3f axis, float rotation_angle)
{
    Eigen::Matrix4f model;

    float angle = rotation_angle / 180.0f * MY_PI;

    model << std::cos(angle) + axis.x() * axis.x() * (1 - std::cos(angle)), axis.x() * axis.y() * (1 - std::cos(angle)) - axis.z() * std::sin(angle), axis.x() * axis.z() * (1 - std::cos(angle)) + axis.y() * std::sin(angle), 0.0f,
             axis.x() * axis.y() * (1 - std::cos(angle)) + axis.z() * std::sin(angle), std::cos(angle) + axis.y() * axis.y() * (1 - std::cos(angle)), axis.y() * axis.z() * (1 - std::cos(angle)) - axis.x() * std::sin(angle), 0.0f,
             axis.x() * axis.z() * (1 - std::cos(angle)) - axis.y() * std::sin(angle), axis.z() * axis.y() * (1 - std::cos(angle)) + axis.x() * std::sin(angle), std::cos(angle) + axis.z() * axis.z() * (1 - std::cos(angle)), 0.0f,
             0.0f, 0.0f, 0.0f, 1.0f;

    return model;
}
```

推导公式: M = T(-x, -y, -z) · Rx(-α) · Ry(β) · Rz(θ) · Ry(-β) · Rx(α) · T(x, y, z) 。由于这里是过原点的，所以省略了 T 的两步过程。

[Rotation matrix from axis and angle](https://en.wikipedia.org/wiki/Rotation_matrix#Rotation_matrix_from_axis_and_angle)

![Rotation matrix from axis and angle](https://wikimedia.org/api/rest_v1/media/math/render/svg/f259f80a746ee20d481f9b7f600031084358a27c)

具体相关的推导过程及结果公式，可以 Google 一下（数学真是妙啊😄）。

## Assignment2

1. MACOS VSCode 环境未修改情况下编译报错 `error: implicit instantiation of undefined template` 。
 -  把 Triangle.cpp 里的 `#include <array>` 移到了 Triangle.hpp
