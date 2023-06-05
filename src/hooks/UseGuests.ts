import { useState, useEffect } from 'react';
import { IPagedResult, IUser } from '@pnp/graph/presets/all';
import { IGuestUser, IGuestUserSelects } from '../models/IGuestUser';
import * as React from 'react';
import { ApplicationContext } from '../util/ApplicationContext';

export default function useGuests() {
    const [value, setValue] = useState<IGuestUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { Graph, GraphProvider } = React.useContext(ApplicationContext);


    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const users = await GraphProvider.GetGuests((partial) => setValue(partial));
            setValue(users);
            setIsLoading(false);
        }

        fetchData();
    }, []);

    return {
        Guests: value, isLoading
    };
}