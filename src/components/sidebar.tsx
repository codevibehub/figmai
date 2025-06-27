'use client';

import React, { useState } from 'react';
import { 
  Layers,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Copy,
  Trash2,
  LogIn,
  LayoutDashboard,
  FileText,
  List,
  Eye,
  Settings,
  MousePointer,
  Type,
  CheckSquare,
  Circle,
  Image,
  CreditCard,
  RectangleHorizontal,
  Table,
  Menu,
  Link,
  Zap,
  Database
} from 'lucide-react';
import { useFlowStore } from '@/stores/flow-store';
import { ScreenType, ComponentType, isScreenType } from '@/types/flow';
import { cn, getNodeColors } from '@/lib/utils';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Collapsible from '@radix-ui/react-collapsible';

const screenTemplates: Array<{
  type: ScreenType;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
}> = [
  {
    type: 'login-screen',
    label: 'Login Screen',
    description: 'User authentication',
    icon: LogIn,
    category: 'Auth'
  },
  {
    type: 'dashboard-screen',
    label: 'Dashboard',
    description: 'Main overview screen',
    icon: LayoutDashboard,
    category: 'Main'
  },
  {
    type: 'form-screen',
    label: 'Form Screen',
    description: 'Data input forms',
    icon: FileText,
    category: 'Input'
  },
  {
    type: 'list-screen',
    label: 'List Screen',
    description: 'Data listing',
    icon: List,
    category: 'Display'
  },
  {
    type: 'detail-screen',
    label: 'Detail Screen',
    description: 'Item details',
    icon: Eye,
    category: 'Display'
  },
  {
    type: 'settings-screen',
    label: 'Settings',
    description: 'App configuration',
    icon: Settings,
    category: 'Utility'
  }
];

const componentTemplates: Array<{
  type: ComponentType;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
}> = [
  // UI Components
  {
    type: 'button',
    label: 'Button',
    description: 'Clickable button',
    icon: MousePointer,
    category: 'UI Elements'
  },
  {
    type: 'input',
    label: 'Input',
    description: 'Text input field',
    icon: Type,
    category: 'UI Elements'
  },
  {
    type: 'text',
    label: 'Text',
    description: 'Static text',
    icon: Type,
    category: 'UI Elements'
  },
  {
    type: 'textarea',
    label: 'TextArea',
    description: 'Multi-line input',
    icon: FileText,
    category: 'UI Elements'
  },
  {
    type: 'select',
    label: 'Select',
    description: 'Dropdown menu',
    icon: Menu,
    category: 'UI Elements'
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    description: 'Checkbox input',
    icon: CheckSquare,
    category: 'UI Elements'
  },
  {
    type: 'radio',
    label: 'Radio',
    description: 'Radio button',
    icon: Circle,
    category: 'UI Elements'
  },
  {
    type: 'image',
    label: 'Image',
    description: 'Image display',
    icon: Image,
    category: 'Layout'
  },
  {
    type: 'card',
    label: 'Card',
    description: 'Card container',
    icon: CreditCard,
    category: 'Layout'
  },
  {
    type: 'modal',
    label: 'Modal',
    description: 'Modal dialog',
    icon: RectangleHorizontal,
    category: 'Layout'
  },
  {
    type: 'table',
    label: 'Table',
    description: 'Data table',
    icon: Table,
    category: 'Data Display'
  },
  {
    type: 'list',
    label: 'List',
    description: 'List of items',
    icon: List,
    category: 'Data Display'
  },
  // Logic Components
  {
    type: 'api-call',
    label: 'API Call',
    description: 'External API',
    icon: Link,
    category: 'Integration'
  },
  {
    type: 'logic',
    label: 'Logic',
    description: 'Business logic',
    icon: Zap,
    category: 'Processing'
  },
  {
    type: 'database',
    label: 'Database',
    description: 'Data operations',
    icon: Database,
    category: 'Data'
  }
];

const screenCategories = [
  { name: 'Auth', icon: 'A', description: 'Authentication screens' },
  { name: 'Main', icon: 'M', description: 'Main application screens' },
  { name: 'Input', icon: 'I', description: 'Data input screens' },
  { name: 'Display', icon: 'D', description: 'Data display screens' },
  { name: 'Utility', icon: 'U', description: 'Utility screens' }
];

const componentCategories = [
  { name: 'UI Elements', icon: 'U', description: 'Basic UI components' },
  { name: 'Layout', icon: 'L', description: 'Layout containers' },
  { name: 'Data Display', icon: 'V', description: 'Data visualization' },
  { name: 'Integration', icon: 'N', description: 'External connections' },
  { name: 'Processing', icon: 'P', description: 'Business logic' },
  { name: 'Data', icon: 'E', description: 'Data operations' }
];

export function Sidebar() {
  const { nodes, selectedNodeId, duplicateScreen, deleteScreen, isDarkMode } = useFlowStore();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['Auth', 'Main', 'UI Elements', 'Layout'])
  );

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const onDragStart = (event: React.DragEvent, nodeType: ScreenType | ComponentType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDuplicateScreen = (screenId: string) => {
    duplicateScreen(screenId);
  };

  const handleDeleteScreen = (screenId: string) => {
    if (confirm('Are you sure you want to delete this screen?')) {
      deleteScreen(screenId);
    }
  };

  // Combine both screens and components with their categories
  const allCategories = [...screenCategories, ...componentCategories];
  const allTemplates = [...screenTemplates, ...componentTemplates];
  
  const groupedItems = allCategories.map(category => ({
    ...category,
    items: allTemplates.filter(template => template.category === category.name)
  }));

  return (
    <Tooltip.Provider delayDuration={300}>
      <div className={cn(
        "ai-flow-sidebar w-80 p-4 flex flex-col h-full overflow-hidden",
        isDarkMode && "dark"
      )}>
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg">Elements</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Drag screens to canvas or components into screens
          </p>
        </div>

        {/* Templates Section */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {groupedItems.map((category) => (
            <Collapsible.Root
              key={category.name}
              open={expandedCategories.has(category.name)}
              onOpenChange={() => toggleCategory(category.name)}
            >
              <Collapsible.Trigger asChild>
                <button className="w-full flex items-center justify-between p-2 rounded-md hover:bg-accent transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{category.icon}</span>
                    <div className="text-left">
                      <div className="font-medium text-sm">{category.name}</div>
                      <div className="text-xs text-muted-foreground">{category.description}</div>
                    </div>
                  </div>
                  {expandedCategories.has(category.name) ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
              </Collapsible.Trigger>

              <Collapsible.Content className="space-y-2 mt-2 ml-4">
                {category.items.map((template) => {
                  const colors = getNodeColors(template.type);
                  return (
                    <Tooltip.Root key={template.type}>
                      <Tooltip.Trigger asChild>
                        <div
                          draggable
                          onDragStart={(e) => onDragStart(e, template.type)}
                          className={cn(
                            'p-2 rounded-lg border-2 border-dashed cursor-move transition-all',
                            'hover:border-primary hover:bg-accent/50',
                            'focus:outline-none focus:ring-2 focus:ring-ring'
                          )}
                          tabIndex={0}
                        >
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              'w-6 h-6 rounded-md flex items-center justify-center text-white text-xs shadow-sm',
                              'bg-gradient-to-br',
                              colors.background
                            )}>
                                {typeof template.icon === 'function' ? React.createElement(template.icon, { size: 12 }) : 
                               typeof template.icon === 'string' ? template.icon : '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-xs">{template.label}</div>
                              <div className="text-xs text-muted-foreground">{template.description}</div>
                            </div>
                          </div>
                        </div>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content className="bg-popover text-popover-foreground px-3 py-2 rounded text-sm border shadow-md max-w-xs">
                          <div className="font-medium">{template.label}</div>
                          <div className="text-muted-foreground">{template.description}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {template.type.endsWith('-screen') ? 'Drag to canvas' : 'Drag into screen'}
                          </div>
                          <Tooltip.Arrow className="fill-popover" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  );
                })}
              </Collapsible.Content>
            </Collapsible.Root>
          ))}
        </div>

        {/* Layers Section */}
        <div className="border-t pt-4 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Layers</h3>
            <span className="text-xs text-muted-foreground">
              ({nodes.filter(n => isScreenType(n.type)).length})
            </span>
          </div>

          <div className="space-y-1 max-h-40 overflow-y-auto">
            {nodes.filter(n => isScreenType(n.type)).length === 0 ? (
              <div className="text-xs text-muted-foreground italic p-2 text-center">
                No screens in canvas
              </div>
            ) : (
              nodes.filter(n => isScreenType(n.type)).map((node) => {
                const colors = getNodeColors(node.type);
                const isSelected = selectedNodeId === node.id;
                
                return (
                  <div
                    key={node.id}
                    className={cn(
                      'flex items-center gap-2 p-2 rounded text-xs',
                      'hover:bg-accent transition-colors',
                      isSelected && 'bg-primary/10 border border-primary/20'
                    )}
                  >
                    <div className={cn(
                      'w-4 h-4 rounded text-white text-xs flex items-center justify-center',
                      'bg-gradient-to-br',
                      colors.background
                    )}>
                      {typeof node.data.icon === 'function' ? React.createElement(node.data.icon, { size: 10 }) : 
                       typeof node.data.icon === 'string' ? node.data.icon : '?'}
                    </div>
                    
                    <span className="flex-1 truncate font-medium">
                      {node.data.label}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDuplicateScreen(node.id)}
                        className="p-1 hover:bg-accent rounded"
                        title="Duplicate"
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteScreen(node.id)}
                        className="p-1 hover:bg-destructive hover:text-destructive-foreground rounded"
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Pro tip */}
        <div className="mt-4 p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="font-medium text-xs text-primary">Pro Tip</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Use Ctrl+D to duplicate selected nodes, Del to delete them
          </p>
        </div>
      </div>
    </Tooltip.Provider>
  );
}