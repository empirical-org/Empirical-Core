namespace :users do
  task :update_email_domain, [:old_domain, :new_domain] => [:environment] do |task, args|
    old_domain = "@#{args[:old_domain]}"
    new_domain = "@#{args[:new_domain]}"

    users = User.where("email ILIKE ?", "%#{old_domain}")

    puts "Going to update #{users.count} email addresses"
    num_updates = 0

    ActiveRecord::Base.transaction do
      users.find_each do |user|
        user.update(email: user.email.sub(old_domain, new_domain))
        num_updates += 1
        print '.'
      end
    end

    puts "\nUpdated #{num_updates} user emails"
  end
end