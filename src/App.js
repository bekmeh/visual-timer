import React, { Component } from "react";
import { DragDropContext } from "react-beautiful-dnd";
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
      timeLeftSec: 30,
      totalTimeSec: 30,
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
    console.log(currentTimerRunning);
    await this.setState({ timerRunning: newTimerRunning });
    if (newTimerRunning) {
      this.runTimer();
    }
    console.log(this.state.timerRunning);
  }

  async runTimer() {
    console.log("Running timer? " + this.state.timerRunning);
    console.log("Time left: " + this.state.timeLeftSec);
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

  resetTimer = () => {};

  setTotalTime = () => {};

  updateTimeLeft = () => {};

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
    return (
      <div className="App">
        <div className="h-full bg-indigo-100 p-8">
          <h1 className="text-indigo-900 title-font text-2xl">Visual Timer</h1>
        </div>
        <section className="text-gray-600 body-font">
          <div className="container md:px-32 sm:px-10 px-2 pb-24 mx-auto">
            <div className="text-center mb-5 mt-5">
              <div>
                <div className="h-96 w-96 m-auto">
                  <div className="flex flex-row space-around align-center justify-center h-full w-full">
                    <div className="pie relative w-full h-full rounded-full border-4 border-red-700">
                      <div className="absolute left-0 w-1/2 h-full rounded-l-full origin-right bg-red-700"></div>
                      <div
                        className="absolute left-0 w-1/2 h-full rounded-l-full origin-right bg-white"
                        style={{
                          transform: `rotate(-${
                            (this.state.timeLeftSec / this.state.totalTimeSec) *
                            100
                          }deg)`,
                          zIndex: 1,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row space-around align-center justify-center">
                  {this.state.timeLeftSec}
                </div>
                <div className="flex flex-row space-around align-center justify-center">
                  custom time selector
                </div>
                <div className="flex flex-row space-around align-center justify-center">
                  options button for popup
                </div>
              </div>

              <div>
                <div className="flex flex-row space-around align-center justify-center">
                  option: colour buttons
                </div>
                <div className="flex flex-row space-around align-center justify-center">
                  option: time preset buttons (default and custom)
                </div>
              </div>

              <div>
                <div className="flex flex-row space-around align-center justify-center">
                  countdown pie (start from full circle)
                </div>
                <div className="flex flex-row space-around align-center justify-center">
                  <button
                    className="button bg-blue-100 p-2 m-4 rounded-md text-blue-900 font-bold border border-blue-300"
                    onClick={() => this.toggleTimer(this.state.timerRunning)}
                  >
                    {this.state.timerRunning ? "Pause" : "Start"}
                  </button>
                </div>
              </div>

              <div className="flex flex-row flex-auto space-around align-center justify-center">
                <div>
                  <div className="flex flex-auto flex-row content-center">
                    <ChangeNumWordsButton
                      diff={-1}
                      changeNumWords={this.changeNumWords}
                    />
                    <ChooseRandomWordsButton
                      numWords={this.state.numWords}
                      onClick={this.chooseRandomWords}
                    />
                    <ChangeNumWordsButton
                      diff={1}
                      changeNumWords={this.changeNumWords}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-center content-center text-base text-center leading-relaxed text-gray-400 pt-4">
                <button
                  className="flex flex-row border border-indigo-100 rounded-xl p-1 select-none focus:outline-none hover:bg-indigo-50"
                  onClick={this.clearWords}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 pl-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <p className="px-2">Clear</p>
                </button>
              </div>
              <div className="border-double border-4 border-indigo-200 rounded-md p-3 mt-6 xl:mx-96 lg:mx-64 sm:mx-24 mx-12">
                <p className="">
                  Choose the number of words you'd like, then press the button
                  to randomly generate. You can also manually select words
                  below, and drag to rearrange/delete them.
                </p>
              </div>
            </div>
            <div className="flex flex-row justify-center content-center text-base leading-relaxed text-gray-400">
              <button
                className="flex flex-row border border-indigo-100 rounded-xl p-1 select-none focus:outline-none hover:bg-indigo-50 px-2 mx-2"
                onClick={this.collapseCategories}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mt-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 15.707a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414 0zm0-6a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="px-2">Collapse all</p>
              </button>
              <button
                className="flex flex-row border border-indigo-100 rounded-xl p-1 select-none focus:outline-none hover:bg-indigo-50 px-2 mx-2"
                onClick={this.expandCategories}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mt-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M15.707 4.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L10 8.586l4.293-4.293a1 1 0 011.414 0zm0 6a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="px-2">Expand all</p>
              </button>
            </div>
            <div className="container flex flex-wrap m-4 mx-auto text-center items-left justify-left">
              {Object.keys(wordsData).map((category) => {
                return (
                  <Category
                    key={`category-${category}`}
                    category={category}
                    words={wordsData[category]}
                    onClickWord={this.onClickWord}
                    selectedWords={this.state.selectedWords}
                    collapse={this.state.categoriesCollapsed}
                    expand={this.state.categoriesExpanded}
                  />
                );
              })}
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
