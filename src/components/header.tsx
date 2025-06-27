'use client';

import React from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';
import { useFlowStore } from '@/stores/flow-store';
import { cn } from '@/lib/utils';

export function Header() {
  const { isDarkMode } = useFlowStore();

  return (
    <div className={cn(
      "h-10 bg-background/98 backdrop-blur-sm border-b border-border/30 px-4 flex items-center justify-between",
      isDarkMode && "dark"
    )}>
      {/* Logo e Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {/* Logo - Para usar imagem personalizada, substitua por: <img src="/logo.svg" alt="Logo" className="w-6 h-6" /> */}
          <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-md flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <div className="flex items-center gap-1">
            <h1 className="text-sm font-semibold">AI Flow Builder</h1>
            <span className="text-xs text-muted-foreground">Enterprise</span>
          </div>
        </div>
      </div>

      {/* CTA sutil */}
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Powered by</span>
          <span className="font-medium text-foreground">CodeVibeHub</span>
        </div>
        
        <a
          href="https://codevibehub.com"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-md text-xs",
            "hover:bg-accent/50 hover:text-accent-foreground transition-all duration-200",
            "text-muted-foreground hover:text-foreground"
          )}
        >
          <span className="hidden sm:inline">Visit</span>
          <span className="sm:hidden">CVH</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}