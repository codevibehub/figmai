'use client';

import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  Panel,
  NodeOrigin,
  ConnectionMode
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useFlowStore } from '@/stores/flow-store';
import { FlowNode, FlowEdge, NodeType, ScreenType, isScreenType } from '@/types/flow';
import { cn, snapToGrid } from '@/lib/utils';
import { CustomNode } from './nodes/custom-node';

// Node types mapping - all screen types use CustomNode which renders ScreenNode
const nodeTypes = {
  'login-screen': CustomNode,
  'dashboard-screen': CustomNode,
  'form-screen': CustomNode,
  'list-screen': CustomNode,
  'detail-screen': CustomNode,
  'settings-screen': CustomNode,
};

const nodeOrigin: NodeOrigin = [0.5, 0];

interface FlowCanvasProps {
  className?: string;
}

export function FlowCanvas({ className }: FlowCanvasProps) {
  const {
    nodes,
    edges,
    selectedTool,
    isDarkMode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addScreen,
    setSelectedNodeId,
    viewport,
    setViewport
  } = useFlowStore();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  // Handle canvas drop for new screens (only screens can be dropped on main canvas)
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !reactFlowWrapper.current) return;

      // Only allow screen types to be dropped on main canvas
      if (!isScreenType(type as NodeType)) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Snap to grid
      const snappedPosition = snapToGrid(position, 40);
      addScreen(type as ScreenType, snappedPosition);
    },
    [screenToFlowPosition, addScreen]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle node selection
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: FlowNode) => {
      event.stopPropagation();
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  // Handle canvas click (deselect)
  const onPaneClick = useCallback(() => {
    if (selectedTool === 'select') {
      setSelectedNodeId(null);
    }
  }, [selectedTool, setSelectedNodeId]);

  return (
    <div 
      ref={reactFlowWrapper}
      className={cn(
        'flex-1 relative',
        'ai-flow-canvas',
        isDarkMode && 'dark',
        className
      )}
    >
      <ReactFlow<FlowNode, FlowEdge>
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        nodeOrigin={nodeOrigin}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        viewport={viewport}
        onViewportChange={setViewport}
        connectionMode={ConnectionMode.Loose}
        attributionPosition="bottom-left"
        className="bg-background"
        panOnScroll
        selectionOnDrag
        panOnDrag={selectedTool === 'pan'}
        nodesDraggable={selectedTool === 'select'}
        nodesConnectable={selectedTool === 'connect'}
        elementsSelectable={selectedTool === 'select'}
      >
        <Background 
          gap={20} 
          size={1}
          className={isDarkMode ? 'opacity-20' : 'opacity-30'}
        />
        
        <Controls 
          position="bottom-right"
          className="!bg-background/95 !border !backdrop-blur-sm"
        />
        
        <MiniMap 
          position="bottom-left"
          className="!bg-background/95 !border !backdrop-blur-sm"
          maskColor={isDarkMode ? "rgba(15, 23, 42, 0.6)" : "rgba(241, 245, 249, 0.6)"}
          nodeColor={(node) => {
            const colors = {
              'login-screen': '#6366f1',
              'dashboard-screen': '#3b82f6',
              'form-screen': '#10b981',
              'list-screen': '#f59e0b',
              'detail-screen': '#8b5cf6',
              'settings-screen': '#6b7280'
            };
            return colors[node.type as keyof typeof colors] || '#6b7280';
          }}
        />

        {/* Custom panels */}
        <Panel position="top-center" className="pointer-events-none">
          <div className="text-sm text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1 rounded-md border">
            {selectedTool === 'select' && 'Select Tool - Click and drag screens'}
            {selectedTool === 'pan' && 'Pan Tool - Drag to move the canvas'}
            {selectedTool === 'connect' && 'Connect Tool - Click screens to connect them'}
          </div>
        </Panel>

        {nodes.length === 0 && (
          <Panel position="top-center" className="pointer-events-none" style={{ 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)' 
          }}>
            <div className="text-center p-8 bg-background/80 backdrop-blur-sm rounded-lg border border-dashed max-w-md">
              <h3 className="text-xl font-semibold mb-2">Welcome to AI Flow Builder</h3>
              <p className="text-muted-foreground">
                Drag screens from the sidebar to start building your application flow
              </p>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}