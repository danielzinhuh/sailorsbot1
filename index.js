const Discord = require('discord.js');
const client = new Discord.Client({
    messageCacheMaxSize: 100,
    fetchAllMembers: true,
    disabledEvents: [
        "TYPING_START",
        "VOICE_STATE_UPDATE"
    ],
    messageCacheLifetime: 120,
    messageSweepInterval: 120
});
const chalk = require('chalk');

const config = require('./config.json');
const OwnersList = config.permitidos;
const prefix = config.prefix;

client.on('ready', () => {
    console.log(`[TL Div 1.0] Acabei de logar nesta conta: ${client.user.tag}.`);
    console.log(`[TL Div 1.0] Estou seduzindo em ${client.guilds.size} servidores.`);
    console.log(`[TL Div 1.0] Com ${client.users.filter(m => m.presence.status !== 'offline').size} onlines e ${client.users.filter(m => m.presence.status === 'offline').size} offlines.`);
});

client.on('message', async message => {
    if(message.author.bot) return;
    if(!(OwnersList.includes(message.author.id))) return;

    messageArray = message.content.split(" ");
    command = messageArray[0];
    args = messageArray.slice(1);

    if(command === prefix + 'reiniciar') {
        async function esperar() {
            await message.reply(`**Estou reiniciando, volto já.. até.**`);
            process.exit();
        }
        esperar();
    }

    if(command === prefix + 'status') {
        let todos = client.users.filter(user => user.presence.status !== 'offline');
        let offline = client.users;
        message.reply(`**Nesse momento temos:**\n**${todos.size} pessoas online**\n**${offline.size - todos.size} pessoas offline**\n**${client.guilds.size} servidores.**`);
    }

    if(command === prefix + 'anunciar') {
        enviados = [];
        falhos = [];
        if(args.length < 1)
            return message.reply("**Coloque o comando corretamente, nesse formato:** `prefix!anunciar <Mensagem>`.");
        let todos = client.users.filter(user => user.presence.status !== 'offline');
        message.reply(`**Oi amor, você me fez um pedido e agora estou seduzindo ${todos.size} pessoas para serem meus novos amores!**`);
        
        todos.forEach(user => {
            async function enviar() {
                await user.send(args.join(" ")).catch(erro => {
                    if(erro) {
                        falhos.push(user.id);
                    }
                });
                enviados.push(user.id);
                contador(enviados, falhos);
            }
            enviar();
        });
    }

    if(command === prefix + 'anunciarall') {
        enviados = [];
        falhos = [];
        if(args.length < 1)
            return message.reply("**Coloque o comando corretamente, nesse formato:** `prefix!anunciarall <Mensagem>`.");
        let onlines = client.users.filter(user => user.presence.status === 'online');
        let ocupado = client.users.filter(user => user.presence.status === 'dnd');
        let ausente = client.users.filter(user => user.presence.status === 'idle');
        let offline = client.users.filter(user => user.presence.status === 'offline');
        soma = onlines.size + ocupado.size + ausente.size + offline.size;
        message.reply(`**Oi amor, você me fez um pedido e agora estou seduzindo ${soma} pessoas para serem meus novos amores!**`);
        
        enviar(onlines, falhos, enviados);
        enviar(ocupado, falhos, enviados);
        enviar(ausente, falhos, enviados);
        enviar(offline, falhos, enviados);
    }
});

function contador(enviados, falha) { 
    console.clear();
    text = "";
    text += chalk.green(`Enviados: ${enviados.length - falha.length}`);
    text += chalk.blue(' | ');
    text += chalk.yellow(`Falha: ${falha.length}`);
    title = `[TLDiv 1.0] By O DANi | Enviados: ${enviados.length - falha.length} | Falha: ${falha.length}`;
    console.log(text);
    process.title = title;
}

function enviar(array, falhos, enviados) {
    array.forEach(user => {
        async function enviar() {
            await user.send(args.join(" ")).catch(erro => {
                if(erro) {
                    falhos.push(user.id);
                }
            });
            enviados.push(user.id);
            contador(enviados, falhos);
        }
        enviar();
    });
}


client.login(config.Token).catch(erro => {
    if(erro.message === 'Incorrect login details were provided.')
        return console.log('[TLDIV1.0] O Token inserido na "config.json" está inválido!');
});
