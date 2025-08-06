import commands from '../commands/index.js'
import bot from '../bot.js'

import { commandOptionsParser, InteractionTypes } from '@discordeno/bot'
import { Logger } from '../logger.js'

const logger = Logger.getLogger(["events", "interactionCreate"])

export const event: typeof bot.events.interactionCreate = async (interaction: any) => {
    if (interaction.type === InteractionTypes.ApplicationCommand) {
        if (!interaction.data) return

        const command = commands.get(interaction.data.name)
        if (!command) return

        try {
            await command.execute(interaction, commandOptionsParser(interaction));
        } catch (e) {
            logger.error(`Error executing command ${command.name}: ${e}`);
            interaction.respond({ content: "An error occurred while executing the command." });
        }
    }
}