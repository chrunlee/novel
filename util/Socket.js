var io = require('socket.io');

var socketTool = {
	getSocket : function(server){
		var socketio = io.listen(server);

		socketio.sockets.on('connection',function(socket){
			
			socket.emit('loginfo',{title : 'title'});

			
		})
	}
};

module.exports = socketTool;

