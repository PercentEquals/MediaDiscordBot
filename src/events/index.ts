import type bot from '../bot.js';
import { event as interactionCreateEvent } from './interactionCreate.js';

export const events = {
  interactionCreate: interactionCreateEvent,
} as typeof bot.events;

export default events;