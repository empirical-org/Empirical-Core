# This loader assumes a specific CSV shape. The canonical copy is here:
# https://www.notion.so/quill/860620e6d04f448784182a878be45b50?v=6e07319b3db14e42b850a27bac37ca73

class UniversalRuleLoader 
  def self.update_from_csv(type:, iostream:)
    if !Evidence::Rule::TYPES.include?(type)
      puts "Invalid rule type #{type}"
      return
    end

    
    if (CSV.parse(iostream, headers: true).headers & ['Rule UID', 'Rule', 'Concept UID', 'Feedback - Revised']).count != 4
      puts 'Invalid headers. Exiting.'
      return
    end 

    CSV.parse(iostream, headers: true) do |row|
      rule = Evidence::Rule.find_by_uid(row['Rule UID'])
      if rule.nil? || !rule.universal || rule.rule_type != type
        puts "Cannot find universal #{type} Rule with UID #{row['Rule UID']}. Creating new rule."
        rule = Evidence::Rule.new(
          uid: row['Rule UID'],
          name: row['Rule'],
          universal: true,
          rule_type: type,
          suborder: row['Overall Rule Priority'],
          optimal: true, # Hardcoded, b/c the input file does not currently include an 'optimal' column
          state: Evidence::Rule::STATES.first # same as above
        )
      end 

      puts "\nRule: #{rule.name}"

      if row['Concept UID'].respond_to?(:length) && row['Concept UID'].length > 0
        puts "concept_uid #{rule.concept_uid} -> #{row['Concept UID']}"
        rule.concept_uid = row['Concept UID'] 
      end

      rule.save!

      if row['Feedback - Revised'].respond_to?(:length) && row['Feedback - Revised'].length > 0
        rule_feedback = Evidence::Feedback.find_or_create_by(rule_id: rule.id, order: 0)
        rule_feedback.text = row['Feedback - Revised']
        rule_feedback.save!
        puts "Created or updated feedback with id #{rule_feedback.id}"
      end
    end

  end # update_from_csv
end

# CREATE TABLE public.comprehension_feedbacks (
#     id integer NOT NULL,
#     rule_id integer NOT NULL,
#     text character varying NOT NULL,
#     description character varying,
#     "order" integer NOT NULL,
#     created_at timestamp without time zone NOT NULL,
#     updated_at timestamp without time zone NOT NULL
# );


# CREATE TABLE public.comprehension_rules (
#     id integer NOT NULL,
#     uid character varying NOT NULL,
#     name character varying NOT NULL,
#     note character varying,
#     universal boolean NOT NULL,
#     rule_type character varying NOT NULL,
#     optimal boolean NOT NULL,
#     suborder integer,
#     concept_uid character varying,
#     created_at timestamp without time zone NOT NULL,
#     updated_at timestamp without time zone NOT NULL,
#     state character varying NOT NULL
# );