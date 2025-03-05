# Stage 1: Build
FROM node:22.14.0-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm

FROM base AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the frontend
RUN pnpm run build

# Stage 2: Serve
FROM base as worker

ENV GROUPNAME=appgroup
ENV USER=appuser

RUN pnpm install -g serve

RUN addgroup "$GROUPNAME" && \
    adduser \
    --disabled-password \
    --gecos "" \
    --ingroup "$GROUPNAME" \
    --no-create-home \
    $USER

# Copy the built frontend files to the Nginx server
COPY --from=builder /app/dist /app/dist

RUN chown -R $USER:$GROUPNAME /app/dist

# Expose the port the frontend runs on
EXPOSE 5000

USER $USER

# Command to run Nginx
CMD ["serve", "-s", "/app/dist", "-l", "5000"]