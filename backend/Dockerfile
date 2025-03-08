FROM node:22.14.0-alpine AS base

RUN corepack enable
RUN corepack install -g pnpm

RUN apk update \
    && apk add ffmpeg \
    && rm -rf /var/cache/apk/*

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

FROM base AS development

EXPOSE 3000

CMD ["pnpm", "dev"]

FROM base AS builder

RUN pnpm build

FROM base AS production

ENV GROUPNAME=appgroup
ENV USER=appuser

RUN addgroup "$GROUPNAME" && \
    adduser \
    --disabled-password \
    --gecos "" \
    --ingroup "$GROUPNAME" \
    --no-create-home \
    $USER

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-lock.yaml

USER $USER

WORKDIR /app

EXPOSE 3000

CMD ["pnpm", "start"]