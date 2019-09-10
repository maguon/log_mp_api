-- ----------------------------
-- Table structure for app
-- ----------------------------
DROP TABLE IF EXISTS `app`;
CREATE TABLE `app`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_type` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'app类型（1-广运车）',
  `device_type` int(50) NULL DEFAULT NULL COMMENT '设备类型（1安卓2苹果）',
  `version` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '版本号',
  `version_num` int(20) NOT NULL COMMENT '版本序号',
  `min_version_num` int(20) NULL DEFAULT NULL COMMENT '最小支持版本',
  `force_update` int(2) NULL DEFAULT NULL COMMENT '是否强制更新（默认为0-不更新）',
  `url` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '下载地址',
  `Remarks` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0:启用,1:停用',
  `created_on` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updated_on` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------
-- Table structure for coupon
-- ----------------------------
DROP TABLE IF EXISTS `coupon`;
CREATE TABLE `coupon`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_id` int(11) NULL DEFAULT NULL COMMENT '优惠券创建人',
  `coupon_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '优惠券名称',
  `coupon_type` tinyint(1) NULL DEFAULT NULL COMMENT '优惠券类型（0:天数,1:日期）',
  `effective_days` int(20) NULL DEFAULT 0 COMMENT '有效天数',
  `start_date` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '有效日期从',
  `end_date` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '有效日期到',
  `floor_price` decimal(10, 2) NOT NULL COMMENT '门槛费用',
  `price` decimal(10, 2) NOT NULL COMMENT '金额（元）',
  `status` tinyint(1) NULL DEFAULT 1 COMMENT '状态（0:启用,1:停用）',
  `del_status` tinyint(1) NULL DEFAULT 0 COMMENT '删除许可（0:允许删除,1:不允许删除）',
  `show_status` tinyint(1) NULL DEFAULT 0 COMMENT '删除（0:未删除1:已删除）',
  `remarks` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  `created_on` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updated_on` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------
-- Table structure for user_coupon
-- ----------------------------
DROP TABLE IF EXISTS `user_coupon`;
CREATE TABLE `user_coupon`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_id` int(11) NULL DEFAULT NULL COMMENT '优惠券创建人',
  `admin_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '发放人',
  `user_id` int(11) NOT NULL COMMENT '领取优惠券用户',
  `user_name` varchar(100) CHARACTER SET utf32 COLLATE utf32_unicode_ci NULL DEFAULT NULL COMMENT '领取优惠券用户名称',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '手机号',
  `coupon_id` int(11) NOT NULL COMMENT '优惠券编码',
  `coupon_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '优惠券名称',
  `coupon_type` tinyint(1) NULL DEFAULT NULL COMMENT '优惠券类型（0:天数,1:日期）',
  `effective_days` int(20) NULL DEFAULT 0 COMMENT '有效天数',
  `start_date` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '生效日期（领取优惠券时间）',
  `end_date` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '使用截止日期',
  `floor_price` decimal(10, 2) NULL DEFAULT NULL COMMENT '门槛费用',
  `price` decimal(10, 2) NULL DEFAULT NULL COMMENT '金额',
  `status` tinyint(1) NULL DEFAULT 1 COMMENT '状态（0:未使用,1:已使用,2:已过期）',
  `remarks` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  `created_on` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updated_on` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;


-- ----------------------------
-- Table structure for order_coupon_rel
-- ----------------------------
DROP TABLE IF EXISTS `order_coupon_rel`;
CREATE TABLE `order_coupon_rel`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '领取优惠券用户',
  `order_id` int(11) NULL DEFAULT NULL COMMENT '订单编号',
  `user_coupon_id` int(11) NULL DEFAULT NULL COMMENT '用户优惠券编码',
  `payment_id` int(11) NULL DEFAULT NULL COMMENT '支付编号',
  `price` decimal(10, 2) NOT NULL COMMENT '金额（元）',
  `real_payment_price` decimal(12, 2) NULL DEFAULT 0.00 COMMENT '实际支付总金额',
  `created_on` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updated_on` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------
-- Table structure for commodity_info
-- ----------------------------
DROP TABLE IF EXISTS `commodity_info`;
CREATE TABLE `commodity_info`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `city_id` int(11) NULL DEFAULT NULL COMMENT '城市编号',
  `city_name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '城市名称',
  `commodity_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '商品名称',
  `image` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '图片',
  `info` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '介绍',
  `pord_images` varchar(400) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '商品详细介绍照片',
  `production_date` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '车辆生产日期',
  `original_price` decimal(10, 2) NULL DEFAULT 0.00 COMMENT '原价',
  `actual_price` decimal(10, 2) NULL DEFAULT 0.00 COMMENT '售价',
  `type` tinyint(1) NULL DEFAULT NULL COMMENT '购付方式（1:全款购车 2:定金购车 3:货到付款）',
  `earnest_money` decimal(10, 2) NULL DEFAULT 0.00 COMMENT '定金',
  `quantity` int(10) NULL DEFAULT NULL COMMENT '数量',
  `saled_quantity` int(10) NULL DEFAULT NULL COMMENT '已售数量',
  `status` tinyint(1) NOT NULL DEFAULT 1 COMMENT '状态（2-已预订 1-在售 0-已售）',
  `show_status` tinyint(1) NULL DEFAULT 0 COMMENT '下架(1-已下架，0-未下架)',
  `created_on` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `updated_on` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 26 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------
-- Table structure for product_order_info
-- ----------------------------
DROP TABLE IF EXISTS `product_order_info`;
CREATE TABLE `product_order_info`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NULL DEFAULT 0 COMMENT '用户编号',
  `date_id` int(4) NULL DEFAULT NULL COMMENT '（统计使用）',
  `ora_trans_price` decimal(10, 2) NULL DEFAULT 0.00 COMMENT '原总价',
  `act_trans_price` decimal(10, 2) NULL DEFAULT 0.00 COMMENT '售总价',
  `earnest_money` decimal(10, 2) NULL DEFAULT 0.00 COMMENT '应支付总定金',
  `real_payment_price` decimal(12, 2) NULL DEFAULT 0.00 COMMENT '实际支付总金额',
  `payment_status` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '支付状态（1:未支付 3.支付完成 4.已退款）',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '订单状态（1:待发货 4:已发货 6:已取消  8:已送达 ）',
  `send_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '收货人',
  `send_phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '收货人电话',
  `send_address` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL COMMENT '收货人地址',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `payment_remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '订单支付备注',
  `departure_time` datetime(0) NULL DEFAULT NULL COMMENT '发运时间',
  `arrive_time` datetime(0) NULL DEFAULT NULL COMMENT '送达时间',
  `cancel_time` datetime(0) NULL DEFAULT NULL COMMENT '取消时间',
  `created_on` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `updated_on` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 102 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------
-- Table structure for product_order_item
-- ----------------------------
DROP TABLE IF EXISTS `product_order_item`;
CREATE TABLE `product_order_item`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_order_id` int(11) NULL DEFAULT NULL COMMENT '销售订单编号',
  `commodity_id` int(11) NULL DEFAULT NULL COMMENT '商品编号',
  `commodity_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '商品名称',
  `city_id` int(11) NULL DEFAULT NULL COMMENT '城市编号',
  `city_name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '城市名称',
  `type` tinyint(1) NULL DEFAULT NULL COMMENT '购付方式（1:全款购车 2:定金购车 3:货到付款）',
  `original_price` decimal(10, 2) NULL DEFAULT 0.00 COMMENT '原价',
  `actual_price` decimal(10, 2) NULL DEFAULT 0.00 COMMENT '售价',
  `earnest_money` decimal(10, 2) NULL DEFAULT 0.00 COMMENT '定金',
  `created_on` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `updated_on` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 72 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;


-- ----------------------------
-- Table structure for product_payment_info
-- ----------------------------
DROP TABLE IF EXISTS `product_payment_info`;
CREATE TABLE `product_payment_info`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_id` int(4) NULL DEFAULT NULL COMMENT '（统计使用）',
  `admin_id` int(11) NOT NULL DEFAULT 0,
  `user_id` int(11) NOT NULL DEFAULT 0 COMMENT '用户id',
  `product_order_id` int(11) NOT NULL COMMENT '商品订单编号',
  `wx_order_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '微信支付码',
  `total_fee` decimal(12, 2) NULL DEFAULT 0.00 COMMENT '支付金额',
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '交易类型（1:支付 2:退款）',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '支付状态（1:未付款  2:已付款）',
  `payment_time` datetime(0) NULL DEFAULT NULL COMMENT '支付时间',
  `payment_refund_time` datetime(0) NULL DEFAULT NULL COMMENT '退款时间',
  `p_id` int(11) NULL DEFAULT NULL COMMENT '退款相应支付编号',
  `transaction_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `nonce_str` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_on` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `updated_on` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 36 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;