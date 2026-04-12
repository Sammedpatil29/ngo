# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --configuration=production

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Adjust the path below to match your actual 'dist' folder name
COPY --from=build /app/dist/may-i-help-you-foundation-frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]