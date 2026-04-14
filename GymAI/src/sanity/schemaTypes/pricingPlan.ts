import { defineField, defineType } from "sanity";

export const pricingPlan = defineType({
  name: "pricingPlan",
  title: "Pricing Plan",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Plan name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "monthlyPrice", title: "Monthly price (₹)", type: "number" }),
    defineField({ name: "yearlyPrice", title: "Yearly price (₹)", type: "number" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "cta", title: "CTA button label", type: "string" }),
    defineField({ name: "highlighted", title: "Most popular?", type: "boolean", initialValue: false }),
    defineField({ name: "order", title: "Display order", type: "number" }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
});
