# frozen_string_literal: true

shared_context 'profile' do
  let(:teacher1) { create(:user, role: 'teacher', name: 'Teacher 1') }
  let(:teacher2) { create(:user, role: 'teacher', name: 'Teacher 2') }
  let!(:classroom1) { create(:classroom, teacher: teacher1, name: 'class1') }
  let!(:classroom2) { create(:classroom, teacher: teacher2, name: 'class2') }
  let!(:classroom3) { create(:classroom, name: 'class3', code: 'coat-hanger') }
  let!(:student) { create(:student, classrooms: [classroom1, classroom2]) }

  let(:game1) { create(:activity_classification, id: 1) }
  let(:game2) { create(:activity_classification, id: 2) }

  let(:activity) { create(:activity, classification: game2) }
  let(:activity_1a) { create(:activity, classification: game1) }
  let(:activity_1aa) { create(:activity, classification: game2) }
  let!(:activity_1b) { create(:activity, classification: game2) }
  let(:unit1) { create(:unit) }
  let!(:classroom_activity) { create(:classroom_activity,
                                                  classroom: classroom2,
                                                  activity: activity,
                                                  unit: unit1) }

  let!(:classroom_activity_1a) { create(:classroom_activity,
                                                    classroom: classroom2,
                                                    activity: activity_1a,
                                                    unit: unit1)}


  let!(:classroom_activity_1aa) { create(:classroom_activity,
                                                    classroom: classroom2,
                                                    activity: activity_1aa,
                                                    unit: unit1)}

  let!(:classroom_activity_1b) { create(:classroom_activity,
                                                    classroom: classroom2,
                                                    activity: activity_1b,
                                                    unit: unit1)}

  let(:activity2) { create(:activity, classification: game2) }
  let(:activity_2a) { create(:activity, classification: game1) }
  let(:activity_2aa) { create(:activity, classification: game2) }
  let(:activity_2b) { create(:activity, classification: game2) }

  let!(:unit2) { create(:unit) }

  let!(:classroom_activity2) do
    create(
      :classroom_activity,
      classroom: classroom2,
      activity: activity2,
      unit: unit2,
      assigned_student_ids: [],
      due_date: 3.days.from_now
    )
  end

  let!(:classroom_activity_2a) do
    create(
      :classroom_activity,
      classroom: classroom2,
      activity: activity_2a,
      unit: unit2,
      assigned_student_ids: [],
      due_date: 100.days.from_now
    )
  end

  let!(:classroom_activity_2aa) do
    create(
      :classroom_activity,
      classroom: classroom2,
      activity: activity_2aa,
      unit: unit2,
      assigned_student_ids: [],
      due_date: 100.days.from_now
    )
  end

  let!(:classroom_activity_2b) do
    create(
      :classroom_activity,
      classroom: classroom2,
      activity: activity_2b,
      unit: unit2,
      assigned_student_ids: [],
      due_date: 1.day.from_now
    )
  end

  let(:activity3) { create(:activity, classification: game1) }

  let!(:unit3) { create(:unit) }

  let!(:classroom_activity3) do
    create(
      :classroom_activity,
      classroom: classroom1,
      activity: activity3,
      unit: unit3,
      due_date: 3.days.from_now
    )
  end

  let!(:as1) { classroom_activity.session_for(student) }
  let!(:as_1a) { classroom_activity_1a.session_for(student) }
  let!(:as_1aa) { classroom_activity_1aa.session_for(student) }
  let!(:as_1b) { classroom_activity_1b.session_for(student) }

  let!(:as2) { classroom_activity2.session_for(student) }
  let!(:as_2a) { classroom_activity_2a.session_for(student) }
  let!(:as_2aa) { classroom_activity_2aa.session_for(student) }
  let!(:as_2b) { classroom_activity_2b.session_for(student) }

  let!(:as3_unstarted) { classroom_activity3.session_for(student) }
  let!(:as3_started) { classroom_activity3.session_for(student) }
  let!(:as3_finished) { classroom_activity3.session_for(student) }

  before do
    as1.update(percentage: 0.8, state: 'finished')
    as_1a.update(percentage: 0.5, state: 'finished')
    as_1aa.update(percentage: 0.5, state: 'finished')
    as_1b.update(percentage: 1, state: 'finished')
  end

  before do
    as3_unstarted.update(state: 'unstarted')
    as3_started.update(percentage: 0.5, state: 'started')
    as3_finished.update(percentage: 0.5, state: 'finished')
  end
end
