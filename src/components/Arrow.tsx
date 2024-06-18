type Point = {
  x: number;
  y: number;
};

interface ArrowProps extends React.SVGProps<SVGSVGElement> {
  startPoint: Point;
  endPoint: Point;
  canvasWidth: number;
  canvasHeight: number;
  canvasStartPoint?: Point;
}

export const calculateDeltas = (
  startPoint: Point,
  endPoint: Point
): {
  dx: number;
  dy: number;
  absDx: number;
  absDy: number;
} => {
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  return { dx, dy, absDx, absDy };
};

export const calculateControlPoints = ({
  absDx,
  absDy,
  dx,
  dy,
}: {
  absDx: number;
  absDy: number;
  dx: number;
  dy: number;
}): {
  p1: Point;
  p2: Point;
  p3: Point;
  p4: Point;
} => {
  let startPointX = 0;
  let startPointY = 0;
  let endPointX = absDx;
  let endPointY = absDy;
  if (dx < 0) [startPointX, endPointX] = [endPointX, startPointX];
  if (dy < 0) [startPointY, endPointY] = [endPointY, startPointY];

  const fixedLineInflectionConstant = 40; // We will calculate this value dynamically in next step

  const p1 = {
    x: startPointX,
    y: startPointY,
  };
  const p2 = {
    x: startPointX + fixedLineInflectionConstant,
    y: startPointY,
  };
  const p3 = {
    x: endPointX - fixedLineInflectionConstant,
    y: endPointY,
  };
  const p4 = {
    x: endPointX,
    y: endPointY,
  };

  return { p1, p2, p3, p4 };
};

export const calculateControlPointsWithBuffer = ({
  boundingBoxElementsBuffer,
  absDx,
  absDy,
  dx,
  dy,
}: {
  boundingBoxElementsBuffer: number;
  absDx: number;
  absDy: number;
  dx: number;
  dy: number;
}): {
  p1: Point;
  p2: Point;
  p3: Point;
  p4: Point;
  boundingBoxBuffer: {
    vertical: number;
    horizontal: number;
  };
} => {
  const { p1, p2, p3, p4 } = calculateControlPoints({
    absDx,
    absDy,
    dx,
    dy,
  });

  const topBorder = Math.min(p1.y, p2.y, p3.y, p4.y);
  const bottomBorder = Math.max(p1.y, p2.y, p3.y, p4.y);
  const leftBorder = Math.min(p1.x, p2.x, p3.x, p4.x);
  const rightBorder = Math.max(p1.x, p2.x, p3.x, p4.x);

  const verticalBuffer =
    (bottomBorder - topBorder - absDy) / 2 + boundingBoxElementsBuffer;
  const horizontalBuffer =
    (rightBorder - leftBorder - absDx) / 2 + boundingBoxElementsBuffer;

  const boundingBoxBuffer = {
    vertical: verticalBuffer,
    horizontal: horizontalBuffer,
  };

  return {
    p1: {
      x: p1.x + horizontalBuffer,
      y: p1.y + verticalBuffer,
    },
    p2: {
      x: p2.x + horizontalBuffer,
      y: p2.y + verticalBuffer,
    },
    p3: {
      x: p3.x + horizontalBuffer,
      y: p3.y + verticalBuffer,
    },
    p4: {
      x: p4.x + horizontalBuffer,
      y: p4.y + verticalBuffer,
    },
    boundingBoxBuffer,
  };
};

const strokeWidth = 1;
const boundingBoxElementsBuffer = strokeWidth;

export const Arrow = ({
  startPoint,
  endPoint,
  canvasWidth,
  canvasHeight,
  canvasStartPoint = startPoint,
  ...props
}: ArrowProps) => {
  const { absDx, absDy, dx, dy } = calculateDeltas(startPoint, endPoint);
  const { p1, p2, p3, p4, boundingBoxBuffer } =
    calculateControlPointsWithBuffer({
      boundingBoxElementsBuffer,
      dx,
      dy,
      absDx,
      absDy,
    });

  return (
    <svg
      width={canvasWidth}
      height={canvasHeight}
      style={{
        backgroundColor: "",
        transform: `translate(${canvasStartPoint.x}px, ${canvasStartPoint.y}px)`,
      }}
      {...props}
    >
      <path
        stroke="black"
        strokeWidth={strokeWidth}
        fill="none"
        d={`
          M 
            ${p1.x}, ${p1.y} 
          C 
            ${p2.x}, ${p2.y} 
            ${p3.x}, ${p3.y} 
            ${p4.x}, ${p4.y} 
          `}
      />
    </svg>
  );
};
