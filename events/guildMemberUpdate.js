const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'guildMemberUpdate',
    execute(oldMember, newMember, client) {
        if (oldMember.user.bot) return;
        /*
        console.log("\nGuild Member 1")
        console.log(oldMember)
        console.log("NYAAAAAAAAAAAAAAAAAAAAA")
        console.log(newMember)
        console.log("Guild Member 2\n")
        */
        if (oldMember.pending && !newMember.pending) {
            if( client.settings.get(newMember.guild.id, "welcomeRoles") ) {
                let ro = client.settings.get(newMember.guild.id, "welcomeRoles");
                for (let i = 0; i < ro.length; i++) {
                    try{
                        let role = newMember.guild.roles.cache.find(r => r.name == ro[i])
                        newMember.roles.add(role)
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
        }
        const memberUpdateLogs = client.settings.get(oldMember.guild.id, "memberUpdateLogs");
		if(memberUpdateLogs) { 
            const embed = new EmbedBuilder()
                .setColor('#FFFF00')
                .setTitle('Member update has been detected')
                .setDescription(`${oldMember.user.tag} (${newMember.nickname?newMember.nickname:newMember.user.tag}) has been updated`)
                .setFooter({text: `User ID: ${oldMember.user.id}`})
                .setTimestamp()
            if (oldMember.nickname !== newMember.nickname) { embed.addFields( { name: 'Server Nickname', value: `${oldMember.nickname?oldMember.nickname:"-"} => ${newMember.nickname?newMember.nickname:"-"}` } ) }
            if (oldMember.avatarURL() !== newMember.avatarURL()) { 
                embed.addFields( { name: 'Server Avatar', value: `Old: ${oldMember.avatarURL()?oldMember.avatarURL():"-"} => \nNew: ${newMember.avatarURL()?newMember.avatarURL():"-"}` } ) 
                embed.setThumbnail(oldMember.avatarURL())
                embed.setImage(newMember.avatarURL())
            }
            //to test
            if (oldMember.premiumSinceTimestamp !== newMember.premiumSinceTimestamp) { 
                embed.addFields( { name: 'Premium removed: ', value: `${oldMember.premiumSince ? oldMember.premiumSince : "-"} => ${newMember.premiumSince ? newMember.premiumSince : "-"}` } ) 
            }
            try {
                if (client.channels.cache.get(client.settings.get(oldMember.guild.id, "moderationChannel"))) {channel = client.channels.cache.get(client.settings.get(oldMember.guild.id, "moderationChannel"))} else {channel = oldMember.guild.systemChannel}
                channel.send({embeds: [embed]})
            } catch (error) { 
                console.log(error)
                console.log(`[${new Date().toLocaleString('hu-HU')}] `+ "guildMemberUpdate no channel:"+err.name) 
            }
        }
    }
};