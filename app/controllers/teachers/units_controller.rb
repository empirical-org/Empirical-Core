class Teachers::UnitsController < ApplicationController
  #before_action :setup



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
    redirect_to teachers_classroom_scorebook_path(current_user.classrooms.first)

  end


  private

  def unit_params
    params.require(:unit).permit(:name, classrooms: [:id, :all_students, :student_ids => []], activities: [:id, :due_date])
  end



# protected

#   def setup
#     @classroom = current_user.classrooms.find(params[:classroom_id])
#   end
end
