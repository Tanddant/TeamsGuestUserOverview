import * as React from 'react';
import { useState, useEffect } from 'react';
import { IUser, IUserSelects } from '../models/IUser';
import { ApplicationContext } from '../util/ApplicationContext';

export default function useUser(UserId: string) {
    const [user, setUser] = useState<IUser>(null);
    const { GraphProvider } = React.useContext(ApplicationContext);

    useEffect(() => {
        async function fetchData() {
            const user = await GraphProvider.GetUserById(UserId);
            setUser(user);
        }

        if (UserId != null) {
            fetchData();
        } else {
            setUser(null);
        }
    }, [UserId]);

    return {
        user, isLoading: user == null
    };
}