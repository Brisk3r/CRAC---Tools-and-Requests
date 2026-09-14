// Update Firestore documents with corrected BubFit Aqua concept:
// In-water workout with baby in a flotation device (NOT pram-on-deck postnatal)

const FIREBASE_PROJECT_ID = 'opsf---comms-task-tracker';
const BASE_FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/requests`;

const updates = [
  {
    id: "nzT5F96CMbDdK4IhluLU",
    title: "Signage Production Brief - Term 4 New Programs Launch",
    keyMessage: "Need physical signs designed and printed before 1 October for Term 4 launch:\n\n1. A-Frames (x2): Lap pool deck promotion for Adult Squads (Tues & Thurs 6:00 AM - 7:00 AM, starts 13 Oct, coached interval training in 25m/50m pools, pre-booking required via Client Portal).\n\n2. Foyer & Amenities Posters (A3 x4): BubFit Aqua (Tues 10:30 AM in heated leisure pool: aquatic fitness workout you do in the pool with your baby in a flotation device) and Outdoor Aqua (Tues & Thurs 8:00 AM in 50m pool).\n\n3. Front Counter Information Cards (A5 x3): Term 4 timetable overview for Adult Squads, Outdoor Aqua, and BubFit Aqua, with Portal booking QR code."
  },
  {
    id: "mmKEprXJVD3vV8Bw3FBR",
    title: "Social Teaser - Big October Term 4 Program Launch",
    keyMessage: "Teaser announcement for October at Clarence Regional Aquatic Centre.\n\nFrom Tuesday 13 October (Term 4 Week 1), three brand new programs launch:\n- Adult Squads (Tues/Thurs 6:00 AM)\n- Outdoor Aqua (Tues/Thurs 8:00 AM)\n- BubFit Aqua (Tues 10:30 AM - an aqua workout you do in the heated pool with your baby in a flotation device!)\n\nBookings open soon on the Client Portal. Keep an eye on our page and review current timetables at https://www.clarence.nsw.gov.au/crac#zone-availability."
  },
  {
    id: "55hL9v44T6iE3QxzD1By",
    title: "Program Deep Dive - BubFit Aqua (Workout With Your Baby)",
    keyMessage: "Target: Parents, mothers, fathers, and carers looking for fitness, water familiarisation, and fun with their baby.\n\nStarts: Tuesday 13 October 2026.\n\nSchedule: Tuesdays at 10:30 AM (45 minutes).\n\nLocation: Heated Indoor Program & Leisure Pool.\n\nFormat: A low-impact, full-body aquatic workout you do in the warm water together with your baby! Parents exercise using gentle water resistance, cardio intervals, and toning movements, while babies enjoy floating right in front of you in an approved flotation device with songs, sensory play, and early water confidence.\n\nBaby arrangement: Babies are in the water with you in a secure flotation ring/device throughout the session (swim nappy required).\n\nBooking: Pre-booking essential via Client Portal https://clarenceaquatic.perfectgym.com.au/clientportal2/#/Login."
  },
  {
    id: "vg05SmaTp7excHgWDI9T",
    title: "Web & Portal Content Update Brief - Term 4 Program Enrolments",
    keyMessage: "Open registration on the PerfectGym Client Portal for Adult Squads, BubFit Aqua, and Outdoor Aqua starting 13 October.\n\nUpdate CRAC website zone availability and class schedule descriptions to include the three new Term 4 timetables, highlighting BubFit Aqua as an in-water parent-and-baby fitness class.\n\nPlace promotional announcement banner on CRAC homepage linking directly to bookings: https://clarenceaquatic.perfectgym.com.au/clientportal2/#/Login."
  },
  {
    id: "lBu2gsuQCOyb6DP1ikjM",
    title: "Member Broadcast Email - Term 4 Bookings Open for New Programs",
    keyMessage: "Audience: Registered PerfectGym account holders, newsletter subscribers, lap swimmers, and swim school families.\n\nItem 1: Term 4 new classes open for booking today starting Tuesday 13 October:\n- Adult Squads: Tuesdays & Thursdays 6:00 AM (25m/50m lap pools)\n- Outdoor Aqua: Tuesdays & Thursdays 8:00 AM (outdoor 50m pool)\n- BubFit Aqua: Tuesdays 10:30 AM (heated leisure pool: a workout you do in the water with your baby in a flotation device)\n\nItem 2: Outdoor 50m Olympic Pool is fully open for regular season swimming.\n\nDirect booking link: https://clarenceaquatic.perfectgym.com.au/clientportal2/#/Login."
  },
  {
    id: "RoSYl6C4evTmyACaDPvQ",
    title: "Social & Portal Push - 1 Week to Go (BubFit Aqua + Adult Squads)",
    keyMessage: "1 week until Term 4 classes commence on Tuesday 13 October!\n\nAdult Squads reminder: Tuesday/Thursday 6:00 AM. Lane capacity strictly capped to ensure structured pacing.\n\nBubFit Aqua reminder: Tuesday 10:30 AM in the heated leisure pool. Workout in the pool together with your baby in a flotation device! Splash, tone, and bond in the water.\n\nBook early via https://clarenceaquatic.perfectgym.com.au/clientportal2/#/Login to secure your spot."
  },
  {
    id: "u9KcMjQC4SXsbWuy4DF6",
    title: "Launch Eve Reminder - All New Programs Start Tomorrow Morning",
    keyMessage: "Tomorrow (Tuesday 13 October) schedule:\n\n6:00 AM: Adult Squads (25m & 50m Lap Pools)\n8:00 AM: Outdoor Aqua (50m Olympic Pool)\n10:30 AM: BubFit Aqua (Heated Leisure Pool - workout in the warm water with your baby in a flotation device)\n\nReception check-in reminder: Arrive 10 minutes early to check in and collect pool deck entry tokens.\n\nFinal registration link: https://clarenceaquatic.perfectgym.com.au/clientportal2/#/Login."
  },
  {
    id: "BgtQsEhpj30XXfT1YBeb",
    title: "Week 1 Wrap-up - Join Us for Week 2",
    keyMessage: "That is a wrap on Week 1 of Term 4!\n\nAll classes continue next week:\n- Adult Squads (Tues & Thurs 6:00 AM)\n- Outdoor Aqua (Tues & Thurs 8:00 AM)\n- BubFit Aqua (Tues 10:30 AM)\n\nStandard casual entries and 10-visit multi-passes are available online or at the front counter.\n\nClient Portal booking link: https://clarenceaquatic.perfectgym.com.au/clientportal2/#/Login."
  }
];

async function updateBubFit() {
  console.log(`Updating ${updates.length} BubFit Aqua documents in Firestore...`);
  const now = new Date().toISOString();

  for (let i = 0; i < updates.length; i++) {
    const item = updates[i];
    const url = `${BASE_FIRESTORE_URL}/${item.id}?updateMask.fieldPaths=title&updateMask.fieldPaths=keyMessage&updateMask.fieldPaths=timestamp`;

    const payload = {
      fields: {
        title: { stringValue: item.title },
        keyMessage: { stringValue: item.keyMessage },
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
        console.log(`[${i + 1}/${updates.length}] UPDATED: "${item.title}"`);
      } else {
        const err = await res.json();
        console.error(`[${i + 1}/${updates.length}] FAILED: "${item.title}"`, err);
      }
    } catch (err) {
      console.error(`[${i + 1}/${updates.length}] ERROR: "${item.title}"`, err);
    }
  }
  console.log('BubFit Aqua concept correction complete across all documents!');
}

updateBubFit();
