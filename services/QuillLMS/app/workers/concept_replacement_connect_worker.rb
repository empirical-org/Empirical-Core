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
        focus_points = replace_focus_points_or_incorrect_sequences_for_question(q['focusPoints'], original_concept_uid, new_concept_uid)
        if focus_points
          data['focusPoints'] = focus_points
        end
      end

      if q['incorrectSequences']
        incorrect_sequences = replace_focus_points_or_incorrect_sequences_for_question(q['incorrectSequences'], original_concept_uid, new_concept_uid)
        if incorrect_sequences
          data['incorrectSequences'] = incorrect_sequences
        end
      end

      if data.length > 0
        HTTParty.put("#{ENV['FIREBASE_DATABASE_URL']}/v2/#{endpoint}/#{key}", body: data.to_json)
      end

    end
  end

  def replace_focus_points_or_incorrect_sequences_for_question(fp_or_is, original_concept_uid, new_concept_uid)
    if fp_or_is.any { |k, v| v['conceptResults'] && v['conceptResults'].any { |cr| cr['conceptUID'] == original_concept_uid} }
      new_fp_or_is = fp_or_is.dup
      fp_or_is.each do |k, v|
        v['conceptResults'].each do |crkey, cr|
          if cr['conceptUID'] == original_concept_uid
            new_fp_or_is[k]['conceptResults'][crkey]['conceptUID'] = new_concept_uid
          end
        end
      end
      return new_fp_or_is
    else
      return nil
    end
  end


end
