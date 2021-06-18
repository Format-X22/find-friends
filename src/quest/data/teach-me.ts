import { QuestDefinition } from '../quest.schema';
import { ECharacterOptions } from '../../game/options.scenario';

export const TeachMe: QuestDefinition = {
    humanId: 'TeachMe',
    name: 'Научи меня',
    characters: [ECharacterOptions.FULL_INTELLIGENCE, ECharacterOptions.MORE_INTELLIGENCE, ECharacterOptions.BALANCE],
    textUrl: '', // TODO -
};
