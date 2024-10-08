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

## KF IAM Service

```bash
$ dapr run --app-id kf-iam-service --app-port 3310 --app-protocol http --dapr-http-port 3510 --components-path .\components\  npm run start
```

## KF Insights Service

```bash
$ dapr run --app-id kf-insights-service --app-protocol http --config .\dapr\config\config.yaml --components-path .\dapr\components\ --app-port 3311 --dapr-http-port 3511 npm run start
```

## KF Advance Service

```bash
$ dapr run --app-id kf-advance-service --config .\dapr\config\config.yaml --components-path .\dapr\components\ --app-protocol http --app-port 3312 --dapr-http-port 3512 npm run start
```