const mongoose = require('../db.js');
const Schema = mongoose.Schema;

// 创建一个模型
const PowerSchema = new Schema({
    powerName: { type: String }, // 功能名
    powerRoute: { type: String }, // 功能路由
    IsTwo: { type: Number }, // 是否二级(0.不是,1.是)
    PSuperiorId: { type: String }, // 上级Id
    P_AddTime: { type: Date, default: new Date() }, // 新增时间
    P_UpdateTime: { type: Date, default: new Date() }, // 修改时间
    P_number: { type: Number, default: 1 }, // 序号
});

// 导出model模块
module.exports = mongoose.model('Power', PowerSchema);