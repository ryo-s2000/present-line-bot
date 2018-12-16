// メイン処理

const server = require("express")();
const line = require("@line/bot-sdk");

const line_config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
};

server.listen(process.env.PORT || 3000);

const bot = new line.Client(line_config);

let userIds = [];

// サーバー設定

server.post('/webhook', line.middleware(line_config), (req, res, next) => {
    
    res.sendStatus(200);

    let events_processed = [];

    req.body.events.forEach((event) => {
        
        if (event.type == 'follow'){
            userIds.push(event.source.userId);
        }

        if (event.type == "message" && event.message.type == "text"){

            let message = {
                type: 'text',
                text: event.message.text
            };

            bot.pushMessage(userIds[0], message);
        }
    });
});
