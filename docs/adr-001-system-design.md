# ADR 001: System Design for Content Generation Lineage and Workflow

## Context
Creator Hub requires a robust, audit-loggable system for AI-generated product content. The system must support "Human-in-the-loop" workflows, versioning of both inputs (specifications/context) and outputs (drafts), and ensure data integrity during generation.

## Decisions

### 1. State Management & Audit Log
- The content workflow will use a state machine (Draft -> Pending Review -> Approved).
- To ensure full auditability, every state transition will be an immutable entry in an `AuditLog` table.
- A `ContentState` table will track the *current* state of each content item.

### 2. Versioning Strategy
- Both inputs (product specs, personal experience) and outputs (generated drafts) will be versioned.
- A `ContentGeneration` record will act as an anchor, linking a specific `InputVersion` to an `OutputVersion`.
- If inputs change, a new `InputVersion` is created, and re-generation creates a new `ContentGeneration` link.

### 3. Streaming & Persistence Strategy
- **Phase 1 (UX):** Streaming response via Vercel AI SDK to the UI for immediate feedback.
- **Phase 2 (Atomic Finalization):** Upon stream completion, the client triggers an atomic backend transaction to save:
  - The final snapshot of inputs (`InputVersion`).
  - The generated output (`OutputVersion`).
  - The initial record in `ContentState` and `AuditLog`.
- This ensures only complete, valid data is persisted to the database.

## Consequences
- **Pros:** High data integrity, full traceability of content lineage, simplified backend logic regarding stream handling.
- **Cons:** Slightly delayed persistence of the "final" state until the stream finishes, although this aligns with the UX goal of showing content *as it generates*.
