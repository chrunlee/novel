/**
小说主表
**/

var DBHelper = require('../util/MysqlHelper');

var sql = {
	queryAll : 'select * from novel',
	save : 'insert into novel (title,avatar,url,updatetime,describ,authorname,author) values(?,?,?,?,?,?,?) ',
	getFirst : 'select * from novel t1 where t1.isdone="0" order by t1.updatetime asc limit 0,1',
	insertContent : 'insert into novelcontent (title,novel,captionno,content,url) values(?,?,?,?,?) ',
	updateCurrent : 'update novel set current=? where id=?',
	updateCaption : 'update novel set captions=? where id=?',
	updateDone : 'update novel set isdone=? where id=? ',
	updateUpdate : 'update nove set updatetime=? where id=? ',
	deleteContent : 'delete from novelcontent where captionno=? and novel=? ',
	getCaptionById : 'select id,title,novel,captionno from novelcontent where novel=? ',
	getCaption : 'select * from novelcontent where id=? ',
	getPrev : 'select id from novelcontent where novel=(select novel from novelcontent where id=? ) and captionno < (select captionno from novelcontent where id=?) order by captionno desc limit 0,1 ',
	getNext : 'select id from novelcontent where novel=(select novel from novelcontent where id=? ) and captionno > (select captionno from novelcontent where id=?) order by captionno asc limit 0,1 ',
	getIdByName :'select id from authors where name=? ',
	saveAuthor : 'insert into authors (name) values (?) '

};

var actives = {
	queryAll : function(param,cb){
		var list = [{
			sql : sql.queryAll,
			params : []
		}];
		DBHelper.exeSQL(list,function(err,res){
			if(err)throw err;
			cb(res[0]);
		});
	},
	save : function(param,cb){
		console.log(param);
		var list = [{
			sql : sql.save,
			params : [param.title,param.avatar,param.url,new Date(),param.describ,param.authorname,param.author]
		}];
		DBHelper.exeSQL(list,function(err,res){
			if(err)throw err;
			cb(res[0]);
		})
	},
	getFirst : function(param,cb){
		var list = [{
			sql : sql.getFirst,
			params : []
		}];
		DBHelper.exeSQL(list,function(err,res){
			if(err)throw err;
			cb(res[0]);
		})
	},
	deleteContent : function(param,cb){
		var list = [{
			sql : sql.deleteContent,
			params : [param.captionno,param.novel]
		}];
		DBHelper.exeSQL(list,function(err,res){
			if(err)throw err;
			cb(res);
		});
	},
	insertContent : function(param,cb){
		var list = [{
			sql : sql.insertContent,
			params : [param.title,param.novel,param.captionno,param.content,param.url]
		},{
			sql : sql.updateCurrent,
			params : [param.current,param.novel]
		}];
		DBHelper.exeSQL(list,function(err,res){
			if(err)throw err;
			cb(res);
		});
	},
	updateCaption : function(param,cb){
		var list = [{
			sql : sql.updateCaption,
			params : [param.captions,param.id]
		}];
		DBHelper.exeSQL(list,function(err,res){
			if(err)throw err;
			cb(res);
		});
	},
	updateDone : function(param,cb){
		var list = [{
			sql : sql.updateDone,
			params : [param.isdone,param.id]
		}];
		DBHelper.exeSQL(list,function(err,res){
			if(err)throw err;
			cb(res);
		});
	},
	updateUpdate : function(param,cb){
		var list = [{
			sql : sql.updateDone,
			params : [param.update,param.id]
		}];
		DBHelper.exeSQL(list,function(err,res){
			if(err)throw err;
			cb(res);
		}); 
	},
	getCaptionById : function(id,cb){
		var list = [{
			sql : sql.getCaptionById,
			params : [id]
		}];
		DBHelper.exeSQL(list,function(err,res){
			if(err)throw err;
			cb(res);
		}); 
	},
	getCaption : function(id,cb){
		var list = [{
			sql : sql.getCaption,
			params : [id]
		},{
			sql : sql.getPrev,
			params : [id,id]
		},{
			sql : sql.getNext,
			params : [id,id]
		}];
		DBHelper.exeSQL(list,function(err,res){
			if(err)throw err;
			cb(res);
		}); 
	},
	getIdByName : function(name,cb){
		var list = [{
			sql : sql.getIdByName,
			params : [name]
		}];
		DBHelper.exeSQL(list,function(err,res){
			if(err)throw err;
			if(res[0].length > 0){
				//直接返回
				cb(res[0]);
			}else{
				//插入
				var list2= [{
					sql : sql.saveAuthor,
					params : [name]
				}];
				DBHelper.exeSQL(list2,function(err,res){
					cb(res);
				});
			}
		}); 
	}
};

module.exports = {

	getData : function(api,param,cb){
		actives[api](param,cb);
	}
};