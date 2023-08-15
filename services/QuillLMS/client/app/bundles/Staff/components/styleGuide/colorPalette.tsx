import * as React from "react";

const greys = [
  {
    title: 'Black',
    variableName: 'quill-black'
  },
  {
    title: 'Grey - 90',
    variableName: 'quill-grey-90'
  },
  {
    title: 'Grey - 80',
    variableName: 'quill-grey-80'
  },
  {
    title: 'Grey - 70',
    variableName: 'quill-grey-70'
  },
  {
    title: 'Grey - 60',
    variableName: 'quill-grey-60'
  },
  {
    title: 'Grey - 50',
    variableName: 'quill-grey-50'
  },
  {
    title: 'Grey - 40',
    variableName: 'quill-grey-40'
  },
  {
    title: 'Grey - 35',
    variableName: 'quill-grey-35'
  },
  {
    title: 'Grey - 30',
    variableName: 'quill-grey-30'
  },
  {
    title: 'Grey - 25',
    variableName: 'quill-grey-25'
  },
  {
    title: 'Grey - 20',
    variableName: 'quill-grey-20'
  },
  {
    title: 'Grey - 15',
    variableName: 'quill-grey-15'
  },
  {
    title: 'Grey - 10',
    variableName: 'quill-grey-10'
  },
  {
    title: 'Grey - 5',
    variableName: 'quill-grey-5'
  },
  {
    title: 'Grey - 3',
    variableName: 'quill-grey-3'
  },
  {
    title: 'Grey - 2',
    variableName: 'quill-grey-2'
  },
  {
    title: 'Grey - 1',
    variableName: 'quill-grey-1'
  },
  {
    title: 'White',
    variableName: 'quill-white'
  }
]

const baseColorTitlesAndVariableNames = [
  {
    title: 'Quill Green',
    variableName: "quill-green"
  },
  {
    title: 'Quill Green Warm',
    variableName: "quill-green-warm"
  },
  {
    title: 'Quill Green Vibrant',
    variableName: "quill-green-vibrant"
  },
  {
    title: 'Quill Teal',
    variableName: "quill-teal"
  },
  {
    title: 'Quill Blue',
    variableName: "quill-blue"
  },
  {
    title: 'Quill Purple',
    variableName: "quill-purple"
  },
  {
    title: 'Quill Violet',
    variableName: "quill-violet"
  },
  {
    title: 'Quill Red',
    variableName: "quill-red"
  },
  {
    title: 'Quill Maroon',
    variableName: "quill-maroon"
  },
  {
    title: 'Quill Gold',
    variableName: "quill-gold"
  },
  {
    title: 'Quill Gold Dark',
    variableName: "quill-gold-dark"
  },
]

const colorNumbers = [null, 50, 20, 10, 5, 1]

const renderElement =(title, variableName) => (
  <div className="element" key={variableName}>
    <span>{title}</span>
    <code>${variableName}</code>
    <div className={variableName} />
  </div>
)


const ColorPalette = () => {
  const colorRows = baseColorTitlesAndVariableNames.map(color => {
    const colors = colorNumbers.map(number => {
      let title = color.title
      let variableName = color.variableName

      if (number) {
        title+= ` - ${number}`
        variableName+= `-${number}`
      }

      return renderElement(title, variableName)
    })
    return (
      <div className="color-row" key={`${color.variableName}-row`}>
        {colors}
      </div>
    )
  })
  return (
    <div id="color-palette">
      <h2 className="style-guide-h2">Color Palette</h2>
      <div className="element-container">
        <h4 className="style-guide-h4">Greys</h4>
        <div className="color-row">
          {greys.map(grey => renderElement(grey.title, grey.variableName))}
        </div>
      </div>
      <div className="element-container">
        <h4 className="style-guide-h4">Colors</h4>
        {colorRows}
      </div>
    </div>
  )
}

export default ColorPalette
