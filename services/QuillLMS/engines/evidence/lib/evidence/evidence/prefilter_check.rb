module Evidence
  class PrefilterCheck
    MINIMUM_WORD_COUNT = 3
    OPTIMAL_RULE_UID = '' # TODO: populate

    PREFILTERS = [
      'this is a rule uid for TOO_LONG' => lambda do |text|
        PrefilterCheck.to_word_array.length >= MINIMUM_WORD_COUNT
      end,
      'this is another rule uid' => lambda do |text| 
      end
    ]

    def initialize(entry, prompt)
      @entry = entry
      @prompt = prompt
      @prefilter_rules = Evidence::Rule.where(rule_type: Evidence::Rule::TYPES[TYPE_PREFILTER]).include(:feedbacks)
    end

    def default_response
      {
        feedback: '',
        feedback_type: Evidence::Rule::TYPES[TYPE_PREFILTER],
        optimal: true,
        response_id: '',
        entry: @entry,
        concept_uid: '',
        rule_uid: OPTIMAL_RULE_UID,
        highlight: []
      }
    end

    def feedback_object
      violated_rule = @prefilter_rules.find do |rule| 
        next unless PREFILTERS[rule.uid]
        !PREFILTERS[rule.uid](text) 
      end

      return default_response unless violated_rule

      feedback = violated_rule.feedbacks.first

      default_response.merge(
        {
          feedback: feedback&.text,
          optimal: false,
          rule:uid: violated_rule.uid
        }
      )
    end

    def self.to_word_array(entry)
      entry.split(' ')
    end

  end
end
