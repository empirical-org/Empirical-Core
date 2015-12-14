class Teachers::UnitsController < ApplicationController
  respond_to :json
  before_filter :teacher!

  def create

    # create a unit
    unit = Unit.create name: unit_params['name']

    # Request format:
    #   unit: {
    #     name: string
    #     classrooms: [{
    #       id: int
    #       all_students: boolean
    #       student_ids: [int]
    #     }]
    #     activities: [{
    #       id: int
    #       due_date: string
    #     }]
    #   }

    unit_params['activities'].each do |key, activity_data|
      activity_id = activity_data['id']
      due_date = activity_data['due_date']
      unit_params['classrooms'].each do |key, classroom_data|
        classroom_data['student_ids'] ||= []
        unit.classroom_activities.create!(activity_id: activity_id,
                                          classroom_id: classroom_data['id'],
                                          assigned_student_ids: (classroom_data['student_ids'] ) ,
                                          due_date: due_date)
      end
    end

    # activity_sessions in the state of 'unstarted' are automatically created in an after_create callback in the classroom_activity model
    AssignActivityWorker.perform_async(current_user.id) # current_user should be the teacher
    render json: {}

  end

  def index
    # cas = current_user.classrooms.includes(:students, classroom_activities: :activity, classroom_activities: :topic).map(&:classroom_activities).flatten
    cas = current_user.classrooms.includes(:students, classroom_activities: [{activity: :classification}, :topic]).map(&:classroom_activities).flatten
    units = cas.group_by{|ca| ca.unit_id}
    arr = []
    units.each do |unit_id, classroom_activities|

      x1 = classroom_activities.compact

      x1 = ClassroomActivitySorter::sort(x1)

      x1 = x1.map{|ca| (ClassroomActivitySerializer.new(ca)).as_json(root: false)}

      classrooms = x1.map{|ca| ca[:classroom]}.compact.uniq

      assigned_student_ids = []

      classroom_activities.each do |ca|
        if ca.assigned_student_ids.nil? or ca.assigned_student_ids.length == 0
          y = ca.classroom.students.map(&:id)
        else
          y = ca.assigned_student_ids
        end
        assigned_student_ids = assigned_student_ids.concat(y)
      end

      num_students_assigned = assigned_student_ids.uniq.length

      x1 = x1.uniq{|y| y[:activity_id] }

      unit = Unit.where(id: unit_id).first
      if unit.present?
        ele = {unit: unit, classroom_activities: x1, num_students_assigned: num_students_assigned, classrooms: classrooms}
        arr.push ele
      end
    end

    arr1, arr2 = arr.partition{|a| a[:unit].created_at.present? }
    arr1 = arr1.sort_by{|ele| ele[:unit].created_at}.reverse
    render json: arr1.concat(arr2)
  end

  def hide
    unit = Unit.find(params[:id])
    unit.visible = false
    unit.save(validate: false)
    render json: {}
  end

  def destroy
    (Unit.find params[:id]).destroy
    render json: {}
  end


  private

  def unit_params
    params.require(:unit).permit(:name, classrooms: [:id, :all_students, student_ids: []], activities: [:id, :due_date])
  end

#   def setup
#     @classroom = current_user.classrooms.find(params[:classroom_id])
#   end
end
