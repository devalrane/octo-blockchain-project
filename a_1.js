const SHA256 = require('crypto-js/sha256')

class Block{

    constructor(index, timeStamp, data, previousHash = ''){

        this.index = index;
        this.data = data;
        this.timeStamp = timeStamp;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash(){

        return SHA256(this.index + this.previousHash + JSON.stringify(this.data) + this.timeStamp).toString();

    }
}

class Blockchain{

    constructor(){

        this.chain = [this.createGenesisBlock()];

    }

    createGenesisBlock(){
        return new Block(0, '01/01/2019',"Genesis Block", 0);
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    addBlock(newBlock){

        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);        
    }

    isChainValid(){

        for(let i=1; i<this.chain.length; i++){

            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }

        }

        return true;

    }

}

let d_coin = new Blockchain();
d_coin.addBlock(new Block(1,"04/01/2019",{ amount:40 }));
d_coin.addBlock(new Block(2,"06/01/2019",{ amount:14 }));

console.log('Is blockchaiin valid ? '+d_coin.isChainValid());

//try to tamper

d_coin.chain[1].data= { amount:100 };
d_coin.chain[1].hash= d_coin.chain[1].calculateHash();

console.log('Is blockchaiin valid ? '+d_coin.isChainValid());


console.log(JSON.stringify(d_coin, null, 4));