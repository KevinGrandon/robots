var webSocket = require('ws'),
    ws = new webSocket('ws://127.0.0.1:6437');

ws.on('message', function(data, flags) {
    //console.log(data)
    data = JSON.parse(data)
    if (data.pointables && data.pointables.length === 2) {
      var distance = data.pointables[1].tipPosition[0] - data.pointables[0].tipPosition[0]
      console.log('Pointer distance: ', distance)
    }
});
