import { Component } from '../classes/Component'

/**
 * Component for toggle the view of the comment box.
 */
export class ToggleComments extends Component {
  /**
	 * Start the component (called when Component is instantiated)
	 */
  start() {
    this.toggleButton = $( '.js-comment-toggle' )
    this.commentBox = $( '#disqus_thread' )
    this.commentsLink = $( '.comments-link' )
    this.initCommentToggle()
  }

  /**
	 * Set the hidden class and remove it when the button is clicked on.
	 */
  initCommentToggle() {
    // When the .comments-link is clicked we need to show #disqus_thread
    this.commentsLink.on( 'click', () => {
      this.commentBox.show()
      this.toggleButton.remove()
    } )

    // Add a class on page load so disqus can set the correct height, and then we can hide the comments
    this.commentBox.addClass( 'hidden-comments' )

    // Fire when the button is clicked
    this.toggleButton.on( 'click', ( e ) => {
      e.preventDefault()
      // Remove the class we added on load
      this.commentBox.removeClass( 'hidden-comments' )
      // Remove the toggle button once the comments have been displayed.
      this.toggleButton.remove()
    } )
  }
}
