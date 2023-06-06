import { ActionButton, IPanel, IRefObject, Label, MessageBar, MessageBarType, Panel, PanelType, Persona, PersonaSize, Spinner, SpinnerSize, Stack, Text } from '@fluentui/react';
import * as React from 'react';
import useUser from '../../../../hooks/UseUser';
import { ExternalUserState } from '../../../../enums/ExternalUserState';
import { InvitationResender } from './NoInvitationAccepted/InvitationResender';
import { ApplicationContext } from '../../../../util/ApplicationContext';
import { GroupMemberships } from './GroupMemberships/GroupMemberships';
import { RecentSignIns } from './RecentSignIns/RecentSignIns';


const datediff = (first: Date, second: Date) => {
    return Math.round((second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
}

export interface IGuestUserPanelProps {
    UserId: string;
    OnClose: () => void;
}

export const GuestUserPanel: React.FunctionComponent<IGuestUserPanelProps> = (props: React.PropsWithChildren<IGuestUserPanelProps>) => {
    const { user, isLoading } = useUser(props.UserId);
    const { GraphProvider } = React.useContext(ApplicationContext);
    //Todo - get user details from Graph API (create useUser hook)

    return (
        <Panel
            isOpen={props.UserId != null}
            onDismiss={() => props.OnClose()}
            onDismissed={() => props.OnClose()}
            type={PanelType.medium}
        >

            {isLoading && <Spinner size={SpinnerSize.large} label={"Loading..."} />}

            {!isLoading &&
                <>
                    <Stack tokens={{ childrenGap: 5 }}>
                        {user.externalUserState == ExternalUserState.PendingAcceptance &&
                            <InvitationResender UserId={user.id} />
                        }

                        <Persona text={user.displayName} secondaryText={user.mail} size={PersonaSize.size72} />
                        <div style={{ display: 'flex' }}>
                            <ActionButton iconProps={{ iconName: user.accountEnabled ? "Contact" : "BlockContact" }}
                                text={user.accountEnabled ? "Block user" : "Unblock user"}
                                onClick={async () => { await GraphProvider.SetAccountStateForUserById(user.id, !user.accountEnabled); props.OnClose() }} />
                            <ActionButton iconProps={{ iconName: "Delete" }} text='Delete user' />
                            <ActionButton iconProps={{ iconName: "NavigateExternalInline" }} text='Open in Entra' target='_blank' href={`https://entra.microsoft.com/#view/Microsoft_AAD_UsersAndTenants/UserProfileMenuBlade/~/overview/userId/${user.id}`} />
                        </div>
                        <Stack>
                            <Text>Created {datediff(user.createdDateTime, new Date())} day(s) ago ({user.createdDateTime.toLocaleString()})</Text>
                            {user.signInActivity != null &&
                                <Text>Last sign on: {datediff(user.signInActivity.lastSignInDateTime, new Date())} day(s) ago ({user.signInActivity.lastSignInDateTime.toLocaleString()})</Text>
                            }

                            {user.signInActivity == null && <Text>No sign in activity</Text>}

                            {user.externalUserStateChangeDateTime != null && user.externalUserState == ExternalUserState.Accepted &&
                                <Text>Accepted invitation: {user.externalUserStateChangeDateTime.toLocaleString()}</Text>
                            }

                            {user.lastPasswordChangeDateTime != null &&
                                <Text>Last password change: {datediff(user.lastPasswordChangeDateTime, new Date())} day(s) ago ({user.lastPasswordChangeDateTime.toLocaleString()}) </Text>
                            }
                        </Stack>

                        <GroupMemberships UserId={user.id} />


                        <RecentSignIns UserId={user.id} />

                        
                        {
                            /** TODO
                             * Render a panel with the selected user's details
                             * 
                             * - If invite is pending, show a button to resend the invite (and get URL for that invite)
                             * - Sign in activity "/v1.0/auditLogs/signIns" - (timestamp, city/region, perhaps device info, status) (maybe days since last sign in?)
                             * - Group memberships "/v1.0/User/{id}/transitiveMemberOf" - (displayName, mail if has)
                             * - Block sign in button
                             * - Delete user button (only for disabled users?)
                             * - Option to edit display name (often set by users themselves, so not always accurate or useful) - suggest to include (GUEST) in the name
                             * ✅ Link to Azure Portal (https://aad.portal.azure.com/#view/Microsoft_AAD_UsersAndTenants/UserProfileMenuBlade/~/overview/userId/a4fceeaa-486d-4665-ba6c-2d4ac3c59fef)
                             * 
                             * - Maybe show "Manage contact information" form from modern admin center - https://admin.microsoft.com/?auth_upn=tanddant%402v8lc2.onmicrosoft.com&source=applauncher#/users/:/GuestUserDetails/9b792cf7-092e-4d9e-bfb7-64a0c7c726be/Account
                             * 
                             */
                        }

                    </Stack>
                </>}

        </Panel>
    );
};