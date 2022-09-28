const express = require('express');
const http = require('http');
const https = require('https');
const { Client, Location, List, Buttons, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const downloadFile = require('nodejs-file-downloader');
const moment = require('moment-timezone');
const xml2js = require('xml2js');
const { Op } = require('sequelize');

require('dotenv').config();

const app = express();

//port
const PORT = process.env.PORT || 5000;


//call helper
const insertReplyMessage = require('./helpers/ReplyMessageHelper');
const { edukasiCovid19, kasusCovidHarian } = require('./helpers/apiCovid19.js');
const { getTime } = require('./helpers/mainHelper');
//call route
const waRepliRoutes = require('./routes/whatsappReplyRoute');
const userRoutes = require('./routes/userRoutes');



// //set server
let server;
if (process.env.NODE_ENV === 'production') {
    server = https.createServer(app);
} else {
    server = http.createServer(app);
}

//config socket io
const io = require("socket.io")(server, {
    cors: {
        origin: "*"
    }
})


// //app setting
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// const client = new Client({
//     authStrategy: new LocalAuth(),
//     puppeteer: { headless: true }
// });

const client = new Client();


client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});


// // call model
const { WaReplies, ReplyMessage } = require('./models');



client.on('message', async msg => {
    console.log(msg.body);
    //generate date now
    let dateToday = moment.tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:SS');
    console.log(dateToday || null);
    try {
        // // or use the static method from the Sticker class
        // console.log('MESSAGE RECEIVED', msg);
        let number = (await msg.getContact()).number;


        //check if exists keyword
        const wareplies = await WaReplies.findOne({
            where: {
                keyword: msg.body
            }
        })
        const menu = await WaReplies.findOne({
            where: {
                keyword: 'menu'
            }
        })
        const masterMenu = await WaReplies.findAll({
            where: {
                master_id: 0
            },
            order: [
                ['keyword', 'ASC']
            ]
        })


        let textMenu = `${menu.text.replace('{waktu}', getTime())}\n\n`;
        masterMenu.forEach(master => {
            textMenu += `${master.keyword} => ${master.name}\n`
        })

        const productsList = new List(
            "silakan anda pilih menu2 di bawah ini",
            "list menu",
            [
                {
                    title: "menu whatsapp bot",
                    rows: [
                        { id: "apple", title: "Apple" },
                        { id: "mango", title: "Mango" },
                        { id: "banana", title: "Banana" },
                    ],
                },
            ],
            "Silakan pilih menu"
        );


        if (wareplies) {
            if (msg.body == wareplies.keyword) {
                // Send a new message as a reply to the current one
                if (wareplies.type == 'text') {

                    let textMessage = wareplies.text;
                    await ReplyMessage.create({
                        message: wareplies.text,
                        number_destination: number,
                        keyword: msg.body,
                        question: wareplies.name,
                        type: wareplies.type,
                        link_media: null,
                    })
                    if (wareplies.keyword == 21) {
                        // let edukasiCovid = await edukasiCovid19();
                        // let result = xml2js.parseString(edukasiCovid, (err, result) => {
                        //     const json = JSON.stringify(result, null, 4);
                        //     console.log(json);
                        // });
                        // console.log(result);
                        textMessage = "Untuk sekarang belum terasedia untuk pertanyaan tentang edukasi Covid-19"
                    } else if (wareplies.keyword == 20) {
                        let infoCovid = await kasusCovidHarian();
                        let message = `kasus covid pada tanggal *${infoCovid.update.penambahan.tanggal}* \n\nTotal jumblah positif : ${infoCovid.update.penambahan.jumlah_positif}\nTotal jumblah meninggal : ${infoCovid.update.penambahan.jumlah_meninggal}\nTotal jumblah di rawat : ${infoCovid.update.penambahan.jumlah_dirawat}`
                        textMessage = message
                    } else if (wareplies.keyword == 'menu') {
                        textMessage = textMenu

                    } else if (wareplies.roll_sub == 'master') {
                        //sub1 ====
                        const sub1Menu = await WaReplies.findAll({
                            where: {
                                roll_sub: 'sub1',
                                master_id: wareplies.id
                            },
                            order: [
                                ['keyword', 'ASC']
                            ]
                        })
                        let textMenuSub1 = `Untuk sekarang anda baru bisa menanyakan beberapa pertanyaan soal ${wareplies.name}. Untuk kedepannya kita akan berusaha menambahkan pertntaan-pertnyaan baru. \n\n Example : anda bisa ketikan nomernya saja. \n\n`;
                        sub1Menu.forEach(master => {
                            textMenuSub1 += `${master.keyword} => ${master.name}\n`
                        })
                        textMessage = sub1Menu.length > 0 ? textMenuSub1 : wareplies.text
                        // `Opsss, untuk sekrang, masih belum tersedia untuk pertnyaan ${wareplies.name}`
                    }

                    console.log(wareplies.roll_sub);

                    // client.sendMessage()
                    msg.reply(textMessage);
                } else {
                    if (wareplies.link_media) {
                        let pathMedia = wareplies.link_media.replace('public/', "");
                        let linkMedia = process.env.ENDPOINT_CLIENT + 'storage/' + pathMedia;
                        let media = await MessageMedia.fromUrl(linkMedia);

                        await ReplyMessage.create({
                            keyword: msg.body,
                            number_destination: number,
                            type: wareplies.type,
                            question: wareplies.name,
                            link_media: linkMedia,
                        })
                        msg.reply(media)
                    } else {

                        msg.reply('keyword yang anda masukan belum tersedia, di sistem kami');
                    }
                }
            } else {
                await ReplyMessage.create({
                    keyword: msg.body,
                    question: wareplies.name,
                    number_destination: number,
                    type: 'text',
                })

                msg.reply(textMenu);
            }
        } else {
            msg.reply(textMenu);
        }
    } catch (error) {
        msg.reply(error.message);
    }
});

// // socket io
io.on('connection', (socket) => {
    //send qrcode
    client.on('qr', (qr) => {
        console.log('qr', qr);
        qrcode.toDataURL(qr, function (err, url) {
            if (err) {
                console.log('Message: ', err);
            }
            socket.emit('qrcode', url)
        })
        socket.emit('message', 'QR RECEIVED, please scan qrcode');
    });
    //message logout
    client.on('disconnected', (reason) => {
        socket.emit('message', `<p>Client was logged out</p><p>Please scan agin...</p><p>reason : ${reason}</p>`);
        client.initialize();
    });
    //message change_state
    client.on('change_state', state => {
        socket.emit('message', 'CHANGE STATE ' + state);
    });
    //message if ready
    client.on('ready', () => {
        socket.emit('message', 'READY..');
    });
    //messagae when auth fail
    client.on('auth_failure', msg => {
        socket.emit('message', 'AUTHENTICATION FAILURE ' + msg);
    });
    //message when user join group
    client.on('group_join', (notification) => {
        socket.emit('message', 'User joined.');
        console.log('join', notification);
        // notification.reply();
    });
    //message when user leav group
    client.on('group_leave', (notification) => {
        // notification.reply();
        socket.emit('message', 'User left.');
    });
    //message when group updated
    client.on('group_update', (notification) => {
        socket.emit('message', 'group updated.');
    });
    //message if client ready
    client.on('authenticated', (session) => {
        socket.emit('message', 'Ready...');
        console.log('AUTHENTICATED');
    });
    //when message revoveke from everyone
    client.on('message_revoke_everyone', async (after, before) => {
        // Fired whenever a message is deleted by anyone (including you)
        socket.emit("message", `After ${after}`);
        if (before) {
            socket.emit("message", `Before ${before}`);
        }
    });
    //when message revoke from me
    client.on('message_revoke_me', async (msg) => {
        // Fired whenever a message is only deleted in your own view.
        socket.emit('message', msg.body)// message before it was deleted.
    });
    //tracking chat
    client.on('message_ack', (msg, ack) => {
        /*
            == ACK VALUES ==
            ACK_ERROR: -1
            ACK_PENDING: 0
            ACK_SERVER: 1
            ACK_DEVICE: 2
            ACK_READ: 3
            ACK_PLAYED: 4
        */
        if (ack == 3) {
            // console.log('message red');
            socket.emit('message', "message red");
        }
    });
    //if message created
    client.on('message_create', (msg) => {
        // Fired on all message creations, including your own
        if (msg.fromMe) {
            // do stuff here
            console.log('message create');
        }
    });
})
// //end socket io

// //route
app.get('/', (req, res) => {
    res.render('index.ejs');
})

app.post('/send-message', async(req, res)=>{
    try {
        let number = req.body.number
        // let messageIndex = msg.body.indexOf(number) + number.length;
        let message = req.body.message;
        number = number.includes('@c.us') ? number : `${number}@c.us`;
        // let chat = await msg.getChat();
        // chat.sendSeen();
        client.sendMessage(number, message);
        res.json({
            status: "success",
            message: "message sended"
        })
    } catch (error) {
        console.log(error.message);
    }
})

client.initialize();


server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})




