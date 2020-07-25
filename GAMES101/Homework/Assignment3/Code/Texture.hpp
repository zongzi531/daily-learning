//
// Created by LEI XU on 4/27/19.
//

#ifndef RASTERIZER_TEXTURE_H
#define RASTERIZER_TEXTURE_H
#include "global.hpp"
#include <eigen3/Eigen/Eigen>
#include <opencv2/opencv.hpp>
class Texture{
private:
    cv::Mat image_data;

public:
    Texture(const std::string& name)
    {
        image_data = cv::imread(name);
        cv::cvtColor(image_data, image_data, cv::COLOR_RGB2BGR);
        width = image_data.cols;
        height = image_data.rows;
    }

    int width, height;

    Eigen::Vector3f getColor(float u, float v)
    {
        auto u_img = u * width;
        auto v_img = (1 - v) * height;
        auto color = image_data.at<cv::Vec3b>(v_img, u_img);
        return Eigen::Vector3f(color[0], color[1], color[2]);
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
};
#endif //RASTERIZER_TEXTURE_H
