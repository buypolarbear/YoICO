let YoToken = artifacts.require("./YoToken.sol");

module.exports = function(deployer) {
  deployer.deploy(YoToken);
};
