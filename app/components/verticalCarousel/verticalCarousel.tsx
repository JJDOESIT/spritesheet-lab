import { useRef, useState, useEffect, MutableRefObject } from "react";
import { playAnimateCSS } from "../../functions/animation";

export default function VerticalCarousel({
  labels,
  animations,
  className,
}: {
  labels: string[];
  animations: string[];
  className: string;
}) {
  const [currentLabel, setCurrentLabel] = useState(1);
  const [nextLabelRef, setNextLabelRef] = useState(1);

  const labelRefs = [useRef(null), useRef(null)];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentLabel((currentLabel + 1) % labels.length);
      setNextLabelRef((nextLabelRef + 1) % labelRefs.length);
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [currentLabel]);

  useEffect(() => {
    labelRefs[1].current.classList.remove("invisible");
    labelRefs[nextLabelRef].current.innerText = labels[currentLabel];
    playAnimateCSS(labelRefs[nextLabelRef], animations[0], animations[1]);
    playAnimateCSS(
      labelRefs[(nextLabelRef + 1) % labelRefs.length],
      animations[1],
      animations[0]
    );
  }, [currentLabel]);

  return (
    <span className={`${className}`}>
      <div className="relative">
        <p ref={labelRefs[0]} className="absolute">
          {labels[0]}
        </p>
        <p ref={labelRefs[1]} className="relative invisible">
          {labels[1]}
        </p>
      </div>
    </span>
  );
}
