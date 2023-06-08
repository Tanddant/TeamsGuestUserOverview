import { GraphFI, GraphQueryable, IPagedResult, graphGet } from "@pnp/graph";
import { IGuestUser, IGuestUserSelects } from "../models/IGuestUser";
import { IUser, IUserSelects } from "../models/IUser";
import { IGroup, IGroupSelects } from "../models/IGroup";
import { ParseIUser, ParseIUsers } from "../util/GraphModelHepers";
import { ISignInEntry, ISignInEntryResponse, ParseSignInEntry } from "../models/ISignInEntry";
import { BaseComponentContext } from "@microsoft/sp-component-base";
import { AadHttpClient, MSGraphClientV3 } from "@microsoft/sp-http";

export interface IGraphProvider {
    UpdateIUser(user: any): Promise<void>;
    GetGuests(partialResults?: (partial: IGuestUser[]) => void): Promise<IGuestUser[]>;
    GetUserById(Id: string): Promise<IUser>;
    ResendInvitationByUserId(Id: string): Promise<string>;
    SetAccountStateForUserById(Id: string, AccountState: boolean): Promise<void>;
    GetGroupMembershipsByUserId(Id: string, partialResults?: (partial: IGroup[]) => void): Promise<IGroup[]>;
    GetSignInHistoryByUserId(Id: string): Promise<ISignInEntry[]>;
}

export class GraphProvider implements IGraphProvider {
    private Graph: GraphFI;
    private Context: BaseComponentContext;
    private MSGraphClient: MSGraphClientV3;

    private async Get_Raw_Client(): Promise<MSGraphClientV3> {
        if (this.MSGraphClient == null)
            this.MSGraphClient = await this.Context.msGraphClientFactory.getClient("3");
        return this.MSGraphClient;
    }

    constructor(Graph: GraphFI, Context: BaseComponentContext) {
        this.Graph = Graph;
        this.Context = Context;
    }


    public async UpdateIUser(user: IUser): Promise<void>{
        try {
            const result = await this.Graph.users.getById(user.id).update({
                givenName: user?.givenName,
                surname: user?.surname,
                displayName: user?.displayName,
                jobTitle: user?.jobTitle == '' ? null : user?.jobTitle,
                department: user?.department,
                officeLocation: user?.officeLocation,
                businessPhones: user?.businessPhones,
                faxNumber: user?.faxNumber,
                mobilePhone: user?.mobilePhone,
                streetAddress: user?.streetAddress,
                city: user?.city,
                state: user?.state,
                postalCode: user?.postalCode,
                country: user?.country
            });
        } catch (e) {
            alert(e.message)
            throw e;
        }
    }

    public async GetGuests(partialResults?: (partial: IGuestUser[]) => void): Promise<IGuestUser[]> {
        try {
            const result = await this.getAllPagedResults(this.Graph.users.select(...IGuestUserSelects).filter("userType eq 'Guest'").orderBy("displayName").top(100).paged(), (users) => {
                partialResults(ParseIUsers(users as IGuestUser[]))
            })

            return ParseIUsers(result as IGuestUser[]);

        } catch (e) {
            alert(e.message)
            throw e;
        }
    }

    public async GetUserById(Id: string): Promise<IUser> {
        try {
            const user: IUser = await this.Graph.users.getById(Id).select(...IUserSelects)();

            return ParseIUser(user) as IUser;
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

    public async GetGroupMembershipsByUserId(Id: string, partialResults?: (partial: IGroup[]) => void): Promise<IGroup[]> {
        try {
            let groups = await this.getAllPagedResults(this.Graph.users.getById(Id).transitiveMemberOf.top(100).select(...IGroupSelects).paged(), partialResults);
            return groups;
        } catch (e) {
            alert(e.message)
            throw e;
        }
    }

    public async GetSignInHistoryByUserId(Id: string): Promise<ISignInEntry[]> {
        const client = await this.Get_Raw_Client();
        const search = new URLSearchParams();
        search.append("$filter", "userId eq '" + Id + "'and isInteractive eq true");
        search.append("$orderby", "createdDateTime desc");
        search.append("$top", "100");

        try {
            const res: ISignInEntryResponse = await client.api("/auditLogs/signIns?" + search.toString()).get();
            return res.value.map((entry) => ParseSignInEntry(entry));
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