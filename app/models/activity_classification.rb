class ActivityClassification < ActiveRecord::Base

  include Uid

  has_many :activities, dependent: :destroy

  belongs_to :oauth_application, class_name: 'Doorkeeper::Application'

  validates :key, uniqueness: true, presence: true

end
