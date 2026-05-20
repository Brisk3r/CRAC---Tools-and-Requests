# Task Tracking & Backlog

This file tracks active tasks, roadmaps, and priorities for the CVC Aquatic Operations Hub (CRAC & YCP Team Hub).

## Active Sprint Priorities (Next Sprint)

The following exactly 5 priorities have been identified and suggested for the next sprint to improve tracking, organisation, and operations:

| Task ID | Task Description | Category | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TS-001** | **Centralise and Consolidate Social Comms Workflows**<br>Consolidate the duplicate workflows between the simpler `contentapprovaltool.html` (which points to the `osf---availability-roster` Firestore database and handles single-platform posts) and the robust `SocialCal` suite (`soccal.html` & `admin.html`, pointing to `opsf---comms-task-tracker`). Merging these into a single workspace under `SocialCal` will reduce database costs, clean up overlapping code, and prevent staff confusion. | Comms & Marketing | High | Planned |
| **TS-002** | **Integrate Real-Time Website Alert Fetching in Front-End Sites**<br>Implement the dynamic API website alert bar defined in `Channel-Integration-Standards.md` across the Clarence Regional Aquatic Centre (CRAC) and Yamba Community Pool (YCP) websites. This allows approved alerts tagged with the "Website" channel in Firestore to render automatically on the live sites via `fetchWebsiteAlerts`, replacing the current manual copying and pasting. | Website Integration | High | Planned |
| **TS-003** | **Standardise Hub Navigation Linkage for Shelved and Admin Tools**<br>Organise and update `index.html` and `nav.js` to ensure all operational tools are accessible from the main dashboard. Currently, tools like `LostAndFound.html` (the newly upgraded Lost & Found Gallery), `contentapprovaltool.html`, `RosterHelper.html`, `LollyLabelPrinting.html`, and `CRACPoolRulesDB.html` exist in the repository but are not listed in the Hub's main dashboard categories. | Organisation & UI | Medium | Planned |
| **TS-004** | **Enhance Database Performance and Cost Control in Task Tracker**<br>Automate the "Squash Data Payload" utility in `TaskTracker.html`. While a manual button exists to replace descriptions and comments on archived tasks with a generic placeholder to minimise Firestore read/write payloads, automating this for tasks archived for more than 30 days will keep the database lightweight and fast. | Operations & DB | Medium | Planned |
| **TS-005** | **Localise and Standardise Award Rates in Weekend Timesheet Calculator**<br>Review the `WeekendTimesheetCalculator.html` tool to ensure all award rates and shift calculations are fully compliant with the latest Fair Work Ombudsman (FWO) modern awards for aquatic and fitness centre staff. Standardise inputs and design elements to match the global Inter typography and dark mode theme. | Operations & Admin | Medium | Planned |

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
