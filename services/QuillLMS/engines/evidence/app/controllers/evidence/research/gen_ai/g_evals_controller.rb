# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class GEvalsController < ApplicationController
        def new = @g_eval = GEval.new(g_eval_params)

        def create
          @g_eval = GEval.new(g_eval_params)

          @g_eval.save ? redirect_to(@g_eval) : render(:new)
        end

        def show = @g_eval = GEval.find(params[:id])

        private def g_eval_params
          params
            .require(:research_gen_ai_g_eval)
            .permit(:task_introduction, :evaluation_criteria, :evaluation_steps, :metric, :max_score)
        end
      end
    end
  end
end
