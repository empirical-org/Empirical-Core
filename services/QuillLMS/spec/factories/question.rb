FactoryBot.define do
  data = {
    'conceptID' => 'Jl4ByYtUfo4VhIKpMt23yA',
    'cues' => [''],
    'cuesLabel' => '',
    'flag' => 'production',
    'focusPoints' => {
      '-LNLfzKfwaoZUVeSIH8o' => {
        'conceptResults' => {
          'Jl4ByYtUfo4VhIKpMt23yA' => {
            'conceptUID' => 'Jl4ByYtUfo4VhIKpMt23yA',
            'correct' => false,
            'name' => 'Structure | Compound Subjects, Objects, and Predicates | Compound Subjects'
          }
        },
        'feedback' => '<p>Revise your work. Use the hint as an example of how to combine the sentences.</p>',
        'order' => 1,
        'text' => 'and'
      }
    },
    'incorrectSequences' => {
      '0' => {
        'conceptResults' => {
          'GiUZ6KPkH958AT8S413nJg' => {
            'conceptUID' => 'GiUZ6KPkH958AT8S413nJg',
            'correct' => false,
            'name' => 'Conjunctions | Coordinating Conjunctions | Comma Before Coordinating Conjunctions'
          }
        },
        'feedback' => '<p>Revise your work. Look at the hint, and update your punctuation.</p>',
        'text' => 'ter [Bb]ut ([Ss]om|[Mm]os)|||[Bb]ut( )?,'
      },
      '1' => {
        'conceptResults' => {
          'tN84RPXWJwYBUh-LJn7xRA' => {
            'conceptUID' => 'tN84RPXWJwYBUh-LJn7xRA',
            'correct' => false,
            'name' => 'Adjectives & Adverbs | Adjective Structures | Paired Coordinate Adjectives'
          }
        },
        'feedback' => '<p>Revise your work. When two describing words can go in any order (like <em>warm</em> and <em>shallow</em>), join them with a comma.</p>',
        'text' => 'arm sha|||low war|||arm( )?(,)?( )?and( )?(,)?( )?sha|||low( )?(,)?( )?and( )?(,)?( )?war'
      },
      '2' => {
        'conceptResults' => {
          'Q8FfGSv4Z9L2r1CYOfvO9A' => {
            'conceptUID' => 'Q8FfGSv4Z9L2r1CYOfvO9A',
            'correct' => false,
            'name' => 'Conjunctions | Subordinating Conjunctions | Subordinating Conjunctions at the Beginning of a Sentence'
          }
        },
        'feedback' => '<p>Revise your work. Look at the hint, and update your punctuation.</p>',
        'text' => '^([Aa]lt|[Tt]ho|[Ee]ve|[Ww]hil)&&ter(s)? ([Ss]om|[Mm]os)'
      },
      '3' => {
        'conceptResults' => {
          'nb0JW1r5pRB5ouwAzTgMbQ' => {
            'conceptUID' => 'nb0JW1r5pRB5ouwAzTgMbQ',
            'correct' => false,
            'name' => 'Conjunctions | Subordinating Conjunctions | Subordinating Conjunction in the Middle of a Sentence'
          }
        },
        'feedback' => '<p>Revise your work. Look at the hint, and update your punctuation.</p>',
        'text' => ', ( )?([Aa]lt|[Ee]ve|[Tt]ho|[Ww]hil)'
      },
      '-Lg8q380379SvrQOz_kx' => {
        'conceptResults' => {
          'N5VXCdTAs91gP46gATuvPQ' => {
            'conceptUID' => 'N5VXCdTAs91gP46gATuvPQ',
            'correct' => false,
            'name' => 'Structure | Sentence Quality | Including Details From Prompt'
          }
        },
        'feedback' => '<p>Revise your work. Make <em>coral reef</em> plural to show that there&#x27;s more than one.</p>',
        'text' => 'reef(?!s)'
      },
      '-Lg8vs_PALeRY87EO1LU' => {
        'conceptResults' => {
          'QYHg1tpDghy5AHWpsIodAg' => {
            'conceptUID' => 'QYHg1tpDghy5AHWpsIodAg',
            'correct' => false,
            'name' => 'Structure | Sentence Quality | Writing Concise Sentences'
          }
        },
        'feedback' => '<p>Revise your work. Make your sentence more concise by removing the words <em>of them</em>.</p>',
        'text' => '(some|most) of them'
      },
      '-Lg9CmPJ3cF0IxX1YtbW' => {
        'conceptResults' => {
          'VvW4L8CA5Oi8N4aNQ7bFdg' => {
            'conceptUID' => 'VvW4L8CA5Oi8N4aNQ7bFdg',
            'correct' => false,
            'name' => 'Nouns & Pronouns | Pronoun Antecedent Agreement | Pronoun Reference'
          }
        },
        'feedback' => '<p>Revise your work. Move <em>coral reefs</em> earlier in the sentence so it&#x27;s clear what you&#x27;re talking about.</p>',
        'text' => '^([Mm]ost|[Ss]ome) form&&[Cc]or'
      },
      '-Lg9K-VWW12CozHkfTk5' => {
        'conceptResults' => {
          'QYHg1tpDghy5AHWpsIodAg' => {
            'conceptUID' => 'QYHg1tpDghy5AHWpsIodAg',
            'correct' => false,
            'name' => 'Structure | Sentence Quality | Writing Concise Sentences'
          }
        },
        'feedback' => '<p>Revise your work. Make your sentence more concise by only saying <em>reefs </em>once.</p>',
        'text' => 'but (some|most) ree&&ral re'
      }
    },
    'instructions' => '',
    'itemLevel' => '',
    'modelConceptUID' => 'Jl4ByYtUfo4VhIKpMt23yA',
    'prefilledText' => 'Earth and the moon are smaller than the sun.',
    'prompt' => '<p>The moon is smaller than the sun.</p><p>Earth is smaller than the sun.</p>'
  }
  factory :question do
    uid                   { SecureRandom.uuid }
    data                  data
    question_type         "connect_sentence_combining"
  end
end
