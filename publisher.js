var CryptoJS = require("crypto-js");

//MQTT publisher
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://localhost:1234');
var topic = 'MQTT_TOPIC';
var pub = 'pub ';
var message = pub.concat('plain text 1');

//message encrypt from client
var ciphertext = CryptoJS.AES.encrypt(message, '1234567890').toString();
console.log(ciphertext);

//connect and publish
client.on('connect',function(){
    
        client.publish(topic,ciphertext);
        console.log('Sent:',ciphertext);
    
});


