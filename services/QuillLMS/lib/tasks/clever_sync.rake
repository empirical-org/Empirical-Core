namespace :clever do
  task sync: :environment do
    CleverIntegration::Sync::Main.run
  end
end
