import { useEffect, useState } from 'react'
import './App.css'
import './components/Box.css'
import { type BoxProps } from './components/Box'
import Guess from "./components/Guess";
import detectMob from './utils/detectMobile';
import UserControls from './components/UserControls';
import { Debug } from './components/Debug';

function App() {
  const [date, setDate] = useState("")

  const [guesses, setGuesses] = useState<BoxProps[][]>([[]]);

  const defaultUrl = "https://www.junglediff.cz/metrodle-api/"

  console.log(detectMob())

  const getUpdate = async () => {
    try {
      const res = await fetch(defaultUrl + "getUpdate.php")
      const data = await res.text()

      setDate(data)

    } catch (error) {
      console.error();
    }
  }

  useEffect(() => {
    getUpdate()
  })

  return (
    <>
      <div>
        <h1>Metrodle</h1>
        <h2>Uhodni dnešní stanici metra</h2>
        <h2>Posledni update: {date}</h2>
      </div>

      <UserControls
        guesses={guesses}
        setGuesses={setGuesses}
        isMobile={detectMob()}
      ></UserControls>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Guess
          cubes={[
            { match: "nazev", value: "Název" },
            { match: "nazev", value: "Linka" },
            { match: "nazev", value: "Část Prahy" },
            { match: "nazev", value: "Bezbariérová" },
            { match: "nazev", value: "Přestupní" },
            { match: "nazev", value: "Datum otevření" }
          ]}
        />
        {guesses.map((guess, key) => (
          <Guess key={key} cubes={guess}/>
        ))}
    </div>

    <Debug isMobile={detectMob()}></Debug>
    </>
  )
}

export default App
