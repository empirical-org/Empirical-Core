class Comment < ActiveRecord::Base
  attr_accessible :title, :body, :parent_id, :reply_type
  has_ancestry
  belongs_to :user
  default_scope order('reply_type, created_at')
  before_create :set_reply_type

  def self.json_tree(nodes)
    nodes.map do |node, sub_nodes|
      {title: node.title, body: node.body, id: node.id, depth: node.depth, parent_id: node.parent_id, reply_type: node.reply_type, children: json_tree(sub_nodes).compact}
    end
  end

  def as_json(options={})
    result = super(options)
    result[:depth] = depth
    result[:parent_id] = parent_id
    result[:reply_type] = reply_type
    result
  end

  private

  def set_reply_type
    self.reply_type = parent.reply_type if parent.present? && parent.reply_type?
  end
end
