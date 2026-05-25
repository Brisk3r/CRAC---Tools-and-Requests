# Task Tracking & Backlog

This file tracks active tasks, roadmaps, and priorities for the CVC Aquatic Operations Hub (CRAC & YCP Team Hub).

## Active Sprint Priorities

The following priorities have been addressed or parked as per instructions:

| Task ID | Task Description | Category | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TS-001** | **Centralise and Consolidate Social Comms Workflows**<br>Consolidate workflows under `SocialCal`. *Bury the legacy content approval tool.* | Comms & Marketing | High | Cancelled (Legacy Tool Buried) |
| **TS-002** | **Integrate Real-Time Website Alert Fetching**<br>Implement dynamic API website alert bar. | Website Integration | High | Parked (Alerts won't work) |
| **TS-003** | **Standardise Hub Navigation Linkage for Shelved and Admin Tools**<br>Expose `ShortenerAdmin.html` on the dashboard, keeping other legacy/orphaned tools hidden. | Organisation & UI | Medium | Completed (Linked Short Links only) |
| **TS-004** | **Enhance Database Performance and Cost Control in Task Tracker**<br>Automate "Squash Data Payload" utility. | Operations & DB | Medium | Parked (Database performance parked) |
| **TS-005** | **Localise and Standardise Award Rates in Weekend Timesheet Calculator**<br>Update shift calculation logic for Casual/Permanent rates under NSW Local Government Award. | Operations & Admin | Medium | Completed (Updated calculator math) |
| **TS-006** | **Restore Zone Calendar Embeds & Embed Modal on Hub**<br>Add new 'Live Availability & Calendars' section with `crac-cal-embed.html` and `ycp-cal-embed.html`, and implement responsive iframe modal. | Organisation & UI | High | Completed (Restored embeds & built modal) |

---

## Suggested Priorities for the Next Sprint

The following exactly 5 suggested priorities are recommended for the next sprint:

| Task ID | Task Description | Category | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TS-012** | **Lost & Found Gallery Image Upload Support**<br>Add visual log capabilities for kiosk staff to capture and upload photos of lost patron items directly inside `LostAndFound.html`. | UI/UX & Media | High | Proposed |
| **TS-013** | **Lost & Found Teams Integration Walkthrough**<br>Provide a clear walkthrough of the webhook/integration mechanism to alert the YCP/CRAC Microsoft Teams channel when a new item is logged. | Comms & Integration | Medium | Proposed |
| **TS-014** | **Email Template Outlook One-Click Copy**<br>Add a "Copy Rich Text" or "Copy HTML" button directly to template blocks in `crac-email-templates.html` to simplify copying cancellations/notices directly into Outlook. | Operations & Comms | Medium | Proposed |
| **TS-015** | **Pricing Hub Configuration Cache**<br>Use local storage in `CRACPriceCalculator.html` to remember custom pricing variables, facility hire selections, and discount profiles for active sessions. | UI/UX & Data | Low | Proposed |
| **TS-016** | **Notice Builder Custom Layouts**<br>Integrate official Clarence Valley Council logo headers and water safety templates directly into `NoticeSignGenerator.html` for instant printing. | Operations & UI | Low | Proposed |

---

## Current Project Feature Audit

### 1. Operations & Scheduling
*   **Pricing Hub (`CRACPriceCalculator.html`)**: Interactive tool for kiosk staff to calculate public entry and facility hire fees.
*   **Task Tracker (`TaskTracker.html`)**: Real-time Kanban board and timeline (Gantt-like view) for maintenance and operations. Connects to the `tasks` collection in the `opsf---comms-task-tracker` Firestore database. Features user filtering and archive payload squashing.
*   **Timesheet Tool (`WeekendTimesheetCalculator.html`)**: Simple helper to estimate award rates and weekend shift pay.

### 2. Marketing & Comms (Multi-Channel Integration)
*   **Staff Request Portal (`SocialCal/soccal.html`)**: Standardised form for centre staff to submit communications briefs with raw messages, facility tags, target channels (Social, Newsletter, Website), and optional attachments.
*   **Marketing Admin Dashboard (`SocialCal/admin.html`)**: Core admin centre to review, edit (using Quill.js), and approve submissions. Connects directly to Canva templates and inserts newsletter HTML block modules.
*   **Social Content Approval Tool (`contentapprovaltool.html`)**: A separate, older approval app connected to the `osf---availability-roster` Firestore database. Handles single-post requests.
*   **Email Template Generator (`crac-email-templates.html`)**: Generates Outlook-compatible email HTML for class cancellations, late fees, LTS reenrolment, and general announcements.
*   **UTM & QR Builder (`UTMLinkGenerator.html`)**: Generates tracked marketing campaigns and QR codes.

### 3. Facility Management & Resources
*   **Notice Builder (`NoticeSignGenerator.html`)**: Standardised PDF notice/poster generator for safety alerts and closures.
*   **A3 Menu Builder (`A3MenuBuilder.html`)**: Tool for creating kiosk menus and signage.
*   **Availability Dashboard (`CRAC_2026_Availability_Dashboard-v2.html`) & Admin Calendars (`CRAC_CAL/*`)**: Scheduling/availability viewing and lane-mapping charts.
*   **Lost & Found Gallery (`LostAndFound.html`)**: Visual manager for patron items with a 30-day retention countdown.
*   **Cert Builder (`Mult-Centre/SwimCertGen.html`)**: Learn-to-swim certificate generator.
