class ConceptReplacementConnectWorker
  include Sidekiq::Worker

  def perform(original_concept_uid, new_concept_uid)
    replace_questions_in_connect('questions', original_concept_uid, new_concept_uid)
    replace_questions_in_connect('sentenceFragments', original_concept_uid, new_concept_uid)
    replace_questions_in_connect('fillInBlankQuestions', original_concept_uid, new_concept_uid)
    replace_questions_in_connect('diagnostic_questions', original_concept_uid, new_concept_uid)
    replace_questions_in_connect('diagnostic_sentenceFragments', original_concept_uid, new_concept_uid)
    replace_questions_in_connect('diagnostic_fillInBlankQuestions', original_concept_uid, new_concept_uid)
  end

  def replace_questions_in_connect(endpoint, original_concept_uid, new_concept_uid)
    questions = HTTParty.get("#{ENV['FIREBASE_DATABASE_URL']}/v2/#{endpoint}").parsed_response
    questions.each do |key, q|
      data = {}

      if q['conceptID'] && q['conceptID'] == original_concept_uid
        data['conceptID'] = new_concept_uid
      end

      if q['modelConceptUID'] && q['modelConceptUID'] == original_concept_uid
        data['modelConceptUID'] = new_concept_uid
      end

      if q['focusPoints']
        focus_points = replace_focus_points_for_question(q['focusPoints'], original_concept_uid, new_concept_uid)
        if focus_points
          data['focusPoints'] = focus_points
        end
      end

      if q['incorrectSequences']
        incorrect_sequences = replace_incorrect_sequences_for_question(q['incorrectSequences'], original_concept_uid, new_concept_uid)
        if incorrect_sequences
          data['incorrectSequences'] = incorrect_sequences
        end
      end

      if data.length > 0
        HTTParty.put("#{ENV['FIREBASE_DATABASE_URL']}/v2/#{endpoint}/#{key}", body: data.to_json)
      end

    end
  end

  def replace_focus_points_for_question(focus_points, original_concept_uid, new_concept_uid)
    if focus_points.any { |fp| fp['conceptUID'] == original_concept_uid }
      new_focus_points = focus_points.dup
      focus_points.each do |key, fp|
        if fp['conceptUID'] == original_concept_uid
          new_focus_points[key]['conceptUID'] = new_concept_uid
        end
      end
      return new_focus_points
    else
      return nil
    end
  end

  def replace_incorrect_sequences_for_question(incorrect_sequences, original_concept_uid, new_concept_uid)
    if incorrect_sequences.any { |is| is['conceptResults'].any { |cr| cr['conceptUID'] == original_concept_uid} }
      new_incorrect_sequences = incorrect_sequences.dup
      incorrect_sequences.each do |key, is|
        is['conceptResults'].each do |crkey, cr|
          if cr['conceptUID'] == original_concept_uid
            new_incorrect_sequences[key]['conceptResults'][crkey]['conceptUID'] = new_concept_uid
          end
        end
      end
      return new_incorrect_sequences
    else
      return nil
    end
  end


end
