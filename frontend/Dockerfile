# Stage 1: Build
FROM node:22.14.0-alpine AS builder

# Install pnpm globally
# RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
# RUN pnpm install
RUN npm install --force

# Copy the rest of the application code
COPY . .

# Build the frontend
# RUN pnpm build
RUN npm run build 

# Stage 2: Serve
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the built frontend files to the Nginx server
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the port the frontend runs on
EXPOSE 80