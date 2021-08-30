import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Api from '../style/MessageGenerator'
import { connect } from 'react-redux';
import { setError, clearError } from '../redux/actions/userInterface';
import { addMessage, deleteAllMessage } from '../redux/actions/message';
import CardMessage from './CardMessage';

class MessageList extends Component {
  constructor(...args) {
    super(...args)
  }

  api = new Api({
    messageCallback: (message) => {
      this.messageCallback(message)
    },
  });

  componentDidMount() {
    this.api.start()
  };

  messageCallback(message) {
    this.props.addMessage(message);

    // update snackbar error
    if (message.priority === 1) {
      this.props.setError({ info: message.message, isErr: true });
      setTimeout(() => { this.props.clearError() }, 3000)
    };
  };

  renderButton() {
    const isApiStarted = this.api.isStarted()
    return (
      <div id="buttons">
        <Button
          variant="contained"
          onClick={() => {
            if (isApiStarted) {
              this.api.stop()
            } else {
              this.api.start()
            }
            this.forceUpdate()
          }}
        >
          {isApiStarted ? 'Stop Messages' : 'Start Messages'}
        </Button>
        <Button variant="contained" onClick={this.props.deleteAllMessage}>clear</Button>
      </div>
    )
  };

  render() {
    return (
      <>
        {this.props.ui.snackbar.isErr
          && <div className="alert">
            {this.props.ui.snackbar.info}
            <button onClick={ () => this.props.clearError() }>close</button>
          </div>}
        <h1>Coding Challenge</h1>
        <hr />
        {this.renderButton()}
        <div id="container">
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
          >
            <Grid container item xs={4} justify="center" direction="column">
              <h2>Error Type 1</h2>
              <small>Count {this.props.messages.messages.filter((message) => message.priority === 1 ).length }</small>
              {
                this.props.messages.messages.map((msg) => msg.priority === 1 && <CardMessage key={msg.message} data={msg} />)
              }
            </Grid>
            <Grid container item xs={4} justify="center" direction="column">
              <h2>Warning Type 2</h2>
              <small>Count {this.props.messages.messages.filter((message) => message.priority === 2 ).length }</small>
              {
                this.props.messages.messages.map((msg) => msg.priority === 2 && <CardMessage key={msg.message} data={msg} />)
              }
            </Grid>
            <Grid container item xs={4} justify="center" direction="column">
              <h2>Info Type 3</h2>
              <small>Count {this.props.messages.messages.filter((message) => message.priority === 3 ).length }</small>
              {
                this.props.messages.messages.map((msg) => msg.priority === 3 && <CardMessage key={msg.message} data={msg} />)
              }
            </Grid>
          </Grid>
        </div>
      </>
    )
  }
};

const mapStateToProps = state => ({ messages: state.message, stopGeneration: state.stopGeneration, ui: state.ui });
const mapDispatchToProps = { addMessage, setError, clearError, deleteAllMessage };
export default connect(mapStateToProps, mapDispatchToProps)(MessageList);
