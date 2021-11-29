# frozen_string_literal: true

class Types::ConceptType < Types::BaseObject
  graphql_name 'Concept'

  field :id, ID, null: false
  field :uid, String, null: false
  field :name, String, null: false
  field :description, String, null: true
  field :explanation, String, null: true
  field :parent_id, ID, null: true
  field :created_at, Int, null: false
  field :updated_at, Int, null: false
  field :visible, Boolean, null: false
  field :replacement_id, ID, null: true

  field :parent, Types::ConceptType, null: true
  field :replacement, Types::ConceptType, null: true
  field :children, [Types::ConceptType, null: true], null: true
  field :siblings, [Types::ConceptType, null: true], null: true
  field :change_logs, [Types::ChangeLogType, null: true], null: true

  def parent
    Concept.find(object['parent_id']) if object['parent_id']
  end

  def children
    Concept.where(parent_id: object['id'])
  end

  def siblings
    Concept.where(parent_id: object['parent_id']).where.not(id: object['id'])
  end

  def replacement
    Concept.find(object['replacement_id']) if object['replacement_id']
  end

  def change_logs
    ChangeLog.where(changed_record_id: object['id'], changed_record_type: 'Concept')
  end

end
