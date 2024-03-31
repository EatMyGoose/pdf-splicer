FROM node:20-bookworm-slim as build

WORKDIR /splicer-app

COPY . .

RUN npm install && npm run build

# EXPOSE 4173

# CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]

FROM nginx:1.25.4-alpine as prod

COPY --from=build splicer-app/dist splicer-app/

COPY nginx.conf /etc/nginx/conf.d/default.conf



