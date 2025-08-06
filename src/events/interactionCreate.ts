import commands from '../commands/index.js'
import bot from '../bot.js'

import { commandOptionsParser, InteractionTypes } from '@discordeno/bot'

export const event: typeof bot.events.interactionCreate = async (interaction: any) => {
    if (interaction.type === InteractionTypes.ApplicationCommand) {
        if (!interaction.data) return

        const command = commands.get(interaction.data.name)
        if (!command) return

        await command.execute(interaction, commandOptionsParser(interaction))
    }
}