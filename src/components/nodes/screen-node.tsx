'use client';

import React, { useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { FlowNode, isScreenData, ComponentType, isComponentType } from '@/types/flow';
import { cn, getNodeColors } from '@/lib/utils';
import { useFlowStore } from '@/stores/flow-store';
import { ComponentInScreen } from './component-in-screen';

export function ScreenNode({ id, data, selected }: NodeProps<FlowNode>) {
  const { selectedNodeId, deleteScreen, setSelectedScreenId, addComponentToScreen } = useFlowStore();
  
  // Handle dropping components into the screen
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const componentType = event.dataTransfer.getData('application/reactflow');
      if (!componentType || !isComponentType(componentType as ComponentType)) return;

      // Add component to end of list (position not relevant for list layout)
      addComponentToScreen(id, componentType as ComponentType, { x: 0, y: 0 });
    },
    [id, addComponentToScreen]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const componentType = event.dataTransfer.getData('application/reactflow');
    if (componentType && isComponentType(componentType as ComponentType)) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }, []);

  if (!isScreenData(data)) return null;
  const isSelected = selectedNodeId === id || selected;
  const colors = getNodeColors(data.category);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteScreen(id);
  };

  const handleDoubleClick = () => {
    setSelectedScreenId(id);
  };

  return (
    <div
      className={cn(
        'ai-flow-node',
        'min-w-[400px] min-h-[300px] p-4',
        'cursor-pointer relative',
        isSelected && 'selected'
      )}
      onDoubleClick={handleDoubleClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      style={{
        width: data.screenSize.width,
        height: data.screenSize.height
      }}
    >
      {/* Handles for connecting screens */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-primary !border-2 !border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-primary !border-2 !border-background"
      />

      {/* Screen header */}
      <div className="flex items-start gap-3 mb-3 relative z-10">
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg shadow-sm',
          'bg-gradient-to-br',
          colors.background
        )}>
          {typeof data.icon === 'function' ? React.createElement(data.icon, { size: 20 }) : 
           typeof data.icon === 'string' ? data.icon : '?'}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground leading-tight">
            {data.label}
          </h3>
          {data.description && (
            <p className="text-xs text-muted-foreground mt-1 leading-tight">
              {data.description}
            </p>
          )}
        </div>

        {isSelected && (
          <button
            onClick={handleDelete}
            className="w-6 h-6 rounded-full bg-destructive text-destructive-foreground 
                     flex items-center justify-center text-xs hover:scale-110 transition-transform z-20"
            title="Delete screen"
          >
            ×
          </button>
        )}
      </div>

      {/* Screen content area with components list */}
      <div className="flex-1 bg-muted/20 rounded-lg p-3 min-h-[200px] border-2 border-dashed border-muted-foreground/20">
        {data.components.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            <div className="text-center">
              <p>Drag components here</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {data.components.map((component, index) => (
              <ComponentInScreen
                key={index}
                component={component}
                componentId={index.toString()}
                componentIndex={index}
                screenId={id}
                isScreenSelected={isSelected}
                totalComponents={data.components.length}
              />
            ))}
          </div>
        )}
      </div>

      {/* Screen info footer */}
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>{data.components.length} components</span>
        <span>{data.screenSize.width}×{data.screenSize.height}</span>
      </div>

      {/* Selection indicator for screen */}
      {isSelected && (
        <div className="absolute -inset-2 border-2 border-primary rounded-lg pointer-events-none opacity-50" />
      )}
    </div>
  );
}