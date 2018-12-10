纯粹科技官网展示小程序项目说明文档
=====


###目录

1. 数据字典
2. 关键功能模块以及实现逻辑
3. 特别注意事项

####项目管理模块数据字段对照

##article表
     KEY      |    VALUE
--------------|--------------
title  | 项目名称
small_title  | 客户名称
contactPhone  | 客户电话
description  | 项目备注
keywords  | 项目状态
content  | 项目付款标准
view_count  | 项目工期
passage1  | 项目剩余工期
passage2  | 项目总金额


##message表
     KEY      |    VALUE
--------------|--------------
title  | 标题
type  | 5：内部反馈；6：进度反馈；7：开发反馈；8：客户确认单；9：客户修改意见确认单
content  | 详情
description  | 备注
passage_array  | 关联message_id
behavior  | 0：正常，1：待确认
keywords  | 留言

简历系统数据字段对照
##message表
     KEY      |    VALUE
--------------|--------------
title  | 员工姓名
type  | 10：投递简历
gender  | 性别
mainImg  | 个人头像
content  | 工作经历
description  | 毕业院校以及专业
behavior  | 0：待面试，1：已面试，2：已入职
keywords  | 出生年月
phone  | 电话
class  | 投递来源（0：智联主动投递，1公司邀约，2，boss直聘


