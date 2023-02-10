# frozen_string_literal: true

require 'csv'

namespace :subscriptions do
  desc 'Add credit to users from a CSV file'
  task :add_credit_to_users, [:filepath, :amount_in_days] => :environment do |t, args|
    iostream = File.read(args[:filepath])
    if (CSV.parse(iostream, headers: true).headers & ['email']).count != 1
      puts 'Invalid headers. Exiting.'
      exit 1
    end

    CSV.parse(iostream, headers: true) do |row|
      email = row['email']
      user = User.find_by_email(email)
      if user.nil? || user.role != 'teacher'
        puts "Unable to locate teacher with email #{email}"
        next
      end

      begin
        credit_transaction = CreditTransaction.create!(user_id: user.id, amount: args[:amount_in_days].to_i, source: user)
        puts "CreditTransaction with id #{credit_transaction.id} created for #{user.email}"

        user.redeem_credit unless user.subscription
      rescue => e
        puts "Error processing #{email}: #{e}"
      end

    end
  end

  desc 'Save stripe_subscription_id to Subscription for any record with a stripe_invoice_id'
  task :save_stripe_subscription_ids => :environment do
    Subscription.where.not(stripe_invoice_id: nil).where(stripe_subscription_id: nil).each do |subscription|
      stripe_invoice = Stripe::Invoice.retrieve(subscription.stripe_invoice_id)
      stripe_subscription_id = stripe_invoice.subscription
      subscription.update(stripe_subscription_id: stripe_subscription_id)
    end
  end
end
