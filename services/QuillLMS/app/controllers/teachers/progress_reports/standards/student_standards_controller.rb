# frozen_string_literal: true

class Teachers::ProgressReports::Standards::StudentStandardsController < Teachers::ProgressReportsController
  def index
    respond_to do |format|
      format.html
      format.json do
        cache_groups = {
          standard_id: params["standard_id"],
          student_id: params["student_id"]
        }
        response = current_user.all_classrooms_cache(key: 'teachers.progress_reports.standards.student_standards.index', groups: cache_groups) do
          standards = ::ProgressReports::Standards::NewStandard.new(current_user).results(params)
          standards_json = standards.map do |standard|
            serializer = ::ProgressReports::Standards::StandardSerializer.new(standard)
            # Doing this because can't figure out how to get custom params into serializers
            serializer.classroom_id = params[:classroom_id]
            serializer.as_json(root: false).merge(is_evidence: standard_category_id == Constants::EVIDENCE_STANDARD_CATEGORY)
          end
          student = User.find(params[:student_id])
          student = nil unless current_user.teaches_student?(student.id)
          {
            standards: standards_json,
            student: student,
            units: ProgressReports::Standards::Unit.new(current_user).results({}),
            teacher: UserWithEmailSerializer.new(current_user).as_json(root: false)
          }
        end
        render json: response
      end
    end
  end
end
