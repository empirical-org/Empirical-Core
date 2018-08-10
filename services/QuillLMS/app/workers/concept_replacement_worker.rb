class ConceptReplacementWorker
  include Sidekiq::Worker

  def perform(original_concept_id, new_concept_id)
    original_concept = Concept.find(original_concept_id)
    new_concept = Concept.find(new_concept_id)

    replace_in_lms(original_concept_id, new_concept_id)
    replace_in_cms(original_concept.uid, new_concept.uid)
  end

  def replace_in_lms(original_concept_id, new_concept_id)
    ConceptResult.where(concept_id: original_concept_id).update_all(concept_id: new_concept_id)
  end

  def replace_in_cms(original_concept_uid, new_concept_uid)
    data = {
      new_concept_uid: new_concept_uid,
      original_concept_uid: original_concept_uid
    }
    HTTParty.put("#{ENV['CMS_URL']}/responses/replace_concept_uids", body: data.to_json)
  end

  def replace_in_grammar(original_concept_uid, new_concept_uid)
    activities = HTTParty.get("#{ENV['FIREBASE_GRAMMAR_DATABASE_URL']}/v3/grammarActivities", body: data.to_json).parsed_response
    activities.each do |key, act|
      if act['concepts'].keys.include?(original_concept_uid)
        new_concepts = act['concepts'].dup
        new_concepts[new_concept_uid] = new_concepts[original_concept_uid]
        new_concepts.delete(original_concept_uid)
        new_concepts_hash = { concepts: new_concepts }
        HTTParty.put("#{ENV['FIREBASE_GRAMMAR_DATABASE_URL']}/v3/grammarActivities/#{key}", body: new_concepts_hash.to_json)
      end
    end
    questions = HTTParty.get("#{ENV['FIREBASE_GRAMMAR_DATABASE_URL']}/v3/questions", body: data.to_json).parsed_response
    concept_uid_hash = {concept_uid: new_concept_uid}
    questions.each do |key, q|
      if q['concept_uid'] == original_concept_uid
        HTTParty.put("#{ENV['FIREBASE_GRAMMAR_DATABASE_URL']}/v3/questions/#{key}", body: concept_uid_hash.to_json)
      end
    end
  end

  def replace_in_connect(original_concept_uid, new_concept_uid)
    HTTParty.get("#{ENV['FIREBASE_DATABASE_URL']}/responses/replace_concept_uids", body: data.to_json).parsed_response
  end

end
