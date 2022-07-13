# frozen_string_literal: true

class Teachers::ClassroomsController < ApplicationController
  include CleverAuthable

  respond_to :json, :html, :pdf
  before_action :teacher!
  # The excepted/only methods below are ones that should be accessible to coteachers.
  # TODO This authing could probably be refactored.
  before_action :authorize_owner!, only: [:update,  :transfer_ownership]
  before_action :authorize_teacher!, only: [:scores, :units, :scorebook, :generate_login_pdf]

  INDEX = 'index'

  def index
    session[GOOGLE_REDIRECT] = request.env['PATH_INFO']
    session[CLEVER_REDIRECT] = request.env['PATH_INFO']

    @coteacher_invitations = format_coteacher_invitations_for_index
    @classrooms = format_classrooms_for_index
    @clever_link = clever_link

    respond_to do |format|
      format.html
      format.json {render json: {classrooms: @classrooms, coteacher_invitations: @coteacher_invitations }}
    end
  end

  def new
    redirect_to '/teachers/classrooms?modal=create-a-class'
  end

  def classrooms_i_teach
    render json: fetch_classrooms_i_teach_cache, root: 'classrooms'
  end

  def regenerate_code
    render json: {code: Classroom.generate_unique_code}
  end

  def create
    @classroom = Classroom.create_with_join(classroom_params, current_user.id)
    if @classroom.valid?
      render json: {classroom: @classroom}
    else
      render json: {errors: @classroom.errors}
    end
  end

  def create_students
    authorize_owner! { params[:classroom_id] }
    return if performed?

    classroom = Classroom.find(create_students_params[:classroom_id])
    create_students_params[:students].each do |s|
      s[:account_type] = 'Teacher Created Account'
      student = Creators::StudentCreator.create_student(s, classroom.id)
      Associators::StudentsToClassrooms.run(student, classroom)
    end
    render json: { students: classroom.students }
  end

  def remove_students
    StudentsClassrooms
      .where(student_id: params[:student_ids], classroom_id: params[:classroom_id])
      .each { |sc| sc.archive }
    render json: {}
  end

  def update
    @classroom = Classroom.find(params[:id])
    @classroom.update(classroom_params)
    # this is updated from the students tab of the scorebook, so will make sure we keep user there
    respond_to do |format|
      format.html { redirect_to teachers_classroom_students_path(@classroom.id) }
      format.json {
        if @classroom.errors.any?
          render json: { errors: @classroom.errors }
        else
          render json: {}
        end
      }
    end
  end

  def bulk_archive
    Classroom.where(id: params[:ids]).each do |classroom|
      next if classroom.owner != current_user

      classroom.visible = false
      # we want to skip validations here because otherwise they can prevent archiving the classroom, when the classroom was created before the validation was added
      classroom.save(validate: false)
    end
    render json: {}
  end

  def hide
    classroom = Classroom.find(params[:id])
    classroom.visible = false
    classroom.save(validate: false)
    respond_to do |format|
      format.html{redirect_to teachers_classrooms_path}
      format.json{render json: classroom, serializer: ClassroomSerializer}
    end
  end

  def unhide
    # can't use param[:id] here or else rails magic looks up a classroom with that id
    # kicks an active record error (because it is out of the default scope), and returns a 404
    classroom = Classroom.unscoped.find(params[:class_id])
    classroom.update(visible: true)
    render json: classroom, serializer: ClassroomSerializer
  end

  def units
    @classroom = Classroom.find(params[:id])
    render json: {units: @classroom.units_json }
  end

  def generate_login_pdf
    @classroom = Classroom.find(params[:id])
    if @classroom.students.empty?
      flash[:info] = 'You can print a sheet with student logins once you add students.'
      redirect_back(fallback_location: dashboard_teachers_classrooms_path)
    end
    respond_to do |format|
      format.pdf do
        pdf = LoginPdf.new(@classroom)
        # we want to sanitize the classroom name so it works as a file name
        # this will get rid of illegal characters and replace them with underscores
        filename = @classroom.name.gsub(/[^0-9A-Za-z.\-]/, '_')
        send_data pdf.render, filename: "quill_logins_for_#{filename.downcase}.pdf", type: "application/pdf"
      end
    end
  end

  def transfer_ownership
    @classroom = Classroom.find(params[:id])
    requested_new_owner_id = params[:requested_new_owner_id]
    owner_role = ClassroomsTeacher::ROLE_TYPES[:owner]
    coteacher_role = ClassroomsTeacher::ROLE_TYPES[:coteacher]

    begin
      ActiveRecord::Base.transaction do
        ClassroomsTeacher.find_by(user_id: current_user.id, classroom_id: @classroom.id, role: owner_role).update(role: coteacher_role)
        ClassroomsTeacher.find_by(user_id: requested_new_owner_id, classroom_id: @classroom.id, role: coteacher_role).update(role: owner_role)
      end
      Analyzer.new.track_with_attributes(
          current_user,
          SegmentIo::BackgroundEvents::TRANSFER_OWNERSHIP,
{ properties: { new_owner_id: requested_new_owner_id } }
      )
    rescue => e
      return render json: { error: "Please ensure this teacher is a co-teacher before transferring ownership. #{e}" }, status: 401
    end

    render json: {}
  end

  private def fetch_classrooms_i_teach_cache
    current_user.all_classrooms_cache(key: 'teachers.classrooms.classrooms_i_teach') do
      @classrooms = current_user.classrooms_i_teach
    end
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  private def format_coteacher_invitations_for_index
    coteacher_invitations = CoteacherClassroomInvitation.includes(invitation: :inviter).joins(:invitation, :classroom).where(invitations: {invitee_email: current_user.email}, classrooms: { visible: true})

    coteacher_invitations.map do |coteacher_invitation|
      coteacher_invitation_obj = coteacher_invitation.attributes
      coteacher_invitation_obj[:classroom_name] = Classroom.find(coteacher_invitation.classroom_id)&.name
      coteacher_invitation_obj[:inviter_name] = coteacher_invitation&.invitation&.inviter&.name
      coteacher_invitation_obj[:inviter_email] = coteacher_invitation&.invitation&.inviter&.email
      coteacher_invitation_obj
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  private def format_classrooms_for_index
    has_classroom_order = ClassroomsTeacher.where(user_id: current_user.id).all? { |classroom| classroom.order }

    classrooms = Classroom.unscoped
      .joins(:classrooms_teachers)
      .where(classrooms_teachers: {user_id: current_user.id})
      .includes(
        :students,
        coteacher_classroom_invitations: :invitation,
        classrooms_teachers: :user
      )
      .order(has_classroom_order ? 'classrooms_teachers.order' : 'created_at DESC')

    student_ids = classrooms.flat_map(&:students).map(&:id)

    activity_counts_by_student = UserActivityClassification.completed_activities_by_student(student_ids)

    classrooms.compact.map do |classroom|
      classroom_obj = classroom.attributes
      classroom_obj[:providerClassroom] = classroom.provider_classroom if classroom.provider_classroom?
      classroom_obj[:students] = format_students_for_classroom(classroom, activity_counts_by_student)
      classroom_teachers = format_teachers_for_classroom(classroom)
      pending_coteachers = format_pending_coteachers_for_classroom(classroom)
      classroom_obj[:teachers] = classroom_teachers.concat(pending_coteachers)
      classroom_obj
    end.compact
  end

  private def format_students_for_classroom(classroom, activity_counts)
    sorted_students = classroom.students.sort_by(&:last_name)

    students = sorted_students.map do |student|
      student.attributes.merge(number_of_completed_activities: activity_counts[student.id] || 0)
    end

    return students unless classroom.provider_classroom?

    provider_classroom = ProviderClassroom.new(classroom)
    students.map { |student| student.merge(synced: provider_classroom.synced_status(student)) }
  end

  private def format_pending_coteachers_for_classroom(classroom)
    classroom.coteacher_classroom_invitations.map do |cci|
      {
        email: cci.invitation.invitee_email,
        classroom_relation: 'coteacher',
        status: 'Pending',
        id: cci.id,
        invitation_id: cci.id,
        name: '—'
      }
    end
  end

  private def format_teachers_for_classroom(classroom)
    classroom.classrooms_teachers.compact.map do |ct|
      teacher = ct.user&.attributes
      teacher[:classroom_relation] = ct.role
      teacher[:status] = 'Joined'
      teacher
    end.compact
  end

  private def create_students_params
    params
      .permit(
        :classroom_id,
        classroom: classroom_params,
        students: [
          :name,
          :username,
          :password,
          :account_type
        ]
      )
      .to_h
  end

  private def classroom_params
    params[:classroom].permit(:name, :code, :grade)
  end

  private def authorize_owner!
    classroom_id = block_given? ? yield : params[:id]
    return auth_failed unless classroom_id.present?

    classroom = Classroom.find_by(id: classroom_id)
    return auth_failed unless classroom

    classroom_owner!(classroom.id)
  end

  private def authorize_teacher!
    return unless params[:id].present?

    classroom_teacher!(params[:id])
  end
end
