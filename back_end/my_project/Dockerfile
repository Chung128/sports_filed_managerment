# Sử dụng image JDK chính thức
FROM openjdk:17-jdk-slim

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép file JAR từ dự án
COPY build/libs/my_project-0.0.1-SNAPSHOT.jar app.jar

# Mở cổng ứng dụng Spring Boot (mặc định 8080)
EXPOSE 8080

# Lệnh chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]