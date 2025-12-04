import React from "react";
import Counter from "./Counter";

const StatsSection = () => {
  return (
    <div className="flex justify-center items-start gap-16 bg-white">
      {/* Card 1 */}
      <div className="flex items-center gap-4">
        <div>
          <Counter end={150} duration={1500} suffix="+" />
        </div>
        <p className="text-gray-600 text-sm leading-snug max-w-[160px]">
          Discover 150+ Showrooms at Prime Locations Near You.
        </p>
      </div>

      {/* Card 2 */}
      <div className="flex items-center gap-4">
        <div>
          <Counter end={1} duration={1000} suffix="Cr+" />
        </div>
        <p className="text-gray-600 text-sm leading-snug max-w-[160px]">
          Happy Customers
        </p>
      </div>

      {/* Card 3 */}
      <div className="flex items-center gap-4">
        <div>
          <Counter end={1000} duration={1500} suffix="+" />
        </div>
        <p className="text-gray-600 text-sm leading-snug max-w-[160px]">
          Delivering to 1000+ cities across
        </p>
      </div>
    </div>
  );
};

export default StatsSection;
