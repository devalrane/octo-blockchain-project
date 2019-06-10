

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// these keys needed to sign transactions and verify balance amount
const key = ec.genKeyPair();
const publicKey = key.getPublic("hex");
const privateKey = key.getPrivate("hex");

/// private 702524b8de98eea21d318cf9979eb58c2477fda001653f59ce31477db7a682bf

////// public 04f3851756fe2931e752e658a4cb7aebc547f64960d3c961075515708f634725b6c27fb8d1d9f61aa58cfef36de2b74c04f9377282c85721359aebff31f3526db9
