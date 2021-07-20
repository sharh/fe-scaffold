FROM nginx:stable

WORKDIR /data
COPY ./dist /data/nginx
