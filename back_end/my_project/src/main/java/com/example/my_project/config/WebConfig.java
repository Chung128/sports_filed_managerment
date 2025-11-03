package com.example.my_project.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;


//lấy ảnh được lưu trong dự án
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Lấy đường dẫn tuyệt đối của thư mục "uploads"
        String uploadPath = Paths.get(System.getProperty("user.dir"), "uploads").toUri().toString();

        // Khi FE gọi http://localhost:8080/uploads/abc.png → map đến thư mục thực
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath);
    }
}
