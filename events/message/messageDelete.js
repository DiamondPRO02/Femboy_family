const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ComponentType } = require("discord.js");
module.exports = {
	name: "messageDelete",
	async execute(message, client) {
		try {
			try {
				var i = 0;
				let channelBlacklist = client.settings.get(message.guild.id, "messageLogsBlacklistChannels");
				let roleBlacklist = client.settings.get(message.guild.id, "messageLogsBlacklistRoles");
				for (i = 0; i < channelBlacklist.length; i++) {
					if (message.channelId == channelBlacklist[i]) { return }
				}
				for (i = 0; i < roleBlacklist.length; i++) {
					if (message.member.roles.cache.has(roleBlacklist[i])) { return }
				}
			} catch { return }
			/*
			Console.log("Delete")
			console.log(message)
			console.log("Delete2")
			*/
			if (!message.guild) { return }
			try { if (message.author.bot) { return } } catch { return console.log("Bot and others are null, messageDelete, unchached message deleted?") }
			let c = client.channels.cache.get(message.channelId);
			const embed = new EmbedBuilder()
				.setColor("#FFFF00")
				.setDescription("Other info:");
			process.stdout.write(`[${new Date().toLocaleString("hu-HU")}] Message deleted in ${c.guild.name} <#${c.name}> (${message.author.username}) => "${message.content}"`);
			if (message.embeds.length) {
				process.stdout.write(" //Embed deleted//");
			}
			if (message.attachments.size) {
				process.stdout.write(" //Attachment deleted//");
				const sAttach = message.attachments.map(Attachment => Attachment.url);
				for (let i = 0; i < sAttach.length; i++) {
					const attachName = sAttach[i].split("/").pop();
					embed.addFields({ name: attachName, value: sAttach[i] });
				}
			}
			if (message.components.length) {
				process.stdout.write(" //Components deleted//");
			}
			if (message.stickers.size) {
				process.stdout.write(" //Stickers deleted//");
				const sStic = message.stickers.map(Stickers => Stickers.name).join(", ");
				embed.addFields({ name: "Sticker name:", value: sStic });
			}
			try {
				// Due to v14 Message_Delete type is now number 72
				let fetchedLogs = await message.guild.fetchAuditLogs({ limit: 1, type: 72 });
				let deletionLog = fetchedLogs.entries.first();
				if (!deletionLog) { return console.log(`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`) }
				// Now grab the user object of the person who deleted the message / Also grab the target of this action to double-check things
				let { executor, target } = deletionLog;
				// Update the output with a bit more information / Also run a check to make sure that the log returned was for the same author's message
				if (target.id === message.author.id) { console.log(` deleted by ${executor.tag}.`) }
				else { console.log(" deleted, but we don't know by who, probably themselves.") }

				let messageLogs = client.settings.get(message.guild.id, "messageLogs");
				if (messageLogs) {
					if (client.channels.cache.get(client.settings.get(message.guild.id, "moderationChannel"))) { channel = client.channels.cache.get(client.settings.get(message.guild.id, "moderationChannel")) } else { channel = message.guild.systemChannel }
					channel.send({
						content: `Message deleted in <#${message.channelId}> (${message.author.toString()}) => 
"${message.content}"`
							+ (deletionLog ? (target.id === message.author.id ? `\ndeleted by ${executor.tag}. ` : "\nWe don't know by who, probably themselves. ") : "\nNo relevant audit logs were found. ")
							+ "\n✅ detected: "
							+ (message.embeds.length ? "Embed " : "") + (message.attachments.size ? "Attachment " : "") + (message.components.length ? "Components " : "") + (message.stickers.size ? "Stickers " : "")
					});
					embed.data.fields ? channel.send({ embeds: [embed] }) : null;
				}
			} catch {
				console.log(`[${new Date().toLocaleString("hu-HU")}] messageDelete - Not enough permission for ${message.guild.name}. Continuing...`);
			}
		} catch (error) {
			console.log("message Delete Error");
			console.log(error);
		}
	}
};