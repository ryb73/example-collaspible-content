import * as Collapsible from "@radix-ui/react-collapsible";
type Props = {
    isOpen: boolean;
};
/** Mount Collapsible.Content to the page so that it gets dynamically sized before hiding. */
export declare function DynamicHeightCollapsibleContent({ isOpen, ...props }: Collapsible.CollapsibleContentProps & Props): import("react/jsx-runtime").JSX.Element;
export {};
