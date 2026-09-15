import { defaultSchema } from "rehype-sanitize";

type SanitizeSchema = typeof defaultSchema;
type SchemaAttributes = NonNullable<SanitizeSchema["attributes"]>;
type SchemaAttributeValue = NonNullable<SchemaAttributes[string]>;

const HEADING_TAG_NAMES = ["h1", "h2", "h3", "h4", "h5", "h6"];

const SAFE_URL_PROTOCOLS = ["http", "https"];

function attributesWithId(tagName: string): SchemaAttributeValue {
  return [...(defaultSchema.attributes?.[tagName] ?? []), "id"];
}

const headingAttributes: SchemaAttributes = Object.fromEntries(
  HEADING_TAG_NAMES.map((tagName) => [tagName, attributesWithId(tagName)]),
);

const globalAttributes: SchemaAttributeValue = (defaultSchema.attributes?.["*"] ?? []).filter(
  (attribute) => attribute !== "id",
);

export const markdownSanitizeSchema: SanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "details", "summary", "br"],
  attributes: {
    ...defaultSchema.attributes,
    ...headingAttributes,
    code: [["className", /^language-/]],
    img: ["src", "alt", "title"],
    "*": globalAttributes,
  },
  clobber: (defaultSchema.clobber ?? []).filter((property) => property !== "id"),
  protocols: {
    ...defaultSchema.protocols,
    href: SAFE_URL_PROTOCOLS,
    src: SAFE_URL_PROTOCOLS,
  },
};
