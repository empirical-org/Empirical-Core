namespace :grammar_api_rules_and_feedback do
    desc 'data migration for grammar-api specific rules and feedback'
    task :insert => :environment do
        rules_csv = CSV.parse(File.read('lib/data/rules.csv'), headers: true)
        valid_rules = rules_csv.select do |r| 
            ['Grammar API', 'Opinion API'].include?(r['Module']) && r['Rule UID'].present? 
        end

        ActiveRecord::Base.transaction do 
            valid_rules.each do |r|
                created_rule = Comprehension::Rule.find_or_initialize_by(uid: r['Rule UID'])
                created_rule.attributes = {
                    name: r['Rule'],
                    description: r['Rule Description'],
                    universal: true,
                    rule_type: r['Module'] == 'Grammar API' ? 'grammar' : 'opinion',
                    optimal: false,
                    suborder: r['Rule Suborder'],
                    state: 'active',
                }
                created_rule.save!

                # rubocop:disable all
                feedback_text = 
                    if r['Feedback V3 [HM 4/21]'].respond_to?(:length) 
                        && r['Feedback V3 [HM 4/21]'].length > Comprehension::Feedback::MIN_FEEDBACK_LENGTH
                        r['Feedback V3 [HM 4/21]']
                    else 
                        'Feedback not specified.'
                    end
                # rubocop:enable all

                feedback = Comprehension::Feedback.find_or_initialize_by(
                    rule_id: created_rule.id,
                    order: 1
                )

                feedback.text = feedback_text
                feedback.save!
            end
        end

    end
end
  