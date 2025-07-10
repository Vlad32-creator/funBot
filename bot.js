import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import express from 'express';
dotenv.config();


const anyCat = "https://api.thecatapi.com/v1/images/search";
const anyDog = 'https://dog.ceo/api/breeds/image/random';
const anyJoke = 'https://v2.jokeapi.dev/joke/Any';
const boredApi = 'https://www.boredapi.com/api/activity';
const quot = 'https://favqs.com/api/qotd';
const lorem = 'https://picsum.photos/200/300';
const fact = 'https://uselessfacts.jsph.pl/random.json?language=en';
const ruQuote = "https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=ru"



const port = process.env.PORT;
const app = express();
const bot = new TelegramBot(process.env.BOT_API, { webHook: true });

bot.setWebHook('https://funbot-g4zd.onrender.com/secretPathForWebHook');

app.use(express.json());
app.get('/secretPathForWebHook', (req, res) => {
    res.send('bot work');
});
app.listen(port, () => {
    console.log(`server wor on http://localhost:${port}`);
});

bot.setMyCommands([
    { command: 'start', description: 'Все команды' },
    { command: 'randomphoto', description: 'Случайное фото 🖼️' },
    { command: 'cat', description: 'Фото котика 🐱' },
    { command: 'dog', description: 'Фото собаки 🐶' },
    { command: 'joke', description: 'Расскажи шутку 😂' },
    { command: 'quote', description: 'Цитата мудрости 📜' },
    { command: 'fact', description: 'Случайный факт 😱' },
    {command: 'ruquote', description: 'Цитата на руском языке'}
]);

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'All commands \n/Dog -- create a Dog photo\n/Cat -- create a Cat photo\n/Joke -- create a Joke\n')
});

bot.onText(/\/fact/, async (msg) => {
    const chatId = msg.chat.id;
    const res = await fetch(fact);
    if (!res.ok) {
        bot.sendMessage('Fact not found');
        return;
    }
    const data = await res.json();
    await bot.sendMessage(chatId, `Fact: ${data.text}`);
})
bot.onText(/\/ruquote/,async (msg) => {
    try{
        const chatId = msg.chat.id;
        const res = await fetch(ruQuote);
        if(!res.ok){
            bot.sendMessage('Цитата не тайдена');
            return;
        }
        const data = await res.json();
        const text = `${data.quoteAuthor}:\n-${data.quoteText}`;
        bot.sendMessage(chatId,text);
    }catch(err){
        console.log(err);
    }
})
bot.onText(/\/quote/, async (msg) => {
    const chatId = msg.chat.id;

    try {
        const res = await fetch(quot);
        if (!res.ok) {
            await bot.sendMessage(chatId, '❌ Не удалось получить цитату.');
            return;
        }

        const data = await res.json();
        console.log(data);
        
        const quote = `${data.quote.author}:\n— ${data.quote.body}`;

        await bot.sendMessage(chatId, quote);

    } catch (error) {
        console.error('Ошибка при получении цитаты:', error);
        await bot.sendMessage(chatId, '⚠️ Ошибка при получении цитаты.');
    }
});
bot.onText(/\/randomphoto/, async (msg) => {
    try {
        const chatId = msg.chat.id;
        const res = await fetch(lorem);
        if (!res.ok) {
            await bot.sendMessage(chatId, 'Error');
            return;
        }
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        bot.sendPhoto(chatId, buffer, {
            caption: 'Рандомное фото 🖼'
        });
    } catch (err) {
        console.log(err);
    }
})
bot.onText(/\/dog/, async (msg) => {
    try {
        const chatId = msg.chat.id;
        const res = await fetch(anyDog);
        if (!res.ok) {
            await bot.sendMessage('Error');
            return;
        }
        const data = await res.json();
        const imgUrl = data.message;

        const imageRes = await fetch(imgUrl);
        const arrayBuffer = await imageRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        bot.sendPhoto(chatId, buffer, {
            caption: "Собачкааа!!! 🐶"
        })
    } catch (err) {
        console.log(err);
    }
})
bot.onText(/\/cat/, async (msg) => {
    try {
        const chatId = msg.chat.id;
        const res = await fetch(anyCat);
        if (!res.ok) {
            await bot.sendMessage('Error');
            return;
        }
        const data = await res.json();
        const imgUrl = data[0].url;
        const imageRes = await fetch(imgUrl);
        const arrayBuffer = await imageRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        bot.sendPhoto(chatId, buffer, {
            caption: "Кошка 🐱"
        })
    } catch (err) {
        console.log(err);
    }
})
bot.onText(/\/joke/, async (msg) => {
    try {
        const chatId = msg.chat.id;
        const res = await fetch(anyJoke);

        if (!res.ok) {
            bot.sendMessage(chatId, 'Не удалось получить шутку 🤷‍♂️');
            return;
        }
        const data = await res.json();
        if (data.type === 'single') {
            await bot.sendMessage(chatId, `😂 ${data.joke}`);
        } else {
            await bot.sendMessage(chatId, `🤣 ${data.setup}\n\n👉 ${data.delivery}`);
        }
    } catch (err) {
        console.log(err);
    }
});