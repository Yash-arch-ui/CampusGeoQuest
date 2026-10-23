export type Station = {
  id: number;
  qrToken: string;
  questionHint: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  nextHint: string;
};

export const START_HINT = "Your first code is Station 01 — watch for the trail marker.";

const nextStationHint = (id: number) =>
  id >= 10
    ? "You've reached the last station. Submit your trail."
    : `Station ${String(id + 1).padStart(2, "0")} — location to be announced.`;

/**
 * Numbered station map: 01–10. Locations are intentionally left out until the
 * route is finalised — only the station number and its QR token matter today.
 */
export const STATIONS: Station[] = [
  {
    id: 1,
    qrToken: "GEOQUEST:ST-01",
    questionHint: "This layer is liquid metal and drives Earth's magnetic field.",
    question: "Which layer of the Earth is liquid?",
    options: ["Crust", "Mantle", "Outer core", "Inner core"],
    correctIndex: 2,
    nextHint: nextStationHint(1),
  },
  {
    id: 2,
    qrToken: "GEOQUEST:ST-02",
    questionHint: "Anticlines and synclines are two kinds of this structure.",
    question: "What is a bend in rock layers called?",
    options: ["Fault", "Fold", "Joint", "Vein"],
    correctIndex: 1,
    nextHint: nextStationHint(2),
  },
  {
    id: 3,
    qrToken: "GEOQUEST:ST-03",
    questionHint: "Granite and basalt are examples.",
    question: "Which rock type forms from cooled magma or lava?",
    options: ["Sedimentary", "Metamorphic", "Igneous", "Organic"],
    correctIndex: 2,
    nextHint: nextStationHint(3),
  },
  {
    id: 4,
    qrToken: "GEOQUEST:ST-04",
    questionHint: "It represents missing time in the rock record.",
    question: "What does an unconformity represent?",
    options: [
      "A gap in the rock record",
      "A type of fault",
      "A mineral vein",
      "A volcanic eruption",
    ],
    correctIndex: 0,
    nextHint: nextStationHint(4),
  },
  {
    id: 5,
    qrToken: "GEOQUEST:ST-05",
    questionHint: "It is named after a seismologist.",
    question: "Which scale measures earthquake magnitude?",
    options: ["Mohs", "Richter", "Beaufort", "Vickers"],
    correctIndex: 1,
    nextHint: nextStationHint(5),
  },
  {
    id: 6,
    qrToken: "GEOQUEST:ST-06",
    questionHint: "It is thin, rocky, and on the outside.",
    question: "What is the outermost layer of the Earth called?",
    options: ["Crust", "Mantle", "Outer core", "Moho"],
    correctIndex: 0,
    nextHint: nextStationHint(6),
  },
  {
    id: 7,
    qrToken: "GEOQUEST:ST-07",
    questionHint: "Water, wind, and temperature all do it.",
    question: "Which process breaks rock into smaller pieces?",
    options: ["Metamorphism", "Weathering", "Foliation", "Subduction"],
    correctIndex: 1,
    nextHint: nextStationHint(7),
  },
  {
    id: 8,
    qrToken: "GEOQUEST:ST-08",
    questionHint: "Tectonic ___ move a few centimetres a year.",
    question: "What are the giant slow-moving pieces of Earth's crust called?",
    options: ["Plates", "Strata", "Folds", "Dikes"],
    correctIndex: 0,
    nextHint: nextStationHint(8),
  },
  {
    id: 9,
    qrToken: "GEOQUEST:ST-09",
    questionHint: "Life leaves a signature in stone.",
    question: "What is a fossil?",
    options: [
      "A mineral crystal",
      "Preserved evidence of past life",
      "A type of igneous rock",
      "A seismic wave",
    ],
    correctIndex: 1,
    nextHint: nextStationHint(9),
  },
  {
    id: 10,
    qrToken: "GEOQUEST:ST-10",
    questionHint: "It uses gravity, magnetism, and seismic waves.",
    question: "Which branch of study covers Earth's physical processes?",
    options: ["Geology", "Geophysics", "Geography", "Geometry"],
    correctIndex: 1,
    nextHint: nextStationHint(10),
  },
];
