#!/bin/sh

MYSQLD_SOCK="/usr/local/mysqld/mysqld.sock"
MYSQL="mysql -uroot -S${MYSQLD_SOCK} --protocol=socket"
WPCLI="wp --path=/usr/local/site"

until `$MYSQL -e "SHOW DATABASES;" > /dev/null`; do
    echo "Checking connection to database"
    sleep 1
done

$MYSQL -e "CREATE DATABASE IF NOT EXISTS wordpress;"

echo "Connection to database is established"

if [ ! -e /usr/local/site/wp-config.php ]; then
    $WPCLI config create \
        --dbname=wordpress \
        --dbuser=root \
        --dbhost=localhost:${MYSQLD_SOCK} \
        --extra-php <<PHP
define( 'WP_DEBUG', true );
define( 'IMPORT_DEBUG', true );
define( 'EMPTY_TRASH_DAYS', 0 );
define( 'AUTOMATIC_UPDATER_DISABLED', true );
define( 'WP_AUTO_UPDATE_CORE', false );
PHP
    $WPCLI core install \
        --title="${WP_SITE_TITLE}" \
        --admin_user="${WP_ADMIN_USER}" \
        --admin_password="${WP_ADMIN_PASS}" \
        --admin_email=user@example.com \
        --url=http://localhost:8000 \
        --skip-email
    $WPCLI option update blogdescription "${WP_SITE_DESCRIPTION}"
    $WPCLI option update uploads_use_yearmonth_folders 0
    $WPCLI option update permalink_structure "/%postname%/"
fi

chown -R nginx:nginx /usr/local/site/*

cat <<EOF

=========================
🎉 WordPress is ready! 🎉
=========================

EOF

exec "$@"
