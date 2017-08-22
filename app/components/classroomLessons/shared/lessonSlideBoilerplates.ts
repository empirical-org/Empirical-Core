import SIB from './scriptItemBoilerplates'

const lessonSlideTypes = {
  'CL-LB': {
    type: 'CL-LB',
    data: {
      play: {
        html: "CHANGE ME"
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
        html: "CHANGE ME"
      },
      teach: {script: [
        SIB['STEP-HTML']
      ],
        title: 'CHANGE ME'
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
        title: 'CHANGE ME'
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
        title: 'CHANGE ME'
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
        title: 'CHANGE ME'
      }
    }
  },
  'CL-SA': {
    type: 'CL-SA',
    data: {
      play: {
        prompt: "CHANGE ME",
        cues: ["CHANGE", "ME"],
        instructions: "CHANGE ME"
      },
      teach: {
        script: [
        SIB['STEP-HTML'],
        SIB['T-REVIEW']
      ],
        title: 'CHANGE ME'
      }
    }
  },
  'CL-EX': {
    type: 'CL-EX',
    data: {
      play: {
        html: "Time to go!"
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
