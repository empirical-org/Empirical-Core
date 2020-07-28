const buttonText = {
  'submit button text': 'Envoyer',
  'resume button text': 'Reprendre',
  'begin button text': 'Commencer',
  'continue button text': 'Continuer',
  'sentence fragment complete button': 'complète',
  'sentence fragment incomplete button': 'incomplète',
};

const titleCards = {
  'titlecard-ell-fill-in-multiple-blanks': "<h1>Remplir les espaces vides: A, An, The</h1><p>Dans cette section, chaque phrase aura deux ou trois cases espaces vides.</p><p>Vous devez remplir l’espace vide avec l’un des mots d’une liste ou laissez l'espace vide si aucun mot n’est nécessaire.</p>",
  'titlecard-ell-fill-in-single-blank': "<h1>Remplir l’espace vide</h1><p>Vous en êtes à la moitié des questions ! Dans cette section, vous devez choisir le meilleur mot pour terminer une phrase. Remplissez l’espace vide avec l’un des mots d’une liste.</p>",
  'titlecard-ell-complete-sentences': '<h1>Phrases complètes</h1><p>Dans cette section, vous devez ajouter un ou plusieurs mots à un groupe de mots pour constituer une phrase complète. Ajoutez aussi peu de mots que possible.</p><p>C’est parti !</p>',
  'titlecard-ell-past-present-and-future-tense': "<h1>Temps passé, présent et futur</h1><p>Dans cette section, vous devez corriger les phrases en mettant le verbe au temps approprié en fonction du reste de la phrase. Vous vous débrouillez très bien jusqu’à présent !</p>",
  'titlecard-ell-sentence-combining': "<h1>Combiner de phrases</h1><p>Dans cette section, vous devez combiner plusieurs phrases en une seule.</p><p>Dans certains cas, on vous laissera choisir parmi des mots de liaison, et parfois vous devrez choisir un moyen de combiner les phrases par vous-même.</p><p>Vous devez seulement ajouter ou modifier des mots lorsque vous en avez besoin, tout en essayant de conserver le sens des phrases.</p><p>Vous y êtes !</p>",
  'diagnostic intro text': "<h1>Activité de placement Quill</h1><p>Vous allez répondre à 21 questions sur la rédaction de phrases. Ne vous inquiétez pas, ce n’est pas un contrôle. C’est juste pour déterminer ce que vous savez.</p><p>Certaines questions portent sur des sujets que vous n’avez pas encore appris, donc ne vous faites pas de soucis ! Répondez-y tout simplement de votre mieux.</p><p>Une fois que vous aurez terminé, Quill vous créera un plan d’apprentissage personnalisé !</p>",
  'completion page': "<h1>Vous avez terminé l’Activité de placement Quill !</h1><p>Vos résultats vont maintenant être enregistrés. Vous serez redirigé(e) automatiquement une fois qu’ils seront enregistrés.</p>",
};

const instructions = {
  'sentence-fragment-complete-vs-incomplete-button-choice-instructions': '',
  'sentence-fragment-complete-vs-incomplete-choice-instructions': '',
  'sentence-fragment-complete-vs-incomplete-completion-instructions': 'Ajoutez un ou plusieurs mots au groupe de mots pour constituer une phrase complète. Ajoutez aussi peu de mots que possible.',
  'fill-in-the-blank-multiple-instructions': "Remplissez l’espace vide avec l’un des mots ci-dessus. Si aucun mot n’est nécessaire, laissez l’espace vide.",
  'fill-in-the-blank-single-instructions': "Remplissez l’espace vide avec l’un des mots ci-dessus.",
  'tense-question-instructions': "Réécrivez la phrase. Corrigez le verbe en caractères gras pour qu’il soit au temps approprié en fonction du reste de la phrase.",
  'combine-sentences-instructions': "Combinez les phrases en une seule phrase.",
  'combine-sentences-with-joining-words-instructions': "Combinez les phrases en une seule phrase. Utilisez l’un des mots de liaison.",
};

const scaffolds = {
  'joining word cues single': 'joindre des mots',
  'joining word cues multiple': 'joindre des mots',
  'add word bank cue': 'Ajouter des mots.'
};

const frenchTranslation = {
  ...instructions,
  ...titleCards,
  ...buttonText,
  ...scaffolds,
};

export default frenchTranslation;
