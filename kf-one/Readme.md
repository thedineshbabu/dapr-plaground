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

## DB Details

```bash

CREATE TABLE IF NOT EXISTS configtable (
  KEY VARCHAR NOT NULL,
  VALUE VARCHAR NOT NULL,
  VERSION VARCHAR NOT NULL,
  METADATA JSON
);

CREATE OR REPLACE FUNCTION notify_event() RETURNS TRIGGER AS $$
    DECLARE 
        data json;
        notification json;
    BEGIN
        IF (TG_OP = 'DELETE') THEN
            data = row_to_json(OLD);
        ELSE
            data = row_to_json(NEW);
        END IF;

        notification = json_build_object(
                          'table', TG_TABLE_NAME,
                          'action', TG_OP,
                          'data', data);
        PERFORM pg_notify('config', notification::text);
        RETURN NULL;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER config
AFTER INSERT OR UPDATE OR DELETE ON configtable
FOR EACH ROW EXECUTE PROCEDURE notify_event();

INSERT INTO configtable (KEY, VALUE, VERSION, METADATA)
VALUES 
('app.timeout', '30', 'v1.0', '{"description": "Timeout for the app in seconds", "units": "seconds"}'),
('app.theme', 'dark', 'v1.0', '{"description": "Theme setting for the application", "validValues": ["dark", "light"]}'),
('app.retries', '5', 'v1.0', NULL),
('db.max_connections', '100', 'v1.2', '{"description": "Maximum number of database connections", "units": "connections"}'),
('feature.new_ui', 'true', 'v1.1', '{"description": "Feature flag for enabling the new UI", "type": "boolean"}');

docker exec dapr_redis redis-cli MSET db34 "sdsdsss"

docker run -d --name postgres-container -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=12345 -e POSTGRES_DB=mydatabase -v C:\Temp\postgresql:/var/lib/postgresql/data -p 5432:5432 postgres
```

## Helm Commands
```
helm repo add dapr https://dapr.github.io/helm-charts/

helm repo update

helm search repo dapr --devel --versions

helm install dapr dapr/dapr-dashboard --namespace dapr-system

helm upgrade --install dapr dapr/dapr --version=1.14 --namespace dapr-system --create-namespace --wait

helm install dapr dapr/dapr-dashboard --namespace dapr-system

```

```

To get your password run:

    export REDIS_PASSWORD=$(kubectl get secret --namespace default redis -o jsonpath="{.data.redis-password}" | base64 -d)

To connect to your Redis&reg; server:

1. Run a Redis&reg; pod that you can use as a client:

   kubectl run --namespace default redis-client --restart='Never'  --env REDIS_PASSWORD=$REDIS_PASSWORD  --image docker.io/bitnami/redis:6.2 --command -- sleep infinity

   Use the following command to attach to the pod:

   kubectl exec --tty -i redis-client \
   --namespace default -- bash

2. Connect using the Redis&reg; CLI:
   REDISCLI_AUTH="$REDIS_PASSWORD" redis-cli -h redis-master
   REDISCLI_AUTH="$REDIS_PASSWORD" redis-cli -h redis-replicas

To connect to your database from outside the cluster execute the following commands:

    kubectl port-forward --namespace default svc/redis-master 6379:6379 &
    REDISCLI_AUTH="$REDIS_PASSWORD" redis-cli -h 127.0.0.1 -p 6379
WARNING: Rolling tag detected (bitnami/redis:6.2), please note that it is strongly recommended to avoid using rolling tags in a production environment.
+info https://docs.vmware.com/en/VMware-Tanzu-Application-Catalog/services/tutorials/GUID-understand-rolling-tags-containers-index.html

WARNING: There are "resources" sections in the chart not set. Using "resourcesPreset" is not recommended for production. For production installations, please set the following values according to your workload needs:
  - replica.resources
  - master.resources
+info https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

⚠ SECURITY WARNING: Original containers have been substituted. This Helm chart was designed, tested, and validated on multiple platforms using a specific set of Bitnami and Tanzu Application Catalog containers. Substituting other containers is likely to cause degraded security and performance, broken chart features, and missing environment variables.

Substituted images detected:
  - docker.io/bitnami/redis:6.2

```

```
Credentials:
    echo "Username      : admin"
    echo "Password      : $(kubectl get secret --namespace rabbitmq rabbitmq -o jsonpath="{.data.rabbitmq-password}" | base64 -d)"
    echo "ErLang Cookie : $(kubectl get secret --namespace rabbitmq rabbitmq -o jsonpath="{.data.rabbitmq-erlang-cookie}" | base64 -d)"

Note that the credentials are saved in persistent volume claims and will not be changed upon upgrade or reinstallation unless the persistent volume claim has been deleted. If this is not the first installation of this chart, the credentials may not be valid.
This is applicable when no passwords are set and therefore the random password is autogenerated. In case of using a fixed password, you should specify it when upgrading.
More information about the credentials may be found at https://docs.bitnami.com/general/how-to/troubleshoot-helm-chart-issues/#credential-errors-while-upgrading-chart-releases.

RabbitMQ can be accessed within the cluster on port 5672 at rabbitmq.rabbitmq.svc.cluster.local

To access for outside the cluster, perform the following steps:

To Access the RabbitMQ AMQP port:

    echo "URL : amqp://127.0.0.1:5672/"
    kubectl port-forward --namespace rabbitmq svc/rabbitmq 5672:5672

To Access the RabbitMQ Management interface:

    echo "URL : http://127.0.0.1:15672/"
    kubectl port-forward --namespace rabbitmq svc/rabbitmq 15672:15672

WARNING: There are "resources" sections in the chart not set. Using "resourcesPreset" is not recommended for production. For production installations, please set the following values according to your workload needs:
  - resources
+info https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
```