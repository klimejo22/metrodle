import { useEffect, useState } from 'react'
import './App.css'
import './components/Box.css'
import { type BoxProps } from './components/Box'
import Guess from "./components/Guess";
import detectMob from './utils/detectMobile';

function App() {
  const [currentStanice, setCurrentStanice] = useState("")
  const [date, setDate] = useState("")

  const [guesses, setGuesses] = useState<BoxProps[][]>([[]]);

  const defaultUrl = "https://www.junglediff.cz/metrodle-api/"

  const getUpdate = async () => {
    try {
      const res = await fetch(defaultUrl + "getUpdate.php")
      const data = await res.text()

      setDate(data)

    } catch (error) {
      console.error();
    }
  }

  function removeDiacritics(str : string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  const handleClick = async () => {
    const normalizedStanice = removeDiacritics(currentStanice.toLowerCase());

    try {
      console.log("Kliklo se to")
      const query = new URLSearchParams({ stanice: normalizedStanice }).toString();
      const res = await fetch(
        defaultUrl + "getData.php" + "?" + query,
        {
          method: "get",
          headers: {"Content-Type": "application/json"},
        }
      )

      console.log(defaultUrl + "getData.php" + "?" + query)

      const data = await res.json()
      
      console.log(data)

      if (typeof data == "string") {
        alert(data)
        return
      }

      const names = Object.keys(data)


      let dailyGoal: { [x: string]: any; } = data[names[0]]
      let playerGuess
      let guessed = false
      if (names.length == 2) {
        playerGuess = data[names[1]]
      } else {
        playerGuess = dailyGoal
        guessed = true
      }


      const cubeValues = Object.keys(dailyGoal).map((key) => {
        const dailyVal = dailyGoal[key]
        const guessVal = playerGuess[key]

        
        if (Array.isArray(dailyVal) && Array.isArray(guessVal)) {
          const common = dailyVal.filter((x) => guessVal.includes(x));

          if (common.length == 0) {
            return {match: "cerveny", value: guessVal };
          }
          else if (common.length == 1) {
            return {match: "zluty", value: guessVal };
          } else {
            return {match: "zeleny", value: guessVal}
          }
        }

        if (Array.isArray(dailyVal) && !Array.isArray(guessVal)) {
          if (dailyVal.includes(guessVal)) {
            return {match: "zluty", value: guessVal }
          }
            
          else {
            return {match: "cerveny", value: guessVal }
          }
          
        }

        if (!Array.isArray(dailyVal) && Array.isArray(guessVal)) {
          if (guessVal.includes(dailyVal)) {
            return {match: "zluty", value: guessVal };
          }
          else {
            return {match: "cerveny", value: guessVal };
          }
        }

        if (dailyVal === guessVal) {
          return {match: "zeleny", value: guessVal}
        } else {
          return {match: "cerveny", value: guessVal}
        }
      }) 
      
      if (guessed) {
        cubeValues.unshift({match: "nazev", value: names[0]})
        alert("Podařilo se ti uhodnout zastávku na " + Object.keys(guesses).length + " pokusů")
      } else {
        cubeValues.unshift({match: "nazev", value: names[1]})
      }

      setGuesses((prev) => [cubeValues, ...prev]);

      setCurrentStanice("")

      console.log(guesses)

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
      <div>
        <input
          type="text"
          placeholder="Napis zastavku"
          value={currentStanice} onChange={(e) => setCurrentStanice(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleClick();
            }
          }}/>
        <button 
          onClick={handleClick}
          onTouchEnd={handleClick}
        >Potvrdit</button>
      </div>

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
    </>
  )
}

export default App
