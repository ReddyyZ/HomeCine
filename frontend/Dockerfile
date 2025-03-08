# Stage 1: Build
FROM node:22.14.0-alpine AS base

RUN corepack enable
RUN corepack install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

FROM base AS development

EXPOSE 5173

CMD ["pnpm", "dev", "--host"]

FROM nginx:alpine AS production
COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the port the frontend runs on
EXPOSE 80