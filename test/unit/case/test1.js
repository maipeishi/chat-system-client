const siege = require('siege')
siege('node ./test/unit/case/connect.js')
  .for(10000).times
  .get('/')
  .attack()