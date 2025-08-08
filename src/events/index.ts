import type bot from '../bot.js';
import { event as interactionCreateEvent } from './interactionCreate.js';
import { event as messageCreateEvent } from './messageCreate.js';

export const events = {
  interactionCreate: interactionCreateEvent,
  messageCreate: messageCreateEvent,
} as typeof bot.events;

export default events;