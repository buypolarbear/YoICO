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

    it('transfers token ownership', () => {
        return YoToken.deployed().then((instance) => {
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1], 987654321);
        }).then(assert.fail).catch((error) => {
            assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
            return tokenInstance.transfer.call(accounts[1], 1000, { from: accounts[0] });
        }).then((success) => {
            assert.equal(success, true, 'outputs true on success')
            return tokenInstance.transfer(accounts[1], 1000, { from: accounts[0] });
        }).then((receipt) => {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be "Transfer" event');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account of sender');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account of receiver');
            assert.equal(receipt.logs[0].args._value, 1000, 'logs the amount transfered');
            
            return tokenInstance.balanceOf(accounts[1]);
        }).then((balance) => {
            assert.equal(balance.toNumber(), 1000, 'adds the amount to the receving account');
            return tokenInstance.balanceOf(accounts[0]);
        }).then((balance) => {
            assert.equal(balance.toNumber(), 123455789, 'deducts the amount from the sender account');
        });
    });

    it('approves tokens for delegated transfers', () => {
        return YoToken.deployed().then((instance) => {
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1], 1000);
        }).then((success) => {
            assert.equal(success, true, 'it returns true');
            return tokenInstance.approve(accounts[1], 1000, {from: accounts[0]});
        }).then((receipt) => {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Approval', 'should be "Approval" event');
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are authorized by');
            assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are authorized to');
            assert.equal(receipt.logs[0].args._value, 1000, 'logs the amount transfered');
            
            return tokenInstance.allowance(accounts[0], accounts[1]);
        }).then((allowance) => {
            assert.equal(allowance.toNumber(), 1000, 'stores the allowance for delegated transfer');
        });
    });

});