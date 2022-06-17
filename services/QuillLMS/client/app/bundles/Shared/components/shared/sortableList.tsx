import * as React from 'react';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';

const SortableComponentItem = SortableElement(({value}) => <div className="list-item">{value}</div>);

const SortableComponent = SortableContainer(({items}) => {
  return (
    <div className="list sortable-list">
      {items.map((value, index) => (
        <SortableComponentItem index={index} key={index} value={value} />
      ))}
    </div>
  );
});

interface SortableListProps {
  sortCallback: (items: any[]) => void,
  data: any[],
  helperClass?: string,
  axis?: any,
  useDragHandle?: boolean
}

export function SortableList({ sortCallback, data, helperClass, axis, useDragHandle, }: SortableListProps) {
  function onSortEnd({oldIndex, newIndex}) {
    const newArray = arrayMove(data, oldIndex, newIndex)
    return sortCallback(newArray)
  };

  function onSortMove() {}

  return <SortableComponent axis={axis || 'y'} distance={2} helperClass={helperClass} items={data} onSortEnd={onSortEnd} onSortMove={onSortMove} useDragHandle={useDragHandle} />;
}
