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

      if (cleaned_entry.split & cleaned_passage.split).size < 6 || cleaned_passage.empty?
        render json: response_obj
      else
        matched_slice = match_entry_on_passage(cleaned_entry, cleaned_passage)
        if !matched_slice.blank?
          entry_hl = get_highlight(entry, cleaned_entry, matched_slice)
          passage_hl = get_highlight(passage, cleaned_passage, matched_slice)
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
      str.gsub(/[[:punct:]]/, '').downcase
    end

    private def get_feedback_from_previous_feedback(prev, prompt)
      previous_plagiarism = prev.select {|f| f["feedback_type"] == PLAGIARISM_TYPE && f["optimal"] == false }
      previous_plagiarism.empty? ? prompt.plagiarism_first_feedback : prompt.plagiarism_second_feedback
    end

    private def match_entry_on_passage(entry, passage)
      entry_arr = entry.split
      entry_len = entry_arr.size
      slice_size = 6
      (0..(entry_len - slice_size)).each do |i|
        curr_slice = get_slice(entry_arr, i, slice_size)
        if passage.include?(curr_slice)
          matched_slice = curr_slice
          while true
            slice_size += 1
            curr_slice = get_slice(entry_arr, i, slice_size)
            if !passage.include?(curr_slice) || (i + slice_size) > entry_arr.size
              break
            else
              matched_slice = curr_slice
            end
          end
          return matched_slice
        end
      end
      return ""
    end

    private def get_slice(array, start_index, slice_size)
      end_index = start_index + slice_size - 1
      if end_index < array.size
        return array[start_index..end_index].join(' ')
      end
      return ""
    end

    private def get_highlight(text, cleaned_text, matched_slice)
      i = cleaned_text.index(matched_slice)
      j = i + matched_slice.size - 1
      char_positions = text.enum_for(:scan, /[A-Za-z0-9\s]/).map { |c| Regexp.last_match.begin(0) }
      return text[char_positions[i]..char_positions[j]]
    end

  end
end
