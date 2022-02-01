# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GoogleIntegration::ClassroomStudentsData do
  let(:classroom) { create(:classroom, :from_google) }
  let(:google_classroom_id) { classroom.google_classroom_id }

  let(:classroom_students_client) { double('classroom_students_client') }

  subject { described_class.new(classroom, classroom_students_client) }

  let(:student_data1) { student_data("107674265", "tim", "student", "tim student", "tim_student@gmail.com") }
  let(:student_data2) { student_data("410622567", "ann", "student", "ann student", "ann_student@gmail.com") }
  let(:classroom_students_data) { [classroom_student_data(student_data1), classroom_student_data(student_data2)] }
  let(:google_ids) { [student_data1[:google_id], student_data2[:google_id]] }

  let(:raw_students_data) { [raw_student_data(student_data1), raw_student_data(student_data2)] }

  before { allow(classroom_students_client).to receive(:call).with(google_classroom_id).and_return(raw_students_data) }

  it 'constructs an enumerable object whose elements are hashes containing classroom student data' do
    expect(subject.to_a).to match_array classroom_students_data
    expect(subject.google_ids).to match_array google_ids
    expect(subject.google_classroom_id).to eq google_classroom_id
  end

  def classroom_student_data(student_data)
    student_data.merge(classroom: classroom)
  end

  def raw_student_data(student_data)
    {
      "profile" => {
        "id" => student_data[:google_id],
        "name" => {
          "givenName" => student_data[:first_name],
          "familyName" => student_data[:last_name],
          "fullName" => student_data[:name]
        },
        "emailAddress" => student_data[:email]
      }
    }
  end

  def student_data(google_id, first_name, last_name, name, email)
    { google_id: google_id, first_name: first_name, last_name: last_name, name: name, email: email }
  end
end
