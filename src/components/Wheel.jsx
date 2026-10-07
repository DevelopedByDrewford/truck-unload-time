import { useRef, useLayoutEffect } from 'react'

function Wheel({ items, value, onChange, itemHeight = 40 }) {
  const ref = useRef(null);
  const timer = useRef();

  useLayoutEffect(() => {
    ref.current.scrollTop = items.indexOf(value) * itemHeight;
  }, []); // position once on mount

  const handleScroll = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const item = items[Math.round(ref.current.scrollTop / itemHeight)];
      if (item !== undefined && item !== value) onChange(item);
    }, 80); // wait for the snap to settle
  };

  return (
    <div ref={ref} onScroll={handleScroll} className="wheel" style={{ height: itemHeight * 5 }}>
      <div style={{ height: itemHeight * 2 }} />
      {items.map(it => (
        <div key={it} className="wheel-item" style={{ height: itemHeight }}>{it}</div>
      ))}
      <div style={{ height: itemHeight * 2 }} />
    </div>
  );
}

export default Wheel