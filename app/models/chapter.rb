class Chapter < ActiveRecord::Base
  has_many :assignments
  has_one :assessment
  belongs_to :workbook
  validates :title, presence: true
  validates :description, presence: true
  serialize :rule_position, Array
  accepts_nested_attributes_for :assessment

  def rule_position_text= string
    self.rule_position = string.split(",").map(&:strip)
  end

  def rule_position_text
    rule_position.join(", ")
  end
end
