// code courtesy of https://stackoverflow.com/questions/13949059/persisting-the-changes-of-range-objects-after-selection-in-html/13950376#13950376

const TEXT_TYPE = 3

const saveSelection = (containerEl) => {
  if (window.getSelection && document.createRange) {
    return saveSelectionForWindowSelection(containerEl)
  } else if (document.selection && document.body.createTextRange) {
    return saveSelectionForDocumentSelection(containerEl)
  }
}

const saveSelectionForWindowSelection = (containerEl) => {
  const range = window.getSelection().getRangeAt(0);
  const preSelectionRange = range.cloneRange();
  preSelectionRange.selectNodeContents(containerEl);
  preSelectionRange.setEnd(range.startContainer, range.startOffset);
  const start = preSelectionRange.toString().length;

  return {
    start: start,
    end: start + range.toString().length
  }
};

const saveSelectionForDocumentSelection = (containerEl) => {
  const selectedTextRange = document.selection.createRange();
  const preSelectionTextRange = document.body.createTextRange();
  preSelectionTextRange.moveToElementText(containerEl);
  preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange);
  const start = preSelectionTextRange.text.length;

  return {
    start: start,
    end: start + selectedTextRange.text.length
  }
}

const restoreSelection = (containerEl, savedSel) => {
  if (window.getSelection && document.createRange) {
    return restoreSelectionForWindowSelection(containerEl, savedSel)
  } else if (document.selection && document.body.createTextRange) {
    return restoreSelectionForDocumentSelection(containerEl, savedSel)
  }
}

const restoreSelectionForWindowSelection = (containerEl, savedSel) => {
  let charIndex = 0
  const range = document.createRange();
  range.setStart(containerEl, 0);
  range.collapse(true);
  const nodeStack = [containerEl]
  let node
  let foundStart = false
  let stop = false;

  while (!stop && (node = nodeStack.pop())) {
    if (node.nodeType === TEXT_TYPE) {
      const nextCharIndex = charIndex + node.length;
      if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
        range.setStart(node, savedSel.start - charIndex);
        foundStart = true;
      }
      if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
        range.setEnd(node, savedSel.end - charIndex);
        stop = true;
      }
      charIndex = nextCharIndex;
    } else {
      let i = node.childNodes.length;
      while (i--) { // eslint-disable-line no-plusplus
        nodeStack.push(node.childNodes[i]);
      }
    }
  }

  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

const restoreSelectionForDocumentSelection = (containerEl, savedSel) => {
  const textRange = document.body.createTextRange();
  textRange.moveToElementText(containerEl);
  textRange.collapse(true);
  textRange.moveEnd("character", savedSel.end);
  textRange.moveStart("character", savedSel.start);
  textRange.select();
};

export default { saveSelection, restoreSelection };
