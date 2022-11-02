// const mswjs = require('@mswjs/interceptors')
// const { ClientRequestInterceptor } = require('@mswjs/interceptors/lib/interceptors/ClientRequest');
// const express = require("express");
// const fetch = require('node-fetch')
// const otel = require('@opentelemetry/core')
// const otelapi = require('@opentelemetry/api')

const mswjs = require('@mswjs/interceptors')
const { ClientRequestInterceptor } = require('@mswjs/interceptors/lib/interceptors/ClientRequest');
const { FetchInterceptor } = require('@mswjs/interceptors/lib/interceptors/fetch');
const express = require("express");

const { RemoteHttpInterceptor } = require('@mswjs/interceptors/lib/RemoteHttpInterceptor');
// const { spawn } = require('child_process');
const { RemoteHttpResolver } = require('@mswjs/interceptors/lib/RemoteHttpInterceptor');


// const appProcess = spawn('node', ['server.js'], {
//   stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
// })

// const resolver = new RemoteHttpResolver({
//   process: appProcess,
// })

async function _instrumentHTTPTraffic() {

  const interceptor = new RemoteHttpInterceptor({
    interceptors: [new FetchInterceptor()],
  })

  interceptor.apply();

  resolver.on('request', async (request) => {
    console.log("intercepted");

    const defaultHeaders = request.headers.all()
    const defaultUrl = request.url;

    console.log("\nDEFAULT HEADERS:")
    console.log(request.headers.all())

    let mockHeaders = {
      ...defaultHeaders,
      mock: 'true'
    }

    if(!request.headers.all().mock) {
      let mockResponse = await fetch(defaultUrl, {
        headers: mockHeaders
      })
      const mockResponseData = mockResponse.json();

      const responsePayload = constructResponsePayload(mockResponseData.status, 
        mockResponseData.statusText, 
        mockResponseData.headers, 
        mockResponseData.body
        )

      console.log(mockResponseData.headers)

      request.respondWith(
        {
          status: 200,
          statusText: 'OK',
          headers: mockResponse.headers,
          body: JSON.stringify({
            firstName: 'John',
            lastName: 'Maverick',
          })
        }
      )
    }
    
  })
}

function constructResponsePayload(status, statusText, headers, body) {
  return {
    status: status,
    statusText: statusText,
    headers: headers,
    body: body
  }
}


// function _instrumentHTTPTraffic() {
//   const interceptor = new ClientRequestInterceptor();

//   interceptor.apply();

//   interceptor.on('request', async (request) => {

//     console.log("REQUEST INTERCEPTED")

//     let headers = request.headers.raw();
//     console.log(headers);

//     const url = request.url;
//     const response = await fetch(url, {
//       headers: {
//         TraceID: 'd1bvhjkfhdsjkhkj4bvc42142-421u48291'
//       }
//     })


//     request.respondWith({
//       status: 200,
//       statusText: 'OK',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         firstName: 'John',
//         lastName: 'Maverick',
//       })
//     })
//   })
// }

module.exports = {
  instrumentTraffic: _instrumentHTTPTraffic
}

























    // request.respondWith({
    //   status: response.status,
    //   statusText: response.statusText,
    //   headers: response.headers,
    //   body: response.body,
    // })

    // request.respondWith({
    //   status: 200,
    //   statusText: 'OK',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     firstName: 'John',
    //     lastName: 'Maverick',
    //   })
    // })
  // })

  // interceptor.on('response', (response) => {
  //   // console.log("RESPONSE INTERCEPTED")
  //   // let headers = response.headers.raw();
  //   // console.log(headers);

  //   // headers = {
  //   //   ...headers,
  //   //   'TraceID': '3215326437643543'
  //   // }
  //   // console.log(headers);

    


  //   // request.respondWith({
  //   //   status: 200,
  //   //   statusText: 'OK',
  //   //   headers: {
  //   //     'Content-Type': 'application/json',
  //   //   },
  //   //   body: JSON.stringify({
  //   //     firstName: 'John',
  //   //     lastName: 'Maverick',
  //   //   })
  //   // })
  // })

// }

// function _instrumentHTTPTraffic() {
//   const interceptor = createInterceptor({
//     resolver: () => {}, // Required even if not used
//     modules: [interceptXMLHttpRequest, interceptClientRequest],
//  });

//  interceptor.on("request", _handleHttpRequest);

//  interceptor.on("response", _handleHttpResponse);

//  interceptor.apply();
// }

// function _handleHttpRequest(request)  {
//  const url = request.url.toString();
//  const method = String(request.method);
//  const headers = request.headers.raw();

//  request.setHeader('example', 'value')

//  const requestEvent= {
//     headers,
//     method,
//     url: request.url.toString(),
//     body: request.body,
//  };


//  // Intentionally not waiting for a response to avoid adding any latency with this instrumentation
//  doSomethingWithRequest(requestEvent);
// }

// function _handleHttpResponse(request, response) {
//  const url = request.url.toString();
//  const headers = request.headers.raw();


//  const responseEvent = {
//     url: request.url.toString(),
//     method: request.method,
//     body: response.body,
//     headers: response.headers.raw(),
//     statusCode: response.status,
//  };

//  // Intentionally not waiting for a response to avoid adding any latency with this instrumentation
//  doSomethingWithResponse(responseEvent);
// }

module.exports = {
  instrumentTraffic: _instrumentHTTPTraffic
}