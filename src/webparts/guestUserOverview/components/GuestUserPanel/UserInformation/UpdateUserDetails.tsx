import * as React from "react";
import useSignIns from "../../../../../hooks/UseSignIns";
import { ActionButton, DefaultButton, DetailsList, IColumn, Icon, Label, Link, Panel, PanelType, PrimaryButton, SelectionMode, ShimmeredDetailsList, Spinner, SpinnerSize, Stack, Text, TextField } from 'office-ui-fabric-react';
import useUser from "../../../../../hooks/UseUser";
import { useBoolean } from "@fluentui/react-hooks";
import { useEffect, useState } from "react";
import { IUser } from "../../../../../models/IUser";

export interface IUpdateUserDetailsProps {
    UserId: string;
    onDismiss: () => void;
    isOpen: boolean;
}

export const UpdateUserDetails: React.FunctionComponent<IUpdateUserDetailsProps> = (props: React.PropsWithChildren<IUpdateUserDetailsProps>) => {
    const { isLoading, user } = useUser(props.UserId);
    const [userToUpdate, setUserToUpdate] = useState<IUser>(null);

    const firstName = user?.givenName ?? user?.displayName?.split(' ')[0];
    const lastName = user?.surname ?? user?.displayName?.replace(firstName, '')?.trim();
    const organization = user?.officeLocation ?? user?.mail?.split('@')[1]?.split('.')[0];

    function _onRenderHeader(): JSX.Element {
        return (<></>);
    }

    const _onRenderFooterContent = React.useCallback(
        () => (
          <div>
            <PrimaryButton onClick={() => console.log(userToUpdate)} style={{marginRight: 8}}>
              Save
            </PrimaryButton>
            <DefaultButton onClick={props.onDismiss}>Cancel</DefaultButton>
          </div>
        ),
        [props.onDismiss],
      );

    return (
        <Panel isOpen={props.isOpen} onDismiss={props.onDismiss} closeButtonAriaLabel="Close" type={PanelType.medium} onRenderHeader={_onRenderHeader} onRenderFooterContent={_onRenderFooterContent} isFooterAtBottom={true}>
            {isLoading &&
                <>
                    <Spinner size={SpinnerSize.large} />
                    <Label style={{ textAlign: 'center' }}>Loading...</Label>
                </>
            }

            {(!isLoading || (user != null)) &&
                <div style={{ display: 'grid', gap: 10 }}>
                    <h1>Manage contact information</h1>
                    <TextField label="First name" value={userToUpdate?.givenName ?? firstName} />
                    <TextField label="Last name" value={lastName} />
                    <TextField label="Display name" value={user?.displayName} />
                    <TextField label="Job title" value={user?.jobTitle} />
                    <TextField label="Department" value={user?.department} />
                    <TextField label="Office" value={user?.officeLocation} />
                    <div style={{ display: 'grid', gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
                        <TextField label="Office phone" value={user?.businessPhones[0]} />
                        <TextField label="Fax number" value={user?.faxNumber} />
                    </div>
                    <TextField label="Mobile phone" value={user?.mobilePhone} />
                    <TextField label="Street address" value={user?.streetAddress} />
                    <div style={{ display: 'grid', gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
                        <TextField label="City" value={user?.city} />
                        <TextField label="State or province" value={user?.state} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
                        <TextField label="Zip or postal code" value={user?.postalCode} />
                        <TextField label="Country or region" value={user?.country} />
                    </div>
                </div >
            }
        </Panel >
    );
};