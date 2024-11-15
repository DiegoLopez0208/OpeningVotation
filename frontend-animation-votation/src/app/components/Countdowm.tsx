// components/Countdown.tsx
import React, { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown: React.FC = () => {
  const fechaFutura: Date = new Date("Mon Nov 18 2024 00:00:00 GMT-0300 (hora estándar de Argentina)");

  const calculateTimeLeft = (): TimeLeft => {
    const now: number = new Date().getTime();
    const distance: number = fechaFutura.getTime() - now;

    const days: number = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours: number = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes: number = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds: number = Math.floor((distance % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000); // Actualiza cada segundo

    return () => clearInterval(timer); // Limpia el intervalo al desmontar el componente
  });

  return (
    <div className='text-blue-800 dark:text-blue-300 font-bold text-4xl '>
      {timeLeft.days >= 0 ? (
        <div className='flex flex-col w-full items-center mb-4'>
          <table className='text-center mb-2 w-fit'>
            <thead className='px-2'>
              <tr className=' px-2'>
                <th>{timeLeft.days}</th>
                <th>{timeLeft.hours < 10 ? `0${timeLeft.hours}` : timeLeft.hours}</th>
                <th>{timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}</th>
                <th>{timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}</th>
              </tr>
            </thead>
            <tbody className='text-xs font-semibold text-blue-500'>
              <tr className=''>
                <td className='px-2'>Dias</td>
                <td className='px-2'>Horas</td>
                <td className='px-2'>Minutos</td>
                <td className='px-2'>Segundos</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <h1>¡El tiempo ha expirado!</h1>
      )}
    </div>
  );
};

export default Countdown;
