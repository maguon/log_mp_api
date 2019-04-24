-- ----------------------------
-- Table update for `department_info`
-- ----------------------------
UPDATE department_info set id = (id / 1000 + id % 1000 );
ALTER TABLE department_info AUTO_INCREMENT=10;

-- ----------------------------
-- Table update for `admin_user`
-- ----------------------------
UPDATE admin_user set type = (type / 1000 + type % 1000 ) where type!=99;