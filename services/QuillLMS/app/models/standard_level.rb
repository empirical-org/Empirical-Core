class StandardLevel < ActiveRecord::Base
  include Uid
  include RankedModel

  ranks :position

  has_many :standards, dependent: :destroy

  validates :name, presence: true

  before_save :archive_or_unarchive_standards

  def archive_or_unarchive_standards
    if self.visible_changed?
      self.standards.each do |standard|
        standard.visible = self.visible
        standard.save
      end
    end
  end
end
