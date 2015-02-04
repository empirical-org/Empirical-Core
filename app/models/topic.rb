class Topic < ActiveRecord::Base

  belongs_to :section
  belongs_to :topic_category

  has_many :activities, dependent: :destroy

  default_scope -> { order(:name) }

  validates :section, presence: true
  validates :name, presence: true, uniqueness: true

end
