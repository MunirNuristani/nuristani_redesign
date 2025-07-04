"use client"
import { createContext, useContext, useReducer, useEffect, ReactNode, Dispatch } from 'react';
import { AppReducer, initialState, AppState, AppAction } from './Reducer';

interface AppContextType {
    state: AppState;
    dispatch: Dispatch<AppAction>;
}

const ReducerContext = createContext<AppContextType | undefined>(undefined);

interface ReducerWrapperProps {
    children: ReactNode;
}

export function ReducerWrapper({ children }: ReducerWrapperProps) {
    const [state, dispatch] = useReducer(AppReducer, initialState);
    
    // Initialize client state on mount
    useEffect(() => {
        dispatch({ type: "SET_CLIENT" });
    }, []);
        
    return (
        <ReducerContext.Provider value={{ state, dispatch }}>
            {children}
        </ReducerContext.Provider>
    );
}

export function useAppContext(): AppContextType {
    const context = useContext(ReducerContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within a ReducerWrapper');
    }
    return context;
}