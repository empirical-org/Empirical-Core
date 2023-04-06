import * as React from 'react';

interface DeleteSlideButtonProps {
  slideKey: string;
  deleteSlide: Function;
}

export default class DeleteSlideButton extends React.Component<DeleteSlideButtonProps, any> {

  handleDeleteSlideClick = () => {
    const { deleteSlide, slideKey, } = this.props
    deleteSlide(slideKey)
  }

  render() {
    return (<span className="slide-delete" onClick={this.handleDeleteSlideClick}>Delete Slide</span>)
  }
}
