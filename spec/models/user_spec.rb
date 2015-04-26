require 'rails_helper'
require 'io/console'

describe User, :type => :model do
  let(:user) { FactoryGirl.build(:user) }

  describe "default scope" do
    let(:user1) { FactoryGirl.create(:user) }
    let(:user2) { FactoryGirl.create(:user) }
    let(:user2) { FactoryGirl.create(:user, role: "temporary") }

    it "must list all users but the ones with temporary role" do
      User.all.each do |u|
        expect(u.role).to_not eq "temporary"
      end
    end
  end

  describe "User scope" do
    describe "::ROLES" do
      it "must contain all roles" do
        ["student", "teacher", "temporary", "user", "admin"].each do |role|
          expect(User::ROLES).to include role
        end
      end
    end

    describe "::SAFE_ROLES" do
      it "must contain safe roles" do
        ["student", "teacher", "temporary"].each do |role|
          expect(User::SAFE_ROLES).to include role
        end
      end
    end
  end

  #TODO: email is taken as username and email
  describe ".authenticate" do
    let(:username)          { 'Test' }
    let(:username_password) { '123456' }

    let(:email)          { 'Test@example.com' }
    let(:email_password) { '654321' }

    before do
      FactoryGirl.create(:user, username: username, password: username_password, password_confirmation: username_password)
      FactoryGirl.create(:user,    email: email,    password:    email_password, password_confirmation:    email_password)
    end

    subject(:authentication_result) do
      User.authenticate(email: login_name,
                     password: password)
    end

    %i(email username).each do |cred_base|
      context "with #{cred_base}" do
        let(:password_val) { send(:"#{cred_base}_password") }

        %i(original swapped).each do |name_case|
          case_mod = if name_case == :swapped
                       :swapcase # e.g., "a B c" => "A b C"
                     else
                       :to_s
                     end

          context "#{name_case} case" do
            # e.g., send(:username).send(:to_s),
            #       send(:email   ).send(:swapcase),
            #       etc.
            let(:login_name) { send(cred_base).send(case_mod) }

            context 'with incorrect password' do
              let(:password) { "wrong #{password_val} wrong" }

              it 'fails' do
                expect(authentication_result).to be_falsy
              end
            end

            context 'with correct password' do
              let(:password) { password_val }

              it 'succeeds' do
                expect(authentication_result).to be_truthy
              end
            end
          end
        end
      end
    end
  end

  describe "#password?" do
    it "returns false if password is not present" do
      user = FactoryGirl.build(:user,  password: nil)
      expect(user.send(:password?)).to be false
    end

    it "returns true if password is present" do
      user = FactoryGirl.build(:user,  password: "something")
      expect(user.send(:password?)).to be true
    end
  end

  describe "#role=" do
    it "return role name" do
      user = FactoryGirl.build(:user)
      expect(user.role="newrole").to eq "newrole"
    end
  end

  describe "#role" do
    let(:user) { FactoryGirl.build(:user) }

    it "returns role as instance of ActiveSupport::StringInquirer" do
      user.role='newrole'
      expect(user.role).to be_a ActiveSupport::StringInquirer
    end

    it "returns true for correct role" do
      user.role='newrole'
      expect(user.role.newrole?).to be true
    end

    it "returns false for incorrect role" do
      user.role='newrole'
      expect(user.role.invalidrole?).to be false
    end
  end

  describe "#safe_role_assignment" do
    let(:user) { FactoryGirl.build(:user) }

    it "must assign 'user' role by default" do
      expect(user.safe_role_assignment "nil").to eq("user")
    end

    it "must assign 'teacher' role even with spaces" do
      expect(user.safe_role_assignment " teacher ").to eq("teacher")
    end

    it "must assign 'teacher' role when it's chosen" do
      expect(user.safe_role_assignment "teacher").to eq("teacher")
    end

    it "must assign 'student' role when it's chosen" do
      expect(user.safe_role_assignment "student").to eq("student")
    end

    it "must change the role to 'student' inside the instance" do
      user.safe_role_assignment "student"
      expect(user.role).to be_student
    end
  end

  describe "#permanent?" do
    let(:user) { FactoryGirl.build(:user) }

    it "must be true for user" do
      user.safe_role_assignment "user"
      expect(user).to be_permanent
    end

    it "must be true for teacher" do
      user.safe_role_assignment "teacher"
      expect(user).to be_permanent
    end

    it "must be true for student" do
      user.safe_role_assignment "student"
      expect(user).to be_permanent
    end

    it "must be false for temporary" do
      user.safe_role_assignment "temporary"
      expect(user).to_not be_permanent
    end
  end

  describe "#requires_password?" do
    let(:user) { FactoryGirl.build(:user) }

    it "returns true for all roles but temporary" do
      user.safe_role_assignment "user"
      expect(user.send(:requires_password?)).to eq(true)
    end

    it "returns false for temporary role" do
      user.safe_role_assignment "temporary"
      expect(user.send(:requires_password?)).to eq(false)
    end
  end

  describe "#requires_password_confirmation?" do
    it "required confirmation if require_password? is true and password present" do
      user = FactoryGirl.build(:user,  password: "presentpassword")
      user.safe_role_assignment "user"
      expect(user.send(:requires_password_confirmation?)).to eq(true)
    end

    it "confirmation not required when password is not present" do
      user = FactoryGirl.build(:user,  password: nil)
      expect(user.send(:requires_password_confirmation?)).to eq(false)
    end

    it "confirmation not required when require_password? is false and password present" do
      user = FactoryGirl.build(:user,  password: "presentpassword")
      user.safe_role_assignment "temporary"
      expect(user.send(:requires_password_confirmation?)).to eq(false)
    end
  end

  describe "#generate_password" do
    let(:user) { FactoryGirl.build(:user, password: "currentpassword", last_name: "lastname") }

    it "sets password confirmation to value of last_name" do
      user.generate_password
      expect(user.password_confirmation).to eq(user.last_name)
    end

    it "sets password to value of last_name" do
      user.generate_password
      expect(user.password_confirmation).to eq(user.last_name)
    end
  end

  describe "#generate_username" do
    let!(:user) { FactoryGirl.build(:user, first_name: "first", last_name: "last", classcode: "cc")}

    it "generates last name, first name, and class code" do
      expect(user.send(:generate_username)).to eq("first.last@cc")
    end

    it 'handles students with identical names and classrooms' do
      user1 = FactoryGirl.build(:user, first_name: "first", last_name: "last", classcode: "cc")
      user1.generate_student
      user1.save
      user2 = FactoryGirl.build(:user, first_name: "first", last_name: "last", classcode: "cc")
      expect(user2.send(:generate_username)).to eq("first.last2@cc")
    end
  end

  describe "#email_required?" do
    let(:user) { FactoryGirl.build(:user) }

    it "returns true for all roles but temporary" do
      user.safe_role_assignment "user"
      expect(user.send(:email_required?)).to eq(true)
    end

    it "returns false for temporary role" do
      user.safe_role_assignment "temporary"
      expect(user.send(:email_required?)).to eq(false)
    end
  end

  describe "#refresh_token!" do
    let(:user) { FactoryGirl.build(:user) }

    it "must change the token value" do
      expect(user.token).to be_nil
      expect(user.refresh_token!).to eq(true)
      expect(user.token).to_not be_nil
    end
  end

  context "when it runs validations" do
    let(:user) { FactoryGirl.build(:user) }

    it "is valid with valid attributes" do
      expect(user).to be_valid
    end

    describe "password attibute" do
      context "when role requires password" do
        it "is invalid without password" do
          user = FactoryGirl.build(:user,  password: nil)
          user.safe_role_assignment "student"
          expect(user).to_not be_valid
        end

        it "is valid with password" do
          user = FactoryGirl.build(:user,  password: "somepassword", password_confirmation: "somepassword" )
          user.safe_role_assignment "student"
          expect(user).to be_valid
        end
      end

      context "when role does not require password" do
        it "is valid without password" do
          user = FactoryGirl.build(:user,  password: nil)
          user.safe_role_assignment "temporary"
          expect(user).to be_valid
        end
      end
    end

    describe "email attribute" do
      it "is invalid when email is not unique" do
         FactoryGirl.create(:user,  email: "test@test.lan")
         user = FactoryGirl.build(:user,  email: "test@test.lan")
         expect(user).to_not be_valid
      end

      it "is valid when email is not unique" do
         user = FactoryGirl.build(:user,  email: "unique@test.lan")
         expect(user).to be_valid
      end

      context "when role requires email" do
        it "is invalid without email" do
          user.safe_role_assignment "student"
          user.email = nil
          expect(user).to_not be_valid
        end

        it "is valid with email" do
          user.safe_role_assignment "student"
          user.email = "email@test.lan"
          expect(user).to be_valid
        end
      end

      context "when role does not require email" do
        it "is valid without email" do
          user.safe_role_assignment "temporary"
          user.email = nil
          expect(user).to be_valid
        end
      end
    end

    describe "username attribute" do
      context "role is permanent" do
        it "is invalid without username and email" do
          user.safe_role_assignment "student"
          user.email = nil
          user.username = nil
          expect(user).to_not be_valid
        end

        it "is valid with username" do
          user.safe_role_assignment "student"
          user.email = nil
          user.username = "testusername"
          expect(user).to be_valid
        end
      end

      context "not permanent role" do
        it "is valid without username and email" do
          user.safe_role_assignment "temporary"
          user.email = nil
          expect(user).to be_valid
        end
      end
    end

    describe "terms_of_service attribute" do
      it "is valid if accepted" do
        #maps true to "1"
        user = FactoryGirl.build(:user,  terms_of_service: "1")
        expect(user).to be_valid
      end

      it "is invalid if not accepted" do
        #maps false to "0"
        user = FactoryGirl.build(:user,  terms_of_service: "0")
        expect(user).to_not be_valid
      end
    end
  end

  describe "#name" do
    context "with valid inputs" do
      it "has a first_name only" do
        user.last_name = nil
        expect(user.name).to eq('Test')
      end

      it "has a last name only" do
        user.first_name = nil
        expect(user.name).to eq('User')
      end

      it "has a full name" do
        expect(user.name).to eq('Test User')
      end
    end
  end

  describe "#student?" do
    let(:user) { FactoryGirl.build(:user) }

    it "must be true for 'student' roles" do
      user.safe_role_assignment "student"
      expect(user).to be_student
    end

    it "must be false for other roles" do
      user.safe_role_assignment "other"
      expect(user).to_not be_student
    end
  end

  describe "#teacher?" do
    let(:user) { FactoryGirl.build(:user) }

    it "must be true for 'teacher' roles" do
      user.safe_role_assignment "teacher"
      expect(user).to be_teacher
    end

    it "must be false for other roles" do
      user.safe_role_assignment "other"
      expect(user).to_not be_teacher
    end
  end

  describe "#admin?" do
    let(:user)  { FactoryGirl.build(:user, role: "user") }
    let(:admin) { FactoryGirl.build(:admin)}

    it "must be true for admin role" do
      expect(admin).to be_admin
    end

    it "must be false for another roles" do
      expect(user).to_not be_admin
    end
  end

  describe "#generate_student" do
    let(:classroom) { Classroom.new(code: '101') }

    subject do
      student = classroom.students.build(first_name: 'John', last_name: 'Doe')
      student.generate_student
      student
    end

    describe '#username' do
      subject { super().username }
      it { is_expected.to eq('John.Doe@101') }
    end

    describe '#role' do
      subject { super().role }
      it { is_expected.to eq('student') }
    end

    it 'should authenticate with last name' do
      expect(subject.authenticate('Doe')).to be_truthy
    end
  end

  describe "#newsletter?" do
    let(:user) { FactoryGirl.build(:user) }

    it 'returns true when newsletter set to 1' do
      user.newsletter="1"
      expect(user.send(:newsletter?)).to eq(true)
    end

    it 'returns true when newsletter set to anything other than 1' do
      user.newsletter="anything"
      expect(user.send(:newsletter?)).to eq(false)
    end
  end

  describe '#sorting_name' do
    subject(:sort_name) { user.sorting_name }

    context 'given distinct first and last names' do
      let(:first_name) { 'John' }
      let(:last_name)  { 'Doe' }
      let(:user) do
        FactoryGirl.build(:user, first_name: first_name,
                                  last_name: last_name)
      end

      it 'returns "last, first"' do
        expect(sort_name).to eq "#{last_name}, #{first_name}"
      end
    end

    context 'given distinct only a single :name' do
      let(:name) { 'SingleName' }
      let(:user) { User.new(name: name) }

      before(:each) { user.name = name }

      it 'returns "name, name"' do
        expect(sort_name).to eq "#{name}, #{name}"
      end
    end
  end

  describe "#subscribe_to_newsletter" do
    let(:user) { FactoryGirl.build(:user, newsletter: newsletter) }

    context 'when #newsletter = 0' do
      let(:newsletter) { 0 }

      it 'does not call MailchimpConnection.subscribe_to_newsletter' do
        expect(MailchimpConnection).not_to receive(:subscribe_to_newsletter)

        user.subscribe_to_newsletter
      end
    end

    context 'when #newsletter = 1' do
      let(:newsletter) { 1 }

      it 'calls MailchimpConnection.subscribe_to_newsletter' do
        expect(MailchimpConnection).to receive(:subscribe_to_newsletter)
                                       .with(user.email)

        user.subscribe_to_newsletter
      end
    end
  end

  describe "#send_welcome_email" do
    let(:user) { FactoryGirl.build(:user) }

    it "sends welcome given email" do
      user.email="present@exmaple.lan"
      expect { user.send(:send_welcome_email) }.to change { ActionMailer::Base.deliveries.count }.by(1)
    end

    it "does not send welcome without email" do
      user.email=nil
      expect { user.send(:send_welcome_email) }.to_not change { ActionMailer::Base.deliveries.count }
    end
  end

  describe "can behave as either a student or teacher" do
    context "when behaves like student" do
      it_behaves_like "student"
    end

    context "when behaves like teacher" do
      it_behaves_like "teacher"
    end
  end

  describe 'clever', :vcr do
    describe 'student' do
      let(:user) { FactoryGirl.build(:user, role: 'student', clever_id: '535ea6e816b90a4529c18feb') }

      it 'finds its clever user for a' do
        u = user.send(:clever_user)

        expect(u.id).to eq('535ea6e816b90a4529c18feb')
      end
    end

    describe 'teacher' do
      let(:user) { FactoryGirl.build(:user, role: 'teacher', clever_id: '535ea6e416b90a4529c18fd3') }

      it 'finds its clever user for a' do
        u = user.send(:clever_user)

        expect(u.id).to eq('535ea6e416b90a4529c18fd3')
      end
    end

    describe 'setup from clever' do
      it 'passes an auth hash for a user to be setup' do
        pending("This spec's VCR cassette returns a 404, so this test always fails")
        @user = User.setup_from_clever({
          info: {
            email: 'foo@bar.wee',
            id: '123',
            user_type: 'student',
            name: {first: 'Joshy', last: 'Washy'}
          },
          credentials: {
            token: '123'
          }
        })

        expect(@user.valid?).to be_truthy
        expect(@user.id).to_not be_nil
        expect(@user.email).to eq('foo@bar.wee')
      end
    end
  end

  describe 'student behavior' do
    let!(:classroom)          { FactoryGirl.create(:classroom) }
    let!(:classroom_activity) { FactoryGirl.create(:classroom_activity_with_activity, classroom: classroom) }
    let!(:activity)           { classroom_activity.activity }

    let!(:unit)    { FactoryGirl.create(:unit, classroom_activities: [classroom_activity])}
    let!(:student) { FactoryGirl.create(:student, classroom: classroom) }

    it 'assigns newly-created students to all activities previously assigned to their classroom' do
      expect(student.activity_sessions.size).to eq(1)
      expect(student.activity_sessions.first.activity).to eq(activity)
    end

    describe '#complete_and_incomplete_activity_sessions_by_classification' do
      context 'when a unit is specified' do
        it 'excludes interrupted retries' do
          retry1 = FactoryGirl.create :activity_session_incompleted, user: student, is_retry: true, classroom_activity: classroom_activity, activity: activity
          x = student.complete_and_incomplete_activity_sessions_by_classification(unit)
          expect(x.length).to eq(1)
        end
      end

      context 'when a unit is not specified' do
        it 'excludes interrupted retries' do
          retry1 = FactoryGirl.create :activity_session_incompleted, user: student, is_retry: true, classroom_activity: classroom_activity, activity: activity
          x = student.complete_and_incomplete_activity_sessions_by_classification
          expect(x.length).to eq(1)
        end
      end
    end
  end

  describe 'getting users for the progress reports' do

    let!(:teacher) { FactoryGirl.create(:teacher) }
    let(:section_ids) { [sections[0].id, sections[1].id] }

    describe 'for the concepts-based progress reports' do
      include_context 'Concept Progress Report'

      subject { User.for_concept_tag_progress_report(teacher, filters).to_a }

      context 'no filters' do
        let(:filters) { {} }

        it 'can retrieve users based on no filters' do
          expect(subject.size).to eq(1)
        end
      end

      context 'classrooms' do
        let(:filters) { {classroom_id: classroom.id} }

        it 'can retrieve users based on classroom_id' do
          expect(subject.size).to eq(1)
        end
      end

      context 'units' do
        let(:filters) { {unit_id: unit.id} }

        it 'can retrieve users based on unit_id' do
          expect(subject.size).to eq(1)
        end
      end
    end

    describe 'for the standards report' do
      include_context 'Topic Progress Report'
      subject { User.for_standards_report(teacher, filters).to_a }

      let(:filters) { {} }

      it 'retrieves the right aggregated data' do
        user = subject[0]
        expect(user.name).to be_present
        expect(user.total_standard_count).to be_present
        expect(user.proficient_standard_count).to be_present
        expect(user.near_proficient_standard_count).to be_present
        expect(user.not_proficient_standard_count).to be_present
        expect(user.total_activity_count).to be_present
        expect(user.average_score).to be_present
      end
    end
  end

  it 'does not care about all the validation stuff when the user is temporary'
  it 'disallows regular assignment of roles that are restricted'


  describe 'teacher concern' do
    describe '#scorebook_scores' do
      let!(:teacher) {FactoryGirl.create(:user, role: 'teacher')}
      let!(:student) {FactoryGirl.create(:user, role: 'student')}
      let!(:classroom) {FactoryGirl.create(:classroom, teacher: teacher, students: [student])}

      let!(:section) {FactoryGirl.create(:section)}
      let!(:topic_category) {FactoryGirl.create(:topic_category)}
      let!(:topic) {FactoryGirl.create(:topic, topic_category: topic_category, section: section)}
      let!(:activity_classification) {FactoryGirl.create :activity_classification}

      let!(:activity) {FactoryGirl.create(:activity, topic: topic, classification: activity_classification)}

      let!(:unit) {FactoryGirl.create(:unit)}

      let!(:classroom_activity) {FactoryGirl.create(:classroom_activity, activity: activity, classroom: classroom, unit: unit )}

      let!(:activity_session1) {FactoryGirl.create(:activity_session, completed_at: Time.now, state: 'finished', percentage: 1.0, user: student, classroom_activity: classroom_activity, activity: activity)}
      let!(:activity_session2) {FactoryGirl.create(:activity_session, completed_at: Time.now, state: 'finished', percentage: 0.2, user: student, classroom_activity: classroom_activity, activity: activity)}


      it 'does not return a completed activities that is not a final scores' do
        all, is_last_page = teacher.scorebook_scores
        x = all.find{|x| x[:user] == student}
        y = x[:results].find{|y| y[:id] == activity_session2.id}
        expect(y).to be_nil
      end

      it 'does return a completed activity that is a final score' do
        all, is_last_page = teacher.scorebook_scores
        x = all.find{|x| x[:user] == student}
        y = x[:results].find{|y| y[:id] == activity_session1.id}
        expect(y).to be_present
      end


    end
  end

end
