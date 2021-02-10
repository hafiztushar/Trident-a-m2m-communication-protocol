//MQTT subscriber
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://localhost:1234');
var topic = 'MQTT_TO';

client.on('message',function(topic,message){
    message = message.toString();
    console.log('received by target:',message);
});

client.on('connect', function () {
    console.log('subscribing to topic');
    client.subscribe(topic);
});

