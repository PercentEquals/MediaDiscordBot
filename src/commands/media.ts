import { ApplicationCommandOptionTypes } from '@discordeno/types'
import type { Command } from '.';
import { Logger } from '../logger';

const logger = Logger.getLogger(['commands', 'media']);

var trimEnd = function (buffer) {
    var pos = 0
    for (var i = buffer.length - 1; i >= 0; i--) {
        if (buffer[i] !== 0x00) {
            pos = i
            break
        }
    }
    return buffer.slice(0, pos + 1)
}

const media: Command = {
	name: 'media',
	description: 'Download media from an URL. Supported hosts are: Tiktok, YouTube, Twitter, Reddit, and Instagram.',
	async execute(interaction, args: MediaArgs) {
		interaction.defer();
		logger.info(`Executing media command with args: ${args.url}`);


		const startTime = performance.now();

		// save yt-dlp output to an in memory buffer
		// const buffer = Bun.file('./cache/yt-dlp-output.mp4');
		// buffer.write("");

		const buffer = Buffer.alloc(10 * 1024 * 1024); // 10 MB buffer

		const output = await Bun.$`./node_modules/ytdlp-nodejs/bin/yt-dlp.exe ${args.url} --extractor-args youtube:player_client=android,web --no-warnings --no-check-certificate --format mp4 -N 10 --downloader aria2c  --output - > ${buffer}`; // --downloader ffmpeg

		const blob = new Blob([trimEnd(buffer)], { type: 'video/mp4' });

		const endTime = performance.now();
		logger.info(`Media command executed in ${endTime - startTime}s`);

		interaction.respond({
			files: [{
				name: "test.mp4",
				blob: blob,
			}]
		});

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