// Normalizes a set of absolutely-positioned layers (in arbitrary px units)
// into percentage-based coordinates plus the bounding box's aspect ratio,
// so LayeredGraphicStage can render them responsively within any container.
export function buildLayerLayout(rawLayers) {
  const minLeft = Math.min(...rawLayers.map((l) => l.left));
  const minTop = Math.min(...rawLayers.map((l) => l.top));
  const maxRight = Math.max(...rawLayers.map((l) => l.left + l.width));
  const maxBottom = Math.max(...rawLayers.map((l) => l.top + l.height));
  const boxWidth = maxRight - minLeft;
  const boxHeight = maxBottom - minTop;

  const layers = rawLayers.map((l) => ({
    ...l,
    top: ((l.top - minTop) / boxHeight) * 100,
    left: ((l.left - minLeft) / boxWidth) * 100,
    width: (l.width / boxWidth) * 100,
    height: (l.height / boxHeight) * 100,
  }));

  return {
    layers,
    aspectRatio: `${boxWidth} / ${boxHeight}`,
    box: { left: minLeft, top: minTop, width: boxWidth, height: boxHeight },
  };
}
