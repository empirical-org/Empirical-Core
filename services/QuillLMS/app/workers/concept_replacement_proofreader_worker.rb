class ConceptReplacementProofreaderWorker
  include Sidekiq::Worker

  def perform(original_concept_uid, new_concept_uid)
    activities = HTTParty.get("#{ENV['FIREBASE_DATABASE_URL']}/v3/passageProofreadings.json").parsed_response
    activities.each do |key, act|
      if act['passage'].include?(original_concept_uid)
        new_passage = act['passage'].gsub(original_concept_uid, new_concept_uid)
        new_passage_hash = { passage: new_passage }
        HTTParty.put("#{ENV['FIREBASE_DATABASE_URL']}/v3/passageProofreadings/#{key}.json", body: new_passage_hash.to_json)
      end
    end
  end

end
