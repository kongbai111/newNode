var express = require('express');
var router = express.Router();
var objectId = require('mongodb').ObjectId;
var dayjs = require('dayjs')

const User = require('../model/database/user');
const Power = require('../model/database/power');
const PowerRelation = require('../model/database/powerRelation');
const User_p = require('../model/database/user_p');

//新增权限
router.post('/', async function(req, res) {

    console.log(req.body)

    const powerRelation = new PowerRelation({
        powerRelationName: req.body.powerName,
        powerRelationId: req.body.powerRelationId,
        P_number: req.body.PRSort
    });

    let yanzheng = await User.findOne({ username: req.body.uid })

    if(!yanzheng) {
        res.send({'code': 1, 'errorMsg': '权限不够'})
    } else {
        powerRelation.save((err, docs) => {
            if (err) {
                res.send({ 'code': 1, 'errorMsg': '新增失败' });
            } else {
                res.send({ "code": 0, 'errorMsg': '新增成功' });
            }
        });
    }
});
//查找权限
router.get('/select', async function(req, res) {
    // 一级
    let power = await Power.find({ IsTwo: 2 })
    let items = []
    for (let i = 0; i < power.length; i++) {
        let item = {
            value: power[i]._id,
            label: power[i].powerName,
            lists: []
        }
        // 二级
        let erPower = await Power.find({ PSuperiorId: objectId(power[i]._id) })

        for (let j = 0; j < erPower.length; j++) {
            let list = {
                value: erPower[j]._id,
                label: erPower[j].powerName
            }
            item.lists.push(list)
        }

        items.push(item)
    }
    res.send({
        'code': 0,
        'message': '查询成功' ,
        'errData': items
    });
});
//用户绑定权限
router.post('/bind', async function(req, res) {

    console.log(req.body)

    let user = await User.findOne({ username: req.body.userId })
    if (!user) {
        user = await User.findOne({ phone: req.body.userId })
    }

    if (!user) {
        return res.send({'code': 1, 'errorMsg': '未找到该用户'})
    }

    let user_ps = await  User_p.findOne({ userId: objectId(user._id) })
    if (user_ps) {
        return res.send({'code': 1, 'errorMsg': '该用户已绑定权限'})
    }

    const user_p = new User_p({
        userId: user._id,
        powerId: req.body.powerRelationId,
        P_number: req.body.PRSort
    });

    let yanzheng = await User.findOne({ username: req.body.uid })

    if(!yanzheng) {
        res.send({'code': 1, 'errorMsg': '权限不够'})
    } else {
        user_p.save((err, docs) => {
            if (err) {
                res.send({ 'code': 1, 'errorMsg': '新增失败' });
            } else {
                res.send({ "code": 0, 'errorMsg': '新增成功' });
            }
        });
    }
});
//查找职位
router.get('/selectPosition', async function(req, res) {
    // 一级
    let powerRelation = await PowerRelation.find({})
    let items = []

    for (let i = 0; i < powerRelation.length; i++) {
        let item = {
            value: powerRelation[i]._id,
            label: powerRelation[i].powerRelationName,
        }
        items.push(item)
    }
    res.send({
        'code': 0,
        'message': '查询成功' ,
        'errData': items
    });
});
//查找职位列表
router.get('/selectPowerRList', async function(req, res) {

    let powerRelation = await PowerRelation.find({})
    let items = []

    for (let i = 0; i < powerRelation.length; i++) {
        let quanxian = ""
        for (let j = 0; j < powerRelation[i].powerRelationId.length; j++) {
            let power = await Power.findOne({ _id: objectId(powerRelation[i].powerRelationId[j]) })
            quanxian += power.powerName
            if (j !== powerRelation[i].powerRelationId.length - 1)
            {
                quanxian += ","
            }
        }
        let item = {
            value: quanxian,
            name: powerRelation[i].powerRelationName,
            time: dayjs(powerRelation[i].PR_AddTime).format('YYYY-MM-DD HH-mm-ss')
        }
        items.push(item)
    }
    res.send({
        'code': 0,
        'message': '查询成功' ,
        'errData': items
    });
});

module.exports = router;