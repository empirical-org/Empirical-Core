# frozen_string_literal: true

class Api::V1::ActivityQuestionsController < ApplicationController
  def index
    activity = Activity.find_by(uid: params[:activity_id])

    if activity.nil?
      render json: { error: 'Activity not found' }, status: :not_found
    else
      render json: cached_questions(activity)
    end
  end


  private def cached_questions(activity)
    Rails.cache.fetch(cache_key(activity), expires_in: 1.hour) do
      activity.questions.each_with_object({}) do |question, hash|
        hash[question.uid] = question.as_json(locale: params[:locale])
      end
    end
  end

  private def cache_key(activity)
    "activity_questions/#{activity.uid}/#{params[:locale]}"
  end
end
