namespace :grammar_api_rules_and_feedback do
    desc 'data migration for grammar-api specific rules and feedback'
    task :insert => :environment do
        rules_csv = CSV.parse(File.read('lib/data/rules.csv'), headers: true)
        valid_grammar_rules = rules_csv.select do |r| 
            r['Module'] == 'Grammar API' && r['Rule UID'].present? 
        end

        ActiveRecord::Base.transaction do 
            valid_grammar_rules.each do |r|
                created_rule = Comprehension::Rule.create!(
                    uid: r['Rule UID'],
                    name: r['Rule'],
                    description: r['Rule Description'],
                    universal: true,
                    rule_type: 'grammar',
                    optimal: false,
                    suborder: 1,
                    state: 'active',
                )
                Comprehension::Feedback.create!(
                    rule_id: created_rule.id,
                    text: 'lorem ipsum',
                    order: 1
                )
            end
        end
  
   end
  end
  