import React from 'react';

/**
 * Componente de Loading com indicador visual e Skeletons
 */
export function LoadingSpinner({ label = 'Carregando Pokédex...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3" role="status" aria-live="polite">
      <div className="w-8 h-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin"></div>
      {label && <p className="text-xs text-slate-400">{label}</p>}
      <span className="sr-only">Carregando dados</span>
    </div>
  );
}

/**
 * Skeleton Loader para os Cards durante o carregamento
 */
export function ItemCardSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-4 w-12 bg-slate-800 rounded"></div>
        <div className="h-6 w-6 bg-slate-800 rounded"></div>
      </div>
      <div className="h-32 w-full bg-slate-800 rounded-lg my-2"></div>
      <div className="h-5 w-2/3 bg-slate-800 rounded"></div>
      <div className="flex gap-1.5">
        <div className="h-5 w-14 bg-slate-800 rounded"></div>
        <div className="h-5 w-14 bg-slate-800 rounded"></div>
      </div>
      <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between">
        <div className="h-3 w-16 bg-slate-800 rounded"></div>
        <div className="h-3 w-12 bg-slate-800 rounded"></div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
