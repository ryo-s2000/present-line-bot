// メイン処理

const server = require("express")();
const line = require("@line/bot-sdk");

const line_config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
};

server.listen(process.env.PORT || 3000);

const bot = new line.Client(line_config);

let user_ids = [];

// サーバー設定

server.post('/webhook', line.middleware(line_config), (req, res, next) => {
    
    res.sendStatus(200);

    let events_processed = [];

    req.body.events.forEach((event) => {
        
        if (event.type == 'follow'){
            user_ids.push(event.source.userId);
            //配列に入れたデータが無くならないように仕様変更
        }

        if (event.type == "message" && event.message.type == "text"){

            let message = {
                type: 'text',
                text: event.message.text
            };

            var user_ids_unique = user_ids.filter(function (x, i, self) {
                return self.indexOf(x) === i;
            });

            for(var i = 0; i <= user_ids_unique.length - 1; i++){
                if(user_ids_unique[i] != event.source.userId){
                    bot.pushMessage(user_ids_unique[i], message);
                }
            }

        }
    });
});
