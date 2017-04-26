const buttonText = {
  'submit button text': 'Enviar',
  'resume button text': 'Reanudo',
  'begin button text': 'Comienzo',
  'continue button text': 'Continuar',
  'sentence fragment complete button': 'Completa la oración',
  'sentence fragment incomplete button': 'Oración incompleta',
};

const titleCards = {
  'fill in multiple blanks title card': '<h3>Completa el Espacio en Blanco: A, An, The</h3><p>En esta sección, cada oración tendrá dos o tres espacios en blanco.</p><p>Volverás a escribir la oración, rellenando el espacio en blanco con una de las palabras de una lista o eligiendo que no se necesite ninguna palabra en el espacio en blanco.</p>',
  'fill in single blanks title card': '<h3>Completa el Espacio en Blanco</h3><p>¡Ya estás en la mitad del camino! En esta sección, elige la palabra más adecuada para completar la oración. Vuelve a escribir la oración, completando el espacio en blanco con una de las palabras de la lista.</p>',
  'sentence fragments title card': '<h3>Oraciones Completas</h3><p>En esta sección, agregarás un grupo de palabras para formar una oración. Trata de agregar el menor número posible de palabras.</p><p>¡Comencemos!</p>',
  'tense title card': '<h3>Tiempo del Verbo: Pasado, Presente y Futuro</h3><p>En esta sección, corrige las oraciones conjugando el verbo en el tiempo que sea adecuado para que coincida con el resto de la oración.</p><p>¡Lo estas haciendo excelente!</p>',
  'sentence combining title card': '<h3>Combinación de Oraciones</h3><p>En esta sección, combina las oraciones para formar una sola oración.</p><p>En algunas ocasiones, podrás elegir de las conjunciones que se te presenten para combinar las oraciones. En otras ocasiones, combinarás las oraciones de la manera que tu consideres que sea mejor.</p><p>Agrega o cambia palabras únicamente si es necesario y trata de mantener el mismo significado de las oraciones.</p><p>¡Tu puedes hacerlo!</p>',
  'diagnostic intro text': '<h1>Quill Placement Actividad</h1><p>Estas por responder 22 preguntas sobre oraciones. No te preocupes, esto no es un examen. Solo sirve para saber lo que ya sabes.</p><p className="second-p">Algunas de las preguntas no las vas a ver aprendido antes, esta bien! No te preocupes. Solo responde las preguntas con tu mayor esfuerzo. Una ves que terminaste estas preguntas, Quill va a diseñar un plan de estudio solo para vos!</p>',
  'completion page': '<h1>As terminado el ejercicio de Quill Placement</h1><p>Tus resultados están sido guardados ahora. Cuando se terminan de archivar te vamos a enviar a la próxima pagina.</p>',
};

const instructions = {
  'sentence-fragment-complete-vs-incomplete-button-choice-instructions': 'Esta oración esta complete o incompleta?',
  'sentence-fragment-complete-vs-incomplete-choice-instructions': 'Si es una oración completa, aprieta el botón que dice “enviar”. Si es una oración incompleta, complete la oración ahora.',
  'sentence-fragment-complete-vs-incomplete-completion-instructions': 'Añadir al grupo de palabras para hacer una oración completa. Añada el menor número posible de palabras.',
  'fill-in-the-blank-multiple-instructions': 'Completa el espacio en blanco con una de estas palabras: a, an, the. Si no se necesita ninguna palabra, quite el espacio en blanco.',
  'tense-question-instructions': 'Vuelve a escribir la oración. Conjuga el verbo resaltado en negro al tiempo correcto para que coincida con el resto de la oración.',
  'fill-in-the-blank-single-instructions': 'Vuelve a escribir la oración y completa el espacio en blanco con una de estas palabras: on, in, at, to',
  'combine-sentences-instructions': 'Combina las oraciones a una sola oración.',
  'combine-sentences-with-joining-words-instructions': 'Combina las oraciones, usando una de las palabras sumarias.',
};

const scaffolds = {
  'joining word cues single': 'palabras sumarias',
  'joining word cues multiple': 'palabras sumarias',
  'add word bank cue': ''
};

const spanishTranslation = {
  ...instructions,
  ...titleCards,
  ...buttonText,
  ...scaffolds,
};

export default spanishTranslation;
