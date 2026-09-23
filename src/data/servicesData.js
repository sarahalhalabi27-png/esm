import corporateServicesScene from "../assets/service-scenes/scene1.svg";
import cityToursScene from "../assets/service-scenes/scene2.svg";
import eventTransportScene from "../assets/service-scenes/scene3.svg";
import airportTransferScene from "../assets/service-scenes/scene4.svg";

// TODO(api): replace with GET /api/services
export const limoServices = [
  {
    id: "corporate-services",
    title: "Corporate Services",
    description: "Reliable Rides For Professionals.",
    illustration: corporateServicesScene,
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
    layout: {
      image: { top: 1235, left: 809, width: 618.69, height: 338.7 },
      title: { top: 1427, left: 172, width: 230, height: 30 },
      description: { top: 1468, left: 184, width: 400, height: 25 },
    },
  },
];
