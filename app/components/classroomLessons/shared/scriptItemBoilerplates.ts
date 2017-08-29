import * as CLIntF from '../../../interfaces/classroomLessons'

interface ScriptItemTypes {
  [key:string]: CLIntF.ScriptItem
}

const scriptItemTypes = {
  'Overview': {
    type: 'Overview',
    data: {
      body: "<h4>Objective: </h4> <p>CHANGE ME Practice: <a href='CHANGE ME'>CHANGE ME</a> </p> <hr /> <h4>Common Core Standards: </h4> <p>CHANGE ME</p><hr /> <h4>Prerequisites: </h4><p>CHANGE ME.</p>"
    }
  },
  'STEP-HTML': {
    data: {
      body: '<p><strong>Say:</strong> CHANGE ME</p>',
      heading: "STEP HTML HEADING"
    },
    type: 'STEP-HTML'
  },
  'STEP-HTML-TIP': {
    data: {
      body: '<p><strong>Say:</strong> CHANGE ME</p>',
      heading: "STEP HTML TIP HEADING"
    },
    type: 'STEP-HTML-TIP'
  },

  'T-MODEL': {
    type: 'T-MODEL'
  },
  'T-REVIEW': {
    type: 'T-REVIEW'
  }
}

export default scriptItemTypes
