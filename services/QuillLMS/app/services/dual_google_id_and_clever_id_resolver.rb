# frozen_string_literal: true

class DualGoogleIdAndCleverIdResolver < ApplicationService
  attr_reader :user

  RESOLVERS = %i[
    resolve_by_account_type
    resolve_by_auth_credential
    resolve_by_last_classroom
  ].freeze


  def initialize(user)
    @user = user
  end

  def run
    RESOLVERS.find { |resolver| send(resolver) }
  end

  private def last_classroom
    @last_classroom ||= user&.classrooms_i_teach&.sort_by(&:updated_at)&.last
  end

  private def log_account_type_change(changed_attribute, previous_value, action)
    ChangeLog.create(
      action: action,
      changed_attribute: changed_attribute,
      changed_record: user,
      explanation: caller_locations[0].to_s,
      previous_value: previous_value
    )
  end

  private def resolve_by_account_type
    case user.account_type
    when User::GOOGLE_CLASSROOM_ACCOUNT then set_user_account_type_google
    when User::CLEVER_ACCOUNT then set_user_account_type_clever
    end
  end

  private def resolve_by_auth_credential
    return set_user_account_type_google if user.google_authorized?
    return set_user_account_type_clever if user.clever_authorized?
  end

  private def resolve_by_last_classroom
    return false unless last_classroom.present?
    return set_user_account_type_google if last_classroom.google_classroom_id.present?
    return set_user_account_type_clever if last_classroom.clever_id.present?
  end

  private def set_user_account_type_clever
    google_id = user.google_id
    user.update!(account_type: User::CLEVER_ACCOUNT, google_id: nil)
    log_account_type_change(:google_id, google_id, ChangeLog::SET_USER_ACCOUNT_TYPE_CLEVER)
    true
  end

  private def set_user_account_type_google
    clever_id = user.clever_id
    user.update!(account_type: User::GOOGLE_CLASSROOM_ACCOUNT, clever_id: nil)
    log_account_type_change(:clever_id, clever_id, ChangeLog::SET_USER_ACCOUNT_TYPE_CLEVER)
    true
  end
end
