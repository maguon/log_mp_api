CREATE SCHEMA `log_mp` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'log'@'%' IDENTIFIED BY 'log_mp';

GRANT ALL privileges ON log_base.* TO 'log'@'%'IDENTIFIED BY 'log_mp';

DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info` (
 `id`  int(20) NOT NULL AUTO_INCREMENT ,
 `user_name`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL ,
 `wechat_id`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL ,
 `password`  varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL ,
 `gender`  tinyint(1) NULL DEFAULT NULL ,
 `phone`  varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL ,
 `last_login_on`  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,
 `created_on`  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ,
 `updated_on`  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,
 `status`  tinyint(4) NOT NULL DEFAULT 1 COMMENT '状态(0-停用,1-可用)' ,
 PRIMARY KEY (`id`)
 )
 ENGINE=InnoDB
 DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
 AUTO_INCREMENT=11
 ROW_FORMAT=DYNAMIC
 ;
