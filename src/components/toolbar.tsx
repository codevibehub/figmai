'use client';

import React from 'react';
import { 
  MousePointer, 
  Hand, 
  GitBranch,
  Maximize2,
  Download,
  FolderOpen,
  Trash2,
  Sun,
  Moon
} from 'lucide-react';
import { useFlowStore } from '@/stores/flow-store';
import { ToolType } from '@/types/flow';
import { cn } from '@/lib/utils';
import * as Tooltip from '@radix-ui/react-tooltip';

export function Toolbar() {
  const {
    selectedTool,
    isDarkMode,
    setSelectedTool,
    toggleDarkMode,
    clearFlow,
    exportFlow,
    importFlow,
    resetViewport,
    nodes
  } = useFlowStore();

  const tools: { type: ToolType; icon: React.ReactNode; label: string; shortcut?: string }[] = [
    { type: 'select', icon: <MousePointer size={18} />, label: 'Select', shortcut: 'V' },
    { type: 'pan', icon: <Hand size={18} />, label: 'Pan', shortcut: 'H' },
    { type: 'connect', icon: <GitBranch size={18} />, label: 'Connect', shortcut: 'C' },
  ];

  const handleExport = () => {
    const flowData = exportFlow();
    const blob = new Blob([flowData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-flow-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (importFlow(result)) {
            // Success feedback could be added here
          } else {
            alert('Failed to import flow. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearFlow = () => {
    if (nodes.length > 0) {
      if (confirm('Are you sure you want to clear the entire flow? This action cannot be undone.')) {
        clearFlow();
      }
    }
  };

  return (
    <Tooltip.Provider delayDuration={300}>
      <div className={cn(
        "ai-flow-toolbar h-16 px-4 flex items-center justify-between bg-background border-b",
        isDarkMode && "dark"
      )}>
        {/* Left - Tools */}
        <div className="flex items-center gap-1">
          {tools.map((tool) => (
            <Tooltip.Root key={tool.type}>
              <Tooltip.Trigger asChild>
                <button
                  onClick={() => setSelectedTool(tool.type)}
                  className={cn(
                    'p-2 rounded-md transition-all duration-200',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus:outline-none focus:ring-2 focus:ring-ring',
                    selectedTool === tool.type && 'bg-primary text-primary-foreground shadow-sm'
                  )}
                  title={`${tool.label} (${tool.shortcut})`}
                >
                  {tool.icon}
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="bg-popover text-popover-foreground px-2 py-1 rounded text-xs border shadow-md">
                  {tool.label} {tool.shortcut && <span className="text-muted-foreground">({tool.shortcut})</span>}
                  <Tooltip.Arrow className="fill-popover" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          ))}

          <div className="w-px h-6 bg-border mx-2" />

          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                onClick={resetViewport}
                className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-all"
                title="Reset Zoom (0)"
              >
                <Maximize2 size={18} />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="bg-popover text-popover-foreground px-2 py-1 rounded text-xs border shadow-md">
                Reset Zoom <span className="text-muted-foreground">(0)</span>
                <Tooltip.Arrow className="fill-popover" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>

        {/* Center - Status Info */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Design screens and components visually
          </p>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-1">
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                onClick={handleImport}
                className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-all"
                title="Import Flow"
              >
                <FolderOpen size={18} />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="bg-popover text-popover-foreground px-2 py-1 rounded text-xs border shadow-md">
                Import Flow
                <Tooltip.Arrow className="fill-popover" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                onClick={handleExport}
                className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-all"
                title="Export Flow"
              >
                <Download size={18} />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="bg-popover text-popover-foreground px-2 py-1 rounded text-xs border shadow-md">
                Export Flow
                <Tooltip.Arrow className="fill-popover" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>

          <div className="w-px h-6 bg-border mx-2" />

          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                onClick={handleClearFlow}
                className="p-2 rounded-md hover:bg-destructive hover:text-destructive-foreground transition-all"
                title="Clear Flow"
                disabled={nodes.length === 0}
              >
                <Trash2 size={18} />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="bg-popover text-popover-foreground px-2 py-1 rounded text-xs border shadow-md">
                Clear Flow
                <Tooltip.Arrow className="fill-popover" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>

          <div className="w-px h-6 bg-border mx-2" />

          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-all"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="bg-popover text-popover-foreground px-2 py-1 rounded text-xs border shadow-md">
                Toggle Theme
                <Tooltip.Arrow className="fill-popover" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>
      </div>
    </Tooltip.Provider>
  );
}