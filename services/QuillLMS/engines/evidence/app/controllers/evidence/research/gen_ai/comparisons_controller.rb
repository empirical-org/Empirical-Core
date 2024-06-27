# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class ComparisonsController < ApplicationController
        def show
          @comparison = Comparison.find(params[:id])
          @trials = @comparison.trials.order(id: :asc)
          @quill_feedbacks = @trials.first.llm_feedbacks.map(&:quill_feedback)
          @next = Comparison.where("id > ?", @comparison.id).order(id: :asc).first
          @previous = Comparison.where("id < ?", @comparison.id).order(id: :desc).first
        end
      end
    end
  end
end
