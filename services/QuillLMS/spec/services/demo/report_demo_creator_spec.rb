# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Demo::ReportDemoCreator do

  context 'ACTIVITY_PACKS_TEMPLATES config' do
    let(:expected_keys) {[:activity_sessions, :name]}

    subject { described_class::ACTIVITY_PACKS_TEMPLATES }

    it { expect(subject.class).to be Array }
    it { expect(subject.all? {|template| template.keys.sort == expected_keys}).to be true }
    it { expect(subject.all? {|template| template[:activity_sessions].instance_of?(Array)}).to be true }
    it { expect(subject.all? {|template| template[:activity_sessions].map(&:keys).flatten.all? {|k| k.instance_of?(Integer)}}).to be true }
    it { expect(subject.all? {|template| template[:activity_sessions].map(&:values).flatten.all? {|v| v.instance_of?(Integer)}}).to be true }
  end

  context 'full data set' do
    before do
      described_class::ACTIVITY_PACKS_TEMPLATES
        .map {|template| described_class.activity_ids_for_config(template) }
        .flatten
        .uniq
        .each {|activity_id|  create(:activity, id: activity_id) }

      Demo::SessionData.new
        .concept_results
        .map(&:concept_id)
        .uniq
        .each {|concept_id| create(:concept, id: concept_id)}
    end

    describe 'create_demo' do
      let(:demo_teacher) { User.find_by(email: "hello+demoteacher@quill.org") }

      it 'should create teacher and classroom with activity' do
        expect(SaveActivitySessionConceptResultsWorker).to receive(:perform_async).exactly(2165).times

        described_class.create_demo

        expect(demo_teacher.classrooms_i_teach.count).to eq(1)
        classroom = demo_teacher.classrooms_i_teach.first

        expect(classroom.students.count).to eq(5)
        expect(classroom.activity_sessions.count).to eq(140)
      end
    end
  end

  context 'demo data set' do
    let!(:teacher) {create(:teacher)}
    let(:session_data) { Demo::SessionData.new }
    # essentially using these as fixtures to test the demo data
    let(:activity_id) { 1663 }
    let(:user_id) { 9706466 }
    let!(:activity) { create(:activity, id: activity_id) }

    let(:concept_ids) { [566, 506, 508, 641, 640, 671, 239, 551, 488, 385, 524, 540, 664, 83, 673, 450] }
    let!(:concepts) { concept_ids.map {|id|  create(:concept, id: id)} }

    let(:demo_config) do
      [
        {
          name: "Quill Activity Pack",
          activity_sessions: [
            {activity_id => user_id},
            {activity_id => user_id},
            {activity_id => user_id},
            {activity_id => user_id},
            {activity_id => user_id}
          ]
        }
      ]
    end

    before do
      stub_const("Demo::ReportDemoCreator::ACTIVITY_PACKS_TEMPLATES", demo_config)
      stub_const("Demo::ReportDemoCreator::REPLAYED_ACTIVITY_ID", activity_id)
      stub_const("Demo::ReportDemoCreator::REPLAYED_SAMPLE_USER_ID", user_id)
    end

    it 'creates a teacher with name' do
      email = "hello+demoteacher@quill.org"
      Demo::ReportDemoCreator.create_teacher(email)
      teacher = User.find_by(name: "Demo Teacher")
      expect(teacher.name).to eq("Demo Teacher")
      expect(teacher.email).to eq(email)
      expect(teacher.role).to eq("teacher")
      expect(teacher.flags).to eq(["beta"])
    end

    it 'creates a classroom for the teacher' do
      Demo::ReportDemoCreator.create_classroom(teacher)
      classroom = teacher.classrooms_i_teach.find {|c| c.name == "Quill Classroom"}

      expect(classroom.code).to eq("demo-#{teacher.id}")
      expect(classroom.grade).to eq('9')
      expect(teacher.classrooms_i_teach.include?(classroom)).to eq(true)
    end

    it 'creates units' do
      Demo::ReportDemoCreator.create_units(teacher)
      Demo::ReportDemoCreator::ACTIVITY_PACKS_TEMPLATES.each do |unit_obj|
        unit = Unit.find_by(name: unit_obj[:name])
        activity_ids = Demo::ReportDemoCreator.activity_ids_for_config(unit_obj)
        expect(unit).to be
        expect(UnitActivity.find_by(unit_id: unit.id, activity_id: activity_ids[0])).to be
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
      units = Demo::ReportDemoCreator.create_units(teacher)
      classroom_unit = Demo::ReportDemoCreator.create_classroom_units(classroom, units).first
      expect {Demo::ReportDemoCreator.create_replayed_activity_session(student, classroom_unit, session_data)}.to change {ActivitySession.count}.by(1)
    end

    it 'creates activity sessions' do
      Sidekiq::Testing.inline! do
        session_clone = session_data.activity_sessions
          .find {|session| session.activity_id == activity_id && session.user_id == user_id}

        student = create(:student)
        classroom = create(:classroom)
        create(:students_classrooms, student: student, classroom: classroom)
        units = Demo::ReportDemoCreator.create_units(teacher)

        Demo::ReportDemoCreator.create_classroom_units(classroom, units)
        total_act_sesh_count = Demo::ReportDemoCreator::ACTIVITY_PACKS_TEMPLATES.map {|ap| ap[:activity_sessions][0].keys.count}.sum
        expect {Demo::ReportDemoCreator.create_activity_sessions([student], classroom, session_data)}.to change {ActivitySession.count}.by(total_act_sesh_count)
        act_sesh = ActivitySession.last

        last_template = Demo::ReportDemoCreator::ACTIVITY_PACKS_TEMPLATES.last
        expect(act_sesh.activity_id).to eq(last_template[:activity_sessions][0].keys.last)
        expect(act_sesh.user_id).to eq(student.id)
        expect(act_sesh.state).to eq('finished')
        expect(act_sesh.percentage).to eq(session_clone.percentage)
        expect(act_sesh.concept_results.first.extra_metadata).to be nil
        # Taken from actual concept_result
        expect(act_sesh.concept_results.first.answer).to eq("Pho is a soup made with herbs, bone broth and noodles.")
      end
    end
  end
end
