# ---- Build Stage ----
    FROM node:18 AS build

    WORKDIR /app
    
    # Copy package files & install deps
    COPY package*.json ./
    RUN npm install
    
    # Copy all project files
    COPY . .
    
    # Build production bundle
    RUN npm run build
    
    
    # ---- Serve Stage ----
    FROM nginx:alpine
    
    # Copy build output to NGINX html folder
    COPY --from=build /app/dist /usr/share/nginx/html
    
    # Expose web server port
    EXPOSE 80
    
    CMD ["nginx", "-g", "daemon off;"]
    