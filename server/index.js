const express = require('express')
const path = require('path')
const { WebSocket } = require('ws')
const bodyParser=require('body-parser')
const app = express()
const api = require('./routes/api')
require('dotenv').config(); //載入.env環境檔
function getEnvVariable () {
    const env_variable= process.env.YOUR_VARIABLE;// 取出環境變數
    console.log(env_variable);
}
getEnvVariable()
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