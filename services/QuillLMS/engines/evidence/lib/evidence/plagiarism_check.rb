# frozen_string_literal: true

require 'hotwater'

module Evidence
  class PlagiarismCheck

    ALL_CORRECT_FEEDBACK = '<p>All plagiarism checks passed.</p>'
    PASSAGE_TYPE = 'passage'
    ENTRY_TYPE = 'response'
    MATCH_MINIMUM = 10
    OPTIMAL_RULE_KEY = 'optimal_plagiarism_rule_serialized'
    FUZZY_CHARACTER_THRESHOLD = 3
    attr_reader :entry, :passage, :nonoptimal_feedback

    def initialize(entry, passage, feedback, rule)
      @entry = entry
      @passage = passage
      @nonoptimal_feedback = feedback
      @rule = rule
    end

    def feedback_object
      {
        feedback: feedback,
        feedback_type: Rule::TYPE_PLAGIARISM,
        optimal: optimal?,
        entry: @entry,
        concept_uid: optimal? ? optimal_rule_hash["concept_uid"] : @rule&.concept_uid,
        rule_uid: optimal? ? optimal_rule_hash["uid"] : @rule&.uid,
        hint: optimal? ? nil : @rule&.hint,
        highlight: highlights
      }
    end

    private def optimal_rule_hash
      cached = $redis.get(OPTIMAL_RULE_KEY)
      serialized_optimal_rule = cached.nil? || cached&.blank? ? nil : JSON.parse(cached)
      unless serialized_optimal_rule
        serialized_optimal_rule = Evidence::Rule.find_by(optimal: true, rule_type: Rule::TYPE_PLAGIARISM).to_json
        $redis.set(OPTIMAL_RULE_KEY, serialized_optimal_rule)
      end
      serialized_optimal_rule || {}
    end

    private def optimal?
      matched_slice.blank?
    end

    private def feedback
      optimal? ? ALL_CORRECT_FEEDBACK : nonoptimal_feedback
    end

    private def highlights
      return [] if optimal?

      [entry_highlight, passage_highlight]
    end

    private def passage_highlight
      {
        type: PASSAGE_TYPE,
        text: get_highlight(passage, clean_passage, matched_slice_passage),
        category: ''
      }
    end

    private def entry_highlight
      {
        type: ENTRY_TYPE,
        text: get_highlight(entry, clean_entry, matched_slice),
        category: ''
      }
    end

    private def clean_entry
      @clean_entry ||= clean(entry)
    end

    private def clean_passage
      @clean_passage ||= clean(passage)
    end

    private def matched_slice
      return "" if !minimum_overlap?

      @matched_slice ||= match_entry_on_passage
    end

    private def matched_slice_passage
      return "" if !minimum_overlap?

      @matched_slice_passage ||= match_passage_on_entry
    end

    private def minimum_overlap?
      !clean_passage.empty? && [clean_entry.split.size, clean_passage.split.size].min >= MATCH_MINIMUM
    end

    private def clean(str)
      str.gsub(/[[:punct:]]/, '').downcase
    end

    # split the entry into an array: ["i", "had", "a", "great", "time", "with", "you"]
    # slice that array into contiguous 6-word slices and filter for plagiarized slices
    private def match_entry_on_passage
      entry_arr = clean_entry.split

      slices = entry_arr.each_cons(MATCH_MINIMUM)
      identify_first_matched_substring(slices, passage_word_arrays)
    end

    private def match_passage_on_entry
      entry_arr = clean_entry.split

      slices = entry_arr.each_cons(MATCH_MINIMUM)
      identify_first_matched_substring(passage_word_arrays, slices)
    end

    # rubocop:disable Metrics/CyclomaticComplexity
    private def identify_first_matched_substring(slices_to_assemble, slices_to_match)
      combined_matched_slices = []
      # Placeholder to be overridden during the first run of the loop that makes it past the confirm_minimum_overlap? guard statement.  If that never happens, we don't have to calculate this value
      slices_to_match_strings = nil
      slices_to_assemble.each do |slice|
        next false unless confirm_minimum_overlap?(slice, slices_to_match)

        slice_string = slice.join(' ')
        slices_to_match_strings ||= slices_to_match.map { |s| s.join(' ') }
        match = slices_to_match_strings.any? { |match_string| ::Hotwater.levenshtein_distance(slice_string, match_string) <= FUZZY_CHARACTER_THRESHOLD }
        if match
          # If we have our first match, we want to populate the return value with the full string from
          # that match
          if combined_matched_slices.empty?
            combined_matched_slices = slice_string
          # If this is a subsequent match, we already have most of the words from the match in the
          # return value already, and only need the last word (which will be the new word)
          else
            combined_matched_slices += " #{slice.last}"
          end
        # If we've been matching a series of slices, and this slice doesn't match, we've found
        # all the contiguous matched slices and can stop
        else
          break unless combined_matched_slices.empty?
        end
      end
      combined_matched_slices
    end
    # rubocop:enable Metrics/CyclomaticComplexity

    private def confirm_minimum_overlap?(target_array, source_arrays)
      # Since we allow character deviation that's smaller than the total number of words compared
      # we know that there's a minimum number of words that have to be identical.  This function
      # confirms that minimum amount of overlap to justify doing a set of Levenshtein calculations.
      source_arrays.any? do |source_array|
        ((target_array - source_array).length <= FUZZY_CHARACTER_THRESHOLD ||
         (source_array - target_array).length <= FUZZY_CHARACTER_THRESHOLD)
      end
    end

    def passage_word_arrays
      @passage_word_arrays ||= clean_passage.split.each_cons(MATCH_MINIMUM).to_a
    end

    # rubocop:disable Metrics/CyclomaticComplexity
    private def get_highlight(text, cleaned_text, matched_slice)
      extra_space_indexes = []
      cleaned_text.each_char.with_index { |c, i| extra_space_indexes.push(i) if c == ' ' && cleaned_text[i+1] == ' ' }

      space_normalized_text = cleaned_text.split.join(' ')

      start_index = space_normalized_text.index(matched_slice)
      extra_space_indexes.each { |i| start_index += 1 if i <= start_index }

      end_index = start_index + matched_slice.size - 1
      extra_space_indexes.each { |i| end_index += 1 if i > start_index && i <= end_index }

      char_positions = text.enum_for(:scan, /[A-Za-z0-9\s]/).map { |c| Regexp.last_match.begin(0) }
      text[char_positions[start_index]..char_positions[end_index]]
    end
    # rubocop:enable Metrics/CyclomaticComplexity
  end
end
