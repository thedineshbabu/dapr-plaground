

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

$ dapr run --app-id rbt-mq-producer --app-port 3300  npm run start

$ dapr run --app-id my-app --app-port 5002 --dapr-http-port 3501 --log-level debug node index.js 

$ dapr run --app-id checkout-http --components-path ../../../components -- node . 

$ dapr run --app-id dapr-second-consumer --app-port 3302 --components-path ./dapr/components --log-level debug npm run start
```

