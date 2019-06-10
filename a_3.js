// REWARDS FOR MINNING
// HERE WE ENABLE THE CODE TO HANDLE TRANSACTIONS

// THIS CODE IS INCOMPLETE..... TRANSACTIONS HASH NEEDS TO BE CALCULATED.
// VALIDATION IS NOT DONE - ONLY DONE FR BLOCKCHAIN not for transactions.

const SHA256 = require('crypto-js/sha256')

class Transactions{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
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

        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined!");
        this.chain.push(block);

        this.pendingTransactions = [
            new Transactions(null, miningRewardAddress, this.miningReward)
        ];        
    }///////////////////////////////////////////////////

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }///////////////////////////////////////////////////

    getBalanceOfAddress(address){

        let balance=0;

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

let dCoin = new Blockchain();
dCoin.createTransaction(new Transactions('address1', 'address2', 100));
dCoin.createTransaction(new Transactions('address2', 'address1', 50));

console.log('\nStarting the miner....');
dCoin.minePendingTransactions('devals-address');

console.log('\nStarting the miner again....');
dCoin.minePendingTransactions('devals-address');

console.log('Devals balance is ', dCoin.getBalanceOfAddress("devals-address"));

console.log(JSON.stringify(dCoin, null, 4));
console.log('Is blockchaiin valid ? '+dCoin.isChainValid());
