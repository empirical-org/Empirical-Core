class Comment < ActiveRecord::Base
  attr_accessible :title, :body, :parent_id
  has_ancestry
  belongs_to :user

  def self.json_tree(nodes)
    nodes.map do |node, sub_nodes|
      {title: node.title, body: node.body, id: node.id, depth: node.depth, children: json_tree(sub_nodes).compact}
    end
  end

  def as_json(options={})
    result = super(options)
    result[:depth] = depth
    result[:parent_id] = parent_id
    result
  end
end
