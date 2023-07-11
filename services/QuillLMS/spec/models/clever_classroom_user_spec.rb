# frozen_string_literal: true

# == Schema Information
#
# Table name: provider_classroom_users
#
#  id                    :bigint           not null, primary key
#  deleted_at            :datetime
#  type                  :string           not null
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  canvas_instance_id    :bigint
#  classroom_external_id :string           not null
#  user_external_id      :string           not null
#
# Indexes
#
#  index_provider_classroom_users_on_canvas_instance_id  (canvas_instance_id)
#  index_provider_type_and_classroom_id_and_user_id      (type,classroom_external_id,user_external_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (canvas_instance_id => canvas_instances.id)
#
require 'rails_helper'

RSpec.describe CleverClassroomUser, type: :model do
  subject { create(:clever_classroom_user)}

  it_behaves_like 'a provider classroom user'

  it { expect(subject.canvas_instance).to be nil}

  it { expect(subject.clever_classroom_id).to eq subject.classroom_external_id }
  it { expect(subject.clever_user_id).to eq subject.user_external_id }

  it { expect { subject.google_classroom_id }.to raise_error NotImplementedError }
  it { expect { subject.google_id }.to raise_error NotImplementedError }
end
