var express = require('express');
var router = express.Router();
var md5 = require('md5-node');

const User = require('../model/database/user');

/* GET users listing. */
//注册
router.post('/', async function(req, res) {
    const user = new User({
        name: req.body.name,
        age: Number(req.body.age),
        sex: req.body.sex,
        phone: req.body.phone,
        uname: req.body.uname,
        username: req.body.username,
        password: md5(req.body.password),
        headPortrait: req.body.headPortrait,
        address: req.body.address,
        birthday: req.body.birthday,
        email: req.body.email
    });
    let yanzheng = await User.findOne({phone: req.body.phone})
    let yanzhengone = await User.findOne({username: req.body.username})
    if(yanzheng || yanzhengone) {
        res.send({'code': 1, 'errorMsg': '手机号或用户名已注册'})
    } else {
        user.save((err, docs) => {
            if (err) {
                res.send({ 'code': 1, 'errorMsg': '新增失败' });
            } else {
                res.send({ "code": 0, 'message': '新增成功' });
            }
        });
    }
});
//登录
router.get('/',async function(req, res, next) {
    let cookie = Math.random().toString(36).substr(2);

    let updateUser = await User.update({username: req.query.username},{$set:{cookie:cookie}}).exec()

    let login
    if (updateUser) {
        login = await User.findOne({username: req.query.username, password: md5(req.query.password)})
    }

    if(login){
        res.send({
            'code': 0,
            'message': '登录成功' ,
            'errData': {
                'username': login.username,
                'u_uuid': login.cookie
            }
        });
    } else {
        res.send({ 'code': 1, 'errorMsg': '登录失败,用户名获密码错误' });
    }
});
//kookie验证
router.get('/cookie',async function(req, res, next) {
    let login
    login = await User.findOne({username: req.query.username})

    if(login){
        res.send({
            'code': 0,
            'message': '已登录' ,
            'errData': {
                'username': login.username,
                'u_uuid': login.cookie
            }
        });
    } else {
        res.send({ 'code': 1, 'errorMsg': '未登录' });
    }
});
//查找当前登录用户
router.get('/grxx',async function(req, res, next) {
    let login
    login = await User.findOne({username: req.query.username})

    if(login){
        res.send({
            'code': 0,
            'message': '已登录' ,
            'errData': {
                'name': login.name,
                'address': login.address,
                'birthday': login.birthday,
                'sex': login.sex === 0?'女':'男',
                'uname': login.uname,
                'age': login.age,
                'phone': login.phone,
                'email': login.email,
                'img': login.headPortrait
            }
        });
    } else {
        res.send({ 'code': 1, 'errorMsg': '未登录' });
    }
});
//修改资料
router.post('/update', async function(req, res) {
    let user = {
        name: req.body.name,
        age: Number(req.body.age),
        sex: req.body.sex,
        phone: req.body.phone,
        uname: req.body.uname,
        headPortrait: req.body.img,
        address: req.body.address,
        birthday: req.body.birthday,
        email: req.body.email
    }
    let yanzheng = await User.findOne({phone: req.body.phone})
    if(yanzheng.username !== req.body.username) {
        res.send({'code': 1, 'errorMsg': '手机号已注册'})
    } else {
        let update = await  User.update({username: req.body.username},user).exec()
        if (update) {
            res.send({'code': 0, 'errorMsg': '修改成功'})
        } else {
            res.send({'code': 1, 'errorMsg': '修改失败'})
        }
    }
});

module.exports = router;
