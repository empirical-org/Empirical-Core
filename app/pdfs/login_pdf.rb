class LoginPdf
  include Prawn::View

  def initialize(classroom)
    @classroom = classroom
    list_students
  end

  def list_students
    count = 0
    @classroom.students.each do |student|
      # We have to make sure that we don't have a page break in the middle
      # of a student's login information. At the default font size, we can fit
      # 10 students on one page. After that, we add two line breaks to move to
      # the following page as we can fit 52 lines of text, and each student
      # takes up 5 lines.
      if count == 10
        count = 0
        text "\n\n"
      else
        count += 1

        if student.clever_id.present?
          text "<b>#{student.name} (has clever)</b>\nemail: #{student.email}\npassword: Login with Clever with the above email address\n\n\n", inline_format: true
        elsif student.signed_up_with_google?
          text "<b>#{student.name} (has google)</b>\nemail: #{student.email}\npassword: Login with Google with the above email address\n\n\n", inline_format: true
        else
          text "<b>#{student.name}</b>\nusername: #{student.username}\ndefault password: #{student.last_name}\n\n\n", inline_format: true
        end
      end
    end
  end

end
