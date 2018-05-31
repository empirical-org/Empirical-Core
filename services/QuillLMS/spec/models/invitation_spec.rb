require 'rails_helper'

RSpec.describe Invitation, type: :model do
  let(:teacher) { create(:teacher_with_a_couple_classrooms_with_one_student_each) }

  describe 'validations' do

    it 'should downcase invitee email before saving' do
      invitee_email = 'ANGRY@example.com'
      invite = Invitation.create(invitee_email: invitee_email, inviter: teacher, invitation_type: Invitation::TYPES[:coteacher])
      expect(invite.invitee_email).to eq(invitee_email.downcase) 
    end

  end
end