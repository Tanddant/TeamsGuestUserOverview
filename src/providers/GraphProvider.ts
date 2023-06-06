import { GraphFI, IPagedResult } from "@pnp/graph";
import { IGuestUser, IGuestUserSelects } from "../models/IGuestUser";
import { IUser, IUserSelects } from "../models/IUser";
import { IGroup, IGroupSelects } from "../models/IGroup";
import { ParseIUser, ParseIUsers } from "../util/GraphModelHepers";

export interface IGraphProvider {
    GetGuests(partialResults?: (partial: IGuestUser[]) => void): Promise<IGuestUser[]>;
    GetUserById(Id: string): Promise<IGuestUser>;
    ResendInvitationByUserId(Id: string): Promise<string>;
    SetAccountStateForUserById(Id: string, AccountState: boolean): Promise<void>;
    GetGroupMembershipsByUserId(Id: string, partialResults?: (partial: IGuestUser[]) => void): Promise<IGroup[]>;
}

export class GraphProvider implements IGraphProvider {
    private Graph: GraphFI;

    constructor(Graph: GraphFI) {
        this.Graph = Graph;
    }

    public async GetGuests(partialResults?: (partial: IGuestUser[]) => void): Promise<IGuestUser[]> {
        const result = await this.getAllPagedResults(this.Graph.users.select(...IGuestUserSelects).filter("userType eq 'Guest'").top(100).paged(), (users) => {
            partialResults(ParseIUsers(users as IGuestUser[]))
        })

        return ParseIUsers(result as IGuestUser[]);
    }

    public async GetUserById(Id: string): Promise<IGuestUser> {
        try {
            const user: IGuestUser = await this.Graph.users.getById(Id).select(...IUserSelects)();

            return ParseIUser(user);
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
        try {
            await this.Graph.users.getById(Id).update({
                accountEnabled: AccountState
            });
        } catch (e) {
            alert(e.message)
            throw e;
        }
    }

    public async GetGroupMembershipsByUserId(Id: string, partialResults?: (partial: IGuestUser[]) => void): Promise<IGroup[]> {
        try {
            let groups = await this.getAllPagedResults(this.Graph.users.getById(Id).transitiveMemberOf.top(10).select(...IGroupSelects).paged(), partialResults);
            return groups;
        } catch (e) {
            alert(e.message)
            throw e;
        }
    }

    private async getAllPagedResults<T>(request: Promise<IPagedResult>, partialResults?: (partialResults: T[]) => void): Promise<T[]> {
        let items: T[] = [];
        let result: IPagedResult;
        try {
            do {
                if (result == null) {
                    result = await request;
                } else {
                    result = await result.next();
                }

                items = items.concat(result.value);
                if (partialResults != null)
                    partialResults(items);
            } while (result.hasNext);

        } catch (e) {
            alert(e.message)
            throw e;
        }
        return items;
    }
}