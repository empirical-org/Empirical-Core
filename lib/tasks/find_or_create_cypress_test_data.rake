require 'factory_bot_rails'
include FactoryBot::Syntax::Methods

namespace :find_or_create_cypress_test_data do

  task :find_or_create_users, [:wipe_database] => :environment do |t, args|
    # args.with_defaults(wipe_database: true)
    # if args.wipe_database
    wipe_db
    # end
    find_or_create_users
  end

  task :find_or_create_teacher, [:wipe_database] => :environment do |t, args|
    # args.with_defaults(wipe_database: true)
    # if args.wipe_database
    wipe_db
    # end
    find_or_create_teacher
  end

  task :find_or_create_student, [:wipe_database] => :environment do |t, args|
    # args.with_defaults(wipe_database: true)
    # if args.wipe_database
    wipe_db
    # end
    find_or_create_student
  end

  task :find_or_create_teacher_with_school_premium, [:wipe_database] => :environment do |t, args|
    # args.with_defaults(wipe_database: true)
    # if args.wipe_database
    wipe_db
    # end
    find_or_create_teacher_with_school_premium
  end

  task :find_or_create_teacher_with_recurring_school_premium, [:wipe_database] => :environment do |t, args|
    # args.with_defaults(wipe_database: true)
    # if args.wipe_database
    wipe_db
    # end
    find_or_create_teacher_with_recurring_school_premium
  end

  task :find_or_create_teacher_with_teacher_premium, [:wipe_database] => :environment do |t, args|
    # args.with_defaults(wipe_database: true)
    # if args.wipe_database
    wipe_db
    # end
    find_or_create_teacher_with_teacher_premium
  end

  task :find_or_create_teacher_with_recurring_teacher_premium, [:wipe_database] => :environment do |t, args|
    # args.with_defaults(wipe_database: true)
    # if args.wipe_database
    wipe_db
    # end
    find_or_create_teacher_with_recurring_teacher_premium
  end

  task :find_or_create_teacher_with_expiring_school_premium, [:wipe_database] => :environment do |t, args|
    # args.with_defaults(wipe_database: true)
    # if args.wipe_database
    wipe_db
    # end
    find_or_create_teacher_with_expiring_school_premium
  end

  task :find_or_create_school, [:wipe_database] => :environment do |t, args|
    # args.with_defaults(wipe_database: true)
    # if args.wipe_database
    wipe_db
    # end
    find_or_create_school
  end

  def wipe_db
    tables = ActiveRecord::Base.connection.tables
    tables.delete 'schema_migrations'
    tables.each { |t| ActiveRecord::Base.connection.execute("TRUNCATE #{t} CASCADE") }
  end

  def find_or_create_staff
    user = User.find_or_create_by(role: 'staff', username: 'staff', name: 'Ryan Novas', email: 'r@gmail.com')
    user.update(password: 'password')
    user
  end

  def find_or_create_teacher
    user = User.find_or_create_by(role: 'teacher', username: 'teacher', name: 'Emilia Friedberg', email: 'e@gmail.com')
    user.update(password: 'password')
    user
  end

  def find_or_create_student
    user = User.find_or_create_by(role: 'student', username: 'student', name: 'Jenny Price')
    user.update(password: 'password')
    user
  end

  def find_or_create_subscription subscription_type, recurring=false, expiration=(Date.today+ 365)
    Subscription.find_or_create_by(account_type: subscription_type, recurring: recurring, expiration: expiration, start_date: Date.yesterday, account_limit: 1000)
  end

  def find_or_create_teacher_with_school_premium
    teacher = find_or_create_teacher
    teacher.subscriptions.destroy_all
    subscription = find_or_create_subscription('School Paid')
    UserSubscription.find_or_create_by(subscription: subscription, user: teacher)
  end

  def find_or_create_teacher_with_recurring_school_premium
    teacher = find_or_create_teacher
    teacher.subscriptions.destroy_all
    subscription = find_or_create_subscription('School Paid', true)
    UserSubscription.find_or_create_by(subscription: subscription, user: teacher)
  end

  def find_or_create_teacher_with_teacher_premium
    teacher = find_or_create_teacher
    teacher.subscriptions.destroy_all
    subscription = find_or_create_subscription('Teacher Paid')
    UserSubscription.find_or_create_by(subscription: subscription, user: teacher)
  end

  def find_or_create_teacher_with_recurring_teacher_premium
    teacher = find_or_create_teacher
    teacher.subscriptions.destroy_all
    subscription = find_or_create_subscription('Teacher Paid', true)
    UserSubscription.find_or_create_by(subscription: subscription, user: teacher)
  end

  def find_or_create_teacher_with_expiring_school_premium
    teacher = find_or_create_teacher
    teacher.subscriptions.destroy_all
    subscription = find_or_create_subscription('School Paid', true, (Date.today + 10.days))
    UserSubscription.find_or_create_by(subscription: subscription, user: teacher)
  end


  def find_or_create_users
    find_or_create_staff
    find_or_create_teacher
    find_or_create_student
  end

  def find_or_create_school
    School.find_or_create_by(name: 'Cool Bushwick School', zipcode: 11221)
  end

end
