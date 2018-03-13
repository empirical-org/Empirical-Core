require 'rails_helper'

describe 'UpdateSalesmachineAccountStage' do
  before { Timecop.freeze }
  after { Timecop.return }

  it 'passes updates to the salesmachine client' do
    school = create(:school)
    client = double('salesmachine_client')

    expect(client).to receive(:account)

    UpdateSalesmachineAccountStage.new(school.id, 'in_conversation', client)
      .update
  end

  it 'updates the sales account record with current timestamp' do
    school = create(:school)
    client = double('salesmachine_client')
    allow(client).to receive(:account)

    UpdateSalesmachineAccountStage.new(school.id, 'in_conversation', client)
      .update

    expect(school.reload.sales_account.data).to include(
      'in_conversation' => DateTime.now.to_i,
    )
  end

  it 'initializes unspecified stages with default value nil' do
    school = create(:school)
    client = double('salesmachine_client')
    allow(client).to receive(:account)

    UpdateSalesmachineAccountStage.new(school.id, 'in_conversation', client)
      .update

    expect(school.reload.sales_account.data).to include(
      'in_conversation' => DateTime.now.to_i,
      'invoice_sent' => nil,
      'professional_development_completed' => nil,
      'professional_development_scheduled' => nil,
      'purchase_order_received' => nil,
      'quill_basic_subscription' => nil,
      'quill_premium_subscription' => nil,
      'quill_teacher_subscription' => nil,
      'quote_accepted' => nil,
    )
  end

  it 'does not overwrite existing stage timestamp values' do
    school = create(:school)
    client = double('salesmachine_client')
    allow(client).to receive(:account)

    UpdateSalesmachineAccountStage.new(school.id, 'in_conversation', client)
      .update

    UpdateSalesmachineAccountStage.new(school.id, 'quote_accepted', client)
      .update

    expect(school.reload.sales_account.data).to include(
      'in_conversation' => DateTime.now.to_i,
      'quote_accepted' => DateTime.now.to_i,
    )
  end

  it 'only allows you to update valid stages' do
    school = create(:school)
    client = double('salesmachine_client')
    allow(client).to receive(:account)

    result = UpdateSalesmachineAccountStage.new(school.id, 'what_what', client)
      .update

    expect(result).to be false
  end
end
