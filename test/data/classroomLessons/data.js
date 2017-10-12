export const prompts = {
  5: 'Modified Prompt'
};

export const submissions = {
  4: {
    23663289: {
      data: 'The football star leaped toward the end zone, but he did not score a touchdown.',
      timestamp: '2017-09-13T10:52:31-05:00',
    },
    23663290: {
      data: 'The footballstarleaped tourd hend zone,but he did not score a tuch down.',
      timestamp: '2017-09-13T10:52:29-05:00',
    },
    23663291: {
      data: 'The football star leaped toward the end zone, but he did not score a touchdown.',
      timestamp: '2017-09-13T10:53:11-05:00',
    },
  },
  5: {
    23663289: {
      data: "The quarterback was fast, so the other players couldn't catch him.",
      timestamp: '2017-09-13T10:55:20-05:00',
    },
    23663290: {
      data: "The quarterback was fast,so the other players couldn 't catch him.",
      timestamp: '2017-09-13T10:56:00-05:00',
    },
    23663291: {
      data: "The quarterback was fast, and the other players couldn't catch him.",
      timestamp: '2017-09-13T10:57:02-05:00',
    },
  },
};

export const questions = [{
  data: {
    play: {
      html: '<p><br></p>',
    },
    teach: {
      script: [{
        data: {
          body: '<h4>Objective</h4>\n<p>Students will be able to combine sentences using <em>and</em>, <em>or</em>, <em>but</em>, and <em>so</em> to create a compound sentence.&nbsp;</p>\n<h4>Lesson Outline</h4>\n<p>Discuss the lesson objective</p>\n<p>Introduction: Create sentences using <em>and, or, but, and so</em></p>\n<p>Teacher Model: Combine sentences into a compound sentence</p>\n<p>Paired Practice: Combine sentences</p>\n<p>Individual Practice: Combine sentences</p>\n<p>Wrap up lesson</p>\n<h4>Optional Follow-Up Activity</h4>\n<p>And, Or, But, So (Intermediate)</p>\n<h4>Common Core Standards&nbsp;</h4>\n<p>CCSS.ELA-LITERACY.L.7.1.B. Choose among simple, compound, complex, and compound-complex sentences to signal differing relationships among ideas.</p>\n<h4>Prerequisites&nbsp;</h4>\n<p>There are no prerequisites for this lesson.</p>',
        },
        type: 'Overview',
      }],
      title: 'And, Or, But, So',
    },
  },
  type: 'CL-LB',
}, {
  data: {
    play: {
      html: '<p><br></p>\n<p>By the end of class today, I will be able to combine sentences by:</p>\n<blockquote>Using <em><strong>and</strong></em><strong>, </strong><em><strong>or</strong></em><strong>, </strong><em><strong>but</strong></em>, and <em><strong>so</strong></em> to show the relationship between ideas.</blockquote>\n<blockquote>Using correct punctuation.</blockquote>',
    },
    teach: {
      script: [{
        data: {
          body: '<p><strong>Say:</strong> Sometimes you’ll want to join two complete sentences together to make your writing flow more smoothly and to show that the two sentences are related. Today, you’re going to learn one way to correctly join two complete sentences together.&nbsp;</p>\n<p><strong>Say:</strong> Read today’s objective out loud with me.</p>\n<p><strong>Say:</strong> By the end of class today, I will be able to combine sentences using <em>and</em>, <em>or</em>, <em>but</em>, and <em>so</em> to show the relationship between ideas.</p>\n<p><strong>Say:</strong> Today, we are going to learn about <em>and, or, but, </em>and<em> so.&nbsp;</em></p>',
          heading: 'Introduce the objective for the lesson. ',
        },
        type: 'STEP-HTML',
      }],
      title: 'Objectives',
    },
  },
  type: 'CL-ST',
}, {
  data: {
    play: {
      html: '<p><br>\n</p>\n<p>Join two sentences with a <strong>comma</strong> and one of these <strong>joining words</strong>:</p>\n<blockquote>and, or, but, so</blockquote>',
    },
    teach: {
      script: [{
        data: {
          body: '<p><strong>Say: </strong>You can join two sentences with a comma and one of these joining words<strong>:</strong> and, or, but, so</p>\n<p><strong>Say:</strong> Each of these words helps show a different relationship between the two sentences. Let’s quickly come up with a sentence for each of the joining words.</p>\n<p><em>Ask a student to share a sentence using “and.”</em></p>\n<p><strong>Say:</strong> Good! <em>And</em> is used when we want to add two ideas together.</p>\n<p><em>Ask a student to share a sentence using “or.”</em></p>\n<p><strong>Say:</strong> That’s a great sentence! <em>Or</em> is used to connect two choices or options.</p>\n<p><em>Ask a student to share a sentence using “but.”</em></p>\n<p><strong>Say:</strong> Nice. <em>But</em> is used to show two opposite ideas. It is used when the second idea in the sentence seems surprising after reading the first idea.</p>\n<p><em>Ask a student to share a sentence using “so.”</em></p>\n<p><strong>Say:</strong> Good. <em>So </em>is used to tell why. The first idea is the reason the second idea happened.&nbsp;</p>',
          heading: 'Ask students to share out loud sentences using each of the joining words.',
        },
        type: 'STEP-HTML',
      }],
      title: 'Introduction',
    },
  },
  type: 'CL-ST',
}, {
  data: {
    play: {
      cues: ['and', ' or', ' but', ' so'],
      html: 'CHANGE ME',
      instructions: 'Combine the sentences. Use one of the joining words.',
      prompt: '<p>Our best player had an injury.</p>\n<p>He couldn’t play in the final game.</p>',
    },
    teach: {
      script: [{
        data: {
          body: '<p><strong>Say: </strong>These joining words can be used to join together two complete sentences. Watch and listen as I combine the sentences together.</p>\n<p><strong>Say:</strong> Our best player had an injury. He couldn’t play in the final game.&nbsp;</p>\n<p><strong>Say: </strong>Our goal is to combine these two sentences, so we need to figure out how the ideas are related so we can choose the best joining word.</p>\n<p><strong>Say:</strong> Take 30 seconds and discuss with your partner which joining word you think I should use to combine the sentences.&nbsp;</p>\n<p><em>After pairs have discussed, have students vote on the joining word they think is best. Then, ask a student who voted for “so” to explain why that joining word is the best choice.</em></p>\n<p><strong>Say: </strong>Good! It seems like the player couldn’t play in the game <em>because</em> he had an injury. I need to choose the joining word that best shows the injury is the reason the player couldn’t play in the game. <em>So</em> is a good choice any time I want to give a reason or tell <em>why</em> something happens.</p>',
          heading: 'Ask students to vote on the best joining word to use.',
        },
        type: 'STEP-HTML',
      }, {
        data: {
          body: '<p><strong>Say:</strong> Watch and listen as I combine the sentences with <em>so</em>.</p>\n<p><strong>Say:</strong> First, I write my first sentence.</p>\n<p><em>In the Model Your Answer box, type: </em>Our best player had an injury</p>\n<p><strong>Say:</strong> Then, I need to add a comma.</p>\n<p><em>Add a comma to the sentence in the Model Your Answer box.</em></p>\n<p><strong>Say:</strong> Now I put a space, and I add my joining word.</p>\n<p><em>Add “so” to the sentence in the Model Your Answer box.</em></p>\n<p><strong>Say: </strong>And last I add the second sentence, making sure I also lowercase <em>he.</em></p>\n<p><em>Add to the sentence: </em>he couldn’t play in the final game.</p>\n<p><strong>Say: </strong>And now my sentences are combined! Combining sentences like this is one way to make your writing flow and sound less choppy.</p>\n<p><em>Ask the students to read the new sentence out loud together.</em></p>\n<p><strong>Say: </strong>Good. To recap, I wrote the first sentence, then I added a comma, a space, and my joining word, and then I added the second sentence. When you use one of these joining words to connect two complete sentences, always put the comma right before the joining word like I did here.</p>',
          heading: 'Model for students how to combine the sentences using "so."',
        },
        type: 'STEP-HTML',
      }, {
        type: 'T-MODEL',
      }],
      title: 'Teacher Model',
    },
  },
  type: 'CL-MD',
}, {
  data: {
    play: {
      cues: ['and', ' or', ' but', ' so'],
      instructions: 'Combine the sentences using one of the joining words.',
      prompt: '<p>The football star leaped toward the end zone.&nbsp;</p>\n<p>He did not score a touchdown.</p>',
    },
    teach: {
      script: [{
        data: {
          body: '<p><strong>Say:</strong> Now you’re going to try combining sentences with a partner. Discuss with your partner how to combine these two sentences using one of the joining words, and then write your answer in the box. You both must submit a response from your own computer.</p>',
          heading: 'Ask pairs to combine the sentences.',
        },
        type: 'STEP-HTML',
      }, {
        type: 'T-REVIEW',
      }, {
        data: {
          body: '<p><em>Lead a discussion about the errors students made in the incorrect responses, and then discuss the correct response.&nbsp;</em></p>\n<p><em>Ask the following questions:</em></p>\n<ul>\n  <li>Which joining word helps show the correct relationship?</li>\n  <li>What punctuation does this sentence need?</li>\n</ul>',
          heading: 'Select 1 correct response and 2-3 incorrect responses to display and discuss.',
        },
        type: 'STEP-HTML',
      }, {
        data: {
          body: '<p><em>Display a sentence that uses “but” and a sentence that uses “and.” If no student used “and” to join the ideas, display just one sentence that uses “but.”</em></p>\n<p><em>Ask a student to read the displayed sentences out loud.</em></p>\n<p><strong>Say: </strong><em>And</em> can be really useful to join two ideas together, but one of our goals for using joining words is to show the relationship between ideas. <em>And</em> doesn’t give us a relationship. It just says the two things happened.&nbsp;</p>\n<p><strong>Say:</strong> <em>But</em> is a stronger choice for this sentence because it helps show how these ideas are related. Let’s read just the first part of this sentence--the part that comes before the joining word.</p>\n<p><em>Ask a student to read the first half of the sentence.</em></p>\n<p><strong>Say</strong><em><strong>:</strong></em> After reading this, we think the football player is about to make a touchdown--it says he’s leaping towards the end zone! Then all of a sudden, we get to the second sentence, and that changes things completely.</p>\n<p><em>Ask a student to read the second part of the sentence</em>.</p>\n<p><strong>Say: </strong>This second sentence is surprising because we think the player is going to make a touchdown, and then we find out he doesn’t. That’s what <em>but </em>does--it changes the direction of the sentence by adding a surprising or opposite idea.</p>',
          heading: 'Example Discussion: Discuss the meaning of "but" and how it connects two ideas.',
        },
        type: 'STEP-HTML-TIP',
      }],
      title: 'Paired Practice',
    },
  },
  type: 'CL-SA',
}, {
  data: {
    play: {
      cues: ['and', ' or', ' but', ' so'],
      instructions: 'Combine the sentences using a joining word.',
      prompt: '<p>The quarterback was fast.&nbsp;</p>\n<p>The other players couldn’t catch him.&nbsp;</p>',
    },
    teach: {
      script: [{
        data: {
          body: '<p><strong>Say:</strong> Now combine these two sentences by yourself.&nbsp;</p>',
          heading: 'Ask students to combine the sentences on their own.',
        },
        type: 'STEP-HTML',
      }, {
        type: 'T-REVIEW',
      }, {
        data: {
          body: '<p><em>Lead a discussion about the errors students made in the incorrect responses, and then discuss the correct response.&nbsp;</em></p>\n<p><em>Ask the following questions:</em>&nbsp;</p>\n<ul>\n  <li>Which joining word helps show the correct relationship?</li>\n  <li>Where does the punctuation go in this sentence?</li>\n</ul>',
          heading: 'Select 1 correct response and 2-3 incorrect responses to display and discuss.\n',
        },
        type: 'STEP-HTML',
      }, {
        data: {
          body: '<p><em>Display a sentence that uses “and” and a sentence that uses “so.”&nbsp;</em></p>\n<p><strong>Say: </strong>Which sentence is stronger--the sentence that uses <em>and</em> or the sentence that uses <em>so</em>? Spend one minute discussing with your partner. Decide which sentence is stronger and why.&nbsp;</p>\n<p><em>Wait for students to finish discussing their ideas.</em></p>\n<p><strong>Say</strong><em><strong>:</strong></em> Raise your hand if you and your partner decided that using <em>and</em> is stronger.</p>\n<p><em>Ask one of the students to explain why they think “and” is stronger.</em></p>\n<p><strong>Anticipated Student Response: </strong>Both of these things are true. The quarterback was fast, and the other players couldn’t catch him.</p>\n<p><strong>Say:</strong> Raise your hand if you and your partner decided that using <em>so</em> is stronger.</p>\n<p><em>Ask one of the students to explain why they think “so” is stronger.</em></p>\n<p><strong>Anticipated Student Response:</strong> This sentence tells why the players couldn’t catch the quarterback. <em>So </em>helps give a reason.</p>\n<p><strong>Say: </strong>Exactly! <em>And</em> isn’t wrong, but it just tells us that two things are both true. One of our goals for using joining words is to show the relationship between ideas. <em>And</em> doesn’t give us a relationship. It just says they happened. <em>So</em> is stronger because it shows a reason. The quarterback being fast is the reason the players could catch him.&nbsp;</p>',
          heading: 'Example Discussion: Discuss why students should use the word "so" rather than the word "and." ',
        },
        type: 'STEP-HTML-TIP',
      }],
      title: 'Individual Practice',
    },
  },
  type: 'CL-SA',
}, {
  data: {
    play: {
      html: '<p><strong>Today, I learned:</strong></p>\n<p><br></p>\n<p>Use a <strong>joining word</strong> to connect two complete sentences.</p>\n<p><br></p>\n<p>Choose a joining word that best shows the <strong>relationship</strong> between ideas.</p>\n<p><br></p>\n<p>Use a <strong>comma</strong> before the joining word.</p>',
    },
    teach: {
      script: [{
        data: {
          body: '<p><strong>Say:</strong> Great work everyone! Let’s review what you learned today.</p>\n<p><em>Ask students to read each bullet point out loud.</em>&nbsp;</p>\n<p><em>You can assign an independent practice activity that students can either complete now or later.</em></p>\n<p><em>You can also pull aside the flagged students for small group instruction.&nbsp;</em></p>\n<p><strong>Say:</strong> Follow the instructions on your screen. If your screen says to begin the next activity, go ahead and begin it now. If your screen says to wait for instructions, please wait at your desk quietly for your next steps.</p>',
          heading: 'Review what the students learned today. ',
        },
        type: 'STEP-HTML',
      }],
      title: 'Wrap-up',
    },
  },
  type: 'CL-EX',
}];
