require 'rails_helper'

RSpec.describe ChampionsController, type: :controller do
  let(:inviting_teacher) { create(:teacher) }

  it 'should trigger mailer with appropriate data' do
    # So we don't accidentally send emails on develop, many of our mailer
    # methods are scoped to production with the exception of if the email
    # address includes the quill.org domain. Let's just make these users'
    # email addresses include quill.org so we can test this properly.
    inviting_teacher.update(email: 'current_user@quill.org')
    invitee_email = 'invitee@quill.org'
    session[:user_id] = inviting_teacher.id
    post :invite, email: invitee_email
    expect { post :invite, email: invitee_email }.to change { ActionMailer::Base.deliveries.count }.by(1)
    expect(ActionMailer::Base.deliveries.last.subject).to eq("#{inviting_teacher.name} invites you to join Quill.org!")
    expect(ActionMailer::Base.deliveries.last.to).to eq([invitee_email])
  end
end
