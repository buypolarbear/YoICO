let YoToken = artifacts.require('./YoToken.sol');

contract('YoToken', (accounts) => {
    let tokenInstance;
    
    it('initializes the contract with the correct values', () => {
        return YoToken.deployed().then((instance) => {
            tokenInstance = instance;
            return tokenInstance.name();
        }).then((name) => {
            assert.equal(name, 'Yo Token', 'has the correct name');
            return tokenInstance.symbol();
        }).then((symbol) => {
            assert.equal(symbol, 'YO', 'has the correct symbol');
            return tokenInstance.standard();
        }).then((standard) => {
            assert.equal(standard, 'Yo Token v1.0', 'has the correct standard');
        });
    });

    it('allocates the initial supply upon deployment', () => {
        return YoToken.deployed().then((instance) => {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then((totalSupply) => {
            assert.equal(totalSupply.toNumber(), 123456789, 'sets the total supply to 123,456,789');
            return tokenInstance.balanceOf(accounts[0]);
        }).then((adminBalance) => {
            assert.equal(adminBalance.toNumber(), 123456789, 'it allocates the initial supply in the admin account');
        });
    });
});