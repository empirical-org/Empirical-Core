class Concept < ActiveRecord::Base
  include Uid
  belongs_to :parent, class_name: 'Concept', foreign_key: :parent_id
  validates :name, presence: true
  has_many :concept_results

  # need the below because those making POST requests to /api/v1/concepts know only uids, not ids
  def parent_uid= uid
    self.parent_id = Concept.find_by(uid: uid).id
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
    concept2 = Concept.select(:id, :name, :uid, :parent_id, '2 AS level').where(parent_id: nil)
    concept1 = Concept.select(:id, :name, :uid, :parent_id, '1 AS level').where(parent_id: concept2.ids)
    concept0 = Concept.select(:id, :name, :uid, :parent_id, '0 AS level').where(parent_id: concept1.ids)
    concept2 + concept1 + concept0
  end

  def self.childless_only
    ActiveRecord::Base.connection.execute("
      SELECT concepts.id, concepts.name, concepts.uid, concepts.parent_id FROM concepts
      LEFT JOIN concepts AS children ON children.parent_id = concepts.id
      WHERE children.id is null
    ").to_a
  end

end
