import * as CLIntF from '../../../interfaces/classroomLessons'
import SIB from './scriptItemBoilerplates'

const lessonSlideTypes: CLIntF.Questions = {
  'CL-LB': {
    type: 'CL-LB',
    data: {
      play: {
        html: "Lobby HTML"
      },
      teach: {script: [
        SIB['Overview']
      ],
      title: 'CHANGE ME'
      }
    }
  },
  'CL-ST': {
    type: 'CL-ST',
    data: {
      play: {
        html: "Static HTML"
      },
      teach: {script: [
        SIB['STEP-HTML']
      ],
      title: 'STATIC SLIDE TITLE'
      }
    }
  },
  'CL-MD': {
    type: 'CL-MD',
    data: {
      play: {
        prompt: "CHANGE ME",
        cues: ["CHANGE", "ME"],
        instructions: "CHANGE ME",
        html: "CHANGE ME"
      },
      teach: {script: [
        SIB['STEP-HTML'],
        SIB['T-MODEL']
      ],
      title: 'MODEL SLIDE TITLE'
      }
    }
  },
  'CL-FL': {
    type: 'CL-FL',
    data: {
      play: {
        prompt: "CHANGE ME",
        cues: ["CHANGE", "ME"],
        blankLabel: "",
        nBlanks: 3,
        instructions: "CHANGE ME"
      },
      teach: {script: [
        SIB['STEP-HTML'],
        SIB['T-REVIEW']
      ],
      title: 'FILL IN THE LIST BLANKS SLIDE TITLE'
      }
    }
  },
  'CL-FB': {
    type: 'CL-FB',
    data: {
      play: {
        prompt: "CHANGE ME ___",
        cues: ["CHANGE", "ME"],
        instructions: "CHANGE ME"
      },
      teach: {script: [
        SIB['STEP-HTML'],
        SIB['T-REVIEW']
      ],
      title: 'FILL IN THE BLANKS SLIDE TITLE'
      }
    }
  },
  'CL-SA': {
    type: 'CL-SA',
    data: {
      play: {
        prompt: "CHANGE ME",
        cues: ["CHANGE", "ME"],
        instructions: "CHANGE ME",
        prefilledText: "CHANGE ME"
      },
      teach: {
        script: [
          SIB['STEP-HTML'],
          SIB['T-REVIEW']
        ],
        title: 'SINGLE ANSWER SLIDE TITLE'
      }
    }
  },
  'CL-MS': {
    type: 'CL-MS',
    data: {
      play: {
        prompt: 'CHANGE ME',
        cues: ['CHANGE', 'ME'],
        instructions: 'CHANGE ME',
        stepLabels: ['Why', 'How', 'Where']
      },
      teach: {
        script: [
          SIB['STEP-HTML'],
          SIB['T-REVIEW']
        ],
        title: 'MULTISTEP SLIDE TITLE'
      }
    }
  },
  'CL-EX': {
    type: 'CL-EX',
    data: {
      play: {
        html: "EXIT SLIDE HTML"
      },
      teach: {
        script: [
          SIB['STEP-HTML']
        ],
        title: 'Wrap-up'
      }
    }
  },
}

export default lessonSlideTypes
