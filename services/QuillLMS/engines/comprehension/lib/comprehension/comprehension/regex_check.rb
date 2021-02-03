module Comprehension
  class RegexCheck

    ALL_CORRECT_FEEDBACK = 'All regex checks passed.'
    attr_reader :entry, :prompt_id

    def initialize(entry, prompt_id)
      @entry = entry
      @prompt_id = prompt_id
    end

    def optimal?
      matched_rule.blank?
    end

    def feedback
      optimal? ? ALL_CORRECT_FEEDBACK : nonoptimal_feedback
    end

    private def matched_rule
      rules = Prompt.find(@prompt_id).rules.where(rule_type: Rule::TYPE_REGEX).order_by(:suborder)


    end

    private def passage_highlight
      {
        type: PASSAGE_TYPE,
        text: get_highlight(passage, clean_passage),
        category: ''
      }
    end

    private def entry_highlight
      {
        type: ENTRY_TYPE,
        text: get_highlight(entry, clean_entry),
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

    private def minimum_overlap?
      !clean_passage.empty? && (intersect_with_duplicates(clean_entry.split, clean_passage.split)).size >= MATCH_MINIMUM
    end

    private def intersect_with_duplicates(arr1, arr2)
      (arr1 & arr2).flat_map { |n| [n]*[arr1.count(n), arr2.count(n)].min }
    end

    private def clean(str)
      str.gsub(/[[:punct:]]/, '').downcase
    end

    # split the entry into an array: ["i", "had", "a", "great", "time", "with", "you"]
    # slice that array into contiguous 6-word slices and filter for plagiarized slices
    private def match_entry_on_passage
      entry_arr = clean_entry.split

      slices = entry_arr.each_cons(MATCH_MINIMUM).with_index.to_a.map(&:reverse).to_h
      matched_slices = slices.select {|k,v| v.in?(passage_word_arrays) }.keys
      return "" if matched_slices.empty?

      build_longest_continuous_slice(matched_slices, slices)
    end

    # using the indices of plagiarized slices, find the longest continuous plagiarized section
    # piece together the words of the longest plagiarized section and return that string
    def build_longest_continuous_slice(matched_slices, slices)
      matched_consecutive_indices = matched_slices.slice_when {|before_item, after_item| after_item != before_item + 1}.to_a
      longest_consecutive_indices = matched_consecutive_indices.max_by(&:size)

      string_result = slices[longest_consecutive_indices[0]].join(' ')
      longest_consecutive_indices.drop(1).each {|i| string_result += ' ' + slices[i].last}
      string_result
    end

    def passage_word_arrays
      @passage_word_arrays ||= clean_passage.split.each_cons(MATCH_MINIMUM).to_a
    end

    private def get_highlight(text, cleaned_text)
      start_index = cleaned_text.index(matched_slice)
      end_index = start_index + matched_slice.size - 1
      char_positions = text.enum_for(:scan, /[A-Za-z0-9\s]/).map { |c| Regexp.last_match.begin(0) }
      text[char_positions[start_index]..char_positions[end_index]]
    end
  end
end
