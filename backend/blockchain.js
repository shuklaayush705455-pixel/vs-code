const { ethers } = require("ethers");

// 🔴 PASTE FROM REMIX
const CONTRACT_ADDRESS = "PASTE_CONTRACT_ADDRESS";
const ABI = [ /* PASTE ABI HERE */ ];

// Ganache
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");

// signer
const signer = provider.getSigner(0);

// contract
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

module.exports = contract;