# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SegmentIntegration::User do
  context 'admin' do
    let(:admin) { create(:admin) }
    let(:admin_info) { create(:admin_info, admin: admin, verification_url: 'quill.org', verification_reason: 'I am an admin.') }
    let(:user_email_verification ) { create(:user_email_verification, user: admin, verified_at: Time.zone.today, verification_method: UserEmailVerification::EMAIL_VERIFICATION) }
    let(:schools) { create_list(:school, 3) }
    let!(:schools_user) { create(:schools_users, school: schools.first, user: admin)}
    let(:districts) { create_list(:district, 3) }

    before do
      schools.each { |s| SchoolsAdmins.create(user: admin, school: s) }
      districts.each { |d| DistrictAdmin.create(user: admin, district: d) }
    end

    it 'returns the expected params hash' do
      params = {
        user_id: admin.id,
        traits: {
          **admin.segment_user.common_params,
          auditor: admin.auditor?,
          first_name: admin.first_name,
          last_name: admin.last_name,
          email: admin.email,
          flags: admin.flags&.join(", "),
          flagset: admin.flagset,
        }.reject {|_,v| v.nil? },
        integrations: admin.segment_user.integration_rules
      }
      expect(admin.segment_user.identify_params).to eq params
    end

    describe '#common_params' do

      it 'returns the expected params hash' do
        params = {
          district: admin.school&.district&.name,
          school_id: admin.school&.id,
          school_name: admin.school&.name,
          premium_state: admin.premium_state,
          premium_type: admin.subscription&.account_type,
          is_admin: admin.admin?,
          role: admin.role,
          admin_sub_role: admin.admin_sub_role,
          email_verification_status: admin.email_verification_status,
          admin_approval_status: admin.admin_approval_status,
          admin_reason: admin.admin_verification_reason,
          admin_linkedin_or_url: admin.admin_verification_url,
          number_of_schools_administered: schools.count,
          number_of_districts_administered: districts.count
        }.reject {|_,v| v.nil? }
        expect(admin.segment_user.common_params).to eq params
      end
    end

    describe '#school_params' do
      it 'returns the expected params hash' do
        total_teachers_at_school = 2
        total_students_at_school = 40
        total_activities_completed_by_students_at_school = 400
        active_teachers_at_school_this_year = 1
        active_students_at_school_this_year = 20
        total_activities_completed_by_students_at_school_this_year = 200

        cache = CacheSegmentSchoolData.new(admin.school)
        cache.write(total_teachers_at_school, CacheSegmentSchoolData::TOTAL_TEACHERS_AT_SCHOOL)
        cache.write(total_students_at_school, CacheSegmentSchoolData::TOTAL_STUDENTS_AT_SCHOOL)
        cache.write(total_activities_completed_by_students_at_school, CacheSegmentSchoolData::TOTAL_ACTIVITIES_COMPLETED_BY_STUDENTS_AT_SCHOOL)
        cache.write(active_teachers_at_school_this_year, CacheSegmentSchoolData::ACTIVE_TEACHERS_AT_SCHOOL_THIS_YEAR)
        cache.write(active_students_at_school_this_year, CacheSegmentSchoolData::ACTIVE_STUDENTS_AT_SCHOOL_THIS_YEAR)
        cache.write(total_activities_completed_by_students_at_school_this_year, CacheSegmentSchoolData::TOTAL_ACTIVITIES_COMPLETED_BY_STUDENTS_AT_SCHOOL_THIS_YEAR)

        params = {
          total_teachers_at_school: total_teachers_at_school,
          total_students_at_school: total_students_at_school,
          total_activities_completed_by_students_at_school: total_activities_completed_by_students_at_school,
          active_teachers_at_school_this_year: active_teachers_at_school_this_year,
          active_students_at_school_this_year: active_students_at_school_this_year,
          total_activities_completed_by_students_at_school_this_year: total_activities_completed_by_students_at_school_this_year
        }

        expect(admin.segment_user.school_params).to eq params
      end
    end

  end

  context 'teacher' do
    let(:teacher) { create(:teacher, flags: ["private", "beta"]) }
    let(:subject1) { create(:subject_area, name: "subject 1")}
    let(:subject2) { create(:subject_area, name: "subject 2")}
    let(:subject3) { create(:subject_area, name: "subject 3")}
    let(:teacher_info) { create(:teacher_info, user: teacher) }

    before {
      create(:user_subscription, user: teacher)
      create(:teacher_info_subject_area, teacher_info: teacher_info, subject_area: subject1)
      create(:teacher_info_subject_area, teacher_info: teacher_info, subject_area: subject2)
      create(:teacher_info_subject_area, teacher_info: teacher_info, subject_area: subject3)
    }

    describe '#identify_params' do

      it 'returns the expected params hash' do
        params = {
          user_id: teacher.id,
          traits: {
            **teacher.segment_user.common_params,
            auditor: teacher.auditor?,
            first_name: teacher.first_name,
            last_name: teacher.last_name,
            email: teacher.email,
            flags: teacher.flags&.join(", "),
            flagset: teacher.flagset,
            minimum_grade_level: teacher_info.minimum_grade_level,
            maximum_grade_level: teacher_info.maximum_grade_level,
            subject_areas: teacher_info.subject_areas.map(&:name).join(", ")
          }.reject {|_,v| v.nil? },
          integrations: teacher.segment_user.integration_rules
        }
        expect(teacher.segment_user.identify_params).to eq params
      end
    end

    describe '#common_params' do

      it 'returns the expected params hash' do
        params = {
          district: teacher.school&.district&.name,
          school_id: teacher.school&.id,
          school_name: teacher.school&.name,
          premium_state: teacher.premium_state,
          premium_type: teacher.subscription&.account_type,
          is_admin: teacher.admin?,
          minimum_grade_level: teacher_info.minimum_grade_level,
          maximum_grade_level: teacher_info.maximum_grade_level,
          subject_areas: teacher_info.subject_areas.map(&:name).join(", "),
          role: teacher.role
        }.reject {|_,v| v.nil? }
        expect(teacher.segment_user.common_params).to eq params
      end
    end

    describe '#premium_params' do

      it 'returns the expected params hash' do
        params = {
          email: teacher.email,
          premium_state: teacher.premium_state,
          premium_type: teacher.subscription&.account_type
        }.reject {|_,v| v.nil? }
        expect(teacher.segment_user.premium_params).to eq params
      end
    end

    describe '#school_params' do
      it 'returns an empty hash' do
        expect(teacher.segment_user.school_params.keys.length).to eq 0
      end
    end

    describe '#integration_rules' do

      it 'returns the expected params hash for no user' do
        expect(teacher.segment_user.integration_rules).to eq({ all: true, Intercom: true })
      end
    end

  end



end
