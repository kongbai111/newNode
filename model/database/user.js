const mongoose = require('../db.js');
const Schema = mongoose.Schema;

// 创建一个模型
const UserSchema = new Schema({
  name: { type: String }, // 名字
  age: { type: Number, default: 0 }, // 年龄
  sex: { type: Number }, // 性别（0.女;1.男）
  phone: { type: String }, // 电话
  uname: { type: String, default: '新用户' }, //昵称
  username: { type: String }, // 登录名
  password: { type: String }, // 密码
  headPortrait: { type: String }, // 头像
  address: { type: String }, // 地址
  birthday: { type: Date }, // 生日
  email: { type: String }, // 邮件
  addtime: { type:Date, default: new Date() }, // 注册时间
  cookie: { type:String }
});

// 导出model模块
module.exports = mongoose.model('User', UserSchema);
