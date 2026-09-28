import corporateServicesScene from "../assets/service-scenes/scene1.svg";
import cityToursScene from "../assets/service-scenes/scene2.svg";
import eventTransportScene from "../assets/service-scenes/scene3.svg";
import airportTransferScene from "../assets/service-scenes/scene4.svg";
import corporateServicesLightBase from "../assets/service-scenes/scene1-light-base.svg";
import corporateServicesLightColored from "../assets/service-scenes/scene1-light.svg";
import cityToursLightBase from "../assets/service-scenes/scene2-light-base.svg";
import cityToursLightColored from "../assets/service-scenes/scene2-light.svg";
import eventTransportLightBase from "../assets/service-scenes/scene3-light-base.svg";
import eventTransportLightColored from "../assets/service-scenes/scene3-light.svg";
import airportTransferLightBase from "../assets/service-scenes/scene4-light-base.svg";
import airportTransferLightColored from "../assets/service-scenes/scene4-light.svg";

// TODO(api): replace with GET /api/services
export const limoServices = [
  {
    id: "corporate-services",
    title: "Corporate Services",
    description: "Reliable Rides For Professionals.",
    illustration: corporateServicesScene,
    // Light mode: base art, and the colored version shown while the
    // connector ring is over the scene.
    lightIllustration: corporateServicesLightBase,
    lightColoredIllustration: corporateServicesLightColored,
    // Figma (1440 frame, relative to the section's top-left)
    layout: {
      image: { top: 250, left: 70, width: 511.82, height: 332.83 },
      title: { top: 370, left: 809, width: 244, height: 102 },
      description: { top: 410, left: 809, width: 237.6, height: 61, lineHeight: "120%" },
    },
  },
  {
    id: "city-tours",
    title: "City Tours",
    description: "Explore In Comfort And Style.",
    illustration: cityToursScene,
    lightIllustration: cityToursLightBase,
    lightColoredIllustration: cityToursLightColored,
    // The colored export is 554x481 (base 466x386) with the drawing offset by
    // (21,38) — this box, in % of the base, lines the two drawings up.
    lightColoredFrame: { left: -4.51, top: -9.84, width: 118.88, height: 124.61 },
    layout: {
      image: { top: 512, left: 820, width: 465.26, height: 385.21 },
      title: { top: 704, left: 182, width: 130, height: 30 },
      description: { top: 745, left: 182, width: 400, height: 25 },
    },
  },
  {
    id: "event-transport",
    title: "Event Transport",
    description: "Luxury For Special Occasions.",
    illustration: eventTransportScene,
    lightIllustration: eventTransportLightBase,
    lightColoredIllustration: eventTransportLightColored,
    layout: {
      image: { top: 928, left: 13, width: 569.17, height: 323.04 },
      title: { top: 1048, left: 809, width: 244, height: 102 },
      description: { top: 1088, left: 829, width: 237.6, height: 61, lineHeight: "120%" },
    },
  },
  {
    id: "airport-transfer",
    title: "Airport Transfer",
    description: "Punctual And Hassle-Free Travel.",
    illustration: airportTransferScene,
    lightIllustration: airportTransferLightBase,
    // The base export is 619x362 (colored 619x339) with the same drawing
    // from the top-left; the extra 23px run below the scene box.
    lightBaseFrame: { left: 0, top: 0, width: 100, height: 106.78 },
    lightColoredIllustration: airportTransferLightColored,
    layout: {
      image: { top: 1235, left: 809, width: 618.69, height: 338.7 },
      title: { top: 1427, left: 172, width: 230, height: 30 },
      description: { top: 1468, left: 184, width: 400, height: 25 },
    },
  },
];
