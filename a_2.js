
// ADD PROOF OF WORK IN THIS PART
// CREATION OF BLOCKS IS EASY IN PREVIOUS CODE.
// JUST ADD TRANSAC AND COMPUTE HASH.
// BLOCKS CAN BE MODIFIED AND HASHES OF ALL BLOCKS CAN BE MODIFIED EASILY.
// HERE WE INCREASE DIFFICULTY BY ADDING SOME CONDITION.
// USING LOT OF COMPUTING POWER TO COMPUTE A BLOCK, ALSO CALLED MINING.
// WE NEED A CERTAIN NUMBER OF ZEROES IN THE HASH. VERY DIF TO CREATE.
// AIM IS TO CREATE ONE BLOCK PER 10 MIN.


const SHA256 = require('crypto-js/sha256')

class Block{

    constructor(index, timeStamp, data, previousHash = ''){

        this.index = index;
        this.data = data;
        this.timeStamp = timeStamp;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0; //random value added to chnage the hash

    }

    calculateHash(){

        return SHA256(this.index + this.previousHash + JSON.stringify(this.data) + this.timeStamp).toString();

    }

    mineBlock(difficulty){
        // string of zeroes exact length of difficulty
        // as long as hash is not with certain number of zeroes, coninue calculating hash
        // NONCE IS USED TO CHANGE VALUE OF HASH AS OTHER PROPERTIES DO NOT CHANGE
        while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")){

            this.nonce++;
            this.hash = this.calculateHash();
        }
        
        console.log("Block mined: "+ this.hash);
    }
}

class Blockchain{

    constructor(){

        this.chain = [this.createGenesisBlock()];
        this.difficulty = 1;
    }

    createGenesisBlock(){
        return new Block(0, '01/01/2019',"Genesis Block", 0);
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    addBlock(newBlock){

        newBlock.previousHash = this.getLatestBlock().hash;
       // newBlock.hash = newBlock.calculateHash(); old code
        newBlock.mineBlock(this.difficulty);
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

console.log("Mining Block 1 ......");
d_coin.addBlock(new Block(1,"04/01/2019",{ amount:40 }));

console.log("Mining Block 2 ......");
d_coin.addBlock(new Block(2,"06/01/2019",{ amount:14 }));

console.log("Done !!!")
// higher the difficulty number, longer the time and higher the number of zeroes