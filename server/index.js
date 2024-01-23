const express = require('express')
const path = require('path')
const { WebSocket } = require('ws')
const bodyParser=require('body-parser')
const app = express()
const api = require('./routes/api')
const AWS = require('@aws-sdk/client-s3');
const mysql = require("mysql2");
require('dotenv').config(); //載入.env環境檔
function getEnvVariable () {
    const env_variable= process.env.YOUR_VARIABLE;// 取出環境變數
    console.log(env_variable);
}
getEnvVariable()

// AWS 設定
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const rdsHost = process.env.AWS_RDS_HOST;
const rdsUsername = process.env.AWS_RDS_USERNAME;
const rdsPassword = process.env.AWS_RDS_PASSWORD;
const rdsDBName = process.env.RDS_DATABASE;
const s3BucketName = process.env.AWS_BUCKET_NAME;
const rdsPORT = process.env.RDS_PORT

// 連線到 RDS
const rdsConnection = mysql.createConnection({
    host: rdsHost,
    user: rdsUsername,
    password: rdsPassword,
    database: rdsDBName,
    //port: rdsPORT
    // authPlugins: {
    //     auth_gssapi_client: require('mysql2/lib/auth_plugins/mysql_clear_password.js')
    // }
});
  
rdsConnection.connect((err) => {
    if (err) {
      console.error(`無法連線到 RDS: ${err}`);
      return;
    }
    console.log('成功連線到 RDS');
});
  
  // 連線到 S3
const s3 = new AWS.S3({
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
});
  
s3.listObjects({ Bucket: s3BucketName }, (err, data) => {
    if (err) {
      console.error(`無法連線到 S3 或存儲桶不存在: ${err}`);
      return;
    }
    console.log('成功連線到 S3');
    console.log(`S3 存儲桶 ${s3BucketName} 中的物件數量: ${data.Contents.length}`);
});


//* server setup
app.use(bodyParser.json({limit:'100mb'}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use(express.static(path.join(__dirname, '../client')))
app.use('/api', api.router)



//* open server
const port = process.env.PORT || 8080
const server = app.listen(port, () => { console.log('working to open') })

//* websocket
const wss = new WebSocket.Server({ server })
wss.on('connection', (ws) => {
    console.log('client connected')

    //! message from client
    ws.on('message', (message) => {
        console.log(message)





    })

    //! disconnect
    ws.on('close', () => {
        console.log('leave socket')
    })
})