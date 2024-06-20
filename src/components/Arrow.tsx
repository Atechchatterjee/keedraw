type Point = {
  x: number;
  y: number;
};

interface ArrowProps extends React.SVGProps<SVGSVGElement> {
  startPoint: Point;
  endPoint: Point;
}

export function Arrow({
  startPoint,
  endPoint,
  className,
  ...props
}: ArrowProps) {
  return (
    <svg width="1920px" height="1080px" className={className} {...props}>
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="10"
          markerHeight="10"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
      </defs>
      <line
        x1={startPoint.x}
        y1={startPoint.y}
        x2={endPoint.x}
        y2={endPoint.y}
        stroke="black"
        marker-end="url(#arrow)"
      />
    </svg>
  );
}
