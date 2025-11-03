# Stage 1: Build ứng dụng
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
# Cài đặt dependency, bao gồm cả dev dependencies cần thiết cho bước build
RUN npm ci --silent
COPY . .
# Chạy lệnh build (tạo ra thư mục 'build' chứa các file tĩnh)
RUN npm run build

# Stage 2: Chỉ phục vụ (serve) các file tĩnh bằng Node.js
# Cần cài đặt một package để serve (ví dụ: 'serve') nếu bạn chưa có
FROM node:18-alpine
WORKDIR /usr/src/app
# Cài đặt globally một công cụ phục vụ file tĩnh (ví dụ: 'serve')
RUN npm install -g serve

# Copy các file tĩnh đã được build từ Stage 1
COPY --from=build /app/build /usr/src/app

# Mở cổng mà 'serve' sẽ lắng nghe
EXPOSE 80

# Lệnh khởi động: Phục vụ thư mục hiện tại (chứa các file build) trên cổng 8081
# Cổng 8081 được chọn để tránh xung đột với backend 8080 nếu chạy local.
CMD ["serve", "-s", ".", "-l", "80"]