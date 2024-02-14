import arrayMove from 'array-move';
import * as React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay, defaultDropAnimationSideEffects, DropAnimation, } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4"
      }
    }
  })
};

const DragHandle = ({ attributes, listeners, children }) => (
  <div {...attributes} {...listeners} tabIndex={0}>
    {children}
  </div>
);

const SortableOverlay = ({ children }) => {
  return (
    <DragOverlay dropAnimation={dropAnimationConfig}>{children}</DragOverlay>
  );
}


const SortableItem = ({ id, value, helperClass, useDragHandle, dragHandleElement, }) => {
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

  if (useDragHandle && dragHandleElement) {
    return (
      <div className={`list-item ${helperClass}`} ref={setNodeRef} style={style}>
        <DragHandle attributes={attributes} listeners={listeners}>{dragHandleElement}</DragHandle>
        {value}
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
  dragHandleElement?: JSX.Element
}

export const SortableList = ({ data, sortCallback, helperClass, useDragHandle, dragHandleElement, }: SortableListProps) => {
  const [activeItemId, setActiveItemId] = React.useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = data.findIndex(item => String(item.key) === String(active.id));
      const newIndex = data.findIndex(item => String(item.key) === String(over.id));
      const newData = arrayMove(data, oldIndex, newIndex);
      sortCallback(newData);
    }

    setActiveItemId(null)
  };

  function handleDragStart(event) {
    console.log('event.active', event.active)
    setActiveItemId(event.active.id)
  }

  function renderItemById(id) {
    const item = data.find(item => String(item.key) === String(id))
    return renderItem(item)
  }

  function renderItem(item) {
    return (
      <SortableItem dragHandleElement={dragHandleElement} helperClass={helperClass} id={item.key} key={item.key} useDragHandle={useDragHandle} value={item} />
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <SortableContext items={data.map(item => item.id)} strategy={verticalListSortingStrategy}>
        <div className="list sortable-list">
          {data.map((value, index) => renderItem(value))}
        </div>
      </SortableContext>
      <SortableOverlay>
        {activeItemId ? renderItemById(activeItemId) : null}
      </SortableOverlay>
    </DndContext>
  );
}


// import * as React from 'react';
// import { SortableContainer, SortableElement } from 'react-sortable-hoc';
//
// const SortableComponentItem = SortableElement(({value}) => <div className="list-item">{value}</div>);
//
// const SortableComponent = SortableContainer(({items}) => {
//   return (
//     <div className="list sortable-list">
//       {items.map((value, index) => (
//         <SortableComponentItem index={index} key={index} value={value} />
//       ))}
//     </div>
//   );
// });
//
// interface SortableListProps {
//   sortCallback: (items: any[]) => void,
//   data: any[],
//   helperClass?: string,
//   axis?: any,
//   useDragHandle?: boolean
// }
//
// export function SortableList({ sortCallback, data, helperClass, axis, useDragHandle, }: SortableListProps) {
//   function onSortEnd({oldIndex, newIndex}) {
//     const newArray = arrayMove(data, oldIndex, newIndex)
//     return sortCallback(newArray)
//   };
//
//   function onSortMove() {}
//
//   return <SortableComponent axis={axis || 'y'} distance={2} helperClass={helperClass} items={data} onSortEnd={onSortEnd} onSortMove={onSortMove} useDragHandle={useDragHandle} />;
// }
