FROM alpine:3.9

RUN apk add --no-cache nginx

COPY nginx.conf /etc/nginx/nginx.conf

COPY docker-entrypoint.sh /usr/local/bin
ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
