import SIT from './scriptItemTypes'

const lessonSlideTypes = {
  'CL-LB': {
    type: 'CL-LB',
    data: {
      play: {data: {}},
      teach: {script: [
        SIT['Overview']
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
        SIT['STEP-HTML']
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
        SIT['STEP-HTML'],
        SIT['T-MODEL']
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
        SIT['STEP-HTML'],
        SIT['T-REVIEW']
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
        SIT['STEP-HTML'],
        SIT['T-REVIEW']
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
        SIT['STEP-HTML']
      ],
        title: 'Wrap-up'
      }
    }
  },
}

export default lessonSlideTypes
