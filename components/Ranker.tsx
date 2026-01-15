
import React, { useState, useEffect } from 'react';

interface RankerProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  onOrderChange: (newOrder: T[]) => void;
}

const Ranker = <T,>({ items, renderItem, onOrderChange }: RankerProps<T>) => {
  const [currentOrder, setCurrentOrder] = useState<T[]>(items);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    setCurrentOrder(items);
  }, [items]);

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= currentOrder.length) return;

    const newOrder = [...currentOrder];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);

    setCurrentOrder(newOrder);
    onOrderChange(newOrder);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex !== null && draggedItemIndex !== index) {
      moveItem(draggedItemIndex, index);
    }
    setDraggedItemIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-2 sm:space-y-3">
      {currentOrder.map((item, index) => (
        <div 
          key={index} 
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          className={`
            flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl shadow-lg transition-all cursor-grab active:cursor-grabbing border
            ${draggedItemIndex === index ? 'opacity-40 border-slate-400 bg-zinc-800 scale-95' : 'bg-zinc-900 border-zinc-800'}
            ${dragOverIndex === index && draggedItemIndex !== index ? 'border-slate-300 bg-zinc-800 translate-x-1' : ''}
            group
          `}
        >
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-zinc-800 text-slate-200 text-xs sm:text-base font-bold rounded-lg border border-zinc-700 group-hover:bg-slate-700 transition-colors">
            {index + 1}º
          </div>
          
          <div className="flex-grow text-slate-300 font-medium select-none overflow-hidden text-ellipsis">
            {renderItem(item, index)}
          </div>

          <div className="flex flex-col gap-0.5 sm:gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => { e.stopPropagation(); moveItem(index, index - 1); }}
              disabled={index === 0}
              className={`p-1 rounded hover:bg-zinc-700 text-xs sm:text-sm ${index === 0 ? 'text-zinc-800' : 'text-slate-600 hover:text-white'}`}
            >
              <i className="fas fa-chevron-up"></i>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); moveItem(index, index + 1); }}
              disabled={index === currentOrder.length - 1}
              className={`p-1 rounded hover:bg-zinc-700 text-xs sm:text-sm ${index === currentOrder.length - 1 ? 'text-zinc-800' : 'text-slate-600 hover:text-white'}`}
            >
              <i className="fas fa-chevron-down"></i>
            </button>
          </div>
        </div>
      ))}
      <div className="text-center py-1">
        <p className="text-zinc-600 text-[10px] italic">
          <i className="fas fa-arrows-alt-v mr-1"></i>
          Arraste ou use as setas para ordenar
        </p>
      </div>
    </div>
  );
};

export default Ranker;
