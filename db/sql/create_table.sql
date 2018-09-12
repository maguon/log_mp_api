-- ----------------------------
-- Table structure for city_info
-- ----------------------------
DROP TABLE IF EXISTS `city_info`;
CREATE TABLE `city_info` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `city_name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for city_route_info
-- ----------------------------
DROP TABLE IF EXISTS `city_route_info`;
CREATE TABLE `city_route_info` (
  `route_id` int(10) NOT NULL DEFAULT '0' COMMENT '线路组合ID',
  `route_start_id` int(10) DEFAULT NULL COMMENT '起始地ID',
  `route_start` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT '起始地名称',
  `route_end_id` int(10) NOT NULL COMMENT '目的地ID',
  `route_end` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT '目的地名称',
  `distance` decimal(10,2) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`route_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for supplier_bank
-- ----------------------------
DROP TABLE IF EXISTS `supplier_bank`;
CREATE TABLE `supplier_bank` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supplier_id` int(11) NOT NULL COMMENT '供应商id',
  `bank` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '银行名称',
  `bank_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '卡号',
  `account_name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '姓名',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for supplier_contact
-- ----------------------------
DROP TABLE IF EXISTS `supplier_contact`;
CREATE TABLE `supplier_contact` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supplier_id` int(11) NOT NULL COMMENT '供应商id',
  `name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '姓名',
  `position` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '职位',
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '电话号码',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for supplier_info
-- ----------------------------
DROP TABLE IF EXISTS `supplier_info`;
CREATE TABLE `supplier_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supplier_short` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '供应商简称',
  `supplier_full` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '供应商全称',
  `mark` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `wechat_account` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '微信账号',
  `password` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wechat_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` tinyint(1) DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户头像',
  `wechat_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '微信状态(0-停用,1-可用)',
  `auth_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '认证状态(0-停用,1-可用)',
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '用户类型(1-车管部,2-仓储部,3-调度部,4-国贸部)',
  `auth_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '认证时间',
  `last_login_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;