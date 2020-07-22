const buttonText = {
  'submit button text': 'Enviar',
  'resume button text': 'Reanudo',
  'begin button text': 'Comienzo',
  'continue button text': 'Continuar',
  'sentence fragment complete button': 'Completa la oración',
  'sentence fragment incomplete button': 'Oración incompleta',
};

const titleCards = {
  'titlecard-ell-fill-in-multiple-blanks': '<h3>Completa el Espacio en Blanco: A, An, The</h3><p>En esta sección, cada oración tendrá dos o tres espacios en blanco.</p><p>Completa el espacio en blanco con una de las palabras en la lista o deja el espacio en blanco si no es necesario insertar una palabra.</p>',
  'titlecard-ell-fill-in-single-blank': '<h3>Completa el Espacio en Blanco</h3><p>¡Ya estás en la mitad del camino! En esta sección, elige la palabra más adecuada para completar la oración. Posteriormente, llenarás el espacio en blanco con una de las palabras en la lista.</p>',
  'titlecard-ell-complete-sentences': '<h3>Oraciones Completas</h3><p>En esta sección, agregarás un grupo de palabras para formar una oración. Trata de agregar el menor número posible de palabras.</p><p>¡Comencemos!</p>',
  'titlecard-ell-past-present-and-future-tense': '<h3>Tiempo del Verbo: Pasado, Presente y Futuro</h3><p>En esta sección, corrige las oraciones conjugando el verbo en el tiempo que sea adecuado para que coincida con el resto de la oración.</p><p>¡Lo estas haciendo excelente!</p>',
  'titlecard-ell-sentence-combining': '<h3>Combinación de Oraciones</h3><p>En algunas ocasiones podrás elegir de las conjunciones que se te presenten para combinar las oraciones. En otras ocasiones, combinarás las oraciones de la manera que tu consideres que sea mejor.</p><p>Agrega o cambia palabras únicamente si es necesario y trata de mantener el mismo significado de las oraciones.</p><p>¡Tu puedes hacerlo!</p>',
  'diagnostic intro text': '<h1>Actividad de Aptitud de Quill</h1><p>A continuación responderás 21 preguntas sobre escribir oraciones. No hay de qué preocuparse, ya que esto no es un examen. Es solo una actividad cuyo objetivo es descifrar tu conocimiento. </p><p className="second-p">Es posible que alguna de las preguntas no las hayas aprendido anteriormente.  Está bien, no te preocupes.  Solo trata de responder las preguntas con el mayor esfuerzo posible. Una vez que termines de responder estas preguntas, Quill diseñará un plan de estudio personalizado para ti.</p>',
  'completion page': '<h1>As terminado el ejercicio de Quill Placement</h1><p>Tus resultados están sido guardados ahora. Cuando se terminan de archivar te vamos a enviar a la próxima pagina.</p>',
};

const instructions = {
  'sentence-fragment-complete-vs-incomplete-button-choice-instructions': 'Esta oración esta complete o incompleta?',
  'sentence-fragment-complete-vs-incomplete-choice-instructions': 'Si es una oración completa, aprieta el botón que dice “enviar”. Si es una oración incompleta, complete la oración ahora.',
  'sentence-fragment-complete-vs-incomplete-completion-instructions': 'Añadir al grupo de palabras para hacer una oración completa. Añada el menor número posible de palabras.',
  'fill-in-the-blank-multiple-instructions': 'Completa el espacio en blanco con una de las palabras de arriba. Si no es necesario insertar una palabra, deja el espacio en blanco.',
  'tense-question-instructions': 'Vuelve a escribir la oración. Conjuga el verbo resaltado en negro al tiempo correcto para que coincida con el resto de la oración.',
  'fill-in-the-blank-single-instructions': 'Completa el espacio en blanco con una las palabras de arriba.',
  'combine-sentences-instructions': 'Combina las oraciones a una sola oración.',
  'combine-sentences-with-joining-words-instructions': 'Combina las oraciones a una sola oración, utilizando una de las conjunciones.',
};

const scaffolds = {
  'joining word cues single': 'palabras sumarias',
  'joining word cues multiple': 'palabras sumarias',
  'add word bank cue': 'Añadir palabras.',
};

const spanishTranslation = {
  ...instructions,
  ...titleCards,
  ...buttonText,
  ...scaffolds,
};

export default spanishTranslation;
