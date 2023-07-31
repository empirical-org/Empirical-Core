# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ProviderClassroomsWithUnsyncedStudentsFinder do
  let(:teacher) { create(:teacher) }

  subject { described_class.run(teacher.id) }

  context 'teacher has no provider classrooms' do
    let(:classroom_i_own) { create(:classroom_with_a_couple_students, :with_no_teacher) }
    let(:classroom_i_coteach) { create(:classroom_with_a_couple_students) }

    before do
      create(:classrooms_teacher, user: teacher, classroom: classroom_i_own)
      create(:coteacher_classrooms_teacher, user: teacher, classroom: classroom_i_coteach)
    end

    it { expect(subject).to match_array [] }
  end

  context 'teacher has google classrooms' do
    let(:classroom_i_own) { create(:google_classroom_with_a_couple_google_students, :with_no_teacher) }
    let(:another_classroom_i_own) { create(:google_classroom_with_a_couple_google_students, :with_no_teacher) }
    let(:classroom_i_coteach) { create(:google_classroom_with_a_couple_google_students) }

    let(:unsynced_student1) { classroom_i_own.students.second }
    let(:unsynced_student2) { classroom_i_coteach.students.second }
    let(:synced_student1) { classroom_i_own.students.first }
    let(:synced_student2) { another_classroom_i_own.students.first }

    before do
      create(:classrooms_teacher, user: teacher, classroom: classroom_i_own)
      create(:classrooms_teacher, user: teacher, classroom: another_classroom_i_own)
      create(:coteacher_classrooms_teacher, user: teacher, classroom: classroom_i_coteach)

      create(
        :google_classroom_user,
        classroom_external_id: classroom_i_own.classroom_external_id,
        user_external_id: synced_student1.user_external_id
      )

      create(
        :google_classroom_user,
        :deleted,
        classroom_external_id: classroom_i_own.classroom_external_id,
        user_external_id: unsynced_student1.user_external_id
      )

      create(
        :google_classroom_user,
        classroom_external_id: another_classroom_i_own.classroom_external_id,
        user_external_id: synced_student2.user_external_id
      )

      create(
        :google_classroom_user,
        :deleted,
        classroom_external_id: classroom_i_coteach.classroom_external_id,
        user_external_id: unsynced_student2.user_external_id
      )
    end

    it 'returns only owned provider classrooms that have unsynced students' do
      expect(subject).to eq [classroom_i_own]
    end
  end

  context 'teacher has clever classrooms' do
    let(:classroom_i_own) { create(:clever_classroom_with_a_couple_clever_students, :with_no_teacher) }
    let(:another_classroom_i_own) { create(:clever_classroom_with_a_couple_clever_students, :with_no_teacher) }
    let(:classroom_i_coteach) { create(:clever_classroom_with_a_couple_clever_students) }

    let(:unsynced_student1) { classroom_i_own.students.first }
    let(:unsynced_student2) { classroom_i_coteach.students.first }
    let(:synced_student1) { classroom_i_own.students.second }
    let(:synced_student2) { another_classroom_i_own.students.second }

    before do
      create(:classrooms_teacher, user: teacher, classroom: classroom_i_own)
      create(:classrooms_teacher, user: teacher, classroom: another_classroom_i_own)
      create(:coteacher_classrooms_teacher, user: teacher, classroom: classroom_i_coteach)

      create(
        :clever_classroom_user,
        classroom_external_id: classroom_i_own.classroom_external_id,
        user_external_id: synced_student1.user_external_id
      )

      create(
        :clever_classroom_user,
        :deleted,
        classroom_external_id: classroom_i_own.classroom_external_id,
        user_external_id: unsynced_student1.user_external_id
      )

      create(
        :clever_classroom_user,
        classroom_external_id: another_classroom_i_own.classroom_external_id,
        user_external_id: synced_student2.user_external_id
      )

      create(
        :clever_classroom_user,
        :deleted,
        classroom_external_id: classroom_i_coteach.classroom_external_id,
        user_external_id: unsynced_student2.user_external_id
      )
    end

    it 'returns only owned provider classrooms that have unsynced students' do
      expect(subject).to eq [classroom_i_own]
    end
  end

  context 'teacher has canvas classrooms' do
    let(:canvas_instance) { create(:canvas_instance) }
    let(:teacher) { create(:teacher, :with_canvas_account, canvas_instance: canvas_instance) }
    let(:classroom_i_own) do
      create(
        :classroom,
        :from_canvas,
        :with_no_teacher,
        canvas_instance: canvas_instance,
        students: [unsynced_student1, synced_student1]
      )
    end

    let(:another_classroom_i_own) do
      create(
        :classroom,
        :from_canvas,
        :with_no_teacher,
        canvas_instance: canvas_instance,
        students: [synced_student2]
      )
    end

    let(:classroom_i_coteach) do
      create(
       :classroom,
       :from_canvas,
       canvas_instance: canvas_instance,
       students: [unsynced_student2, another_student]
      )
    end

    let(:unsynced_student1) { create(:student, :with_canvas_account, canvas_instance: canvas_instance) }
    let(:unsynced_student2) { create(:student, :with_canvas_account, canvas_instance: canvas_instance) }
    let(:synced_student1) { create(:student, :with_canvas_account, canvas_instance: canvas_instance) }
    let(:synced_student2) { create(:student, :with_canvas_account, canvas_instance: canvas_instance) }
    let(:another_student) { create(:student, :with_canvas_account, canvas_instance: canvas_instance) }

    before do
      create(:classrooms_teacher, user: teacher, classroom: classroom_i_own)
      create(:classrooms_teacher, user: teacher, classroom: another_classroom_i_own)
      create(:coteacher_classrooms_teacher, user: teacher, classroom: classroom_i_coteach)

      create(
        :canvas_classroom_user,
        :deleted,
        classroom_external_id: classroom_i_own.classroom_external_id,
        user_external_id: unsynced_student1.user_external_id(canvas_instance: canvas_instance)
      )

      create(
        :canvas_classroom_user,
        classroom_external_id: classroom_i_own.classroom_external_id,
        user_external_id: synced_student1.user_external_id(canvas_instance: canvas_instance)
      )

      create(
        :canvas_classroom_user,
        classroom_external_id: another_classroom_i_own.classroom_external_id,
        user_external_id: unsynced_student2.user_external_id(canvas_instance: canvas_instance)
      )

      create(
        :canvas_classroom_user,
        :deleted,
        classroom_external_id: classroom_i_coteach.classroom_external_id,
        user_external_id: synced_student2.user_external_id(canvas_instance: canvas_instance)
      )
    end

    it 'returns only owned provider classrooms that have unsynced students' do
      expect(subject).to eq [classroom_i_own]
    end
  end
end
