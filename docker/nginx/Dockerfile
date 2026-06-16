FROM nginx:alpine

RUN apk add --no-cache certbot certbot-nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY sites/ /etc/nginx/sites-enabled/

RUN mkdir -p /etc/letsencrypt /var/www/certbot

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
