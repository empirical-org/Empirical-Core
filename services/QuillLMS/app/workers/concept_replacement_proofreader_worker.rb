class ConceptReplacementProofreaderWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  def perform(original_concept_uid, new_concept_uid)
    activities = HTTParty.get("#{ENV['FIREBASE_DATABASE_URL']}/v3/passageProofreadings.json").parsed_response
    activities.each do |key, act|
      if act['passage'].include?(original_concept_uid)
        new_passage = act['passage'].gsub(original_concept_uid, new_concept_uid)
        HTTParty.put("#{ENV['FIREBASE_DATABASE_URL']}/v3/passageProofreadings/#{key}/passage.json", body: new_passage.to_json)
      end
    end
  end

end
