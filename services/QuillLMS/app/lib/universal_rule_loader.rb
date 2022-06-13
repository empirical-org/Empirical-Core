# frozen_string_literal: true

# This loader assumes a specific CSV shape. The canonical copy is here:
# https://www.notion.so/quill/860620e6d04f448784182a878be45b50?v=6e07319b3db14e42b850a27bac37ca73

class UniversalRuleLoader
  REQUIRED_HEADERS = ['Rule UID', 'Module', 'Rule', 'Concept UID', 'Feedback - Revised', 'Activity']

  # Keys: the name of a type as undestood by Evidence
  # Values: the working names of types used by humans
  TYPE_LOOKUP = {
    grammar: 'Grammar API',
    opinion: 'Opinion API'
  }

  # rubocop:disable Metrics/CyclomaticComplexity
  def self.update_from_csv(type:, iostream:)
    if !Evidence::Rule::TYPES.include?(type) || TYPE_LOOKUP[type.to_sym].nil?
      raise ArgumentError, "Invalid rule type: #{type}"
    end

    if (CSV.parse(iostream, headers: true).headers & REQUIRED_HEADERS).count != REQUIRED_HEADERS.length
      raise ArgumentError, "Invalid CSV headers."
    end

    CSV.parse(iostream, headers: true) do |row|
      next unless row['Module'] == TYPE_LOOKUP[type.to_sym] && row['Activity'] == 'Universal'

      rule = Evidence::Rule.find_by_uid(row['Rule UID'])

      if rule
        if !rule.universal? || rule.rule_type != type
          next
        end
      else
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

      if row['Concept UID'].respond_to?(:length) && !row['Concept UID'].empty?
        rule.concept_uid = row['Concept UID']
      end

      rule.save!

      if row['Feedback - Revised'].respond_to?(:length) && !row['Feedback - Revised'].empty?
        rule_feedback = Evidence::Feedback.find_or_create_by(rule_id: rule.id, order: 0)
        rule_feedback.text = row['Feedback - Revised']
        rule_feedback.save!
      end
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity
end
