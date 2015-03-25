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
        # student_ids = (classroom['allStudents'] == true) ? nil : classroom['studentIds']
        # #unit.classroom_activities.create activity_id: activity_id, classroom_id: classroom['classroom_id'], assigned_student_ids: student_ids, due_date: due_date
      end
    end

    # activity_sessions in the state of 'unstarted' are automatically created in an after_create callback in the classroom_activity model
    AssignActivityWorker.perform_async(current_user.id) # current_user should be the teacher
    render json: {}

  end

  def index
    cas = current_user.classrooms.map(&:classroom_activities).flatten
    units = cas.group_by{|ca| ca.unit_id}
    arr = []
    units.each do |unit_id, classroom_activities|

      x1 = classroom_activities.reject{|ca| ca.due_date.nil?}.compact

      x1 = x1.sort{|a, b| a.due_date <=> b.due_date}

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

      ele = {unit: Unit.find(unit_id), classroom_activities: x1, num_students_assigned: num_students_assigned, classrooms: classrooms}
      arr.push ele
    end


    render json: arr
  end

  def destroy
    (Unit.find params[:id]).destroy
    render json: {}
  end

  private

  def unit_params
    params.require(:unit).permit(:name, classrooms: [:id, :all_students, :student_ids => []], activities: [:id, :due_date])
  end

#   def setup
#     @classroom = current_user.classrooms.find(params[:classroom_id])
#   end
end