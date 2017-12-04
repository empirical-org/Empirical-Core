class ClassroomsTeachersController < ApplicationController
  before_action :signed_in!

  def edit_coteacher_form
    classrooms_and_coteachers = ActiveRecord::Base.connection.execute("
      SELECT classrooms.id AS classroom_id, classrooms.name AS classroom_name, coteachers.name AS coteacher_name, coteachers.id AS coteacher_id
        FROM classrooms_teachers AS my_classrooms_teachers
        LEFT JOIN classrooms_teachers AS coteacher_classrooms_teachers
          ON coteacher_classrooms_teachers.classroom_id = my_classrooms_teachers.classroom_id
          AND coteacher_classrooms_teachers.role = 'coteacher'
        LEFT JOIN users AS coteachers ON coteacher_classrooms_teachers.user_id = coteachers.id
        JOIN classrooms ON classrooms.id = my_classrooms_teachers.classroom_id
        WHERE my_classrooms_teachers.role = 'owner' AND my_classrooms_teachers.user_id = #{current_user.id}
    ").to_a
    @classrooms_grouped_by_coteacher_id = Hash.new {|h,k| h[k] = [] }
    @coteachers = Set.new
    @classrooms = classrooms_and_coteachers.map do |classy|
      if classy["coteacher_id"]
        @coteachers << {id: classy['coteacher_id'], name: classy['coteacher_name']}
        @classrooms_grouped_by_coteacher_id[classy["coteacher_id"]].push(classy["classroom_id"])
      end
      {id: classy["classroom_id"], name: classy["classroom_name"]}
    end
    @classrooms.uniq!
    @classrooms
    @selected_teacher_id = params[:classrooms_teacher_id].to_i
  end

  def update_coteachers

    partitioned_classrooms = params[:classrooms].partition { |classroom| classroom['checked'] }
    positive_classroom_ids = partitioned_classrooms.first.collect { |classroom| classroom['id'].to_i }
    negative_classroom_ids = partitioned_classrooms.second.collect { |classroom |classroom['id'].to_i }

    coteacher = User.find(params[:classrooms_teacher_id].to_i)
    
    new_invitations_that_are_not_associations = positive_classroom_ids - coteacher.classrooms_i_teach.map{|c| c.id}

    # coteacher_relationships_to_destroy = coteacher_classroom_ids & negative_classroom_ids
    # coteacher_invitations_to_destroy = coteacher_classrooms_im_invited_to_teacher & negative_classroom_ids

    if new_invitations.any?
      invitation = Invitation.create(
        invitee_email: coteacher.email,
        inviter_id: current_user.id,
        invitation_type: Invitation::TYPES[:coteacher]
      )
      new_invitations.each do |id|
        classroom_owner!(id)
        CoteacherClassroomInvitation.find_or_create_by(invitation: invitation, classroom_id: id)
      end
    end

    # TODO account for if there is no pending invitation but is an association
    # TODO handle negative_classroom_ids

  end
end
