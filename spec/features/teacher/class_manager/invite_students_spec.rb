require 'rails_helper'

feature 'Invite-Students page' do
  before(:each) { vcr_ignores_localhost }

  let(:mr_kotter) { FactoryGirl.create :mr_kotter }
  let(:teacher)   { mr_kotter }

  context 'for a class' do
    let(:sweathogs) { FactoryGirl.create :sweathogs, teacher: mr_kotter }
    let(:classroom) { sweathogs }

    let(:invite_students_page) { Teachers::InviteStudentsPage.new(classroom) }

    shared_context :signed_in_as_teacher do
      before(:each) do
        sign_in_user teacher
        visit_invite_students_page
      end
    end

    context 'with no Students' do
      context 'when signed in as the Teacher' do
        include_context :signed_in_as_teacher

        it 'includes the class code' do
          expect(invite_students_page.class_code).to eq sweathogs.code
        end

        it 'shows no students' do
          expect(invite_students_page).to have_content 'are no students'
          expect(invite_students_page.student_count).to eq 0
        end

        def add_student(student)
          invite_students_page.add_student student
        end

        let(:vinnie) { FactoryGirl.build :vinnie_barbarino }

        it 'adds a new student' do
          expect {
            add_student vinnie
          }.to change { invite_students_page.student_count }.by(1)

          username = generate_username(vinnie, invite_students_page.class_code)

          new_student_row = invite_students_page.student_row(User.last)

          expect(new_student_row.first_name).to eq vinnie.first_name
          expect(new_student_row. last_name).to eq vinnie. last_name
          expect(new_student_row.  username).to eq username
        end

        context 'having added a student' do
          def add_vinnie
            add_student vinnie
          end

          before(:each) { add_vinnie }

          describe 'adding the same student again' do
            it 'does not raise an error' do
              expect { add_vinnie }.not_to raise_error
            end
          end
        end
      end
    end

    context 'with existing students' do
      include_context :ms_sorter_and_sort_fodder

      let(:teacher)   { ms_sorter }
      let(:classroom) { sort_fodder }

      context 'when signed in as the Teacher' do
        include_context :signed_in_as_teacher

        it 'shows the students, sorted by last name' do
          expected_rows = sort_fodder_sorted.map do |student|
            [student.first_name,
             student.last_name,
             student.username]
          end

          expect(invite_students_page.student_table_rows).to eq expected_rows
        end

        it 'can add a duplicate-looking student' do
          dup_student = christopher_brown

          expect {
            invite_students_page.add_student dup_student
          }.to change { invite_students_page.student_count }.by(1)

          student_row = invite_students_page.student_row(User.last)
          username    = generate_username(dup_student,
                                          invite_students_page.class_code)

          expect(student_row.first_name).to eq dup_student.first_name
          expect(student_row. last_name).to eq dup_student. last_name
          expect(student_row.  username).to eq username
        end
      end
    end

    context 'when not signed in' do
      before(:each) { visit_invite_students_page }

      include_examples :requires_sign_in
    end

    context 'when signed in as a Student' do
      include_context :when_signed_in_as_a_student
      before(:each) { visit_invite_students_page }

      include_examples :requires_sign_in
    end

    def visit_invite_students_page
      invite_students_page.visit
    end

    def generate_username(student, class_code)
      "#{student.first_name}.#{student.last_name}@#{class_code}".downcase
    end
  end

  context 'for a non-existent class' do
    let(:bogus_classroom) do
      FactoryGirl.build :classroom, id: Classroom.count
    end

    let(:invite_students_page) do
      Teachers::InviteStudentsPage.new bogus_classroom
    end

    context 'as a signed-in Teacher' do
      before(:each) { sign_in_user mr_kotter }

      it 'raises an error' do
        pending 'handle lookup error'
        expect { invite_students_page.visit }.not_to raise_error
      end
    end
  end

  context 'for one of several classes' do
    # N.B.: they are *not* in alpha order
    class_names = %w(c a d b)

    class_names.each do |name|
      let!(:"class_#{name}") do
        FactoryGirl.create :classroom, name: name,
                                    teacher: mr_kotter
      end
    end

    let(:some_class) { Classroom.first } # really don't care which

    let(:invite_students_page) { Teachers::InviteStudentsPage.new(some_class) }

    context 'when signed in as the Teacher' do
      before(:each) do
        sign_in_user mr_kotter
        invite_students_page.visit
      end

      it "lists the Teacher's classes" do
        # create another Teacher with another class
        mr_woodman        = FactoryGirl.create :mr_woodman
        mr_woodmans_class = FactoryGirl.create :classroom,
                                               name: 'real students',
                                            teacher: mr_woodman

        pending 'Issue #580 - menu should list classes in alphabetic order'
        class_names_list = invite_students_page.class_names
        expect(class_names_list).to eq mr_kotter.classrooms
                                                .order(:name)
                                                .map(&:name)

        expect(class_names_list).not_to include mr_woodmans_class.name
      end

      class_names.each do |name|
        describe 'selecting a class' do
          before(:each) { invite_students_page.select_class name }

          it "navigates to that class's invite-student page" do
            classroom = send :"class_#{name}"
            path      = Teachers::InviteStudentsPage.new(classroom).path
            expect(current_path).to eq path
          end
        end
      end
    end
  end
end
