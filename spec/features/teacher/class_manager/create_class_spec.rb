require 'rails_helper'

feature 'Create-a-Class page' do
  before(:each) { vcr_ignores_localhost }

  context 'when signed in as a Teacher' do
    let(:mr_kotter)             { FactoryGirl.create :mr_kotter }
    let(:create_classroom_page) { visit_create_classroom_page }

    before(:each) { sign_in_user mr_kotter }

    context 'with no existing classes' do
      it 'creates a class' do
        class_code = create_classroom_page.class_code

        expect { create_sweathogs }.to change { Classroom.count }.by(1)

        new_class = Classroom.last
        expect(new_class.code).to eq class_code

        invite_students_page = Teachers::InviteStudentsPage.new(new_class)
        expect(current_path)                   .to eq invite_students_page.path
        expect(invite_students_page.class_code).to eq class_code
      end

      it "creates a class with the same name as another Teacher's" do
        mr_woodman = FactoryGirl.create :mr_woodman
        sweathogs  = FactoryGirl.create :sweathogs, teacher: mr_woodman

        expect { create_sweathogs }.to change { Classroom.count }.by(1)

        new_class = Classroom.last

        invite_students_page = Teachers::InviteStudentsPage.new(new_class)
        expect(current_path)                       .to eq invite_students_page.path
        expect(invite_students_page.class_code).not_to eq sweathogs.code
      end

      def create_sweathogs
        create_classroom_page.create_class name: 'sweathogs', grade: 11
      end

      describe 'clicking the new-code item' do
        it 'generates a new class-code', js: true do
          expect { create_classroom_page.generate_new_class_code }
            .to change { create_classroom_page.class_code }
        end
      end

      it "offers only 'Create new'" do
        expect(create_classroom_page).to     have_create_class
        expect(create_classroom_page).not_to have_manage_classes
        expect(create_classroom_page).not_to have_invite_students
      end

      shared_examples_for :navigates_to_create_class do
        it 'navigates to create-a-class' do
          expect(current_path).to eq create_classroom_page.path
        end
      end

      [Teachers::CreateClassPage.activity_planner_tab_pair,
       Teachers::CreateClassPage.       scorebook_tab_pair
      ].each do |pair|
        tabname, sym = pair
        select_tab   = :"select_#{sym}"

        describe "selecting the #{tabname}" do
          before(:each) { create_classroom_page.send(select_tab) }

          include_examples :navigates_to_create_class
        end
      end

      describe 'selecting the Class Manager' do
        before(:each) { create_classroom_page.select_class_manager }
        include_examples :navigates_to_create_class
      end
    end

    context 'with an existing class' do
      let!(:sweathogs) { FactoryGirl.create(:sweathogs, teacher: mr_kotter) }

      it 'offers several Class Manager navigation options' do
        expect(create_classroom_page).to have_create_class
        expect(create_classroom_page).to have_manage_classes
        expect(create_classroom_page).to have_invite_students
      end

      it 'cannot create a new class with the same name' do
        same_class_name = sweathogs.name

        expect {
          create_classroom_page.create_class name: same_class_name, grade: 11
        }.not_to change { Classroom.count }

        expect(create_classroom_page).to have_content(
          "Your Class Name has already been taken"
        )
      end
    end
  end

  context 'when not signed in' do
    before(:each) { visit_create_classroom_page }

    include_examples :requires_sign_in
  end

  context 'when signed in as a Student' do
    include_context :when_signed_in_as_a_student
    before(:each) { visit_create_classroom_page }

    include_examples :requires_sign_in
  end

  def visit_create_classroom_page
    Teachers::CreateClassPage.visit
  end
end
