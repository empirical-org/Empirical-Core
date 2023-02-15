import React from 'react';

export const linkStrategy = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
};

export const Link = ({ contentState, entityKey, children }) => {
  const { url } = contentState.getEntity(entityKey).getData();
  return (
    <a
      aria-label={url}
      className="link"
      href={url}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
};

const addLinkPlugin = {

  decorators: [
    {
      strategy: linkStrategy,
      component: Link
    }
  ]
};

export default addLinkPlugin;

