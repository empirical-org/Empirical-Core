namespace :referrers do
  desc 'generate ids'
  task :generate => :environment do
    ActiveRecord::Base.connection.execute("
      INSERT INTO referrer_users(user_id, referrer_code)
      SELECT
        id AS user_id,
        concat(replace(regexp_replace(lower(name), '[^a-zA-Z ]', '', 'g'), ' ', '-'), '-', id) AS referrer_code
      FROM users
      WHERE role = 'teacher';
    ")
  end
end
