FROM node:23-slim as build-stage
WORKDIR /app
COPY diplom_ui/package*.json ./
RUN npm install --force
COPY diplom_ui/. .
RUN npm run build

FROM nginx:alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
# COPY hyperapp /usr/share/nginx/html
COPY  nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/diplom.crt /etc/nginx/certs/diplom.crt
COPY nginx/diplom.key /etc/nginx/certs/diplom.key
EXPOSE 80 433
CMD ["nginx", "-g", "daemon off;"]