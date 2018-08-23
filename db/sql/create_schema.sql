CREATE SCHEMA `log_mp` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'mp_db_user'@'%' IDENTIFIED BY 'log_mp_2018';

GRANT ALL privileges ON log_mp.* TO 'mp_db_user'@'%'IDENTIFIED BY 'log_mp_2018';
