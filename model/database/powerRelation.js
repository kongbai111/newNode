const mongoose = require('../db.js');
const Schema = mongoose.Schema;

// 创建一个模型
const PowerRelationSchema = new Schema({
    powerRelationName: { type: String }, // 权限名
    powerRelationId: {
        type: Array
    }, // 功能
    PR_AddTime: { type: Date, default: new Date() }, // 新增时间
    PR_UpdateTime: { type: Date, default: new Date() }, // 修改时间
    PR_Sort: { type: Number } // 排序
});

// 导出model模块
module.exports = mongoose.model('PowerRelation', PowerRelationSchema);
