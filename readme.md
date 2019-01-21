纯粹科技项目管理小程序项目说明文档
=====


###目录

1. 数据字典
2. 关键功能模块以及实现逻辑
3. 特别注意事项

####项目管理模块数据字段对照

##project表
     KEY      |    VALUE
--------------|--------------
id  | ID
project_no  |  项目编号
name  | 项目名称
client  | 客户名称
phone  | 客户电话
description  | 项目描述
project_status  | 项目状态
pay_standard  | 项目付款标准
content  | 项目详情
period  | 项目工期
left_period  | 项目剩余工期
total_amount  | 项目总金额
project_manager | 业务经理user_no
sales_manager | 销售经理user_no
client_no | 客户user_no
end_time  | 项目有效期
user_no | 创建人的user_no
mainImg | 主图
status  | 状态:1.正常,-1.删除
create_time  |	创建时间
update_time  |	更新时间
thirdapp_id  |  关联thirdapp表
user_type  |  用户类别：0.普通,1.员工,2.cms


##process表
     KEY      |    VALUE
--------------|--------------
id  | ID
name  | 标题
process_type  | 1.内部反馈；2.外部反馈；
develop_type  | 1.cms；2.api；3.program；4.web；5.design；6.other
function_type  | 1.功能变更；2.功能修复；3.样式变更；4.样式修复；5.动态；6.开发任务
step  | 1.普通；2.待客户确认；3.客户确认；4.待开发；5.开发完成；
start_time  |  开始时间
end_time  |  结束时间
content  | 详情
description  | 描述
mainImg | 主图
project_no  | 关联project表
user_no | 关联user表
status  | 状态:1.正常,-1.删除
create_time  |	创建时间
update_time  | 更新时间
estimated_time  |  预计开发时间
start_time  | 开始开发时间
end_time  | 开发完成时间
thirdapp_id  |  关联thirdapp表
user_type  |  0.前端用户,1.员工,2.cms


渠道客户字段对照
##operation表-ok
     KEY      |    VALUE
--------------|--------------
id  | ID
name  | 客户姓名
phone  | 电话 
address  | 地址 
mainImg  | 主图
content  | 需求详情
description  | 需求简介
step  | 1.待联系，2.沟通中，3.已面访，4.签单，5.失效
origin  | 来源：1.58，2.百度，3.猪八戒，4.解放号，5.汇桔网
user_no | 关联user表
status  | 状态:1.正常,-1.删除
create_time  |	创建时间
update_time  |	更新时间
thirdapp_id  |  关联thirdapp表
user_type  |  0.前端用户,1.员工,2.cms


电话数据字段对照
##salesphone表
     KEY      |    VALUE
--------------|--------------
id  | ID
name  | 客户姓名
phone  | 客户电话
address  | 客户地址
step  |  状态：1.待联系，2.有意向，3.无意向，4.未接通/无效
message  | 备注信息
user_no | 关联user表
status  | 状态:1.正常,-1.删除
create_time  |	创建时间
update_time  |	更新时间
thirdapp_id  |  关联thirdapp表
user_type  |  用户类别：0.普通,1.员工,2.cms



##article表-工资条（menu_id=135）
     KEY      |    VALUE
--------------|--------------
title  |  标题
relation_user  |  姓名，关联user表（工资条使用）
small_title  |  职位
description  |  底薪
keywords  |  绩效
contantPhone  |  基本薪资
passage1  |  收款
passage2  |  提成
listorder  |  迟到扣款
view_count  |  日志扣款
passage3  |  请假（天）
passage4  |  旷工（天）
passage5  |  实际出勤
passage6  |  总计
content  |  其他



##message表-简历管理（type=10）
     KEY      |    VALUE
--------------|--------------
behavior  |  状态：1.待面试，2.已面试，3.已入职，4.未通过
passage1  |  备注说明
passage_array  |  出生年月


##message表-咨询管理（type=11）

     KEY      |    VALUE
--------------|--------------
phone  |  咨询人手机
title  |  被咨询名片名字
relation_id |  被咨询名片id



##message表-外出记录(type=4)
     KEY      |    VALUE
--------------|--------------
passage1  |  经度
passage2  |  纬度
keywords  |  详细地址
mainImg  | 照片
content  | 备注
description  | 缘由


##message表-请假管理(type=5)
     KEY      |    VALUE
--------------|--------------
leave_time  |  请假开始时间
back_time  |  请假结束时间
keywords  |  时长
class  | 类型:1.病假;2.事假;3.调休;4.年假;5.婚假;6.丧假;7.产假
behavior  |  状态:1.申请中;2.部门审核;3.人事审核;4.公司审核
description  | 请假事由


##userInfo表-员工管理(user_type=1)
     KEY      |    VALUE
--------------|--------------
level  |  员工级别
behavior |  员工部门：1.开发,2.销售,3.运营,4.人事/行政D
passage1 |  职务



##statistics表-运营数据(type=1)
     KEY      |    VALUE
--------------|--------------
id  | ID
total_num  | 咨询客户
valid_num  | 有效客户
cost  |  花费
origin  |  来源：1.58，2.百度，3.猪八戒，4.解放号，5.汇桔网
user_no | 关联user表
status  | 状态:1.正常,-1.删除
create_time  |	创建时间
update_time  |	更新时间
thirdapp_id  |  关联thirdapp表
user_type  |  用户类别：0.普通,1.员工,2.cms



##statistics表-HR数据(type=2)
     KEY      |    VALUE
--------------|--------------
id  | ID
total_num  | 邀约总数
valid_num  | 有效邀约
deal_num  | 面试人数
origin  |  来源：1.智联,2.公司邀约,3.BOSS直聘
user_no | 关联user表
status  | 状态:1.正常,-1.删除
create_time  |	创建时间
update_time  |	更新时间
thirdapp_id  |  关联thirdapp表
user_type  |  用户类别：0.普通,1.员工,2.cms