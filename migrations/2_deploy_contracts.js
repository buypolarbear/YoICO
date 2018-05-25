let YoToken = artifacts.require("./YoToken.sol");
let YoTokenSale = artifacts.require("./YoTokenSale.sol");

module.exports = function(deployer) {
  deployer.deploy(YoToken, 123456789).then((yoTokenInstance) => {
    let tokenPrice = 1000000000000000;
    return deployer.deploy(YoTokenSale, yoTokenInstance.address, tokenPrice);
  });
  
};
