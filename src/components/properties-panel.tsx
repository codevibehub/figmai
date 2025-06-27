'use client';

import React from 'react';
import { Settings, FileText, Download } from 'lucide-react';
import { useFlowStore } from '@/stores/flow-store';
import { FlowNode, isScreenData, isComponentData } from '@/types/flow';
import { getNodeColors, cn } from '@/lib/utils';
import * as Tooltip from '@radix-ui/react-tooltip';

export function PropertiesPanel() {
  const { 
    nodes, 
    selectedNodeId,
    updateScreenData,
    isDarkMode
  } = useFlowStore();
  
  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null;


  const handleLabelChange = (label: string) => {
    if (!selectedNode) return;
    updateScreenData(selectedNode.id, { label });
  };

  const handleDescriptionChange = (description: string) => {
    if (!selectedNode) return;
    updateScreenData(selectedNode.id, { description });
  };

  const handleScreenSizeChange = (width: number, height: number) => {
    if (!selectedNode || !isScreenData(selectedNode.data)) return;
    updateScreenData(selectedNode.id, { 
      screenSize: { width, height } 
    });
  };

  const generateDocumentation = () => {
    if (!selectedNode) return;

    const isScreen = isScreenData(selectedNode.data);
    const doc = {
      screen: isScreen ? {
        type: selectedNode.data.category,
        label: selectedNode.data.label,
        description: selectedNode.data.description,
        components: selectedNode.data.components,
        screenSize: selectedNode.data.screenSize
      } : null,
      component: !isScreen ? {
        type: selectedNode.data.category,
        label: selectedNode.data.label,
        description: selectedNode.data.description,
        properties: selectedNode.data.properties
      } : null,
      implementation: {
        frontend: generateFrontendSpec(selectedNode),
        backend: generateBackendSpec(selectedNode),
        database: generateDatabaseSpec(selectedNode)
      },
      llm_prompt: generateLLMPrompt(selectedNode)
    };

    const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedNode.data.label.toLowerCase().replace(/\s+/g, '-')}-documentation.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateFrontendSpec = (node: FlowNode) => {
    return {
      type: node.type,
      label: node.data.label,
      description: node.data.description || '',
      notes: 'Screen-based frontend implementation with components'
    };
  };

  const generateBackendSpec = (node: FlowNode) => {
    return {
      type: node.type,
      label: node.data.label,
      description: node.data.description || '',
      notes: 'Backend API endpoints and data flow'
    };
  };

  const generateDatabaseSpec = (node: FlowNode) => {
    return {
      type: node.type,
      label: node.data.label,
      description: node.data.description || '',
      notes: 'Database schema and relationships'
    };
  };

  const generateLLMPrompt = (node: FlowNode) => {
    const isScreen = isScreenData(node.data);
    const basePrompt = `Create a ${node.type} with the following specifications:

${isScreen ? 'Screen' : 'Component'}: ${node.data.label}
Description: ${node.data.description || 'No description provided'}

Type: ${node.type}

${isScreen && isScreenData(node.data) ? `
Screen Details:
- Size: ${node.data.screenSize.width}×${node.data.screenSize.height}
- Components: ${node.data.components.length} components inside
- Component Types: ${node.data.components.map(c => c.category).join(', ')}
` : !isScreen && isComponentData(node.data) ? `
Component Details:
- Position: ${node.data.position.x}, ${node.data.position.y}
- Properties: ${JSON.stringify(node.data.properties || {}, null, 2)}
` : 'N/A'}

Requirements:
1. Follow modern web development best practices
2. Ensure accessibility compliance (WCAG 2.1)
3. Use TypeScript for type safety
4. Include proper error handling
5. Write unit tests for core functionality
6. Add comprehensive documentation

Technical Stack:
- Frontend: React 18+ with TypeScript
- Styling: Tailwind CSS
- State Management: Zustand
- Testing: Jest + React Testing Library

Please provide:
1. Complete ${isScreen ? 'screen' : 'component'} implementation
2. ${isScreen ? 'Screen layout with all components' : 'Component structure and props'}
3. Type definitions
4. Unit tests
5. Usage examples
6. Documentation`;

    return basePrompt;
  };

  if (!selectedNode) {
    return (
      <div className={cn(
        "w-80 border-l p-4 bg-background/95 backdrop-blur-sm",
        isDarkMode && "dark"
      )}>
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Properties</h3>
        </div>
        
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            Select a node to view and edit its properties
          </p>
        </div>
      </div>
    );
  }

  const colors = getNodeColors(selectedNode.data.category);

  return (
    <Tooltip.Provider delayDuration={300}>
      <div className={cn(
        "w-80 border-l p-4 bg-background/95 backdrop-blur-sm overflow-y-auto",
        isDarkMode && "dark"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Properties</h3>
          </div>
          
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                onClick={generateDocumentation}
                className="p-1.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-all"
                title="Generate Documentation"
              >
                <Download size={14} />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="bg-popover text-popover-foreground px-2 py-1 rounded text-xs border shadow-md">
                Generate LLM Documentation
                <Tooltip.Arrow className="fill-popover" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>

        {/* Node Header */}
        <div className="mb-6 p-3 rounded-lg border bg-card">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-8 h-8 rounded-md flex items-center justify-center text-white text-sm bg-gradient-to-br ${colors.background}`}>
              {typeof selectedNode.data.icon === 'function' ? React.createElement(selectedNode.data.icon, { size: 16 }) : 
               typeof selectedNode.data.icon === 'string' ? selectedNode.data.icon : '?'}
            </div>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                {selectedNode.data.category.replace('-', ' ')}
              </div>
              <div className="font-medium text-sm">{selectedNode.data.label}</div>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            ID: <span className="font-mono">{selectedNode.id}</span>
          </div>
        </div>

        {/* Basic Properties */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Label
            </label>
            <input
              type="text"
              value={selectedNode.data.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter label..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Description
            </label>
            <textarea
              value={selectedNode.data.description || ''}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={3}
              placeholder="Enter description..."
            />
          </div>
        </div>

        {/* Screen Properties */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-sm">Screen Properties</h4>
          </div>

          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Screen Type
              </label>
              <div className="text-sm font-medium">{selectedNode.type}</div>
            </div>
            
            {isScreenData(selectedNode.data) && (
              <>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Components Count
                  </label>
                  <div className="text-sm font-medium">{selectedNode.data.components.length}</div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Screen Size
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Width</label>
                      <input
                        type="number"
                        value={isScreenData(selectedNode.data) ? selectedNode.data.screenSize.width : 400}
                        onChange={(e) => handleScreenSizeChange(parseInt(e.target.value) || 400, isScreenData(selectedNode.data) ? selectedNode.data.screenSize.height : 300)}
                        className="w-full px-2 py-1 text-xs border rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                        min="200"
                        max="1200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Height</label>
                      <input
                        type="number"
                        value={isScreenData(selectedNode.data) ? selectedNode.data.screenSize.height : 300}
                        onChange={(e) => handleScreenSizeChange(isScreenData(selectedNode.data) ? selectedNode.data.screenSize.width : 400, parseInt(e.target.value) || 300)}
                        className="w-full px-2 py-1 text-xs border rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                        min="200"
                        max="800"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Additional screen info */}
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Additional Info
              </label>
              <div className="text-xs text-muted-foreground">
                Screen properties and component editing coming soon...
              </div>
            </div>
          </div>
        </div>

        {/* Documentation Preview */}
        <div className="mt-6 p-3 bg-muted/50 rounded-lg">
          <h5 className="text-xs font-semibold text-muted-foreground mb-2">Quick Documentation</h5>
          <div className="text-xs space-y-1">
            <div><strong>Type:</strong> {selectedNode.type}</div>
            <div><strong>Purpose:</strong> {selectedNode.data.description || 'No description'}</div>
            <div><strong>Components:</strong> {isScreenData(selectedNode.data) ? selectedNode.data.components.length : 0} inside</div>
          </div>
          
          <button
            onClick={generateDocumentation}
            className="mt-3 w-full px-3 py-2 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Generate Full Documentation
          </button>
        </div>
      </div>
    </Tooltip.Provider>
  );
}