# cocoanalyticssdk-js-energy-sample-app


## pre-requisite
1. create an Grove application with type SPA from https://manage.getcoco.buzz
2. Keep clientId and clientSecret to get access to coco where clientId won't be present for SPA type grove application. clientId is only required for C2C type
3. Get SDK from link 
   a. https://static-assets.getcoco.buzz/scripts/coco-analytics-sdk.min.js

## Application Flow
1. Get access token of coco.
2. Initialize analytics SDK.
3. Get list of networks of a user.
4. Get list of zones in a network.
5. Get list of resources in a zone of a network
5. Get energy consumption data for each zone using fetchData API in analytics SDK.
6. Display data in required charts.

## API's requiqures to achive this application
1. Get access to COCO
   1. Use SDK for coco login
      a. Coco.init() - Initialize the SDK with client configuration
      b. Coco.isLoggedIn() - Check logged in status
      c. Coco.login() - Login the user by making an authorization request
      d. Coco.logout() - Logout the user
      e. Coco.api() - Make protected resource requests

   2. Use Login API's of coco
      a. https://api.getcoco.buzz/v1.0/auth/login
      b. https://api.getcoco.buzz/v1.0/oauth/authorize
      c. https://api.getcoco.buzz/v1.0/oauth/token
2. Get List of networks of a user
   a. https://api.getcoco.buzz/v1.0/network-manager/networks
3. Get List of zones of a network
   a. https://api.getcoco.buzz/v1.0/network-manager/networks/:networkId/zones
4. Get zone details
   a. https://api.getcoco.buzz/v1.0/network-manager/networks/:networkId/zones/:zoneId
5. CocoAnalytics (check with krishna on documenting SDK API)
   a. CocoAnalytics.connect() - connect to coco analytics backend
   b. CocoAnalytics.fetchData() - Get the analytics data of a resource/zone
   c. CocoAnalytics.updateToken() - To reconnect to coco analytics backend
   d. CocoAnalytics.disconnect() - To disconnect from coco analytics backend

## Steps to run the application
1. npm ci
2. Update client credentials 
3. ng serve 
4. Application runs on port http://localhost:4200


## Note
1. All API's detailed description available on link https://docs.getcoco.buzz/restful-api