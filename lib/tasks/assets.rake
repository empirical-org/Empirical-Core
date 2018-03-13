# lib/tasks/assets.rake
# The webpack task must run before assets:environment task.
# Otherwise Sprockets cannot find the files that webpack produces.
# This is the secret sauce for how a Heroku deployment knows to create the webpack generated JavaScript files.
# Rake::Task["assets:precompile"]
#   .clear_prerequisites
#   .enhance(["assets:compile_environment"])

Rake::Task["assets:precompile"]
  .clear_prerequisites
  .enhance([:environment, "react_on_rails:assets:compile_environment"])
  .enhance do
    Rake::Task["react_on_rails:assets:symlink_non_digested_assets"].invoke
    Rake::Task["react_on_rails:assets:delete_broken_symlinks"].invoke
  end

namespace :assets do
  # In this task, set prerequisites for the assets:precompile task
  task compile_environment: :webpack do
    Rake::Task["assets:environment"].invoke
  end

  desc "Compile assets with webpack"
  task :webpack do
    sh "cd client && npm run build:client"
  end

  task :clobber do
    rm_r Dir.glob(Rails.root.join("app/assets/webpack/*"))
  end
end
