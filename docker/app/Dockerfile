FROM alpine:3.9

RUN apk add --no-cache \
  less \
  curl \
  nginx \
  php \
  php-phar php-fpm php-mysqli php-pdo_mysql php-opcache \
  php-tokenizer php-ctype php-json php-curl php-openssl php-xml php-mbstring \
  mariadb-client \
  rsync

RUN curl -o /usr/local/bin/wp https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
RUN chmod +x /usr/local/bin/wp
RUN mkdir -p /usr/local/site
RUN chown -R nginx /usr/local/site

USER nginx
WORKDIR /usr/local/site
RUN wp core download --locale=ja

USER root

ENV WP_ADMIN_USER user
ENV WP_ADMIN_PASS pass
ENV WP_SITE_TITLE website title
ENV WP_SITE_DESCRIPTION website description

COPY php.ini /etc/php7/php.ini
COPY www.conf /etc/php7/php-fpm.d/www.conf
RUN mkdir -p /run/php-fpm

COPY docker-entrypoint.sh /usr/local/bin
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm7", "-F"]
