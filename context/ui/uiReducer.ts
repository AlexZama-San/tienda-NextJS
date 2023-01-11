import { UiState } from './UiProvider';

type UiActionType = 
| {type: 'Ui_ToggleMenu'} 

export const uiReducer = (state: UiState, action: UiActionType): UiState => {

    switch (action.type) {
        case 'Ui_ToggleMenu':
            return { ...state, isMenuOpen: !state.isMenuOpen };
        default:
            return state;
    }

}