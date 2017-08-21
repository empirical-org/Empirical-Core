import SIB from './scriptItemBoilerplates'

const lessonSlideTypes = {
  'CL-LB': {
    type: 'CL-LB',
    data: {
      play: {data: {}},
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
      play: {data: {}},
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
      play: {data: {}},
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
      play: {data: {}},
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
      play: {data: {}},
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
      play: {data: {}},
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
      play: {data: {}},
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
