/**
 * @module/structuresio/geojson
 * Convert a StructuresJSON Structure or StructureCollection to GeoJSON
 */

/** 
 * toCoordinateArray converts the surface topology to a GeoJSON style
 * Polygon geometry coordinates array.
 *
 * This is written to be as clear and testable as possible.
 * There are likely more efficient ways to loop through this loop,
 * but this version works and is relatively easy to read.
 *
 */
export const toCoordinateArray = (surface, edges, points) => {
  // the "edges" array is structued similar to a simple features polygon.
  // [outer ring, inner ring, inner ring]
  // And each ring is composed of [edgeId, edgeId, edgeId]
  // edges contains points [pointId, pointId]
  const coords = surface.edges.map((edgeIds) => {
    const edgePoints = [];
    edgeIds.forEach((edgeId, edgeIdx) => {
      const edge = edges[edgeId];
      // copy the points to ensure the origin edge is not mutated.
      const nextPoints = [...edge.points];
      if (edgeIdx === 0) {
        // determine whether to start the line with the first segment reversed
        const testPoints = edges[edgeIds[1]].points;
        if (nextPoints[0] === testPoints[0]) {
          // flip it
          nextPoints.reverse();
        }
      } else {
        // keep the line contiguous, flip the next set of points
        //  when the lastPoint in the line does not match the
        //  first point of the next edge.
        const lastPoint = edgePoints[edgePoints.length - 1];
        if (nextPoints[0] !== lastPoint) {
          nextPoints.reverse();
        }
      }
      // use slice(1) to prevent duplicate points.
      nextPoints.slice(1).forEach((p) => edgePoints.push(p));
    });
    // ensure the polygon is closed.
    if (edgePoints[0] !== edgePoints[edgePoints.length - 1]) {
      edgePoints.push(edgePoints[0]);
    }
    // convert all the point ids into [x, y, z] coordinates.
    return edgePoints.map((ptId) => points[ptId].coordinates);
  });
  return coords;
};

const structureToPolygonFeatures = ({surfaces, points, edges}) => {
  const features = Object.keys(surfaces).map((surfaceId) => {
    return {
      type: "Feature",
      properties: {
        ...surfaces[surfaceId].properties,
        id: surfaceId,
        layer: "surfaces",
      },
      geometry: {
        type: "Polygon",
        coordinates: toCoordinateArray(surfaces[surfaceId], edges, points),
      },
    };
  });

  return features;
}



/**
 * @return A FeatureCollection of the surfaces as GeoJSON Polygons.
 */
export const toPolygonGeoJSON = (collection) => {
  // handle either a collection or single structure
  const allFeatures = collection.kind === 'StructureCollection' ?
    collection.structures.map(structureToPolygonFeatures) :
    [structureToPolygonFeature(collection)];

  return {
    type: "FeatureCollection",
    // flatten the array of arrays so that all structures are represented.
    features: allFeatures.flatMap(v => v),
  };
};

/**
 * Convert a single structure into a list of GeoJSON Features
 * which have LineString geometries.
 */
const stuctureToLineStringFeatures = ({edges, points}) => {
  const features = Object.keys(edges).map((edgeId) => {
    return {
      type: "Feature",
      properties: {
        id: edgeId,
        layer: "edges",
        kind: edges[edgeId].kind,
        // extend the edge properties
        ...edges[edgeId].properties,
      },
      geometry: {
        type: "LineString",
        coordinates: edges[edgeId].points.map(
          (ptId) => points[ptId].coordinates,
        ),
      },
    };
  });
  return features;
};

/**
 * @return A FeatureCollection of the edges as GeoJSON LineStrings.
 */
export const toLineStringGeoJSON = ({edges, points}) => {
  // handle either a collection or single structure
  const allFeatures = collection.kind === 'StructureCollection' ?
    collection.structures.map(structureToLineStringFeatures) :
    [structureToPolygonFeature(collection)];

  return {
    type: "FeatureCollection",
    features: allFeatures.flatMap(v => v),
  };
};
