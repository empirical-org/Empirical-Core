# frozen_string_literal: true

namespace :migrate_subscriptions do
  desc 'migrates all subscriptions of one type to another type'
  task :run, [:old_sub, :new_sub] => :environment do |t, args|
    ActiveRecord::Base.transaction do
      old_subscriptions = Subscription.where(account_type: args[:old_sub].to_s)
      old_subscriptions.each do |sub|
        puts "Updating subscription #{sub.id} from #{args[:old_sub]} to #{args[:new_sub]}"
        sub.update!(account_type: args[:new_sub].to_s)
      end
    end
  end
end
