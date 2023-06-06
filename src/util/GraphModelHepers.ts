import { IGuestUser } from "../models/IGuestUser";
import { IUser } from "../models/IUser";


export const ParseIUser: (user: IGuestUser | IUser) => IGuestUser = (user: IGuestUser | IUser) => {
    user.createdDateTime = new Date(user.createdDateTime as any as string);
    if (user.signInActivity != null)
        user.signInActivity.lastSignInDateTime = new Date(user.signInActivity.lastSignInDateTime as any as string);

    if (user.externalUserStateChangeDateTime != null)
        user.externalUserStateChangeDateTime = new Date(user.externalUserStateChangeDateTime as any as string);

    if (user.lastPasswordChangeDateTime != null)
        user.lastPasswordChangeDateTime = new Date(user.lastPasswordChangeDateTime as any as string);
    return user;
}
export const ParseIUsers: (users: IGuestUser[] | IUser[]) => IGuestUser[] | IUser[] = (users: IGuestUser[] | IUser[]) => { return users.map(ParseIUser) };