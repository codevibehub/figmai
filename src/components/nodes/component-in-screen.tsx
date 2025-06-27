'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ComponentData } from '@/types/flow';
import { cn, getNodeColors } from '@/lib/utils';
import { useFlowStore } from '@/stores/flow-store';
import { ChevronUp, ChevronDown, Trash2, GripVertical, Edit2 } from 'lucide-react';

interface ComponentInScreenProps {
  component: ComponentData;
  componentId: string;
  componentIndex: number;
  screenId: string;
  isScreenSelected: boolean;
  totalComponents: number;
}

export function ComponentInScreen({ 
  component, 
  componentId, 
  componentIndex,
  screenId,
  totalComponents
}: ComponentInScreenProps) {
  const { 
    selectedNodeId,
    deleteComponentFromScreen,
    setSelectedNodeId,
    moveComponentUp,
    moveComponentDown,
    reorderComponentInScreen,
    updateComponentInScreen
  } = useFlowStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editingName, setEditingName] = useState(component.name || component.label);
  const inputRef = useRef<HTMLInputElement>(null);

  const colors = getNodeColors(component.category);
  const isSelected = selectedNodeId === `${screenId}-${componentId}`;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNodeId(`${screenId}-${componentId}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteComponentFromScreen(screenId, componentId);
  };

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    moveComponentUp(screenId, componentIndex);
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    moveComponentDown(screenId, componentIndex);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('componentIndex', componentIndex.toString());
    e.dataTransfer.setData('screenId', screenId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const draggedComponentIndex = parseInt(e.dataTransfer.getData('componentIndex'));
    const draggedScreenId = e.dataTransfer.getData('screenId');
    
    if (draggedScreenId === screenId && draggedComponentIndex !== componentIndex) {
      reorderComponentInScreen(screenId, draggedComponentIndex, componentIndex);
    }
  };

  const handleNameEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingName(true);
  };

  const handleNameSave = () => {
    if (editingName.trim() !== component.name) {
      updateComponentInScreen(screenId, componentId, { name: editingName.trim() });
    }
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setEditingName(component.name || component.label);
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      handleNameCancel();
    }
  };

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  return (
    <div
      className={cn(
        'flex items-center gap-2 p-2 bg-background/90 backdrop-blur-sm border rounded-lg shadow-sm transition-all',
        'hover:shadow-md hover:bg-background',
        isSelected && 'ring-2 ring-primary shadow-lg bg-background'
      )}
      onClick={handleClick}
      draggable={true}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Order number */}
      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
        {componentIndex + 1}
      </div>

      {/* Drag handle */}
      <div className="flex-shrink-0 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing">
        <GripVertical size={14} />
      </div>

      {/* Component icon */}
      <div className={cn(
        'flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-white text-xs',
        'bg-gradient-to-br',
        colors.background
      )}>
        {typeof component.icon === 'function' ? React.createElement(component.icon, { width: 12, height: 12 }) : 
         typeof component.icon === 'string' ? component.icon : '?'}
      </div>
      
      {/* Component info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          {isEditingName ? (
            <input
              ref={inputRef}
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={handleNameKeyDown}
              className="font-medium text-xs text-foreground bg-transparent border-b border-primary focus:outline-none flex-1 min-w-0"
              placeholder="Component name"
            />
          ) : (
            <>
              <h4 className="font-medium text-xs text-foreground leading-tight truncate">
                {component.name || component.label}
              </h4>
              <button
                onClick={handleNameEdit}
                className="flex-shrink-0 p-0.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                title="Edit name"
              >
                <Edit2 size={10} />
              </button>
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-tight truncate">
          {component.description}
        </p>
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex items-center gap-1">
        {/* Move up button */}
        <button
          onClick={handleMoveUp}
          disabled={componentIndex === 0}
          className={cn(
            'p-1 rounded hover:bg-accent transition-colors',
            componentIndex === 0 && 'opacity-30 cursor-not-allowed'
          )}
          title="Move up"
        >
          <ChevronUp size={12} />
        </button>

        {/* Move down button */}
        <button
          onClick={handleMoveDown}
          disabled={componentIndex === totalComponents - 1}
          className={cn(
            'p-1 rounded hover:bg-accent transition-colors',
            componentIndex === totalComponents - 1 && 'opacity-30 cursor-not-allowed'
          )}
          title="Move down"
        >
          <ChevronDown size={12} />
        </button>

        {/* Delete button */}
        {isSelected && (
          <button
            onClick={handleDelete}
            className="p-1 rounded hover:bg-destructive hover:text-destructive-foreground transition-colors"
            title="Delete component"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>

      {/* Component type indicator */}
      <div className="flex-shrink-0 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
        {component.category.split('-')[0]}
      </div>
    </div>
  );
}