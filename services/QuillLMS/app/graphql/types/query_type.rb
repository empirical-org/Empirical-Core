class Types::QueryType < Types::BaseObject

  field :current_user, Types::UserType, null: true, resolve: -> (obj, args, ctx) { ctx[:current_user] }

  field :concept, Types::ConceptType, null: true do
    argument :id, Int, "Restrict items to this status", required: false
  end

  def concept(id: nil)
    return Concept.find(id) if id
  end

  field :concepts, [Types::ConceptType], null: false do
    argument :childless_only, Boolean, "Select only concepts with no children", required: false
    argument :level_two_only, Boolean, "Select only concepts with no parent id", required: false
    argument :level_one_only, Boolean, "Select only concepts with a parent and no grandparent", required: false
  end

  def concepts(childless_only: false, level_two_only: false, level_one_only: false)
    return Concept.childless_only if childless_only
    return Concept.where(parent_id: nil) if level_two_only
    return Concept.level_one_only if level_one_only
    return Concept.all
  end

  field :activities, [Types::ActivityType], null: false

  def activities
    return Activity.all
  end


  field :activity_categories, [Types::ActivityCategoryType], null: false

  def activity_categories
    return ActivityCategory.all
  end
end
