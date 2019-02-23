const request = require('request')
const cbt = require('cbt_tunnels')
const logger = require('@wdio/logger').default
const log = logger('wdio-crossbrowsertesting-service')

class CrossBrowserTestingService {
  constructor (config) {
    this.config = config
  }

  before (capabilities) {
    this.sessionId    = global.browser.sessionId;
    this.capabilities = capabilities;
    this.cbtUsername  = this.config.user;
    this.cbtAuthkey   = this.config.key;
    this.failures     = 0;
  }

  beforeSuite (suite) {
    this.suite = suite
  }

  afterTest(test) {
    if (!test.passed) {
      ++this.failures
    }
  }

  after() {
    let score = this.score
    this.failures = 0

    return this.updateJob(this.sessionId, {
      action: 'set_score',
      score: score,
    })
  }

  onReload(oldSessionId, newSessionId){
    this.sessionId = newSessionId;

    let score = this.score
    this.failures = 0

    return this.updateJob(oldSessionId, {
      action: 'set_score',
      score: score,
    })
  }

  getSessionUrl (sessionId) {
    return `https://crossbrowsertesting.com/api/v3/selenium/${sessionId}`
  }

  get score () {
    return this.failures > 0 ? 'fail' : 'pass'
  }

  updateJob (sessionId, body) {
    return new Promise((resolve, reject) => {
      request.put(this.getSessionUrl(sessionId), {
        json: true,
        auth: {
          user: this.cbtUsername,
          pass: this.cbtAuthkey
        },
        body: body
      }, (e, res, body) => {
        if (e) {
          return reject(e)
        }
        resolve(body)
      })
    })
  }
}

module.exports = CrossBrowserTestingService;
