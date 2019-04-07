FROM alpine:3.9

RUN apk add --no-cache mariadb-client

ENV MYSQLD_SOCK /usr/local/mysqld/mysqld.sock

COPY docker-entrypoint.sh /usr/local/bin
ENTRYPOINT ["docker-entrypoint.sh"]
