import { ActionButton, IPanel, IRefObject, Panel, PanelType, Persona, PersonaSize } from '@fluentui/react';
import * as React from 'react';

export interface IGuestUserPanelProps {
    UserId: string;
    OnClose: () => void;
}

export const GuestUserPanel: React.FunctionComponent<IGuestUserPanelProps> = (props: React.PropsWithChildren<IGuestUserPanelProps>) => {
    const ref: IRefObject<IPanel> = React.useRef<IPanel>(null);
    //Todo - get user details from Graph API (create useUser hook)

    return (
        <Panel
            isOpen={props.UserId != null}
            componentRef={ref}
            onDismiss={() => props.OnClose()}
            onDismissed={() => props.OnClose()}
            type={PanelType.medium}
        >
            <Persona text={props.UserId} size={PersonaSize.size72} />
            <br />
            <ActionButton iconProps={{ iconName: "BlockContact" }} text='Block user' />
            <ActionButton iconProps={{ iconName: "Delete" }} text='Delete user' />

            {
                /** TODO
                 * Render a panel with the selected user's details
                 * 
                 * - If invite is pending, show a button to resend the invite (and get URL for that invite)
                 * - Sign in activity "/v1.0/auditLogs/signIns" - (timestamp, city/region, perhaps device info, status) (maybe days since last sign in?)
                 * - Group memberships "/v1.0/groups/{id}/members" - (displayName, mail)
                 * - Block sign in button
                 * - Delete user button (only for disabled users)
                 * - Option to edit display name (often set by users themselves, so not always accurate or useful) - suggest to include (GUEST) in the name
                 * - Link to Azure Portal (https://aad.portal.azure.com/#view/Microsoft_AAD_UsersAndTenants/UserProfileMenuBlade/~/overview/userId/a4fceeaa-486d-4665-ba6c-2d4ac3c59fef)
                 * 
                 * - Maybe show "Manage contact information" form from modern admin center - https://admin.microsoft.com/?auth_upn=tanddant%402v8lc2.onmicrosoft.com&source=applauncher#/users/:/GuestUserDetails/9b792cf7-092e-4d9e-bfb7-64a0c7c726be/Account
                 * 
                 */
            }




        </Panel>
    );
};