namespace :db do
  namespace :snapshots do

    desc "restore a db snapshot"
    task :restore do
      db_name = Rails.configuration.database_configuration[Rails.env]["database"]
      system "pg_restore --verbose --clean --no-acl --no-owner -d #{db_name} quill_snapshot.dump"
    end

    desc "create a snapshot..."
    task :create do
      db_name = Rails.configuration.database_configuration[Rails.env]["database"]
      system "pg_dump -b -c -o -F c -v -f quill_snapshot.dump #{db_name}"
    end

    desc "synchronize from staging.."
    task :staging_sync do

      db_name = Rails.configuration.database_configuration[Rails.env]["database"]

      system "heroku pgbackups:capture --expire --app empirical-grammar-staging"
      system "curl -o quill_staging.dump `heroku pgbackups:url --app empirical-grammar-staging`"
      system "echo 'drop schema public cascade; create schema public;' | psql -d #{db_name}"
      system "pg_restore --verbose --clean --no-acl --no-owner -d #{db_name} quill_staging.dump"

      Rake::Task['db:migrate'].invoke
    end


    desc "cleanup any mess"
    task :cleanup do
      system "rm quill_snapshot.dump quill_staging.dump"
    end

  end
end
