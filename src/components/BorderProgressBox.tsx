import { useEffect, useRef, useState } from "react";

const BorderProgressBox = ({ progress }: { progress: number }) => {
  const borderRef = useRef<SVGRectElement>(null);
  const [perimeter, setPerimeter] = useState(0);

  useEffect(() => {
    const size = 100;
    const calcPerimeter = 4 * size;
    setPerimeter(calcPerimeter);

    if (borderRef.current) {
      borderRef.current.style.strokeDasharray = `${calcPerimeter}`;
      borderRef.current.style.strokeDashoffset = `${calcPerimeter}`;

      requestAnimationFrame(() => {
        borderRef.current!.style.strokeDashoffset = `${
          calcPerimeter * (1 - progress / 100)
        }`;
      });
    }
  }, [progress]);

  return (
    <div className="w-[100px] h-[100px] relative">
      <svg className="absolute  top-0 left-0 w-full h-full">
        <rect
          ref={borderRef}
          x="0"
          y="0"
          width="100"
          height="100"
          className="fill-none border-dashed stroke-red-500 rounded-2xl stroke-[4px] transition-all duration-500"
        />
      </svg>
      <div className="w-full h-full flex items-center justify-center  text-sm font-medium">
        {progress}%
      </div>
    </div>
  );
};

export default BorderProgressBox;
