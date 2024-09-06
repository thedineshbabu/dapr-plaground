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