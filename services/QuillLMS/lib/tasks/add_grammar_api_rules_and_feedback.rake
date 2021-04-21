namespace :grammar_api_rules_and_feedback do
    desc 'data migration for grammar-api specific rules and feedback'
    task :insert => :environment do
        binding.pry
        # does not include header row
        rules_csv = CSV.parse(File.read('lib/data/rules.csv'), headers: true)
        valid_grammar_rules = rules_csv.select do |r| 
            r['Module'] == 'Grammar API' && r['Rule UID'].present? 
        end

        ActiveRecord::Base.transaction do 
            valid_grammar_rules.each do |r|
                Rule.create!(
                    rule_uid: r['Rule UID'],
                    name: ,
                    descrption: ,
                    universal: true,
                    rule_type: ,
                    optimal: ,
                    suborder: 1,
                    state: 'active',
                )

            end
        end
  
   end
  end
  