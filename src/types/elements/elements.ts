import type {
  TCardComponent,
  TCardHeaderComponent,
  TCardContentComponent,
  TCardFooterComponent,
  TCardTitleComponent,
  TCardDescriptionComponent,
} from "@/types/elements/card";
import type {
  TDivComponent,
  TRootComponent,
  TSpanComponent,
} from "@/types/elements/layout";
import type { TButtonComponent } from "@/types/elements/button";
import type {
  TH1Component,
  TH2Component,
  TH3Component,
  TH4Component,
  TH5Component,
  TH6Component,
  TPComponent,
} from "@/types/elements/text";
import type { TBadgeComponent } from "@/types/elements/badge";
import type {
  TBreadcrumbComponent,
  TBreadcrumbListComponent,
  TBreadcrumbItemComponent,
  TBreadcrumbLinkComponent,
  TBreadcrumbPageComponent,
  TBreadcrumbSeparatorComponent,
  TBreadcrumbEllipsisComponent,
} from "@/types/elements/breadcrumb"; // Add this import
import type { TailwindClassNamesGroups } from "../tailwind/tailwind";
import type { TLabelComponent } from "./label";
import type { TAComponent, TInputComponent } from "./input";

export type TGenericComponentInfer<T> = {
  props: Omit<InferComponentProps<T>, "children" | "className">;
};

type InferComponentProps<T> = T extends React.ComponentType<infer P>
  ? P
  : never;

const GenericComponentsNames = {
  Root: "Root",
  div: "div",
  a: "a",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  p: "p",
  Button: "Button",
  Card: "Card",
  CardHeader: "CardHeader",
  CardContent: "CardContent",
  CardFooter: "CardFooter",
  CardTitle: "CardTitle",
  CardDescription: "CardDescription",
  Badge: "Badge",
  Breadcrumb: "Breadcrumb",
  BreadcrumbList: "BreadcrumbList",
  BreadcrumbItem: "BreadcrumbItem",
  BreadcrumbLink: "BreadcrumbLink",
  BreadcrumbPage: "BreadcrumbPage",
  BreadcrumbSeparator: "BreadcrumbSeparator",
  BreadcrumbEllipsis: "BreadcrumbEllipsis",
  Label: "Label",
  Input: "Input",
} as const;

export type GenericComponentName =
  (typeof GenericComponentsNames)[keyof typeof GenericComponentsNames];

export type TGenericComponentsWithoutRoot =
  | TDivComponent
  | TH1Component
  | TH2Component
  | TH3Component
  | TH4Component
  | TAComponent
  | TPComponent
  | TButtonComponent
  | TDivComponent
  | TCardComponent
  | TCardHeaderComponent
  | TCardContentComponent
  | TCardFooterComponent
  | TCardTitleComponent
  | TCardDescriptionComponent
  | TBadgeComponent
  | TBreadcrumbComponent
  | TBreadcrumbListComponent
  | TBreadcrumbItemComponent
  | TBreadcrumbLinkComponent
  | TBreadcrumbPageComponent
  | TBreadcrumbSeparatorComponent
  | TBreadcrumbEllipsisComponent
  | TLabelComponent
  | TInputComponent;

export type TGenericComponents = TRootComponent | TGenericComponentsWithoutRoot;

export function isValidComponentName(
  name: unknown
): name is GenericComponentName {
  const GenericComponentNames = Object.values(GenericComponentsNames);
  return (
    typeof name === "string" &&
    GenericComponentNames.includes(name as GenericComponentName)
  );
}

export type TGenericComponentRegistryEntry = Omit<
  TGenericComponents,
  "props"
> & {
  icon: React.ReactNode;
  component: React.ReactNode;
  dependencies: string[];
  draggable: boolean;
  droppable: boolean;
  editable: boolean;
  classNameGroupsdefaults: Partial<TailwindClassNamesGroups>;
};

export type TGenericComponentRegistry = {
  [key in GenericComponentName]: TGenericComponentRegistryEntry;
};
