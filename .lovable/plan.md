
# Plan: Fix Section Label Alignment on Venue Maps

## Problem Identified
The section labels are rendered as HTML overlay elements positioned using raw SVG coordinates from `getBBox()`. However, these SVG user-space coordinates (from viewBox like `0 0 2983 2775`) do not translate to screen pixels because:

1. SVG viewBox coordinates are in a different coordinate system than CSS pixels
2. The SVG uses `preserveAspectRatio` which scales/transforms the content
3. HTML overlays don't participate in SVG's coordinate transformations

## Solution
Inject section labels **directly into the SVG** as native `<text>` elements during the sanitization/processing phase, rather than rendering them as a separate HTML overlay. This ensures:
- Labels scale perfectly with the SVG
- Labels are positioned correctly using SVG's internal coordinate system
- Consistent appearance across all venue maps

## Technical Implementation

### 1. Modify `processedSVG` callback (InteractiveSVGMap.tsx)
- After removing existing text elements, calculate the center of each `g[data-section-id]` group
- Create new `<text>` elements positioned at the calculated centers
- Apply appropriate font sizing based on section dimensions
- Add styling for readability (bold weight, stroke outline for contrast)

### 2. Remove HTML overlay label system
- Delete the `labels` state and the `useEffect` that computes label positions
- Remove the HTML overlay `div` that renders `labels.map(...)`

### 3. Label Styling
- Use `text-anchor: middle` and `dominant-baseline: central` for perfect centering
- Apply paint-order stroke for high contrast against any background
- Scale font size based on section bounding box dimensions

## Code Changes

```text
File: src/components/venue/InteractiveSVGMap.tsx

1. In processedSVG() callback - after removing text elements:
   - Get all section groups: svg.querySelectorAll('g[data-section-id]')
   - For each group:
     a. Calculate center using path/polygon bounding coordinates
     b. Create a <text> element with the short label
     c. Position at center with appropriate font size
     d. Append to the section group

2. Remove:
   - The SectionLabel type
   - The labels state
   - The useEffect that computes labels
   - The HTML overlay div for labels

3. Add CSS in the style element:
   .section-label {
     text-anchor: middle;
     dominant-baseline: central;
     font-weight: 700;
     fill: white;
     stroke: rgba(0,0,0,0.8);
     stroke-width: 2.5px;
     paint-order: stroke fill;
     pointer-events: none;
   }
```

## Helper Function for Bounding Box
Since `getBBox()` only works on rendered elements and we're in the parsing phase, calculate bounds from path/polygon coordinates directly by parsing the `d` attribute or `points` attribute to find min/max x/y values.

## Expected Outcome
- Labels appear centered within each section
- Labels scale proportionally with the map
- Consistent sizing across all venue maps
- High contrast readability with stroke outline
