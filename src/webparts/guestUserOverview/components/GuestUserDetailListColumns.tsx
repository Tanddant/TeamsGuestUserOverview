import * as React from 'react';

import { Checkbox, IColumn, Icon, Persona, PersonaSize, Toggle } from '@fluentui/react'
import { IGuestUser } from '../../../models/IGuestUser';
import { ExternalUserState } from '../../../enums/ExternalUserState';
import { DefaultColumnn } from '../../../util/TableHelpers';
import { PrettyDate } from './GuestUserPanel/PrettyDate/PrettyDate';
import { datediff } from '../../../util/DateHelpers';

enum Colors {
    Red = "#f7665e",
    Yellow = "#f7f29b",
    Green = "#bbdabb",
    Orange = "#f2c293"
}

const renderIcon = (iconName: string) => <Icon styles={{ root: { fontSize: 20 } }} iconName={iconName} />
const getLastSignInColorCode: (date: Date) => string = (date: Date) => {
    if (date == null) return Colors.Orange;
    const diff = datediff(date, new Date());
    if (diff > 90) return Colors.Red;
    if (diff > 30) return Colors.Yellow;
    return Colors.Green;
}

export interface IPillProps { color: string }

export const Pill: React.FunctionComponent<IPillProps> = (props: React.PropsWithChildren<IPillProps>) => {
    return (
        <div style={{ backgroundColor: props.color, height: "100%", borderRadius: "25px", width: "100%", textAlign: 'center', display: 'grid', placeItems: "center" }}>
            {props.children}
        </div>
    );
};

export const GuestUserDetailListColumns: IColumn[] = [
    {
        ...DefaultColumnn("accountEnabled"),
        name: "Enabled",
        minWidth: 60,
        maxWidth: 60,
        onRender: (item: IGuestUser) => item.accountEnabled ? renderIcon("Contact") : renderIcon("BlockContact")
    },
    {
        ...DefaultColumnn("externalUserState"),
        name: "Invite status",
        minWidth: 60,
        maxWidth: 85,
        onRender: (item: IGuestUser) => {
            let icon: string = "MailAlert";
            switch (item.externalUserState as ExternalUserState) {
                case ExternalUserState.PendingAcceptance:
                    icon = "MailForward";
                    break;
                case ExternalUserState.Accepted:
                    icon = "MailCheck";
                    break;
            }
            return renderIcon(icon);
        }
    },
    {
        ...DefaultColumnn("displayName"),
        name: "Name",
        minWidth: 250,
        onRender: (item: IGuestUser) => <Persona text={item.displayName} size={PersonaSize.size24} />
    },
    {
        ...DefaultColumnn("mail"),
        name: "Email",
        minWidth: 250,
    },
    {
        ...DefaultColumnn("createdDateTime"),
        name: "Created",
        onRender: (item: IGuestUser) => <PrettyDate date={item.createdDateTime} />
    },
    {
        ...DefaultColumnn("lastSignInDateTime"),
        name: "Last sign in",
        onRender: (item: IGuestUser) => <Pill color={getLastSignInColorCode(item.signInActivity?.lastSignInDateTime)}><PrettyDate date={item.signInActivity?.lastSignInDateTime} /></Pill>
    },
]

