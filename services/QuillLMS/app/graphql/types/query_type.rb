# frozen_string_literal: true

class Types::QueryType < Types::BaseObject

  field :current_user, Types::UserType, null: true, resolve: ->(obj, args, ctx) { ctx[:current_user] }

  field :concept, Types::ConceptType, null: true do
    argument :id, Int, "Restrict items to this status", required: false
  end

  def concept(id: nil)
    return Concept.find(id) if id
  end

  field :concepts, [Types::ConceptType], null: false do
    argument :level_zero_only, Boolean, "Select only concepts with a parent and grandparent", required: false
    argument :level_two_only, Boolean, "Select only concepts with no parent id", required: false
    argument :level_one_only, Boolean, "Select only concepts with a parent and no grandparent", required: false
  end

  def concepts(level_zero_only: false, level_two_only: false, level_one_only: false)
    return Concept.level_zero_only if level_zero_only
    return Concept.where(parent_id: nil) if level_two_only
    return Concept.level_one_only if level_one_only

    Concept.all
  end

  field :activities, [Types::ActivityType], null: false

  def activities
    Activity.all
  end

  field :activity_categories, [Types::ActivityCategoryType], null: false

  def activity_categories
    ActivityCategory.all
  end

  field :change_logs, [Types::ChangeLogType], null: false do
    argument :concept_change_logs, Boolean, "Select only change logs for concepts", required: false
  end

  def change_logs(concept_change_logs: false)
    return ChangeLog.where(changed_record_type: 'Concept') if concept_change_logs

    ChangeLog.all
  end
end
