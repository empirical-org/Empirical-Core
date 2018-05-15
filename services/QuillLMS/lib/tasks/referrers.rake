namespace :referrers do
  desc 'generate referral codes'
  task generate_codes: :environment do
    ActiveRecord::Base.connection.execute("
      INSERT INTO referrer_users(user_id, referral_code)
      SELECT
        id AS user_id,
        concat(replace(regexp_replace(lower(name), '[^a-zA-Z ]', '', 'g'), ' ', '-'), '-', id) AS referral_code
      FROM users
      WHERE role = 'teacher';
    ")
  end
end
