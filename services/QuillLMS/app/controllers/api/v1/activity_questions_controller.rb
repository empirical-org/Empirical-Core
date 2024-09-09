# frozen_string_literal: true

class Api::V1::ActivityQuestionsController < ApplicationController
  def index
    activity = Activity.find_by(uid: permitted_params[:activity_id])

    if activity.nil?
      render json: { error: 'Activity not found' }, status: :not_found
    else
      render json: cached_questions(activity)
    end
  end

  private def cached_questions(activity)
    Rails.cache.fetch(cache_key(activity), expires_in: 1.hour) do
      activity.questions.each_with_object({}) do |question, hash|
        hash[question.uid] = question.as_json(language: permitted_params[:language])
      end
    end
  end

  private def cache_key(activity)
    "activity_questions/#{activity.uid}/#{permitted_params[:language]}"
  end

  private def permitted_params
    params.permit(:activity_id, :language)
  end
end
