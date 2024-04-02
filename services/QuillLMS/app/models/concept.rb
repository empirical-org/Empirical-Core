# frozen_string_literal: true

# == Schema Information
#
# Table name: concepts
#
#  id             :integer          not null, primary key
#  description    :text
#  explanation    :text
#  name           :string(255)
#  uid            :string(255)      not null
#  visible        :boolean          default(TRUE)
#  created_at     :datetime
#  updated_at     :datetime
#  parent_id      :integer
#  replacement_id :integer
#
class Concept < ApplicationRecord
  include Uid
  belongs_to :parent, class_name: 'Concept', foreign_key: :parent_id
  belongs_to :replacement, class_name: 'Concept', foreign_key: :replacement_id
  validates :name, presence: true
  has_many :concept_results
  has_many :change_logs, as: :changed_record

  def lineage
    family_tree = name
    if parent
      family_tree = "#{parent.name} | #{family_tree}"
    end
    if parent and parent.parent
      family_tree = "#{parent.parent.name} | #{family_tree}"
    end
    family_tree
  end

  # need the below because those making POST requests to /api/v1/concepts know only uids, not ids
  def parent_uid= uid
    self.parent_id = Concept.find_by(uid: uid).id
  end

  def replacement_uid= uid
    self.replacement_id = Concept.find_by(uid: uid).id
  end

  # Find all the concepts that are not a parent of any other concept
  def self.leaf_nodes
    concepts = Concept.arel_table
    distinct_parent_ids = concepts.project('DISTINCT(parent_id)')
                                  .where(concepts[:parent_id].not_eq(nil))
    where.not(concepts[:id].in(distinct_parent_ids))
  end

  def self.all_with_level
    # https://github.com/dockyard/postgres_ext/blob/master/docs/querying.md
    concept2 = Concept.select(:id, :name, :uid, :parent_id, '2 AS level', :description, :explanation).where(parent_id: nil, visible: true)
    concept1 = Concept.select(:id, :name, :uid, :parent_id, '1 AS level', :description, :explanation).where(parent_id: concept2.ids, visible: true)
    concept0 = Concept.select(:id, :name, :uid, :parent_id, '0 AS level', :description, :explanation).where(parent_id: concept1.ids, visible: true)
    concept2 + concept1 + concept0
  end

  def self.level_zero_only
    Concept.find_by_sql("
      SELECT concepts.id, concepts.name, concepts.uid, concepts.parent_id, concepts.created_at, concepts.updated_at, concepts.visible::BOOLEAN FROM concepts
      JOIN concepts AS parents ON concepts.parent_id = parents.id
      WHERE parents.parent_id IS NOT NULL
      AND concepts.parent_id IS NOT NULL
    ")
  end

  def self.level_one_only
    Concept.find_by_sql("
      SELECT concepts.id, concepts.name, concepts.uid, concepts.parent_id, concepts.created_at, concepts.updated_at, concepts.visible::BOOLEAN FROM concepts
      JOIN concepts AS parents ON concepts.parent_id = parents.id
      WHERE parents.parent_id IS NULL
      AND concepts.parent_id IS NOT NULL
    ")
  end

  def self.find_by_id_or_uid(arg)
    find_by(uid: arg) || find(arg)
  end

  def self.visible_level_zero_concept_ids
    RawSqlRunner.execute(
      <<-SQL
        SELECT concepts.id
        FROM concepts
        JOIN concepts AS parent_concepts
          ON concepts.parent_id = parent_concepts.id
        JOIN concepts AS grandparent_concepts
          ON parent_concepts.parent_id = grandparent_concepts.id
        WHERE parent_concepts.parent_id IS NOT NULL
          AND concepts.parent_id IS NOT NULL
          AND concepts.visible
        ORDER BY
          grandparent_concepts.name,
          parent_concepts.name,
          concepts.name
      SQL
    ).values.flatten
  end
end
