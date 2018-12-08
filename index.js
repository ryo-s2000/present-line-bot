const server = require("express")();
const line = require("@line/bot-sdk");

const line_config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
};

server.listen(process.env.PORT || 3000);

const bot = new line.Client(line_config);

server.post('/webhook', line.middleware(line_config), (req, res, next) => {
    
    res.sendStatus(200);

    let events_processed = [];

    req.body.events.forEach((event) => {
        if (event.type == "message" && event.message.type == "text"){
            // event.message.textをTwitterAPIに入れる。
            // WatsonAPIに入れる

            // if (event.message.text == "よろしく"){
            //     events_processed.push(bot.replyMessage(event.replyToken, {
            //         type: "text",
            //         text: "これはこれは"
            //     }));
            // }
            events_processed.push(bot.replyMessage(event.replyToken, {
                    type: "text",
                    text: event.message.text // WatsonAPIのレスポンス
                }));
        }
    });

    Promise.all(events_processed).then(
        (response) => {
            console.log(`${response.length} event(s) processed.`);
        }
    );

});
