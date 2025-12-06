
FROM node:20-slim AS base

RUN npm install -g pnpm

WORKDIR /app

FROM base AS dev

ENV NODE_ENV=development

COPY package.json ./
RUN pnpm install --reporter=verbose

COPY . .

CMD ["pnpm", "run", "dev", "--", "--host"]

FROM base AS build

ENV NODE_ENV=production

COPY package.json ./
RUN pnpm install --reporter=verbose

COPY . .
RUN pnpm run build   # creates /app/dist

FROM nginx:1.27-alpine AS prod

COPY --from=build /app/dist /usr/share/nginx/html


CMD ["nginx", "-g", "daemon off;"]
