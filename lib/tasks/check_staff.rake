namespace :staff do
  desc 'Check whether there have been changes to staff accounts, and send an alert if anything has changed'
  task :check => :environment do
    @keys = %w(id name email username created_at google_id signed_up_with_google)
    current_staff_accounts = ActiveRecord::Base.connection.execute("SELECT * FROM users WHERE role='staff'").to_a
    @current_staff_account_data = current_staff_accounts.map do |account|
      hash = {}
      @keys.each { |key| hash[key] = account[key] }
      hash
    end
    @previous_staff_account_data = JSON.parse($redis.get('check_staff_accounts') || '{}')
    notify_staff unless @current_staff_account_data == @previous_staff_account_data
    $redis.set('check_staff_accounts', @current_staff_account_data.to_json)
  end

  def notify_staff
    body = ''

    current_ids = @current_staff_account_data.map { |account| account['id'] }
    previous_ids = @previous_staff_account_data.map { |account| account['id'] }
    new_ids = current_ids - previous_ids
    existing_ids = current_ids & previous_ids

    new_ids.each do |id|
      body << "New Account: #{@current_staff_account_data.find{ |acc| acc['id'] === id.to_s }['name']} (ID ##{id})\n\n"
    end

    existing_ids.each do |id|
      old_data = @current_staff_account_data.find { |acc| acc['id'] === id.to_s }
      new_data = @previous_staff_account_data.find { |acc| acc['id'] === id.to_s }
      @keys.each do |key|
        unless old_data[key] === new_data[key]
          body << "ID ##{id} #{key}: #{old_data[key]} => #{new_data[key]}\n\n"
        end
      end
    end

    unless body.empty?
      body.prepend("Staff Account Changes:\n\n")
      ActionMailer::Base.mail(
        from: 'donald@quill.org',
        to: 'donald@quill.org',
        subject: 'SECURITY NOTIFICATION: Staff Account Updates',
        body: body
      ).deliver
    end
  end
end
