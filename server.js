var http = require('http');
var fs = require('fs');
var path = require('path');
var mine = require('mine');
var cache = {};
//send 404
function send404(response) {
    response.writerHead(404, { 'Content-Type': 'text/plain' });
    response.write('erroe 404:resource not found');
    response.end();
}
//send file
function sendFile(response, filePath, fileContents) {
    response.writerHead(200, { "content-type": mine.lookup(path.basename(filePath)) });
    response.end(fileContents);
}
//缓存
function serveStatic (response,cache,absPath) {
	 if (cache(absPath)) {
	 	sendFile(response,absPath,cache[absPath]);//发送缓存数据
	 } else {
	 	fs.exists(absPath, function(exists){
	 		if (exists) {
	 			fs.readFile(absPath, function(err,data){
	 				if (err) {
	 					send404(response);//访问错误
	 				} else {
	 					cache[absPath] = data;//写入缓存
	 					sendFile(response,absPath,data);//发送文件
	 				}
	 			});		
	 		} else {
	 			send404(response);//文件不存在发送404
	 		}
	 	})
	 } 
}
//http模块
var server =http.createServer(function (request,response) {
	 var filePath =false;
	 if (request.url=="/") {
	 	filePath='public/index.html';
	 } else {
	 	filePath='public'+request.url;
	 } //转化为相对路径
	 var absPath = './'+filePath;//返回缓存静态文件
	 serveStatic(response,cache,absPath);

})
server.listen(3000, function () {
	 console.log("server start on port 3000") 
})