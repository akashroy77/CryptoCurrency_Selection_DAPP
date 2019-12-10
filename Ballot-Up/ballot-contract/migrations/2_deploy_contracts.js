var CryptoSelectionBallot = artifacts.require("./CryptoSelectionBallot.sol")

module.exports = function(deployer){
    deployer.deploy(CryptoSelectionBallot,4)
};