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

  task resolve_dual_google_id_and_clever_id: :environment do
    User.where.not(clever_id: nil).where.not(google_id: nil).find_each do |user|
      DualGoogleIdAndCleverIdResolver.run(user)
    end
  end

  task update_auth_credential_types: :environment do
    {
      canvas: 'CanvasAuthCredential',
      google: 'GoogleAuthCredential',
      clever_district: 'CleverDistrictAuthCredential',
      clever_library: 'CleverLibraryAuthCredential'
    }.each_pair do |provider, type|
      AuthCredential
        .where(provider: provider, type: nil)
        .in_batches
        .update_all(type: type)
    end
  end

  task update_remove_users_with_duplicate_emails_accounts_with_no_activity_sessions_and_no_classrooms: :environment do
    user_ids =
      ActiveRecord::Base.connection.execute(
        <<-SQL
          WITH users_with_duplicate_emails AS (
              SELECT email
              FROM users
              WHERE email IS NOT NULL
              AND TRIM(email) != ''
              AND role = 'student'
              GROUP BY email
              HAVING COUNT(email) > 1
          ),

          users_with_duplicate_emails_and_no_activity_sessions AS (
              SELECT u.id, u.email
              FROM users u
              JOIN users_with_duplicate_emails uwde ON u.email = uwde.email
              LEFT JOIN activity_sessions a ON u.id = a.user_id
              WHERE a.id IS NULL
          ),

          users_with_duplicate_emails_and_no_activity_sessions_and_no_classrooms AS (
              SELECT uwdeanas.id, uwdeanas.email
              FROM users_with_duplicate_emails_and_no_activity_sessions uwdeanas
              LEFT JOIN students_classrooms sc ON uwdeanas.id = sc.student_id
              WHERE sc.id IS NULL
          ),

          numbered_users AS (
              SELECT id, email, ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS row_num
              FROM users_with_duplicate_emails_and_no_activity_sessions_and_no_classrooms
          )

          SELECT STRING_AGG(CAST(id AS TEXT), ',') AS ids
          FROM numbered_users
          WHERE row_num = 1;
        SQL
      ).first['ids'].split(',')

    puts "#{user_ids.count} users to delete"
    misses = User.where(id: user_ids).select { |u| !u.student? || u.activity_sessions.count != 0 || u.classrooms.count != 0 || User.where(email: u.email).count <  2;  }.map { |u| [u.id, u.activity_sessions.count, u.classrooms.count, User.where(email: u.email).count] }
    return if misses.count > 0

    puts "Going to delete #{user_ids.count} users"
    puts "Deleting #{user_ids.count} users"
    User.where(id: user_ids).destroy_all
    puts "Deleted #{user_ids.count} users"
  end
end
