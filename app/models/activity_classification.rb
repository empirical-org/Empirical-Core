class ActivityClassification < ActiveRecord::Base
  has_many :activities, dependent: :destroy
  before_create :create_uid

protected

  def create_uid
    self.uid = SecureRandom.urlsafe_base64
  end
end
