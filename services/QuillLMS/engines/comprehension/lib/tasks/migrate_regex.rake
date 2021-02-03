namespace :comprehension_regex do

  desc "Migrates Comprehension regex rules from rule_sets over to rules table"

  task :migrate => :environment do
    Comprehension::RegexMigrationRunner.run
  end
end
