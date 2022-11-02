const { ClientRequestInterceptor} = require('@mswjs/interceptors/lib/interceptors/ClientRequest');
const { XMLHttpRequestInterceptor } = require('@mswjs/interceptors/lib/interceptors/XMLHttpRequest');
const { FetchInterceptor } = require('@mswjs/interceptors/lib/interceptors/fetch');

const otel = require('@opentelemetry/core')
const otelapi = require('@opentelemetry/api')
const nf = require('node-fetch')


function _instrumentHTTPTraffic() {
  
}

module.exports = {
  instrumentTraffic: _instrumentHTTPTraffic
}