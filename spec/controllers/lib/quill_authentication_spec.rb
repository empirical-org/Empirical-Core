# require 'rails_helper'
# include QuillAuthentication
#
#
# describe QuillAuthentication, type: :concern do
#   # quill_auth = QuillAuthentication
#   # let (:test_class) { Struct.new(:bloop) { include QuillAuthentication } }
#   #  let (:quill_auth) { test_class.new() }
#   # let(:session) {{}}
#   # describe 'authentication methods' do
#   #   let(:classroom) { create(:classroom, :with_coteacher) }
#   #   let(:coteacher) { classroom.coteachers.first }
#   #   let(:owner) { classroom.owner }
#   #   let(:random_teacher) {create(:teacher)}
#   #
#   #   describe '#classroom_owner' do
#   #     it 'should return nil if current_user is owner of the classroom' do
#   #       session[:user_id] = owner.id
#   #       expect(classroom_owner!(classroom)).to eq(nil)
#       # end
#
#     #   it 'should redirect if current_user is not owner of the classroom' do
#     #     session[:user_id] = coteacher.id
#     #     expect(quill_auth).to receive(:auth_failed)
#     #     QuillAuthentication.classroom_owner!(classroom)
#     #   end
#     # end
#     #
#     # describe '#classroom_coteacher' do
#     #   it 'should return nil if current_user is coteacher of the classroom' do
#     #     session[:user_id] = coteacher.id
#     #     expect(classroom_coteacher!(classroom)).to eq(nil)
#     #   end
#     #
#     #   it 'should redirect if current_user is not coteacher of the classroom' do
#     #     session[:user_id] = owner.id
#     #     expect(quill_auth).to receive(:auth_failed)
#     #     QuillAuthentication.classroom_coteacher!(classroom)
#     #   end
#     # end
#     #
#     # describe '#classroom_teacher' do
#     #   it 'should return nil if current_user is coteacher of the classroom' do
#     #     session[:user_id] = coteacher.id
#     #     expect(classroom_teacher!(classroom)).to eq(nil)
#     #   end
#     #
#     #   it 'should return nil if current_user is owner of the classroom' do
#     #     session[:user_id] = owner.id
#     #     expect(classroom_teacher!(classroom)).to eq(nil)
#     #   end
#     #
#     #   it 'should redirect if current_user is not associated with the classroom via classrooms_teachers' do
#     #     session[:user_id] = random_teacher.id
#     #     expect(quill_auth).to receive(:auth_failed)
#     #     concern.classroom_teacher!(classroom)
#     #   end
#   #   end
#   # end
# end
