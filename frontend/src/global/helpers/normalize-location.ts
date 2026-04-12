export const normalizeXYToUtm = (location: [number, number]) => {
  const utm = Projection.wgs84_latlonToUTM([location]);
  const lat = String(Math.round(utm[0].x));
  const lon = String(Math.round(utm[0].y)).slice(1);
  return lat + "/" + lon;
};
