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

    def initialize(entry)
      # When a prefilter lambda identifies a violation, it returns true
      @prefilters = {
        QUESTION_MARK_RULE_UID      => ->(the_entry) { the_entry.match?(/\?$/) },
        MULTIPLE_SENTENCE_RULE_UID  => ->(the_entry) { PrefilterCheck.sentence_count(the_entry) > 1 },
        PROFANITY_RULE_UID          => ->(the_entry) { profanity? },
        MINIMUM_WORD_RULE_UID       => ->(the_entry) { PrefilterCheck.word_count(the_entry) < MINIMUM_WORD_COUNT}
      }

      @entry = entry
      @prefilter_rules = Evidence::Rule.where(rule_type: Evidence::Rule::TYPE_PREFILTER).includes(:feedbacks)
      @violated_rule = nil
      @profanity_instance = Profanity.profane(entry)
    end

    def profanity?
      @profanity_instance.present?
    end

    def default_response
      {
        feedback: '',
        feedback_type: Evidence::Rule::TYPE_PREFILTER,
        optimal: true,
        entry: entry,
        concept_uid: '',
        rule_uid: OPTIMAL_RULE_UID,
        highlight: []
      }
    end

    def feedback_object
      @violated_rule = prefilter_rules.find do |rule|
        next unless @prefilters[rule.uid]

        @prefilters[rule.uid].call(entry)
      end
      return default_response unless @violated_rule

      feedback = @violated_rule.feedbacks.first

      default_response.merge(
        {
          feedback: feedback&.text,
          optimal: false,
          rule_uid: @violated_rule.uid,
          hint: @violated_rule.hint,
          highlight: highlights,
          concept_uid: @violated_rule.concept_uid
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
      return [] if @violated_rule.uid != PROFANITY_RULE_UID

      [{
        type: Evidence::Highlight::TYPE_RESPONSE,
        text: @profanity_instance,
        category: ''
      }]
    end

  end
end
