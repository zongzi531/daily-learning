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
2. **完成提高部分**，实现抗锯齿，使用 2 * 2 采样形式实现，因为之前使用的是 `int` 类型，所以导致一直没有办法实现抗锯齿，详见代码提交记录。


```c++
static bool insideTriangle(float x, float y, const std::array<Vector4f, 3> _v)
{   
    // TODO : Implement this function to check if the point (x, y) is inside the triangle represented by _v[0], _v[1], _v[2]
    Eigen::Vector3f boxpoint = {x, y, 0};
    Eigen::Vector3f p0 = {_v[0].x(), _v[0].y(), 0};
    Eigen::Vector3f p1 = {_v[1].x(), _v[1].y(), 0};
    Eigen::Vector3f p2 = {_v[2].x(), _v[2].y(), 0};

    Eigen::Vector3f bp_p0 = boxpoint - p0;
    Eigen::Vector3f p1_p0 = p1 - p0;

    Eigen::Vector3f bp_p1 = boxpoint - p1;
    Eigen::Vector3f p2_p1 = p2 - p1;

    Eigen::Vector3f bp_p2 = boxpoint - p2;
    Eigen::Vector3f p0_p2 = p0 - p2;

    return (bp_p0.cross(p1_p0).z() > 0 && bp_p1.cross(p2_p1).z() > 0 && bp_p2.cross(p0_p2).z() > 0) ||
        (bp_p0.cross(p1_p0).z() < 0 && bp_p1.cross(p2_p1).z() < 0 && bp_p2.cross(p0_p2).z() < 0);
}

void rst::rasterizer::rasterize_triangle(const Triangle& t) {
    auto v = t.toVector4();
    
    // TODO : Find out the bounding box of current triangle.
    // iterate through the pixel and find if the current pixel is inside the triangle

    int xmax = std::max(std::max(v[0].x(), v[1].x()), v[2].x());
    int xmin = std::min(std::min(v[0].x(), v[1].x()), v[2].x());
    int ymax = std::max(std::max(v[0].y(), v[1].y()), v[2].y());
    int ymin = std::min(std::min(v[0].y(), v[1].y()), v[2].y());

    // 2 * 2 采样
    float smallbox[4][2] = {
        { 0.25, 0.25 },
        { 0.25, 0.75 },
        { 0.75, 0.25 },
        { 0.75, 0.75 }
    };

    for (int y = ymax; y > ymin; y--) {
        for (int x = xmin; x < xmax; x++) {

            int insmallboxcount = 0;
            float dep = std::numeric_limits<float>::infinity();
            for(int i = 0; i < 4; i++) {
                if (insideTriangle(x + smallbox[i][0], y + smallbox[i][1], v)) {
                    // If so, use the following code to get the interpolated z value.
                    auto[alpha, beta, gamma] = computeBarycentric2D(x + smallbox[i][0], y + smallbox[i][1], t.v);
                    float w_reciprocal = 1.0/(alpha / v[0].w() + beta / v[1].w() + gamma / v[2].w());
                    float z_interpolated = alpha * v[0].z() / v[0].w() + beta * v[1].z() / v[1].w() + gamma * v[2].z() / v[2].w();
                    z_interpolated *= w_reciprocal;

                    insmallboxcount++;
                    dep = std::min(dep, z_interpolated);
                }
            }
            if (insmallboxcount != 0) {
                auto ind = get_index(x, y);
                if (dep < depth_buf[ind]) {
                    depth_buf[ind] = dep;
                    set_pixel({x, y, dep}, t.getColor() * insmallboxcount / 4.0);
                }
            }
        }
    }

    // TODO : set the current pixel (use the set_pixel function) to the color of the triangle (use getColor function) if it should be painted.
}
```

## Assignment3

1. 报错系列
    - 编译报错：没有 `#include <array>` 类型错误
    - 运行报错： `OpenCV Error: Assertion failed (scn == 3 || scn == 4) in cvtColor, file...` ，因为 `cv::imread(name);` 时，参数路径错误所致。
    - 运行时什么内容都没有的情况，是因为加载 `obj` 文件路径错误所致。
2. 关于三角形的最小包围盒的计算遗漏，在获取三角形点坐标计算最小包围盒的时候，对于浮点数，最小处取舍去小数位，最大处入一位。
3. 关于 MVP 模型转换后为何产出的内容是“倒”的，需要从左手坐标系换成右手坐标系即可。
4. 在提交完 normal 作业后，其实已经完成了基本的内容，剩下就是切换着色器而已。
5. 这里会用到公式 L=La +Ld +Ls=kaIa +kd(I/r2)max(0,n·l)+ks(I/r2)max(0,n·h)p
6. 关于 phong 还是存在这一些疑问的，比如：
    - kaIa 为什么不能直接 * 相乘（这里需要用到 Eigen 的 [`cwiseProduct`](https://eigen.tuxfamily.org/dox/group__TutorialArrayClass.html) 方法）
    - 等等一些关于 phong 公式的代码实现……
7. 关于提高部分
    - 尝试更多模型：尝试使用作业提供的 `obj` 文件，但是效果并不是很好，仅替换了文件路径，尝试差强人意。
    - 双线性纹理插值：结合[双线性插值](https://zh.wikipedia.org/wiki/%E5%8F%8C%E7%BA%BF%E6%80%A7%E6%8F%92%E5%80%BC)算法，利用公式实现。

```c++
Eigen::Matrix4f get_projection_matrix(float eye_fov, float aspect_ratio, float zNear, float zFar)
{
    // TODO: Use the same projection matrix from the previous assignments
    Eigen::Matrix4f projection = Eigen::Matrix4f::Identity();
    Eigen::Matrix4f ortho, scale, trans, persp_ortho, reverse;
    float angle = eye_fov / 180.0f * MY_PI / 2;
    float tb = std::tan(angle) * zNear;
    float rl = tb * aspect_ratio;

    scale <<  1 / rl, 0.0f, 0.0f, 0.0f,
              0.0f, 1 / tb, 0.0f, 0.0f,
              0.0f, 0.0f, 2 / (zNear - zFar), 0.0f,
              0.0f, 0.0f, 0.0f, 1.0f;

    trans <<  1.0f, 0.0f, 0.0f, -((rl + (-rl)) / 2),
              0.0f, 1.0f, 0.0f, -((tb + (-tb)) / 2),
              0.0f, 0.0f, 1.0f, -((zNear + zFar) / 2),
              0.0f, 0.0f, 0.0f, 1.0f;

    ortho = scale * trans;

    persp_ortho <<  zNear, 0.0f, 0.0f, 0.0f,
                    0.0f, zNear, 0.0f, 0.0f,
                    0.0f, 0.0f, zNear + zFar, -(zNear * zFar),
                    0.0f, 0.0f, 1.0f, 0.0f;

    reverse << -1.0f, 0.0f, 0.0f, 0.0f, // 从左手坐标系换成右手坐标系
                0.0f,-1.0f, 0.0f, 0.0f,
                0.0f, 0.0f, 1.0f, 0.0f,
                0.0f, 0.0f, 0.0f, 1.0f;

    projection = ortho * persp_ortho * projection * reverse;

    return projection;
}

static bool insideTriangle(int x, int y, const Vector4f* _v){
    Vector3f v[3];
    for(int i=0;i<3;i++)
        v[i] = {_v[i].x(),_v[i].y(), 1.0};
    Vector3f f0,f1,f2;
    f0 = v[1].cross(v[0]);
    f1 = v[2].cross(v[1]);
    f2 = v[0].cross(v[2]);
    Vector3f p(x,y,1.);
    // 处理三角形边界
    if((p.dot(f0)*f0.dot(v[2])>=0) && (p.dot(f1)*f1.dot(v[0])>=0) && (p.dot(f2)*f2.dot(v[1])>=0))
        return true;
    return false;
}

void rst::rasterizer::rasterize_triangle(const Triangle& t, const std::array<Eigen::Vector3f, 3>& view_pos) 
{
    // TODO: From your HW3, get the triangle rasterization code.
    // TODO: Inside your rasterization loop:
    //    * v[i].w() is the vertex view space depth value z.
    //    * Z is interpolated view space depth for the current pixel
    //    * zp is depth between zNear and zFar, used for z-buffer

    auto v = t.toVector4();

    int xmax = std::ceil(std::max(std::max(v[0].x(), v[1].x()), v[2].x()));
    int xmin = std::floor(std::min(std::min(v[0].x(), v[1].x()), v[2].x()));
    int ymax = std::ceil(std::max(std::max(v[0].y(), v[1].y()), v[2].y()));
    int ymin = std::floor(std::min(std::min(v[0].y(), v[1].y()), v[2].y()));

    for (int y = ymax; y > ymin; y--) {
        for (int x = xmin; x < xmax; x++) {
            // 这里计算像素时，不加 0.5 结果更好
            if (insideTriangle(x, y, t.v)) {
                auto[alpha, beta, gamma] = computeBarycentric2D(x, y, t.v); // 计算重心坐标
                float Z = 1.0 / (alpha / v[0].w() + beta / v[1].w() + gamma / v[2].w());
                float zp = alpha * v[0].z() / v[0].w() + beta * v[1].z() / v[1].w() + gamma * v[2].z() / v[2].w();
                zp *= Z;

                auto ind = get_index(x, y);

                if (zp < depth_buf[ind]) {
    // TODO: Interpolate the attributes:
					auto interpolated_color = interpolate(alpha, beta, gamma, t.color[0], t.color[1], t.color[2], 1);
					auto interpolated_normal = interpolate(alpha, beta, gamma, t.normal[0], t.normal[1], t.normal[2], 1).normalized();
					auto interpolated_texcoords = interpolate(alpha, beta, gamma, t.tex_coords[0], t.tex_coords[1], t.tex_coords[2], 1);
					auto interpolated_shadingcoords = interpolate(alpha, beta, gamma, view_pos[0], view_pos[1], view_pos[2], 1);

					fragment_shader_payload payload( interpolated_color, interpolated_normal, interpolated_texcoords, texture ? &*texture : nullptr);
					payload.view_pos = interpolated_shadingcoords;
    // Use: Instead of passing the triangle's color directly to the frame buffer, pass the color to the shaders first to get the final color;

					auto pixel_color = fragment_shader(payload);
 
					depth_buf[ind] = zp;
					set_pixel({x, y}, pixel_color);
                }
            }
        }
    }
}

Eigen::Vector3f phong_fragment_shader(const fragment_shader_payload& payload)
{
    Eigen::Vector3f ka = Eigen::Vector3f(0.005, 0.005, 0.005);
    Eigen::Vector3f kd = payload.color;
    Eigen::Vector3f ks = Eigen::Vector3f(0.7937, 0.7937, 0.7937);

    auto l1 = light{{20, 20, 20}, {500, 500, 500}};
    auto l2 = light{{-20, 20, 0}, {500, 500, 500}};

    std::vector<light> lights = {l1, l2};
    Eigen::Vector3f amb_light_intensity{10, 10, 10};
    Eigen::Vector3f eye_pos{0, 0, 10};

    float p = 150;

    Eigen::Vector3f color = payload.color;
    Eigen::Vector3f point = payload.view_pos;
    Eigen::Vector3f normal = payload.normal;

    Eigen::Vector3f result_color = {0, 0, 0};
    for (auto& light : lights)
    {
        // TODO: For each light source in the code, calculate what the *ambient*, *diffuse*, and *specular* 
        // components are. Then, accumulate that result on the *result_color* object.
        
        Eigen::Vector3f vec_light = light.position - point;
        Eigen::Vector3f vec_view = eye_pos - point;
        float r2 = vec_light.dot(vec_light);

        Eigen::Vector3f La = ka.cwiseProduct(amb_light_intensity);
        Eigen::Vector3f Ld = kd.cwiseProduct(light.intensity / r2);
        Ld *= std::max(0.0f, normal.normalized().dot(vec_light.normalized()));
        Eigen::Vector3f Ls = ks.cwiseProduct(light.intensity / r2);
        Eigen::Vector3f h = (vec_light + vec_view).normalized();
        Ls *= std::pow(std::max(0.0f, normal.normalized().dot(h)), p);

        result_color += (La + Ld + Ls);
    }

    return result_color * 255.f;
}

Eigen::Vector3f texture_fragment_shader(const fragment_shader_payload& payload)
{
    Eigen::Vector3f return_color = {0, 0, 0};
    if (payload.texture)
    {
        // TODO: Get the texture value at the texture coordinates of the current fragment

        // return_color = payload.texture->getColor(payload.tex_coords.x(), payload.tex_coords.y());
        return_color = payload.texture->getColorBilinear(payload.tex_coords.x(), payload.tex_coords.y());
    }
    Eigen::Vector3f texture_color;
    texture_color << return_color.x(), return_color.y(), return_color.z();

    Eigen::Vector3f ka = Eigen::Vector3f(0.005, 0.005, 0.005);
    Eigen::Vector3f kd = texture_color / 255.f;
    Eigen::Vector3f ks = Eigen::Vector3f(0.7937, 0.7937, 0.7937);

    auto l1 = light{{20, 20, 20}, {500, 500, 500}};
    auto l2 = light{{-20, 20, 0}, {500, 500, 500}};

    std::vector<light> lights = {l1, l2};
    Eigen::Vector3f amb_light_intensity{10, 10, 10};
    Eigen::Vector3f eye_pos{0, 0, 10};

    float p = 150;

    Eigen::Vector3f color = texture_color;
    Eigen::Vector3f point = payload.view_pos;
    Eigen::Vector3f normal = payload.normal;

    Eigen::Vector3f result_color = {0, 0, 0};

    for (auto& light : lights)
    {
        // TODO: For each light source in the code, calculate what the *ambient*, *diffuse*, and *specular* 
        // components are. Then, accumulate that result on the *result_color* object.

        Eigen::Vector3f vec_light = light.position - point;
        Eigen::Vector3f vec_view = eye_pos - point;
        float r2 = vec_light.dot(vec_light);

        Eigen::Vector3f La = ka.cwiseProduct(amb_light_intensity);
        Eigen::Vector3f Ld = kd.cwiseProduct(light.intensity / r2);
        Ld *= std::max(0.0f, normal.normalized().dot(vec_light.normalized()));
        Eigen::Vector3f Ls = ks.cwiseProduct(light.intensity / r2);
        Eigen::Vector3f h = (vec_light + vec_view).normalized();
        Ls *= std::pow(std::max(0.0f, normal.normalized().dot(h)), p);

        result_color += (La + Ld + Ls);
    }

    return result_color * 255.f;
}

Eigen::Vector3f bump_fragment_shader(const fragment_shader_payload& payload)
{
    
    Eigen::Vector3f ka = Eigen::Vector3f(0.005, 0.005, 0.005);
    Eigen::Vector3f kd = payload.color;
    Eigen::Vector3f ks = Eigen::Vector3f(0.7937, 0.7937, 0.7937);

    auto l1 = light{{20, 20, 20}, {500, 500, 500}};
    auto l2 = light{{-20, 20, 0}, {500, 500, 500}};

    std::vector<light> lights = {l1, l2};
    Eigen::Vector3f amb_light_intensity{10, 10, 10};
    Eigen::Vector3f eye_pos{0, 0, 10};

    float p = 150;

    Eigen::Vector3f color = payload.color; 
    Eigen::Vector3f point = payload.view_pos;
    Eigen::Vector3f normal = payload.normal;


    float kh = 0.2, kn = 0.1;

    // TODO: Implement bump mapping here
    // Let n = normal = (x, y, z)
    // Vector t = (x*y/sqrt(x*x+z*z),sqrt(x*x+z*z),z*y/sqrt(x*x+z*z))
    // Vector b = n cross product t
    // Matrix TBN = [t b n]
    // dU = kh * kn * (h(u+1/w,v)-h(u,v))
    // dV = kh * kn * (h(u,v+1/h)-h(u,v))
    // Vector ln = (-dU, -dV, 1)
    // Normal n = normalize(TBN * ln)


    float x = normal.x();
    float y = normal.y();
    float z = normal.z();
    Eigen::Vector3f t = {x * y / std::sqrt(x * x + z * z), std::sqrt(x * x + z * z), z * y / std::sqrt(x * x + z * z)};
    Eigen::Vector3f b = normal.cross(t);
    Eigen::Matrix3f TBN;
    TBN << t.x(), b.x(), normal.x(),
           t.y(), b.y(), normal.y(),
           t.z(), b.z(), normal.z();
    float u = payload.tex_coords.x();
    float v = payload.tex_coords.y();
    float w = payload.texture->width;
    float h = payload.texture->height;
    float dU = kh * kn * (payload.texture->getColor(u + 1.0f / w, v).norm() - payload.texture->getColor(u, v).norm());
    float dV = kh * kn * (payload.texture->getColor(u, v + 1.0f / h).norm() - payload.texture->getColor(u, v).norm());
    Eigen::Vector3f ln = {-dU, -dV, 1.0f};
    Eigen::Vector3f n = TBN * ln;
    Eigen::Vector3f result_color = {0, 0, 0};
    result_color = n.normalized();

    return result_color * 255.f;
}

Eigen::Vector3f displacement_fragment_shader(const fragment_shader_payload& payload)
{
    
    Eigen::Vector3f ka = Eigen::Vector3f(0.005, 0.005, 0.005);
    Eigen::Vector3f kd = payload.color;
    Eigen::Vector3f ks = Eigen::Vector3f(0.7937, 0.7937, 0.7937);

    auto l1 = light{{20, 20, 20}, {500, 500, 500}};
    auto l2 = light{{-20, 20, 0}, {500, 500, 500}};

    std::vector<light> lights = {l1, l2};
    Eigen::Vector3f amb_light_intensity{10, 10, 10};
    Eigen::Vector3f eye_pos{0, 0, 10};

    float p = 150;

    Eigen::Vector3f color = payload.color; 
    Eigen::Vector3f point = payload.view_pos;
    Eigen::Vector3f normal = payload.normal;

    float kh = 0.2, kn = 0.1;
    
    // TODO: Implement displacement mapping here
    // Let n = normal = (x, y, z)
    // Vector t = (x*y/sqrt(x*x+z*z),sqrt(x*x+z*z),z*y/sqrt(x*x+z*z))
    // Vector b = n cross product t
    // Matrix TBN = [t b n]
    // dU = kh * kn * (h(u+1/w,v)-h(u,v))
    // dV = kh * kn * (h(u,v+1/h)-h(u,v))
    // Vector ln = (-dU, -dV, 1)
    // Position p = p + kn * n * h(u,v)
    // Normal n = normalize(TBN * ln)


    float x = normal.x();
    float y = normal.y();
    float z = normal.z();
    Eigen::Vector3f t = {x * y / std::sqrt(x * x + z * z), std::sqrt(x * x + z * z), z * y / std::sqrt(x * x + z * z)};
    Eigen::Vector3f b = normal.cross(t);
    Eigen::Matrix3f TBN;
    TBN << t.x(), b.x(), normal.x(),
           t.y(), b.y(), normal.y(),
           t.z(), b.z(), normal.z();
    float u = payload.tex_coords.x();
    float v = payload.tex_coords.y();
    float w = payload.texture->width;
    float h = payload.texture->height;
    float dU = kh * kn * (payload.texture->getColor(u + 1.0f / w, v).norm() - payload.texture->getColor(u, v).norm());
    float dV = kh * kn * (payload.texture->getColor(u, v + 1.0f / h).norm() - payload.texture->getColor(u, v).norm());
    Eigen::Vector3f ln = {-dU, -dV, 1.0f};

    // Position
    point += kn * normal * payload.texture->getColor(u, v).norm();

    normal = TBN * ln;

    Eigen::Vector3f result_color = {0, 0, 0};

    for (auto& light : lights)
    {
        // TODO: For each light source in the code, calculate what the *ambient*, *diffuse*, and *specular* 
        // components are. Then, accumulate that result on the *result_color* object.


        Eigen::Vector3f vec_light = light.position - point;
        Eigen::Vector3f vec_view = eye_pos - point;
        float r2 = vec_light.dot(vec_light);

        Eigen::Vector3f La = ka.cwiseProduct(amb_light_intensity);
        Eigen::Vector3f Ld = kd.cwiseProduct(light.intensity / r2);
        Ld *= std::max(0.0f, normal.normalized().dot(vec_light.normalized()));
        Eigen::Vector3f Ls = ks.cwiseProduct(light.intensity / r2);
        Eigen::Vector3f h = (vec_light + vec_view).normalized();
        Ls *= std::pow(std::max(0.0f, normal.normalized().dot(h)), p);

        result_color += (La + Ld + Ls);
    }

    return result_color * 255.f;
}

Eigen::Vector3f getColorBilinear(float u, float v)
{
    auto u_img = u * width;
    auto v_img = (1 - v) * height;
    float u1 = std::floor(u_img);
    float u2 = std::min((float)width, std::ceil(u_img));
    float v1 = std::floor(v_img);
    float v2 = std::min((float)height, std::ceil(v_img));
    auto Q11 = image_data.at<cv::Vec3b>(v1, u1);
    auto Q12 = image_data.at<cv::Vec3b>(v2, u1);
    auto Q21 = image_data.at<cv::Vec3b>(v1, u2);
    auto Q22 = image_data.at<cv::Vec3b>(v2, u2);
    auto fuv1 = (u2 - u_img) / (u2 - u1) * Q11 + (u_img - u1) / (u2 - u1) * Q21;
    auto fuv2 = (u2 - u_img) / (u2 - u1) * Q12 + (u_img - u1) / (u2 - u1) * Q22;
    auto color = (v2 - v_img) / (v2 - v1) * fuv1 + (v_img - v1) / (v2 - v1) * fuv2;
    return Eigen::Vector3f(color[0], color[1], color[2]);
}
```

## Assignment4

1. 利用德卡斯特里奥算法（De Casteljau's algorithm）实现 Bézier 曲线，从A到B的向量是B-A。因为u是在0和1之间的比率，点C位于u(B-A)。将A的位置加以考虑，点C为A+u(B-A)=(1-u)A+uB。因此，对于给定的u，(1-u)A+uB是在A和B之间的点C，将AB分为u:1-u的两段。

```c++
cv::Point2f recursive_bezier(const std::vector<cv::Point2f> &control_points, float t) 
{
    // TODO: Implement de Casteljau's algorithm
    if (control_points.size() == 2) {
        return control_points[0] + t * (control_points[1] - control_points[0]);
    }

    std::vector<cv::Point2f> cp;
    for (int i = 0; i < control_points.size() - 1; i++) {
        cp.push_back(control_points[i] + t * (control_points[i + 1] - control_points[i]));
    }

    return recursive_bezier(cp, t);
}
```
