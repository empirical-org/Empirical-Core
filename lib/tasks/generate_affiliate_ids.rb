namespace :affiliate do
  desc 'generate ids'
  task :generate => :environment do
    ActiveRecord::Base.connection.execute("
      INSERT INTO affiliate_user(user_id, affiliate_code)
      SELECT
        id AS user_id,
        concat(replace(regexp_replace(lower(name), '[^a-zA-Z ]', '', 'g'), ' ', '-'), '-', id) AS affiliate_code
      FROM users
      WHERE role = 'teacher';
    ")
  end
end
