require 'rails_helper'

describe 'GoogleClassroom' do

  def subject
    GoogleClassroom::GoogleClassroom.test
  end

  it 'works' do
    expect(subject).to eq(true)
  end
end