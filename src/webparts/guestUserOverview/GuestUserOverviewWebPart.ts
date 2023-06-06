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
import { ApplicationContext } from '../../util/ApplicationContext';
import { graphfi, SPFx, ConsistencyLevel, Endpoint, GraphFI } from '@pnp/graph/presets/all'
import { GraphProvider } from '../../providers/GraphProvider';

export interface IGuestUserOverviewWebPartProps {
}

export default class GuestUserOverviewWebPart extends BaseClientSideWebPart<IGuestUserOverviewWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IGuestUserOverviewProps> = React.createElement(GuestUserOverview, {});
    const graph: GraphFI = graphfi().using(ConsistencyLevel("eventual"), Endpoint("beta"), SPFx(this.context))
    const ApplicationWrapper = React.createElement(ApplicationContext.Provider, { value: { SPFxContext: this.context, Graph: graph, GraphProvider: new GraphProvider(graph, this.context) } }, element);

    ReactDom.render(ApplicationWrapper, this.domElement);
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
