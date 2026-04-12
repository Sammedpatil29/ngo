# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --configuration=production

# Stage 2: Serve with Nginx
FROM nginx:alpine

# 1. Copy the custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 2. Copy the build output
COPY --from=build /app/dist/ngo/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]