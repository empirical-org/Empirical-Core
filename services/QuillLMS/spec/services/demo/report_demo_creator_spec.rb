require 'rails_helper'

RSpec.describe Demo::ReportDemoCreator do
  let!(:teacher) {create(:teacher)}

  before do
    Demo::ReportDemoCreator::ACTIVITY_PACKS.each do |ap|
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
    Demo::ReportDemoCreator::ACTIVITY_PACKS.each do |unit_obj|
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
    units = Demo::ReportDemoCreator.create_units(teacher)
    classroom = create(:classroom)
    create(:classrooms_teacher, classroom: classroom, user: teacher)
    Demo::ReportDemoCreator.create_classroom_units(classroom, units)
    units.each do |unit|
      expect(ClassroomUnit.find_by(classroom_id: classroom.id, unit_id: unit.id, assign_on_join: true)).to be
    end
  end
end
