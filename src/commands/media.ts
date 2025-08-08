import { ApplicationCommandOptionTypes } from '@discordeno/types'
import type { Command } from '.';
import { Logger } from '../logger';
import LinkProcessor from '../lib/link/LinkProcessor';
import performance from '../lib/performance/performance';
import { StoredCache } from '../lib/cache/StoredCache';
import { LinkUtils } from '../lib/link/LinkUtils';

const logger = Logger.getLogger(['commands', 'media']);

const media: Command = {
	name: 'media',
	description: 'Download media from an URL. Supported hosts are: Tiktok, YouTube, Twitter, Reddit, and Instagram.',
	async execute(interaction, args: MediaArgs) {
		logger.info(`Executing media command with args: ${args.get.url?.link ?? args.get.file?.name}`);

		interaction.defer();

		if (args.get.file) {
			const file = StoredCache.get(args.get.file.name);

			await interaction.respond({ files: [{
				name: args.get.file.name,
				blob: file,
			}] });
		} else if (args.get.url) {
			const linkProcessor = new LinkProcessor(args.get.url.link);
			const files = await performance(linkProcessor, linkProcessor.execute);

			await interaction.respond({ files: files.map((file) => {
                    return {
                        name: linkProcessor.id + '.' + LinkUtils.getExtensionFromFileType(file),
                        blob: file,
                    }
                })
			});
		}

		logger.info(`Successfully sent media for ${args.get.url?.link ?? args.get.file?.name}`);
	},
	options: [
		{
			name: 'get',
			description: 'Download file into discord channel.',
			type: ApplicationCommandOptionTypes.SubCommandGroup,
			options: [
				{
					name: 'url',
					description: 'Which url to download media from?',
					type: ApplicationCommandOptionTypes.SubCommand,
					options: [
						{
							name: "link",
							description: "Link to the file",
							type: ApplicationCommandOptionTypes.String,
							required: true
						}
					]
				},
				{
					name: 'file',
					description: 'Which stored file to sent?',
					type: ApplicationCommandOptionTypes.SubCommand,
					options: [
						{
							name: "name",
							description: "Name of the file",
							type: ApplicationCommandOptionTypes.String,
							required: true,
							choices: StoredCache.getAvailableFiles().map(file => ({ name: file, value: file }))
						}
					]
				}
			]
		}

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

export interface MediaArgs {
	get: {
		url?: {
			link: string;
		},
		file?: {
			name: string;
		};
	};
}

export default media;