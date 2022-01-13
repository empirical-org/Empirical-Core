# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::ClassroomCreator do
  let(:teacher_id) { create(:teacher).id }
  let(:clever_id) { '123_456'}
  let(:grade) { '1' }
  let(:name) { 'clever classroom' }

  let(:data) do
    {
      clever_id: clever_id,
      grade: grade,
      name: name,
      teacher_id: teacher_id
    }
  end

  subject { described_class.run(data) }

  it { expect(subject.clever_id).to eq clever_id }
  it { expect(subject.grade).to eq grade }
  it { expect(subject.name).to eq name }
  it { expect(subject.synced_name).to eq name }

  it { expect { subject }.to change(ClassroomsTeacher, :count).from(0).to(1) }

  context "teacher owns another classroom with name #{name}" do
    let(:classroom1) { create(:classroom, :from_clever, :with_no_teacher, name: name, grade: grade) }

    before { create(:classrooms_teacher, user_id: teacher_id, classroom: classroom1) }

    it { expect(subject.clever_id).to eq clever_id }
    it { expect(subject.grade).to eq grade }
    it { expect(subject.name).to eq "#{name}_1" }
    it { expect(subject.synced_name).to eq name }

    it { expect { subject }.to change(ClassroomsTeacher, :count).from(1).to(2) }

    context "teacher owns other classrooms with names #{name}_1, ... #{name}_max" do
      let(:max) { ::DuplicateNameResolver::MAX_BEFORE_RANDOMIZED }

      before do
        2.upto(max) do |n|
          classroom = create(:classroom, :from_clever, :with_no_teacher, name: "name_#{n}", grade: grade)
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

    it { expect(subject.clever_id).to eq clever_id }
    it { expect(subject.grade).to eq grade }
    it { expect(subject.name).to eq "Classroom #{clever_id}" }
    it { expect(subject.synced_name).to eq name }
  end
end
