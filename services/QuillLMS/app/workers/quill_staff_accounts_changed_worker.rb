# frozen_string_literal: true

class QuillStaffAccountsChangedWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  PARAMS_TO_TRACK = %w(id name email username created_at google_id signed_up_with_google)
  STAFF_ACCOUNTS_CACHE_KEY = 'check_staff_accounts'
  EXPIRES_IN = 25.hours.to_i

  EMAIL_NOTIFICATION_FROM = 'eng-alerts@quill.org'
  EMAIL_NOTIFICATION_TO = 'eng-alerts@quill.org'

  def perform
    current_staff_accounts = current_staff_account_data
    previous_staff_accounts = cached_staff_account_data
    notify_staff(current_staff_accounts, previous_staff_accounts) unless current_staff_accounts == previous_staff_accounts
    $redis.set(STAFF_ACCOUNTS_CACHE_KEY, current_staff_accounts.to_json, ex: EXPIRES_IN)
  end

  def current_staff_account_data
    User
      .where(role: User::STAFF)
      .order(:id)
      .as_json(only: PARAMS_TO_TRACK)
  end

  def cached_staff_account_data
    JSON.parse($redis.get(STAFF_ACCOUNTS_CACHE_KEY) || '[]')
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def notify_staff(current_staff_accounts, previous_staff_accounts)
    body = ''.dup

    current_ids = current_staff_accounts.map { |account| account['id'] }
    previous_ids = previous_staff_accounts.map { |account| account['id'] }
    new_ids = current_ids - previous_ids
    existing_ids = current_ids & previous_ids

    new_ids.each do |id|
      body << "New Account: #{current_staff_accounts.find{ |acc| acc['id'] == id }['name']} (ID ##{id})\n\n"
    end

    existing_ids.each do |id|
      old_data = previous_staff_accounts.find { |acc| acc['id'] === id }
      new_data = current_staff_accounts.find { |acc| acc['id'] === id }
      PARAMS_TO_TRACK.each do |key|
        unless old_data[key] === new_data[key]
          body << "ID ##{id} #{key}: #{old_data[key]} => #{new_data[key]}\n\n"
        end
      end
    end

    return if body.empty?

    body.prepend("Staff Account Changes:\n\n")
    ActionMailer::Base.mail(
      from: EMAIL_NOTIFICATION_FROM,
      to: EMAIL_NOTIFICATION_TO,
      subject: 'SECURITY NOTIFICATION: Staff Account Updates',
      body: body
    ).deliver
  end
  # rubocop:enable Metrics/CyclomaticComplexity
end
