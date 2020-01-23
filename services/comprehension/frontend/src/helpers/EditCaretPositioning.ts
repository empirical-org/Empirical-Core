// code courtesy of https://stackoverflow.com/questions/13949059/persisting-the-changes-of-range-objects-after-selection-in-html/13950376#13950376

const EditCaretPositioning = {}

if (window.getSelection && document.createRange) {
    //saves caret position(s)
    EditCaretPositioning.saveSelection = (containerEl) => {
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
    //restores caret position(s)
    EditCaretPositioning.restoreSelection = (containerEl, savedSel) => {
        let charIndex = 0
        const range = document.createRange();
        range.setStart(containerEl, 0);
        range.collapse(true);
        const nodeStack = [containerEl]
        let node
        let foundStart = false
        let stop = false;

        while (!stop && (node = nodeStack.pop())) {
          if (node.nodeType === 3) {
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
              while (i=-1) { // eslint-disable-line no-cond-assign
                  nodeStack.push(node.childNodes[i]);
              }
          }
      }

      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
} else if (document.selection && document.body.createTextRange) {
  //saves caret position(s)
    EditCaretPositioning.saveSelection = (containerEl) => {
        const selectedTextRange = document.selection.createRange();
        const preSelectionTextRange = document.body.createTextRange();
        preSelectionTextRange.moveToElementText(containerEl);
        preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange);
        const start = preSelectionTextRange.text.length;

        return {
            start: start,
            end: start + selectedTextRange.text.length
        }
    };
    //restores caret position(s)
    EditCaretPositioning.restoreSelection = (containerEl, savedSel) => {
        const textRange = document.body.createTextRange();
        textRange.moveToElementText(containerEl);
        textRange.collapse(true);
        textRange.moveEnd("character", savedSel.end);
        textRange.moveStart("character", savedSel.start);
        textRange.select();
    };
}

export default EditCaretPositioning;
