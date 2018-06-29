import React from "react";
import ReactDOM from "react-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import HelpIcon from "@material-ui/icons/Help";
import Modal from "@material-ui/core/Modal";

class Input extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "123",
      open: false,
      msg: "range"
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSubmit = event => {
    const number = this.state.name;
    const n1 = number.charAt(0);
    const n2 = number.charAt(1);
    const n3 = number.charAt(2);
    if (+number < 100 || +number > 999) {
      this.setState({ open: true, msg: "range" });
    } else if (n1 === n2 || n2 === n3 || n1 === n3) {
      this.setState({ open: true, msg: "same" });
    } else {
      this.props.onNumberChange([+n1, +n2, +n3]);
    }

    event.preventDefault();
  };

  handleClick = state => () => {
    this.setState({ open: true, ...state });
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ open: false });
  };

  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit} noValidate autoComplete="off">
          <TextField
            id="name"
            label="Name"
            type="number"
            inputProps={{ max: 987, min: 102 }}
            value={this.state.name}
            onChange={this.handleChange("name")}
            margin="normal"
          />

          <Button
            onClick={this.handleSubmit}
            variant="contained"
            style={{ margin: 20 }}
            color="secondary"
          >
            Guess
          </Button>
        </form>

        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "left"
          }}
          open={this.state.open}
          style={{ width: 300, margin: 50 }}
          autoHideDuration={5000}
          onClose={this.handleClose}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={
            <span id="message-id">
              {" "}
              {this.state.msg === "range"
                ? "Number must be 100-999"
                : "Digits must be different"}{" "}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="secondary"
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
      </React.Fragment>
    );
  }
}

class Results extends React.Component {
  render() {
    const goalNumber = this.props.goalNumber;
    const guessedNumber = this.props.guessedNumber;

    let rightPlaced = 0;
    let missPlaced = 0;

    if (guessedNumber) {
      if (goalNumber[0] === guessedNumber[0]) rightPlaced++;
      if (goalNumber[1] === guessedNumber[1]) rightPlaced++;
      if (goalNumber[2] === guessedNumber[2]) rightPlaced++;
      if (
        goalNumber[0] === guessedNumber[1] ||
        goalNumber[0] === guessedNumber[2]
      )
        missPlaced++;
      if (
        goalNumber[1] === guessedNumber[0] ||
        goalNumber[1] === guessedNumber[2]
      )
        missPlaced++;
      if (
        goalNumber[2] === guessedNumber[0] ||
        goalNumber[2] === guessedNumber[1]
      )
        missPlaced++;
    }

    return (
      <Typography style={{ marginTop: 20, color: "green" }} variant="display1">
        {rightPlaced > 2
          ? "You won"
          : rightPlaced > 0 ? "+" + rightPlaced.toString() : ""}
        {missPlaced > 0
          ? "-" + missPlaced.toString()
          : rightPlaced < 1 ? "0" : ""}
      </Typography>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    let g1 = Math.floor(Math.random() * 9) + 1;
    let g2 = Math.floor(Math.random() * 10);
    while (g2 === g1) g2 = Math.floor(Math.random() * 10);
    let g3 = Math.floor(Math.random() * 10);
    while (g3 === g2 || g1 === g3) g3 = Math.floor(Math.random() * 10);

    this.goalNumber = [g1, g2, g3];

    this.state = { guessedNumber: null, open: false };
    this.handleNumberChange = this.handleNumberChange.bind(this);
    this.handleHelp = this.handleHelp.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleNumberChange(gNumber) {
    this.setState({ guessedNumber: gNumber });
  }

  handleHelp() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="title" color="inherit">
              Game
            </Typography>
          </Toolbar>
        </AppBar>

        <Paper
          elevation={1}
          style={{
            display: "inline-block",
            width: 262,
            margin: 30,
            padding: 30,
            height: 166.5
          }}
        >
          <Typography component="p">
            <b>Results</b>
          </Typography>
          <Results
            goalNumber={this.goalNumber}
            guessedNumber={this.state.guessedNumber}
          />
        </Paper>

        <Paper
          elevation={1}
          style={{
            float: "left",
            display: "inline-block",
            width: 262,
            margin: 30,
            padding: 30
          }}
        >
          <Typography component="p">
            <b>Guess the number</b>

            <IconButton
              key="help"
              aria-label="Close"
              color="primary"
              onClick={this.handleHelp}
            >
              <HelpIcon
                style={{
                  fontSize: 18,
                  marginBottom: 4
                }}
              />
            </IconButton>
          </Typography>

          <Input
            defaultValue="123"
            className={this.props.input}
            onNumberChange={this.handleNumberChange}
            inputProps={{
              "aria-label": "Description"
            }}
          />

          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.open}
            onClose={this.handleClose}
          >
            <div
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                position: "absolute",
                width: 550,
                backgroundColor: "white",
                padding: 32
              }}
            >
              <Typography variant="title" id="modal-title">
                <b>Help</b>
              </Typography>
              <Typography variant="subheading" id="simple-modal-description">
                Try to guess the number that computer generated.
              </Typography>
              <Typography variant="subheading" id="simple-modal-description">
                For every number in right place you get +1, -1 for the wrong
                place
              </Typography>
              <Typography variant="subheading" id="simple-modal-description">
                0 means none of the numbers you have guessed is right
              </Typography>
              <Typography variant="subheading" id="simple-modal-description">
                All digits are different
              </Typography>
            </div>
          </Modal>
        </Paper>
      </React.Fragment>
    );
  }
}

ReactDOM.render(<App />, document.querySelector("#app"));
