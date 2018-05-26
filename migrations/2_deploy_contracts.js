let YoToken = artifacts.require("./YoToken.sol");
let YoTokenSale = artifacts.require("./YoTokenSale.sol");

module.exports = function(deployer) {
  deployer.deploy(YoToken, 1000000).then(() => {
    let tokenPrice = 1000000000000000;
    return deployer.deploy(YoTokenSale, YoToken.address, tokenPrice);
  });
};
