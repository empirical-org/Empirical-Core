namespace :universal_rules do


  desc 'tbd'
  # Example usage: rake 'universal_rules:update_from_csv[grammar, rules.csv]'
  task :update_from_csv, [:type, :filename] => :environment do |t, args|
    iostream = File.open(args[:filename], 'r').read
    if (CSV.parse(iostream, headers: true).headers & ["Rule UID", "Concept UID", "Feedback - Revised"]).count != 3 
      puts "Invalid headers. Exiting."
      exit 1
    end 


    CSV.parse(iostream, headers: true) do |row|
      rule = Evidence::Rule.find_by_uid(row['Rule UID'])
      if rule.nil? || !rule.universal || rule_type != args[:type]
        puts "Cannot find universal #{args[:type]} Rule with UID #{row['Rule UID']}. Skipping."
        next 
      end 

      puts "\nRule: #{rule.name}"
      if row['Concept UID'].respond_to?(:length) && row['Concept UID'].length > 0
        puts "concept_uid #{rule.concept_uid} -> #{row['Concept UID']}"
        rule.concept_uid = row['Concept UID'] 
      end

      if row['Feedback - Revised'].respond_to?(:length) && row['Feedback - Revised'].length > 0
        puts "feedback #{rule.concept_uid} -> #{row['Concept UID']}"
        rule.concept_uid = row['Concept UID'] 
      end

      rule.save!
    end

  end
end
