class QuillStaffAccountsChangedWorker
  include Sidekiq::Worker

  PARAMS_TO_TRACK = %w(id name email username created_at google_id signed_up_with_google)
  STAFF_ACCOUNTS_CACHE_KEY = 'check_staff_accounts'

  def perform
    current_staff_accounts = current_staff_account_data
    previous_staff_accounts = cached_staff_account_data
    notify_staff(current_staff_accounts, previous_staff_accounts) unless current_staff_accounts == previous_staff_accounts
    $redis.set(STAFF_ACCOUNTS_CACHE_KEY, current_staff_accounts.to_json)
  end

  def current_staff_account_data
    current_staff_accounts = ActiveRecord::Base.connection.execute("SELECT * FROM users WHERE role='staff'").to_a
    current_staff_accounts.map do |account|
      hash = {}
      PARAMS_TO_TRACK.each { |key| hash[key] = account[key] }
      hash
    end
  end

  def cached_staff_account_data
    JSON.parse($redis.get(STAFF_ACCOUNTS_CACHE_KEY) || '[]')
  end

  def notify_staff(current_staff_accounts, previous_staff_accounts)
    body = ''

    current_ids = current_staff_accounts.map { |account| account['id'] }
    previous_ids = previous_staff_accounts.map { |account| account['id'] }
    new_ids = current_ids - previous_ids
    existing_ids = current_ids & previous_ids

    new_ids.each do |id|
      body << "New Account: #{current_staff_accounts.find{ |acc| acc['id'] === id.to_s }['name']} (ID ##{id})\n\n"
    end

    existing_ids.each do |id|
      old_data = current_staff_accounts.find { |acc| acc['id'] === id.to_s }
      new_data = previous_staff_accounts.find { |acc| acc['id'] === id.to_s }
      PARAMS_TO_TRACK.each do |key|
        unless old_data[key] === new_data[key]
          body << "ID ##{id} #{key}: #{old_data[key]} => #{new_data[key]}\n\n"
        end
      end
    end

    unless body.empty?
      body.prepend("Staff Account Changes:\n\n")
      ActionMailer::Base.mail(
        from: 'devtools@quill.org',
        to: 'devtools@quill.org',
        subject: 'SECURITY NOTIFICATION: Staff Account Updates',
        body: body
      ).deliver
    end
  end
end
