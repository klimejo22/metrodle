import React from "react";
import Box, { type BoxProps } from "./Box";
import "./Box.css";

interface GuessProps {
  cubes: BoxProps[];
}

const Guess: React.FC<GuessProps> = ({ cubes}) => {
  return (
    <div className="cube-container">
      {cubes.map((cube, index) => (
        <Box key={index} match={cube.match} value={cube.value} />
      ))}
    </div>
  );
};

export default Guess;
