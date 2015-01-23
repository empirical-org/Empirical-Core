require 'spec_helper'

describe AccountsController, type: :controller do

  describe 'POST create' do
    context 'with valid params' do
      context 'signing up as a student' do
        before do
          @valid_create_method = -> do
            post :create, user: { role: 'student', name: 'Foo Student',
              password: 'password', password_confirmation: 'password' }
          end

          it 'should create a new student' do
            expect { @valid_create_method.call }.to change(User.student, :count).by(1)
          end

          it 'should redirect to profile_path' do
            @valid_create_method.call
            expect(response).to redirect_to(profile_path)
          end
        end
      end

      context 'signing up as a parent' do
        before do
          @valid_create_method = -> do
            post :create, user: { role: 'teacher', username: 'teacherexample',
              first_name: 'Foo', last_name: 'Teacher', password: 'password',
              password_confirmation: 'password', email: 'teacher@example.com' }
          end
        end

        it 'should create a new teacher' do
          expect { @valid_create_method.call }.to change(Teacher, :count).by(1)
        end

        it 'should redirect to profile_path' do
          expect(response).to redirect_to(profile_path)
        end
      end
    end

    context 'with invalid params' do
      before do
        @invalid_create_method = -> do
          post :create, user: { role: 'teacher', password: 'password',
            password_confirmation: 'password' }
        end
      end

      it 'should not create a new user' do
        expect { @invalid_create_method.call }.to_not change(User, :count)
      end

      it 'should render template accounts/new' do
        @invalid_create_method.call
        expect(response).to render_template('accounts/new')
      end
    end
  end

end
