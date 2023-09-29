# frozen_string_literal: true

# == Schema Information
#
# Table name: invitations
#
#  id              :integer          not null, primary key
#  archived        :boolean          default(FALSE)
#  invitation_type :string
#  invitee_email   :string           not null
#  created_at      :datetime
#  updated_at      :datetime
#  inviter_id      :integer          not null
#
# Indexes
#
#  index_invitations_on_invitee_email  (invitee_email)
#  index_invitations_on_inviter_id     (inviter_id)
#
FactoryBot.define do
  factory :invitation do
    invitee_email { create(:user).email }
    inviter_id { create(:teacher).id }

    factory :pending_coteacher_invitation do
      invitee_email { create(:teacher).email }
      invitation_type { Invitation::TYPES[:coteacher] }
      archived { false }
    end
  end
end
