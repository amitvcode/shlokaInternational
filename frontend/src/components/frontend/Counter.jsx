import React, { useEffect, useState } from "react";

const Counter = ({ end, duration, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 10);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(counter);
      } else {
        setCount(Math.ceil(start));
      }
    }, 10);

    return () => clearInterval(counter);
  }, [end, duration]);

  return (
    <span className="text-6xl font-bold text-gray-900">
      {count}
      {suffix}
    </span>
  );
};

export default Counter;
