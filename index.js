// メイン処理

const server = require("express")();
const line = require("@line/bot-sdk");

const line_config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
};

server.listen(process.env.PORT || 3000);

const bot = new line.Client(line_config);

// サーバー設定

server.post('/webhook', line.middleware(line_config), (req, res, next) => {
    
    res.sendStatus(200);

    let events_processed = [];

    req.body.events.forEach((event) => {
        // もしテキストがメッセージだったらイベント発火
        if (event.type == "message" && event.message.type == "text"){
            // このurlはRailsで指定したAPI
            url = "https://powerful-refuge-14937.herokuapp.com/api/watson_data/" + event.message.text
            const https = require('https');
            const reqest = https.request(url, (res) => {
                // res.on('data', (chunk) => {
                    // jsonのパースがうまく行っていないので今はコメント
                                events_processed.push(bot.replyMessage(event.replyToken, {
                                type: "text",
                                text: '{"twitter":{"data":"{\n  \"document_id\": \"846c7c8e-6158-47e9-9b57-2f5c6eb0181e\",\n  \"status\": \"processing\"\n}"}}'
                            }));
                // });
            })
            reqest.end();
        }

    });

    Promise.all(events_processed).then(
        (response) => {
            console.log(`${response.length} event(s) processed.`);
        }
    );

});
