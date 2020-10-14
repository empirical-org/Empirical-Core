class StandardLevel < ActiveRecord::Base
  include Uid
  include RankedModel

  ranks :position

  has_many :standards, dependent: :destroy

  validates :name, presence: true

  before_save :archive_standards

  def archive_standards
    if self.visible_changed? && !self.visible
      self.standards.each do |standard|
        standard.visible = false
        standard.save!
      end
    end
  end
end
