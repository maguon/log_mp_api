CREATE SCHEMA `log_mp` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'log'@'%' IDENTIFIED BY 'log_mp';

GRANT ALL privileges ON log_base.* TO 'log'@'%'IDENTIFIED BY 'log_mp';
