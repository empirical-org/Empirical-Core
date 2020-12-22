module Comprehension
  class PlagiarismCheck

    ALL_CORRECT_FEEDBACK = 'All plagiarism checks passed.'
    PASSAGE_TYPE = 'passage'
    ENTRY_TYPE = 'response'
    MATCH_MINIMUM = 6
    attr_reader :entry, :passage, :nonoptimal_feedback

    def initialize(entry, passage, feedback)
      @entry = entry
      @passage = passage
      @nonoptimal_feedback = feedback
    end

    def optimal?
      matched_slice.blank?
    end

    def feedback
      optimal? ? ALL_CORRECT_FEEDBACK : nonoptimal_feedback
    end

    def highlights
      return [] if optimal?
      [entry_highlight, passage_highlight]
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
      !clean_passage.empty? && (clean_entry.split & clean_passage.split).size >= MATCH_MINIMUM
    end

    private def clean(str)
      str.gsub(/[[:punct:]]/, '').downcase
    end

    # 1) split the entry into an array: ["i", "had", "a", "great", "time", "with", "you"]
    # 2) slice that array into contiguous 6-word slices and filter for plagiarized slices
    # 3) using the indices of plagiarized slices, find the longest continuous plagiarized section
    # 4) piece together the words of the longest plagiarized section and return that string
    private def match_entry_on_passage
      # 1
      entry_arr = clean_entry.split

      # 2
      slices = entry_arr.each_cons(MATCH_MINIMUM).with_index.to_a.map(&:reverse).to_h
      matched_slices = slices.select {|k,v| v.in?(passage_word_arrays) }.keys
      return "" if matched_slices.empty?

      # 3
      matched_consecutive_indices = matched_slices.slice_when {|before_item, after_item| after_item != before_item + 1}.to_a
      longest_consecutive_indices = matched_consecutive_indices.max { |a, b| a.size <=> b.size }

      # 4
      string_result = slices[longest_consecutive_indices[0]].join(' ')
      longest_consecutive_indices.drop(1).each {|i| string_result += ' ' + slices[i].last}
      string_result
    end

    private def get_slice(array, start_index, slice_size)
      end_index = start_index + slice_size - 1
      return array[start_index..end_index].join(' ') if end_index < array.size
      ""
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
