require 'jwt'

class LessonsTokenCreator
  attr_reader :user

  def initialize(user)
    @user = user
  end

  def create
    JWT.encode(payload, private_key, 'RS256')
  end

  private

  def user_id
    if user.present?
      user.id.to_s
    else
      'anonymous'
    end
  end

  def payload
    Hash.new.tap do |data|
      data[:uid]       = "custom:#{user_id}"
      if user.nil?
        data[:anonymous] = true
      else
        data[:staff]     = true if user.staff?
        data[:admin]     = true if user.admin?
        data[:teacher]   = true if user.teacher?
        data[:student]   = true if user.student?
      end
    end
  end

  def private_key
    @private_key ||= OpenSSL::PKey::RSA.new(ENV['LESSONS_PRIVATE_KEY'])
  end
end
