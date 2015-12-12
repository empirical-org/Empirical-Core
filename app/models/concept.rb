class Concept < ActiveRecord::Base
  include Uid
  belongs_to :parent, class_name: 'Concept', foreign_key: :parent_id
  validates :name, presence: true
  has_many :concept_results

  # need the below because those making POST requests to /api/v1/concepts know only uids, not ids
  def parent_uid=(uid)
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

    Concept.with.recursive(concepts_tree: <<-SQL
      SELECT c1.id, c1.name, c1.uid, c1.parent_id, 0 as level
      FROM      concepts c1
      LEFT JOIN concepts c2
      ON c1.id = c2.parent_id
      WHERE c2.id IS NULL

      UNION

      SELECT c.id, c.name, c.uid, c.parent_id, (concepts_tree.level + 1)
      FROM concepts c, concepts_tree
      WHERE c.id = concepts_tree.parent_id
    SQL
                          ).select('*').from('concepts_tree')
  end
end
