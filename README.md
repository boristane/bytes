# bytes

The web API to host my bytes (mini blog posts).

## Required env variables

JWT_KEY: JSON webtoke generation key
PGHOST: the postgres database host
PGPORT: the postgres database port
PGDATABASE: the posgres database name
PGUSER: the postgres database username
PGPASSWORD: the postgres database user password
URL: the url at which to hit this service
AWS_SECRET_ACCESS_KEY: the aws secret access key for the S3 bucket
AWS_ACCESS_KEY_ID: the aws access key id for the S3 bucket
BUCKET: the bucket name
DOMAIN: the mailgun domain name for emails
MAILGUN_KEY: the mailgun access key
PORT: the service port
SLACK_HOOK_URL: the slack hook url for emergency logging
ENV: the node environment
