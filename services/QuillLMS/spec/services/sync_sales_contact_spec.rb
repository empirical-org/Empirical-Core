require 'rails_helper'

describe SyncSalesContact do
  it 'syncs salesmachine with teacher data' do
    user                = create(:user, role: 'teacher')
    serializer_instance = double('serializer_instance')
    serializer          = double('serializer')
    client              = double('client')
    data                = double('data')

    allow(serializer).to receive(:new).with(user.id) { serializer_instance }
    allow(serializer_instance).to receive(:data) { data }
    expect(client).to receive(:batch).with([data])

    SyncSalesContact.new(user.id, serializer, client).call
  end

  it 'only syncs if contact is a teacher' do
    student = create(:user, role: 'student')
    client  = double('client')

    expect(client).to_not receive(:batch)

    SyncSalesContact.new(student.id, nil, client).call
  end
end
