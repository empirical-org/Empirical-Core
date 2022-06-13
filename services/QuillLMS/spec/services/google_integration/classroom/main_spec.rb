# frozen_string_literal: true
# this file contains remnants of the sub_main_spec file, which was destroyed.
# saving in case it comes in handy in the future.

# require 'rails_helper'
#
# describe 'GoogleIntegration::Classroom::Main' do



  # def subject
  #   GoogleIntegration::Classroom::Main.pull_and_save_data(user, 'adsfasdf')
  # end
  #
  # let!(:google_classroom_id) { "455798942" }
  # let!(:google_classroom_id_2) { "2" }
  #
  # let!(:course_body) {
  #   x = {"courses":[{"id": google_classroom_id,"name":"class1","ownerId":"117520115627269298978","creationTime":"2016-02-01T21:19:54.662Z","updateTime":"2016-02-01T21:20:39.424Z","enrollmentCode":"w5o4h0v","courseState":"ACTIVE","alternateLink":"http://classroom.google.com/c/NDU1Nzk4OTQy"},
  #                   {"id": google_classroom_id_2,"name":"class2", "ownerId":"117520115627269298978" },
  #                   {"id": '43',"name":"different owner id", "ownerId":"123" }]}
  #   .to_json
  # }
  #
  # let!(:course_response) {
  #   Response = Struct.new(:body)
  #   Response.new(course_body)
  # }
  #
  # let!(:students_requester) {
  #   lambda do |course_id|
  #     x = {
  #           "students":
  #           [
  #             {"courseId": course_id,
  #              "userId":"107708392406225674265",
  #              "profile":
  #                 {"id":"107708392406225674265",
  #                  "name":
  #                   {"givenName":"test1_s1",
  #                    "familyName":"s1",
  #                    "fullName":"test1_s1 s1"},
  #                   "emailAddress": "#{course_id}.test1_s1@gedu.demo.rockerz.xyz"
  #                 }
  #             },
  #             {"courseId": course_id,
  #              "userId":"2",
  #              "profile":
  #                 {"id":"2",
  #                  "name":
  #                   {"givenName":"test1_s2",
  #                    "familyName":"s2",
  #                    "fullName":"test1_s2 s2"},
  #                   "emailAddress": "#{course_id}.test1_s2@gedu.demo.rockerz.xyz"
  #                 }
  #             }
  #           ]
  #     }
  #     body = x.to_json
  #     Response = Struct.new(:body)
  #     response = Response.new(body)
  #     return response
  #   end
  # }
  #
  # context 'student' do
  #   let!(:existing_google_classroom) {
  #     create(:classroom, google_classroom_id: google_classroom_id.to_i)
  #   }
  #
  #   let!(:user) { create(:user, role: 'student') }
  #
  #   it 'associates student to her first google classroom' do
  #     subject
  #     expect(user.classrooms.first).to eq(existing_google_classroom)
  #   end
  # end
  #
  # context 'teacher' do
  #   let!(:user) { create(:user, role: 'teacher', google_id: '117520115627269298978') }
  #   let!(:classrooms) { Classroom.where(google_classroom_id: [google_classroom_id.to_i, google_classroom_id_2.to_i]) }
  #
  #   it 'creates both classrooms' do
  #     subject
  #     expect(classrooms.length).to eq(2)
  #   end
  #
  #   it 'does not create classroom if it has a different owner id' do
  #     expect(Classroom.where(name: 'different owner id').empty?).to eq(true)
  #   end
  #
  #   it 'associates both classrooms to the teacher' do
  #     subject
  #     expect(classrooms.map(&:teacher_id)).to eq([user.id, user.id])
  #   end
  #
  #   it 'creates students for the classrooms' do
  #     pending("Syncing Google classrooms needs extra state management")
  #     subject
  #     x = Classroom.find_by(google_classroom_id: google_classroom_id).students.map do |student|
  #       { name: student.name, email: student.email }
  #     end
  #     expect(x).to match_array(
  #       [
  #         { name: 'Test1_s1 S1', email: "#{google_classroom_id}.test1_s1@gedu.demo.rockerz.xyz" },
  #         { name: 'Test1_s2 S2', email: "#{google_classroom_id}.test1_s2@gedu.demo.rockerz.xyz" }
  #       ]
  #     )
  #   end
  # end
# end
