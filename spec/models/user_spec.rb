require 'rails_helper'

describe User, type: :model do
  let(:user) { FactoryGirl.build(:user) }
  let!(:user_with_original_email) { FactoryGirl.build(:user, email: 'fake@example.com') }


  describe '#newsletter?' do
    context 'user.send_newsletter = false' do
      let(:teacher) { FactoryGirl.create(:user, send_newsletter: false) }
      it 'returns false' do
        expect(teacher.newsletter?).to eq(false)
      end
    end

    context 'user.send_newsletter = true' do
      let(:teacher) { FactoryGirl.create(:user, send_newsletter: true) }
      it 'returns true' do
        expect(teacher.newsletter?).to eq(true)
      end
    end
  end


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
        ["student", "teacher", "temporary", "user", "admin", "staff"].each do |role|
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
      FactoryGirl.create(:user, username: username, password: username_password)
      FactoryGirl.create(:user,    email: email,    password:    email_password)
    end

    subject(:authentication_result) do
      user = User.find_by_username_or_email login_name
      user.authenticate(password)
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

  describe "#clear_data" do
    let(:user) { FactoryGirl.create(:user) }
    before(:each) { user.clear_data}

    it "changes the user's email to one that is not personally identiable" do
      expect(user.email).to eq("deleted_user_#{user.id}@example.com")
    end

    it "changes the user's username to one that is not personally identiable" do
      expect(user.username).to eq("deleted_user_#{user.id}")
    end

    it "changes the user's name to one that is not personally identiable" do
      expect(user.name).to eq("Deleted User_#{user.id}")
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

  describe "#generate_password" do
    let(:user) { FactoryGirl.build(:user, password: "currentpassword", last_name: "lastname") }

    it "sets password to value of last_name" do
      user.generate_password
      expect(user.password).to eq(user.last_name)
    end
  end

  describe "#generate_username" do
    let!(:classroom) { FactoryGirl.create(:classroom, code: 'cc') }
    let!(:user) { FactoryGirl.build(:user, first_name: "first", last_name: "last", classrooms: [classroom])}

    it "generates last name, first name, and class code" do
      expect(user.send(:generate_username, classroom.id)).to eq("first.last@cc")
    end

    it 'handles students with identical names and classrooms' do
      user1 = FactoryGirl.build(:user, first_name: "first", last_name: "last", classrooms: [classroom])
      user1.generate_student(classroom.id)
      user1.save
      user2 = FactoryGirl.build(:user, first_name: "first", last_name: "last", classrooms: [classroom])
      expect(user2.send(:generate_username, classroom.id)).to eq("first.last2@cc")
    end
  end

  describe "#email_required?" do
    let(:user) { FactoryGirl.build(:user) }

    it "returns true for teacher" do
      user.safe_role_assignment "teacher"
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
          user = FactoryGirl.build(:user,  password: "somepassword")
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
          user.safe_role_assignment "teacher"
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

      context "when there is an existing user" do
        it 'can update other parts of its record even if it is does not have a unique email' do
          user = User.new(email: user_with_original_email.email)
          expect(user.save(validate: false)).to be
        end
        it 'can not update it\'s email to an existing one' do
          user = User.create(email: 'whatever@example.com', name: 'whatever whatever')
          user.save(validate: false)
          expect(user.update(email: user_with_original_email.email)).to_not be(false)
        end
      end
    end

    describe "username attribute" do

      it "is invalid when not unique" do
         FactoryGirl.create(:user,  username: "testtest.lan")
         user = FactoryGirl.build(:user,  username: "testtest.lan")
         expect(user).to_not be_valid
      end

      it "uniqueness is enforced on extant users changing to an existing username" do
        user1 = FactoryGirl.create(:user)
        user2 = FactoryGirl.create(:user)
        expect(user2.update(username: user1.username)).to be(false)
      end
      it "uniqueness is not enforced on non-unique usernames changing other fields" do
        user1 = FactoryGirl.create(:user,  username: "testtest.lan")
        user2 = FactoryGirl.build(:user,  username: "testtest.lan")
        user2.save(validate: false)
        expect(user2.username).to eq(user1.username)
      end

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

  describe "#staff?" do
    let(:user)  { FactoryGirl.build(:user, role: "user") }
    let(:staff) { FactoryGirl.build(:staff)}

    it "must be true for staff role" do
      expect(staff).to be_staff
    end

    it "must be false for another roles" do
      expect(user).to_not be_staff
    end
  end

  describe "#generate_student" do
    let(:classroom) { FactoryGirl.create(:classroom, code: '101') }

    subject do
      student = classroom.students.build(first_name: 'John', last_name: 'Doe')
      student.generate_student(classroom.id)
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

    it 'returns true when send_newsletter is true' do
      user.send_newsletter = true
      expect(user.send(:newsletter?)).to eq(true)
    end

    it 'returns false when send_newsletter is false' do
      user.send_newsletter = false
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
    let(:user) { FactoryGirl.build(:user, role: role, send_newsletter: newsletter) }

    context 'role = teacher and send_newsletter = false' do
      let(:newsletter) { false }
      let(:role) { 'teacher' }

      it 'does call the newsletter worker' do
        expect(SubscribeToNewsletterWorker).to receive(:perform_async)
        user.subscribe_to_newsletter
      end
    end

    context 'role = teacher and send_newsletter = true' do
      let(:newsletter) { true }
      let(:role) { 'teacher' }

      it 'does call the newsletter worker' do
        expect(SubscribeToNewsletterWorker).to receive(:perform_async)
        user.subscribe_to_newsletter
      end
    end

    context 'role = student and send_newsletter = false' do
      let(:newsletter) { false }
      let(:role) { 'student' }

      it 'does not call the newsletter worker' do
        expect(SubscribeToNewsletterWorker).to_not receive(:perform_async)
        user.subscribe_to_newsletter
      end
    end

    context 'role = student and send_newsletter = true' do
      let(:newsletter) { true }
      let(:role) { 'student' }

      it 'does not call the newsletter worker' do
        expect(SubscribeToNewsletterWorker).to_not receive(:perform_async)
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

  describe 'student behavior' do
    let!(:classroom)          { FactoryGirl.create(:classroom) }
    let!(:unit)    { FactoryGirl.create(:unit)}
    let!(:classroom_activity) { FactoryGirl.create(:classroom_activity_with_activity, classroom: classroom, unit: unit) }
    let!(:activity)           { classroom_activity.activity }
    let!(:student) { FactoryGirl.create(:student, classrooms: [classroom]) }

    it 'assigns newly-created students to all activities previously assigned to their classroom' do
      expect(student.activity_sessions.size).to eq(1)
      expect(student.activity_sessions.first.activity).to eq(activity)
    end
  end

  describe 'flag' do
    let(:user) { FactoryGirl.build(:user) }

    it "can equal production" do
      user.update(flag:'production')
      expect(user).to be_valid
    end

    it "can equal beta" do
      user.update(flag:'beta')
      expect(user).to be_valid
    end

    it "can equal alpha" do
      user.update(flag:'alpha')
      expect(user).to be_valid
    end


    it "can equal nil" do
      user.update(flag: nil)
      expect(user).to be_valid
    end

    it "cannot equal anything other than alpha, beta, production or nil" do
      user.update(flag: 'sunglasses')
      expect(user).to_not be_valid
    end


  end

  it 'does not care about all the validation stuff when the user is temporary'
  it 'disallows regular assignment of roles that are restricted'
end
