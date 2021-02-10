var CryptoJS = require("crypto-js");

  const express = require("express");
  const app = express();
  const http = require("http").createServer(app);

  const io = require("socket.io")(http);
  var server_port = 5000;

  http.listen(server_port, () => {
    console.log("started");
  });

  
//creating blockchain
const SHA256 = require("crypto-js/sha256");

class CryptoBlock {
  constructor(index, timestamp, data, precedingHash = " ") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.precedingHash = precedingHash;
    this.hash = this.computeHash();
    this.nonce = 0;
  }

  computeHash() {
    return SHA256(
      this.index +
        this.precedingHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  proofOfWork(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.computeHash();
    }
  }
}

class CryptoBlockchain {
  constructor() {
    this.blockchain = [this.startGenesisBlock()];
    this.difficulty = 4;
  }
  startGenesisBlock() {
    return new CryptoBlock(0, "01/01/2020", "Initial Block in the Chain", "0");
  }

  obtainLatestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }
  addNewBlock(newBlock) {
    newBlock.precedingHash = this.obtainLatestBlock().hash;
    //newBlock.hash = newBlock.computeHash();
    newBlock.proofOfWork(this.difficulty);
    this.blockchain.push(newBlock);
  }

  checkChainValidity() {
    for (let i = 1; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i];
      const precedingBlock = this.blockchain[i - 1];

      if (currentBlock.hash !== currentBlock.computeHash()) {
        return false;
      }
      if (currentBlock.precedingHash !== precedingBlock.hash) return false;
    }
    return true;
  }
}

let smashingCoin = new CryptoBlockchain();

//MQTT broker
var mosca = require('mosca');
var settings = {port:1234};
var broker = new mosca.Server(settings);

broker.on('ready',function(){
    console.log("Broker Ready");
});

broker.on('clientConnected', function(client) {
console.log('Client Connected:', client.id);
});

broker.on('published', function (packet, client) {
    topic = packet.topic.toString();
    ciphertext = packet.payload.toString();
    var bytes = CryptoJS.AES.decrypt(ciphertext, '1234567890');
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    
    var pattern = /pub/;
    
  if (pattern.test(originalText)) {
    
    
    
    io.on("connection", (socket) => {
    
    console.log("User published 1");

    socket.emit("welcome", {"topic":topic,"ciphertext":ciphertext});

  });  

        smashingCoin.addNewBlock(
            new CryptoBlock(1, "01/06/2020", {
                sender: client.id,
                message: originalText,
                topic: topic
            })
        );
        console.log(JSON.stringify(smashingCoin, null, 4));   
    }
});



