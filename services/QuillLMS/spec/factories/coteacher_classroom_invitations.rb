# frozen_string_literal: true

# == Schema Information
#
# Table name: coteacher_classroom_invitations
#
#  id            :integer          not null, primary key
#  created_at    :datetime
#  updated_at    :datetime
#  classroom_id  :integer          not null
#  invitation_id :integer          not null
#
# Indexes
#
#  classroom_invitee_index                                 (invitation_id,classroom_id) UNIQUE
#  index_coteacher_classroom_invitations_on_classroom_id   (classroom_id)
#  index_coteacher_classroom_invitations_on_invitation_id  (invitation_id)
#
FactoryBot.define do
  factory :coteacher_classroom_invitation do
    classroom { create(:classroom) }
    invitation { create(:pending_coteacher_invitation, inviter_id: Classroom.find(classroom_id).owner.id) }
  end
end
