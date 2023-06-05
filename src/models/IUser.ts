import { ExternalUserState } from "../enums/ExternalUserState";

export interface IUser {
    accountEnabled: boolean;
    id: string;
    displayName: string;
    createdDateTime: Date;
    externalUserState: ExternalUserState;
    mail: string;
    userPrincipalName: string;
    externalUserStateChangeDateTime: Date;
    lastPasswordChangeDateTime: Date;
    signInActivity?: {
        lastSignInDateTime: Date;
    }
}

export const IUserSelects = ["accountEnabled", "id", "displayName", "createdDateTime", "externalUserState", "mail", "userPrincipalName", "signInActivity", "externalUserStateChangeDateTime", "lastPasswordChangeDateTime"]
