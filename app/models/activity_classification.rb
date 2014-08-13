class ActivityClassification < ActiveRecord::Base
  has_many :activities, dependent: :destroy
  before_create :create_uid

  if defined?(Doorkeeper::Application)
    belongs_to :oauth_application, class_name: 'Doorkeeper::Application'
  end

protected

  def create_uid
    self.uid = SecureRandom.urlsafe_base64
  end
end
