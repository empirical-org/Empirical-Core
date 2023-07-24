# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CanvasIntegration::ClassroomCreator do
  let(:teacher_id) { create(:teacher).id }
  let(:classroom_external_id) { CanvasClassroom.build_classroom_external_id(canvas_instance_id, external_id) }
  let(:name) { 'canvas classroom' }
  let(:canvas_instance_id) { create(:canvas_instance).id }
  let(:external_id) { Faker::Number.number }

  let(:data) { { classroom_external_id: classroom_external_id, name: name, teacher_id: teacher_id } }

  subject { described_class.run(data) }

  it { expect(subject.classroom_external_id).to eq classroom_external_id }
  it { expect(subject.name).to eq name }
  it { expect(subject.synced_name).to eq name }

  it { expect { subject }.to change(ClassroomsTeacher, :count).from(0).to(1) }

  context 'canvas_instance does not exist' do
    let(:canvas_instance_id) { 0 }

    it { expect { subject }.to raise_error(described_class::CanvasInstanceNotFoundError) }
  end

  context "teacher owns another classroom with name #{name}" do
    let(:classroom1) { create(:classroom, :from_canvas, :with_no_teacher, name: name) }

    before { create(:classrooms_teacher, user_id: teacher_id, classroom: classroom1) }

    it { expect(subject.classroom_external_id).to eq classroom_external_id }
    it { expect(subject.name).to eq "#{name}_1" }
    it { expect(subject.synced_name).to eq name }

    it { expect { subject }.to change(ClassroomsTeacher, :count).from(1).to(2) }

    context "teacher owns other classrooms with names #{name}_1, ... #{name}_max" do
      let(:max) { ::DuplicateNameResolver::MAX_BEFORE_RANDOMIZED }

      before do
        2.upto(max) do |n|
          classroom = create(:classroom, :from_canvas, :with_no_teacher, name: "name_#{n}")
          create(:classrooms_teacher, user_id: teacher_id, classroom: classroom)
        end
      end

      it "stops naming duplicates at max and then starts using random values" do
        expect(subject.name).not_to eq "#{name}_11"
      end

      it { expect { subject }.to change(ClassroomsTeacher, :count).from(max).to(11) }
    end
  end

  context 'nil name' do
    let(:name) { nil }

    it { expect(subject.classroom_external_id).to eq classroom_external_id }
    it { expect(subject.name).to eq "Classroom #{classroom_external_id}" }
    it { expect(subject.synced_name).to eq name }
  end
end
