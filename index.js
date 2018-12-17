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

    function unlink(path) {
      fs.unlink(path, function (err) {
        if (err) {
            throw err;
        }
      });
    }

    function writeFile(path, data) {
      fs.writeFile(path, data, function (err) {
        if (err) {
            throw err;
        }
      });
    }

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

            unlink('./user_ids.json');
			writeFile('./user_ids.json', JSON.stringify(user_ids));

            console.log('------updated follow function------');
            console.log(user_ids);
            console.log('------updated follow function------');
            //バリデーション処理
            //外部からjsonファイルへのアクセス制限をかける
        }

        if (event.type == 'unfollow'){
            for(key in user_ids){
                if(user_ids[key] == event.source.userId){
                    delete user_ids[key]
                    writeFile('./user_ids.json', JSON.stringify(user_ids));

                    console.log('------updated unfollow function------');
                    console.log(user_ids);
                    console.log('------updated unfollow function------');
                }
            }
        }

        if (event.type == "message" && event.message.type == "text"){
            let message = {
                type: 'text',
                text: event.message.text
            };

			for(key in user_ids){
                if(user_ids[key] != event.source.userId){
                    bot.pushMessage(user_ids[key], message);
                }
			}
        }

    });
});
