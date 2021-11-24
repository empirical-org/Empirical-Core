# frozen_string_literal: true

module Uid
  extend ActiveSupport::Concern

  included do
    before_validation :generate_uid

    validates :uid, uniqueness: true
  end

  private def generate_uid
    self.uid = SecureRandom.urlsafe_base64 if uid.blank?
  end

end
