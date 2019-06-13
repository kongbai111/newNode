const mongoose = require('../db.js');
const Schema = mongoose.Schema;

// 创建一个模型
const user_p = new Schema({
    userId: { type: String }, // 用户id
    powerId: { type: String }, // 权限id
    PU_AddTime: { type: Date, default: new Date() }, // 新增时间
    PU_UpdateTime: { type: Date, default: new Date() }, // 修改时间
});

// 导出model模块
module.exports = mongoose.model('user_p', user_p);
