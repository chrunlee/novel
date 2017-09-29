/**
小说抓取
**/
var superagent = require('superagent');
var cheerio = require('cheerio');
var async = require('async');
var NovelDao = require('../dao/NovelDao');

var io = require('socket.io');
/****
1.数据库获取第一条未完成
2.拿到数据解析，得到地址、当前章节和个数
3.获取目录地址，获得该小说的所有章节数组
4.根据当前章节进行开始抓取
5.获得章节内容，进行更新数据库
6.再次进行下一个
=---
如果获取章节目录失败或内容失败，更新小说进度失败，然后结束该次循环查询，进行下一个

****/

var INS = {};//数据

var CrabUtil = function(opts){
	
};


CrabUtil.getNovel = function(cb){
	NovelDao.getData('getFirst',{},function(res){
		INS.novel = res[0];
		cb(null,null);
	});
};

CrabUtil.getCaption = function(cb){
	var novel = INS.novel;
	if(novel.url){
		superagent.get(novel.url).end(function(err,res){
			var $ = cheerio.load(res.text);
			var $cap = $('.bdsub table a');
			console.log('共有章节:'+$cap.length);
			if($cap.length > 0){
				var captions = $cap.map(function(index,item){
					return {
						url : $(item).attr('href'),
						title : $(item).text(),
						no : index
					};
				}).get();
				INS.captions = captions;
				cb(null,null);
			}
		});
	}
};

CrabUtil.exeCaptions = function(cb){
	var captions = INS.captions,novel = INS.novel;
	//从第几章节开始，总共有多少
	//1.更新章节总数
	var num = captions.length;
	var current = novel.current;
	captions.splice(0,current);
	NovelDao.getData('updateCaption',{captions : num,id : novel.id},function(res){
		//继续处理
		cb(null,null);
	});
};

CrabUtil.startCrab = function(cb){
	var captions = INS.captions;
	async.mapLimit(captions,1,function(item,cbk){
		CrabUtil.getContent(item,cb,cbk);
	},function(){
		//结束
		cb(null,null);
	});
};
/**
 * @cap 章节信息
 * @cb 总体流程控制
 * @cb 章节流程控制
**/
CrabUtil.getContent = function(cap,cb,cbk){
	var novel = INS.novel;
	superagent.get(cap.url).end(function(err,res){
		if(err){
			cb(err,null);
		}
		var $ = cheerio.load(res.text,{decodeEntities: false})
		var content = $('#contents').html();
		//获得内容进行更新数据库
		var data = {title : cap.title,novel : novel.id,captionno : cap.no,content : content,current : cap.no,url : cap.url };
		NovelDao.getData('deleteContent',{captionno : cap.no,novel : novel.id},function(){
			NovelDao.getData('insertContent', data ,function(res2){
				//下一个
				var str = '更新完成'+cap.no+':<'+cap.title+'>'
				console.log(str)
				// io.sockets.emit('loginfo',str);
				setTimeout(function(){
					cbk(null,null);
				},5000);
			});
		});
	});
};

CrabUtil.start = function(){
	async.series(
		[
			CrabUtil.getNovel,
			CrabUtil.getCaption,
			CrabUtil.exeCaptions,
			CrabUtil.startCrab
		],function(err,values){
		//有中断或已完成
		if(err){
			//有报错？更新该，重新开始
			NovelDao.getData('updateUpdate',{update : new Date(),id : INS.novel.id},function(){
				CrabUtil.start();
			});
		}else{
			//完成
			NovelDao.getData('updateDone',{isdone : '1',id : INS.novel.id},function(){
				CrabUtil.start();	
			})
		}
	});
}

module.exports = CrabUtil;


