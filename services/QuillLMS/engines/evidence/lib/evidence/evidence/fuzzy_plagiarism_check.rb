# frozen_string_literal: true

module Evidence
  class FuzzyPlagiarismCheck < PlagiarismCheck

    FUZZY_CHARACTER_THRESHOLD = 5

    private def fuzzy_match?
      true
    end

    private def minimum_overlap?
      !clean_passage.empty? && [clean_entry.split.size, clean_passage.split.size].min >= MATCH_MINIMUM
    end

    private def identify_matched_slices(entry_slices, passage_slices)
      entry_slices.select do |k,v|
        slice_string = v.join(' ')
        passage_slice_strings = passage_slices.map { |s| s.join(' ') }
        passage_slice_strings.any? { |passage_string| DidYouMean::Levenshtein.distance(slice_string, passage_string) <= FUZZY_CHARACTER_THRESHOLD }
      end.keys
    end
  end
end
