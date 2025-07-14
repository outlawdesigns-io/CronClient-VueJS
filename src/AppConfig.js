export default{
  development:{
    CRON_SERVICE_BASE:'http://localhost',
    CRON_SERVICE_PORT:9550,
    MSG_SERVICE_BASE:'http://localhost',
    MSG_SERVICE_PORT:9667,
    AUTH_DISCOVERY_URI:'https://auth.outlawdesigns.io/.well-known/openid-configuration',
    AUTH_CLIENT_ID: '2ad8ece1-aa86-4e8f-90d2-470d2ef6f862',
    GIST_URL:'https://gist.github.com/outlawstar4761/a1105f79ba4cd26916abce8a0f3bb139'
  },
  testing:{
    CRON_SERVICE_BASE:'http://localhost',
    CRON_SERVICE_PORT:9550,
    MSG_SERVICE_BASE:'http://localhost',
    MSG_SERVICE_PORT:9667,
    AUTH_DISCOVERY_URI:'https://auth.outlawdesigns.io/.well-known/openid-configuration',
    AUTH_CLIENT_ID: '2ad8ece1-aa86-4e8f-90d2-470d2ef6f862',
    GIST_URL:'https://gist.github.com/outlawstar4761/a1105f79ba4cd26916abce8a0f3bb139'
  },
  production:{
    CRON_SERVICE_BASE:'http://localhost',
    CRON_SERVICE_PORT:9550,
    MSG_SERVICE_BASE:'http://localhost',
    MSG_SERVICE_PORT:9667,
    AUTH_DISCOVERY_URI:'https://auth.outlawdesigns.io/.well-known/openid-configuration',
    AUTH_CLIENT_ID: '2ad8ece1-aa86-4e8f-90d2-470d2ef6f862',
    GIST_URL:'https://gist.github.com/outlawstar4761/a1105f79ba4cd26916abce8a0f3bb139'
  }
}
