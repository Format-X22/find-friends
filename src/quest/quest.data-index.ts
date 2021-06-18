import { QuestDefinition } from './quest.schema';
import { RandomBar } from './data/random-bar';
import { ReverseDating } from './data/reverse-dating';
import { TeachMe } from './data/teach-me';

export const quests: Array<QuestDefinition> = [RandomBar, ReverseDating, TeachMe];
