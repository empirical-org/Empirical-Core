require 'spec_helper'

describe User do
  it 'Can auth by user or email' do
    User.create(username: 'test',          password: '123456', password_confirmation: '123456')
    User.create(email: 'test@example.com', password: '654321', password_confirmation: '654321')

    expect(User.authenticate(email: 'test',             password: '123456')).to be_true
    expect(User.authenticate(email: 'test@example.com', password: '654321')).to be_true
  end

  it 'requires email if a teacher'
  it 'requires email if no username present'
  it 'is ok with a username if not a teacher and presented with a username'
  it 'checks for a password confirmation only when a password is present on update'
  it 'only requires a password on create'
  it 'doesn\'t care about all the validation stuff when the user is temporary'
  it 'disallows regular assignment of roles that are restricted'
end
