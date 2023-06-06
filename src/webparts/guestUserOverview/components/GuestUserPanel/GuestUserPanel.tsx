import { ActionButton, IPanel, IPersonaProps, IRefObject, Label, MessageBar, MessageBarType, Panel, PanelType, Persona, PersonaSize, Pivot, PivotItem, Spinner, SpinnerSize, Stack, StackItem, Text } from '@fluentui/react';
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

    function _onRenderTertiaryText(personaProps: IPersonaProps): JSX.Element {
        return (
            <div style={{ display: 'flex', marginLeft: '-10px' }}>
                <ActionButton iconProps={{ iconName: user.accountEnabled ? "Contact" : "BlockContact" }}
                    text={user.accountEnabled ? "Block user" : "Unblock user"}
                    onClick={async () => { await GraphProvider.SetAccountStateForUserById(user.id, !user.accountEnabled); props.OnClose() }} />
                <ActionButton iconProps={{ iconName: "Delete" }} text='Delete user' />
                <ActionButton iconProps={{ iconName: "NavigateExternalInline" }} text='Open in Entra' target='_blank' href={`https://entra.microsoft.com/#view/Microsoft_AAD_UsersAndTenants/UserProfileMenuBlade/~/overview/userId/${user.id}`} />
            </div>);
    }

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

                        <Persona text={user.displayName} secondaryText={user.mail} tertiaryText={'Functions'} onRenderTertiaryText={_onRenderTertiaryText} size={PersonaSize.size72} />

                        <Pivot aria-label="Pivot" style={{ marginTop: 15 }}>
                            <PivotItem headerText="General" headerButtonProps={{ 'data-order': 1, 'data-title': 'General' }}>
                                <Stack style={{ marginTop: 15 }}>
                                    <div style={{ margin: '-12.5px 16px -12.5px -8px' }}>
                                        <Stack horizontal wrap>
                                            <StackItem grow={1} style={{ margin: '12px 16px', flex: '1 1 calc(50% - 32px)' }}>
                                                <Stack>
                                                    <Text style={{ fontWeight: 'bold' }}>User Created</Text>
                                                    <Text>{datediff(user.createdDateTime, new Date())} day(s) ago</Text>
                                                </Stack>
                                            </StackItem>
                                            <StackItem grow={1} style={{ margin: '12px 16px', flex: '1 1 calc(50% - 32px)' }}>
                                                <Stack>
                                                    <Text style={{ fontWeight: 'bold' }}>Invitation Accepted</Text>
                                                    <Text>{user.externalUserState == ExternalUserState.Accepted ? datediff(user.externalUserStateChangeDateTime, new Date()) + ' day(s) ago' : 'Not yet accepted'}</Text>
                                                </Stack>
                                            </StackItem>
                                            <StackItem grow={1} style={{ margin: '12px 16px', flex: '1 1 calc(50% - 32px)' }}>
                                                <Stack>
                                                    <Text style={{ fontWeight: 'bold' }}>Last sign-in</Text>
                                                    <Text>{datediff(user.signInActivity.lastSignInDateTime, new Date())} day(s) ago</Text>
                                                </Stack>
                                            </StackItem>
                                            <StackItem grow={1} style={{ margin: '12px 16px', flex: '1 1 calc(50% - 32px)' }}>
                                                <Stack>
                                                    <Text style={{ fontWeight: 'bold' }}>Last password change</Text>
                                                    <Text>{datediff(user.lastPasswordChangeDateTime, new Date())} day(s) ago</Text>
                                                </Stack>
                                            </StackItem>
                                        </Stack>
                                    </div>
                                </Stack>

                                <div style={{ marginTop: 25 }}>
                                    <GroupMemberships UserId={user.id} />
                                </div>

                                <div style={{ marginTop: 25 }}>
                                    <RecentSignIns UserId={user.id} />
                                </div>
                            </PivotItem>
                            <PivotItem headerText="Contact information" headerButtonProps={{ 'data-order': 2, 'data-title': 'Contact information' }}>
                                <Stack style={{ marginTop: 15 }}>
                                    <div style={{ margin: '-12.5px 16px -12.5px -8px' }}>
                                        <h1>Hejje</h1>
                                    </div>
                                </Stack>
                            </PivotItem>
                        </Pivot>
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