App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    loading: false,
    tokenPrice: 1000000000000000,
    tokensSold: 0,
    tokensAvailable: 750000,

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

            App.listenForEvents();
            
            return App.render();
        });
    },
    listenForEvents: () => {
        App.contracts.YoTokenSale.deployed().then((instance) => {
            instance.Sell({}, {
                fromBlock: 0,
                toBlock: 'latest'
            }).watch((err, event) => {
                console.log('Event Triggered', event);
                App.render();
            });
        });
    },
    render: () => {
        if(App.loading) return;

        App.loading = true;

        let loader = $('#loader');
        let content = $('#content');

        loader.show();
        content.hide();

        web3.eth.getCoinbase((err, account) => {
            if(err === null) {
                App.account = account;
                $('#accountAddress').html(` <strong>Account ID: </strong>${account}`);
            }
        });

        let yoTokenSaleInstance;
        App.contracts.YoTokenSale.deployed().then((instance) => {
            yoTokenSaleInstance = instance;
            return yoTokenSaleInstance.tokenPrice();
        }).then((tokenPrice) => {
            App.tokenPrice = tokenPrice;
            $('.token-price').html(web3.fromWei(App.tokenPrice, 'ether').toNumber());
            return yoTokenSaleInstance.tokensSold();
        }).then((tokensSold) => {
            App.tokensSold = tokensSold.toNumber();
            $('.tokens-sold').html(App.tokensSold);
            $('.tokens-available').html(App.tokensAvailable);

            let progressPercent = (App.tokensSold / App.tokensAvailable) * 100;
            $('#progress').css('width', progressPercent + '%');

            let yoTokenInstance;
            App.contracts.YoToken.deployed().then((instance) => {
                yoTokenInstance = instance;
                return yoTokenInstance.balanceOf(App.account);
            }).then((balance) => {
                $('.yo-balance').html(balance.toNumber());
                App.loading = false;
                loader.hide();
                content.show();        
            });
        });
    },
    buyTokens: () => {
        $('#content').hide();
        $('#loader').show();

        let numberOfTokens = $('#numberOfTokens').val();
        App.contracts.YoTokenSale.deployed().then((instance) => {
            return instance.buyTokens(numberOfTokens, {
                from: App.account,
                value: numberOfTokens * App.tokenPrice,
                gas: 500000
            });
        }).then((result) => {
            console.log('Tokens Bought...');
            $('form').trigger('reset');
        });
    }
}

$(() => {
    $(window).load(() => {
        App.init();
    });
});