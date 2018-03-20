require 'rails_helper'

describe 'SalesContactCreator' do
  it 'creates a sales contact for a teacher' do
    user = create(:user, role: 'teacher')

    SalesContactCreator.new(user.id).create

    expect(user.reload.sales_contact).to be_a SalesContact
  end

  it 'does not create a sales contact if user is not teacher' do
    student = create(:user, role: 'student')

    expect { SalesContactCreator.new(student.id).create }
      .not_to change(SalesContact, :count)
  end

  it 'does not create a duplicate sales contact for a teacher' do
    user = create(:user, role: 'teacher')

    SalesContactCreator.new(user.id).create
    SalesContactCreator.new(user.id).create

    expect(SalesContact.count).to eq(1)
  end

  it 'creates initialized sales stages for sales contact' do
    user = create(:user, role: 'teacher')

    SalesContactCreator.new(user.id).create

    expect(user.reload.sales_contact.stages.length).to eq(12)
  end

  it 'does not create duplicate sales stages for a sales contact' do
    user = create(:user, role: 'teacher')

    SalesContactCreator.new(user.id).create
    SalesContactCreator.new(user.id).create

    expect(user.reload.sales_contact.stages.length).to eq(12)
  end
end
