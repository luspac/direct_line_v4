const { Bot, MemoryStorage, BotStateManager, CardStyler, MessageStyler, MessageFactory } = require('botbuilder');
const { BotFrameworkAdapter } = require('botbuilder-services');
const restify = require('restify');
const botbuilder_dialogs = require('botbuilder-dialogs');

// This loads the environment variables from the .env file
require('dotenv-extended').load();

// Create server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});

// Create adapter and listen to servers '/api/messages' route.
const adapter = new BotFrameworkAdapter({ 
    appId: process.env.MICROSOFT_APP_ID, 
    appPassword: process.env.MICROSOFT_APP_PASSWORD 
});
server.post('/api/messages', adapter.listen());

const instructions = 'Welcome to the Bot to showcase the DirectLine API. Send \'Show me a hero card\' or \'Send me a BotFramework image\' to see how the DirectLine client supports custom channel data. Any other message will be echoed.';

// Initialize bot by passing it adapter
const bot = new Bot(adapter)
.use(new MemoryStorage())
.use(new BotStateManager())
const dialogs = new botbuilder_dialogs.DialogSet();

bot.onReceive((context) => {
    if (context.request.type === 'message') {
        const text = (context.request.text || '').trim().toLowerCase()   

        switch(text){
            case 'show me a hero card':
                const message = MessageStyler.attachment(
                    CardStyler.heroCard(
                        'Sample Hero Card',   // cards title 
                        'Displayed in the DirectLine client' // cards text
                    )
                );
                context.reply(message);
                break;
            
            case 'send me a botframework image':
                const img = MessageStyler.contentUrl('https://reef-free.imgix.net/content/places/whitehaven-beach-39957.jpg?w=768&h=433&fit=crop&crop=center&auto=format', 'image/jpeg');
                context.reply(img)
                break;
            
            default:
                context.reply(`sorry I didnt get that`);
                break;
        }
    }

    // simply making one call instead of two
    if(context.request.type === 'conversationUpdate' && context.request.membersAdded[0].id === 'default-user'){
        context.reply(instructions);
    }
})




