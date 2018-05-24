let YoToken = artifacts.require('./YoToken.sol');

contract('YoToken', (accounts) => {

    let tokenInstance;
    
    it('sets the total supply upon deployment', () => {
        return YoToken.deployed().then((instance) => {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then((totalSupply) => {
            assert.equal(totalSupply.toNumber(), 123456789, 'sets the total supply to 12,3456,789');
        });
    });
});