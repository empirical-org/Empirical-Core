module Comprehension
  require 'json'

  class FeedbackController < ApplicationController
    skip_before_action :verify_authenticity_token
    PLAGIARISM_TYPE = 'plagiarism'
    PASSAGE_TYPE = 'passage'
    ENTRY_TYPE = 'response'
    ALL_CORRECT_FEEDBACK = 'All plagiarism checks passed.'

    def plagiarism
      entry = params[:entry]
      prompt = Comprehension::Prompt.find(params[:prompt_id])
      session_id = params[:session_id]
      previous_feedback = params[:previous_feedback]
      response_obj = {
        feedback: ALL_CORRECT_FEEDBACK,
        feedback_type: PLAGIARISM_TYPE,
        optimal: true,
        response_id: '',
        entry: entry,
        highlight: []
      }
      passage = prompt.plagiarism_text || ''

      cleaned_entry = clean(entry)
      cleaned_passage = clean(passage)

      if (cleaned_entry & cleaned_passage).size < 6 || cleaned_passage.empty?
        render json: response_obj
      else
        if passage.include? entry
          entry_split = entry.split
          entry_len = entry_split.size
          entry_hl = entry_split[0..(entry_len-2)].join(" ")
          passage_hl = entry_hl
          feedback = get_feedback_from_previous_feedback(previous_feedback, prompt)
          render json: response_obj.update(
            feedback: feedback,
            optimal: false,
            highlight: [
              {
                type: PASSAGE_TYPE,
                text: passage_hl,
                category: ''
              },
              {
                type: ENTRY_TYPE,
                text: entry_hl,
                category: ''
              }
            ]
          )
        else
          render json: response_obj
        end
      end
    end

    private def clean(str)
      downcase_split(no_punct(str))
    end

    private def downcase_split(str)
      str.downcase.split
    end

    private def no_punct(str)
      str.gsub(/[[:punct:]]/, '')
    end

    private def only_special_characters?(str)
      !!str.match(/\A\W*\z/)
    end

    private def get_feedback_from_previous_feedback(prev, prompt)
      previous_plagiarism = prev.select {|f| f["feedback_type"] == PLAGIARISM_TYPE && f["optimal"] == false }
      previous_plagiarism.empty? ? prompt.plagiarism_first_feedback : prompt.plagiarism_second_feedback
    end

    # def find_matches(entry, passage)
    #   # symbol_positions stores an array of all positions of punctuation marks e.g.
    #   # "cat, dog!" => [3, 8]
    #   symbol_positions = passage.enum_for(:scan, /[[:punct:]]/).map { Regexp.last_match.begin(0) }
    #   cleaned_passage = strip_punctuation_and_downcase(passage)

    #   entry_match, begin_idx, end_idx = match_entry_on_cleaned_passage(entry, cleaned_passage)
    #   passage_match = ""
    #   if !entry_match.blank?
    #     # m and n represent the # of punctuation marks that we removed
    #     # when we cleaned the passage. add this to indices to get the real start and end indices
    #     m = symbol_positions.select {|s| s <= begin_idx }.size
    #     n = symbol_positions.select {|s| begin_idx < s <= end_idx }.size
    #     passage_match = passage[(begin_idx + m)..(end_idx + n)]
    #   end
    #   return entry_match, passage_match
    # end

    # private def match_entry_on_cleaned_passage(entry, cleaned_passage)
    #   entry_len = entry.split.size
    #   slice_size = 6
    #   # this loop checks every slice of size 6, e.g.
    #   # "the cat ate the dog and everyone panicked" =>
    #   # 1. "the cat ate the dog and", 2. "cat ate the dog and everyone", 3. "ate the dog and everyone panicked"
    #   (0..(entry_len - slice_size)).each do |i|
    #     slice = get_slice_with_punctuation(entry, i, slice_size)
    #     begin_idx = match(slice, cleaned_passage)
    #     if begin_idx.present?
    #       matched_slice = slice
    #       # extend the slice size because the slice may actually be longer than 6. keep
    #       # adding words to the slice until we find a word that does not match.
    #       while true
    #         slice_size += 1
    #         slice = get_slice_with_punctuation(entry, i, slice_size)
    #         if !match(slice, cleaned_passage).present?
    #           break
    #         else
    #           matched_slice = slice
    #         end
    #       end
    #       end_idx = begin_idx.present? ? begin_idx + matched_slice.size :  nil
    #       return matched_slice, begin_idx, end_idx
    #     end
    #   end
    #   return ""
    # end

    # # return the starting index of the first match we find between
    # # the cleaned slice and the cleaned passage
    # private def match(slice, cleaned_passage)
    #   cleaned_slice = strip_punctuation_and_downcase(slice)
    #   cleaned_passage.index(cleaned_slice)
    # end

    # # return the slice of size [length] words starting at index i,
    # # ignoring punctuation (does not count punctuation as a word in wordcount)
    # private def get_slice_with_punctuation(string, i, length)
    #   string_builder = ""
    #   string_arr = string.split
    #   j = i
    #   while true
    #     word = string_arr[j]
    #     string_builder += word if word
    #     if only_special_characters?(word)
    #       # we dont count punctuation-only "words" as a word. we
    #       # include it in the slice but don't count it. e.g.
    #       # "I ... .. .. ,, .. ,, had the flu." is a 4-word slice
    #       continue
    #     else
    #       j++
    #     end
    #     break if (j - length) == i
    #   end
    # end
  end
end