import * as React from "react";
import XLSX from 'xlsx';

import { requestPost } from '../../../modules/request/index';

export const UploadRosters = () => {

  const [schoolId, setSchoolId] = React.useState<Number>();
  const [teachers, setTeachers] = React.useState<Array<any>>([]);
  const [students, setStudents] = React.useState<Array<any>>([])

  function handleSchoolIdChange(e) {
    setSchoolId(e.target.value)
  }

  function handleChangeFile(file) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array', });

      const sheet1 = workbook.Sheets[workbook.SheetNames[0]]
      const sheet1Array = XLSX.utils.sheet_to_json(sheet1, {header:1})
      const teachers = sheet1Array.slice(1).map((row: Array<String>) => {
        return { "name": row[0], "email": row[1], "password": row[2]}
      });

      const sheet2 = workbook.Sheets[workbook.SheetNames[1]]
      const sheet2Array = XLSX.utils.sheet_to_json(sheet2, {header:1})
      const students = sheet2Array.slice(1).map((row: Array<String>) => {
        return { "name": row[0], "email": row[1], "password": row[2], classroom: row[3], teacher_name: row[4], teacher_email: row[5]}
      });
      setTeachers(teachers)
      setStudents(students)
    };
    fileReader.readAsArrayBuffer(file);
  }

  function submitRosters() {
    requestPost(`${process.env.DEFAULT_URL}/cms/rosters/upload_teachers_and_students`,
      {
        school_id: schoolId,
        teachers: teachers,
        students: students
      },
      (body) => {
        alert("Rosters uploaded successfully!")
      },
      (body) => {
        if (body.errors) {
          alert(body.errors)
        }
      }
    );
  }

  return (
    <div>
      <h2>Upload Teacher and Student Rosters</h2>
      <div className="roster-input-container">
        <label className="roster-school-id" htmlFor="school-id-input">School ID
          <p className="control" id="school-id-input">
            <input aria-label="enter-school-id" className="input" defaultValue="" onChange={handleSchoolIdChange} type="text" />
          </p>
        </label>
      </div>
      <p className="upload-paragraph">Please upload a spreadsheet following this template: <a href="https://docs.google.com/spreadsheets/d/1YSSrb1IQMd1X_dss6btt2OUKEDrgYTTY--A_Kqfsck4/edit#gid=783496308" rel="noopener noreferrer" target="_blank">Bulk Teachers and Student Roster Template</a></p>
      <p className="control">
        <input
          accept=".xlsx"
          aria-label="upload-roster-csv"
          onChange={e => handleChangeFile(e.target.files[0])}
          type="file"
        />
      </p>
      <button className="quill-button primary medium upload-rosters-button" onClick={submitRosters} type="button">Upload Rosters</button>
    </div>
  )

}

export default UploadRosters
