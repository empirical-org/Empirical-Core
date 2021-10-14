namespace :universal_rules do
  desc 'Add or update universal rules from CSV file'
  # Example usage: rake 'universal_rules:update_from_csv[grammar, rules.csv]'
  task :update_from_csv, [:type, :filename] => :environment do |t, args|
    iostream = File.open(args[:filename], 'r').read
    UniversalRuleLoader.update_from_csv(type: args[:type], iostream: iostream)
  end
end

