const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const {Blockchain, Transactions} = require("./blockchain");
const myKey = ec.keyFromPrivate('702524b8de98eea21d318cf9979eb58c2477fda001653f59ce31477db7a682bf')
const myWallet = myKey.getPublic('hex');


let dCoin = new Blockchain();

const tx1 = new Transactions(myWallet, 'public key here', 10);
tx1.signTransaction(myKey);
dCoin.createTransaction(tx1);

console.log('\nStarting the miner....');
dCoin.minePendingTransactions(myWallet);

console.log('Deval\'s balance is ', dCoin.getBalanceOfAddress(myWallet));

