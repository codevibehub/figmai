'use client';

import React, { useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { useFlowStore } from '@/stores/flow-store';
import { Header } from './header';
import { Toolbar } from './toolbar';
import { Sidebar } from './sidebar';
import { FlowCanvas } from './flow-canvas';
import { PropertiesPanel } from './properties-panel';
import { cn } from '@/lib/utils';

export function AIFlowBuilder() {
  const { isDarkMode } = useFlowStore();

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when not typing in inputs
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const { 
        setSelectedTool, 
        selectedNodeId, 
        deleteScreen, 
        duplicateScreen
      } = useFlowStore.getState();

      switch (event.key.toLowerCase()) {
        case 'v':
          if (!event.ctrlKey && !event.metaKey) {
            setSelectedTool('select');
            event.preventDefault();
          }
          break;
        case 'h':
          if (!event.ctrlKey && !event.metaKey) {
            setSelectedTool('pan');
            event.preventDefault();
          }
          break;
        case 'c':
          if (!event.ctrlKey && !event.metaKey) {
            setSelectedTool('connect');
            event.preventDefault();
          }
          break;
        case 'delete':
        case 'backspace':
          if (selectedNodeId) {
            deleteScreen(selectedNodeId);
            event.preventDefault();
          }
          break;
        case 'd':
          if ((event.ctrlKey || event.metaKey) && selectedNodeId) {
            duplicateScreen(selectedNodeId);
            event.preventDefault();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={cn(
      'h-screen flex flex-col bg-background text-foreground overflow-hidden',
      isDarkMode && 'dark'
    )}>
      {/* Header */}
      <Header />
      
      {/* Toolbar */}
      <Toolbar />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Canvas Area */}
        <ReactFlowProvider>
          <FlowCanvas className="flex-1" />
        </ReactFlowProvider>
        
        {/* Properties Panel */}
        <PropertiesPanel />
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-muted/50 border-t px-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>AI Flow Builder Enterprise v1.0</span>
          <span>•</span>
          <span>Ready</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span>Shortcuts: V (Select) • H (Pan) • C (Connect) • Ctrl+D (Duplicate) • Del (Delete)</span>
        </div>
      </div>
    </div>
  );
}