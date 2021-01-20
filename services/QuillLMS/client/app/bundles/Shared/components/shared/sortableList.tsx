import * as React from 'react';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';

const SortableListItem = SortableElement(({value}) => <div className="list-item">{value}</div>);

const SortableList = SortableContainer(({items}) => {
  return (
    <div className="list sortable-list">
      {items.map((value, index) => (
        <SortableListItem index={index} key={index} value={value} />
      ))}
    </div>
  );
});

export default function SortableComponent({ sortCallback, data, helperClass, axis, useDragHandle, }) {
  function onSortEnd({oldIndex, newIndex}) {
    const newArray = arrayMove(data, oldIndex, newIndex)
    return sortCallback(newArray)
  };

  function onSortMove() {}

  return <SortableList axis={axis || 'y'} distance={2} helperClass={helperClass} items={data} onSortEnd={onSortEnd} onSortMove={onSortMove} useDragHandle={useDragHandle} />;
}
