$(function () {
  var content = $('#content');
  var status = $('#status');
  var input = $('#input');
  var myName = false;

  //建立websocket连接
  //socket = io.connect('localhost:3000');
  socket = io.connect('http://192.168.1.129:8082', {reconnection: false});

  //收到server的连接确认
  socket.on('open',function(){
    status.text('输入称呼：');
  });

  //消息推送1
  socket.on("pushpoint", function(data){
    $('#x').text(data.x);
    $('#y').text(data.y);
    $('#s').text(data.sessionId);
  });

  //断开连接
  socket.on("disconnect",function(){
    $("#content").text("连接已断开");
  });

  //连接失败
  socket.on("connect_failed",function(){
    $("#content").text("链接失败");
  });

  //监听system事件，判断welcome或者disconnect，打印系统消息信息
  socket.on('system',function(json){
    var p = '';
    if (json.type === 'welcome'){
      if(myName==json.text) status.text(myName + ': ').css('color', json.color);
      p = '<p style="background:'+json.color+'">system @ '+ json.time+ ' : Welcome ' + json.text +'</p>';
    }else if(json.type == 'disconnect'){
      p = '<p style="background:'+json.color+'">system @ '+ json.time+ ' : Bye ' + json.text +'</p>';
    }
    content.prepend(p);
  });

  //监听message事件，打印消息信息
  socket.on('message',function(json){
    var p = '<p><span style="color:'+json.color+';">' + json.author+'</span> @ '+ json.time+ ' : '+json.text+'</p>';
    content.prepend(p);
  });

  //通过“回车”提交聊天信息
  input.keydown(function(e) {
    if (e.keyCode === 13) {
      var msg = $(this).val();
      if (!msg) return;
      socket.send(msg);
      $(this).val('');
      if (myName === false) {
        myName = msg;
      }
    }
  });
});