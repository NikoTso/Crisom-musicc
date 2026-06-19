FROM nginx:alpine

COPY ./site /usr/share/nginx/html
COPY ./site/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
