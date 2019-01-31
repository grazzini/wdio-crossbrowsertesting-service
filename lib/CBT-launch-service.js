var cbt = require('cbt_tunnels');

class CrossBrowserTestingLauncherService {
    onPrepare(config, capabilities) {
        if(!config.cbtTunnel){
            return;
        }

        console.log("Connecting local...");
        return new Promise(function(resolve, reject){
            cbt.start({'username': config.user,'authkey': config.key},function(err){
                if(!err){
                    console.log('Successful local connection!');
                    resolve();
                }else{
                    console.log('Failed local connection: ' + err.toString());
                    reject(err);
                }
            });
        })
     }
    
    onComplete() {         
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
  

}

module.exports = CrossBrowserTestingLauncherService;
