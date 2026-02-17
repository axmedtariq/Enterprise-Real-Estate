'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { useEffect } from 'react';
import { useAppDispatch } from './hooks';
import { loadUser } from './slices/authSlice';

function AuthLoader({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);
    return <>{children}</>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <AuthLoader>
                {children}
            </AuthLoader>
        </Provider>
    );
}
