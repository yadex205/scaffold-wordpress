scaffold-wordpress
==================

A scaffold project for WordPress based site development


Tips
----

### How to access database from host?

Use your favorite MariaDB (MySQL) client with following login information.

|Param   |Value      |
|--------|-----------|
|Host    |`127.0.0.1`|
|Port    |`33060`    |
|User    |`root`     |
|Password|`password` |
|Database|`wordpress`|

**Example**

```bash
mysql -uroot -ppassword -h127.0.0.1 -P33060 wordpress
```
