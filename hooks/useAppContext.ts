

import { useContext } from 'react';
import { AppStateContext, AppActionsContext } from '../context/AppContext';

export const useAppState = () => {
    const context = useContext(AppStateContext);
    if (context === undefined) {
        throw new Error('useAppState must be used within an AppContextProvider');
    }
    return context;
};

export const useAppActions = () => {
    const context = useContext(AppActionsContext);
    if (context === undefined) {
        throw new Error('useAppActions must be used within an AppContextProvider');
    }
    return context;
};
