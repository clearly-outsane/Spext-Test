import "./App.css";
import { useState, useEffect } from "react";
import {
  BsFillPlayFill,
  BsPauseFill,
  BsEyeFill,
  BsEyeSlashFill,
} from "react-icons/bs";
import { text } from "./Data";

function App() {
  const [textData, setTextData] = useState(null);
  const [position, setPosition] = useState(0);
  const [paused, setPaused] = useState(true);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    dataGenerator();
    return () => {};
  }, []);

  useEffect(() => {
    let timer;

    console.log(paused);
    if (!paused) {
      timer = window.setInterval(() => {
        setPosition((position) => {
          if (position > Object.keys(textData).length) {
            setPosition(0);
            window.clearInterval(timer);
            setPaused(true);
          }
          let i = 1;

          while (position + i in textData && textData[position + i].deleted) {
            position += 1;
          }

          return position + 1;
        });
      }, 500);
    } else {
      window.clearInterval(timer);
    }
    return () => {
      window.clearInterval(timer);
    };
  }, [paused]);

  const dataGenerator = () => {
    let wordObject = {};
    const textArray = splitWords(text);

    textArray.map((word, index) => {
      wordObject[index] = { word, deleted: false };
    });

    setTextData(wordObject);
    deleteWords(wordObject);
  };

  const deleteWords = (wordObject) => {
    const randomArray = Array.from(
      { length: Math.floor(Object.keys(wordObject).length / 3) },
      () => Math.floor(Math.random() * Object.keys(wordObject).length)
    );

    let tempTextData = wordObject;

    randomArray.map((index) => {
      tempTextData[index] = { ...tempTextData[index], deleted: true };
    });

    setTextData(tempTextData);
    console.log(tempTextData);
  };

  const spanGenerator = () => {
    let wordDivs = [];
    for (let index in textData) {
      let wordDiv = (
        <div
          key={index}
          className={`word ${
            parseInt(index) === position ? " highlight" : " "
          } ${
            textData[index].deleted === true
              ? hide === true
                ? "hideWord deletedWord"
                : " deletedWord"
              : ""
          } `}
        >
          {textData[index].word}
        </div>
      );
      wordDivs.push(wordDiv);
    }

    return wordDivs;
  };

  const splitWords = (text) => {
    return text.split(" ");
  };

  return (
    <div className='App '>
      <div className='center'>
        <div className='parent'>
          <div className='textControls' style={{ alignSelf: "end" }}>
            <div
              onClick={() => {
                setHide(!hide);
              }}
            >
              {hide ? (
                <BsEyeSlashFill className='fakeButton' size='2rem' />
              ) : (
                <BsEyeFill size='2rem' className='fakeButton' />
              )}
            </div>
          </div>
          <span className='textContainer'>{spanGenerator()}</span>
          <div
            onClick={() => {
              setPaused(!paused);
            }}
          >
            {paused ? (
              <BsFillPlayFill className='fakeButton' size='2rem' />
            ) : (
              <BsPauseFill className='fakeButton' size='2rem' />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
