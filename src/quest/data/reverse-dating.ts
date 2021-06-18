import { QuestDefinition } from '../quest.schema';
import { ECharacterOptions } from '../../game/options.scenario';

export const ReverseDating: QuestDefinition = {
    humanId: 'ReverseDating',
    name: 'Знакомство наоборот',
    characters: [
        ECharacterOptions.BALANCE,
        ECharacterOptions.MORE_FUN,
        ECharacterOptions.MORE_INTELLIGENCE,
        ECharacterOptions.FULL_INTELLIGENCE,
    ],
    textUrl: '', // TODO -
};
