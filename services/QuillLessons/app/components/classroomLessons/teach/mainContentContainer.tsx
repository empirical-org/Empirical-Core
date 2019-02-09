import * as React from 'react';
import CurrentSlide from './currentSlide';
import NextSlideButton from './nextSlideButton';
import { Lesson, Edition } from './dataContainer';
import {ClassroomLessonSession} from '../interfaces';
import {withApollo} from 'react-apollo';
import CHANGE_CURRENT_SLIDE from "../mutations/changeSlideNumber";
import gql from "graphql-tag";
interface MainContentContainerProps extends React.Props<any> {
  params: any
  lesson: Lesson
  edition: Edition
  session: ClassroomLessonSession
  client: any
}

export function getNextSlideNumber(
  currentSlideNumber:string,
  numberOfQuestions:number
):number {
  const nextSlideNumber = Number(currentSlideNumber) + 1;
  return nextSlideNumber >= numberOfQuestions - 1 ? numberOfQuestions - 1  : nextSlideNumber
}

export function getPreviousSlideNumber(
  currentSlideNumber:string,
  numberOfQuestions:number
):number {
  const previousSlideNumber = Number(currentSlideNumber) - 1;
  return previousSlideNumber <= 0 ? 0 : previousSlideNumber
}

class MainContentContainer extends React.Component<MainContentContainerProps, any> {
  constructor(props) {
    super(props)
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  handleKeyDown(event) {
    const {params, session, edition, lesson, client} = this.props
    const tag = event.target.tagName.toLowerCase()
    const className = event.target.className.toLowerCase()
    const mutation = CHANGE_CURRENT_SLIDE
    if (tag !== 'input' && tag !== 'textarea' && className.indexOf("drafteditor") === -1 && (event.keyCode === 39 || event.keyCode === 37)) {
      if (session.id) {
        const slideNumber = event.keyCode === 39
          ? getNextSlideNumber(session.current_slide, edition.questions.length)
          : getPreviousSlideNumber(session.current_slide, edition.questions.length)
        
        client.mutate({
          mutation, 
          variables: {
            id: session.id,
            slideNumber: `${slideNumber}`
          },
          optimisticResponse: {
            __typename: "Mutation",
            setSessionCurrentSlide: {
              id: session.id,
              __typename: "ClassroomLessonSession",
              current_slide: `${slideNumber}`
            }
          }
          
          
        });
       
      }
    }
  }

  render() {
    const {params, session, edition, lesson} = this.props
    console.log("Current Slide", session.current_slide)
    return (
      <div className="main-content">
        <div className="main-content-wrapper">
          <CurrentSlide params={params} session={session} edition={edition} lesson={lesson}/>
          <div className="next-slide-button-container">
            <NextSlideButton params={params} session={session} edition={edition} lesson={lesson}/>
          </div>
        </div>
      </div>
    );
  }
} 
  

export default withApollo(MainContentContainer);
