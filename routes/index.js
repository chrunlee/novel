var express = require('express');
var router = express.Router();
var fs = require('fs');
var NovelDao = require('../dao/NovelDao');
/* GET home page. */
router.get('/', function(req, res, next) {
	NovelDao.getData('queryAll',{},function(qd){
		var rd = {
			novels : qd
		};
		res.render('index', rd);
	});
});

router.post('/save',function(req,res,next){
	//更新数据库
	var authorname = req.body.authorname;
	if(authorname != ''){
		NovelDao.getData('getIdByName',authorname,function(res2){
			req.body.author = res2[0].insertid || res2[0].id;
			NovelDao.getData('save',req.body,function(rd){
				res.end('保存成功');
			});
		})
	}
});

router.post('/getCaption',function(req,res,next){
	var id = req.body.id;
	NovelDao.getData('getCaptionById',id,function(res2){
		res.end(JSON.stringify(res2[0]));
	})
});

router.get('/*.html',function(req,res,next){
	var path = req.path;
	path = path.replace('/','').replace('.html','');
	//判断id
	NovelDao.getData('getCaption',path,function(res2){
		if(res2[0].length >0){
			var caption = res2[0][0];
			//获得上一页和下一页
			var prev = res2[1],next = res2[2];
			var data = {
				caption : caption,
				prev : prev.length > 0 ? prev[0].id : '',
				next : next.length > 0?next[0].id : ''
			};
			res.render('caption',data);
		}else{
			next();
		}
	})
});

var multer  = require('multer');
var upload = multer({ dest: 'public/upload' });
router.post('/upload',upload.single('file'),function(req,res,next){	
	var name = req.file.originalname;
	var ext = name.substring(name.lastIndexOf('.'),name.length);
	var timestr = Date.now()+Math.floor( Math.random() * 65535 ).toString( 32 )+''+ext;
	var nowpath = req.file.path;
	var newPath = '/upload/'+timestr;
	var newABSPath = './public' + newPath;
	fs.rename(nowpath,newABSPath,function(err){
		console.log('更名');
	});
	var rd = {
		path : newPath
	};
	res.writeHead(200, {'Content-Type': 'text/plain' })
	res.end(JSON.stringify(rd));
});

module.exports = router;
