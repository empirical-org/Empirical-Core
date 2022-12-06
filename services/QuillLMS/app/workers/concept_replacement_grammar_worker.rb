# frozen_string_literal: true

class ConceptReplacementGrammarWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  # rubocop:disable Metrics/CyclomaticComplexity
  def perform(original_concept_uid, new_concept_uid)
    activities = HTTParty.get("#{ENV['FIREBASE_DATABASE_URL']}/v3/grammarActivities.json").parsed_response
    activities.each do |key, act|
      if act['concepts'] && act['concepts'].keys.include?(original_concept_uid)
        new_concepts = act['concepts'].dup
        new_concepts[new_concept_uid] = new_concepts[original_concept_uid]
        new_concepts.delete(original_concept_uid)
        HTTParty.put("#{ENV['FIREBASE_DATABASE_URL']}/v3/grammarActivities/#{key}/concepts.json", body: new_concepts.to_json)
      end
    end
    questions = HTTParty.get("#{ENV['FIREBASE_DATABASE_URL']}/v3/questions.json").parsed_response
    questions.each do |key, q|
      data = q.deep_dup

      if q['concept_uid'] && q['concept_uid'] == original_concept_uid
        data['concept_uid'] = new_concept_uid
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

      if !data.empty?
        HTTParty.put("#{ENV['FIREBASE_DATABASE_URL']}/v3/questions/#{key}.json", body: data.to_json)
      end
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  # rubocop:disable Metrics/CyclomaticComplexity
  def replace_focus_points_or_incorrect_sequences_for_question(fp_or_is, original_concept_uid, new_concept_uid)
    return unless fp_or_is.any? { |k, v| v['conceptResults'] && v['conceptResults'].any? { |crk, crv| crv['conceptUID'] == original_concept_uid } }

    new_fp_or_is = fp_or_is.deep_dup
    begin
      fp_or_is.each do |k, v|
        v['conceptResults'].each do |crk, crv|
          if crv['conceptUID'] == original_concept_uid
            concept = Concept.unscoped.find_by(uid: new_concept_uid)
            parent_concept = concept.try(:parent)
            grandparent_concept = parent_concept.try(:parent)
            if concept && parent_concept && grandparent_concept
              name = "#{grandparent_concept.name} | #{parent_concept.name} | #{concept.name}"
              new_fp_or_is[k]['conceptResults'][crk]['name'] = name
            end
            new_fp_or_is[k]['conceptResults'][crk]['conceptUID'] = new_concept_uid
          end
        end
      end
    rescue => e
      ErrorNotifier.report(e)
    end
    new_fp_or_is
  end
  # rubocop:enable Metrics/CyclomaticComplexity
end
