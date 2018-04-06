require 'rails_helper'

describe Teachers::ClassroomManagerController, type: :controller do

  context '#archived_classroom_manager_data' do
    it 'returns all invited, archived, and nonarchived classrooms' do
      teacher = create(:teacher_with_a_couple_active_and_archived_classrooms)
      invitation = create(:pending_coteacher_invitation, invitee_email: teacher.email)
      classroom_invitations = create_pair(:coteacher_classroom_invitation, invitation_id: invitation.id)
      all_classrooms = ClassroomsTeacher.where(user_id: teacher.id).map { |ct| Classroom.unscoped.find ct.classroom_id }
      visible_classrooms = all_classrooms.select(&:visible)
      archived_classrooms = all_classrooms - visible_classrooms
      active_classrooms = classroom_invitations.map { |classroom_invitation|
        {
          classroom_invitation_id: classroom_invitation.id,
          inviter_name: classroom_invitation.invitation.inviter.name,
          classroom_name: classroom_invitation.classroom.name,
          invitation: true
        }
      }
      active_classrooms = sanitize_hash_array_for_comparison_with_sql(active_classrooms) + visible_classrooms.map(&:archived_classrooms_manager)
      session[:user_id] = teacher.id
      get :archived_classroom_manager_data

      expect(response.body).to eq({
        active: active_classrooms,
        active_classrooms_i_own: teacher.classrooms_i_own.map{|c| {label: c[:name], value: c[:id]}},
        inactive: archived_classrooms.map(&:archived_classrooms_manager),
        coteachers: teacher.classrooms_i_own_that_have_coteachers,
        pending_coteachers: teacher.classrooms_i_own_that_have_pending_coteacher_invitations,
        my_name: teacher.name
      }.to_json)
    end
  end

end
