SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for `address_contact`
-- ----------------------------
DROP TABLE IF EXISTS `address_contact`;
CREATE TABLE `address_contact` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `address_id` int(11) NOT NULL,
  `user_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `address_info`
-- ----------------------------
DROP TABLE IF EXISTS `address_info`;
CREATE TABLE `address_info` (
  `id` int(1) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `city` int(11) DEFAULT NULL,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lon` decimal(10,4) DEFAULT '0.0000',
  `lat` decimal(10,4) DEFAULT '0.0000',
  `address` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT '0',
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `admin_user`
-- ----------------------------
DROP TABLE IF EXISTS `admin_user`;
CREATE TABLE `admin_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名',
  `real_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '真名',
  `password` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户密码',
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '手机号',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态(0-停用,1-可用)',
  `gender` tinyint(1) NOT NULL DEFAULT '1',
  `type` int(10) NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `city_info`
-- ----------------------------
DROP TABLE IF EXISTS `city_info`;
CREATE TABLE `city_info` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `city_name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cityPinYin` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cityPY` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `city_route_info`
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
-- Table structure for `company_bank`
-- ----------------------------
DROP TABLE IF EXISTS `company_bank`;
CREATE TABLE `company_bank` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_id` int(11) DEFAULT NULL COMMENT '管理员id',
  `bank` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '银行名称',
  `bank_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '卡号',
  `account_name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '姓名',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0:启用,1:停用',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `customer_service_phone`
-- ----------------------------
DROP TABLE IF EXISTS `customer_service_phone`;
CREATE TABLE `customer_service_phone` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '客服电话',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `date_base`
-- ----------------------------
DROP TABLE IF EXISTS `date_base`;
CREATE TABLE `date_base` (
  `id` int(4) NOT NULL,
  `day` int(4) NOT NULL,
  `week` int(4) NOT NULL,
  `month` int(4) NOT NULL,
  `year` int(4) NOT NULL,
  `y_month` int(4) NOT NULL,
  `y_week` int(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for `department_info`
-- ----------------------------
DROP TABLE IF EXISTS `department_info`;
CREATE TABLE `department_info` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `admin_id` int(20) DEFAULT NULL,
  `department_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '状态(0:使用,1:停用)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `dp_load_task`
-- ----------------------------
DROP TABLE IF EXISTS `dp_load_task`;
CREATE TABLE `dp_load_task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_id` int(10) NOT NULL COMMENT '管理员ID',
  `order_id` int(10) NOT NULL COMMENT '订单ID',
  `require_id` int(10) NOT NULL COMMENT '需求ID',
  `supplier_id` int(10) NOT NULL COMMENT '供应商ID',
  `hook_id` int(10) DEFAULT '0' COMMENT '供应商表中对应的id',
  `route_start_detail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '起始地详细地址',
  `route_start` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '起始城市',
  `route_start_id` int(10) NOT NULL COMMENT '起始地发货地址ID',
  `route_end_id` int(10) NOT NULL COMMENT '目的地ID',
  `route_end_detail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '目的地详细地址',
  `route_end` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '目的城市',
  `plan_date` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plan_date_id` int(4) DEFAULT NULL COMMENT '计划装车时间',
  `arrive_date` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `arrive_date_id` int(4) DEFAULT NULL COMMENT '到达时间',
  `load_date` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `load_date_id` int(4) DEFAULT NULL COMMENT '已装车时间',
  `payment_on_id` int(4) DEFAULT NULL,
  `car_count` int(10) NOT NULL DEFAULT '0' COMMENT '计划派发商品车数量',
  `trans_type` tinyint(1) DEFAULT '1' COMMENT '运输方式 1:公路 2：海运 ',
  `load_task_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '任务状态(1-未装车,2-已装车,3-已送达)',
  `payment_flag` int(1) NOT NULL DEFAULT '0',
  `supplier_trans_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `supplier_insure_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `remark` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `payment_on` timestamp NULL DEFAULT NULL COMMENT '付款时间',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `dp_load_task_detail`
-- ----------------------------
DROP TABLE IF EXISTS `dp_load_task_detail`;
CREATE TABLE `dp_load_task_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dp_load_task_id` int(10) NOT NULL COMMENT '运输ID',
  `require_id` int(10) NOT NULL COMMENT '需求ID',
  `order_id` int(10) NOT NULL COMMENT '订单ID',
  `order_item_id` int(10) NOT NULL COMMENT '订单详细ID',
  `supplier_id` int(10) NOT NULL COMMENT '供应商ID',
  `vin` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '商品车VIN码',
  `date_id` int(4) DEFAULT NULL COMMENT '统计时间',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '商品车状态(1-已装车,2-已送达)',
  `supplier_trans_price` decimal(10,2) DEFAULT '0.00' COMMENT '供应商运费',
  `supplier_insure_price` decimal(10,2) DEFAULT '0.00' COMMENT '供应商保费',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `hook_id` int(10) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `dp_require_task`
-- ----------------------------
DROP TABLE IF EXISTS `dp_require_task`;
CREATE TABLE `dp_require_task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(10) NOT NULL COMMENT '订单ID',
  `route_start` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '起始城市',
  `route_end` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '目的城市',
  `route_start_id` int(11) DEFAULT NULL COMMENT '起始城市ID',
  `route_end_id` int(11) DEFAULT NULL COMMENT '目的城市ID',
  `date_id` int(4) DEFAULT NULL COMMENT '指令时间',
  `car_num` int(10) DEFAULT NULL,
  `load_car_num` int(10) NOT NULL DEFAULT '0',
  `remark` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0:待安排 1:安排中 2:已安排',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `inquiry_car`
-- ----------------------------
DROP TABLE IF EXISTS `inquiry_car`;
CREATE TABLE `inquiry_car` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `inquiry_id` int(11) NOT NULL,
  `model_id` tinyint(1) DEFAULT NULL COMMENT '车型ID',
  `old_car` tinyint(1) DEFAULT '1' COMMENT '0：二手车  1：新车',
  `plan` decimal(10,2) DEFAULT '0.00' COMMENT '估值',
  `trans_price` decimal(10,2) DEFAULT '0.00',
  `insure_price` decimal(10,2) DEFAULT '0.00',
  `car_num` int(10) DEFAULT '1' COMMENT '车数量',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态',
  `safe_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '0否1是',
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `inquiry_info`
-- ----------------------------
DROP TABLE IF EXISTS `inquiry_info`;
CREATE TABLE `inquiry_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_id` int(11) NOT NULL DEFAULT '0',
  `user_id` int(11) NOT NULL,
  `date_id` int(4) DEFAULT NULL,
  `route_id` int(11) DEFAULT NULL COMMENT '路线id',
  `start_city` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `end_city` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_id` int(11) DEFAULT NULL,
  `end_id` int(11) DEFAULT NULL,
  `service_type` tinyint(1) DEFAULT '1' COMMENT '服务方式',
  `car_num` int(10) DEFAULT '1' COMMENT '车总数量',
  `distance` decimal(10,2) DEFAULT '0.00' COMMENT '公里数',
  `ora_trans_price` decimal(10,2) DEFAULT '0.00' COMMENT '标准运费费用',
  `ora_insure_price` decimal(10,2) DEFAULT '0.00' COMMENT '标准保险费',
  `total_trans_price` decimal(10,2) DEFAULT '0.00' COMMENT '协商总运费',
  `total_insure_price` decimal(10,2) DEFAULT '0.00' COMMENT '协商总保险费',
  `inquiry_name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'name',
  `cancel_reason` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0：询价中1：已询价2：生成订单3：取消订单',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `inquiry_time` timestamp NULL DEFAULT NULL,
  `cancel_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `inquiry_route_none_info`
-- ----------------------------
DROP TABLE IF EXISTS `inquiry_route_none_info`;
CREATE TABLE `inquiry_route_none_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL COMMENT '管理员id',
  `date_id` int(4) DEFAULT NULL,
  `route_id` int(10) NOT NULL COMMENT '路线id',
  `start_city` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `end_city` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_id` int(11) DEFAULT NULL,
  `end_id` int(11) DEFAULT NULL,
  `service_type` tinyint(1) NOT NULL DEFAULT '1' COMMENT '服务方式，1:上门提货 2:自提',
  `oldCar_flag` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0:旧车 1:新车',
  `car_model_type` tinyint(1) NOT NULL DEFAULT '1' COMMENT '车型',
  `car_insure_flag` tinyint(1) NOT NULL DEFAULT '1' COMMENT '车辆是否保险 1:是  0：否',
  `car_num` int(10) NOT NULL DEFAULT '0' COMMENT '车数量',
  `valuation` decimal(10,2) DEFAULT '0.00' COMMENT '估值',
  `status` tinyint(1) DEFAULT '0' COMMENT '状态: 0:该路线未开通 1:路线已经开工',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of inquiry_route_none_info
-- ----------------------------

-- ----------------------------
-- Table structure for `order_info`
-- ----------------------------
DROP TABLE IF EXISTS `order_info`;
CREATE TABLE `order_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_id` int(11) DEFAULT 0,
  `user_id` int(11) DEFAULT '0',
  `inquiry_id` int(11) DEFAULT '0',
  `route_id` int(11) DEFAULT NULL,
  `route_start_id` int(11) DEFAULT NULL,
  `route_end_id` int(11) DEFAULT NULL,
  `date_id` int(4) DEFAULT NULL,
  `route_start` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `route_end` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `distance` decimal(10,2) DEFAULT NULL,
  `service_type` tinyint(1) DEFAULT NULL COMMENT '上门服务，当地自提',
  `created_type` tinyint(1) DEFAULT '2' COMMENT '1:内部订单 2:外部订单 3:自建订单',
  `ora_trans_price` decimal(12,2) NOT NULL DEFAULT '0.00' COMMENT '预计的运费',
  `ora_insure_price` decimal(12,2) DEFAULT '0.00' COMMENT '预计的保险',
  `total_trans_price` decimal(12,2) DEFAULT '0.00' COMMENT '应该付总运费',
  `total_insure_price` decimal(12,2) DEFAULT '0.00' COMMENT '应该付总保险费',
  `real_payment_price` decimal(12,2) DEFAULT '0.00' COMMENT '实际支付总金额',
  `recv_address_point` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recv_address_point_id` int(10) DEFAULT NULL,
  `send_address_point_id` int(10) DEFAULT NULL,
  `send_address_point` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `car_num` int(10) DEFAULT '0',
  `recv_name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recv_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recv_address` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `send_name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `send_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `send_address` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` tinyint(1) NOT NULL DEFAULT '0',
  `log_status` tinyint(1) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '描述（客户备注）',
  `admin_mark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '客服备注',
  `payment_remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '订单支付备注',
  `cancel_reason` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '取消订单原因',
  `departure_time` datetime DEFAULT NULL  COMMENT '发车时间',
  `cancel_time` timestamp NULL DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`,`ora_trans_price`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `order_invoice_apply`
-- ----------------------------
DROP TABLE IF EXISTS `order_invoice_apply`;
CREATE TABLE `order_invoice_apply` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `date_id` int(4) DEFAULT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '发票抬头',
  `tax_number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '企业税号',
  `bank` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '开户行',
  `bank_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '银行账号',
  `company_phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '企业电话',
  `company_address` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '公司地址',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '发票备注',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0:未开票 1:已开票2：已拒绝',
  `refuse_reason` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `order_item`
-- ----------------------------
DROP TABLE IF EXISTS `order_item`;
CREATE TABLE `order_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT '0',
  `order_id` int(11) NOT NULL,
  `model_type` tinyint(1) DEFAULT NULL COMMENT '车型',
  `old_car` tinyint(1) DEFAULT NULL COMMENT '是否新车',
  `brand` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brand_type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vin` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ora_trans_price` decimal(10,2) DEFAULT NULL COMMENT '原价',
  `ora_insure_price` decimal(10,2) DEFAULT '0.00',
  `act_trans_price` decimal(10,2) DEFAULT '0.00' COMMENT '实际费用',
  `act_insure_price` decimal(10,2) DEFAULT '0.00' COMMENT '保险费',
  `valuation` decimal(10,2) DEFAULT '0.00' COMMENT '估值',
  `remark` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1：未安排  2：已安排',
  `safe_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否保险',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `payment_info`
-- ----------------------------
DROP TABLE IF EXISTS `payment_info`;
CREATE TABLE `payment_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_id` int(11) NOT NULL DEFAULT '0',
  `user_id` int(11) NOT NULL DEFAULT '0' COMMENT '用户id',
  `order_id` int(11) NOT NULL,
  `wx_order_id` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_fee` decimal(12,2) DEFAULT '0.00' COMMENT '支付金额',
  `remark` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `date_id` int(4) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0未1已',
  `payment_type` tinyint(1) DEFAULT '0' COMMENT '支付方式1微信2银行转账',
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '结果：1支付0退款',
  `bank` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_code` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `account_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `p_id` int(11) DEFAULT NULL COMMENT '支付退款标记',
  `transaction_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nonce_str` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `payment_type`
-- ----------------------------
DROP TABLE IF EXISTS `payment_type`;
CREATE TABLE `payment_type` (
  `id` int(11) NOT NULL,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `recommend_info`
-- ----------------------------
DROP TABLE IF EXISTS `recommend_info`;
CREATE TABLE `recommend_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_id` int(10) NOT NULL COMMENT '管理员ID',
  `name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '推荐名',
  `introduction` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '推荐人简介',
  `content` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '推荐内容',
  `mp_url` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '小程序推荐二维码',
  `status` tinyint(1) DEFAULT '1' COMMENT '1-使用 0-禁用',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `refund_apply`
-- ----------------------------
DROP TABLE IF EXISTS `refund_apply`;
CREATE TABLE `refund_apply` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL DEFAULT '0',
  `admin_id` int(10) NOT NULL DEFAULT '0',
  `order_id` int(11) NOT NULL DEFAULT '0',
  `payment_id` int(11) NOT NULL DEFAULT '0',
  `date_id` int(4) DEFAULT NULL,
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apply_reason` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refuse_reason` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_refund_id` int(11) DEFAULT NULL,
  `apply_fee` decimal(12,2) DEFAULT '0.00',
  `refund_fee` decimal(12,2) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '2',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `supplier_bank`
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
-- Table structure for `supplier_contact`
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
-- Table structure for `supplier_info`
-- ----------------------------
DROP TABLE IF EXISTS `supplier_info`;
CREATE TABLE `supplier_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supplier_short` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '供应商简称',
  `supplier_full` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '供应商全称',
  `trans_type` tinyint(1) NOT NULL DEFAULT '1' COMMENT '运输方式 1:公路 2：海运 3：公路加海运',
  `app_id` int(11) DEFAULT NULL COMMENT '委托方id',
  `app_url` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'url',
  `app_secret` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '密钥',
  `base_addr_id` int(11) DEFAULT NULL COMMENT '发运地id',
  `receive_id` int(11) DEFAULT NULL COMMENT '经销商id',
  `car_module_id` int(11) DEFAULT NULL COMMENT '品牌id',
  `remark` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `close_flag` tinyint(1) NOT NULL DEFAULT '1',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `user_address`
-- ----------------------------
DROP TABLE IF EXISTS `user_address`;
CREATE TABLE `user_address` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `address` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '地址',
  `detail_address` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '详细地址',
  `user_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0停用地址1启用地址',
  `type` tinyint(1) NOT NULL DEFAULT '1',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `user_bank`
-- ----------------------------
DROP TABLE IF EXISTS `user_bank`;
CREATE TABLE `user_bank` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT '1' COMMENT '用户id',
  `bank` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '银行名称',
  `bank_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '卡号',
  `account_name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '姓名',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `user_device_info`
-- ----------------------------
DROP TABLE IF EXISTS `user_device_info`;
CREATE TABLE `user_device_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(20) DEFAULT NULL COMMENT '用户id',
  `brand` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '设备品牌',
  `model` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '设备型号',
  `system` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '操作系统及版本',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `user_info`
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `recommend_id` int(11) NOT NULL DEFAULT '0',
  `user_name` varchar(100) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `wechat_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_id` int(4) DEFAULT NULL,
  `wechat_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` tinyint(1) DEFAULT '1' COMMENT '1:男 0：女',
  `birth` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户头像',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态（1-使用 0-禁用）',
  `wechat_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '微信状态(0-停用,1-可用)',
  `auth_status` tinyint(1) DEFAULT '0' COMMENT '认证状态(0-未认证,1-已认证)',
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '用户类型(1-车管部,2-仓储部,3-调度部,4-国贸部)',
  `auth_time` timestamp NULL DEFAULT NULL COMMENT '认证时间',
  `last_login_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `user_invoice`
-- ----------------------------
DROP TABLE IF EXISTS `user_invoice`;
CREATE TABLE `user_invoice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `company_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '企业名称',
  `tax_number` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '企业税号',
  `company_address` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '公司地址',
  `bank` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '开户行',
  `bank_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '银行账号',
  `company_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '企业电话',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for `user_message`
-- ----------------------------
DROP TABLE IF EXISTS `user_message`;
CREATE TABLE `user_message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `phone` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '扫描交警名字',
  `title` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '消息名称',
  `content` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '消息内容',
  `date_id` int(4) DEFAULT NULL,
  `read_status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0未读1已读',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0不是默认1默认',
  `type` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1验证码2违停',
  `user_type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1普通用户2警察',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Event structure for `date_base_event`
-- ----------------------------
DROP EVENT IF EXISTS `date_base_event`;
DELIMITER ;;
CREATE DEFINER=`mp_db_user`@`%` EVENT `date_base_event` ON SCHEDULE EVERY 1 DAY STARTS '2019-03-16 03:00:00' ON COMPLETION NOT PRESERVE ENABLE DO INSERT INTO date_base (`id`,`day`,`week`,`month`,`year`,`y_month`,`y_week`)
values (DATE_FORMAT(NOW(),'%Y%m%d'),DATE_FORMAT(NOW(),'%d'),WEEK(NOW(),1),
DATE_FORMAT(NOW(),'%m'),DATE_FORMAT(NOW(),'%Y'),DATE_FORMAT(NOW(),'%Y%m')
,CONCAT(DATE_FORMAT(NOW(),'%Y'),LPAD(WEEK(NOW(),1),2,0)))
-- drop event date_base_event
;;
DELIMITER ;
DELIMITER ;;
CREATE TRIGGER `tri_order_log_status` AFTER UPDATE ON `dp_load_task` FOR EACH ROW BEGIN
	IF(NEW.load_task_status = 2)
		THEN
			UPDATE order_info set log_status = 2 where id = NEW.order_id;
	END IF;
	IF(NEW.load_task_status = 3)
		THEN
			UPDATE order_info set log_status = 3 , status = 9 where id = NEW.order_id and (
				select IFNULL(COUNT(dp_load_task.id),0) from dp_load_task
				left join dp_require_task on dp_load_task.require_id = dp_require_task.id and dp_require_task.status = 3
				where require_id = new.require_id
				and load_task_status <> 3
			) = 0;
	END IF;
END
;;
DELIMITER ;
