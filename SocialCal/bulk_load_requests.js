// Bulk loader for CRAC / YCP Social & Marketing Campaign Requests
// Ingests structured array and writes directly to Firestore 'requests' collection

const FIREBASE_PROJECT_ID = 'opsf---comms-task-tracker';
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/requests`;

const entries = [
  {
    staffName: "Avram Parker",
    date: "2026-09-14",
    facility: "Clarence Regional Aquatic Centre",
    category: "Important Notice",
    channels: [],
    generateSign: true,
    title: "Signage Production Brief – Concession Passes & Term 4 Programs",
    keyMessage: "Need 3 physical sign types designed and printed before 1 October:\n\nA5 Front Counter Cards (x3): Concession Aqua Aerobics pricing breakdown ($14.50 single, $130.00 10-pass) and accepted cards (Pensioner Concession, Seniors Health Card, Health Care Card, Student Card).\n\nA-Frames (x2): Lap pool deck promotion for Adult Squads (Tues & Thurs 6:00 AM–7:00 AM, starts 13 Oct, coached interval training in 25m/50m pools, book via Client Portal).\n\nFoyer / Amenities Posters (A3 x4): Mums & Bubs Aqua (Tues 10:30 AM in heated leisure pool, mothers' postnatal reconditioning, prams welcome poolside) and Outdoor Aqua (Tues & Thurs 8:00 AM in 50m pool)."
  },
  {
    staffName: "Avram Parker",
    date: "2026-09-16",
    facility: "Clarence Regional Aquatic Centre",
    category: "Health Fitness",
    channels: ["Social"],
    generateSign: false,
    title: "Social Teaser – Big October Fitness & Concession Updates",
    keyMessage: "Teaser announcement for October at Clarence Regional Aquatic Centre.\n\nFact 1: From 1 October, brand new concession tickets and 10-visit multi-passes go live for all Aqua Aerobics and Mobility classes.\n\nFact 2: From 13 October (Term 4 Week 1), three new programs launch: Adult Squads (Tues/Thurs 6am), Outdoor Aqua (Tues/Thurs 8am), and Mums & Bubs Aqua (Tues 10:30am).\n\nDirect patrons to watch this space and review timetables at https://www.clarence.nsw.gov.au/crac#zone-availability."
  },
  {
    staffName: "Avram Parker",
    date: "2026-09-18",
    facility: "Clarence Regional Aquatic Centre",
    category: "Squad Training",
    channels: ["Social", "Website"],
    generateSign: false,
    title: "Program Deep Dive – Adult Squads Launch",
    keyMessage: "Target: Adult lap swimmers, masters, triathletes, surf lifesavers.\n\nStarts: Tuesday, 13 October 2026.\n\nSchedule: Tuesdays & Thursdays, 6:00 AM – 7:00 AM.\n\nLocation: 25m Heated Indoor Lap Pool & 50m Outdoor Olympic Pool.\n\nFormat: Coached structured interval sets, pace clocks, stroke correction, tiered lanes (intermediate to advanced endurance). Minimum requirement: continuous 100m freestyle.\n\nBooking: Pre-booking essential via Client Portal https://clarenceaquatic.perfectgym.com.au/clientportal2/#/Login."
  },
  {
    staffName: "Avram Parker",
    date: "2026-09-22",
    facility: "Clarence Regional Aquatic Centre",
    category: "Health Fitness",
    channels: ["Social", "Website"],
    generateSign: false,
    title: "Program Deep Dive – Outdoor Aqua (50m Pool)",
    keyMessage: "Starts: Tuesday, 13 October 2026.\n\nSchedule: Tuesdays & Thursdays, 8:00 AM – 8:45 AM.\n\nLocation: Outdoor 50m Grafton Olympic Pool.\n\nFormat: High-energy, low-impact full-body cardiovascular workout under open skies. Uses water resistance, noodles, and dumbbells.\n\nPricing: Standard aqua fees and passes apply; new concession tickets ($14.50) and 10-visit passes ($130.00) fully accepted.\n\nLink: https://www.clarence.nsw.gov.au/crac#zone-availability."
  },
  {
    staffName: "Avram Parker",
    date: "2026-09-24",
    facility: "Clarence Regional Aquatic Centre",
    category: "Health Fitness",
    channels: ["Social", "Website"],
    generateSign: false,
    title: "Program Deep Dive – Mums & Bubs Aqua (Postnatal Fitness)",
    keyMessage: "Starts: Tuesday, 13 October 2026.\n\nSchedule: Tuesdays at 10:30 AM (45 minutes).\n\nLocation: Heated Indoor Program & Leisure Pool.\n\nFormat: Gentle, targeted postnatal recovery and aquatic exercise class for mothers (core reconditioning, pelvic floor support, light cardio).\n\nBaby arrangement: NOT a parent-infant flotation class (no flotation rings in pool). Babies remain safely poolside in their prams, strollers, or capsules on the pool deck immediately beside the leisure pool within arm's reach/line of sight.\n\nEligibility: Recommended for mothers 6+ weeks postpartum (with GP clearance).\n\nBooking: Portal booking required at https://clarenceaquatic.perfectgym.com.au/clientportal2/#/Login."
  },
  {
    staffName: "Avram Parker",
    date: "2026-09-28",
    facility: "Clarence Regional Aquatic Centre",
    category: "Important Notice",
    channels: ["Website"],
    generateSign: false,
    title: "Web & Portal Content Update Brief – Concession Pricing & Term 4 Enrolments",
    keyMessage: "Update Clarence Valley Council CRAC website pricing tables effective 1 October:\n\nSingle/day table: Add \"Aqua Fitness (Concession) – $14.50\".\n\nMulti-Visit table: Add \"10 Pass Aqua Fitness (Concession) – $130.00\".\n\nOpen registration on the PerfectGym Client Portal for Adult Squads, Mums & Bubs Aqua, and Outdoor Aqua starting 13 October.\n\nPlace promotional banner on CRAC homepage linking directly to bookings."
  },
  {
    staffName: "Avram Parker",
    date: "2026-09-30",
    facility: "Clarence Regional Aquatic Centre",
    category: "Health Fitness",
    channels: ["Newsletter"],
    generateSign: false,
    title: "Member Broadcast Email – Concessions Live Tomorrow + Term 4 Bookings Open",
    keyMessage: "Audience: Registered PerfectGym account holders, newsletter subscribers, lap swimmers, and swim school families.\n\nItem 1: Concession Aqua Aerobics launches tomorrow, 1 October. Casual single ticket $14.50, 10-visit card $130.00. Present pension/concession card at front counter to attach to account.\n\nItem 2: Term 4 new classes open for booking today (Adult Squads, Outdoor Aqua, Mums & Bubs Aqua) starting Tuesday, 13 October.\n\nDirect action link: https://clarenceaquatic.perfectgym.com.au/clientportal2/#/Login."
  },
  {
    staffName: "Avram Parker",
    date: "2026-10-02",
    facility: "Clarence Regional Aquatic Centre",
    category: "Health Fitness",
    channels: ["Social", "Website"],
    generateSign: false,
    title: "Social Campaign – Concession Aqua Passes Now Active",
    keyMessage: "Concession tickets and multi-passes are officially active as of yesterday (1 October).\n\nPricing: Single casual class $14.50 (regular $17.00); 10-visit multi-pass $130.00 (regular $153.00).\n\nEligible cards: Pensioner Concession Card, Commonwealth Seniors Health Card, Health Care Card, and Full-time Student Card.\n\nValid across all regular Aqua, Mobility, and upcoming Outdoor Aqua classes.\n\nBuy at reception or book online via https://clarenceaquatic.perfectgym.com.au/clientportal2/#/Login."
  },
  {
    staffName: "Avram Parker",
    date: "2026-10-06",
    facility: "Clarence Regional Aquatic Centre",
    category: "Health Fitness",
    channels: ["Social"],
    generateSign: false,
    title: "Social & Portal Push – 1 Week to Go (Mums & Bubs + Adult Squads)",
    keyMessage: "1 week until Term 4 classes commence on Tuesday, 13 October.\n\nAdult Squads reminder: Tuesday/Thursday 6:00 AM. Lane capacity strictly capped.\n\nMums & Bubs Aqua reminder: Tuesday 10:30 AM in heated leisure pool. Mothers' workout, prams poolside.\n\nEmphasise booking early via https://clarenceaquatic.perfectgym.com.au/clientportal2/#/Login to guarantee lane and pool space."
  },
  {
    staffName: "Avram Parker",
    date: "2026-10-08",
    facility: "Clarence Regional Aquatic Centre",
    category: "Health Fitness",
    channels: ["Social"],
    generateSign: false,
    title: "Social Spotlight – Outdoor 50m Pool Season & Outdoor Aqua",
    keyMessage: "Warmer weather is here: Outdoor 50m Olympic Pool open for regular season swimming.\n\nOutdoor Aqua kicks off next Tuesday, 13 October at 8:00 AM.\n\n45-minute high-energy class with music and resistance gear. Concession passes ($14.50 / $130.00) and multi-passes valid.\n\nCheck timetable and lane allocations at https://www.clarence.nsw.gov.au/crac#zone-availability."
  },
  {
    staffName: "Avram Parker",
    date: "2026-10-12",
    facility: "Clarence Regional Aquatic Centre",
    category: "Health Fitness",
    channels: ["Social", "Newsletter", "Website"],
    generateSign: false,
    title: "Launch Eve Reminder – All New Programs Start Tomorrow Morning",
    keyMessage: "Tomorrow (Tuesday, 13 October) schedule:\n\n6:00 AM: Adult Squads (25m/50m Lap Pools)\n\n8:00 AM: Outdoor Aqua (50m Olympic Pool)\n\n10:30 AM: Mums & Bubs Aqua (Heated Leisure Pool – prams welcome on deck)\n\nReception check-in reminders: Arrive 10 minutes early to check in and collect pool deck tokens.\n\nFinal registration link: https://clarenceaquatic.perfectgym.com.au/clientportal2/#/Login."
  },
  {
    staffName: "Avram Parker",
    date: "2026-10-14",
    facility: "Clarence Regional Aquatic Centre",
    category: "Health Fitness",
    channels: ["Social"],
    generateSign: false,
    title: "Social Proof – Launch Week Momentum & Next Sessions",
    keyMessage: "Celebrate successful first sessions from Tuesday.\n\nReminder that Adult Squads and Outdoor Aqua run again tomorrow (Thursday, 15 October) at 6:00 AM and 8:00 AM.\n\nInvite feedback and encourage casual drop-ins to convert to 10-visit multi-passes at reception.\n\nTimetable link: https://www.clarence.nsw.gov.au/crac#zone-availability."
  },
  {
    staffName: "Avram Parker",
    date: "2026-10-16",
    facility: "Clarence Regional Aquatic Centre",
    category: "Health Fitness",
    channels: ["Social", "Newsletter"],
    generateSign: false,
    title: "Week 1 Wrap-up – Join Us for Week 2",
    keyMessage: "Wrap-up of Week 1 of Term 4.\n\nReiterate that all classes continue next week: Adult Squads (Tues/Thurs 6am), Outdoor Aqua (Tues/Thurs 8am), Mums & Bubs Aqua (Tues 10:30am).\n\nHighlight that Concession 10-visit cards ($130.00) and standard multi-visit passes are available online and at the front counter.\n\nClient Portal link: https://clarenceaquatic.perfectgym.com.au/clientportal2/#/Login."
  }
];

async function loadAll() {
  console.log(`Starting bulk upload of ${entries.length} campaign requests...`);
  const now = new Date().toISOString();

  for (let i = 0; i < entries.length; i++) {
    const item = entries[i];
    const payload = {
      fields: {
        staffName: { stringValue: item.staffName },
        date: { stringValue: item.date },
        title: { stringValue: item.title },
        category: { stringValue: item.category },
        facility: { stringValue: item.facility },
        keyMessage: { stringValue: item.keyMessage },
        channels: {
          arrayValue: {
            values: (item.channels || []).map(c => ({ stringValue: c }))
          }
        },
        generateSign: { booleanValue: item.generateSign },
        status: { stringValue: "Pending" },
        assetUrl: { nullValue: null },
        timestamp: { timestampValue: now }
      }
    };

    try {
      const res = await fetch(FIRESTORE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        const id = data.name.split('/').pop();
        console.log(`[${i + 1}/${entries.length}] SUCCESS: "${item.title}" (${item.date}) -> ID: ${id}`);
      } else {
        console.error(`[${i + 1}/${entries.length}] FAILED: "${item.title}"`, data);
      }
    } catch (err) {
      console.error(`[${i + 1}/${entries.length}] ERROR: "${item.title}"`, err);
    }
  }
  console.log('Bulk upload complete!');
}

loadAll();
