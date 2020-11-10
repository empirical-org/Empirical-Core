require 'rails_helper'

describe CompleteAccountCreation do

  it 'triggers account creation when user is a teacher' do
    user = create(:user, role: 'teacher')

    expect(AccountCreationWorker).to receive(:perform_async).with(user.id)

    CompleteAccountCreation.new(user, 'some_ip').call
  end

  it 'triggers the iplocation worker when user is a teacher' do
    user = create(:user, role: 'teacher')

    expect(IpLocationWorker).to receive(:perform_async).with(user.id, 'some_ip')

    CompleteAccountCreation.new(user, 'some_ip').call
  end

  it 'triggers the account creation worker when user is student' do
    user = create(:user, role: 'student')

    expect(AccountCreationWorker).to receive(:perform_async).with user.id

    CompleteAccountCreation.new(user, 'some_ip').call
  end
end
