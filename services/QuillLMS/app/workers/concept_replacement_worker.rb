class ConceptReplacementWorker
  include Sidekiq::Worker

  def perform(original_concept_id, new_concept_id)
    original_concept = Concept.find(original_concept_id)
    new_concept = Concept.find(new_concept_id)

    # @unit = Unit.unscoped.find id
    # @unit.classroom_units.each do |class_unit|
    #   class_unit.update(visible: false)
    #   ArchiveClassroomUnitsActivitySessionsWorker.perform_async(class_unit.id)
    # end
    # @unit.unit_activities.each do |unit_activity|
    #   unit_activity.update(visible: false)
    # end
  end

  def replace_in_lms(original_concept_id, new_concept_id)
    ConceptResult.where(concept_id: original_concept_id).update_all(concept_id: new_concept_id)
  end

  def replace_in_cms(original_concept_uid, new_concept_uid)
    data = {
      new_concept_uid: new_concept_uid,
      original_concept_uid: original_concept_uid
    }
    HTTParty.put("#{ENV['CMS_URL']/responses/replace_concept_uids}", body: data.to_json)
  end

  

end
