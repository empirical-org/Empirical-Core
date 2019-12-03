export const activityOne = {
  activity_id: 1,
  title: "Should Intelligent Design Be Taught in School?",
  passages: [
  	"Bethany Collchay’s parents want Bethany to believe exactly what it says in the Bible. The Bible says that God created human beings and all the plants and animals. At Bethany’s school, however, the science teacher says that living things evolve. This idea was first written about in a book by Charles Darwin that came out in 1859. Darwin’s theory of evolution says that humans and other animals developed from common ancestors over millions of years. This theory explains similarities and differences among species. It also explains why some species survived while others became extinct. When scientists study fossils from millions of years ago, they find evidence that supports what Darwin said. Changes in flu viruses and in color patterns on birds and fishes show that evolution is going on right now. While scientists say that evolution is undeniable, and point out that it is taught in all developed countries, people like Bethany’s parents have the right to their religious beliefs. They don’t want anything to threaten their child’s religious beliefs. When schools teach about evolution, some people fear a child’s belief in creationism could be threatened. So such people are asking schools to teach intelligent design along with evolution. The central concept behind intelligent design is that living things must have been designed by an intelligent being. Supporters ask us to think about the eye. An eye has to be created all at once with all its parts, they say, or it won’t work. Even though the law in America does not allow public schools to teach religion, intelligent design doesn’t name the designer or use the word “God,” so many argue that teaching about it would not break the law. Scientists, however, are against teaching intelligent design. They say intelligent design is not science. It doesn’t explain how living things came about or why some are like each other. It doesn’t fit with evidence, and it doesn’t predict anything. Therefore, intelligent design is not a scientific perspective, but a religious one. What do you think? Should schools teach intelligent design along with evolution?"
  ],
	prompts: [
    {
      prompt_id: 1,
  		text: "Schools should only teach evolution, the accepted scientific theory, because",
  		max_attempts: 5,
      max_attempts_feedback: "Nice effort! You made some strong revisions. Here is an example of a strong response. What is similar or different about your response? \n Schools should only teach evolution, the accepted scientific theory, because school is for learning about facts."
    },
    {
      prompt_id: 2,
      text: "Schools should only teach evolution, the accepted scientific theory, but",
      max_attempts: 5,
      max_attempts_feedback: "Nice effort! You made some strong revisions. Here is an example of a strong response. What is similar or different about your response? \n Schools should only teach evolution, the accepted scientific theory, but teachers can still be sensitive to students' beliefs."
    },
    {
      prompt_id: 3,
  		text: "Schools should only teach evolution, the accepted scientific theory, so",
  		max_attempts: 5,
      max_attempts_feedback: "Nice effort! You made some strong revisions. Here is an example of a strong response. What is similar or different about your response? \n Schools should only teach evolution, the accepted scientific theory, so that education remains based in fact."
    }
  ]
}

export const responses = [
  {
    prompt_id: 1,
    text: "Schools should only teach evolution, the accepted scientific theory, because school is for learning about facts."
  },
  {
    prompt_id: 2,
    text: "Schools should only teach evolution, the accepted scientific theory, but teachers can still be sensitive to students' beliefs."
  },
  {
    prompt_id: 3,
    text: "Schools should only teach evolution, the accepted scientific theory, so that education remains based in fact."
  }
]

export const allActivities = [
  activityOne
]
