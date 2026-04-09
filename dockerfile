FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY ./ ./
RUN npm run build

#stage
FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY ./data ./data

CMD ["node","./dist/index.js"]

