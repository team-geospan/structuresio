/**
 * Copyright GEOSPAN Corp
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @module/structuresio/geojson
 * Convert a StructuresJSON Structure or StructureCollection to GeoJSON
 */

import { isCollection } from "./helpers.js";

/**
 * simplifyRing converts a single surface ring and coverts it to a list
 * of points.
 */
export const simplifyRing = (ringEdges) => {
  if (ringEdges.length === 0) {
    return [];
  }

  let edges = structuredClone(ringEdges);
  const sortedList = [];

  sortedList.push(edges.shift());

  // ensure the iterations of the while loop do not exceed
  // O(n^2), the input edge structure is likely degenerate.
  let maxIter = edges.length * edges.length;
  while (maxIter > 0 && edges.length > 0) {
    for (let i = 0, len = edges.length; i < len; i++) {
      const edge = edges[i];
      const len = sortedList.length - 1;
      if (sortedList[len][1] === edge[0]) {
        sortedList.push(edge);
        edges = edges.slice(0, i).concat(edges.slice(i + 1));
        break;
      } else if (sortedList[len][1] === edge[edge.length - 1]) {
        sortedList.push(edge.reverse());
        edges = edges.slice(0, i).concat(edges.slice(i + 1));
        break;
      }
    }
    maxIter--;
  }

  // flatten the list
  const asPoints = sortedList.map((edge) => edge[0]);
  // ensure the polygon is closed
  asPoints.push(sortedList[0][0]);
  return asPoints;
};

// surfaceRings returns a list of point ids based on the surfaces edges
const surfaceRings = (surfaceId, { surfaces, edges }) => {
  return surfaces[surfaceId].edges.map((ring) => {
    return ring.map((edgeId) => {
      return edges[edgeId].points;
    });
  });
};

const structureToPolygonFeature = ({ surfaces, points, edges }) => {
  const features = Object.keys(surfaces).map((surfaceId) => {
    const rings = surfaceRings(surfaceId, { surfaces, edges }).map((ring) =>
      simplifyRing(ring),
    );
    // convert all the rings into coordinates
    const coordinates = rings.map((ring) =>
      ring.map((pointId) => points[pointId].coordinates),
    );

    return {
      type: "Feature",
      properties: {
        ...surfaces[surfaceId].properties,
        id: surfaceId,
        layer: "surfaces",
      },
      geometry: {
        type: "Polygon",
        coordinates,
      },
    };
  });

  return features;
};

/**
 * @return A FeatureCollection of the surfaces as GeoJSON Polygons.
 */
export const toPolygonGeoJSON = (collection) => {
  // handle either a collection or single structure
  const allFeatures = isCollection(collection)
    ? collection.structures.map(structureToPolygonFeature)
    : [structureToPolygonFeature(collection)];

  return {
    type: "FeatureCollection",
    // flatten the array of arrays so that all structures are represented.
    features: allFeatures.flatMap((v) => v),
  };
};

/**
 * Convert a single structure into a list of GeoJSON Features
 * which have LineString geometries.
 */
const structureToLineStringFeature = ({ edges, points }) => {
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
export const toLineStringGeoJSON = (collection) => {
  // handle either a collection or single structure
  const allFeatures = isCollection(collection)
    ? collection.structures.map(structureToLineStringFeature)
    : [structureToLineStringFeature(collection)];

  return {
    type: "FeatureCollection",
    features: allFeatures.flatMap((v) => v),
  };
};
