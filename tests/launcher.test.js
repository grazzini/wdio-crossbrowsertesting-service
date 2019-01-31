var cbt = require('cbt_tunnels')
var CrossBrowserTestingLauncherService = require('/Users/daphne.magsby/documents/wdio-crossbrowsertesting-service/lib/CBT-launch-service.js');
jest.setTimeout(300000);

const service = new CrossBrowserTestingLauncherService

test('onPrepare', async () => {
	
    const caps = [{}]
    const config = {
        user: 'CBT_USERNAME',
        key: 'CBT_AUTHKEY',
        cbtTunnel: true
    }

	await service.onPrepare(config, caps)
    
})


test('onComplete', () => {

    service.onComplete()
})
