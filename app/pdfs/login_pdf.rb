class LoginPdf
  include Prawn::View

  def initialize(classroom)
    @classroom = classroom
    render_login_pdf
  end

  def render_cover_page
    start_new_page(:margin => [22, 24, 22, 24])
    render_text "<b>#{@classroom.teacher.name} - <color rgb='777777'>#{@classroom.name}</color></b>", 20
    move_down 20
    float do
      bounding_box([273, cursor], width: 279, height: 106) do
        render_text "<b>New Student?</b>", 14
        move_down 12
        render_text "1. New students can sign up at <b>quill.org/account/new</b>"
        move_down 11
        render_text "2. In the “<b>Join My Class</b>” field, enter the class code"
        move_down 12
        render_text "<font size='10'>Class Code:</font> <b>#{@classroom.code}</b>"
      end
    end
    stroke_color 'CCCCCC'
    stroke do
      vertical_line cursor, cursor - 106, at: 242
    end
    stroke_color '000000'
    render_text "<b>Instructions For Your Students:</b>", 14
    move_down 12
    render_text "1- Visit <b>quill.org</b>"
    move_down 8
    render_text "2- Click <b>Login</b> (at the top of the page)"
    move_down 8
    render_text "3- Enter <b>username</b> and <b>password</b>"
    move_down 8
    render_text "4- Click the <b>Login</b> button"
    move_down 20
    render_text "<b>Student List:</b>", 14
    move_down 14
    start_new_page(:margin => [22, 24, 22, 24])
  end

  def render_section_for_one_student(student)
    font("Helvetica", size: 18, style: :bold) do
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
        render_text "Username:", 10
        move_down 2
        font("Helvetica", style: :bold) do
          text_box(
            render_username_or_email_for_student(student),
            at: [0, cursor],
            height: 12,
            width: 312,
            overflow: :shrink_to_fit
          )
        end
        move_down 20
        render_text "Password: (First letter is <b>Capitalized</b>)", 10
        move_down 2
        font("Helvetica", style: :bold) do
          text_box(
            student.last_name.capitalize,
            at: [0, cursor],
            height: 12,
            width: 312,
            overflow: :shrink_to_fit
          )
        end
      end
    end
    render_text "1- Visit <b>quill.org</b>"
    move_down 8
    render_text "2- Click <b>Login</b> (at the top of the page)"
    move_down 8
    render_text "3- Enter your <b>username</b> and <b>password</b>"
    move_down 8
    render_text "4- Click the <b>Login</b> button"
  end

  def render_username_or_email_for_student(student)
    if student.clever_id.present? || student.signed_up_with_google?
      student.email
    else
      student.username
    end
  end

  def render_login_pdf
    font("Helvetica")
    render_cover_page
    student_count = 0
    @classroom.students.each do |student|
      render_section_for_one_student(student)
      student_count += 1
      if student_count % 5 > 0 && student_count != @classroom.students.length
        move_down 20
        stroke_color 'CCCCCC'
        dash(12)
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
