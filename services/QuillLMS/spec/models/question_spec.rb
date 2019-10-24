require 'rails_helper'

RSpec.describe Question, type: :model do
  let(:question) do
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
    Question.create(uid: SecureRandom.uuid, data: data)
  end
  let(:new_focus_point) do
    { 
      '-LlmyO0Cn9LPlVvCfRlW' => {
        'conceptResults' => {
          'asfdGCdbTy6l8xTe-_p6Qg' => {
            'conceptUID' => 'asfdGCdbTy6l8xTe-_p6Qg', 
            'correct' => false,
            'name' => 'Structure | Compound Subjects, Objects, & Predicates | Compound Predicates'
          }
        },
        'feedback' => '<p>Try again. Use <em>and</em> to combine the sentences.</p>', 
        'order' => 1,
        'text' => 'and'
      }
    }
  end
  let(:new_incorrect_sequence) do
    {
      '-LY3zIvRRkbFxdzf90ey' => {
        'conceptResults' => {
          'hJKqVOkQQQgfEsmzOWC1xw' => {
            'conceptUID' => 'hJKqVOkQQQgfEsmzOWC1xw', 
            'correct' => false,
            'name' => 'Conjunctions | Coordinating Conjunctions | And'
          }
        },
        'feedback' => '<p>That is not correct. Put <em>a</em> before both things.</p>', 
        'text' => 'e d|||e D|||e c|||e C|||d d|||d D|||d c|||d C'
      }
    }
  end

  describe '#add_focus_point' do
    it 'should increase the number of focus points' do
      starting_length = question.data['focusPoints'].keys.length
      question.add_focus_point(new_focus_point)
      expect(question.data['focusPoints'].keys.length).to eq(starting_length + 1)
    end

    it 'should put the new focus point in the data attribute' do
      uid = question.add_focus_point(new_focus_point)
      expect(question.data['focusPoints'][uid]).to eq(new_focus_point)
    end
  end

  describe '#set_focus_point' do
    it 'should return the passed uid' do
      uid = SecureRandom.uuid
      response = question.set_focus_point(uid, {})
      expect(response).to eq(uid)
    end

    it 'should set the value of the specified focusPoint' do
      replace_uid = question.data['focusPoints'].keys.first
      question.set_focus_point(replace_uid, new_focus_point)
      expect(question.data['focusPoints'][replace_uid]).to eq(new_focus_point)
    end
  end

  describe '#update_focus_points' do
    let(:update_data) { {foo: 'bar'} }
    it 'should change the contents of focusPoints' do
      question.update_focus_points(update_data)
      expect(question.data['focusPoints']).to eq(update_data)
    end
  end

  describe '#delete_focus_point' do
    it 'should remove the specified focusPoint' do
      first_focus_point_key = question.data['focusPoints'].keys.first
      question.delete_focus_point(first_focus_point_key)
      expect(question.data['focusPoints'][first_focus_point_key]).to be_nil
    end
  end

  describe '#update_flag' do
    it 'should change the value of the flag key' do
      new_val = 'foo'
      question.update_flag(new_val)
      expect(question.data['flag']).to eq(new_val)
    end
  end

  describe '#update_model_concept' do
    it 'should change the modelConceptUID key' do
      new_val = 'foo'
      question.update_model_concept(new_val)
      expect(question.data['modelConceptUID']).to eq(new_val)
    end
  end

  describe '#add_incorrect_sequence' do
    it 'should increase the number of incorrectSequences' do
      starting_length = question.data['incorrectSequences'].keys.length
      question.add_incorrect_sequence(new_incorrect_sequence)
      expect(question.data['incorrectSequences'].keys.length).to eq(starting_length + 1)
    end

    it 'should put the new incorrectSequence in the data attribute' do
      uid = question.add_incorrect_sequence(new_incorrect_sequence)
      expect(question.data['incorrectSequences'][uid]).to eq(new_incorrect_sequence)
    end
  end

  describe '#set_incorrect_sequence' do
    it 'should return the passed uid' do
      uid = SecureRandom.uuid
      response = question.set_incorrect_sequence(uid, {})
      expect(response).to eq(uid)
    end

    it 'should set the value of the specified incorrectSequence' do
      replace_uid = question.data['incorrectSequences'].keys.first
      question.set_incorrect_sequence(replace_uid, new_incorrect_sequence)
      expect(question.data['incorrectSequences'][replace_uid]).to eq(new_incorrect_sequence)
    end
  end

  describe '#update_incorrect_sequences' do
    let(:update_data) { {foo: 'bar'} }
    it 'should change the contents of incorrectSequences' do
      question.update_incorrect_sequences(update_data)
      expect(question.data['incorrectSequences']).to eq(update_data)
    end
  end
end
