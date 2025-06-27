import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate unique IDs for nodes and edges
export function generateId(prefix: string = 'node'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Format node labels for display
export function formatNodeLabel(label: string, maxLength: number = 20): string {
  if (label.length <= maxLength) return label;
  return `${label.substring(0, maxLength - 3)}...`;
}

// Color utilities for screen types
export const screenColors = {
  'login-screen': {
    background: 'from-indigo-500 to-purple-600',
    border: 'border-indigo-300',
    text: 'text-indigo-700'
  },
  'dashboard-screen': {
    background: 'from-blue-500 to-cyan-600',
    border: 'border-blue-300',
    text: 'text-blue-700'
  },
  'form-screen': {
    background: 'from-green-500 to-emerald-600',
    border: 'border-green-300',
    text: 'text-green-700'
  },
  'list-screen': {
    background: 'from-orange-500 to-red-600',
    border: 'border-orange-300',
    text: 'text-orange-700'
  },
  'detail-screen': {
    background: 'from-violet-500 to-purple-600',
    border: 'border-violet-300',
    text: 'text-violet-700'
  },
  'settings-screen': {
    background: 'from-gray-500 to-slate-600',
    border: 'border-gray-300',
    text: 'text-gray-700'
  }
} as const;

// Color utilities for component types
export const componentColors = {
  'ui-component': {
    background: 'from-blue-400 to-cyan-400',
    border: 'border-blue-200',
    text: 'text-blue-600'
  },
  'form-input': {
    background: 'from-green-400 to-emerald-400', 
    border: 'border-green-200',
    text: 'text-green-600'
  },
  'api-call': {
    background: 'from-purple-400 to-violet-400',
    border: 'border-purple-200', 
    text: 'text-purple-600'
  },
  'logic': {
    background: 'from-amber-400 to-orange-400',
    border: 'border-amber-200',
    text: 'text-amber-600'
  },
  'database': {
    background: 'from-red-400 to-pink-400',
    border: 'border-red-200',
    text: 'text-red-600'
  }
} as const;

// Get color scheme for node type
export function getNodeColors(type: string) {
  if (type.endsWith('-screen')) {
    return screenColors[type as keyof typeof screenColors] || screenColors['dashboard-screen'];
  }
  return componentColors[type as keyof typeof componentColors] || componentColors['ui-component'];
}

// Snap position to grid
export function snapToGrid(position: { x: number; y: number }, gridSize: number = 20) {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize,
  };
}

// Calculate node center position
export function getNodeCenter(node: { position: { x: number; y: number }; width?: number; height?: number }) {
  const width = node.width || 200;
  const height = node.height || 100;
  
  return {
    x: node.position.x + width / 2,
    y: node.position.y + height / 2,
  };
}

// Validate flow data
export function validateFlow(flow: unknown): boolean {
  if (!flow || typeof flow !== 'object') return false;
  
  const flowObj = flow as Record<string, unknown>;
  if (!Array.isArray(flowObj.nodes) || !Array.isArray(flowObj.edges)) return false;
  
  // Check node structure
  for (const node of flowObj.nodes) {
    if (!node || typeof node !== 'object') return false;
    const nodeObj = node as Record<string, unknown>;
    if (!nodeObj.id || !nodeObj.type || !nodeObj.data) return false;
  }
  
  // Check edge structure  
  for (const edge of flowObj.edges) {
    if (!edge || typeof edge !== 'object') return false;
    const edgeObj = edge as Record<string, unknown>;
    if (!edgeObj.id || !edgeObj.source || !edgeObj.target) return false;
  }
  
  return true;
}