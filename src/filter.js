const pointToFilterMap = {
  everything: (points) => points.length,
  future: (points) => points
    .filter((point) => !point.isExpired).length,
  past: (points) => points
    .filter((point) => point.isExpired).length,
};

const generateFilter = (points) => Object.entries(pointToFilterMap).map(
  ([filterName, countPoints]) => ({
    name: filterName,
    count: countPoints(points),
  }),
);

export {generateFilter};
