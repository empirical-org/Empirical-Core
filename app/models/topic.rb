class Topic < ActiveRecord::Base

  belongs_to :section
  has_many :activities, dependent: :destroy

  default_scope -> { order(:name) }

  validates :section, presence: true
  validates :name, presence: true, uniqueness: true

end
