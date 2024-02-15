import arrayMove from 'array-move';
import * as React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay, defaultDropAnimationSideEffects, DropAnimation, } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { DragHandleProvider, } from '../../hooks/useDragHandle'

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4"
      }
    }
  })
};

const SortableOverlay = ({ children, }) => {
  return (
    <DragOverlay dropAnimation={dropAnimationConfig}>{children}</DragOverlay>
  );
}

const SortableItem = ({ id, value, helperClass, useDragHandle, }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (useDragHandle) {
    return (
      <div className={`list-item ${helperClass}`} ref={setNodeRef} style={style}>
        <DragHandleProvider attributes={attributes} listeners={listeners}>
          {value}
        </DragHandleProvider>
      </div>
    )
  }

  return (
    <div className={`list-item ${helperClass}`} ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {value}
    </div>
  );
};

interface SortableListProps {
  data: any[],
  sortCallback: (items: any[]) => void,
  helperClass?: string,
  useDragHandle?: boolean,
}

export const SortableList = ({ data, sortCallback, helperClass, useDragHandle, }: SortableListProps) => {
  const [activeId, setActiveId] = React.useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const oldIndex = data.findIndex(item => String(item.key) === String(active.id));
      const newIndex = data.findIndex(item => String(item.key) === String(over.id));
      const newData = arrayMove(data, oldIndex, newIndex);
      sortCallback(newData);
    }

    setActiveId(null)
  };

  function handleDragStart(event) {
    setActiveId(event.active.id)
  }

  function renderItemById(id, inOverlay) {
    const item = data.find(item => String(item.key) === String(id))
    return renderItem(item, inOverlay)
  }

  function renderItem(item, applyHelperClass=false) {
    return (
      <SortableItem helperClass={applyHelperClass ? helperClass: ''} id={item.key} key={item.key} useDragHandle={useDragHandle} value={item} />
    )
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragStart={handleDragStart} sensors={sensors}>
      <SortableContext items={data.map(item => item.key || item.id)} strategy={verticalListSortingStrategy}>
        <div className="list sortable-list">
          {data.map((item, index) => renderItem(item))}
        </div>
      </SortableContext>
      <SortableOverlay>
        {activeId ? renderItemById(activeId, true) : null}
      </SortableOverlay>
    </DndContext>
  );
}
