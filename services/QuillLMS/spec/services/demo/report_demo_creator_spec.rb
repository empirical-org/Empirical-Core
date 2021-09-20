require 'rails_helper'

RSpec.describe Demo::ReportDemoCreator do
  let!(:teacher) {create(:teacher)}

  before do
    Demo::ReportDemoCreator::ACTIVITY_PACKS_TEMPLATES.each do |ap|
      ap[:activity_ids].each {|id| create(:activity, id: id)}
    end
  end


  it 'creates a teacher with name' do
    name = 'demoteacher'
    Demo::ReportDemoCreator.create_teacher(name)
    teacher = User.find_by(name: "Demo Teacher")
    expect(teacher.name).to eq("Demo Teacher")
    expect(teacher.email).to eq("hello+#{name}@quill.org")
    expect(teacher.role).to eq("teacher")
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
    classroom_unit = create(:classroom_unit, assign_on_join: true, classroom: classroom)
    user = build(:user, id: Demo::ReportDemoCreator::REPLAYED_SAMPLE_USER_ID)
    user.save
    sample_session = create(:activity_session, activity_id: Demo::ReportDemoCreator::REPLAYED_ACTIVITY_ID, user_id: Demo::ReportDemoCreator::REPLAYED_SAMPLE_USER_ID, is_final_score: true)
    expect {Demo::ReportDemoCreator.create_replayed_activity_session(student, classroom_unit)}.to change {ActivitySession.count}.by(1)
  end

  it 'creates activity sessions' do
    Demo::ReportDemoCreator::ACTIVITY_PACKS_TEMPLATES.each do |ap|
      ap[:activity_sessions][0].each do |act_id, user_id|
        user = build(:user, id: user_id)
        user.save
        create(:activity_session, state: 'finished', activity_id: act_id, user_id: user_id, is_final_score: true)
      end
    end

    temp = ActivitySession.last
    student = create(:student)
    classroom = create(:classroom)
    create(:students_classrooms, student: student, classroom: classroom)
    units = Demo::ReportDemoCreator.create_units(teacher)

    Demo::ReportDemoCreator.create_classroom_units(classroom, units)
    expect {Demo::ReportDemoCreator.create_activity_sessions([student], classroom)}.to change {ActivitySession.count}.by(23)
    act_sesh = ActivitySession.last
    expect(act_sesh.activity_id).to eq(765)
    expect(act_sesh.user_id).to eq(student.id)
    expect(act_sesh.state).to eq('finished')
    expect(act_sesh.percentage).to eq(temp.percentage)
  end
end
