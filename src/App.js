import React, { Component } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ChosenWords from "./components/ChosenWords";
import RemoveWordArea from "./components/RemoveWordArea";
import ChangeNumWordsButton from "./components/ChangeNumWordsButton";
import ChooseRandomWordsButton from "./components/ChooseRandomWordsButton";
import Category from "./components/Category";
import { wordsData } from "./data/wordsData.js";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeLeftSec: 12,
      totalTimeSec: 500,
      timerRunning: false,
      selectedWords: [],
      isDragging: false,
      numWords: 3,
      categoriesCollapsed: false,
      categoriesExpanded: false,
    };
  }

  async toggleTimer(currentTimerRunning) {
    var newTimerRunning = !currentTimerRunning;

    if (newTimerRunning && this.state.timeLeftSec == 0) {
      this.resetTimer();
    }
    await this.setState({ timerRunning: newTimerRunning });
    if (newTimerRunning) {
      this.runTimer();
    }
  }

  async runTimer() {
    console.log("Running timer? " + this.state.timerRunning);
    console.log("Time left: " + this.state.timeLeftSec);
    if (this.state.timerRunning) {
      var interval = setInterval(() => {
        console.log("In setTimeout");
        if (this.state.timerRunning) {
          this.setState({ timeLeftSec: this.state.timeLeftSec - 1 }, () => {
            console.log("Time left: " + this.state.timeLeftSec);
          });
        }
        if (!this.state.timerRunning | (this.state.timeLeftSec == 0)) {
          clearInterval(interval);
          this.setState({ timerRunning: false });
        }
      }, 1000);
    }
  }

  resetTimer = () => {
    this.setState({
      timerRunning: false,
      timeLeftSec: this.state.totalTimeSec,
    });
  };

  setTotalTime = (seconds) => {
    this.setState({ totalTimeSec: seconds, timeLeftSec: seconds });
  };

  updateTimeLeft = () => {};

  secondsToHms = (secs) => {
    secs = Number(secs);
    var h = Math.floor(secs / 3600);
    var m = Math.floor((secs % 3600) / 60);
    var s = Math.floor((secs % 3600) % 60);

    var hDisplay = h > 0 ? h + ":" : "";
    var mDisplay =
      h > 0
        ? m > 0
          ? String(m).padStart(2, "0") + ":"
          : ""
        : m > 0
        ? m + ":"
        : "";
    var sDisplay = m > 0 ? String(s).padStart(2, "0") : s;
    return hDisplay + mDisplay + sDisplay;
  };

  onDragStart = () => {
    this.setState({ isDragging: true });
  };

  onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === "clock-area") {
    }
  };

  changeNumWords = (diff) => {
    var totalNumWords = 0;
    Object.keys(wordsData).forEach(
      (category) => (totalNumWords = totalNumWords + wordsData[category].length)
    );

    if (
      (this.state.numWords === 1 && diff < 0) ||
      (this.state.numWords === totalNumWords && diff > 0) ||
      (this.state.numWords === 10 && diff > 0)
    ) {
      return;
    }

    const newNumWords = this.state.numWords + diff;
    this.setState({ numWords: newNumWords });
  };

  getRandomWord = () => {
    const categories = Object.keys(wordsData);
    const randomCategory =
      wordsData[categories[Math.floor(Math.random() * categories.length)]];
    return randomCategory[Math.floor(Math.random() * randomCategory.length)];
  };

  chooseRandomWords = () => {
    var chosenWords = [];

    while (chosenWords.length < this.state.numWords) {
      const randomWord = this.getRandomWord();
      if (!chosenWords.includes(randomWord)) {
        chosenWords.push(randomWord);
      }
    }

    this.setState({ selectedWords: chosenWords });
  };

  clearWords = () => {
    this.setState({ selectedWords: [] });
  };

  collapseCategories = () => {
    this.setState({ categoriesCollapsed: true }, () => {
      this.setState({ categoriesCollapsed: false });
    });
  };

  expandCategories = () => {
    this.setState({ categoriesExpanded: true }, () => {
      this.setState({ categoriesExpanded: false });
    });
  };

  onClickWord = (word) => {
    if (this.state.selectedWords.includes(word)) {
      // remove word
      const newSelectedWords = this.state.selectedWords.filter(
        (selectedWord) => selectedWord !== word
      );
      this.setState({ selectedWords: newSelectedWords });
    } else {
      // add word
      var newSelectedWords = Array.from(this.state.selectedWords);
      newSelectedWords.push(word);
      this.setState({ selectedWords: newSelectedWords });
    }
  };

  onDragStart = () => {
    this.setState({ isDragging: true });
  };

  onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === "delete-area") {
      // delete word
      const newSelectedWords = Array.from(this.state.selectedWords);
      newSelectedWords.splice(source.index, 1);
      this.setState({ selectedWords: newSelectedWords, isDragging: false });
      return;
    }

    if (
      destination.droppablId === source.droppablId &&
      destination.index === source.index
    ) {
      // no change
      this.setState({ isDragging: false });
      return;
    }

    const newSelectedWords = Array.from(this.state.selectedWords);
    // remove 1 at source index
    newSelectedWords.splice(source.index, 1);
    // add dragged word at destination index
    newSelectedWords.splice(destination.index, 0, draggableId);

    this.setState({ selectedWords: newSelectedWords, isDragging: false });
  };

  render() {
    const percentage = (this.state.timeLeftSec / this.state.totalTimeSec) * 100;
    const timeDisplay = this.secondsToHms(this.state.timeLeftSec);
    return (
      <div className="App">
        <div className="bg-indigo-100 p-8">
          <h1 className="text-indigo-900 title-font text-2xl">Visual Timer</h1>
        </div>
        <section className="container text-gray-600 body-font my-5 mx-auto">
          {/* <div className="h-96 w-96 m-auto"> */}
          {/* <div className="flex flex-row space-around align-center justify-center h-full w-full">
                  <div className="pie relative w-full h-full rounded-full bg-red-300 border-2 border-red-700">
                    <svg width="100" height="100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="green"
                        strokeWidth="4"
                        fill="yellow"
                      ></circle>
                    </svg>

                    <DragDropContext
                      onDragStart={this.onDragStart}
                      onDragEnd={this.onDragEnd}
                    >
                      <Droppable
                        droppableId="ticker-drag"
                        direction="horizontal"
                      >
                        {(provided) => (
                          <div className="absolute l-1/2 w-1 h-full bg-blue-900 z-10"></div>
                        )}
                      </Droppable>
                      <Droppable
                        droppableId="clock-area"
                        direction="horizontal"
                      >
                        {(provided) => (
                          <div
                            className="mask absolute left-0 w-1/2 h-full rounded-l-full origin-right bg-red-300"
                            style={{
                              backgroundColor: `${
                                percentage > 50 ? "" : "#fca5a5"
                              }`,
                              transform: `rotate(-${
                                percentage > 50 ? 0 : 180
                              }deg)`,
                              zIndex: 1,
                            }}
                          ></div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                </div> */}
          {/* </div> */}
          <div
            className="mx-auto"
            // onClick={() =>
            //   this.state.timeLeftSec == 0
            //     ? this.resetTimer()
            //     : this.toggleTimer(this.state.timerRunning)
            // }
          >
            <div className="flex flex-row space-around align-center justify-center mx-auto">
              <div
                className="pie relative rounded-full bg-red-300 border-2 border-red-700 w-3/4 max-w-md max-h-md h-0"
                style={{
                  paddingBottom: "min(75%, 28rem)",
                }}
              >
                <div
                  className="ticker absolute left-0 w-1/2 h-full rounded-l-full origin-right bg-red-700"
                  style={{
                    transform: `rotate(${-3.6 * percentage + 180}deg)`,
                    zIndex: 0,
                  }}
                ></div>
                <div
                  className="mask absolute left-0 w-1/2 h-full rounded-l-full origin-right bg-red-700"
                  style={{
                    backgroundColor: `${percentage > 50 ? "" : "#fca5a5"}`,
                    transform: `rotate(-${percentage > 50 ? 0 : 180}deg)`,
                    zIndex: 1,
                  }}
                ></div>
                <div
                  className="absolute w-full z-10 text-white font-thin opacity-60"
                  style={{
                    fontSize: "min(5em, 10vmin)",
                    top: "calc(50% - 0.5em)",
                  }}
                >
                  {timeDisplay}
                </div>
              </div>
            </div>
            {/* <div className="flex flex-row space-around align-center justify-center">
                  custom time selector
                </div>
                <div className="flex flex-row space-around align-center justify-center">
                  options button for popup
                </div> */}
          </div>

          {/* <div>
                <div className="flex flex-row space-around align-center justify-center">
                  option: colour buttons, dark mode
                </div>
              </div> */}

          <div className="w-full h-full">
            <div className="flex flex-row space-around align-center justify-center">
              <button
                className="button cursor-pointer bg-blue-100 p-2 m-4 rounded-md text-blue-900 font-bold border border-blue-300"
                onClick={() => this.toggleTimer(this.state.timerRunning)}
              >
                {this.state.timerRunning ? "Pause" : "Start"}
              </button>
              <button
                className="button bg-blue-100 p-2 m-4 rounded-md text-blue-900 font-bold border border-blue-300"
                onClick={this.resetTimer}
              >
                Reset
              </button>
            </div>
            <div className="flex flex-row space-around align-center justify-center">
              {/* <button
                    className="m-1 p-3 rounded-md bg-blue-300 font-bold"
                    onClick={() => this.setTotalTime(300)}
                  >
                    5 min
                  </button> */}
              {/* <button
                    className="m-1 p-3 rounded-md bg-blue-300 font-bold"
                    onClick={() => this.setTotalTime(600)}
                  >
                    10 min
                  </button> */}
              <button
                className="m-1 p-3 rounded-md bg-blue-300 font-bold"
                onClick={() => this.setTotalTime(900)}
              >
                15 min
              </button>
              <button
                className="m-1 p-3 rounded-md bg-blue-300 font-bold"
                onClick={() => this.setTotalTime(1200)}
              >
                20 min
              </button>
              <button
                className="m-1 p-3 rounded-md bg-blue-300 font-bold"
                onClick={() => this.setTotalTime(3600)}
              >
                1 hour
              </button>
              <button
                className="m-1 p-3 rounded-md bg-blue-300 font-bold"
                onClick={() => this.setTotalTime(9000)}
              >
                2h 30m
              </button>
              {/* <button
                    className="m-1 p-3 rounded-md bg-blue-300 font-bold"
                    onClick={() => this.setTotalTime(2100)}
                  >
                    45 min
                  </button> */}
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
