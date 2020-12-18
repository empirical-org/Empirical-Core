module Comprehension
  class PlagiarismCheck

    ALL_CORRECT_FEEDBACK = 'All plagiarism checks passed.'
    PASSAGE_TYPE = 'passage'
    ENTRY_TYPE = 'response'
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
      [ entry_highlight, passage_highlight ]
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
      return "" if no_matching_strings?
      @matched_slice ||= match_entry_on_passage
    end

    private def no_matching_strings?
      (clean_entry.split & clean_passage.split).size < 6 || clean_passage.empty?
    end

    private def clean(str)
      str.gsub(/[[:punct:]]/, '').downcase
    end

    private def match_entry_on_passage
      entry_arr = clean_entry.split
      entry_len = entry_arr.size
      slice_size = 6
      left_index = 0
      longest_slice_found = ""
      while left_index <= (entry_len - slice_size) do
        curr_slice = get_slice(entry_arr, left_index, slice_size)
        if clean_passage.include?(curr_slice)
          trimmed_passage = clean_passage[clean_passage.index(curr_slice)..-1]
          extended_slice = extend_slice(curr_slice, entry_arr, left_index, slice_size, trimmed_passage)
          longest_slice_found = extended_slice if extended_slice.size > longest_slice_found.size
          left_index += extended_slice.split.length
        else
          left_index += 1
        end
      end
      return longest_slice_found
    end

    private def extend_slice(longest_match_found, entry_arr, idx, slice_size, passage)
      loop do
        slice_size += 1
        match_candidate = get_slice(entry_arr, idx, slice_size)
        break if !passage.include?(match_candidate) || (idx + slice_size) > entry_arr.size
        longest_match_found = match_candidate
      end
      return longest_match_found
    end

    private def get_slice(array, start_index, slice_size)
      end_index = start_index + slice_size - 1
      return array[start_index..end_index].join(' ') if end_index < array.size
      return ""
    end

    private def get_highlight(text, cleaned_text)
      i = cleaned_text.index(matched_slice)
      j = i + matched_slice.size - 1
      char_positions = text.enum_for(:scan, /[A-Za-z0-9\s]/).map { |c| Regexp.last_match.begin(0) }
      return text[char_positions[i]..char_positions[j]]
    end
  end
end
