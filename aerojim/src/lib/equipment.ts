export type FieldType = "text" | "textarea" | "select";

export interface RequestField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

export interface EquipmentCategory {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  examples: string[];
  fields: RequestField[];
}

export const equipmentCategories: EquipmentCategory[] = [
  {
    slug: "well-testing",
    name: "Well Testing Equipment",
    tagline: "Surface well testing packages and associated equipment on lease",
    description:
      "Surface well testing packages for exploration, appraisal and production wells. Tell us the well conditions and the services you need, and we source availability and day rates from our vetted vendors.",
    icon: "🛢️",
    examples: [
      "Surface well testing package",
      "Separators (2-phase / 3-phase)",
      "Choke manifolds",
      "Heat exchangers & steam generators",
      "Surge tanks & burners / booms",
      "Data acquisition systems",
    ],
    fields: [
      {
        name: "testType",
        label: "Type of test",
        type: "select",
        required: true,
        options: [
          "Surface well testing (SWT)",
          "Flowback / clean-up",
          "Production test",
          "Extended well test (EWT)",
          "Other",
        ],
      },
      {
        name: "wellType",
        label: "Well type",
        type: "select",
        required: true,
        options: ["Oil", "Gas", "Gas condensate", "HPHT", "Not sure"],
      },
      {
        name: "maxPressure",
        label: "Max expected pressure (psi)",
        type: "text",
        placeholder: "e.g. 10,000 psi",
      },
      {
        name: "maxFlowRate",
        label: "Expected flow rate",
        type: "text",
        placeholder: "e.g. 5,000 bpd / 20 MMscfd",
      },
      {
        name: "h2s",
        label: "H2S / CO2 present?",
        type: "select",
        options: ["No", "H2S", "CO2", "Both", "Unknown"],
      },
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
    slug: "barges",
    name: "Barges",
    tagline: "Deck, accommodation, crane and storage barges for lease",
    description:
      "Marine barges for offshore, swamp and inland-water operations. Tell us the job, the capacity you need and where it will operate, and we source availability and day rates from our vendors.",
    icon: "🚢",
    examples: [
      "Flat-top / deck barges",
      "Accommodation barges",
      "Crane barges",
      "Tank / storage barges",
      "Swamp & shallow-water barges",
      "Pipelay / support barges",
    ],
    fields: [
      {
        name: "bargeType",
        label: "Barge type",
        type: "select",
        required: true,
        options: [
          "Deck / flat-top barge",
          "Accommodation barge",
          "Crane barge",
          "Tank / storage barge",
          "Swamp / shallow-water barge",
          "Other",
        ],
      },
      {
        name: "capacity",
        label: "Capacity / deck load",
        type: "text",
        required: true,
        placeholder: "e.g. 2,000 DWT or 1,500 t deck load",
      },
      {
        name: "dimensions",
        label: "Minimum dimensions / draft",
        type: "text",
        placeholder: "e.g. 60m x 18m, max draft 2.5m",
      },
      {
        name: "operatingArea",
        label: "Operating area / water depth",
        type: "text",
        required: true,
        placeholder: "e.g. Bonny River, 6m water depth",
      },
      {
        name: "crewRequired",
        label: "Crew / tug required?",
        type: "select",
        options: ["Bareboat (no crew)", "With crew", "With crew and tug", "Not sure"],
      },
      {
        name: "scope",
        label: "Scope of work / additional requirements",
        type: "textarea",
        placeholder:
          "Describe the job, cargo, certification needed (class, flag, etc.), crane capacity, accommodation numbers, etc.",
      },
    ],
  },
];

export function getEquipmentCategory(slug: string): EquipmentCategory | undefined {
  return equipmentCategories.find((c) => c.slug === slug);
}

export function categoryName(slug: string): string {
  return getEquipmentCategory(slug)?.name ?? slug;
}

export const CURRENCIES = ["USD", "NGN"] as const;
