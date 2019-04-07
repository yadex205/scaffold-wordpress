FROM alpine:3.9

RUN apk add --no-cache mariadb mariadb-client

# @see https://wiki.rookie-inc.com/serverapps/mysql for '--datadir' value
RUN mysql_install_db --user=mysql --datadir=/var/db/mysql

RUN rm -rf /etc/my.cnf.d
COPY my.cnf /etc/my.cnf

ENV MYSQL_SOCK="/run/mysqld/mysqld.sock"
RUN install -g mysql -o mysql -d /run/mysqld

COPY docker-entrypoint.sh /usr/local/bin
ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["mysqld"]
