import type { TransformDefinition } from "../types/transform";

export const BUILTIN_TRANSFORMS: TransformDefinition[] = [
  {
    id: "checklist",
    name: "Checklist",
    summary: "Turn selection into actionable `- [ ]` checklist items",
    description:
      "Convert the content into a markdown checklist. Each actionable item should be a single `- [ ]` line. Keep items concise and specific.",
    builtin: true,
  },
  {
    id: "project-plan",
    name: "Project plan",
    summary: "Restructure as goal, milestones, owners, and timeline",
    description:
      "Restructure the content as a project plan with sections: Goal, Milestones, Owners, and Timeline. Use headings and bullet lists where appropriate.",
    builtin: true,
  },
  {
    id: "meeting-notes",
    name: "Meeting notes",
    summary: "Format as attendees, agenda, decisions, and follow-ups",
    description:
      "Format the content as meeting notes with sections: Attendees, Agenda, Discussion, Decisions, and Action Items. Use clear headings and bullet lists.",
    builtin: true,
  },
  {
    id: "email-draft",
    name: "Email draft",
    summary: "Rewrite as a clear, sendable email",
    description:
      "Rewrite the content as a professional email with a subject line, greeting, body paragraphs, and sign-off. Keep the tone clear and concise.",
    builtin: true,
  },
  {
    id: "clarify",
    name: "Clarify",
    summary: "Tighten wording; same meaning, easier to read",
    description:
      "Rewrite the content for clarity. Preserve the original meaning but use tighter, more direct language. Keep a similar length unless the text is redundant.",
    builtin: true,
  },
];

export function getBuiltinTransform(id: string): TransformDefinition | undefined {
  return BUILTIN_TRANSFORMS.find((transform) => transform.id === id);
}
