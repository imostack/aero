export interface Product {
  id: string;
  name: string;
  description: string;
  specs?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  products: Product[];
}

export const categories: Category[] = [
  {
    id: "valves",
    name: "Valves",
    slug: "valves",
    description:
      "Full range of industrial valves engineered for upstream and downstream oil & gas applications. Available in multiple pressure ratings, end connections, and materials.",
    icon: "⚙️",
    products: [
      {
        id: "gate-valves",
        name: "Gate Valves",
        description:
          "API 6A & 6D gate valves for isolation service. Available in full-bore and reduced-bore configurations.",
        specs: ["Class 150–2500", "2\" – 56\"", "Carbon steel, SS, Duplex"],
      },
      {
        id: "ball-valves",
        name: "Ball Valves",
        description:
          "Floating and trunnion-mounted ball valves for on/off and throttling service.",
        specs: ["ANSI Class 150–2500", "½\" – 60\"", "API 6D compliant"],
      },
      {
        id: "globe-valves",
        name: "Globe Valves",
        description:
          "Globe valves for flow regulation in process pipelines, refineries, and petrochemical plants.",
        specs: ["Class 150–2500", "½\" – 24\"", "API 600 / BS 1873"],
      },
      {
        id: "check-valves",
        name: "Check Valves",
        description:
          "Swing, piston, and dual-plate check valves to prevent backflow in high-pressure lines.",
        specs: ["Class 150–2500", "½\" – 60\"", "API 594 / API 6D"],
      },
      {
        id: "butterfly-valves",
        name: "Butterfly Valves",
        description:
          "High-performance and double-eccentric butterfly valves for large-diameter pipelines.",
        specs: ["Class 150–600", "2\" – 96\"", "API 609"],
      },
      {
        id: "safety-relief-valves",
        name: "Safety & Relief Valves",
        description:
          "Pressure relief and safety valves for overpressure protection across all process systems.",
        specs: ["API 526", "ASME Section VIII", "Spring & pilot-operated"],
      },
      {
        id: "needle-valves",
        name: "Needle Valves",
        description:
          "Precision needle valves for instrumentation and small-bore flow control applications.",
        specs: ["Up to 20,000 psi", "SS 316 / Inconel", "NPT & socket weld"],
      },
      {
        id: "plug-valves",
        name: "Plug Valves",
        description:
          "Lubricated and non-lubricated plug valves ideal for pipeline and wellhead isolation.",
        specs: ["Class 150–900", "1\" – 16\"", "API 6D"],
      },
    ],
  },
  {
    id: "wellhead",
    name: "Wellhead & Christmas Tree Equipment",
    slug: "wellhead",
    description:
      "Complete wellhead systems, Christmas trees, and associated components for oil and gas well control and production.",
    icon: "🛢️",
    products: [
      {
        id: "wellhead-systems",
        name: "Wellhead Systems",
        description:
          "Casing heads, tubing heads, and complete wellhead assemblies to API 6A specifications.",
        specs: ["API 6A", "2,000–20,000 psi WP", "PR1 & PR2"],
      },
      {
        id: "christmas-trees",
        name: "Christmas Trees",
        description:
          "Vertical and horizontal Christmas tree configurations for onshore and offshore wells.",
        specs: ["API 6A", "Single & dual bore", "3,000–15,000 psi"],
      },
      {
        id: "tubing-hangers",
        name: "Tubing Hangers",
        description:
          "Mandrel and slip-type tubing hangers for secure tubing string suspension.",
        specs: ["API 6A", "Various bore sizes", "H2S service available"],
      },
      {
        id: "casing-hangers",
        name: "Casing Hangers",
        description:
          "Slip and mandrel casing hangers for surface and sub-surface casing string support.",
        specs: ["API 6A", "API 11D1", "Multiple casing sizes"],
      },
      {
        id: "bop-components",
        name: "BOP & Well Control Components",
        description:
          "Blowout preventer wear parts, ram assemblies, and well control accessories.",
        specs: ["API 16A / 16C", "Annular & ram type", "5,000–15,000 psi"],
      },
    ],
  },
  {
    id: "flanges-fittings",
    name: "Flanges & Fittings",
    slug: "flanges-fittings",
    description:
      "ASME and API standard flanges, pipe fittings, and forged components for all pressure classes and service environments.",
    icon: "🔩",
    products: [
      {
        id: "weld-neck-flanges",
        name: "Weld Neck Flanges",
        description:
          "Forged weld neck flanges in all pressure classes for high-pressure, high-temperature service.",
        specs: ["ASME B16.5 / B16.47", "Class 150–2500", "½\" – 60\""],
      },
      {
        id: "slip-on-flanges",
        name: "Slip-On Flanges",
        description:
          "Slip-on flanges for general service applications where cost efficiency is a priority.",
        specs: ["ASME B16.5", "Class 150–600", "½\" – 24\""],
      },
      {
        id: "blind-flanges",
        name: "Blind Flanges",
        description:
          "Blind flanges for pipeline isolation and pressure testing end closures.",
        specs: ["ASME B16.5", "Class 150–2500", "All standard sizes"],
      },
      {
        id: "orifice-flanges",
        name: "Orifice Flanges",
        description:
          "Orifice flange sets with tapped holes for accurate differential pressure flow measurement.",
        specs: ["ASME B16.36", "Class 300–2500", "½\" – 16\""],
      },
      {
        id: "pipe-fittings",
        name: "Pipe Fittings",
        description:
          "Buttweld and socket weld elbows, tees, reducers, caps, and crosses.",
        specs: ["ASME B16.9 / B16.11", "SCH 40 – SCH 160 / XXH", "½\" – 60\""],
      },
      {
        id: "forged-fittings",
        name: "Forged Fittings",
        description:
          "High-pressure forged steel fittings for instrumentation and small-bore process lines.",
        specs: ["ASME B16.11", "3,000–9,000 lb", "Socket weld & threaded"],
      },
      {
        id: "rtj-flanges",
        name: "Ring Type Joint (RTJ) Flanges",
        description:
          "RTJ flanges with octagonal and oval grooves for high-pressure sealing applications.",
        specs: ["API 6A / ASME B16.20", "Class 900–2500", "Carbon steel & alloy"],
      },
    ],
  },
  {
    id: "pipes-tubing",
    name: "Pipes, Casing & Tubing",
    slug: "pipes-tubing",
    description:
      "API and ASME-certified line pipe, casing, drill pipe, and production tubing for drilling, completion, and gathering operations.",
    icon: "🔧",
    products: [
      {
        id: "line-pipe",
        name: "Line Pipe",
        description:
          "Seamless and ERW line pipe to API 5L for oil and gas transmission and gathering.",
        specs: ["API 5L PSL1 & PSL2", "Grades X42–X80", "2\" – 48\" OD"],
      },
      {
        id: "casing",
        name: "Casing",
        description:
          "Surface, intermediate, production, and liner casing strings per API 5CT.",
        specs: ["API 5CT", "H40 – P110 grades", "4½\" – 20\""],
      },
      {
        id: "production-tubing",
        name: "Production Tubing",
        description:
          "Seamless production tubing with EUE, NUE, and premium connections.",
        specs: ["API 5CT", "J55, L80, P110", "1.050\" – 4½\""],
      },
      {
        id: "drill-pipe",
        name: "Drill Pipe",
        description:
          "New and reconditioned drill pipe for rotary drilling operations.",
        specs: ["API 5DP", "Grade E, X, G, S", "2⅜\" – 6⅝\""],
      },
      {
        id: "stainless-pipes",
        name: "Stainless & Alloy Pipes",
        description:
          "Stainless steel, duplex, and nickel alloy pipes for corrosive and high-temperature environments.",
        specs: ["ASME A312 / A790", "SS 304/316, Duplex 2205", "Seamless & welded"],
      },
    ],
  },
  {
    id: "pressure-control",
    name: "Pressure & Flow Control",
    slug: "pressure-control",
    description:
      "Chokes, regulators, and control valves for managing flow rates and pressures across wellheads, manifolds, and process systems.",
    icon: "📊",
    products: [
      {
        id: "adjustable-chokes",
        name: "Adjustable Chokes",
        description:
          "Positive and adjustable wellhead chokes for production flow rate control.",
        specs: ["API 6A", "2,000–15,000 psi", "1/64\" – 64/64\" bean size"],
      },
      {
        id: "control-valves",
        name: "Control Valves",
        description:
          "Pneumatic and electric actuated control valves for automated process management.",
        specs: ["ANSI Class 150–600", "Globe & rotary type", "Fail-safe options"],
      },
      {
        id: "pressure-regulators",
        name: "Pressure Regulators",
        description:
          "Back-pressure and pressure-reducing regulators for gas and liquid applications.",
        specs: ["Up to 10,000 psi", "SS & carbon steel", "Direct & pilot-operated"],
      },
      {
        id: "manifolds",
        name: "Flowline Manifolds",
        description:
          "Production, test, and injection manifolds for multi-well field gathering systems.",
        specs: ["API 6A", "Custom configurations", "Skid-mounted available"],
      },
    ],
  },
  {
    id: "flow-measurement",
    name: "Flow Measurement & Instrumentation",
    slug: "flow-measurement",
    description:
      "Metering systems, flow meters, gauges, and sensors for accurate measurement and monitoring throughout oil and gas operations.",
    icon: "📡",
    products: [
      {
        id: "turbine-meters",
        name: "Turbine Flow Meters",
        description:
          "High-accuracy turbine meters for custody transfer and allocation metering of liquids and gas.",
        specs: ["AGA-7 / API 5.3", "±0.5% accuracy", "2\" – 16\""],
      },
      {
        id: "ultrasonic-meters",
        name: "Ultrasonic Flow Meters",
        description:
          "Multi-path ultrasonic gas and liquid flow meters for fiscal metering.",
        specs: ["AGA-9 / API 5.8", "No moving parts", "2\" – 48\""],
      },
      {
        id: "orifice-plates",
        name: "Orifice Plates & Meters",
        description:
          "Orifice plates, meter runs, and conditioning orifice flow meters.",
        specs: ["AGA-3 / ISO 5167", "Paddle & senior type", "Custom bore sizes"],
      },
      {
        id: "pressure-transmitters",
        name: "Pressure Transmitters & Gauges",
        description:
          "Pressure transducers, transmitters, and mechanical gauges for process monitoring.",
        specs: ["4–20 mA / HART", "0–60,000 psi range", "SIL 2 rated options"],
      },
      {
        id: "level-gauges",
        name: "Level Gauges & Sensors",
        description:
          "Reflex, transparent, and magnetic level gauges plus radar and ultrasonic level sensors.",
        specs: ["ASME B40.200", "Various process connections", "Explosion-proof"],
      },
      {
        id: "temperature-sensors",
        name: "Temperature Sensors",
        description:
          "RTDs, thermocouples, and thermowells for temperature measurement in process applications.",
        specs: ["-200°C to 1200°C", "PT100 / Type K, J", "Sanitary & industrial"],
      },
    ],
  },
  {
    id: "pumps-compressors",
    name: "Pumps & Compressors",
    slug: "pumps-compressors",
    description:
      "Centrifugal, reciprocating, and rotary pumps plus gas compressors and associated parts for fluid transfer and gas handling.",
    icon: "🔄",
    products: [
      {
        id: "centrifugal-pumps",
        name: "Centrifugal Pumps",
        description:
          "API 610 centrifugal pumps for crude transfer, water injection, and process service.",
        specs: ["API 610 (OH2, BB1–BB5)", "Up to 5,000 m³/hr", "Up to 200 bar"],
      },
      {
        id: "reciprocating-pumps",
        name: "Reciprocating Pumps",
        description:
          "Duplex and triplex plunger pumps for high-pressure injection and chemical dosing.",
        specs: ["API 674", "Up to 1,000 bar", "Ceramic & steel plungers"],
      },
      {
        id: "submersible-pumps",
        name: "Submersible Pumps",
        description:
          "Electric submersible pumps (ESP) and downhole pump systems for artificial lift.",
        specs: ["API 11S series", "Various HP ratings", "High GOR tolerant"],
      },
      {
        id: "pump-spares",
        name: "Pump Spare Parts",
        description:
          "Mechanical seals, impellers, wear rings, shaft sleeves, and bearing assemblies.",
        specs: ["OEM compatible", "SS & alloy options", "Rapid supply"],
      },
      {
        id: "gas-compressors",
        name: "Gas Compressor Parts",
        description:
          "Compressor valves, piston rings, packing sets, and cylinder components.",
        specs: ["API 618 / API 11P", "Reciprocating & screw type", "OEM cross-reference"],
      },
    ],
  },
  {
    id: "safety-equipment",
    name: "Safety & Pressure Protection",
    slug: "safety-equipment",
    description:
      "Certified safety systems, emergency shutdown devices, and protective equipment for personnel and asset safety.",
    icon: "🛡️",
    products: [
      {
        id: "pressure-safety-valves",
        name: "Pressure Safety Valves (PSV)",
        description:
          "Spring-loaded and pilot-operated PSVs for vessel, pipeline, and equipment overpressure protection.",
        specs: ["API 526 / ASME VIII", "PN20–PN420", "Conventional & balanced"],
      },
      {
        id: "rupture-discs",
        name: "Rupture Discs",
        description:
          "Bursting discs and holders for single-use, rapid-response overpressure relief.",
        specs: ["ASME VIII / ISO 6718", "Tension & compression-loaded", "Custom burst pressures"],
      },
      {
        id: "emergency-shutdown",
        name: "Emergency Shutdown Valves (ESD)",
        description:
          "Fail-safe actuated ESD valves for rapid isolation during emergency events.",
        specs: ["API 6D / SIL 2–3", "Pneumatic & hydraulic", "Fire-safe BS 6755"],
      },
      {
        id: "gas-detectors",
        name: "Gas Detection Systems",
        description:
          "Fixed and portable gas detectors for H₂S, LEL, CO, and O₂ monitoring.",
        specs: ["ATEX / IECEx certified", "4–20 mA & digital output", "Catalytic & IR type"],
      },
      {
        id: "ppe",
        name: "Personal Protective Equipment",
        description:
          "Hard hats, FR coveralls, safety boots, breathing apparatus, and H₂S escape kits.",
        specs: ["ANSI / EN certified", "Bulk supply available", "Custom branding"],
      },
    ],
  },
  {
    id: "seals-gaskets",
    name: "Seals, Gaskets & Packing",
    slug: "seals-gaskets",
    description:
      "High-performance sealing solutions for flanged joints, valve stems, rotating equipment, and high-pressure connections.",
    icon: "🔗",
    products: [
      {
        id: "ring-joint-gaskets",
        name: "Ring Joint Gaskets (RJ/RTJ)",
        description:
          "Oval and octagonal ring joint gaskets for high-pressure flange connections.",
        specs: ["API 6A / ASME B16.20", "Soft iron, CS, SS, Inconel", "R, RX, BX profiles"],
      },
      {
        id: "spiral-wound-gaskets",
        name: "Spiral Wound Gaskets",
        description:
          "Spiral wound metallic gaskets with various filler materials for raised face flanges.",
        specs: ["ASME B16.20", "304/316 SS + Graphite/PTFE", "All ASME pressure classes"],
      },
      {
        id: "mechanical-seals",
        name: "Mechanical Seals",
        description:
          "Single, double, and tandem mechanical seals for centrifugal pumps and compressors.",
        specs: ["API 682", "Cartridge & component type", "SS, Tungsten Carbide, SiC"],
      },
      {
        id: "valve-packing",
        name: "Valve Stem Packing",
        description:
          "Graphite, PTFE, and braided packing for valve stem sealing in all service conditions.",
        specs: ["API 622 / API 624", "Low-emission certified", "Pre-formed rings & bulk"],
      },
      {
        id: "orings-seals",
        name: "O-Rings & Elastomeric Seals",
        description:
          "Elastomeric O-rings, backup rings, and custom molded seals in all standard compounds.",
        specs: ["Nitrile, Viton, EPDM, HNBR", "AS568 / metric", "Sour service grades"],
      },
    ],
  },
  {
    id: "structural-hardware",
    name: "Structural & Fasteners",
    slug: "structural-hardware",
    description:
      "High-strength fasteners, bolting, and structural hardware certified for critical flange joints and pressure vessel assemblies.",
    icon: "🏗️",
    products: [
      {
        id: "stud-bolts",
        name: "Stud Bolts & Nuts",
        description:
          "Fully threaded stud bolts with heavy hex nuts for high-pressure flange assemblies.",
        specs: ["ASME B16.5 / B7 / B7M", "A193 B7 & B8 grades", "Alloy steel & SS"],
      },
      {
        id: "flange-bolts",
        name: "Flange Bolts & Cap Screws",
        description:
          "Machine bolts and hex cap screws for low-pressure class 150–300 flange applications.",
        specs: ["ASME B18.2.1", "Grade 2H & 2HM nuts", "Hot-dip galvanized available"],
      },
      {
        id: "pipe-clamps",
        name: "Pipe Clamps & Supports",
        description:
          "Constant and variable spring hangers, pipe clamps, u-bolts, and saddles.",
        specs: ["MSS SP-58", "Carbon steel & stainless", "Custom load ratings"],
      },
    ],
  },
];

export const getCategoryBySlug = (slug: string): Category | undefined =>
  categories.find((c) => c.slug === slug);
