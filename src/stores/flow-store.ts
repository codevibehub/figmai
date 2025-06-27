import { create } from 'zustand';
import { 
  addEdge, 
  applyNodeChanges, 
  applyEdgeChanges,
  Connection,
  NodeChange,
  EdgeChange,
  Viewport
} from '@xyflow/react';
import { 
  FlowNode, 
  FlowEdge, 
  ScreenData,
  ComponentData,
  ToolType, 
  ScreenType,
  ComponentType,
  isScreenData
} from '@/types/flow';
import { generateId } from '@/lib/utils';
import { 
  LogIn, LayoutDashboard, FileText, List, Eye, Settings,
  MousePointer, Type, CheckSquare, Circle, Image,
  CreditCard, RectangleHorizontal, Table, Menu, Link, Zap, Database
} from 'lucide-react';

interface FlowState {
  // Core flow data
  nodes: FlowNode[];
  edges: FlowEdge[];
  viewport: Viewport;
  
  // UI state
  selectedTool: ToolType;
  selectedNodeId: string | null;
  selectedScreenId: string | null; // For component editing
  isDarkMode: boolean;
  
  // Actions
  setNodes: (nodes: FlowNode[] | ((nodes: FlowNode[]) => FlowNode[])) => void;
  setEdges: (edges: FlowEdge[] | ((edges: FlowEdge[]) => FlowEdge[])) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  
  // Tool actions
  setSelectedTool: (tool: ToolType) => void;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedScreenId: (id: string | null) => void;
  toggleDarkMode: () => void;
  
  // Screen operations
  addScreen: (type: ScreenType, position: { x: number; y: number }) => void;
  deleteScreen: (id: string) => void;
  duplicateScreen: (id: string) => void;
  updateScreenData: (id: string, data: Partial<ScreenData>) => void;
  
  // Component operations
  addComponentToScreen: (screenId: string, type: ComponentType, position: { x: number; y: number }) => void;
  deleteComponentFromScreen: (screenId: string, componentId: string) => void;
  updateComponentInScreen: (screenId: string, componentId: string, data: Partial<ComponentData>) => void;
  moveComponentInScreen: (screenId: string, componentId: string, position: { x: number; y: number }) => void;
  reorderComponentInScreen: (screenId: string, fromIndex: number, toIndex: number) => void;
  moveComponentUp: (screenId: string, componentIndex: number) => void;
  moveComponentDown: (screenId: string, componentIndex: number) => void;
  
  // Flow operations
  clearFlow: () => void;
  exportFlow: () => string;
  importFlow: (flowData: string) => boolean;
  
  // Viewport operations
  setViewport: (viewport: Viewport) => void;
  resetViewport: () => void;
}

// Screen templates
const screenTemplates: Record<ScreenType, Omit<ScreenData, 'components' | 'screenSize'>> = {
  'login-screen': {
    label: 'Login Screen',
    description: 'User authentication interface',
    icon: LogIn,
    color: 'from-indigo-500 to-purple-600',
    category: 'login-screen'
  },
  'dashboard-screen': {
    label: 'Dashboard',
    description: 'Main application dashboard',
    icon: LayoutDashboard,
    color: 'from-blue-500 to-cyan-600',
    category: 'dashboard-screen'
  },
  'form-screen': {
    label: 'Form Screen',
    description: 'Data input and forms',
    icon: FileText,
    color: 'from-green-500 to-emerald-600',
    category: 'form-screen'
  },
  'list-screen': {
    label: 'List Screen',
    description: 'Data listing and tables',
    icon: List,
    color: 'from-orange-500 to-red-600',
    category: 'list-screen'
  },
  'detail-screen': {
    label: 'Detail Screen',
    description: 'Item details and information',
    icon: Eye,
    color: 'from-violet-500 to-purple-600',
    category: 'detail-screen'
  },
  'settings-screen': {
    label: 'Settings Screen',
    description: 'Application configuration',
    icon: Settings,
    color: 'from-gray-500 to-slate-600',
    category: 'settings-screen'
  }
};

// Component templates
const componentTemplates: Record<ComponentType, Omit<ComponentData, 'properties' | 'position'>> = {
  // UI Components
  'button': {
    label: 'Button',
    description: 'Clickable button element',
    icon: MousePointer,
    color: 'from-blue-400 to-blue-600',
    category: 'button'
  },
  'input': {
    label: 'Input',
    description: 'Text input field',
    icon: Type,
    color: 'from-green-400 to-green-600',
    category: 'input'
  },
  'text': {
    label: 'Text',
    description: 'Static text element',
    icon: Type,
    color: 'from-gray-400 to-gray-600',
    category: 'text'
  },
  'textarea': {
    label: 'TextArea',
    description: 'Multi-line text input',
    icon: FileText,
    color: 'from-green-400 to-emerald-600',
    category: 'textarea'
  },
  'select': {
    label: 'Select',
    description: 'Dropdown selection',
    icon: Menu,
    color: 'from-purple-400 to-purple-600',
    category: 'select'
  },
  'checkbox': {
    label: 'Checkbox',
    description: 'Checkbox input',
    icon: CheckSquare,
    color: 'from-teal-400 to-teal-600',
    category: 'checkbox'
  },
  'radio': {
    label: 'Radio',
    description: 'Radio button input',
    icon: Circle,
    color: 'from-cyan-400 to-cyan-600',
    category: 'radio'
  },
  'image': {
    label: 'Image',
    description: 'Image display',
    icon: Image,
    color: 'from-pink-400 to-pink-600',
    category: 'image'
  },
  'card': {
    label: 'Card',
    description: 'Card container',
    icon: CreditCard,
    color: 'from-indigo-400 to-indigo-600',
    category: 'card'
  },
  'modal': {
    label: 'Modal',
    description: 'Modal dialog',
    icon: RectangleHorizontal,
    color: 'from-violet-400 to-violet-600',
    category: 'modal'
  },
  'table': {
    label: 'Table',
    description: 'Data table',
    icon: Table,
    color: 'from-orange-400 to-orange-600',
    category: 'table'
  },
  'list': {
    label: 'List',
    description: 'List of items',
    icon: List,
    color: 'from-yellow-400 to-yellow-600',
    category: 'list'
  },
  // Logic Components
  'api-call': {
    label: 'API Call',
    description: 'External API integration',
    icon: Link,
    color: 'from-purple-400 to-violet-400',
    category: 'api-call'
  },
  'logic': {
    label: 'Logic',
    description: 'Business logic or computation',
    icon: Zap,
    color: 'from-amber-400 to-orange-400',
    category: 'logic'
  },
  'database': {
    label: 'Database',
    description: 'Data storage or retrieval',
    icon: Database,
    color: 'from-red-400 to-pink-400',
    category: 'database'
  }
};

export const useFlowStore = create<FlowState>((set, get) => ({
  // Initial state
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 0.8 },
  selectedTool: 'select',
  selectedNodeId: null,
  selectedScreenId: null,
  isDarkMode: true,

  // Core flow setters
  setNodes: (nodes) => set(state => ({ 
    nodes: typeof nodes === 'function' ? nodes(state.nodes) : nodes 
  })),
  
  setEdges: (edges) => set(state => ({ 
    edges: typeof edges === 'function' ? edges(state.edges) : edges 
  })),

  onNodesChange: (changes) => set(state => ({
    nodes: applyNodeChanges(changes, state.nodes) as FlowNode[]
  })),

  onEdgesChange: (changes) => set(state => ({
    edges: applyEdgeChanges(changes, state.edges)
  })),

  onConnect: (connection) => set(state => ({
    edges: addEdge({
      ...connection,
      id: generateId('edge'),
      animated: true,
      style: { strokeWidth: 2 }
    }, state.edges)
  })),

  // Tool actions
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setSelectedScreenId: (id) => set({ selectedScreenId: id }),
  toggleDarkMode: () => set(state => ({ isDarkMode: !state.isDarkMode })),

  // Screen operations
  addScreen: (type, position) => {
    const template = screenTemplates[type];
    const newScreen: FlowNode = {
      id: generateId('screen'),
      type,
      position,
      data: {
        ...template,
        components: [],
        screenSize: { width: 400, height: 300 }
      } as unknown as ScreenData
    };
    
    set(state => ({
      nodes: [...state.nodes, newScreen],
      selectedNodeId: newScreen.id
    }));
  },

  deleteScreen: (id) => set(state => ({
    nodes: state.nodes.filter(n => n.id !== id),
    edges: state.edges.filter(e => e.source !== id && e.target !== id),
    selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    selectedScreenId: state.selectedScreenId === id ? null : state.selectedScreenId
  })),

  duplicateScreen: (id) => {
    const state = get();
    const originalScreen = state.nodes.find(n => n.id === id);
    if (!originalScreen) return;

    const newScreen: FlowNode = {
      ...originalScreen,
      id: generateId('screen'),
      position: {
        x: originalScreen.position.x + 50,
        y: originalScreen.position.y + 50
      }
    };

    set({
      nodes: [...state.nodes, newScreen],
      selectedNodeId: newScreen.id
    });
  },

  updateScreenData: (id, dataUpdate) => set(state => ({
    nodes: state.nodes.map(node =>
      node.id === id && isScreenData(node.data)
        ? { ...node, data: { ...node.data, ...dataUpdate } }
        : node
    )
  })),

  // Component operations
  addComponentToScreen: (screenId, type, position) => {
    const template = componentTemplates[type];
    const newComponent: ComponentData = {
      ...template,
      position,
      properties: getDefaultComponentProperties(type)
    } as unknown as ComponentData;

    set(state => ({
      nodes: state.nodes.map(node => {
        if (node.id === screenId && isScreenData(node.data)) {
          const newComponents = [...node.data.components, newComponent];
          // Auto-resize: altura mínima 300px + 40px por componente
          const newHeight = Math.max(300, 200 + (newComponents.length * 40));
          
          return {
            ...node,
            data: {
              ...node.data,
              components: newComponents,
              screenSize: {
                ...node.data.screenSize,
                height: newHeight
              }
            }
          };
        }
        return node;
      })
    }));
  },

  deleteComponentFromScreen: (screenId, componentId) => set(state => ({
    nodes: state.nodes.map(node => {
      if (node.id === screenId && isScreenData(node.data)) {
        const newComponents = node.data.components.filter((_, index) => index.toString() !== componentId);
        // Auto-resize: altura mínima 300px + 40px por componente
        const newHeight = Math.max(300, 200 + (newComponents.length * 40));
        
        return {
          ...node,
          data: {
            ...node.data,
            components: newComponents,
            screenSize: {
              ...node.data.screenSize,
              height: newHeight
            }
          }
        };
      }
      return node;
    })
  })),

  updateComponentInScreen: (screenId, componentId, dataUpdate) => set(state => ({
    nodes: state.nodes.map(node => {
      if (node.id === screenId && isScreenData(node.data)) {
        return {
          ...node,
          data: {
            ...node.data,
            components: node.data.components.map((comp, index) =>
              index.toString() === componentId
                ? { ...comp, ...dataUpdate }
                : comp
            )
          }
        };
      }
      return node;
    })
  })),

  moveComponentInScreen: (screenId, componentId, position) => set(state => ({
    nodes: state.nodes.map(node => {
      if (node.id === screenId && isScreenData(node.data)) {
        return {
          ...node,
          data: {
            ...node.data,
            components: node.data.components.map((comp, index) =>
              index.toString() === componentId
                ? { ...comp, position }
                : comp
            )
          }
        };
      }
      return node;
    })
  })),

  reorderComponentInScreen: (screenId, fromIndex, toIndex) => set(state => ({
    nodes: state.nodes.map(node => {
      if (node.id === screenId && isScreenData(node.data)) {
        const newComponents = [...node.data.components];
        const [movedComponent] = newComponents.splice(fromIndex, 1);
        newComponents.splice(toIndex, 0, movedComponent);
        
        return {
          ...node,
          data: {
            ...node.data,
            components: newComponents
          }
        };
      }
      return node;
    })
  })),

  moveComponentUp: (screenId, componentIndex) => {
    if (componentIndex > 0) {
      get().reorderComponentInScreen(screenId, componentIndex, componentIndex - 1);
    }
  },

  moveComponentDown: (screenId, componentIndex) => {
    const state = get();
    const screen = state.nodes.find(n => n.id === screenId);
    if (screen && isScreenData(screen.data) && componentIndex < screen.data.components.length - 1) {
      state.reorderComponentInScreen(screenId, componentIndex, componentIndex + 1);
    }
  },

  // Flow operations
  clearFlow: () => set({
    nodes: [],
    edges: [],
    selectedNodeId: null,
    viewport: { x: 0, y: 0, zoom: 0.8 }
  }),

  exportFlow: () => {
    const state = get();
    return JSON.stringify({
      nodes: state.nodes,
      edges: state.edges,
      viewport: state.viewport,
      metadata: {
        version: '1.0',
        createdAt: new Date().toISOString()
      }
    }, null, 2);
  },

  importFlow: (flowData) => {
    try {
      const data = JSON.parse(flowData);
      if (!data.nodes || !data.edges) return false;
      
      set({
        nodes: data.nodes,
        edges: data.edges,
        viewport: data.viewport || { x: 0, y: 0, zoom: 1 },
        selectedNodeId: null
      });
      return true;
    } catch {
      return false;
    }
  },

  // Viewport operations
  setViewport: (viewport) => set({ viewport }),
  resetViewport: () => set({ viewport: { x: 0, y: 0, zoom: 0.8 } })
}));

// Default properties for component types
function getDefaultComponentProperties(type: ComponentType): Record<string, unknown> {
  switch (type) {
    // UI Components
    case 'button':
      return {
        text: 'Click me',
        variant: 'primary',
        size: 'medium',
        disabled: false
      };
    case 'input':
      return {
        type: 'text',
        placeholder: 'Enter value...',
        required: false,
        disabled: false
      };
    case 'text':
      return {
        content: 'Sample text',
        fontSize: '14px',
        fontWeight: 'normal',
        color: '#000000'
      };
    case 'textarea':
      return {
        placeholder: 'Enter text...',
        rows: 3,
        required: false,
        disabled: false
      };
    case 'select':
      return {
        options: ['Option 1', 'Option 2', 'Option 3'],
        defaultValue: '',
        required: false,
        disabled: false
      };
    case 'checkbox':
      return {
        label: 'Checkbox label',
        checked: false,
        disabled: false
      };
    case 'radio':
      return {
        name: 'radioGroup',
        value: 'option1',
        label: 'Radio option',
        disabled: false
      };
    case 'image':
      return {
        src: '/placeholder.jpg',
        alt: 'Image description',
        width: 200,
        height: 150
      };
    case 'card':
      return {
        title: 'Card Title',
        content: 'Card content',
        footer: '',
        padding: '16px'
      };
    case 'modal':
      return {
        title: 'Modal Title',
        content: 'Modal content',
        closable: true,
        size: 'medium'
      };
    case 'table':
      return {
        columns: ['Column 1', 'Column 2', 'Column 3'],
        data: [],
        sortable: true,
        pagination: false
      };
    case 'list':
      return {
        items: ['Item 1', 'Item 2', 'Item 3'],
        ordered: false,
        selectable: false
      };
    // Logic Components
    case 'api-call':
      return {
        method: 'GET',
        endpoint: '/api/data',
        headers: {},
        body: ''
      };
    case 'logic':
      return {
        operation: 'filter',
        condition: '',
        transformation: ''
      };
    case 'database':
      return {
        operation: 'SELECT',
        table: 'users',
        query: '',
        fields: []
      };
    default:
      return {};
  }
}