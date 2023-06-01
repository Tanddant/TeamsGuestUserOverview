import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'GuestUserOverviewWebPartStrings';
import { GuestUserOverview, IGuestUserOverviewProps } from './components/GuestUserOverview';

export interface IGuestUserOverviewWebPartProps {
}

export default class GuestUserOverviewWebPart extends BaseClientSideWebPart<IGuestUserOverviewWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IGuestUserOverviewProps> = React.createElement(
      GuestUserOverview,
      {}
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: []
    };
  }
}
