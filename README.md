# bytes

The web API to host my bytes (mini blog posts).

byte: a unit of digital information that most commonly consists of eight bits, representing a binary number. The byte [...] is the smallest addressable unit of memory in many computer architectures [[source](https://en.wikipedia.org/wiki/Byte)].

This is thus a collection of (in)frequent byte-sized posts on software development, architecture and whatever else I feel like writing.

## Environment Variables

| Variable              | Description                                 |
| --------------------- | ------------------------------------------- |
| JWT_KEY               | The JSON webtoken generation key            |
| PGHOST                | The postgres database host                  |
| PGPORT                | The postgres database port                  |
| PGDATABASE            | The posgres database name                   |
| PGUSER                | The postgres database username              |
| PGPASSWORD            | The postgres database password              |
| URL                   | The url at which to hit this service        |
| AWS_SECRET_ACCESS_KEY | The aws secret access key for the S3 bucket |
| AWS_ACCESS_KEY_ID     | The aws access key id for the S3 bucket     |
| BUCKET                | The bucket name                             |
| DOMAIN                | The mailgun domain name for emails          |
| MAILGUN_KEY           | The mailgun access key                      |
| PORT                  | The service port                            |
| SLACK_HOOK_URL        | The slack hook url for emergency logging    |
| ENV                   | The node environment                        |
