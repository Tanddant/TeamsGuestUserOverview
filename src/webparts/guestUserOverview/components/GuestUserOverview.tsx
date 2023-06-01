import * as React from 'react';
import styles from './GuestUserOverview.module.scss';


export interface IGuestUserOverviewProps {
}

export const GuestUserOverview: React.FunctionComponent<IGuestUserOverviewProps> = (props: React.PropsWithChildren<IGuestUserOverviewProps>) => {
  const {
  } = props;

  return (
    <h1>Hello world 🙌</h1>
  );
};