# syntax=docker/dockerfile:1.2

# Use a specific Node.js version as build argument
ARG NODE_VERSION=18.0.0

# Base image with Node.js
FROM node:${NODE_VERSION}-alpine as base

# Create app directory and set ownership to node user
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Set working directory
WORKDIR /home/node/app

# Expose port 3000 if your application uses it
EXPOSE 8080

# Development stage
FROM base as dev

# # Create a directory for npm cache with proper permissions
# RUN mkdir -p /home/node/app/.npm/_logs

# # Set npm cache directory and global config
# RUN npm config set cache /home/node/app/.npm --global

# Ensure the dist directory exists and set ownership
RUN mkdir -p /home/node/app/dist && chown -R node:node /home/node/app/dist

# Install a specific version of npm globally (if needed)
RUN npm install -g npm@9.3.1

# Copy package*.json and package-lock.json to container
COPY package.json package-lock.json ./

# Install all dependencies including devDependencies
RUN npm ci --include=dev

# Switch to non-root user 'node' for security reasons
USER node

# Copy application source code
COPY --chown=node:node . .



RUN npm run build
# Command to run the application in development mode
CMD npm run start:prod

# tạm thoi gắn --mount=type=bind,source=package.json,target=package.json  là giai đoạn phụ thuộc 
# use Sử dụng bộ nhớ cache để tăng tốc quá trình cài đặt bằng cách lưu trữ các mô-đun npm.    --mount=type=cache,target=/root/.npm \
# cai dat các phụ thuoc bao gom ca  Cài đặt tất cả các phụ thuộc bao gồm cả devDependencies.
# Chuyển người dùng sang node để chạy các lệnh, cải thiện bảo mật.

# FROM base as prod
# COPY package.json package-lock.json ./
# RUN --mount=type=cache,target=/root/.npm \
# RUN  npm ci --omit=dev
# USER node
# COPY . .
# CMD node src/index.js

# npm ci --omit=dev để loại bỏ devDependencies, tối ưu hóa container cho sản xuất.


# type=bind: Gắn kết tệp từ hệ thống tệp chủ (host) vào hệ thống tệp trong container.
# source=package.json: Đường dẫn tệp trên máy chủ.
# target=package.json: Đường dẫn mục tiêu trong container


# //npm run migration:generate src/db/migrations/add_forenky_two_table