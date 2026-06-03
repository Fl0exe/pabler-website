# syntax=docker.io/docker/dockerfile:1

FROM node:lts-alpine
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

RUN pnpm run db:deploy 

ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable pnpm && pnpm run build

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY . .

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
