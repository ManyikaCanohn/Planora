import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Welcome = () => {

  const [time, setTime] = useState(new Date());
  const { user } = useAuth();


    useEffect(() => {
      const timer = setInterval(() => {
        setTime(new Date());
      }, 1000);

      return () => clearInterval(timer);
    }, []);


    const getGreeting = (hour: number) => {
      if (hour < 12) {
        return "Good Morning";
      } else if (hour < 18) {
        return "Good Afternoon";
      } else {
        return "Good Evening";
      }
    };

    return (
      <div className="relative mb-8 overflow-hidden rounded-[30px] bg-gradient-to-r from-[#9b5cf5] to-[#b46eff] p-8 text-white">
        <h1 className="text-3xl font-bold">
          {user ? `${getGreeting(time.getHours())}, ${user.name}!` : `${getGreeting(time.getHours())}!`}
        </h1>
        <p className="text-lg text-muted">
           {time.toLocaleDateString("en-GB", { month: "long" })}, {time.toLocaleDateString("en-GB", { weekday: "long" })}: {time.toLocaleDateString()} {time.toLocaleTimeString()}.
        </p>
      </div>
    );
};

export default Welcome;