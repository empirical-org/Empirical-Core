export default {
  Query: {
    lesson: (_, {id}) => {return {id}},
    lessons: () => [{id: "Hi"}]
  }
}