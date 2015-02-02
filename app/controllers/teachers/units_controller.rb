class Teachers::UnitsController < ApplicationController
  #before_action :setup



  def create
	  # TODO refactor models to get rid of classroom_activity, its unneccessary
    
    # create a unit
    unit = Unit.create name: params[:unitName]

    # create a classroom_activity
    x1 = params[:pairsOfActivityIdAndDueDate]
    (JSON.parse(x1)).each do |pair|
      due_date = pair['dueDate']
      activity_id = pair['activityId']
      classrooms = JSON.parse(params[:selectedClassrooms])
      classrooms.each do |classroom|
        student_ids = (classroom['allStudents'] == true) ? nil : classroom['studentIds']
        #unit.classroom_activities.create activity_id: activity_id, classroom_id: classroom['classroom_id'], assigned_student_ids: student_ids, due_date: due_date
      end
    end

    # activity_sessions in the state of 'unstarted' are automatically created in an after_create callback in the classroom_activity model
  
    redirect_to teachers_classroom_scorebook_path(current_user.classrooms.first)

  end








  # def create
  #   @classroom.units.create_next
  #   redirect_to teachers_classroom_lesson_planner_path(@classroom)
  # end

# protected

#   def setup
#     @classroom = current_user.classrooms.find(params[:classroom_id])
#   end
end
