class Concept < ActiveRecord::Base
  include Uid
  belongs_to :parent, class_name: 'Concept', foreign_key: :parent_id
  validates :name, presence: true

  # Find all the concepts that are not a parent of any other concept
  def self.leaf_nodes
    concepts = Concept.arel_table
    distinct_parent_ids = concepts.project('DISTINCT(parent_id)')
                                  .where(concepts[:parent_id].not_eq(nil))
    where.not(concepts[:id].in(distinct_parent_ids))
  end

  def self.all_with_depth
    # https://github.com/dockyard/postgres_ext/blob/master/docs/querying.md

    Concept.with.recursive(concepts_tree: <<-SQL
      SELECT c.id, c.name, c.uid, c.parent_id, 1 as depth
      FROM concepts c
      WHERE c.parent_id IS NULL

      UNION

      SELECT c.id, c.name, c.uid, c.parent_id, (concepts_tree.depth + 1)
      FROM concepts c, concepts_tree
      WHERE c.parent_id = concepts_tree.id
    SQL
    ).select('*').from('concepts_tree')
  end
end
