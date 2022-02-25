# frozen_string_literal: true

namespace :migrate_subscriptions do
  desc 'migrates all subscriptions of one type to another type'
  task :run => :environment do
    old_sub_to_new = {
      'trial': 'Teacher Trial',
      'paid': 'Teacher Paid',
      'premium': 'Teacher Paid',
      'Quill Premium for School Closures': 'Teacher Sponsored Free',
      'Teacher Contributor Free': 'Teacher Sponsored Free',
      'Teacher Free Partner': 'Teacher Sponsored Free',
      'school': 'School Paid',
      'School': 'School Paid',
      'Quill School Premium for School Closures': 'School Sponsored Free',
      'Purchase Missing School': 'School Sponsored Free',
      'School NYC Paid': 'School Sponsored Free',
      'School NYC Free': 'School Sponsored Free',
      'School Strategic Free': 'School Sponsored Free',
      'School Strategic Paid': 'School Sponsored Free',
      'School Research': 'School Sponsored Free'
    }
    ActiveRecord::Base.transaction do
      old_sub_to_new.each do |old_sub, new_sub|
        old_subscriptions = Subscription.where(account_type: old_sub.to_s)
        old_subscriptions.each do |sub|
          puts "Updating subscription #{sub.id} from #{old_sub} to #{new_sub}"
          sub.update!(account_type: new_sub.to_s)
        end
      end
    end
  end
end
