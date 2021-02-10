var CryptoJS = require("crypto-js");


//MQTT subscriber
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://localhost:1234');
var topic = 'MQTT_TOPIC';

client.on('message',function(topic,ciphertext){
    ciphertext = ciphertext.toString();
    

    // message Decrypt by client 
    var bytes  = CryptoJS.AES.decrypt(ciphertext, '1234567890');
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
 

    console.log('received by target:',originalText);
});

client.on('connect', function () {
    console.log('subscribing to topic');
    client.subscribe(topic);
});

