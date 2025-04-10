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

import { describe, it, expect } from "vitest";

import { toLineStringGeoJSON, toPolygonGeoJSON } from "../lib/geojson.js";
import { BASIC_PLANAR_STRUCTURE } from "./fixtures/basic.js";

describe("Converts StructuresJSON to GeoJSON", () => {
  it("Converts to a LineString GeoJSON", () => {
    const lineCollection = toLineStringGeoJSON(BASIC_PLANAR_STRUCTURE);

    expect(lineCollection.type).toBe("FeatureCollection");
    expect(lineCollection.features.length).toBe(4);

    // get edge 0
    const feature = lineCollection.features.filter(
      (f) => f.properties.id === "e0",
    )[0];

    expect(feature.properties.id).toBe("e0");
    expect(feature.geometry.type).toBe("LineString");
    expect(feature.geometry.coordinates).toEqual([
      [1, 0, 1],
      [0, 0, 0],
    ]);
  });

  it("Converts to LineString GeoJSON as a Collection", () => {
    const collection = {
      kind: "structurecollection",
      structures: [BASIC_PLANAR_STRUCTURE],
    };

    const resultA = toLineStringGeoJSON(BASIC_PLANAR_STRUCTURE);
    const resultB = toLineStringGeoJSON(collection);

    expect(resultA).toEqual(resultB);
  });

  it("Converts to a Polygon GeoJSON", () => {
    const polyCollection = toPolygonGeoJSON(BASIC_PLANAR_STRUCTURE);

    expect(polyCollection.type).toBe("FeatureCollection");
    expect(polyCollection.features.length).toBe(1);

    const feature = polyCollection.features[0];
    expect(feature.properties.material).toBe("asphalt");
    expect(feature.properties.area).toBeCloseTo(1.414);
    expect(feature.geometry.type).toBe("Polygon");
    expect(feature.geometry.coordinates).toEqual([
      [
        [1, 0, 1],
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0],
        [1, 0, 1],
      ],
    ]);
  });

  it("Converts to Polygon GeoJSON as a Collection", () => {
    const collection = {
      kind: "structurecollection",
      structures: [BASIC_PLANAR_STRUCTURE],
    };

    const resultA = toPolygonGeoJSON(BASIC_PLANAR_STRUCTURE);
    const resultB = toPolygonGeoJSON(collection);

    expect(resultA).toEqual(resultB);
  });
});
