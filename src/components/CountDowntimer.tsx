import React from "react";
import Countdown from "react-countdown";

const getNextDay = () => {
  const tomorrow = new Date("Sunday, March 27, 2022");
  tomorrow.setUTCDate(tomorrow.getUTCDate());
  // set to midnight
  tomorrow.setUTCHours(0, 0, 0, 0);
  return tomorrow.toUTCString();
};

export default function CountDowntimer() {
  return (
    <div className="inline-block">
      <Countdown
        autoStart
        date={getNextDay()}
        ref={(arg) => {
          if (arg) {
            const { isCompleted, start } = arg.getApi();
            if (isCompleted()) start();
          }
        }}
      />
    </div>
  );
}
