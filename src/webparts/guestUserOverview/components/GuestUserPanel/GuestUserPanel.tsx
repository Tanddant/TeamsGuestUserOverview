import { ActionButton, IPanel, IPersonaProps, IRefObject, Label, MessageBar, MessageBarType, Panel, PanelType, Persona, PersonaSize, Pivot, PivotItem, Spinner, SpinnerSize, Stack, StackItem, Text } from '@fluentui/react';
import * as React from 'react';
import useUser from '../../../../hooks/UseUser';
import { ExternalUserState } from '../../../../enums/ExternalUserState';
import { InvitationResender } from './NoInvitationAccepted/InvitationResender';
import { ApplicationContext } from '../../../../util/ApplicationContext';
import { GroupMemberships } from './GroupMemberships/GroupMemberships';
import { RecentSignIns } from './RecentSignIns/RecentSignIns';
import { PrettyDate } from './PrettyDate/PrettyDate';
import { UserDetails } from './UserInformation/UserDetails';


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
                    <Stack tokens={{ childrenGap: 25 }}>
                        {user.externalUserState == ExternalUserState.PendingAcceptance &&
                            <InvitationResender UserId={user.id} />
                        }

                        {user.accountEnabled === false && <MessageBar messageBarType={MessageBarType.error}>This user is blocked from sign in!</MessageBar>}

                        <Persona text={user.displayName} secondaryText={user.mail} onRenderTertiaryText={_onRenderTertiaryText} size={PersonaSize.size72} />

                        <Pivot aria-label="Pivot" >
                            <PivotItem headerText="General" headerButtonProps={{ 'data-order': 1, 'data-title': 'General' }}>
                                <Stack tokens={{ childrenGap: 25 }} styles={{ root: { marginTop: 15 } }}>


                                    <div style={{ display: 'grid', gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
                                        <PrettyDate date={user.createdDateTime} label='User Created' />
                                        <PrettyDate date={user.externalUserStateChangeDateTime} label='Invitation Accepted' override={user.externalUserState == ExternalUserState.Accepted ? null : "Not yet accepted"} />
                                        <PrettyDate date={user.signInActivity?.lastSignInDateTime} label='Last sign-in' />
                                        <PrettyDate date={user.lastPasswordChangeDateTime} label='Last password change' />
                                    </div>

                                    <GroupMemberships UserId={user.id} />

                                    <RecentSignIns UserId={user.id} />

                                </Stack>
                            </PivotItem>
                            <PivotItem headerText="Contact information" headerButtonProps={{ 'data-order': 2, 'data-title': 'Contact information' }}>
                                <Stack style={{ marginTop: 15 }}>
                                    <UserDetails UserId={user.id} />
                                </Stack>
                            </PivotItem>
                        </Pivot>
                    </Stack>
                </>}

        </Panel>
    );
};