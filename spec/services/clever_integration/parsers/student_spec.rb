require 'rails_helper'

describe 'CleverIntegration::Parsers::Student' do

  let!(:response) {
      Clever::Student.new({id: '1',
       email: 'student@gmail.com',
       name: Clever::Name.new({first: 'john', last: 'smith'}),
       credentials: Clever::Credentials.new({district_username: 'username'})})
  }

  let!(:expected) {
      {clever_id: '1',
       email: 'student@gmail.com',
       name: 'John Smith',
       username: 'username'}
  }

  def subject
    CleverIntegration::Parsers::Student.run(response)
  end

  it 'works' do
    expect(subject).to eq(expected)
  end
end
