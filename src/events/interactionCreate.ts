import commands from '../commands/index.js'
import bot from '../bot.js'

import { commandOptionsParser, InteractionTypes, type Interaction } from '@discordeno/bot'
import { Logger } from '../logger.js'

const logger = Logger.getLogger(["events", "interactionCreate"])

export const event: typeof bot.events.interactionCreate = async (interaction) => {
    if (interaction.type === InteractionTypes.ApplicationCommand) {
        if (!interaction.data) return

        const command = commands.get(interaction.data.name)
        if (!command) return

        try {
            await command.execute(interaction as unknown as Interaction, commandOptionsParser(interaction));
        } catch (e: any) {
            logger.error(`Error executing command ${command.name}: ${e}`);

            interaction.respond({ 
                embeds: [{
                    title: "An error occured while executing the command!",
                    type: 'rich',
                    description: e.message,
                    color: 0xDA3E44
                }],
            }, { isPrivate: true });
        }
    }
}