var bitcore = require('zcore-lib');
var RpcClient = require('bitcoind-rpc-zcoin');
require('dotenv').config()
  var config = {
    protocol: 'http',
    user: process.env.RPC_USER,
    pass: process.env.RPC_PASS,
    host: '127.0.0.1',
    port: '8888',
  };
  
  var rpc = new RpcClient(config);

  var txids = [];

  function showNewTransactions() {
    rpc.getRawMemPool(function (err, ret) {
      if (err) {
        console.error(err);
        return setTimeout(showNewTransactions, 10000);
      }

      function batchCall() {
        ret.result.forEach(function (txid) {
          if (txids.indexOf(txid) === -1) {
            rpc.getRawTransaction(txid);
          }
        });
      }

      rpc.batch(batchCall, function(err, rawtxs) {
        if (err) {
          console.error(err);
          return setTimeout(showNewTransactions, 10000);
        }
//aHcgPuKwmYFMgHoEzxFD95GAxJg76Gnagc
        rawtxs.map(function (rawtx) {
          rpc.decodeRawTransaction(rawtx.result, function (err, ret) {
                console.log(ret.result)
              for (var i = 0; i < ret.result.vout.length; i++) {
                    if (ret.result.vout[i].scriptPubKey.addresses[0] == 'aHcgPuKwmYFMgHoEzxFD95GAxJg76Gnagc' ){
                        console.log('Received coins')
                    }  

              }
          })
          //var tx = new bitcore.Transaction(rawtx.result);
          //console.log('\n\n\n' + tx.id + ':', tx.toObject());
        });

        txids = ret.result;
        setTimeout(showNewTransactions, 2500);
      });
    });
  }

  showNewTransactions();