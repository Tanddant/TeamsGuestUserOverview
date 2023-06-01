import * as React from 'react';
import styles from './GuestUserOverview.module.scss';
import useGuests from '../../../hooks/UseGuests';
import { DetailsList, DetailsListLayoutMode, SelectionMode, ShimmeredDetailsList, Spinner, Selection } from '@fluentui/react';
import { GuestUserDetailListColumns } from './GuestUserDetailListColumns';
import { IGuestUser } from '../../../models/IGuestUser';

export interface IGuestUserOverviewProps {

}

export const GuestUserOverview: React.FunctionComponent<IGuestUserOverviewProps> = (props: React.PropsWithChildren<IGuestUserOverviewProps>) => {
  const { Guests, isLoading } = useGuests();
  const [selectedUserId, setSelectedUserId] = React.useState<string>(null);

  const selection = new Selection({
    selectionMode: SelectionMode.single,
    onSelectionChanged: () => {
      setSelectedUserId((selection.getSelection()[0] as IGuestUser)?.id);
    }
  });


  return (
    <>

      {selectedUserId != null &&
        Guests.filter(g => g.id === selectedUserId)[0].displayName
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


      <ShimmeredDetailsList
        items={Guests}
        columns={GuestUserDetailListColumns}
        enableShimmer={isLoading}
        shimmerLines={100}
        selection={selection}
        selectionPreservedOnEmptyClick={true}
        selectionMode={SelectionMode.single}
      />
    </>
  );
};