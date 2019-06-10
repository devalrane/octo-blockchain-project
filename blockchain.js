// REWARDS FOR MINING
// HERE WE ENABLE THE CODE TO HANDLE TRANSACTIONS

// ADD PROOF OF WORK IN THIS PART
// CREATION OF BLOCKS IS EASY IN PREVIOUS CODE.
// JUST ADD TRANSAC AND COMPUTE HASH.
// BLOCKS CAN BE MODIFIED AND HASHES OF ALL BLOCKS CAN BE MODIFIED EASILY.
// HERE WE INCREASE DIFFICULTY BY ADDING SOME CONDITION.
// USING LOT OF COMPUTING POWER TO COMPUTE A BLOCK, ALSO CALLED MINING.
// WE NEED A CERTAIN NUMBER OF ZEROES IN THE HASH. VERY DIF TO CREATE.
// AIM IS TO CREATE ONE BLOCK PER 10 MIN.
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const SHA256 = require('crypto-js/sha256')

class Transactions{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }//////////////////////////////////////////////////////

    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }////////////////////////////////////////////////////////////////

    signTransaction(signingKey){

        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('Signing transactions for other wallets is strictly prohibited!');
        }
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');

    }////////////////////////////////////////////////////

    isValid() {
       
        if (this.fromAddress === null){
            return true;
        }
    
        if (!this.signature || this.signature.length === 0) {
          throw new Error('No signature in this transaction');
        }
    
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
      }////////////////////////////////////////////////////

}/////////////////////////////////////////////////////////

class Block{

    constructor(timeStamp, transactions, previousHash = ''){
        this.transactions = transactions;
        this.timeStamp = timeStamp;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0; //random value added to chnage the hash
    }////////////////////////////////////////////////////////

    calculateHash(){
        ////////////////////////// CHANGE THIS METHOD
        return SHA256(this.previousHash + JSON.stringify(this.transactions) + this.timeStamp).toString();
    }////////////////////////////////////////////////////////

    mineBlock(difficulty){
        // string of zeroes exact length of difficulty
        // as long as hash is not with certain number of zeroes, coninue calculating hash
        // NONCE IS USED TO CHANGE VALUE OF HASH AS OTHER PROPERTIES DO NOT CHANGE
        while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")){

            this.nonce++;
            this.hash = this.calculateHash();
        }
        
        console.log("Block mined: "+ this.hash);
    }/////////////////////////////////////////////////////////

    hasValidTransactions() {


        for (const t of this.transactions) {
          if (!t.isValid()) {
            return false;
          }
        }    
        return true;
      }///////////////////////////////////////////////////////
}

class Blockchain{

    constructor(){

        this.chain = [this.createGenesisBlock()];
        this.difficulty = 0;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }//////////////////////////////////////////////////

    createGenesisBlock(){
        return new Block('01/01/2019',"Genesis Block", 0);
    }//////////////////////////////////////////////////

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }//////////////////////////////////////////////////

    minePendingTransactions(miningRewardAddress){
    //    this.pendingTransactions = [
    //        new Transactions(null, miningRewardAddress, this.miningReward)
    //    ]; 

        // ABOVE METHOD DOES NOT WORK FOR SOME REASON
        this.pendingTransactions.push(new Transactions(null, miningRewardAddress, this.miningReward));

        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined!");
        this.chain.push(block);

        this.pendingTransactions = [];
    }///////////////////////////////////////////////////

    createTransaction(transaction){

        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must include source and destination addresses');
        }

        if (!transaction.isValid()) {
            throw new Error('Cannot add invalid transaction to chain');
        }


        this.pendingTransactions.push(transaction);
    }///////////////////////////////////////////////////

    getBalanceOfAddress(address){

        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){

                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }///////////////////////////////////////////////////


    isChainValid(){

        for(let i=1; i<this.chain.length; i++){

            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(!currentBlock.hasValidTransactions()){
                return false;
            }

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.calculateHash()){
                return false;
            }

        }
        return true;

    }////////////////////////////////////////////////////

}

module.exports.Blockchain = Blockchain;
module.exports.Transactions = Transactions;