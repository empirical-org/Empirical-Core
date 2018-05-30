require 'rails_helper'

describe 'SalesStageTypesFactory' do
  it 'does not create duplicate stage types' do
    SalesStageTypesFactory.new.build
    SalesStageTypesFactory.new.build

    expect(SalesStageType.count).to eq(13)
  end

  it 'creates "Basic Subscription" type' do
    SalesStageTypesFactory.new.build

    type = SalesStageType.find_by(name: 'Basic Subscription')

    expect(type).to have_attributes(
      name: 'Basic Subscription',
      order: '1',
      trigger: 'auto'
    )
  end

  it 'creates "Teacher Premium" type' do
    SalesStageTypesFactory.new.build

    type = SalesStageType.find_by(name: 'Teacher Premium')

    expect(type).to have_attributes(
      name: 'Teacher Premium',
      order: '2',
      trigger: 'auto'
    )
  end

  it 'creates "Teacher Responds" type' do
    SalesStageTypesFactory.new.build

    type = SalesStageType.find_by(name: 'In Conversation: Teacher Responds')

    expect(type).to have_attributes(
      name: 'In Conversation: Teacher Responds',
      order: '3.1',
      trigger: 'auto'
    )
  end

  it 'creates "Call Missed" type' do
    SalesStageTypesFactory.new.build

    type = SalesStageType.find_by(name: 'In Conversation: Call Missed')

    expect(type).to have_attributes(
      name: 'In Conversation: Call Missed',
      order: '3.2',
      trigger: 'user'
    )
  end

  it 'creates "Interested" type' do
    SalesStageTypesFactory.new.build

    type = SalesStageType.find_by(name: 'In Conversation: Interested')

    expect(type).to have_attributes(
      name: 'In Conversation: Interested',
      order: '3.3',
      trigger: 'user'
    )
  end

  it 'creates "Quote Requested" type' do
    SalesStageTypesFactory.new.build

    type = SalesStageType.find_by(name: 'Quote Requested')

    expect(type).to have_attributes(
      name: 'Quote Requested',
      order: '4',
      trigger: 'user'
    )
  end

  it 'creates "Purchase Order Received" type' do
    SalesStageTypesFactory.new.build

    type = SalesStageType.find_by(name: 'Purchase Order Received')

    expect(type).to have_attributes(
      name: 'Purchase Order Received',
      order: '5.1',
      trigger: 'user'
    )
  end

  it 'creates "Invoice Sent" type' do
    SalesStageTypesFactory.new.build

    type = SalesStageType.find_by(name: 'Invoice Sent')

    expect(type).to have_attributes(
      name: 'Invoice Sent',
      order: '5.2',
      trigger: 'auto'
    )
  end

  it 'creates "Needs PD" type' do
    SalesStageTypesFactory.new.build

    type = SalesStageType.find_by(name: 'School Premium: Needs PD')

    expect(type).to have_attributes(
      name: 'School Premium: Needs PD',
      order: '6.1',
      trigger: 'auto'
    )
  end

  it 'creates "PD Scheduled" type' do
    SalesStageTypesFactory.new.build

    type = SalesStageType.find_by(name: 'School Premium: PD Scheduled')

    expect(type).to have_attributes(
      name: 'School Premium: PD Scheduled',
      order: '6.2',
      trigger: 'user'
    )
  end

  it 'creates "PD Delivered" type' do
    SalesStageTypesFactory.new.build

    type = SalesStageType.find_by(name: 'School Premium: PD Delivered')

    expect(type).to have_attributes(
      name: 'School Premium: PD Delivered',
      order: '6.3',
      trigger: 'user'
    )
  end

  it 'creates "Not Interested" type' do
    SalesStageTypesFactory.new.build

    type = SalesStageType.find_by(name: 'Not Interested In School Premium')

    expect(type).to have_attributes(
      name: 'Not Interested In School Premium',
      order: '7',
      trigger: 'user'
    )
  end
end
