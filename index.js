console.log('')
console.log(' █████╗ ███████╗██████╗ ███████╗    ██╗      ██████╗  █████╗ ██████╗ ███████╗██████╗ ')
console.log('██╔══██╗██╔════╝██╔══██╗██╔════╝    ██║     ██╔═══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗')
console.log('███████║███████╗██████╔╝███████╗    ██║     ██║   ██║███████║██║  ██║█████╗  ██████╔╝')
console.log('██╔══██║╚════██║██╔═══╝ ╚════██║    ██║     ██║   ██║██╔══██║██║  ██║██╔══╝  ██╔══██╗')
console.log('██║  ██║███████║██║     ███████║    ███████╗╚██████╔╝██║  ██║██████╔╝███████╗██║  ██║')
console.log('╚═╝  ╚═╝╚══════╝╚═╝     ╚══════╝    ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚══════╝╚═╝  ╚═╝')
console.log('                                                                developer by allec_vn')
console.log('database check...')


web_key = '';
img_url = 'https://media.tenor.com/MM3La2Dx0c4AAAAC/onimai-cute-anime-girl-smile-smiling.gif';
admin_url = 'https://avatars.githubusercontent.com/u/147155395?v=4';
key_vip = '';
check1 = '';
namebot = 'ASPS';
user = 0;
channel = 0;
server = 0;
link = '';

const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ActivityType, REST, Routes } = require('discord.js');
const { clientId, token, host_sql, user_sql, pass_sql, database_sql } = require('./config.json');
const mysql = require('mysql2/promise');


const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    //GatewayIntentBits.GuildChannels,
] });

const db = mysql.createPool({
	host: host_sql,
	user: user_sql,
	password: pass_sql,
	database: database_sql
});


client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
client.cooldowns = new Collection();
const commands = [];

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] file ${filePath} ko có data`);
		}
	}
}
let status = [
	{ name: 'SMS SPAMER TOP 1' },
	{ name: 'Layer 4 upto 20gbps ddos',type: ActivityType.Watching },
	{ name: 'allec_vn',type: ActivityType.Listening },
	//{ name: `4 se`,type: ActivityType.Watching },
];
       
client.once(Events.ClientReady, () => {
	console.log('RUNNING');
	server = client.guilds.cache.size;
	user = client.users.cache.size;
	channell = client.channels.cache.size; 
	const channel = client.channels.cache.get('1154728901315145758');
   // channel.send('chi trang dau <@962218468986470410>');
	setInterval(deleteExpiredUsers, 1000);
	setInterval(() => {
		let random = Math.floor(Math.random() * status.length);
		client.user.setActivity(status[random]);
	}, 5000);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return;
	const { cooldowns } = client;
	if (!cooldowns.has(command.data.name)) {
		cooldowns.set(command.data.name, new Collection());
	}
	const now = Date.now();
	const timestamps = cooldowns.get(command.data.name);
	const defaultCooldownDuration = 3;
	const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;
	if (timestamps.has(interaction.user.id)) {
		const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

		if (now < expirationTime) {
			const expiredTimestamp = Math.round(expirationTime / 1000);
			return interaction.reply({ content: `hấp tấp dữ vậy cay web, server đó lắm à lệnh \`${command.data.name}\`. có thể sài lại sau <t:${expiredTimestamp}:R>.`, ephemeral: true });
		}
	}
	timestamps.set(interaction.user.id, now);
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
	
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'BOT đang bảo trì phần lệnh!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'BOT đang bảo trì phần lệnh!', ephemeral: true });
		}
	}
});
async function deleteExpiredUsers() {
	const currentTime = new Date();
  
	const connection = await db.getConnection();
	const [rows] = await connection.execute('SELECT users_id FROM users WHERE expire_time <= ?', [currentTime]);

	if (rows.length > 0) {
	  rows.forEach(async (row) => {
		const userId = `${rows[0].users_id}`;
		console.log(userId);
		await connection.execute('DELETE FROM users WHERE users_id = ?', [userId]);
		console.log(`delete thành công ID: ${userId}`);
	  });
	}
	connection.release();
  }

client.login(token);

