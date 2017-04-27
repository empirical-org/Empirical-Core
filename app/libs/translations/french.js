const buttonText = {
  'submit button text': 'Soumettre',
  'resume button text': 'Reprendre',
  'begin button text': 'Commencer',
  'continue button text': 'Continuer',
  'sentence fragment complete button': 'complète',
  'sentence fragment incomplete button': 'incomplète',
};

const titleCards = {
  'fill in multiple blanks title card': "<h1>Remplissez le blanc: A, An, The</h1><p>Dans cette section, chaque phrase aura deux ou trois cases en blanc.</p><p>Vous réécrivez la phrase, remplissez le blanc avec l'un des mots d'une liste ou choisissez qu'il n'y a pas de mot dans l'espace vierge.</p>",
  'fill in single blanks title card': "<h1>Remplissez le Blanc</h1><p>Vous êtes à mi-chemin! Dans cette section, vous choisirez le meilleur mot pour compléter une phrase. Vous réécrivez une phrase, en remplissant le blanc avec l'un des mots d'une liste.</p>",
  'sentence fragments title card': '<h1>Compléter les phrases</h1><p>Dans cette section, vous allez ajouter un groupe de mots pour faire une phrase complète. Ajoutez le moins de mots possible.</p><p>Commençons!</p>',
  'tense title card': "<h1>Passé, présent et futur</h1><p>Dans cette section, vous corrigez les phrases en mettant le verbe dans le juste temps pour correspondre au reste de la phrase. Vous êtes très heureux jusqu'à présent!</p>",
  'sentence combining title card': "<h1>Combinaison de phrases</h1><p>Dans cette section, vous combinerez les phrases en une seule phrase.</p><p>Parfois, vous recevrez des mots d'union pour choisir, et parfois vous devrez choisir votre propre façon de combiner les phrases.</p><p>N'ajoutez ou ne changez que des mots quand vous le souhaitez, et essayez de garder le sens des phrases le même.</p><p>Vous avez cela!</p>",
  'diagnostic intro text': "<h1>Activité de plombage</h1><p>Vous allez répondre à 22 questions sur l'écriture de phrases. Ne vous inquiétez pas, ce n'est pas un test. C'est juste pour comprendre ce que vous savez.</p><p>Certaines des questions pourraient être sur des choses que vous n'avez pas encore appris - c'est bon! Il suffit de leur répondre le mieux que vous le pouvez.</p><p>Une fois que vous avez terminé, Quill va créer un plan d'apprentissage pour vous!</p>",
  'completion page': "<h1>Vous avez terminé l'activité Quill Placement!</h1><p>Vos résultats sont enregistrés maintenant. Vous serez redirigé automatiquement une fois qu'ils sont enregistrés.</p>",
};

const instructions = {
  'sentence-fragment-complete-vs-incomplete-button-choice-instructions': '',
  'sentence-fragment-complete-vs-incomplete-choice-instructions': '',
  'sentence-fragment-complete-vs-incomplete-completion-instructions': "Ajouter au groupe de mots pour faire une phrase complète. Ajoutez le moins de mots possible.",
  'fill-in-the-blank-multiple-instructions': "Remplissez le blanc avec l'un de ces articles: a, an, the. Si aucun article n'est nécessaire, retirez le blanc.",
  'fill-in-the-blank-single-instructions': "Remplissez le blanc avec l'un de ces mots: on, in, at, to",
  'tense-question-instructions': "Réécrivez la phrase. Corrigez le verbe en gras, de sorte qu'il soit dans le juste temps pour correspondre au reste de la phrase.",
  'combine-sentences-instructions': "Combinez les phrases en une seule phrase.",
  'combine-sentences-with-joining-words-instructions': "Combinez les phrases en une seule phrase. Utilisez l'un des mots de jointure.",
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
