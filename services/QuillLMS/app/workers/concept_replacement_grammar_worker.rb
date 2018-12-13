class ConceptReplacementGrammarWorker
  include Sidekiq::Worker

  def perform(original_concept_uid, new_concept_uid)
    activities = HTTParty.get("#{ENV['FIREBASE_DATABASE_URL']}/v3/grammarActivities.json").parsed_response
    activities.each do |key, act|
      if act['concepts'] && acts['concepts'].keys.include?(original_concept_uid)
        new_concepts = act['concepts'].dup
        new_concepts[new_concept_uid] = new_concepts[original_concept_uid]
        new_concepts.delete(original_concept_uid)
        new_concepts_hash = { concepts: new_concepts }
        HTTParty.put("#{ENV['FIREBASE_DATABASE_URL']}/v3/grammarActivities/#{key}.json", body: new_concepts_hash.to_json)
      end
    end
    questions = HTTParty.get("#{ENV['FIREBASE_DATABASE_URL']}/v3/questions.json").parsed_response
    concept_uid_hash = {concept_uid: new_concept_uid}
    questions.each do |key, q|
      if q['concept_uid'] == original_concept_uid
        HTTParty.put("#{ENV['FIREBASE_DATABASE_URL']}/v3/questions/#{key}.json", body: concept_uid_hash.to_json)
      end
    end
  end

end
