export type FieldType = "text" | "textarea" | "select";

export interface RequestField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

export interface EquipmentGroup {
  slug: string;
  name: string;
  blurb: string;
}

export interface EquipmentCategory {
  slug: string;
  group: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  examples: string[];
  fields: RequestField[];
  /** Words a finder might type in the search bar. */
  keywords: string[];
  /** Shown as a quick-pick chip on the homepage. */
  featured?: boolean;
}

/* ------------------------------ field helpers ------------------------------ */

const text = (name: string, label: string, placeholder?: string, required = false): RequestField => ({
  name,
  label,
  type: "text",
  placeholder,
  required,
});

const select = (name: string, label: string, options: string[], required = false): RequestField => ({
  name,
  label,
  type: "select",
  options,
  required,
});

const scope = (placeholder = "Anything else that matters: standards, certification, crew, delivery, etc."): RequestField => ({
  name: "scope",
  label: "Scope / additional requirements",
  type: "textarea",
  placeholder,
});

/* --------------------------------- groups --------------------------------- */

export const equipmentGroups: EquipmentGroup[] = [
  { slug: "drilling", name: "Drilling & Well Construction", blurb: "Rigs, tools and services to drill and case the well." },
  { slug: "intervention", name: "Well Testing & Intervention", blurb: "Testing, wireline, coiled tubing and workover." },
  { slug: "production", name: "Production & Processing", blurb: "Surface facilities, power, compression and storage." },
  { slug: "marine", name: "Marine & Offshore", blurb: "Barges, vessels and subsea support." },
  { slug: "logistics", name: "Lifting, Transport & Site Support", blurb: "Cranes, haulage, earthmoving, camps and aviation." },
  { slug: "other", name: "Something else", blurb: "Not listed? Tell us what you need." },
];

/* ------------------------------- categories ------------------------------- */

export const equipmentCategories: EquipmentCategory[] = [
  /* ---- Drilling & Well Construction ---- */
  {
    slug: "drilling-rigs",
    group: "drilling",
    name: "Drilling Rigs",
    tagline: "Land, swamp and offshore rigs on lease",
    description: "Drilling rigs for exploration, appraisal and development wells.",
    icon: "🏗️",
    examples: ["Land rigs", "Swamp barge rigs", "Jack-up rigs", "Platform rigs"],
    keywords: ["rig", "drilling rig", "land rig", "swamp rig", "jack-up", "jackup", "platform rig"],
    fields: [
      select("rigType", "Rig type", ["Land rig", "Swamp barge rig", "Jack-up rig", "Platform rig", "Other"], true),
      text("ratedDepth", "Target depth / rig power", "e.g. 15,000 ft / 1,500 HP", true),
      text("wells", "Number of wells", "e.g. 2 wells"),
      scope("Top drive, mud system, pressure rating, crew, certification, etc."),
    ],
  },
  {
    slug: "drilling-tools",
    group: "drilling",
    name: "Drilling Tools & BHA",
    tagline: "Drill pipe, collars, jars, motors and fishing tools",
    description: "Rental drilling tools and bottom-hole assembly components.",
    icon: "🔩",
    examples: ["Drill pipe & HWDP", "Drill collars", "Stabilizers & reamers", "Jars & shock subs", "Mud motors", "Fishing tools"],
    keywords: ["drill pipe", "drillpipe", "collar", "hwdp", "stabilizer", "jar", "mud motor", "fishing", "bha", "drilling tool", "reamer"],
    fields: [
      select("toolType", "Tool type", ["Drill pipe / HWDP", "Drill collars", "Stabilizers & reamers", "Jars & shock subs", "Mud motors", "Fishing tools", "Other"], true),
      text("sizeGrade", "Size / grade / connection", "e.g. 5\" S-135 NC50", true),
      text("quantity", "Quantity", "e.g. 200 joints"),
      scope(),
    ],
  },
  {
    slug: "solids-control",
    group: "drilling",
    name: "Mud & Solids Control",
    tagline: "Shakers, centrifuges, mud pumps and mud tanks",
    description: "Mud systems and solids-control equipment for drilling operations.",
    icon: "🌀",
    examples: ["Shale shakers", "Centrifuges", "Mud pumps", "Mud tanks & agitators", "Degassers"],
    keywords: ["mud", "shaker", "centrifuge", "mud pump", "solids control", "degasser", "mud tank"],
    fields: [
      select("equipment", "Equipment", ["Shale shakers", "Centrifuges", "Mud pumps", "Mud tanks & agitators", "Degassers", "Full solids-control package", "Other"], true),
      text("capacity", "Capacity / mud type", "e.g. 1,000 gpm, oil-based mud"),
      text("quantity", "Quantity"),
      scope(),
    ],
  },
  {
    slug: "well-control",
    group: "drilling",
    name: "Well Control (BOP)",
    tagline: "BOP stacks, accumulators and choke manifolds",
    description: "Blowout preventers and well-control equipment.",
    icon: "🛡️",
    examples: ["BOP stacks", "Annular preventers", "Accumulator units", "Choke & kill manifolds", "Diverters"],
    keywords: ["bop", "blowout", "well control", "accumulator", "choke", "kill", "diverter", "annular"],
    fields: [
      select("equipment", "Equipment", ["BOP stack", "Annular preventer", "Accumulator unit", "Choke & kill manifold", "Diverter", "Other"], true),
      text("rating", "Size / pressure rating", "e.g. 13-5/8\" 10,000 psi", true),
      scope("Certification, H2S service, redress/testing requirements."),
    ],
  },
  {
    slug: "tubular-running",
    group: "drilling",
    name: "Tubular Running Equipment",
    tagline: "Casing running tools, power tongs, elevators",
    description: "Equipment for running casing and tubing.",
    icon: "🔧",
    examples: ["Casing running tools", "Power tongs", "Torque-turn systems", "Elevators & slips"],
    keywords: ["casing", "tong", "crt", "tubing running", "elevator", "slips", "torque turn"],
    fields: [
      select("equipment", "Equipment", ["Casing running tool (CRT)", "Power tongs", "Torque-turn system", "Elevators & slips", "Full running package with crew", "Other"], true),
      text("tubularSize", "Tubular size / grade", "e.g. 9-5/8\" P110"),
      scope(),
    ],
  },
  {
    slug: "directional-drilling",
    group: "drilling",
    name: "Directional Drilling & MWD/LWD",
    tagline: "Directional tools, MWD/LWD, gyro and mud logging",
    description: "Directional drilling and measurement-while-drilling tools and services.",
    icon: "🧭",
    examples: ["Directional drilling", "MWD / LWD", "Gyro surveys", "Mud logging units"],
    keywords: ["directional", "mwd", "lwd", "gyro", "mud logging", "survey", "steerable"],
    fields: [
      select("service", "Service / tool", ["Directional drilling", "MWD / LWD", "Gyro survey", "Mud logging", "Other"], true),
      text("holeSize", "Hole size / depth / well profile", "e.g. 12-1/4\" section, S-shaped"),
      scope(),
    ],
  },
  {
    slug: "cementing-pumping",
    group: "drilling",
    name: "Cementing & Pressure Pumping",
    tagline: "Cementing units, acidizing and hydrotest pumps",
    description: "Pumping equipment for cementing, stimulation and pressure testing.",
    icon: "🧱",
    examples: ["Cementing units", "Acidizing / stimulation pumps", "Hydrotest pumps", "Nitrogen pumping"],
    keywords: ["cement", "pumping", "acidizing", "stimulation", "hydrotest", "nitrogen", "frac"],
    fields: [
      select("equipment", "Equipment", ["Cementing unit", "Acidizing / stimulation pump", "Hydrotest pump", "Nitrogen pumping unit", "Other"], true),
      text("pressure", "Max pressure / rate", "e.g. 10,000 psi, 8 bpm"),
      scope(),
    ],
  },

  /* ---- Well Testing & Intervention ---- */
  {
    slug: "well-testing",
    group: "intervention",
    name: "Well Testing Equipment",
    tagline: "Surface well testing packages and associated equipment on lease",
    description:
      "Surface well testing packages for exploration, appraisal and production wells. Tell us the well conditions and the services you need, and we source availability and day rates from our vetted vendors.",
    icon: "🛢️",
    featured: true,
    examples: [
      "Surface well testing package",
      "Separators (2-phase / 3-phase)",
      "Choke manifolds",
      "Heat exchangers & steam generators",
      "Surge tanks & burners / booms",
      "Data acquisition systems",
    ],
    keywords: ["well test", "testing", "separator", "choke manifold", "flowback", "burner", "surge tank", "heat exchanger", "swt", "dst"],
    fields: [
      select("testType", "Type of test", ["Surface well testing (SWT)", "Flowback / clean-up", "Production test", "Extended well test (EWT)", "Other"], true),
      select("wellType", "Well type", ["Oil", "Gas", "Gas condensate", "HPHT", "Not sure"], true),
      text("maxPressure", "Max expected pressure (psi)", "e.g. 10,000 psi"),
      text("maxFlowRate", "Expected flow rate", "e.g. 5,000 bpd / 20 MMscfd"),
      select("h2s", "H2S / CO2 present?", ["No", "H2S", "CO2", "Both", "Unknown"]),
      {
        name: "equipmentNeeded",
        label: "Equipment / services required",
        type: "textarea",
        required: true,
        placeholder:
          "List the equipment or package you need (separator, choke manifold, burner, etc.), plus whether you need crew/operators.",
      },
    ],
  },
  {
    slug: "wireline",
    group: "intervention",
    name: "Wireline & Slickline",
    tagline: "Slickline, e-line and braided line units",
    description: "Wireline units and tools for well intervention and logging.",
    icon: "🪢",
    examples: ["Slickline units", "Electric line units", "Braided line units", "Pressure control equipment"],
    keywords: ["wireline", "slickline", "e-line", "eline", "braided", "logging"],
    fields: [
      select("unitType", "Unit type", ["Slickline", "Electric line", "Braided line", "Other"], true),
      text("operation", "Intended operation", "e.g. gauge run, perforating, plug setting", true),
      text("wellPressure", "Well pressure / depth", "e.g. 5,000 psi, 12,000 ft"),
      scope(),
    ],
  },
  {
    slug: "coiled-tubing",
    group: "intervention",
    name: "Coiled Tubing & Nitrogen",
    tagline: "Coiled tubing and nitrogen units",
    description: "Coiled tubing units and nitrogen pumping for intervention and clean-out.",
    icon: "🌀",
    examples: ["Coiled tubing units", "Nitrogen units", "Coil strings", "Pressure control equipment"],
    keywords: ["coiled tubing", "coil tubing", "ct unit", "nitrogen", "n2"],
    fields: [
      select("unit", "Unit", ["Coiled tubing unit", "Nitrogen unit", "Both", "Other"], true),
      text("coilSize", "Coil size / length", "e.g. 1-3/4\" x 20,000 ft"),
      scope("Planned operation, pressures, crew requirements."),
    ],
  },
  {
    slug: "workover-rigs",
    group: "intervention",
    name: "Workover & Snubbing Units",
    tagline: "Workover rigs, hoists and hydraulic workover units",
    description: "Rigs and units for well workover, recompletion and abandonment.",
    icon: "🏗️",
    examples: ["Workover rigs", "Well service rigs", "Hydraulic workover / snubbing units", "Hoists"],
    keywords: ["workover", "work over", "snubbing", "hwo", "well service", "hoist", "recompletion"],
    fields: [
      select("unit", "Unit type", ["Workover rig", "Well service rig", "Hydraulic workover / snubbing unit", "Hoist", "Other"], true),
      text("capacity", "Hook load / depth rating", "e.g. 250 klb, 12,000 ft"),
      scope("Number of wells, crew, accommodation, ancillary equipment."),
    ],
  },

  /* ---- Production & Processing ---- */
  {
    slug: "mobile-production",
    group: "production",
    name: "Mobile Production Units",
    tagline: "Early production facilities, separators and heater treaters",
    description: "Portable production and processing facilities.",
    icon: "🏭",
    examples: ["Early production facilities", "Production separators", "Heater treaters", "Flare & burner packages"],
    keywords: ["production", "epf", "early production", "heater treater", "flare", "separator", "processing"],
    fields: [
      select("equipment", "Equipment", ["Early production facility", "Production separators", "Heater treater", "Flare / burner", "Other"], true),
      text("throughput", "Throughput", "e.g. 10,000 bpd oil, 15 MMscfd gas"),
      scope(),
    ],
  },
  {
    slug: "gas-compression",
    group: "production",
    name: "Gas Compression & Treatment",
    tagline: "Gas compressors, boosters and dehydration units",
    description: "Compression and gas treatment equipment.",
    icon: "💨",
    examples: ["Gas compressors", "Booster compressors", "Dehydration units", "Gas treatment packages"],
    keywords: ["compressor", "compression", "gas booster", "dehydration", "dehydrator", "gas treatment"],
    fields: [
      select("equipment", "Equipment", ["Gas compressor", "Booster compressor", "Dehydration unit", "Other"], true),
      text("flow", "Flow rate and pressures", "e.g. 10 MMscfd, 100 → 1,000 psi", true),
      select("driver", "Driver", ["Gas engine", "Electric motor", "Either"]),
      scope(),
    ],
  },
  {
    slug: "power-generation",
    group: "production",
    name: "Power Generation",
    tagline: "Diesel and gas generators, turbines and light towers",
    description: "Temporary and standby power for drilling, production and camps.",
    icon: "⚡",
    featured: true,
    examples: ["Diesel generators", "Gas generators", "Gas turbines", "Light towers"],
    keywords: ["generator", "genset", "power", "turbine", "light tower", "kva", "mw"],
    fields: [
      select("equipment", "Equipment", ["Diesel generator", "Gas generator", "Gas turbine", "Light tower", "Other"], true),
      text("rating", "Rating", "e.g. 500 kVA, 3 units", true),
      select("duty", "Duty", ["Prime", "Standby", "Not sure"]),
      scope("Voltage, fuel supply, hazardous-area rating, operators."),
    ],
  },
  {
    slug: "storage-tanks",
    group: "production",
    name: "Tanks & Storage",
    tagline: "Frac tanks, skid tanks and bunded fuel tanks",
    description: "Temporary storage for fluids and fuel.",
    icon: "🛢️",
    examples: ["Frac tanks", "Skid tanks", "Bunded fuel tanks", "Mud tanks"],
    keywords: ["tank", "frac tank", "storage", "fuel tank", "skid tank", "bunded"],
    fields: [
      select("equipment", "Tank type", ["Frac tank", "Skid tank", "Bunded fuel tank", "Mud tank", "Other"], true),
      text("capacity", "Capacity and quantity", "e.g. 500 bbl x 6", true),
      scope("Product stored, heating, certification."),
    ],
  },
  {
    slug: "pipeline-equipment",
    group: "production",
    name: "Pipeline & Flowline Equipment",
    tagline: "Hydrotest, pigging and pipelay equipment",
    description: "Equipment for pipeline and flowline construction and commissioning.",
    icon: "🧵",
    examples: ["Hydrotest packages", "Pigging equipment", "Side-booms & pipelayers", "Welding units"],
    keywords: ["pipeline", "flowline", "pigging", "pig", "hydrotest", "pipelay", "side boom", "welding"],
    fields: [
      select("equipment", "Equipment", ["Hydrotest package", "Pigging equipment", "Side-boom / pipelayer", "Welding unit", "Other"], true),
      text("pipeSize", "Pipe size / length", "e.g. 12\" x 8 km"),
      scope(),
    ],
  },

  /* ---- Marine & Offshore ---- */
  {
    slug: "barges",
    group: "marine",
    name: "Barges",
    tagline: "Deck, accommodation, crane and storage barges for lease",
    description:
      "Marine barges for offshore, swamp and inland-water operations. Tell us the job, the capacity you need and where it will operate, and we source availability and day rates from our vendors.",
    icon: "🚢",
    featured: true,
    examples: [
      "Flat-top / deck barges",
      "Accommodation barges",
      "Crane barges",
      "Tank / storage barges",
      "Swamp & shallow-water barges",
      "Pipelay / support barges",
    ],
    keywords: ["barge", "deck barge", "flat top", "flat-top", "accommodation barge", "crane barge", "swamp barge"],
    fields: [
      select("bargeType", "Barge type", ["Deck / flat-top barge", "Accommodation barge", "Crane barge", "Tank / storage barge", "Swamp / shallow-water barge", "Other"], true),
      text("capacity", "Capacity / deck load", "e.g. 2,000 DWT or 1,500 t deck load", true),
      text("dimensions", "Minimum dimensions / draft", "e.g. 60m x 18m, max draft 2.5m"),
      text("operatingArea", "Operating area / water depth", "e.g. Bonny River, 6m water depth", true),
      select("crewRequired", "Crew / tug required?", ["Bareboat (no crew)", "With crew", "With crew and tug", "Not sure"]),
      {
        name: "scope",
        label: "Scope of work / additional requirements",
        type: "textarea",
        placeholder:
          "Describe the job, cargo, certification needed (class, flag, etc.), crane capacity, accommodation numbers, etc.",
      },
    ],
  },
  {
    slug: "offshore-vessels",
    group: "marine",
    name: "Offshore Support Vessels",
    tagline: "Tugs, AHTS, PSVs, FSVs and crew boats",
    description: "Support vessels for offshore and inland-water operations.",
    icon: "⚓",
    examples: ["Anchor-handling tugs (AHTS)", "Platform supply vessels (PSV)", "Fast support vessels / crew boats", "Tugs & utility boats"],
    keywords: ["vessel", "tug", "ahts", "psv", "fsv", "crew boat", "supply boat", "boat", "anchor handling"],
    fields: [
      select("vessel", "Vessel type", ["Anchor-handling tug (AHTS)", "Platform supply vessel (PSV)", "Fast support vessel / crew boat", "Tug", "Utility boat", "Other"], true),
      text("size", "Capacity", "e.g. 80 t bollard pull, 40 pax, 300 m² deck", true),
      select("crew", "Crew", ["With crew", "Bareboat", "Not sure"]),
      text("operatingArea", "Operating area", "e.g. Niger Delta offshore"),
      scope("Class, flag, certification, DP, etc."),
    ],
  },
  {
    slug: "subsea-rov",
    group: "marine",
    name: "ROV & Diving Support",
    tagline: "Work-class and inspection ROVs, dive spreads",
    description: "Subsea inspection, intervention and diving support equipment.",
    icon: "🤿",
    examples: ["Work-class ROVs", "Inspection ROVs", "Dive support equipment"],
    keywords: ["rov", "subsea", "diving", "dive", "underwater"],
    fields: [
      select("equipment", "Equipment", ["Work-class ROV", "Inspection ROV", "Dive support", "Other"], true),
      text("depth", "Water depth", "e.g. 300 m"),
      scope("Task, tooling, vessel of opportunity, crew."),
    ],
  },

  /* ---- Lifting, Transport & Site Support ---- */
  {
    slug: "cranes-lifting",
    group: "logistics",
    name: "Cranes & Lifting",
    tagline: "Mobile and crawler cranes, forklifts, telehandlers",
    description: "Lifting equipment for rig-up, construction and loading.",
    icon: "🏗️",
    featured: true,
    examples: ["Mobile cranes", "Crawler cranes", "Forklifts", "Telehandlers"],
    keywords: ["crane", "forklift", "telehandler", "lifting", "hiab", "boom truck"],
    fields: [
      select("equipment", "Equipment", ["Mobile crane", "Crawler crane", "Forklift", "Telehandler", "Boom truck", "Other"], true),
      text("capacity", "Capacity", "e.g. 100 t", true),
      select("operator", "Operator", ["With operator", "Bare (no operator)", "Not sure"]),
      scope("Lift weight, radius, site conditions."),
    ],
  },
  {
    slug: "heavy-transport",
    group: "logistics",
    name: "Heavy Transport & Trucks",
    tagline: "Low-beds, tankers, tractor heads and water trucks",
    description: "Haulage and transport equipment.",
    icon: "🚛",
    examples: ["Low-bed trailers", "Tankers", "Tractor heads", "Water trucks", "Crew buses"],
    keywords: ["truck", "trailer", "low bed", "lowbed", "tanker", "haulage", "transport", "bus"],
    fields: [
      select("equipment", "Equipment", ["Low-bed trailer", "Tanker", "Tractor head", "Water truck", "Crew bus", "Other"], true),
      text("capacity", "Capacity / quantity", "e.g. 60 t, 4 units", true),
      text("route", "Route / haulage", "e.g. Port Harcourt → Warri"),
      scope(),
    ],
  },
  {
    slug: "earthmoving",
    group: "logistics",
    name: "Earthmoving Equipment",
    tagline: "Excavators, dozers, swamp buggies and graders",
    description: "Site-preparation and civil equipment.",
    icon: "🚜",
    examples: ["Excavators", "Bulldozers", "Swamp buggies / amphibious excavators", "Graders", "Dump trucks"],
    keywords: ["excavator", "bulldozer", "dozer", "swamp buggy", "grader", "dump truck", "earthmoving", "loader"],
    fields: [
      select("equipment", "Equipment", ["Excavator", "Bulldozer", "Swamp buggy / amphibious excavator", "Grader", "Dump truck", "Loader", "Other"], true),
      text("size", "Size / quantity", "e.g. 20 t excavator x 2", true),
      select("operator", "Operator", ["With operator", "Bare (no operator)", "Not sure"]),
      scope("Site conditions, terrain (swamp, land), duration."),
    ],
  },
  {
    slug: "camps-accommodation",
    group: "logistics",
    name: "Camps & Accommodation",
    tagline: "Portable cabins, site camps, offices and ablution units",
    description: "Temporary accommodation and facilities for remote sites.",
    icon: "🏕️",
    examples: ["Portable cabins", "Complete site camps", "Office units", "Ablution units", "Catering"],
    keywords: ["camp", "cabin", "accommodation", "portacabin", "office", "ablution", "catering"],
    fields: [
      select("equipment", "Requirement", ["Portable cabins", "Complete camp", "Office units", "Ablution units", "Camp with catering", "Other"], true),
      text("headcount", "Number of persons / units", "e.g. 60 persons", true),
      scope("Location access, power and water, catering, security."),
    ],
  },
  {
    slug: "helicopters",
    group: "logistics",
    name: "Helicopters & Aviation",
    tagline: "Crew-change and offshore helicopter charter",
    description: "Helicopter charter for crew change and logistics.",
    icon: "🚁",
    examples: ["Light helicopters", "Medium helicopters", "Heavy helicopters"],
    keywords: ["helicopter", "heli", "chopper", "aviation", "aircraft", "charter"],
    fields: [
      select("type", "Helicopter class", ["Light", "Medium", "Heavy", "Not sure"], true),
      text("payload", "Passengers / payload", "e.g. 12 pax"),
      text("route", "Route / base", "e.g. Port Harcourt ↔ offshore platform"),
      scope(),
    ],
  },

  /* ---- Something else ---- */
  {
    slug: "other-equipment",
    group: "other",
    name: "Other Equipment",
    tagline: "Not listed? Tell us what you need",
    description: "Any upstream equipment not covered by the categories above.",
    icon: "❓",
    examples: ["Anything upstream oil & gas"],
    keywords: [],
    fields: [
      text("itemName", "What equipment do you need?", "e.g. Rotary table, sand-control equipment", true),
      {
        name: "specs",
        label: "Specifications",
        type: "textarea",
        required: true,
        placeholder: "Size, capacity, standards, quantity, certification, crew, etc.",
      },
    ],
  },
];

/* --------------------------------- lookups --------------------------------- */

export function getEquipmentCategory(slug: string): EquipmentCategory | undefined {
  return equipmentCategories.find((c) => c.slug === slug);
}

export function categoryName(slug: string): string {
  return getEquipmentCategory(slug)?.name ?? slug;
}

export function categoriesByGroup() {
  return equipmentGroups
    .map((g) => ({ group: g, categories: equipmentCategories.filter((c) => c.group === g.slug) }))
    .filter((x) => x.categories.length > 0);
}

/** Best-effort category guess from free text (longest keyword match wins). */
export function guessCategory(q: string): string {
  const t = q.toLowerCase();
  let best = "";
  let bestLen = 0;
  for (const c of equipmentCategories) {
    for (const k of c.keywords) {
      if (t.includes(k) && k.length > bestLen) {
        best = c.slug;
        bestLen = k.length;
      }
    }
  }
  return best;
}

export const CURRENCIES = ["USD", "NGN"] as const;
