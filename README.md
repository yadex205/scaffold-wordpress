scaffold-wordpress
==================

A scaffold project for WordPress based site development


Requirements
------------

* Git
* Node.js `>=8.0.0`
* Docker (Docker Engine `>=17.12.0`) + docker-compose


Quickstart
----------

```bash
git clone https://github.com/yadex205/scaffold-wordpress.github my-site
cd my-site
rm -rf .git

npm install
docker-compose up
npm run bootstrap
```

then WordPress is available on `http://localhost:8000`.


Configure
---------

### `wordpress.config.js`

Used for bootstrapping WordPress (`npm run bootstrap`).


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
