class ConceptReplacementCMSWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  def perform(original_concept_uid, new_concept_uid)
    data = {
      new_concept_uid: new_concept_uid,
      original_concept_uid: original_concept_uid
    }
    HTTParty.put("#{ENV['CMS_URL']}/responses/replace_concept_uids", body: data.to_json)
  end

end
