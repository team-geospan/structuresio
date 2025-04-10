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

import { beforeEach, describe, it, expect } from "vitest";

import { summarizeSurfaceMaterials, summarizeEdges } from "../lib/summary.js";
import { BASIC_PLANAR_STRUCTURE } from "./fixtures/basic.js";

describe("Summarizes the structure", () => {
  let collection;

  beforeEach(() => {
    collection = {
      type: "structurecollection",
      structures: [BASIC_PLANAR_STRUCTURE],
    };
  });

  it("Summarizes edges", () => {
    const edgeSummary = summarizeEdges(collection);
    expect(edgeSummary).toEqual({
      ridge: 1,
      eave: 1,
      rake: 1.414 * 2,
    });
  });

  it("Summarizes edges and flattens it", () => {
    const edgeSummary = summarizeEdges(collection, true);
    // sort by edge types for predictability
    edgeSummary.sort((a, b) => {
      return a[0] < b[0] ? -1 : 1;
    });
    expect(edgeSummary).toEqual([
      ["eave", 1],
      ["rake", 1.414 * 2],
      ["ridge", 1],
    ]);
  });

  it("Summarizes surface materials", () => {
    const summary = summarizeSurfaceMaterials(collection);
    expect(summary).toEqual({
      asphalt: {
        [1]: 1.414,
      },
    });
  });

  it("Summarizes surface materials and flattens it", () => {
    const summary = summarizeSurfaceMaterials(collection, true);
    expect(summary).toEqual([["asphalt", "1", 1.414]]);
  });
});
