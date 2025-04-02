# GEOSPAN StructuresIO

JavaScript utilities for working with the [StructuresJSON]() format.

## Installation

```
npm install @team-geospan/structuresio
```

## Getting Started

### Converting a StructuresJSON file to GeoJSON

```
import { toPolygonGeoJSON, toLineStringGeoJSON} from "@team-geospan/strutcuresio/geojson";
```

### Getting summary table information

```
import { summarizeSurfaceMaterials, summarizeEdges } from "@team-geospan/structuresio/summary";
import { toFeet, toSquareFeet } from "@team-geospan/structuresio/units";

function renderSummaryTable(collection) {
    const materialSummary = summarizeSurfaceMaterials(collection);
    const edgeSummary = summarizeEdges(collection);

    console.log("Material Summary");
    Object.keys(materialSummary).forEach(material => {
        Object.keys(materialSummary[material]).forEach(pitch => {
            console.log(material, pitch, toSquareFeet(materialSummary[material][pitch]));
        });
    });

    console.log("Edge Summary");
    Object.keys(edgeSummary).forEach(edgeType => {
        console.log(edgeType, toFeet(edgeSummary(edgeType));
    });
}
```

### Creating a waste table

```

import { summarizeSurfaceMaterials } from "@team-geospan/strutcuresio/summary";

function renderWasteTable(collection) {
    const wasteFactorPercentages = [5, 10, 15, 20, 25];
    const materialSummary = summarizeSurfaceMaterials(collection);

    // get the total square area for each material type
    const totalSquareArea = {};

    Object.keys(materialSummary).forEach(material => {
        totalSquareArea[material] = 0.0;
        Object.keys(materialSummary[material]).forEach(pitch => {
            totalSquareArea[material] += materialSummary[material][pitch];
        });
    });

    Object.keys(totalSquareArea).forEach(material => {
        console.log("Waste factors for:", material);
        wasteFactorPercentages.forEach(wasteFactor => {
            console.log(wasteFactor + "%", toSquareFeet((wasteFactor / 100 + 1) * totalSquareArea[material]));
        });
        console.log("");
    });
}
```
