import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

// ...

const App = () => {
  const [circles, setCircles] = useState([
    { id: 1, backgroundColor: 'blue', number: 42 },
    { id: 2, backgroundColor: 'blue', number: 30 },
    { id: 3, backgroundColor: 'blue', number: 62 },
    { id: 4, backgroundColor: 'blue', number: 19 },
    { id: 5, backgroundColor: 'blue', number: 23 },
  ]);
  const [prevClickedIndex, setPrevClickedIndex] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
   // Track the highlighted circle
  const [poppedCircles, setPoppedCircles] = useState([]);
  const [uniquePoppedIds, setUniquePoppedIds] = useState(new Set());
  const [compareIndices, setCompareIndices] = useState({ firstIndex: null, secondIndex: null });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (compareIndices.firstIndex !== null && compareIndices.secondIndex !== null) {
      const delay = setTimeout(() => {
        setCompareIndices({ firstIndex: null, secondIndex: null });
      }, 2000);

      return () => clearTimeout(delay);
    }
  }, [compareIndices]);

  const handleCircleClick = (clickedCircle) => {
    setCircles((prevCircles) => {
       let clickedIndex = prevCircles.findIndex((circle) => circle.id === clickedCircle.id);
      console.log(clickedIndex);
      const newCircles = [...prevCircles];
      let largestNumber = Number.MIN_SAFE_INTEGER;
      let largestIndex = -1;
      let firstIndex = null;
      let secondIndex = null;
      let largestNum = 0;
      let indexOfLargestNumber=0;

      for (let i = clickedIndex + 1; i < newCircles.length; i++) {
        if (prevClickedIndex === null && clickedIndex !== 0) {
          setPrevClickedIndex(clickedIndex)
          break;
        }

        firstIndex = clickedIndex;
        secondIndex = i;

        if (clickedCircle.number > newCircles[i].number && i > prevClickedIndex) {
          [newCircles[clickedIndex], newCircles[i]] = [newCircles[i], clickedCircle];
          setPrevClickedIndex(clickedIndex);
          setHighlightedIndex(clickedIndex+1); // Highlight the circle meeting the condition
          break;
        }
         largestNum = Math.max(...prevCircles.map((circle) => circle.number));

        console.log("Current largest : ",largestNum);

       indexOfLargestNumber = prevCircles.findIndex((circle) => circle.number === largestNum);

        console.log("LargestNumber: ",largestNum);
        console.log("indexOfLargestNumber: ",indexOfLargestNumber);

        setHighlightedIndex(indexOfLargestNumber);
        
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
           // Reset highlightedIndex when the circle gets popped
        }
        largestNum = Math.max(...newCircles.map((circle) => circle.number));
        indexOfLargestNumber = newCircles.findIndex((circle) => circle.number === largestNum);

        console.log("end largest : ",largestNum);
        console.log("end index: ",indexOfLargestNumber);
        setHighlightedIndex(indexOfLargestNumber);
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
                index === highlightedIndex ? 'red':
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
              cursor: 'not-allowed',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              fontSize: '40px',
            }}
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

