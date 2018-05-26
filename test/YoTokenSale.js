let YoToken = artifacts.require('./YoToken.sol');
let YoTokenSale = artifacts.require('./YoTokenSale.sol');

contract('YoTokenSale', (accounts) => {
    let tokenInstance;
    let tokenSaleInstance;
    let admin = accounts[0];
    let buyer = accounts[1];
    let tokenPrice = 1000000000000000;
    let tokensAvailable = 750000;
    let numberOfTokens;

    it('initializes the contract with the correct values', () => {
        return YoTokenSale.deployed().then((instance) => {
            tokenSaleInstance = instance;
            return tokenSaleInstance.address;
        }).then((address) => {
            assert.notEqual(address, 0x0, 'has contract address');
            return tokenSaleInstance.tokenContract();
        }).then((address) => {
            assert.notEqual(address, 0x0, 'has token contract address');
            return tokenSaleInstance.tokenPrice();
        }).then((price) => {
            assert.equal(price, tokenPrice, 'token price is correct');
        });
    });

    it('facilitates token buying', () => {
        return YoToken.deployed().then((instance) => {
            tokenInstance = instance;
            return YoTokenSale.deployed();
        }).then((instance) => {
            tokenSaleInstance = instance;
            return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, {from: admin});
        }).then((receipt) => {
            numberOfTokens = 10;
            return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value: numberOfTokens * tokenPrice});
        }).then((receipt) => {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Sell', 'should be "Sell" event');
            assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchases the tokens');
            assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');

            return tokenSaleInstance.tokensSold();
        }).then((amount) => {
            assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold');
            return tokenInstance.balanceOf(buyer); 
        }).then((balance) => {
            assert.equal(balance.toNumber(), numberOfTokens, 'buyer\'s balance should be right');
            return tokenInstance.balanceOf(tokenSaleInstance.address); 
        }).then((balance) => {
            assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
            return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value: 1});
        }).then(assert.fail).catch((error) => {
            assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
            return tokenSaleInstance.buyTokens(8000000, {from: buyer, value: 100 * tokenPrice});            
        }).then(assert.fail).catch((error) => {
            assert(error.message.indexOf('revert') >= 0, 'can not buy tokens more than the available ones');
        });
    });
});
