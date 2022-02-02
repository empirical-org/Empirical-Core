import * as React from 'react';
import {
  QuestionData
} from '../../../interfaces/classroomLessons'

interface StaticProps {
  data: QuestionData
}

const Static = ({ data, }: StaticProps) => (
  <div className="student-static-page-container"><div className="student-static-page" dangerouslySetInnerHTML={{ __html: data.play.html, }} /></div>
)

export default Static;
