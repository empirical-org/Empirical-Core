# frozen_string_literal: true

RSpec.shared_context 'Canvas user auth hash' do
  let(:canvas_instance) { create(:canvas_config).canvas_instance }
  let(:canvas_user_email) { 'teacher_user@example.org' }
  let(:canvas_user_external_id) { rand(1..99999) }
  let(:canvas_user_name) { 'Teacher User' }

  let(:auth_hash) do
    create(:canvas_auth_hash,
      email: canvas_user_email,
      name: canvas_user_name,
      uid: canvas_user_external_id,
      url: canvas_instance.url
    )
  end
end
