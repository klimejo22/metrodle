import React, { useState } from "react";
import type { BoxProps } from "./Box";

export interface UserControlsProps {
    guesses: BoxProps[][]
    setGuesses: Function
    isMobile: boolean
}

export const UserControls : React.FC<UserControlsProps> = ({guesses, setGuesses, isMobile}) => {
    const [currentStanice, setCurrentStanice] = useState("")
    const defaultUrl = "https://www.junglediff.cz/metrodle-api/"

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

            setGuesses((prev: BoxProps[]) => [cubeValues, ...prev]);

            setCurrentStanice("")

            console.log(guesses)

        } catch (error) {
            console.error();
        }
    }

    return (
        <>
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
                onClick={() => {if (!isMobile) handleClick}}
                onTouchEnd={() => {if (isMobile) handleClick}}
                >Potvrdit</button>
            </div>
        </>
    )
}

export default UserControls