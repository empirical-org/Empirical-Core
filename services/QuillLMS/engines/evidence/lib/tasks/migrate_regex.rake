namespace :evidence_regex do

  desc "Migrates Evidence regex rules from rule_sets over to rules table"

  task :migrate => :environment do
    Evidence::RegexMigrationRunner.run
  end
end
