function adjustTextareaHeight(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = (textarea.scrollHeight) + 'px';
}

function initializeTranslatedTexts() {
  const table = document.querySelector('table');

  if (!table) return; // Exit if there's no table on the page

  table.addEventListener('click', (event) => {
    const target = event.target;
    const id = target.dataset.id;

    if (target.classList.contains('edit-btn')) {
      const row = document.getElementById(`translated-text-${id}`);
      const textContent = row.querySelector('.text-content');
      const editInput = row.querySelector('.edit-input');

      textContent.style.display = 'none';
      editInput.style.display = 'block';
      row.querySelector('.edit-btn').style.display = 'none';
      row.querySelector('.save-btn').style.display = 'inline-block';
      row.querySelector('.cancel-btn').style.display = 'inline-block';

      editInput.focus();
    }

    if (target.classList.contains('cancel-btn')) {
      const row = document.getElementById(`translated-text-${id}`);
      row.querySelector('.text-content').style.display = 'inline';
      row.querySelector('.edit-input').style.display = 'none';
      row.querySelector('.edit-btn').style.display = 'inline-block';
      row.querySelector('.save-btn').style.display = 'none';
      row.querySelector('.cancel-btn').style.display = 'none';
    }

    if (target.classList.contains('save-btn')) {
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
            row.querySelector('.text-content').innerHTML = newText;
            row.querySelector('.text-content').style.display = 'inline';
            row.querySelector('.edit-input').style.display = 'none';
            row.querySelector('.edit-btn').style.display = 'inline-block';
            row.querySelector('.save-btn').style.display = 'none';
            row.querySelector('.cancel-btn').style.display = 'none';
          } else {
            alert('Failed to update the translation');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('An error occurred while updating the translation');
        });
    }
  });
}

// Try to run the initialization immediately
initializeTranslatedTexts();

// Also run on turbolinks:load if it exists
document.addEventListener('turbolinks:load', initializeTranslatedTexts);

// For cases where neither immediate execution nor turbolinks work,
// fall back to DOMContentLoaded
document.addEventListener('DOMContentLoaded', initializeTranslatedTexts);
