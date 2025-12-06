
FROM node:20-slim AS base

RUN npm install -g pnpm

WORKDIR /app

FROM base AS dev

ENV NODE_ENV=development

COPY package.json ./
RUN pnpm install --reporter=verbose

COPY . .

CMD ["pnpm", "run", "dev"]

FROM node:20-slim AS prod

WORKDIR /app
ENV NODE_ENV=production

RUN npm install -g pnpm

COPY package.json ./
RUN pnpm install --prod --reporter=verbose

COPY . .

CMD ["node", "server.js"]
