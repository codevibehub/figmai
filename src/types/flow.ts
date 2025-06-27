import { Node, Edge } from '@xyflow/react';

// Screen types for the main flow
export type ScreenType = 
  | 'login-screen'
  | 'dashboard-screen'
  | 'form-screen'
  | 'list-screen'
  | 'detail-screen'
  | 'settings-screen';

// Component types (used inside screens)
export type ComponentType = 
  // UI Components
  | 'button'
  | 'input'
  | 'text'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'image'
  | 'card'
  | 'modal'
  | 'table'
  | 'list'
  // Logic Components
  | 'api-call'
  | 'logic'
  | 'database';

// Union type for all node types
export type NodeType = ScreenType | ComponentType;

// Component data structure
export interface ComponentData extends Record<string, unknown> {
  label: string;
  name?: string; // Custom user-defined name
  description?: string;
  icon?: string | React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color?: string;
  properties: Record<string, unknown>;
  category: ComponentType;
  position: { x: number; y: number }; // Position within the screen
}

// Screen data structure
export interface ScreenData extends Record<string, unknown> {
  label: string;
  description?: string;
  icon?: string | React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color?: string;
  category: ScreenType;
  components: ComponentData[]; // Components inside this screen
  screenSize: { width: number; height: number };
}

// Node data union
export type FlowNodeData = ScreenData | ComponentData;

// Extended node with our custom data
export interface FlowNode extends Node<FlowNodeData> {
  type: NodeType;
}

// Flow edge with custom properties
export interface FlowEdge extends Edge {
  animated?: boolean;
  style?: React.CSSProperties;
}

// Complete flow state
export interface Flow {
  id: string;
  name: string;
  description?: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Tool types for the toolbar
export type ToolType = 'select' | 'pan' | 'connect' | 'zoom';

// Export formats
export type ExportFormat = 'json' | 'documentation' | 'mermaid';

// Helper type guards
export function isScreenData(data: FlowNodeData): data is ScreenData {
  return 'components' in data && 'screenSize' in data;
}

export function isComponentData(data: FlowNodeData): data is ComponentData {
  return 'position' in data && !('components' in data);
}

export function isScreenType(type: NodeType): type is ScreenType {
  return type.endsWith('-screen');
}

export function isComponentType(type: NodeType): type is ComponentType {
  return !type.endsWith('-screen');
}

// Documentation export structure
export interface FlowDocumentation {
  title: string;
  description: string;
  screens: {
    id: string;
    type: ScreenType;
    label: string;
    description: string;
    components: {
      id: string;
      type: ComponentType;
      label: string;
      description: string;
      properties: Record<string, unknown>;
      position: { x: number; y: number };
    }[];
    connections: {
      inputs: string[];
      outputs: string[];
    };
  }[];
  flow: {
    description: string;
    steps: string[];
  };
  technical_requirements: {
    frontend: string[];
    backend: string[];
    database: string[];
    apis: string[];
  };
  implementation_notes: string[];
}