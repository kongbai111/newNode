var express = require('express');
var router = express.Router();
var objectId = require('mongodb').ObjectId;

const User = require('../model/database/user');
const Power = require('../model/database/power');

//新增权限
router.post('/', async function(req, res) {
    let route

    let number = 1

    let NuYanzheng
    if (req.body.IsTwo === 2) {
        route = '/index/' + req.body.powerEnName

        let sort = await Power.find({ IsTwo: 2 }).sort({"P_number": -1}).limit(1)
        if (sort.length >= 1) {
            number = sort[0].P_number + 1
        }
        NuYanzheng = await User.findOne({ P_number: number, IsTwo: 2 })
    } else {
        let shangji = await Power.findOne({ _id: objectId(req.body.PSuperior) })
        route = shangji.powerRoute + '/' + req.body.powerEnName

        let sort = await Power.find({ PSuperiorId: req.body.PSuperior }).sort({"P_number": -1}).limit(1)
        if (sort.length >= 1) {
            number = sort[0].P_number + 1
        }
        NuYanzheng = await User.findOne({ P_number: number, IsTwo: 1 })
    }

    const power = new Power({
        powerName: req.body.powerName,
        powerRoute: route,
        IsTwo: req.body.IsTwo,
        PSuperiorId: req.body.PSuperior,
        P_number: number
    });

    let yanzheng = await User.findOne({ username: req.body.uid })
    let yanzhengs = await  Power.findOne({ powerName: req.body.powerName })
    let yanzhengss = await  Power.findOne({ powerRoute: req.body.powerEnName })

    if(!yanzheng) {
        res.send({'code': 1, 'errorMsg': '权限不够'})
    } else if (yanzhengs) {
        res.send({'code': 1, 'errorMsg': '已有该权限,请不要重复创建'})
    } else if (yanzhengss) {
        res.send({'code': 1, 'errorMsg': '已有该权限的英文,请输入不同的'})
    } else if (NuYanzheng) {
        res.send({'code': 1, 'errorMsg': '系统繁忙,请稍候重试'})
    } else {
        power.save((err, docs) => {
            if (err) {
                res.send({ 'code': 1, 'errorMsg': '新增失败' });
            } else {
                res.send({ "code": 0, 'errorMsg': '新增成功' });
            }
        });
    }
});
//查找一级权限
router.get('/select', async function(req, res) {
    let power = await Power.find({ IsTwo: 2 })
    let items = []
    for (let i = 0; i < power.length; i++) {
        let item = {
            value: power[i]._id,
            label: power[i].powerName
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