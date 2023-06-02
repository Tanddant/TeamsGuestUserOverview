import * as React from 'react';

import { Checkbox, IColumn, Icon, Persona, PersonaSize, Toggle } from '@fluentui/react'
import { IGuestUser } from '../../../models/IGuestUser';
import { ExternalUserState } from '../../../enums/ExternalUserState';


const DefaultColumnn: (key: string) => IColumn = (key: string) => ({ key: key, fieldName: key, name: key, minWidth: 125, isResizable: true });
const renderIcon = (iconName: string) => <Icon styles={{ root: { fontSize: 20 } }} iconName={iconName} />

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
    },
    {
        ...DefaultColumnn("createdDateTime"),
        name: "Created",
        onRender: (item: IGuestUser) => item.createdDateTime.toLocaleString()
    },
    {
        ...DefaultColumnn("lastSignInDateTime"),
        name: "Last sign in",
        onRender: (item: IGuestUser) => item.signInActivity ? item.signInActivity.lastSignInDateTime.toLocaleString() : "N/A"
    },
    
]