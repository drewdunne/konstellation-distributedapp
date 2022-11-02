const mswjs = require('@mswjs/interceptors')
const { ClientRequestInterceptor } = require('@mswjs/interceptors/lib/interceptors/ClientRequest');
const { FetchInterceptor } = require('@mswjs/interceptors/lib/interceptors/fetch');
const { response } = require('express');
const express = require("express");
const nf = require('node-fetch');

const cache = {
  
}

async function _instrumentHTTPTraffic() {
  const interceptor = new ClientRequestInterceptor();

  interceptor.apply();

  interceptor.on('request', async (request) => {

    const defaultHeaders = request.headers.all()
    const defaultUrl = request.url;

    console.log("\nDEFAULT HEADERS:")
    console.log(request.headers.all())

    //Ensure we're not capturing our own request
    if(!defaultHeaders.mock) {
      let mockResponse = await nf.fetch(defaultUrl, {
        headers: {
          ...defaultHeaders,
          mock: 'true'
        }
      })

      const data = await mockResponse.json();

      request.respondWith({
        status: mockResponse.status,
        statusText: mockResponse.statusText,
        headers: mockResponse.headers,
        body: data
      })
    }
  })
}

// module.exports = {
//   instrumentTraffic: _instrumentHTTPTraffic
// }

export default _instrumentHTTPTraffic;