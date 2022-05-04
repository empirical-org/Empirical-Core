export const activityOne = {
  activity_id: 1,
  title: "Should Voting be Required?",
  passages: [
    {
      text: "Crispin Morales is a poor Bolivian factory worker who works 12-hour days. He works every day but Sunday. The last presidential election fell on a Saturday. Although he was given the day off as the law required, Crispin was unable to get to a polling station to vote. After failing to vote, Crispin was not allowed to withdraw his salary from his bank for over two months. This is because those who do not vote are punished in Bolivia given that voting there is compulsory, a civic duty required by law. Not all countries with compulsory voting enforce this law.\n\nIf a citizen of Australia or Brazil provides a good reason for not voting (e.g. being in a hospital) it is accepted. In fact, many nations have dropped mandatory voting altogether. However, this can have a negative effect. When Venezuela, for example, discontinued mandatory voting in 1993, it saw a 30% decline in attendance at the polls.\n\nLow voter turnout is a common problem in countries without compulsory voting. This problem might be explained by voter apathy or lack of enthusiasm around elections. Of 222 million eligible voters, only 125 million cast their votes in the 2012 U.S. presidential election. By contrast, over 750 million votes were cast during season 10 of American Idol. Some people find it discouraging that voting for American Idol seems to generate more enthusiasm than voting in national elections. While it's important to note that American Idol viewers as young as 13 years old can vote multiple times during multiple episodes, these numbers may indicate that some citizens feel that their vote counts more in television contests than in political contests. Or perhaps they’re just not interested in politics.\n\nMandatory voting may seem like a great way to encourage voter participation, but governments can sometimes misuse it. For example, in some dictatorships, citizens are forced to vote, but the same person is elected every time because the government does not allow political competition. In March 2014 in North Korea, 99% of the country cast votes for Kim Jong Un, the only candidate listed on the ballot.\n\nBut how can democracies have representative governments unless all or most of their citizens vote? Some say that compulsory voting ensures that the elected government represents the majority of the population. But those against compulsory voting say that it is a violation of personal liberties and choices. Others say that voting should be seen as a civic right and not a civic duty.",
      highlight_prompt: 'As you read, highlight two sentences that explain why some people think voting should be required.'
    },
  ],
  prompts: [
    {
      prompt_id: 3,
      conjunction: "so",
      text: "Governments should make voting compulsory so",
      max_attempts: 5,
      max_attempts_feedback:
        "Nice effort! You made some strong revisions. Here is an example of a strong response. What is similar or different about your response? \n\n Governments should make voting compulsory so that the elected government represents the majority of the population.",
    },
    {
      prompt_id: 2,
      conjunction: "but",
      text: "Governments should make voting compulsory, but",
      max_attempts: 5,
      max_attempts_feedback:
        "Nice effort! You made some strong revisions. Here is an example of a strong response. What is similar or different about your response? \n\n Governments should make voting compulsory, but with exceptions for people who have good reasons for not being able to vote.",
    },
    {
      prompt_id: 1,
      conjunction: "because",
      text: "Governments should make voting compulsory because",
      max_attempts: 5,
      max_attempts_feedback:
        "Nice effort! You made some strong revisions. Here is an example of a strong response. What is similar or different about your response? \n\n Governments should make voting compulsory because otherwise not everyone will vote.",
    },
  ],
}

export const responses = [
  {
    prompt_id: 1,
    text: "Governments should make voting compulsory because otherwise not everyone will vote.",
  },
  {
    prompt_id: 2,
    text: "Governments should make voting compulsory, but with exceptions for people who have good reasons for not being able to vote.",
  },
  {
    prompt_id: 3,
    text: "Governments should make voting compulsory, so that the elected government represents the majority of the population.",
  },
]

export const allActivities = [activityOne]

export const suboptimalSubmittedResponse = {
  feedback:
    "Good start! You stated that compulsory voting will ensure that more voices are heard. Now take it one step further—according to the passage, why is it important that more voices are heard?",
  feedback_type: "semantic",
  optimal: false,
  entry:
    "Governments should make voting compulsory, so that more voices are heard in elections.",
}

export const optimalSubmittedResponse = {
  feedback:
    "That's a really strong sentence! You used evidence from the text to identify why governments should make voting compulsory.",
  feedback_type: "semantic",
  optimal: true,
  entry:
    "Governments should make voting compulsory, so that the elected government represents the majority of the population.",
}
