// Update the 13 Firestore documents with the reworked campaign (Zero Concession mentions)
const FIREBASE_PROJECT_ID = 'opsf---comms-task-tracker';
const BASE_FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/requests`;

const reworkedEntries = [
  {
    id: "nzT5F96CMbDdK4IhluLU",
    staffName: "Avram Parker",
    date: "2026-09-14",
    facility: "Clarence Regional Aquatic Centre",
    category: "Important Notice",
    channels: [],
    generateSign: true,
    title: "Signage Production Brief - Term 4 New Programs Launch",
    keyMessage: "Need physical signs designed and printed before 1 October for Term 4 launch:\n\n1. A-Frames (x2): Lap pool deck promotion for Adult Squads (Tues & Thurs 6:00 AM - 7:00 AM, starts 13 Oct, coached interval training in 25m/50m pools, pre-booking required via Client Portal).\n\n2. Foyer & Amenities Posters (A3 x4): Mums & Bubs Aqua (Tues 10:30 AM in heated leisure pool, mothers postnatal reconditioning, prams welcome poolside) and Outdoor Aqua (Tues & Thurs 8:00 AM in 50m pool).\n\n3. Front Counter Information Cards (A5 x3): Term 4 timetable overview for Adult Squads, Outdoor Aqua, and Mums & Bubs Aqua, with Portal booking QR code."
  },
  {
    id: "mmKEprXJVD3vV8Bw3FBR",
    staffName: "Avram Parker",
    date: "2026-09-16",
    facility: "Clarence Regional Aquatic Centre",
    category: "Health Fitness",
    channels: ["Social"],
    generateSign: false,
    title: "Social Teaser - Big October Term 4 Program Launch",
    keyMessage: "Teaser announcement for October at Clarence Regional Aquatic Centre.\n\nFrom Tuesday 13 October (Term 4 Week 1), three brand new programs launch:\n- Adult Squads (Tues/Thurs 6:00 AM)\n- Outdoor Aqua (Tues/Thurs 8:00 AM)\n- Mums & Bubs Aqua (Tues 10:30 AM)\n\nBookings open soon on the Client Portal. Keep an eye on our page and review current lane availability at https://www.clarence.nsw.gov.au/crac#zone-availability."
  },
  {
    id: "2ckJOnn08FryweaX7LA2",
    staffName: "Avram Parker",
    date: "2026-09-18",
    facility: "Clarence Regional Aquatic Centre",
    category: "Squad Training",
    channels: ["Social", "Website"],
    generateSign: false,
    title: "Program Deep Dive - Adult Squads Launch",
    keyMessage: "Target: Adult lap swimmers, masters, triathletes, surf lifesavers.\n\nStarts: Tuesday 13 October 2026.\n\nSchedule: Tuesdays & Thursdays, 6:00 AM - 7:00 AM.\n\nLocation: 25m Heated Indoor Lap Pool & 50m Outdoor Olympic Pool.\n\nFormat: Coached structured interval sets, pace clocks, stroke correction, tiered lanes (intermediate to advanced endurance). Minimum requirement: continuous 100m freestyle.\n\nBooking: Pre-booking essential via Client Portal https://clarenceaquatic.perfectgym.com.au/clientportal2/#/Login."
  },
  {
    id: "Jmlu9snAHaCu2F5C8H7H",
    staffName: "Avram Parker",
    date: "2026-09-22",
    facility: "Clarence Regional Aquatic Centre",
    category: "Health Fitness",
    channels: ["Social", "Website"],
    generateSign: false,
    title: "Program Deep Dive - Outdoor Aqua (50m Pool)",
    keyMessage: "Starts: Tuesday 13 October 2026.\n\nSchedule: Tuesdays & Thursdays, 8:00 AM - 8:45 AM.\n\nLocation: Outdoor 50m Grafton Olympic Pool.\n\nFormat: High-energy, low-impact full-body cardiovascular workout under open skies. Uses water resistance, noodles, and dumbbells.\n\nPricing: Standard casual aqua fees and 10-visit multi-passes apply; book online or pay at reception.\n\nTimetable Link: https://www.clarence.nsw.gov.au/crac#zone-availability."
  },
  {
    id: "55hL9v44T6iE3QxzD1By",
    staffName: "Avram Parker",
    date: "2026-09-24",
    facility: "Clarence Regional Aquatic Centre",
    category: "Health Fitness",
    channels: ["Social", "Website"],
    generateSign: false,
    title: "Program Deep Dive - Mums & Bubs Aqua (Postnatal Fitness)",
    keyMessage: "Starts: Tuesday 13 October 2026.\n\nSchedule: Tuesdays at 10:30 AM (45 minutes).\n\nLocation: Heated Indoor Program & Leisure Pool.\n\nFormat: Gentle, targeted postnatal recovery and aquatic exercise class for mothers (core reconditioning, pelvic floor support, light cardio).\n\nBaby arrangement: Strictly a class for mothers (not a parent-infant flotation class; babies do not enter the pool). Babies remain safely poolside in prams, strollers, or capsules on the pool deck immediately beside the leisure pool within arm's reach and line of sight.\n\nEligibility: Recommended for mothers 6+ weeks postpartum (with GP clearance).\n\nBooking: Portal booking required at https://clarenceaquatic.perfectgym.com.au/clientportal2/#/Login."
  },
  {
    id: "vg05SmaTp7excHgWDI9T",
    staffName: "Avram Parker",
    date: "2026-09-28",
    facility: "Clarence Regional Aquatic Centre",
    category: "Important Notice",
    channels: ["Website"],
    generateSign: false,
    title: "Web & Portal Content Update Brief - Term 4 Program Enrolments",
    keyMessage: "Open registration on the PerfectGym Client Portal for Adult Squads, Mums & Bubs Aqua, and Outdoor Aqua starting 13 October.\n\nUpdate CRAC website zone availability and class schedule descriptions to include the three new Term 4 timetables.\n\nPlace promotional announcement banner on CRAC homepage linking directly to bookings: https://clarenceaquatic.perfectgym.com.au/clientportal2/#/Login."
  },
  {
    id: "lBu2gsuQCOyb6DP1ikjM",
    staffName: "Avram Parker",
    date: "2026-09-30",
    facility: "Clarence Regional Aquatic Centre",
    category: "Health Fitness",
    channels: ["Newsletter"],
    generateSign: false,
    title: "Member Broadcast Email - Term 4 Bookings Open for New Programs",
    keyMessage: "Audience: Registered PerfectGym account holders, newsletter subscribers, lap swimmers, and swim school families.\n\nItem 1: Term 4 new classes open for booking today starting Tuesday 13 October:\n- Adult Squads: Tuesdays & Thursdays 6:00 AM\n- Outdoor Aqua: Tuesdays & Thursdays 8:00 AM (in the 50m pool)\n- Mums & Bubs Aqua: Tuesdays 10:30 AM (in the heated leisure pool; prams welcome poolside)\n\nItem 2: Outdoor 50m Olympic Pool is fully open for regular season swimming.\n\nDirect booking link: https://clarenceaquatic.perfectgym.com.au/clientportal2/#/Login."
  },
  {
    id: "Ck9KRhzLnGbhzMmqL6d5",
    staffName: "Avram Parker",
    date: "2026-10-02",
    facility: "Clarence Regional Aquatic Centre",
    category: "Health Fitness",
    channels: ["Social", "Website"],
    generateSign: false,
    title: "Social Spotlight - Spring Swimming & Outdoor 50m Pool Lap Lanes",
    keyMessage: "Spring swimming is here at Clarence Regional Aquatic Centre.\n\nThe outdoor 50m Olympic pool is open across all regular season hours for lap swimming, squad training, and recreational fitness.\n\nStandard casual admission and multi-visit passes are available online or at reception.\n\nLane availability and daily timetable: https://www.clarence.nsw.gov.au/crac#zone-availability."
  },
  {
    id: "RoSYl6C4evTmyACaDPvQ",
    staffName: "Avram Parker",
    date: "2026-10-06",
    facility: "Clarence Regional Aquatic Centre",
    category: "Health Fitness",
    channels: ["Social"],
    generateSign: false,
    title: "Social & Portal Push - 1 Week to Go (Mums & Bubs + Adult Squads)",
    keyMessage: "1 week until Term 4 classes commence on Tuesday 13 October.\n\nAdult Squads reminder: Tuesday/Thursday 6:00 AM. Lane capacity strictly capped to ensure structured pacing.\n\nMums & Bubs Aqua reminder: Tuesday 10:30 AM in heated leisure pool. Postnatal reconditioning for mothers with prams bedside on deck.\n\nBook early via https://clarenceaquatic.perfectgym.com.au/clientportal2/#/Login to secure your spot."
  },
  {
    id: "1pxzRGbhAy398FXrHF0D",
    staffName: "Avram Parker",
    date: "2026-10-08",
    facility: "Clarence Regional Aquatic Centre",
    category: "Health Fitness",
    channels: ["Social"],
    generateSign: false,
    title: "Social Spotlight - Outdoor 50m Pool Season & Outdoor Aqua",
    keyMessage: "Enjoy open sky fitness: Outdoor 50m Olympic Pool is in full regular season operation.\n\nOutdoor Aqua launches next Tuesday 13 October at 8:00 AM.\n\n45-minute high-energy workout with music and water resistance gear. Standard casual passes and 10-visit multi-passes valid.\n\nCheck timetable and lane allocations at https://www.clarence.nsw.gov.au/crac#zone-availability."
  },
  {
    id: "u9KcMjQC4SXsbWuy4DF6",
    staffName: "Avram Parker",
    date: "2026-10-12",
    facility: "Clarence Regional Aquatic Centre",
    category: "Health Fitness",
    channels: ["Social", "Newsletter", "Website"],
    generateSign: false,
    title: "Launch Eve Reminder - All New Programs Start Tomorrow Morning",
    keyMessage: "Tomorrow (Tuesday 13 October) schedule:\n\n6:00 AM: Adult Squads (25m & 50m Lap Pools)\n8:00 AM: Outdoor Aqua (50m Olympic Pool)\n10:30 AM: Mums & Bubs Aqua (Heated Leisure Pool, prams welcome on deck)\n\nReception check-in reminder: Arrive 10 minutes early to check in and collect pool deck entry tokens.\n\nFinal registration link: https://clarenceaquatic.perfectgym.com.au/clientportal2/#/Login."
  },
  {
    id: "Zi9Ncl91DHxDp9fekVet",
    staffName: "Avram Parker",
    date: "2026-10-14",
    facility: "Clarence Regional Aquatic Centre",
    category: "Health Fitness",
    channels: ["Social"],
    generateSign: false,
    title: "Social Proof - Launch Week Momentum & Next Sessions",
    keyMessage: "Great energy in our first Term 4 sessions on Tuesday!\n\nReminder: Adult Squads and Outdoor Aqua run again tomorrow (Thursday 15 October) at 6:00 AM and 8:00 AM.\n\nDrop-ins welcome where space permits, or grab a 10-visit multi-pass at reception to make regular swimming effortless.\n\nTimetable link: https://www.clarence.nsw.gov.au/crac#zone-availability."
  },
  {
    id: "BgtQsEhpj30XXfT1YBeb",
    staffName: "Avram Parker",
    date: "2026-10-16",
    facility: "Clarence Regional Aquatic Centre",
    category: "Health Fitness",
    channels: ["Social", "Newsletter"],
    generateSign: false,
    title: "Week 1 Wrap-up - Join Us for Week 2",
    keyMessage: "That is a wrap on Week 1 of Term 4!\n\nAll classes continue next week:\n- Adult Squads (Tues & Thurs 6:00 AM)\n- Outdoor Aqua (Tues & Thurs 8:00 AM)\n- Mums & Bubs Aqua (Tues 10:30 AM)\n\nStandard casual entries and 10-visit multi-passes are available online or at the front counter.\n\nClient Portal booking link: https://clarenceaquatic.perfectgym.com.au/clientportal2/#/Login."
  }
];

async function updateAll() {
  console.log(`Updating ${reworkedEntries.length} documents in Firestore to remove all concession mentions...`);
  const now = new Date().toISOString();

  for (let i = 0; i < reworkedEntries.length; i++) {
    const item = reworkedEntries[i];
    const url = `${BASE_FIRESTORE_URL}/${item.id}`;

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
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        console.log(`[${i + 1}/${reworkedEntries.length}] UPDATED: "${item.title}" (${item.date})`);
      } else {
        const errJson = await res.json();
        console.error(`[${i + 1}/${reworkedEntries.length}] FAILED: "${item.title}"`, errJson);
      }
    } catch (err) {
      console.error(`[${i + 1}/${reworkedEntries.length}] ERROR: "${item.title}"`, err);
    }
  }
  console.log('All documents successfully reworked in Firestore!');
}

updateAll();
