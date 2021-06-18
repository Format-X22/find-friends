import { QuestDefinition } from '../quest.schema';
import { ECharacterOptions } from '../../game/options.scenario';

export const RandomBar: QuestDefinition = {
    humanId: 'RandomBar',
    name: 'Рандом бар',
    characters: [ECharacterOptions.FULL_FUN, ECharacterOptions.MORE_FUN, ECharacterOptions.BALANCE],
    textUrl: '', // TODO -
};
