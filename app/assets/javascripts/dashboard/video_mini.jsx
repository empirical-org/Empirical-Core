EC.VideoMini = React.createClass({

  embedCodeGenerator: function() {
    var videoCode = this.props.videoCode
    var fullEmbedCode = videoCode + '?&theme=light&autohide=2&showinfo=0'
    return (
      <div className='video-container'>
        <h4>Lorem Ipsum Dolar</h4>
        <iframe width='298' height='168' src={fullEmbedCode} frameborder="0"></iframe>
        <p>Consectetur adipiscing elit cras sed.</p>
      </div>
);
},


  render: function() {
    return (
      <div className={"mini_container  col-md-4 col-sm-5 text-center"}>
        <div className ={"mini_content"}>
          {this.embedCodeGenerator()}
        </div>
      </div>
    );
  }
});
