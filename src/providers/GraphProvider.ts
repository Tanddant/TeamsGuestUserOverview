import { GraphFI, IPagedResult } from "@pnp/graph";
import { IGuestUser, IGuestUserSelects } from "../models/IGuestUser";
import { IUser, IUserSelects } from "../models/IUser";

export interface IGraphProvider {
    GetGuests(partialResults: (partial?: IGuestUser[]) => void): Promise<IGuestUser[]>;
    GetUserById(Id: string): Promise<IUser>;
    ResendInvitationByUserId(Id: string): Promise<string>;
    SetAccountStateForUserById(Id: string, AccountState: boolean): Promise<void>;
}

export class GraphProvider implements IGraphProvider {
    private Graph: GraphFI;

    constructor(Graph: GraphFI) {
        this.Graph = Graph;
    }

    public async GetGuests(partialResults: (partial?: IGuestUser[]) => void): Promise<IGuestUser[]> {
        let users: IGuestUser[] = [];
        let result: IPagedResult = null;
        try {
            do {
                if (result == null) {
                    result = await this.Graph.users.select(...IGuestUserSelects).filter("userType eq 'Guest'").top(100).paged();
                } else {
                    result = await result.next();
                }

                for (let user of result.value) {
                    user.createdDateTime = new Date(user.createdDateTime as any as string);
                    if (user.signInActivity != null)
                        user.signInActivity.lastSignInDateTime = new Date(user.signInActivity.lastSignInDateTime as any as string);

                    if(user.externalUserStateChangeDateTime != null)
                        user.externalUserStateChangeDateTime = new Date(user.externalUserStateChangeDateTime as any as string);

                    if(user.lastPasswordChangeDateTime != null)
                        user.lastPasswordChangeDateTime = new Date(user.lastPasswordChangeDateTime as any as string);
                }

                users = users.concat(result.value);
                if (partialResults != null)
                    partialResults(users);
            } while (result.hasNext);
        } catch (e) {
            alert(e.message)
            throw e;
        }

        return users;
    }
   
    public async GetUserById(Id: string): Promise<IUser> {
        try {
            const user: IUser = await this.Graph.users.getById(Id).select(...IUserSelects)();
            user.createdDateTime = new Date(user.createdDateTime as any as string);
            if (user.signInActivity != null)
                user.signInActivity.lastSignInDateTime = new Date(user.signInActivity.lastSignInDateTime as any as string);

            if(user.externalUserStateChangeDateTime != null)
                user.externalUserStateChangeDateTime = new Date(user.externalUserStateChangeDateTime as any as string);

            if(user.lastPasswordChangeDateTime != null)
                user.lastPasswordChangeDateTime = new Date(user.lastPasswordChangeDateTime as any as string);

            return user;
        } catch (e) {
            alert(e.message)
            throw e;
        }


    }

    public async ResendInvitationByUserId(Id: string): Promise<string> {
        const user = await this.GetUserById(Id);
        try {
            const result = await this.Graph.invitations.create(user.mail, "https://myapplications.microsoft.com/")
            return result.data.inviteRedeemUrl;
        } catch (e) {
            alert(e.message)
            throw e;
        }
    }

    public async SetAccountStateForUserById(Id: string, AccountState: boolean): Promise<void> {
        try{
            await this.Graph.users.getById(Id).update({
                accountEnabled: AccountState
            });
        } catch (e) {
            alert(e.message)
            throw e;
        }
    }

}