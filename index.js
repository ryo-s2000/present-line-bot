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
        
        console.log("---------event type---------")
        console.log(event.type)
        console.log("---------event type---------")
        console.log("---------event---------")
        console.log(event)
        console.log("---------event---------")


        const message = {
            type: 'text',
            text: 'OK!!!!!!'
        };

        if (event.type == 'follow'){
            console.log("---------source.userId complete---------")
            console.log(event.source.userId);
            userIds.push(event.source.userId);
            console.log(userIds);
            console.log("---------source.userId complete---------")
        }

        if (event.type == "message" && event.message.type == "text"){
            // console.log(userIds[0])
            // bot.pushMessage('U4754a0dfcb7f227de1149a3d4e135fb8', event.message.text)
            bot.pushMessage('U4754a0dfcb7f227de1149a3d4e135fb8', "event.message.text");
            // bot.pushMessage(userIds[0], event.message.text);
            // events_processed.push(bot.replyMessage(event.replyToken, {
            //     type: "text",
            //     text: event.message.text
            // }));
        }
    });

    // Promise.all(events_processed).then(
    //     (response) => {
    //         console.log(`${response.length} event(s) processed.`);
    //     }
    // );

});
