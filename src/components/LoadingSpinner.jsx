import React from 'react';

/**
 * Componente de Loading com animação de Pokébola e Skeletons
 */
export function LoadingSpinner({ size = 'md', label = 'Carregando Pokédex...' }) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-20 h-20 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4" role="status" aria-live="polite">
      {/* Ícone de Pokébola giratória estilizada */}
      <div className={`relative ${sizeClasses[size] || sizeClasses.md} rounded-full border-rose-500 border-t-white border-b-slate-900 animate-spin shadow-lg shadow-rose-500/20`}>
        <div className="absolute inset-0 m-auto w-3 h-3 bg-white rounded-full border-2 border-slate-900"></div>
      </div>
      {label && <p className="text-sm font-medium text-slate-400 animate-pulse tracking-wide">{label}</p>}
      <span className="sr-only">Carregando dados</span>
    </div>
  );
}

/**
 * Skeleton Loader para os Cards durante o carregamento
 */
export function ItemCardSkeleton() {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 animate-pulse backdrop-blur-sm">
      <div className="flex justify-between items-center">
        <div className="h-5 w-16 bg-slate-800 rounded-full"></div>
        <div className="h-8 w-8 bg-slate-800 rounded-full"></div>
      </div>
      <div className="h-44 w-full bg-slate-800/80 rounded-xl my-2"></div>
      <div className="h-6 w-3/4 bg-slate-800 rounded-md"></div>
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-slate-800 rounded-full"></div>
        <div className="h-6 w-16 bg-slate-800 rounded-full"></div>
      </div>
      <div className="space-y-2 mt-2 pt-3 border-t border-slate-800/80">
        <div className="h-3 w-full bg-slate-800 rounded"></div>
        <div className="h-3 w-4/5 bg-slate-800 rounded"></div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
