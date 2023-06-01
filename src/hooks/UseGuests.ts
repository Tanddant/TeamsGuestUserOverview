import { useState, useEffect } from 'react';
import { IPagedResult, IUser } from '@pnp/graph/presets/all';
import { IGuestUser, IGuestUserSelects } from '../models/IGuestUser';
import * as React from 'react';
import { ApplicationContext } from '../util/ApplicationContext';

export default function useGuests() {
    const [value, setValue] = useState<IGuestUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { Graph } = React.useContext(ApplicationContext);


    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            let users: IGuestUser[] = [];
            let result: IPagedResult = null;
            do {
                if (result == null) {
                    result = await Graph.users.select(...IGuestUserSelects).filter("userType eq 'Guest'").top(100).paged();
                } else {
                    result = await result.next();
                }

                result.value.forEach((user: IGuestUser) => {
                    user.createdDateTime = new Date(user.createdDateTime as any as string);
                    if (user.signInActivity != null)
                        user.signInActivity.lastSignInDateTime = new Date(user.signInActivity.lastSignInDateTime as any as string);
                });

                users = users.concat(result.value);
                setValue(users);
            } while (result.hasNext);
            setValue(users);
            setIsLoading(false);
        }

        fetchData();
    }, []);

    return {
        Guests: value, isLoading
    };
}