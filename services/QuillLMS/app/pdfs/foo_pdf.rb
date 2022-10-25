class FooPdf
  def self.run(classroom_id, filename)
    student_rows = Classroom.find(classroom_id).students.map do |student|
      data = <<-HTML
      <ul>
        <li> 1. Visit quill.org </li>
        <li>2. Click Login (at the top of the page</li>)
        <li>3. Enter your username and password 4. Click the Login button</li>
      </ul>
      <p>username: #{student.username} </p>
      <p>password: #{student.password} </p>
      HTML
    end

    template = <<-HTML
      <!doctype html>
      <html>
        <head>
        </head>
        <body onload='number_pages'>
          <div id="header">

          </div>
          <div id="content">
            #{student_rows}
          </div>
        </body>
      </html>

    HTML


    pdf = WickedPdf.new.pdf_from_string(template)
    File.open(filename, 'wb') {|f| f << pdf }
  end

end