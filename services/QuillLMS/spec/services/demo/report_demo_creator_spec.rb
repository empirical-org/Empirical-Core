# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Demo::ReportDemoCreator do
  let!(:teacher) {create(:teacher)}
  let(:email) { Demo::ReportDemoCreator::EMAIL }

  describe 'creation' do
    before do
      Demo::ReportDemoCreator::ACTIVITY_PACKS_TEMPLATES.each do |ap|
        ap[:activity_ids].each {|id| create(:activity, id: id)}
      end
    end

    it 'creates a teacher with name' do
      Demo::ReportDemoCreator.create_teacher(email)
      teacher = User.find_by(name: "Demo Teacher")
      expect(teacher.name).to eq("Demo Teacher")
      expect(teacher.email).to eq(email)
      expect(teacher.role).to eq("teacher")
      expect(teacher.flags).to eq(["beta"])
    end

    it 'creates a classroom for the teacher' do
      Demo::ReportDemoCreator.create_classroom(teacher)
      classroom = Classroom.find_by(name: "Quill Classroom")
      expect(classroom.code).to eq("demo-#{teacher.id}")
      expect(classroom.grade).to eq('9')
      expect(teacher.classrooms_i_teach.include?(classroom)).to eq(true)
    end

    it 'creates units' do
      Demo::ReportDemoCreator.create_units(teacher)
      Demo::ReportDemoCreator::ACTIVITY_PACKS_TEMPLATES.each do |unit_obj|
        unit = Unit.find_by(name: unit_obj[:name])
        expect(unit).to be
        expect(UnitActivity.find_by(unit_id: unit.id, activity_id: unit_obj[:activity_ids][0])).to be
      end
    end

    it 'creates subscription' do
      Demo::ReportDemoCreator.create_subscription(teacher)
      expect(teacher.subscription.purchaser_id).to eq(teacher.id)
      expect(teacher.subscription.account_type).to eq('Teacher Trial')
    end

    it 'create classroom units' do
      student = create(:student)
      students = [student]
      units = Demo::ReportDemoCreator.create_units(teacher)
      classroom = create(:classroom)
      create(:students_classrooms, student: student, classroom: classroom)
      create(:classrooms_teacher, classroom: classroom, user: teacher)
      Demo::ReportDemoCreator.create_classroom_units(classroom, units)
      units.each do |unit|
        expect(ClassroomUnit.find_by(classroom_id: classroom.id, unit_id: unit.id, assign_on_join: true, assigned_student_ids: [student.id])).to be
      end
    end

    it 'creates replayed activity session' do
      student = create(:student)
      classroom = create(:classroom)
      create(:students_classrooms, student: student, classroom: classroom)
      user = build(:user, id: Demo::ReportDemoCreator::REPLAYED_SAMPLE_USER_ID)
      user.save
      sample_session = create(:activity_session, activity_id: Demo::ReportDemoCreator::REPLAYED_ACTIVITY_ID, user_id: Demo::ReportDemoCreator::REPLAYED_SAMPLE_USER_ID, is_final_score: true)
      units = Demo::ReportDemoCreator.create_units(teacher)
      classroom_unit = Demo::ReportDemoCreator.create_classroom_units(classroom, units).first
      expect {Demo::ReportDemoCreator.create_replayed_activity_session(student, classroom_unit)}.to change {ActivitySession.count}.by(1)
    end

    it 'creates activity sessions' do
      Sidekiq::Testing.inline! do
        Demo::ReportDemoCreator::ACTIVITY_PACKS_TEMPLATES.each do |ap|
          ap[:activity_sessions][0].each do |act_id, user_id|
            user = build(:user, id: user_id)
            user.save
            activity_session = create(:activity_session_without_concept_results, state: 'finished', activity_id: act_id, user_id: user_id, is_final_score: true)
            concept_result_question_type = ConceptResultQuestionType.find_or_create_by(text: 'sentence-combining')
            create(:concept_result, activity_session: activity_session, concept_result_question_type: concept_result_question_type)
          end
        end

        temp = ActivitySession.last
        student = create(:student)
        classroom = create(:classroom)
        create(:students_classrooms, student: student, classroom: classroom)
        units = Demo::ReportDemoCreator.create_units(teacher)

        Demo::ReportDemoCreator.create_classroom_units(classroom, units)
        total_act_sesh_count = Demo::ReportDemoCreator::ACTIVITY_PACKS_TEMPLATES.map {|ap| ap[:activity_sessions][0].keys.count}.sum
        expect {Demo::ReportDemoCreator.create_activity_sessions([student], classroom)}.to change {ActivitySession.count}.by(total_act_sesh_count)
        act_sesh = ActivitySession.last

        last_template = Demo::ReportDemoCreator::ACTIVITY_PACKS_TEMPLATES.last
        expect(act_sesh.activity_id).to eq(last_template[:activity_sessions][0].keys.last)
        expect(act_sesh.user_id).to eq(student.id)
        expect(act_sesh.state).to eq('finished')
        expect(act_sesh.percentage).to eq(temp.percentage)
        expect(act_sesh.concept_results.first.extra_metadata).to eq(temp.concept_results.first.extra_metadata)
        expect(act_sesh.concept_results.first.answer).to eq(temp.concept_results.first.answer)
      end
    end
  end

  describe "#reset_account_changes" do
    let(:teacher) {create(:teacher, email: email)}
    let!(:activity) { create(:activity) }
    let(:activity_session) { create(:activity_session, activity: activity) }
    let(:concept_result) {create(:concept_result, activity_session: activity_session)}
    let(:activity_pack_config) do
      {
        name: "Test Activity Pack",
        activity_ids: [activity.id],
        activity_sessions: [
          {activity.id => activity_session.id},
          {activity.id => activity_session.id},
          {activity.id => activity_session.id},
          {activity.id => activity_session.id},
          {activity.id => activity_session.id}
        ]
      }
    end
    let(:demo_config) { [activity_pack_config] }

    before do
      stub_const("Demo::ReportDemoCreator::ACTIVITY_PACKS_TEMPLATES", demo_config)
      stub_const("Demo::ReportDemoCreator::REPLAYED_ACTIVITY_ID", activity.id)
      stub_const("Demo::ReportDemoCreator::UNITS_COUNT", 1)
      stub_const("Demo::ReportDemoCreator::SESSIONS_COUNT", 1)
    end

    context 'with no demo data present' do
      subject {Demo::ReportDemoCreator.reset_account_changes(teacher)}

      it { expect { subject }.to change { teacher.classrooms_i_teach.count }.from(0).to(1) }
    end

    context 'with demo data, teacher has added classrooms' do
      let(:classroom) {create(:classroom)}
      let(:classrooms_teachers) {create(:classrooms_teacher, classroom: classroom, user: teacher)}

      before do
        Demo::ReportDemoCreator.create_demo_classroom_data(teacher, teacher_demo: true)
        classrooms_teachers
      end

      subject {Demo::ReportDemoCreator.reset_account_changes(teacher)}

      it { expect { subject }.to change { teacher.classrooms_i_teach.count }.from(2).to(1) }
    end

    context 'with demo data present and unedited' do
      before do
        Demo::ReportDemoCreator.create_demo_classroom_data(teacher, teacher_demo: true)
      end

      subject {Demo::ReportDemoCreator.reset_account_changes(teacher)}

      it { expect { subject }.not_to change { teacher.classrooms_i_teach.map(&:id) }}
    end

    context 'with demo data present but demo classroom has added student' do
      let(:student) {create(:student)}
      before do
        Demo::ReportDemoCreator.create_demo_classroom_data(teacher, teacher_demo: true)
        teacher.classrooms_i_teach.first.students += [student]
      end

      subject {Demo::ReportDemoCreator.reset_account_changes(teacher)}

      it { expect { subject }.to change { teacher.classrooms_i_teach.map(&:id) }}
      it { expect { subject }.not_to change { teacher.classrooms_i_teach.count }}
    end

    context 'with demo data present but demo classroom has added student' do
      let(:student) {create(:student)}
      before do
        Demo::ReportDemoCreator.create_demo_classroom_data(teacher, teacher_demo: true)
        teacher.classrooms_i_teach.first.students += [student]
      end

      subject {Demo::ReportDemoCreator.reset_account_changes(teacher)}

      it { expect { subject }.to change { teacher.classrooms_i_teach.map(&:id) }}
      it { expect { subject }.not_to change { teacher.classrooms_i_teach.count }}
    end
  end
end
