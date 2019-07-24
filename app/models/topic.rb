class Topic < ActiveRecord::Base
  include Uid

  belongs_to :section
  belongs_to :topic_category

  has_many :activities, dependent: :destroy

  default_scope -> { order(:name) }

  validates :section, presence: true
  validates :name, presence: true, uniqueness: true

  def name_prefix
    name.split(' ').first
  end
end