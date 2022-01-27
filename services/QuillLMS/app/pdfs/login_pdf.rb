# frozen_string_literal: true

class LoginPdf < Prawn::Document
  include Prawn::Table::Interface

  def initialize(classroom)
    super(margin: [22, 24, 22, 24])
    @classroom = classroom
    StudentLoginPdfDownloadAnalyticsWorker.perform_async(classroom.owner.id, classroom.id)
    font_families.update(
      "DejaVuSans" => {
        :normal => "#{File.dirname(__FILE__)}/../assets/fonts/dejavu-sans/DejaVuSans.ttf",
        :bold => "#{File.dirname(__FILE__)}/../assets/fonts/dejavu-sans/DejaVuSans-Bold.ttf",
        :italic => "#{File.dirname(__FILE__)}/../assets/fonts/dejavu-sans/DejaVuSans-Oblique.ttf",
        :bold_italic => "#{File.dirname(__FILE__)}/../assets/fonts/dejavu-sans/DejaVuSans-BoldOblique.ttf",
      }
    )
    render_login_pdf
  end

  def render_cover_page_header
    render_text "<b>#{@classroom.owner.name} - <color rgb='777777'>#{@classroom.name}</color></b>", 20
    move_down 14
    float do
      bounding_box([273, cursor], width: 279, height: 120) do
        render_text "<u>Instructions for New Students:</u>", 12
        move_down 14
        render_text "1. Visit <b>quill.org</b>", 12
        move_down 7
        render_text "2. Click <b>Sign up</b> (at the top of the page)", 12
        move_down 7
        render_text "3. Create <b>username</b> and <b>password</b>", 12
        move_down 7
        render_text "4. Enter the class code: <b>#{@classroom.code}</b>", 12
      end
    end
    stroke_color 'CCCCCC'
    stroke do
      vertical_line cursor, cursor - 106, at: 242
    end
    stroke_color '000000'
    render_text "<u>Instructions for Invited Students:</u>", 12
    move_down 14
    render_text "1. Visit <b>quill.org</b>", 12
    move_down 7
    render_text "2. Click <b>Log In</b> (at the top of the page)", 12
    move_down 7
    render_text "3. Enter <b>username</b> and <b>password</b>", 12
    move_down 7
    render_text "4. Click the <b>Log In</b> button", 12
    move_down 40
    render_text "Student List:", 12
    move_down 12
  end

  def render_cover_page_table
    header = [["<b><font size='12'>Name</font></b>", "<b><font size='12'>Account Type</font></b>", "<b><font size='12'>Username</font></b>", "<b><font size='12'> Default Password</font></b>"]]
    body = []
    @classroom.students.sort_by { |s| s.name.split[1]}.each do |student|
      body << [student.name, student.account_type, username_or_email_value_for_student(student), render_password_for_student(student)]
    end
    table(header, cell_style: {
      inline_format: true,
      padding: 10,
      background_color: 'EFEFEF',
      borders: [:top],
      border_color: 'DDDDDD'
    }, column_widths: [140, 140, 140, 140])
    table(body, cell_style: {
      padding: 10,
      size: 10,
      border_color: 'DDDDDD',
      borders: [:top, :bottom]
    }, column_widths: [140, 140, 140, 140])
  end

  def render_section_for_one_student(student)
    font("DejaVuSans", size: 18, style: :bold) do
      text_box(
        student.name,
        at: [0, cursor],
        height: 18,
        width: 564,
        overflow: :shrink_to_fit
      )
    end
    move_down 28
    float do
      fill_color 'EEEEEE'
      fill_rectangle [252, cursor], 312, 80
      bounding_box([260, cursor - 8], width: 296, height: 64) do
        move_down 2
        fill_color '000000'
        render_text username_or_email_for_student(student), 10
        move_down 2
        font("DejaVuSans", style: :bold) do
          text_box(
            username_or_email_value_for_student(student),
            at: [0, cursor],
            height: 12,
            width: 312,
            overflow: :shrink_to_fit
          )
        end
        move_down 20
        render_password_instructions_for_student(student)
        move_down 2
        font("DejaVuSans", style: :bold) do
          text_box(
            render_password_for_student(student),
            at: [0, cursor],
            height: 12,
            width: 312,
            overflow: :shrink_to_fit
          )
        end
      end
    end
    render_text "1. Visit <b>quill.org</b>"
    move_down 8
    render_text "2. Click <b>Login</b> (at the top of the page)"
    move_down 8
    render_specific_login_instructions_for_student(student)
  end

  def username_or_email_for_student(student)
    if (student.clever_id.present? || student.signed_up_with_google?) && !student.email.blank?
      "Email:"
    else
      "Username:"
    end
  end

  def username_or_email_value_for_student(student)
    if (student.clever_id.present? || student.signed_up_with_google?) && !student.email.blank?
      student.email
    else
      student.username
    end
  end

  def render_specific_login_instructions_for_student(student)
    if student.clever_id.present?
      render_text "3. Click the <b>Login with Clever</b> button"
      move_down 8
      render_text "4. Log in with Clever"
    elsif student.signed_up_with_google?
      render_text "3. Click the <b>Login with Google</b> button"
      move_down 8
      render_text "4. Log in with Google"
    else
      render_text "3. Enter your <b>username</b> and <b>password</b>"
      move_down 8
      render_text "4. Click the <b>Login</b> button"
    end
  end

  def render_password_instructions_for_student(student)
    if student.clever_id.present? || student.signed_up_with_google?
      render_text "Default Password:", 10
    else
      render_text "Password: (First letter is <b>Capitalized</b>)", 10
    end
  end

  def render_password_for_student(student)
    if student.clever_id.present?
      "N/A (Log in with Clever)"
    elsif student.signed_up_with_google?
      "N/A (Log in with Google)"
    elsif student.authenticate(student.last_name)
      (student.last_name.capitalize).to_s
    else
      "N/A (Custom Password)"
    end
  end

  def render_login_pdf
    font("DejaVuSans")
    render_cover_page_header
    render_cover_page_table
    start_new_page
    student_count = 0
    @classroom.students.each do |student|
      render_section_for_one_student(student)
      student_count += 1
      if student_count % 5 > 0 && student_count != @classroom.students.length
        move_down 20
        stroke_color 'CCCCCC'
        dash(4)
        stroke_horizontal_line 0, 564
        move_down 24
      elsif student_count % 5 == 0
        start_new_page
      end
    end
  end

  def render_text(content, size = nil)
    size ||= 12
    font_size size do
      text content, inline_format: true
    end
  end

end
