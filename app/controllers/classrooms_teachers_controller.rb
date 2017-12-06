class ClassroomsTeachersController < ApplicationController
  before_action :signed_in!
  before_action :multi_classroom_auth, only: :update_coteachers

  def edit_coteacher_form
    @classrooms = current_user.classrooms_i_own
    @coteachers = @classrooms.map(&:coteachers).flatten.uniq
    @selected_teacher_id = params[:classrooms_teacher_id].to_i
    @selected_teachers_classrooms = edit_info_for_specific_teacher(@selected_teacher_id)
    # @classrooms_grouped_by_coteacher_id = Hash.new {|h,k| h[k] = [] }
    # @coteachers = Set.new
    # @classrooms = classrooms_and_coteachers.map do |classy|
    #   if classy["coteacher_id"]
    #     @coteachers << {id: classy['coteacher_id'], name: classy['coteacher_name']}
    #     @classrooms_grouped_by_coteacher_id[classy["coteacher_id"]].push(classy["classroom_id"])
    #   end
    #   {id: classy["classroom_id"], name: classy["classroom_name"]}
    # end
    # @classrooms.uniq!
    # @classrooms
    # @selected_teacher_id = params[:classrooms_teacher_id].to_i
  end

  def update_coteachers
    begin
      partitioned_classrooms = params[:classrooms].partition { |classroom| classroom['checked'] }
      positive_classroom_ids = partitioned_classrooms.first.collect { |classroom| classroom['id'].to_i }
      negative_classroom_ids = partitioned_classrooms.second.collect { |classroom |classroom['id'].to_i }
      coteacher = User.find(params[:classrooms_teacher_id].to_i)
      coteacher.handle_negative_classrooms_from_update_coteachers(negative_classroom_ids)
      coteacher.handle_positive_classrooms_from_update_coteachers(positive_classroom_ids, current_user.id)
    rescue => e
      return render json: { error_message: e }, status: 422
    end
    return render json: {message: 'Update Succeeded!'}
  end

  private

  def multi_classroom_auth
    uniqued_classroom_ids = params[:classrooms].uniq
    ClassroomsTeacher.where(user_id: current_user.id, classroom_id: uniqued_classroom_ids, role: 'owner').length == uniqued_classroom_ids.length
  end

  def edit_info_for_specific_teacher(selected_teacher_id)
    {is_coteacher: current_user.classrooms_i_coteach_with_a_specific_teacher(selected_teacher_id).map(&:id), invited_to_coteach: current_user.classroom_ids_i_have_invitited_a_specific_teacher_to_coteach(selected_teacher_id)}
  end


end
