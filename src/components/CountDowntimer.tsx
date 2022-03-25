import React from "react";
import Countdown from "react-countdown";

const getNextDay = () => {

  const tomorrow = new Date("Sun Mar 27 2022 00:00:00 GMT+0000");
  // tomorrow.setUTCDate(tomorrow.getUTCDate());
  // set to midnight
  // tomorrow.setUTCHours(0, 0, 0, 0);
  // console.log(tomorrow);

  return tomorrow.toUTCString();
};

export default function CountDowntimer() {
  return (
    <div className="inline-block">
      <Countdown
        autoStart
        date={getNextDay()}
      />
    </div>
  );
}
