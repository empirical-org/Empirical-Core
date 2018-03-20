require 'rails_helper'

describe 'SyncSalesmachineContact' do
  it 'passes teacher data to the sales machine client' do
    teacher = create(:user, role: 'teacher')
    client = double('sale_machine_client')

    expect(client).to receive(:contact)

    SyncSalesmachineContact.new(teacher.id, client).sync
  end


  it 'presents teacher data' do
    teacher = create(:user,
      name: 'Pops McGee',
      role: 'teacher',
      email: 'teach@teaching.edu',
    )
    client = double('salesmachine_client')

    teacher_data = SyncSalesmachineContact.new(teacher.id, client).params

    expect(teacher_data).to include(
      email: 'teach@teaching.edu',
      name: 'Pops Mcgee',
      account_uid: nil,
      signed_up: teacher.created_at.to_i,
      admin: false,
      premium_status: 'NA',
      premium_expiry_date: 'NA',
      number_of_students: 0,
      number_of_completed_activities: 0,
      number_of_completed_activities_per_student: 0,
      frl: 0,
      teacher_link: "https://www.quill.org/cms/users/#{teacher.id}/sign_in",
    )
  end

  it 'presents sales stage data if sales contact is avaliable' do
    teacher = create(:user, role: 'teacher')
    client = double('salesmachine_client')
    SalesContactCreator.new(teacher.id).create

    teacher_data = SyncSalesmachineContact.new(teacher.id, client).params

    expect(teacher_data).to include(
      :"1_basic_subscription" => nil,
      :"2_teacher_premium" => nil,
      :"3_1_in_conversation_teacher_responds" => nil,
      :"3_2_in_conversation_call_missed" => nil,
      :"3_3_in_conversation_interested" => nil,
      :"4_quote_requested" => nil,
      :"5_1_purchase_order_received" => nil,
      :"5_2_invoice_sent" => nil,
      :"6_1_school_premium_needs_pd" => nil,
      :"6_2_school_premium_pd_scheduled" => nil,
      :"6_3_school_premium_pd_delivered" => nil,
      :"7_not_interested_in_school_premium" => nil,
    )
  end

  it 'presents account uid' do
    school = create(:school)
    teacher = create(:user, role: 'teacher')
    school.users << teacher
    client = double('salesmachine_client')

    teacher_data = SyncSalesmachineContact.new(teacher.id, client).params

    expect(teacher_data).to include(account_uid: school.id)
  end

  it 'presents admin status' do
    school = create(:school)
    teacher = create(:user, role: 'teacher')
    client = double('salesmachine_client')
    create(:schools_admins, school: school, user: teacher)

    teacher_data = SyncSalesmachineContact.new(teacher.id, client).params

    expect(teacher_data).to include(admin: true)
  end

  it 'presents premium status' do
    subscription = create(:subscription, account_type: 'SUPER DUPER SUB')
    teacher = create(:user, role: 'teacher')
    client = double('salesmachine_client')
    create(:user_subscription, subscription: subscription, user: teacher)

    teacher_data = SyncSalesmachineContact.new(teacher.id, client).params

    expect(teacher_data).to include(
      premium_status: 'SUPER DUPER SUB',
      premium_expiry_date: subscription.expiration,
    )
  end

  it 'presents student data' do
    teacher = create(:user, role: 'teacher')
    classroom = create(:classroom)
    student = create(:user, role: 'student')
    create(:classrooms_teacher, user: teacher, classroom: classroom)
    create(:students_classrooms, student: student, classroom: classroom)
    client = double('salesmachine_client')

    teacher_data = SyncSalesmachineContact.new(teacher.id, client).params

    expect(teacher_data).to include(
      number_of_students: 1,
      number_of_completed_activities: 0,
      number_of_completed_activities_per_student: 0,
    )
  end

  it 'presents activity data' do
    teacher = create(:user, role: 'teacher')
    classroom = create(:classroom)
    unit = create(:unit, user: teacher)
    classroom_activity = create(:classroom_activity, unit: unit)
    student = create(:user, role: 'student')
    create(:classrooms_teacher, user: teacher, classroom: classroom)
    create(:students_classrooms, student: student, classroom: classroom)
    create(:activity_session,
      classroom_activity: classroom_activity,
      state: 'finished',
    )
    create(:activity_session,
      classroom_activity: classroom_activity,
      state: 'started',
    )
    client = double('salesmachine_client')


    teacher_data = SyncSalesmachineContact.new(teacher.id, client).params

    expect(teacher_data).to include(
      number_of_students: 1,
      number_of_completed_activities: 1,
      number_of_completed_activities_per_student: 1,
    )
  end

  it 'presents school lunch data' do
    school = create(:school, free_lunches: 50)
    teacher = create(:user, role: 'teacher')
    school.users << teacher
    client = double('salesmachine_client')

    teacher_data = SyncSalesmachineContact.new(teacher.id, client).params

    expect(teacher_data).to include(frl: 50)
  end

  it 'presents teacher link' do
    teacher = create(:user, role: 'teacher')
    client = double('salesmachine_client')

    teacher_data = SyncSalesmachineContact.new(teacher.id, client).params

    expect(teacher_data).to include(
      teacher_link: "https://www.quill.org/cms/users/#{teacher.id}/sign_in"
    )
  end
end
