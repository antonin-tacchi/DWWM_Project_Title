#!/bin/bash
set -e

mysql -u root -p"${MYSQL_ROOT_PASSWORD}" <<-EOSQL
    CREATE DATABASE IF NOT EXISTS auth_db   CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    CREATE DATABASE IF NOT EXISTS movies_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    CREATE DATABASE IF NOT EXISTS social_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    CREATE DATABASE IF NOT EXISTS notifs_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

    GRANT ALL PRIVILEGES ON auth_db.*   TO '${MYSQL_USER}'@'%';
    GRANT ALL PRIVILEGES ON movies_db.* TO '${MYSQL_USER}'@'%';
    GRANT ALL PRIVILEGES ON social_db.* TO '${MYSQL_USER}'@'%';
    GRANT ALL PRIVILEGES ON notifs_db.* TO '${MYSQL_USER}'@'%';

    FLUSH PRIVILEGES;
EOSQL

echo "Databases and privileges initialized successfully."
