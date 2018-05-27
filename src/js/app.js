App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',

    init: () => {
        console.log('App initialized...');
        return App.initWeb3();
    },
    initWeb3: () => {
        if(typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }
        return App.initContracts();
    },
    initContracts: () => {
        $.getJSON('YoTokenSale.json', (yoTokenSale) => {
            App.contracts.YoTokenSale = TruffleContract(yoTokenSale);
            App.contracts.YoTokenSale.setProvider(App.web3Provider);
            App.contracts.YoTokenSale.deployed().then((yoTokenSale) => {
                console.log(`Yo Token Sale Address: ${yoTokenSale.address}`);
            });
        }).done(() => {
            $.getJSON('YoToken.json', (yoToken) => {
                App.contracts.YoToken = TruffleContract(yoToken);
                App.contracts.YoToken.setProvider(App.web3Provider);
                App.contracts.YoToken.deployed().then((yoToken) => {
                    console.log(`Yo Token Address: ${yoToken.address}`);
                });
            });
            return App.render();
        });
    },
    render: () => {
        web3.eth.getCoinbase((err, account) => {
            if(err === null) {
                App.account = account;
                $('#accountAddress').html(` <strong>Account ID: </strong>${account}`);
            }
        });
    }
}

$(() => {
    $(window).load(() => {
        App.init();
    });
});