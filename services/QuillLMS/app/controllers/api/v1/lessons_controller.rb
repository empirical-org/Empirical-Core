class Api::V1::LessonsController < Api::ApiController
  before_action :lesson_type
  before_action :lesson_by_uid, except: [:index, :create, :show]

  def index
    all_lessons = Lesson.where(lesson_type: @lesson_type).reduce({}) { |agg, q| agg.update({q.uid => q.as_json}) }
    render(json: all_lessons)
  end

  def show
    @lesson = Lesson.find_by!(uid: params[:id], lesson_type: @lesson_type).to_json
    render(json: @lesson)
  end

  def create
    uid = SecureRandom.uuid
    @lesson = Lesson.create!(uid: uid, lesson_type: @lesson_type, data: valid_params)
    render(json: {@lesson.uid => @lesson.as_json})
  end

  def update
    @lesson.update!({data: valid_params})
    render(json: @lesson.as_json)
  end

  def destroy
    @lesson.destroy
    render(plain: 'OK')
  end

  private def lesson_type
    @lesson_type = params[:lesson_type]
  end

  private def lesson_by_uid
    @lesson = Lesson.find_by!(uid: params[:id], lesson_type: @lesson_type)
  end

  private def valid_params
    params.require(:lesson).except(:uid)
  end
end
