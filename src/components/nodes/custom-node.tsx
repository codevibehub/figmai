'use client';

import React from 'react';
import { NodeProps } from '@xyflow/react';
import { FlowNode, isScreenData } from '@/types/flow';
import { ScreenNode } from './screen-node';

export function CustomNode(props: NodeProps<FlowNode>) {
  // Always render as screen node since we're only showing screens on the main canvas
  if (isScreenData(props.data)) {
    return <ScreenNode {...props} />;
  }
  
  // Fallback - this shouldn't happen in the new architecture
  return null;
}