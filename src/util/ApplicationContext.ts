import { BaseComponentContext } from "@microsoft/sp-component-base";
import { GraphFI } from "@pnp/graph/presets/all";
import * as React from "react";

export interface IApplicationContext {
    SPFxContext: BaseComponentContext;
    Graph: GraphFI;
}

export const ApplicationContext = React.createContext<IApplicationContext>(null);