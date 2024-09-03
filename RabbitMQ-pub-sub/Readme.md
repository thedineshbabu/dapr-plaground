## Producer

```bash
$ dapr run --app-id producer --app-port 3300 --app-protocol http --dapr-http-port 3500 --components-path .\components\  npm run start
```

## First Consumer

```bash
$ dapr run --app-id firstconsumer --app-protocol http --config .\dapr\config\config.yaml --components-path .\dapr\components\ --app-port 3301 --dapr-http-port 3501 npm run start
```

## Second Consumer

```bash
$ dapr run --app-id secondconsumer --config .\dapr\config\config.yaml --components-path .\dapr\components\ --app-protocol http --app-port 3302 --dapr-http-port 3502 npm run start
```