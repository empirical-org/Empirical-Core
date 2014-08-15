module Uid
  extend ActiveSupport::Concern

  included do
    before_validation :generate_uid

    validates :uid, presence: true
  end

  private

  def generate_uid
    self.uid = SecureRandom.urlsafe_base64 if uid.blank?
  end

end
