FROM node:20-bookworm-slim as build

WORKDIR /splicer-app

COPY . .

RUN npm install && npm run build

FROM nginx:1.25.4-alpine as prod

COPY --from=build splicer-app/dist splicer-app/

COPY nginx.conf /etc/nginx/conf.d/default.conf



