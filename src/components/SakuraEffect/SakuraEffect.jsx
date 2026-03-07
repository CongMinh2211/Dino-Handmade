import { useState, useEffect } from 'react';
import './SakuraEffect.css';

const SakuraEffect = () => {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    const createPetal = () => {
      const id = Date.now() + Math.random();
      const left = Math.random() * 100;
      const size = Math.random() * 12 + 8;
      const duration = Math.random() * 6 + 8;
      const delay = Math.random() * 2;

      return { id, left, size, duration, delay };
    };

    const interval = setInterval(() => {
      setPetals((prev) => {
        const filtered = prev.filter((p) => Date.now() - p.id < 15000);
        if (filtered.length < 15) {
          return [...filtered, createPetal()];
        }
        return filtered;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sakura-container" aria-hidden="true">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="sakura-petal"
          style={{
            left: `${petal.left}%`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default SakuraEffect;
