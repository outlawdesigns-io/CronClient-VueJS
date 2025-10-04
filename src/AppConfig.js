export default{
  development:{
    CRON_SERVICE_BASE:'https://cronservice.outlawdesigns.io',
    MSG_SERVICE_BASE:'http://localhost',
    MSG_SERVICE_PORT:9667,
    AUTH_DISCOVERY_URI:'https://auth.outlawdesigns.io/.well-known/openid-configuration',
    AUTH_CLIENT_ID: 'cronsuite-vuepwa',
    AUTH_REDIRECT_URL: 'http://localhost:3000/cron/token/',
    AUTH_LOGOUT_URL:'http://localhost:3000/cron/logout/',
    AUTH_SCOPE:'offline_access offline openid',
    GIST_URL:'https://gist.github.com/outlawstar4761/a1105f79ba4cd26916abce8a0f3bb139',
    AUTH_DISABLED:false
  },
  testing:{
    CRON_SERVICE_BASE:'http://localhost',
    CRON_SERVICE_PORT:9550,
    MSG_SERVICE_BASE:'http://localhost',
    MSG_SERVICE_PORT:9667,
    AUTH_DISCOVERY_URI:'https://auth.outlawdesigns.io/.well-known/openid-configuration',
    AUTH_CLIENT_ID: '2ad8ece1-aa86-4e8f-90d2-470d2ef6f862',
    AUTH_REDIRECT_URL: 'http://localhost:3000/cron/token/',
    AUTH_LOGOUT_URL:'http://localhost:3000/cron/logout/',
    AUTH_SCOPE:'offline_access offline openid',
    GIST_URL:'https://gist.github.com/outlawstar4761/a1105f79ba4cd26916abce8a0f3bb139',
    AUTH_DISABLED:true
  },
  production:{
    CRON_SERVICE_BASE:'http://localhost',
    CRON_SERVICE_PORT:9550,
    MSG_SERVICE_BASE:'http://localhost',
    MSG_SERVICE_PORT:9667,
    AUTH_DISCOVERY_URI:'https://auth.outlawdesigns.io/.well-known/openid-configuration',
    AUTH_CLIENT_ID: '2ad8ece1-aa86-4e8f-90d2-470d2ef6f862',
    AUTH_REDIRECT_URL: 'https://outlawdesigns.io/cron/token/',
    AUTH_LOGOUT_URL:'https://outlawdesigns.io/cron/logout/',
    AUTH_SCOPE:'offline_access offline openid',
    GIST_URL:'https://gist.github.com/outlawstar4761/a1105f79ba4cd26916abce8a0f3bb139',
    AUTH_DISABLED:true
  }
}
