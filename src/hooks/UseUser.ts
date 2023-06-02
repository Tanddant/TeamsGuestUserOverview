import * as React from 'react';
import { useState, useEffect } from 'react';
import { IUser, IUserSelects } from '../models/IUser';
import { ApplicationContext } from '../util/ApplicationContext';

export default function useUser(UserId: string) {
    const [user, setUser] = useState<IUser>(null);
    const { Graph } = React.useContext(ApplicationContext);

    useEffect(() => {
        async function fetchData() {
            const user: IUser = await Graph.users.getById(UserId).select(...IUserSelects)();
            user.createdDateTime = new Date(user.createdDateTime as any as string);
            if (user.signInActivity != null)
                user.signInActivity.lastSignInDateTime = new Date(user.signInActivity.lastSignInDateTime as any as string);

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