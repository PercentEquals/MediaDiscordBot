import { ApplicationCommandOptionTypes } from '@discordeno/types'
import type { Command } from '.';
import { Logger } from '../logger';
import LinkProcessor from '../lib/link/LinkProcessor';
import performance from '../lib/performance/performance';

const logger = Logger.getLogger(['commands', 'media']);

const media: Command = {
	name: 'media',
	description: 'Download media from an URL. Supported hosts are: Tiktok, YouTube, Twitter, Reddit, and Instagram.',
	async execute(interaction, args: MediaArgs) {
		logger.info(`Executing media command with args: ${args.url}`);

		interaction.defer();

		const linkProcessor = new LinkProcessor(args.url);
		const files = await performance(linkProcessor, linkProcessor.execute);

		await interaction.respond({ files });

		logger.info(`Successfully sent media for ${args.url}`);
	},
	options: [
		{
			name: 'url',
			description: 'Which url to download media from?',
			type: ApplicationCommandOptionTypes.String,
			required: true,
		},
		// {
		// 	name: 'emoji',
		// 	description: "What would you like to set as this button's emoji?",
		// 	type: ApplicationCommandOptionTypes.String,
		// 	required: true,
		// },
		// {
		// 	name: 'color',
		// 	description:
		// 		"What color would you like to set as this button's color?",
		// 	type: ApplicationCommandOptionTypes.Integer,
		// 	required: true,
		// 	choices: [
		// 		{ name: 'Blue', value: ButtonStyles.Primary },
		// 		{ name: 'Green', value: ButtonStyles.Success },
		// 		{ name: 'Grey', value: ButtonStyles.Secondary },
		// 		{ name: 'Red', value: ButtonStyles.Danger },
		// 	],
		// },
		// {
		// 	name: 'label',
		// 	description:
		// 		'What would you like to set for the name on this button?',
		// 	type: ApplicationCommandOptionTypes.String,
		// },
	]
}

interface MediaArgs {
	url: string;
}

export default media;