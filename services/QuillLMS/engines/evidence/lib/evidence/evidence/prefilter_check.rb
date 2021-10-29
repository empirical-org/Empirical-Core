module Evidence
  class PrefilterCheck
    attr_accessor :prefilter_rules
    MINIMUM_WORD_COUNT = 3
    OPTIMAL_RULE_UID = '' # TODO: populate

    PREFILTERS = {
      # TODO: populate
    }

    def initialize(entry)
      @entry = entry
      @prefilter_rules = Evidence::Rule.where(rule_type: Evidence::Rule::TYPE_PREFILTER).includes(:feedbacks)
      
    end

    def default_response
      {
        feedback: '',
        feedback_type: Evidence::Rule::TYPE_PREFILTER,
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
        !PREFILTERS[rule.uid].call(@entry) 
      end
      return default_response unless violated_rule

      feedback = violated_rule.feedbacks.first

      default_response.merge(
        {
          feedback: feedback&.text,
          optimal: false,
          rule_uid: violated_rule.uid
        }
      )
    end

    def self.to_word_array(entry)
      entry.split(' ')
    end

  end
end
