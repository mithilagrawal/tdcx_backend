# Backend for Node.js

This repository contains a backend code of assignment given by the TDCX organization.

## Prerequisites

- [NodeJS](https://nodejs.org) from 16+ version

## Set up and run demo

### Clone

Clone the repository from GitHub.

```
$ git clone git@bitbucket.org:mithilauriga/tdcx_frontend.git
```

### frontend url to access the api's

 https://tdcx-frontend.herokuapp.com/


### Frontend credentials
name : John Doe
apiKey : qW1hrT2


### Heroku URL for backend

 https://tdcs-backend.herokuapp.com/


### Install Dependencies and Run the Server

```
$ npm install
$ npm start
```
Now, use your client code to make a request to get a JWT from the sample backend that is working on http://localhost:3092.


## Specification

### /api/ endpoint
This endpoint is an example of users authentication. It takes user `identity` and responds with unique token.

### /api documentation

```
https://dev-dl.tdcx.com:3092/docs/#/

```

Then you need to provide an HTTP endpoint which will return the JWT with the user's identity as a JSON.