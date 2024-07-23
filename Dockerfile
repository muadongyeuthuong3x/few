# Stage 1: Build the Node.js application
ARG NODE_VERSION=18.0.0

# Base image with Node.js
FROM node:${NODE_VERSION}-alpine as builder
WORKDIR /home/node/app
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /home/node/app/build /usr/share/nginx/html
