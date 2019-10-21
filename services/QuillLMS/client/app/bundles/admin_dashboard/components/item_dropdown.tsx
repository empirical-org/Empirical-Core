import * as React from 'react'
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import _ from 'underscore';

interface ItemDropdownProps {
  items: Array<Item>;
  callback(selectedItem: Item): void;
  selectedItem: string;
}

interface Item {
  id: string;
  name: string;
}

const ItemDropdown: React.SFC<ItemDropdownProps> = ({
  items,
  callback,
  selectedItem
}) => {
  const dropdownItems = () => {
    return items.map((item) => {
      if (!item.id) {
        return (
          <MenuItem
            eventKey={item}
            key={item}
          >
            {item.name || item}
          </MenuItem>
        );
      }
      return (
        <MenuItem
          eventKey={item.id}
          key={item.id}
        >
          {item.name}
        </MenuItem>
      );
    })
  };

  const findItemByIdOrName = (idOrName) => {
    return _.find(items, (c) => {
      if (!c.id) {
        return c === idOrName;
      }
      return c.id === idOrName;
    });
  };

  const handleSelect = (itemId) => {
    let selectedItem = findItemByIdOrName(itemId);
    callback(selectedItem);
  };

  return (
    <DropdownButton
      bsStyle='default'
      className='select-item-dropdown'
      disabled={!items.length}
      onSelect={handleSelect}
      title={selectedItem}
    >
      {dropdownItems()}
    </DropdownButton>
  );
};

export default ItemDropdown;
