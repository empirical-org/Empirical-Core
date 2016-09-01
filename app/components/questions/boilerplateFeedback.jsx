export default function getBoilerplateFeedback () {
  return (
    [
      {
        key: "1",
        name: "Category 1",
        description: "This is a description for category 1",
        children: [
          {
            key: "1-0",
            name: "Category 1, subcategory 0",
            description: "This is a description for category 1, subcategory 0"
          },
          {
            key: "1-1",
            name: "Category 1, subcategory 1",
            description: "This is a description for category 1, subcategory 1"
          }
        ]
      },
      {
        key: "2",
        name: "Category 2",
        description: "This is a description for category 2",
        children: [
          {
            key: "2-0",
            name: "Category 1, subcategory 0",
            description: "This is a description for category 2, subcategory 0"
          },
          {
            key: "1-1",
            name: "Category 1, subcategory 1",
            description: "This is a description for category 2, subcategory 1"
          }
        ]
      }
    ]
  )
}
