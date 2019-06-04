var express = require('express');
var router = express.Router();
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

//上传图片
router.post('/getImg', async function(req, res) {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8' // 编码
    let date = new Date();
    let sj = ""+ date.getFullYear() + date.getMonth() +""
    if(fs.existsSync("public/images/")==false){
        fs.mkdirSync("public/images/");
    }
    if(fs.existsSync("public/images/"+sj+"/")==false){
        fs.mkdirSync("public/images/"+sj+"/");
    }
    form.uploadDir = "public/images/"+ sj +"/";
    form.enctype = "multipart/form-data"
    form.keepExtensions = true;
    form.maxFieldsSize = 2 * 1024 * 1024;
    await form.parse(req, function (err, fields, files) {
        if (fields.deleteUrl !== '') {
            let deleteUrl = "public" + fields.deleteUrl
            if (fs.existsSync(deleteUrl) === true) {
                fs.unlinkSync(deleteUrl)
            }
        }
        let filename = files.file.name//文件名字
        let nameArray = filename.split('.');//分割
        let type = nameArray[nameArray.length - 1];
        let name = '';
        for (let i = 0; i < nameArray.length - 1; i++) {
            name = name + nameArray[i];
        }
        let time = '_' + date.getFullYear() + date.getMonth() + date.getDay() + date.getHours() + date.getMinutes() + date.getSeconds();
        let avatarName = name + time + '.' + type;
        let newPath = form.uploadDir + avatarName;
        let fanPath = "/images/"+ sj +"/" + avatarName
        fs.renameSync(files.file.path, newPath);  //重命名
        if(err){
            console.log('解析失败')
            res.send({ 'code': 1, 'errorMsg': '新增失败' });
        } else {
            res.send({ 'code': 0, 'pathname': fanPath });
        }
    })
});

module.exports = router;