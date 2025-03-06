FROM node:22.14.0-alpine AS builder

RUN corepack enable
RUN corepack install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm build

RUN apk update \
    && apk add ffmpeg \
    && rm -rf /var/cache/apk/*

# FROM node:22.14.0-alpine

# ENV GROUPNAME=appgroup
# ENV USER=appuser

# RUN addgroup "$GROUPNAME" && \
#     adduser \
#     --disabled-password \
#     --gecos "" \
#     --ingroup "$GROUPNAME" \
#     --no-create-home \
#     $USER

# COPY --from=builder --chown=$USER:$GROUPNAME /app/dist /app/dist
# COPY --from=builder --chown=$USER:$GROUPNAME /app/node_modules /app/node_modules
# COPY --from=builder --chown=$USER:$GROUPNAME /app/package.json /app/package.json
# COPY --from=builder --chown=$USER:$GROUPNAME /app/pnpm-lock.yaml /app/pnpm-lock.yaml

# USER $USER

# WORKDIR /app

EXPOSE 3000

CMD ["pnpm", "start"]