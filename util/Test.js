var url = 'http://www.23us.so/files/article/html/13/13577/5623022.html'

var superagent = require('superagent');

superagent.get(url).end(function(err,res){
	console.log(res.text)
});