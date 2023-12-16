import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

const App = () => {
  const [circles, setCircles] = useState([
    { id: 1, number: 42 },
    { id: 2, number: 30 },
    { id: 3, number: 16 },
    { id: 4, number: 19 },
    { id: 5, number: 23 },
  ]);
  const [prevClickedIndex, setPrevClickedIndex] = useState(null);
  const [poppedCircles, setPoppedCircles] = useState([]);
  const [uniquePoppedIds, setUniquePoppedIds] = useState(new Set());
  const [compareIndices, setCompareIndices] = useState({ firstIndex: null, secondIndex: null });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (compareIndices.firstIndex !== null && compareIndices.secondIndex !== null) {
      const delay = setTimeout(() => {
        setCompareIndices({ firstIndex: null, secondIndex: null });
      }, 1000);

      return () => clearTimeout(delay);
    }
  }, [compareIndices]);

  const handleCircleClick = (clickedCircle) => {
    setCircles((prevCircles) => {
      const clickedIndex = prevCircles.findIndex((circle) => circle.id === clickedCircle.id);
      const newCircles = [...prevCircles];
      let largestNumber = Number.MIN_SAFE_INTEGER;
      let largestIndex = -1;

      let firstIndex = null;
      let secondIndex = null;

      for (let i = clickedIndex + 1; i < newCircles.length; i++) {
        if (prevClickedIndex === null && clickedIndex !== 0) {
          break;
        }

        firstIndex = clickedIndex;
        secondIndex = i;

        if (clickedCircle.number > newCircles[i].number && i > prevClickedIndex) {
          [newCircles[clickedIndex], newCircles[i]] = [newCircles[i], clickedCircle];
          setPrevClickedIndex(clickedIndex);
          break;
        }
        break;
      }

      newCircles.forEach((circle, index) => {
        if (circle.number > largestNumber) {
          largestNumber = circle.number;
          largestIndex = index;
        }
      });

      if (newCircles.length - 1 === largestIndex) {
        setPrevClickedIndex(null);
        const [poppedCircle] = newCircles.splice(largestIndex, 1);

        if (!uniquePoppedIds.has(poppedCircle.id)) {
          setUniquePoppedIds((prevSet) => new Set(prevSet.add(poppedCircle.id)));
          setPoppedCircles((prevPoppedCircles) => [poppedCircle, ...prevPoppedCircles]);
        }
      }

      if (firstIndex !== null && secondIndex !== null) {
        setCompareIndices({ firstIndex, secondIndex });
      }

      return newCircles;
    });
  };

  useEffect(() => {
    const allGreen = circles.every((circle) => circle.backgroundColor === 'green');
    if (allGreen) {
      setShowConfetti(true);
    }
  }, [circles]);

  return (
    <div>
      <div className="board" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        {circles.map((circle, index) => (
          <motion.div
            key={circle.id}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor:
                (compareIndices.firstIndex === index || compareIndices.secondIndex === index) && prevClickedIndex !== null
                  ? 'purple'
                  : 'blue',
              margin: '40px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              fontSize: '40px',
            }}
            onClick={() => handleCircleClick(circle)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            layout
          >
            {circle.number}
          </motion.div>
        ))}

        {poppedCircles.map((poppedCircle) => (
          <motion.div
            key={poppedCircle.id}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: 'green',
              margin: '40px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              fontSize: '40px',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            layout
          >
            {poppedCircle.number}
          </motion.div>
        ))}
        {showConfetti && <Confetti />}
      </div>
      <div></div>
    </div>
  );
};

export default App;
