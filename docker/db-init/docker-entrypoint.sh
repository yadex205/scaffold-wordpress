#!/bin/sh

MYSQL="mysql -uroot -S${MYSQLD_SOCK}"

for i in `seq 1 10`; do
    sleep 1

    if `${MYSQL} -e "SHOW DATABASES" > /dev/null`; then
        break
    fi

    if [ $i -eq 5 ]; then
        echo "Cannot execute query to initialize database."
        exit 1;
    fi
done

$MYSQL <<SQL
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'password' WITH GRANT OPTION;
SQL
