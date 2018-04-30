require 'rails_helper'

describe 'SalesAccountSyncer' do
  before { Timecop.freeze }
  after { Timecop.return }

  it 'sends the serialized account data to salesmachine via a client' do
    school              = create(:school)
    serializer_instance = double('serializer_instance')
    serializer          = double('serializer')
    client              = double('client')
    data                = double('data')

    allow(serializer).to receive(:new).with(school.id) { serializer_instance }
    allow(serializer_instance).to receive(:data) { data }
    expect(client).to receive(:batch).with([data])

    SalesAccountSyncer.new(school.id, serializer, client).sync
  end
end
