FROM node:22.14.0-alpine AS base


RUN apk update \
    && apk add ffmpeg \
    && rm -rf /var/cache/apk/*

RUN corepack enable

USER node
    
RUN corepack install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

FROM base AS development

EXPOSE 3000

CMD ["pnpm", "dev"]

FROM base AS builder

USER node

RUN pnpm build

FROM base AS production

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-lock.yaml

USER node

WORKDIR /app

EXPOSE 3000

CMD ["pnpm", "start"]