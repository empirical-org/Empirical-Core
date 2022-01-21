# frozen_string_literal: true

require 'pragmatic_segmenter'

module Evidence
  class PrefilterCheck
    attr_reader :prefilter_rules, :entry

    MINIMUM_WORD_COUNT = 3

    OPTIMAL_RULE_UID            = 'a7410335-5dae-4fc7-832a-ce9cf8d5dffb'
    QUESTION_MARK_RULE_UID      = 'f576dadc-7eec-4e27-8c95-7763e6550141'
    MULTIPLE_SENTENCE_RULE_UID  = '66779e2a-74ed-4099-8704-11983121fee5'
    PROFANITY_RULE_UID          = 'fdee458a-f017-4f9a-a7d4-a72d1143abeb'
    MINIMUM_WORD_RULE_UID       = '408d4544-5492-46e7-a6b7-3b1ffdd632af'

    # When a prefilter lambda identifies a violation, it returns true
    PREFILTERS = {
      QUESTION_MARK_RULE_UID      => ->(entry) { entry.match?(/\?$/) },
      MULTIPLE_SENTENCE_RULE_UID  => ->(entry) { sentence_count(entry) > 1 },
      PROFANITY_RULE_UID          => ->(entry)  do 
        profanity = Profanity.profane(entry)
        if profanity.nil?
          false 
        else 
          @profanity_instance = profanity
          true
        end
      end,
      MINIMUM_WORD_RULE_UID       => ->(entry) { word_count(entry) < MINIMUM_WORD_COUNT}
    }

    def initialize(entry)
      @entry = entry
      @prefilter_rules = Evidence::Rule.where(rule_type: Evidence::Rule::TYPE_PREFILTER).includes(:feedbacks)
      @violated_rule = nil
      @profanity_instance = nil
    end

    def default_response
      {
        feedback: '',
        feedback_type: Evidence::Rule::TYPE_PREFILTER,
        optimal: true,
        response_id: '',
        entry: entry,
        concept_uid: '',
        rule_uid: OPTIMAL_RULE_UID,
        highlight: []
      }
    end

    def feedback_object
      @violated_rule = prefilter_rules.find do |rule|
        next unless PREFILTERS[rule.uid]
        PREFILTERS[rule.uid].call(entry)
      end

      return default_response unless @violated_rule

      feedback = @violated_rule.feedbacks.first

      default_response.merge(
        {
          feedback: feedback&.text,
          optimal: false,
          rule_uid: @violated_rule.uid,
          highlight: highlights
        }
      )
    end

    def self.words(entry)
      entry.split
    end

    def self.word_count(entry)
       words(entry).reject(&:empty?).count
    end

    def self.sentence_count(entry)
      PragmaticSegmenter::Segmenter.new(text: entry).segment.count
    end

    def highlights
      return [] if @violated_rule != PROFANITY_RULE_UID
      [{
        type: Evidence::Highlight::TYPES[RESPONSE],
        text: @profanity_instance,
        category: ''
      }]
    end

  end
end
