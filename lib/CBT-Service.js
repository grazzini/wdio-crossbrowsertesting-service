var cbt = require('cbt_tunnels');

class CrossBrowserTestingService {
    onPrepare: function (config, capabilities) {
        if(!config.cbtTunnel){
            return;
        }


        console.log("Connecting local...");
        return new Promise(function(resolve, reject){
            cbt.start({'username': username,'authkey': authkey},function(err){
                if(!err){
                    console.log('Successful local connection!');
                    resolve();
                }else{
                    console.log('Failed local connection: ' + err.toString());
                    reject(err);
                }
            });
        })
     },
    
    onComplete: function(exitCode, config, capabilities) {
        return new Promise(function(resolve, reject){
            cbt.stop(function(err){
                if(!err){
                    console.log('Local connection sucessfully closed');
                    resolve();
                }else{
                    console.log('Failed to close local connection: ' + err.toString());
                    reject(err);
                }
            });
        })
     }
  // ...



}

export default new CrossBrowserTestingService()
