
function adjustTextareaHeight(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = (textarea.scrollHeight) + 'px';
}

function clickedSaveButton(id) {
  const row = document.getElementById(`translated-text-${id}`);
  const newText = row.querySelector('.edit-input').value;

  fetch(`/translated_texts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
    },
    body: JSON.stringify({ translated_text: { translation: newText } })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        row.querySelector('.text-content').innerHTML = data.translation;

        updateDisplays(row, {
          'text-content' : 'inline',
          'edit-input' : 'none',
          'edit-btn' : 'inline-block',
          'save-btn' : 'none',
          'cancel-btn' : 'none'
        })
      } else {
        alert('Failed to update the translation');
      }
    })
    .catch(error => {
      alert('An error occurred while updating the translation');
    });
}

function clickedEditButton(id) {
  const row = document.getElementById(`translated-text-${id}`);
  updateDisplays(row, {
    'text-content' : 'none',
    'edit-input' : 'block',
    'edit-btn' : 'none',
    'save-btn' : 'inline-block',
    'cancel-btn' : 'inline-block'
  })
  const editInput = row.querySelector('.edit-input');
  editInput.focus();
}

function clickedCancelButton(id) {
  const row = document.getElementById(`translated-text-${id}`);
  updateDisplays(row, {
    'text-content' : 'inline',
    'edit-input' : 'none',
    'edit-btn' : 'inline-block',
    'save-btn' : 'none',
    'cancel-btn' : 'none'
  })
}

function updateDisplays(row, displayValues) {
  Object.entries(displayValues).forEach(([elementClass, displayValue]) => {
    row.querySelector('.' + elementClass).style.display = displayValue;
  })
}

enum ButtonClicked {
  Edit, Cancel, Save
}

function buttonClicked(event): ButtonClicked {
  const target = event.target;
  if (target.classList.contains('edit-btn')) {
    return ButtonClicked.Edit
  }

  if (target.classList.contains('cancel-btn')) {
    return ButtonClicked.Cancel
  }

  if (target.classList.contains('save-btn')) {
    return ButtonClicked.Save
  }
}

function initializeTranslatedTexts() {
  const table = document.querySelector('table');

  if (!table) return; // Exit if there's no table on the page

  table.addEventListener('click', (event) => {
    const id = event.target.dataset.id;

    switch (buttonClicked(event)) {
      case ButtonClicked.Edit:
        clickedEditButton(id);
        break;
      case ButtonClicked.Cancel:
        clickedCancelButton(id);
        break;
      case ButtonClicked.Save:
        clickedSaveButton(id);
        break;
    }
  });
}

document.addEventListener('DOMContentLoaded', initializeTranslatedTexts);
