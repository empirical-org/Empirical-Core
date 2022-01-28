# frozen_string_literal: true

class ConceptReplacementConnectWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  def perform(original_concept_uid, new_concept_uid)
    replace_questions_in_connect('questions', original_concept_uid, new_concept_uid)
    replace_questions_in_connect('sentenceFragments', original_concept_uid, new_concept_uid)
    replace_questions_in_connect('fillInBlankQuestions', original_concept_uid, new_concept_uid)
    replace_questions_in_connect('diagnostic_questions', original_concept_uid, new_concept_uid)
    replace_questions_in_connect('diagnostic_sentenceFragments', original_concept_uid, new_concept_uid)
    replace_questions_in_connect('diagnostic_fillInBlankQuestions', original_concept_uid, new_concept_uid)
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def replace_questions_in_connect(endpoint, original_concept_uid, new_concept_uid)
    questions = HTTParty.get("#{ENV['FIREBASE_DATABASE_URL']}/v2/#{endpoint}.json").parsed_response
    questions.each do |key, q|
      data = q.deep_dup

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

      if !data.empty?
        HTTParty.put("#{ENV['FIREBASE_DATABASE_URL']}/v2/#{endpoint}/#{key}.json", body: data.to_json)
      end

    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  # rubocop:disable Metrics/CyclomaticComplexity
  def replace_focus_points_for_question(fp_obj, original_concept_uid, new_concept_uid)
    return if fp_obj.none? { |k, v| v['conceptResults'] && v['conceptResults'].any? { |crk, crv| crv['conceptUID'] == original_concept_uid } }

    new_fp_obj = fp_obj.deep_dup
    begin
      fp_obj.each do |k, v|
        v['conceptResults'].each do |crk, crv|
          if crv['conceptUID'] == original_concept_uid
            concept = Concept.unscoped.find_by(uid: new_concept_uid)
            parent_concept = concept.try(:parent)
            grandparent_concept = parent_concept.try(:parent)
            if concept && parent_concept && grandparent_concept
              name = "#{grandparent_concept.name} | #{parent_concept.name} | #{concept.name}"
              new_fp_obj[k]['conceptResults'][crk]['name'] = name
            end
            new_fp_obj[k]['conceptResults'][crk]['conceptUID'] = new_concept_uid
          end
        end
      end
    rescue => e
      NewRelic::Agent.notice_error(e)
    end
    new_fp_obj
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  # rubocop:disable Metrics/CyclomaticComplexity
  def replace_incorrect_sequences_for_question(is_array, original_concept_uid, new_concept_uid)
    return if is_array.none? { |is| is['conceptResults'] && is['conceptResults'].any? { |crk, crv| crv['conceptUID'] == original_concept_uid } }

    new_is_array = is_array.deep_dup

    begin
      is_array.each_with_index do |is, i|
        is['conceptResults'].each do |crk, crv|
          if crv['conceptUID'] == original_concept_uid
            concept = Concept.unscoped.find_by(uid: new_concept_uid)
            parent_concept = concept.try(:parent)
            grandparent_concept = parent_concept.try(:parent)
            if concept && parent_concept && grandparent_concept
              name = "#{grandparent_concept.name} | #{parent_concept.name} | #{concept.name}"
              new_is_array[i]['conceptResults'][crk]['name'] = name
            end
            new_is_array[i]['conceptResults'][crk]['conceptUID'] = new_concept_uid
          end
        end
      end
    rescue => e
      NewRelic::Agent.notice_error(e)
    end
    new_is_array
  end
  # rubocop:enable Metrics/CyclomaticComplexity
end
