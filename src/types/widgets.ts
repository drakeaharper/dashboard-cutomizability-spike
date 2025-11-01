export interface WidgetPosition {
  col: number;      // Column (1 or 2)
  row: number;      // Row position within column
  relative: number; // Overall stacking order for mobile
}

export interface Widget {
  id: string;
  type: string;
  title: string;
  position: WidgetPosition;
  enabled: boolean;
}

export interface WidgetComponentProps {
  widget: Widget;
}

export interface WidgetRegistryItem {
  type: string;
  component: React.ComponentType<WidgetComponentProps>;
  defaultTitle: string;
}
