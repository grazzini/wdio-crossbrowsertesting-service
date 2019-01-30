import request from 'request'
var cbt = require('cbt_tunnels');

class CrossBrowserTestingService {
    before(){
        this.sessionId = global.browser.sessionId;
        this.capabilities = capabilities;
        this.auth = global.browser.requestHandler.auth || {};
        this.cbtUsername = this.auth.user;
        this.cbtAuthkey = this.auth.pass;
        this.failures = 0; 
    }

    beforeTest(test){
        if(!this.cbtUsername || !this.cbtAuthkey){
            return;
        }
    }

     afterTest(test) {
        if (!test.passed) {
            ++this.failures
        }
    }

    after() {
        if (!this.cbtUsername || !this.cbtAuthkey) {
            return;
        }

        return this.updateJob(this.sessionId, this.failures);
    }

    getSessionUrl (sessionId) {
        return "https://crossbrowsertesting.com/api/v3/selenium/${this.sessionId}";
        
    }

    onReload(oldSessionId, newSessionId){
        if (!this.cbtUsername || !this.cbtAuthkey) {
            return;
        }
        this.sessionId = newSessionId;
        return this.updateJob(oldSessionId, this.failures, true)
    }

    updateJob (sessionId, failures, calledOnReload = false) {
        return new Promise((resolve, reject) => request.put(this.getSessionUrl(sessionId), {
            json: true,
            auth: {
                user: this.cbtUsername,
                pass: this.cbtAuthkey
            },
            body: this.getBody(failures, calledOnReload)
        }, (e, res, body) => {
            if (e) {
                return reject(e)
            }
            global.browser.jobData = body
            this.failures = 0
            resolve(body)
        }))
    }
    //is this needed?
     getBody (failures, calledOnReload = false) {
        let body = {}
        body.name = this.suiteTitle
        if (calledOnReload || this.testCnt) {
            body.name += ` (${++this.testCnt})`
        }

        for (let prop of jobDataProperties) {
            if (!this.capabilities[prop]) {
                continue
            }

            body[prop] = this.capabilities[prop]
        }

        body.passed = failures === 0
        return body
    }




}

export default CrossBrowserTestingService();
