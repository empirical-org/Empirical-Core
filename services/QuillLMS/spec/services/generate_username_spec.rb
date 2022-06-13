# frozen_string_literal: true

require 'rails_helper'

describe GenerateUsername do
  subject { described_class.run('John', 'Smith', 'student') }

  it 'generates a downcased username made up of the first name, last name, and class code of the student' do
    expect(subject).to eq 'john.smith@student'
  end

  it 'doesnt increment count if a different class code' do
    create(:student, { username: 'john.smith@teacher' })

    expect(subject).to eq 'john.smith@student'
  end

  it 'inserts a number after the last name if there is already a student in the database with that username' do
    create(:student, { username: 'john.smith@student' })

    expect(subject).to eq 'john.smith1@student'
  end

  it 'doesnt insert a number if not an exact match at start of username' do
    create(:student, { username: 'ajohn.smith@student' })

    expect(subject).to eq 'john.smith@student'
  end

  it 'will find the next available number and assign the number' do
    create(:student, username: 'john.smith@student' )
    create(:student, username: 'john.smith1@student' )
    create(:student, username: 'john.smith2@student' )
    create(:student, username: 'john.smith3@student' )
    create(:student, username: 'john.smith567@student' )

    expect(subject).to eq 'john.smith4@student'
  end
end
