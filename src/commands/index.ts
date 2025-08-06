import type { CreateApplicationCommand } from '@discordeno/types';
import media from './media.ts';
import type { Interaction } from 'discordeno';

export type Command = CreateApplicationCommand & {
  execute(interaction: Interaction, args: Record<string, any>): Promise<any>
};

export const commands = new Map<string, Command>(
  [media].map(cmd => [cmd.name, cmd]),
)

export default commands;