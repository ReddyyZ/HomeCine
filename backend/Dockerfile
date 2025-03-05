FROM node:22.14.0-alpine AS base

RUN npm install -g pnpm

FROM base AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

ENV GROUPNAME=appgroup
ENV USER=appuser


RUN addgroup "$GROUPNAME" && \
    adduser \
    --disabled-password \
    --gecos "" \
    --ingroup "$GROUPNAME" \
    --no-create-home \
    $USER

COPY . .

RUN pnpm build

FROM base AS worker

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

EXPOSE 3000

USER appuser

CMD ["pnpm", "start"]