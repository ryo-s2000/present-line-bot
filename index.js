// メイン処理

var fs = require('fs');

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

    var user_ids = require('./user_ids.json');

    req.body.events.forEach((event) => {
        
        if (event.type == 'follow'){

            function getUniqueStr(myStrong){
                var strong = 1000;
                if (myStrong) strong = myStrong;
                    return new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16)
            }

            let uuid         = getUniqueStr();
            let line_user_id = event.source.userId;

            user_ids[uuid] = line_user_id;
            fs.writeFile('./user_ids.json', JSON.stringify(user_ids));
            //バリデーション処理
            //herokuに上がっているファイルを参照すれば良いのでは?
        }

        if (event.type == "message" && event.message.type == "text"){

            let message = {
                type: 'text',
                text: event.message.text
            };

            // var user_ids_unique = user_ids.filter(function (x, i, self) {
            //     return self.indexOf(x) === i;
            // });

            // for(var i = 0; i <= user_ids_unique.length - 1; i++){
            //     if(user_ids_unique[i] != event.source.userId){
            //         bot.pushMessage(user_ids_unique[i], message);
            //     }
            // }

            for(key user in user_ids){
                bot.pushMessage(user_ids[user], message);
            }

        }
    });
});
