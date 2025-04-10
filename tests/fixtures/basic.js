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

export const BASIC_PLANAR_STRUCTURE = {
  kind: "structure",
  projection: "planar",
  points: {
    p0: {
      kind: "corner",
      coordinates: [0, 0, 0],
    },
    p1: {
      kind: "corner",
      coordinates: [1, 0, 1],
    },
    p2: {
      kind: "corner",
      coordinates: [1, 1, 1],
    },
    p3: {
      kind: "corner",
      coordinates: [0, 1, 0],
    },
  },
  edges: {
    e0: {
      kind: "rake",
      points: ["p1", "p0"],
      properties: {
        length: 1.414,
      },
    },
    e1: {
      kind: "ridge",
      points: ["p1", "p2"],
      properties: {
        length: 1,
      },
    },
    e2: {
      kind: "rake",
      points: ["p3", "p2"],
      properties: {
        length: 1.414,
      },
    },
    e3: {
      kind: "eave",
      points: ["p0", "p3"],
      properties: {
        length: 1,
      },
    },
  },
  surfaces: {
    s0: {
      edges: [["e0", "e1", "e2", "e3"]],
      properties: {
        area: 1.414,
        pitch: 1,
        material: "asphalt",
      },
    },
  },
};
