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
 * @module/structuresio/summary
 * Summarize StructuresJSON into table friendly data structures.
 */

const flattenMaterialSummary = (summary) => {
  const flat = [];
  Object.keys(summary).forEach((material) => {
    Object.keys(summary[material]).forEach((pitch) => {
      flat.push([material, pitch, summary[material][pitch]]);
    });
  });
  return flat;
};

export const summarizeSurfaceMaterials = (collection, flatten = false) => {
  const summary = {};

  collection.structures.forEach((structure) => {
    Object.values(structure.surfaces).forEach((surface) => {
      const p = surface.properties || {};
      // default the material and pitch to an empty string if it is not defined.
      const [material, pitch] = [p.material || "", p.pitch || ""];
      // add the area to the material/pitch combination
      summary[material] = summary[material] || {};
      summary[material][pitch] = (summary[material][pitch] || 0) + p.area;
    });
  });

  if (flatten) {
    return flattenMaterialSummary(summary);
  }

  return summary;
};

export const summarizeEdges = (collection, flatten = false) => {
  const summary = {};
  collection.structures.forEach((structure) => {
    Object.values(structure.edges).forEach((edge) => {
      const kind = edge.kind || "";
      summary[kind] =
        (summary[kind] || 0) +
        ((edge.properties && edge.properties.length) || 0);
    });
  });

  if (flatten) {
    return Object.keys(summary).map((key) => [key, summary[key]]);
  }

  return summary;
};
