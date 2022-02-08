# frozen_string_literal: true

namespace :users do
  task :update_email_domain, [:old_domain, :new_domain] => [:environment] do |task, args|
    old_domain = "@#{args[:old_domain].downcase}"
    new_domain = "@#{args[:new_domain].downcase}"

    users = User.where("email LIKE ?", "%#{old_domain}")

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

  task clear_stripe_customer_ids_on_deleted_users: :environment do
    deleted_users_with_stripe_customer_ids = User.deleted_users.where.not(stripe_customer_id: nil)

    num_updates = deleted_users_with_stripe_customer_ids.count
    puts "Going to clear #{num_updates} user accounts"

    ActiveRecord::Base.transaction { deleted_users_with_stripe_customer_ids.each(&:clear_attrs) }

    remaining_num_accounts = User.deleted_users.where.not(stripe_customer_id: nil).count
    puts "\nCleared #{num_updates - remaining_num_accounts} user accounts"
  end
end
