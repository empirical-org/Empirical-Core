# frozen_string_literal: true

class Api::V1::LessonsController < Api::ApiController
  before_action :staff_only, only: [:destroy]
  before_action :lesson_type, only: [:index, :create]
  before_action :lesson_by_uid, except: [:index, :create]
  LESSON_TYPE_TO_KEY = {
    "connect_lesson": "connect",
    "diagnostic_lesson": "diagnostic",
    "grammar_activity": "sentence",
    "proofreader_passage": "passage"
  }

  def index
    all_lessons = Activity.where(classification: @classification).reduce({}) { |agg, q| agg.update({q.uid => q.data_as_json}) }
    render(json: all_lessons)
  end

  def show
    render(json: @lesson.data_as_json)
  end

  def create
    uid = SecureRandom.uuid
    name = valid_params[:name] || valid_params[:title]
    @lesson = Activity.create!(uid: uid, classification: @classification, data: valid_params, name: name, flag: valid_params[:flag])
    render(json: {@lesson.uid => @lesson.data_as_json})
  end

  def update
    name = valid_params[:name] || valid_params[:title]
    @lesson.update!({data: valid_params, name: name, flag: valid_params[:flag]})
    render(json: @lesson.data_as_json)
  end

  def destroy
    @lesson.destroy
    render(plain: 'OK')
  end

  def add_question
    if @lesson.add_question(params[:question])
      render(json: @lesson.data_as_json)
    else
      render :json => { :errors => @lesson.errors.full_messages }, :status => 404
    end
  end

  private def lesson_type
    lesson_type = params[:lesson_type]
    classification_key = LESSON_TYPE_TO_KEY[lesson_type.to_sym]
    @classification = ActivityClassification.find_by_key(classification_key)
  end

  private def lesson_by_uid
    @lesson = Activity.find_by!(uid: params[:id])
  end

  private def valid_params
    params.require(:lesson).except(:uid)
  end
end
