/**
 * CRAC & YCP Facility Booking API Sync Engine & Privacy Sanitiser (v2.0)
 * 
 * Strict Compliance:
 * 1. Australian English spelling (sanitised, synchronisation, programme, centre).
 * 2. Zero patron PII in public payloads (names, phones, emails, member IDs are stripped).
 * 3. Exact facility pool definitions from API:
 *    - CRAC: 50m Pool (8 lanes), 25m Pool (8 lanes), Program Pool (3 zones)
 *    - YCP: 25m Pool (6 lanes)
 *    - Non-pool zones (Lawns, Splashpad, Multi-Purpose Room, Courts) are excluded.
 * 4. Manual closures and overrides retain highest priority over API bookings.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.ZoneSyncAPI = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {

    // --- 1. OFFICIAL POOL SPECIFICATIONS DERIVED FROM PGM API ---
    const FACILITY_SPECIFICATIONS = {
        CRAC: {
            id: 'CRAC',
            name: 'Clarence Regional Aquatic Centre',
            clubId: 1,
            suburb: 'Grafton, NSW',
            pools: [
                {
                    id: '50m Pool',
                    name: '50m Olympic Pool',
                    shortName: '50m Pool',
                    type: 'outdoor_50m',
                    capacity: 8,
                    unit: 'Lanes',
                    lanes: ['Lane 1', 'Lane 2', 'Lane 3', 'Lane 4', 'Lane 5', 'Lane 6', 'Lane 7', 'Lane 8'],
                    isOutdoor: true
                },
                {
                    id: '25m Pool',
                    name: '25m Competition Pool',
                    shortName: '25m Pool',
                    type: 'indoor_25m',
                    capacity: 8,
                    unit: 'Lanes',
                    lanes: ['Lane 1', 'Lane 2', 'Lane 3', 'Lane 4', 'Lane 5', 'Lane 6', 'Lane 7', 'Lane 8'],
                    isOutdoor: false
                },
                {
                    id: 'Program Pool',
                    name: 'Program Pool',
                    shortName: 'Program Pool',
                    type: 'indoor_program',
                    capacity: 3,
                    unit: 'Zones',
                    lanes: ['Zone 1', 'Zone 2', 'Zone 3'],
                    isOutdoor: false
                }
            ]
        },
        YCP: {
            id: 'YCP',
            name: 'Yamba Community Pool',
            clubId: 2,
            suburb: 'Yamba, NSW',
            pools: [
                {
                    id: '25m Pool',
                    name: '25m Community Pool',
                    shortName: '25m Pool',
                    type: 'outdoor_25m',
                    capacity: 6,
                    unit: 'Lanes',
                    lanes: ['Lane 1', 'Lane 2', 'Lane 3', 'Lane 4', 'Lane 5', 'Lane 6'],
                    isOutdoor: true
                }
            ]
        }
    };

    // --- 2. REALISTIC PGM API RAW DATASET ---
    // Contains genuine PGM booking patterns derived from the facility booking extract.
    // Includes sensitive fields (FullName, Phone, Email, UserNumber, Comments, ChargedAmount)
    // to prove that the sanitisation layer purges 100% of PII.
    const generateSeedRawBookings = () => {
        const today = new Date();
        const y = today.getFullYear();
        const m = today.getMonth();
        const d = today.getDate();

        // Helper to generate ISO timestamps for offsets
        const dt = (dayOffset, hour, minute) => {
            const date = new Date(y, m, d + dayOffset, hour, minute, 0);
            return date.toISOString();
        };

        return [
            // --- CRAC 50M POOL BOOKINGS (Reflecting Real-World Live Timetable) ---
            // Early Morning Squads (06:00 - 07:30)
            {
                BookingCalendarEventId: "BK-CRAC-50M-SQ01",
                FacilityBookingId: "FB-10491",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "Lane 6",
                Status: "Confirmed",
                Type: "Swim Club",
                StartDateTime: dt(0, 6, 0),
                EndDateTime: dt(0, 7, 30),
                EntireZoneBooking: false,
                FullName: "Elite Squads - [11/15]",
                Phone: "02 6642 3200",
                Email: "squads@clarenceaquatic.com.au",
                UserNumber: "SQ01",
                Comments: "Senior performance squad training.",
                ChargedAmount: 0.00
            },
            {
                BookingCalendarEventId: "BK-CRAC-50M-SQ02",
                FacilityBookingId: "FB-10492",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "Lane 8",
                Status: "Confirmed",
                Type: "Swim Club",
                StartDateTime: dt(0, 6, 0),
                EndDateTime: dt(0, 7, 0),
                EntireZoneBooking: false,
                FullName: "Adult SwimFit - [1/1]",
                Phone: "02 6642 3200",
                Email: "adultsquad@clarenceaquatic.com.au",
                UserNumber: "SQ02",
                Comments: "Adult SwimFit conditioning squad.",
                ChargedAmount: 0.00
            },

            // South Grafton High School - 4 Lanes Only (09:00 - 14:00)
            // Note: Lanes 5, 6, 7, 8 remain open for public lap swimming from 09:00 to 11:00!
            {
                BookingCalendarEventId: "BK-CRAC-50M-SG01",
                FacilityBookingId: "FB-10501",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "Lane 1",
                Status: "Confirmed",
                Type: "Internal Booking - Pool Lane",
                StartDateTime: dt(0, 9, 0),
                EndDateTime: dt(0, 14, 0),
                EntireZoneBooking: false,
                FullName: "South Grafton High School",
                Phone: "02 6642 3388",
                Email: "admin@southgraftonhs.nsw.edu.au",
                UserNumber: "S8891",
                Comments: "Secondary school sport and water recreation.",
                ChargedAmount: 160.00
            },
            {
                BookingCalendarEventId: "BK-CRAC-50M-SG02",
                FacilityBookingId: "FB-10502",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "Lane 2",
                Status: "Confirmed",
                Type: "Internal Booking - Pool Lane",
                StartDateTime: dt(0, 9, 0),
                EndDateTime: dt(0, 14, 0),
                EntireZoneBooking: false,
                FullName: "South Grafton High School",
                Phone: "02 6642 3388",
                Email: "admin@southgraftonhs.nsw.edu.au",
                UserNumber: "S8891",
                Comments: "Secondary school sport and water recreation.",
                ChargedAmount: 160.00
            },
            {
                BookingCalendarEventId: "BK-CRAC-50M-SG03",
                FacilityBookingId: "FB-10503",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "Lane 3",
                Status: "Confirmed",
                Type: "Internal Booking - Pool Lane",
                StartDateTime: dt(0, 9, 0),
                EndDateTime: dt(0, 14, 0),
                EntireZoneBooking: false,
                FullName: "South Grafton High School",
                Phone: "02 6642 3388",
                Email: "admin@southgraftonhs.nsw.edu.au",
                UserNumber: "S8891",
                Comments: "Secondary school sport and water recreation.",
                ChargedAmount: 160.00
            },
            {
                BookingCalendarEventId: "BK-CRAC-50M-SG04",
                FacilityBookingId: "FB-10504",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "Lane 4",
                Status: "Confirmed",
                Type: "Internal Booking - Pool Lane",
                StartDateTime: dt(0, 9, 0),
                EndDateTime: dt(0, 14, 0),
                EntireZoneBooking: false,
                FullName: "South Grafton High School",
                Phone: "02 6642 3388",
                Email: "admin@southgraftonhs.nsw.edu.au",
                UserNumber: "S8891",
                Comments: "Secondary school sport and water recreation.",
                ChargedAmount: 160.00
            },

            // Midday CVC School Groups (Lanes 5 & 6: 11:00 - 12:00)
            {
                BookingCalendarEventId: "BK-CRAC-50M-CVC01",
                FacilityBookingId: "FB-10511",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "Lane 5",
                Status: "Confirmed",
                Type: "Internal Booking - Pool Lane",
                StartDateTime: dt(0, 11, 0),
                EndDateTime: dt(0, 12, 0),
                EntireZoneBooking: false,
                FullName: "CVC CNAS",
                Phone: "02 6642 1199",
                Email: "cnas@det.nsw.edu.au",
                UserNumber: "S4401",
                Comments: "School sport program.",
                ChargedAmount: 32.00
            },
            {
                BookingCalendarEventId: "BK-CRAC-50M-CVC02",
                FacilityBookingId: "FB-10512",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "Lane 6",
                Status: "Confirmed",
                Type: "Internal Booking - Pool Lane",
                StartDateTime: dt(0, 11, 0),
                EndDateTime: dt(0, 12, 0),
                EntireZoneBooking: false,
                FullName: "CVC CNAS",
                Phone: "02 6642 1199",
                Email: "cnas@det.nsw.edu.au",
                UserNumber: "S4401",
                Comments: "School sport program.",
                ChargedAmount: 32.00
            },

            // CVC Grafton High School (Lanes 7 & 8: 11:30 - 12:30)
            {
                BookingCalendarEventId: "BK-CRAC-50M-CVC03",
                FacilityBookingId: "FB-10513",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "Lane 7",
                Status: "Confirmed",
                Type: "Internal Booking - Pool Lane",
                StartDateTime: dt(0, 11, 30),
                EndDateTime: dt(0, 12, 30),
                EntireZoneBooking: false,
                FullName: "CVC Grafton H.S",
                Phone: "02 6642 3355",
                Email: "grafton-h.school@det.nsw.edu.au",
                UserNumber: "S4412",
                Comments: "School physical education.",
                ChargedAmount: 32.00
            },
            {
                BookingCalendarEventId: "BK-CRAC-50M-CVC04",
                FacilityBookingId: "FB-10514",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "Lane 8",
                Status: "Confirmed",
                Type: "Internal Booking - Pool Lane",
                StartDateTime: dt(0, 11, 30),
                EndDateTime: dt(0, 12, 30),
                EntireZoneBooking: false,
                FullName: "CVC Grafton H.S",
                Phone: "02 6642 3355",
                Email: "grafton-h.school@det.nsw.edu.au",
                UserNumber: "S4412",
                Comments: "School physical education.",
                ChargedAmount: 32.00
            },

            // CVC Coutts Crossing Public School (Lanes 7 & 8: 12:30 - 14:00)
            {
                BookingCalendarEventId: "BK-CRAC-50M-CC01",
                FacilityBookingId: "FB-10521",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "Lane 7",
                Status: "Confirmed",
                Type: "Internal Booking - Pool Lane",
                StartDateTime: dt(0, 12, 30),
                EndDateTime: dt(0, 14, 0),
                EntireZoneBooking: false,
                FullName: "CVC Coutts Crossing PS",
                Phone: "02 6649 3225",
                Email: "couttscross-p.school@det.nsw.edu.au",
                UserNumber: "S5502",
                Comments: "Primary school water safety and swimming.",
                ChargedAmount: 64.00
            },
            {
                BookingCalendarEventId: "BK-CRAC-50M-CC02",
                FacilityBookingId: "FB-10522",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "Lane 8",
                Status: "Confirmed",
                Type: "Internal Booking - Pool Lane",
                StartDateTime: dt(0, 12, 30),
                EndDateTime: dt(0, 14, 0),
                EntireZoneBooking: false,
                FullName: "CVC Coutts Crossing PS",
                Phone: "02 6649 3225",
                Email: "couttscross-p.school@det.nsw.edu.au",
                UserNumber: "S5502",
                Comments: "Primary school water safety and swimming.",
                ChargedAmount: 64.00
            },

            // Afternoon CVC Grafton High School (Lane 8: 14:00 - 14:45)
            {
                BookingCalendarEventId: "BK-CRAC-50M-GH01",
                FacilityBookingId: "FB-10523",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "Lane 8",
                Status: "Confirmed",
                Type: "Internal Booking - Pool Lane",
                StartDateTime: dt(0, 14, 0),
                EndDateTime: dt(0, 14, 45),
                EntireZoneBooking: false,
                FullName: "CVC Grafton H.S",
                Phone: "02 6642 3355",
                Email: "grafton-h.school@det.nsw.edu.au",
                UserNumber: "S4412",
                Comments: "Afternoon swimming assessment.",
                ChargedAmount: 32.00
            },

            // Learn to Swim - Shark Level 7 (Lane 8: 14:45 - 15:30)
            {
                BookingCalendarEventId: "BK-CRAC-50M-LTS01",
                FacilityBookingId: "FB-10524",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "Lane 8",
                Status: "Confirmed",
                Type: "Internal Booking - Pool Lane",
                StartDateTime: dt(0, 14, 45),
                EndDateTime: dt(0, 15, 30),
                EntireZoneBooking: false,
                FullName: "Shark - Level 7",
                Phone: "02 6642 3200",
                Email: "swimschool@clarenceaquatic.com.au",
                UserNumber: "LTS07",
                Comments: "Learn to Swim level 7 stroke proficiency.",
                ChargedAmount: 0.00
            },

            // Afternoon Squads (Lane 5 & Lane 6: 15:30 - 17:00)
            {
                BookingCalendarEventId: "BK-CRAC-50M-SQ03",
                FacilityBookingId: "FB-10531",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "Lane 5",
                Status: "Confirmed",
                Type: "Swim Club",
                StartDateTime: dt(0, 15, 30),
                EndDateTime: dt(0, 17, 0),
                EntireZoneBooking: false,
                FullName: "A Squad - [13/10]",
                Phone: "02 6642 3200",
                Email: "squads@clarenceaquatic.com.au",
                UserNumber: "SQ03",
                Comments: "Senior swim coaching.",
                ChargedAmount: 0.00
            },
            {
                BookingCalendarEventId: "BK-CRAC-50M-SQ04",
                FacilityBookingId: "FB-10532",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "Lane 6",
                Status: "Confirmed",
                Type: "Swim Club",
                StartDateTime: dt(0, 15, 30),
                EndDateTime: dt(0, 17, 0),
                EntireZoneBooking: false,
                FullName: "B Squad - [2/10]",
                Phone: "02 6642 3200",
                Email: "squads@clarenceaquatic.com.au",
                UserNumber: "SQ04",
                Comments: "Intermediate development squad coaching.",
                ChargedAmount: 0.00
            },

            // D-Squads (Lane 8: 15:30 - 16:30)
            {
                BookingCalendarEventId: "BK-CRAC-50M-SQ05",
                FacilityBookingId: "FB-10534",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "Lane 8",
                Status: "Confirmed",
                Type: "Swim Club",
                StartDateTime: dt(0, 15, 30),
                EndDateTime: dt(0, 16, 30),
                EntireZoneBooking: false,
                FullName: "D-Squads - [10/15]",
                Phone: "02 6642 3200",
                Email: "squads@clarenceaquatic.com.au",
                UserNumber: "SQ05",
                Comments: "Development squad coaching.",
                ChargedAmount: 0.00
            },

            // Learn to Swim - Dolphins Level 6 (Lane 8: 16:30 - 17:30)
            {
                BookingCalendarEventId: "BK-CRAC-50M-LTS02",
                FacilityBookingId: "FB-10535",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "Lane 8",
                Status: "Confirmed",
                Type: "Internal Booking - Pool Lane",
                StartDateTime: dt(0, 16, 30),
                EndDateTime: dt(0, 17, 30),
                EntireZoneBooking: false,
                FullName: "Dolphins - Level 6 - 1",
                Phone: "02 6642 3200",
                Email: "swimschool@clarenceaquatic.com.au",
                UserNumber: "LTS06",
                Comments: "Learn to Swim level 6 stroke development.",
                ChargedAmount: 0.00
            },

            // Whole Pool Carnival Example placed on Day 3 (Demonstrating whole-pool hire behavior)
            {
                BookingCalendarEventId: "BK-CRAC-50M-CARNIVAL-D3",
                FacilityBookingId: "FB-10599",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "50m Pool",
                Status: "Confirmed",
                Type: "Internal Booking - Pool 50m",
                StartDateTime: dt(3, 9, 0),
                EndDateTime: dt(3, 14, 30),
                EntireZoneBooking: true,
                FullName: "Clarence Valley District Swimming Carnival",
                Phone: "02 6642 8811",
                Email: "sports@clarencedistrict.nsw.edu.au",
                UserNumber: "S9081",
                Comments: "Annual district championship carnival. Entire 50m pool hire.",
                ChargedAmount: 1100.00
            },

            // --- CRAC 25M POOL BOOKINGS ---
            {
                BookingCalendarEventId: "BK-CRAC-25M-01",
                FacilityBookingId: "FB-20101",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "25m Pool Lane 1",
                Status: "Confirmed",
                Type: "Internal Booking - 25m Pool Lane",
                StartDateTime: dt(0, 9, 0),
                EndDateTime: dt(0, 11, 0),
                EntireZoneBooking: false,
                // SENSITIVE PATRON PII
                FullName: "Nathan Cooper (Grafton HS Support Unit)",
                Phone: "0400 123 456",
                Email: "ncooper@graftonhs.nsw.edu.au",
                UserNumber: "S1029",
                Comments: "Support unit swimming & water safety assessment.",
                ChargedAmount: 64.00
            },
            {
                BookingCalendarEventId: "BK-CRAC-25M-02",
                FacilityBookingId: "FB-20102",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "25m Pool Lane 2",
                Status: "Confirmed",
                Type: "Internal Booking - 25m Pool Lane",
                StartDateTime: dt(0, 9, 0),
                EndDateTime: dt(0, 11, 0),
                EntireZoneBooking: false,
                FullName: "Nathan Cooper (Grafton HS Support Unit)",
                Phone: "0400 123 456",
                Email: "ncooper@graftonhs.nsw.edu.au",
                UserNumber: "S1029",
                Comments: "Support unit swimming & water safety assessment.",
                ChargedAmount: 64.00
            },
            {
                BookingCalendarEventId: "BK-CRAC-25M-03",
                FacilityBookingId: "FB-20103",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "25m Pool Lane 5",
                Status: "Confirmed",
                Type: "Internal Booking - 25m Pool Lane",
                StartDateTime: dt(0, 12, 0),
                EndDateTime: dt(0, 13, 0),
                EntireZoneBooking: false,
                FullName: "South Grafton High School (PE Dept)",
                Phone: "02 6642 3388",
                Email: "pe@southgraftonhs.nsw.edu.au",
                UserNumber: "S8891",
                Comments: "Year 10 biathlon training.",
                ChargedAmount: 32.00
            },
            {
                BookingCalendarEventId: "BK-CRAC-25M-04",
                FacilityBookingId: "FB-20104",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "25m Pool Lane 6",
                Status: "Confirmed",
                Type: "Internal Booking - 25m Pool Lane",
                StartDateTime: dt(0, 15, 30),
                EndDateTime: dt(0, 18, 0),
                EntireZoneBooking: false,
                FullName: "Clarence Valley Swim Academy",
                Phone: "0433 998 112",
                Email: "swimacademy@clarencevalley.com",
                UserNumber: "C303",
                Comments: "Stroke development levels 4 to 6.",
                ChargedAmount: 120.00
            },
            {
                BookingCalendarEventId: "BK-CRAC-25M-05",
                FacilityBookingId: "FB-20105",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "25m Pool Lane 7",
                Status: "Confirmed",
                Type: "Internal Booking - 25m Pool Lane",
                StartDateTime: dt(0, 15, 30),
                EndDateTime: dt(0, 18, 0),
                EntireZoneBooking: false,
                FullName: "Clarence Valley Swim Academy",
                Phone: "0433 998 112",
                Email: "swimacademy@clarencevalley.com",
                UserNumber: "C303",
                Comments: "Stroke development levels 4 to 6.",
                ChargedAmount: 120.00
            },
            {
                BookingCalendarEventId: "BK-CRAC-25M-06",
                FacilityBookingId: "FB-20106",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "25m Pool Lane 8",
                Status: "Confirmed",
                Type: "Internal Booking - 25m Pool Lane",
                StartDateTime: dt(0, 15, 30),
                EndDateTime: dt(0, 18, 0),
                EntireZoneBooking: false,
                FullName: "Clarence Valley Swim Academy",
                Phone: "0433 998 112",
                Email: "swimacademy@clarencevalley.com",
                UserNumber: "C303",
                Comments: "Stroke development levels 4 to 6.",
                ChargedAmount: 120.00
            },

            // --- CRAC PROGRAM POOL BOOKINGS ---
            // Zone 1 is booked for external hire (Bookings); Zone 2 and Zone 3 are Learn to Swim
            // Morning Bookings (08:30 - 11:30)
            {
                BookingCalendarEventId: "BK-CRAC-PRG-01",
                FacilityBookingId: "FB-30201",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "Program Pool - Zone 1",
                Status: "Confirmed",
                Type: "Internal Booking - Program Pool Zone",
                StartDateTime: dt(0, 8, 30),
                EndDateTime: dt(0, 11, 30),
                EntireZoneBooking: false,
                FullName: "Community Group Facility Hire",
                Phone: "02 6642 7700",
                Email: "hire@clarenceaquatic.com.au",
                UserNumber: "C401",
                Comments: "Zone 1 private group hire.",
                ChargedAmount: 180.00
            },
            {
                BookingCalendarEventId: "BK-CRAC-PRG-02",
                FacilityBookingId: "FB-30202",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "Program Pool - Zone 2",
                Status: "Confirmed",
                Type: "Internal Booking - Program Pool Zone",
                StartDateTime: dt(0, 8, 30),
                EndDateTime: dt(0, 11, 30),
                EntireZoneBooking: false,
                FullName: "CRAC Swim School (LTS)",
                Phone: "02 6642 3200",
                Email: "swimschool@clarenceaquatic.com.au",
                UserNumber: "INT-LTS-01",
                Comments: "Infant and toddler Learn to Swim classes in Zone 2.",
                ChargedAmount: 0.00
            },
            {
                BookingCalendarEventId: "BK-CRAC-PRG-03",
                FacilityBookingId: "FB-30203",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "Program Pool - Zone 3",
                Status: "Confirmed",
                Type: "Internal Booking - Program Pool Zone",
                StartDateTime: dt(0, 8, 30),
                EndDateTime: dt(0, 11, 30),
                EntireZoneBooking: false,
                FullName: "CRAC Swim School (LTS)",
                Phone: "02 6642 3200",
                Email: "swimschool@clarenceaquatic.com.au",
                UserNumber: "INT-LTS-02",
                Comments: "Pre-school beginner Learn to Swim classes in Zone 3.",
                ChargedAmount: 0.00
            },

            // Midday School Intensive (12:00 - 13:30)
            // Note: Zone 1 & Zone 2 remain completely open for public warm water swimming!
            {
                BookingCalendarEventId: "BK-CRAC-PRG-04",
                FacilityBookingId: "FB-30204",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "Program Pool - Zone 3",
                Status: "Confirmed",
                Type: "Internal Booking - Program Pool Zone",
                StartDateTime: dt(0, 12, 0),
                EndDateTime: dt(0, 13, 30),
                EntireZoneBooking: false,
                FullName: "Coutts Crossing Public School",
                Phone: "02 6649 3225",
                Email: "couttscross-p.school@det.nsw.edu.au",
                UserNumber: "S5502",
                Comments: "Primary school swim intensive in Zone 3.",
                ChargedAmount: 90.00
            },

            // Afternoon Hire & Swim School (15:30 - 18:00)
            {
                BookingCalendarEventId: "BK-CRAC-PRG-05",
                FacilityBookingId: "FB-30205",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "Program Pool - Zone 1",
                Status: "Confirmed",
                Type: "Internal Booking - Program Pool Zone",
                StartDateTime: dt(0, 15, 30),
                EndDateTime: dt(0, 17, 30),
                EntireZoneBooking: false,
                FullName: "Community Group Facility Hire",
                Phone: "02 6643 1122",
                Email: "hire@clarenceaquatic.com.au",
                UserNumber: "C402",
                Comments: "Zone 1 private group hire.",
                ChargedAmount: 120.00
            },
            {
                BookingCalendarEventId: "BK-CRAC-PRG-06",
                FacilityBookingId: "FB-30206",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "Program Pool - Zone 2",
                Status: "Confirmed",
                Type: "Internal Booking - Program Pool Zone",
                StartDateTime: dt(0, 15, 30),
                EndDateTime: dt(0, 18, 0),
                EntireZoneBooking: false,
                FullName: "CRAC Swim School (LTS)",
                Phone: "02 6642 3200",
                Email: "swimschool@clarenceaquatic.com.au",
                UserNumber: "INT-LTS-03",
                Comments: "Afternoon junior Learn to Swim classes in Zone 2.",
                ChargedAmount: 0.00
            },
            {
                BookingCalendarEventId: "BK-CRAC-PRG-07",
                FacilityBookingId: "FB-30207",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "Program Pool - Zone 3",
                Status: "Confirmed",
                Type: "Internal Booking - Program Pool Zone",
                StartDateTime: dt(0, 15, 30),
                EndDateTime: dt(0, 18, 0),
                EntireZoneBooking: false,
                FullName: "CRAC Swim School (LTS)",
                Phone: "02 6642 3200",
                Email: "swimschool@clarenceaquatic.com.au",
                UserNumber: "INT-LTS-04",
                Comments: "Afternoon Learn to Swim classes in Zone 3.",
                ChargedAmount: 0.00
            },

            // --- YAMBA COMMUNITY POOL (YCP) 25M POOL BOOKINGS ---
            {
                BookingCalendarEventId: "BK-YCP-25M-01",
                FacilityBookingId: "FB-40101",
                Club: "Yamba Community Pool",
                ClubId: 2,
                Zone: "25m Pool - Lane 3",
                Status: "Confirmed",
                Type: "Internal Booking - Yamba 25m Pool",
                StartDateTime: dt(0, 9, 0),
                EndDateTime: dt(0, 14, 0),
                EntireZoneBooking: false,
                FullName: "Yamba Public School (Teacher Elyse Stone)",
                Phone: "02 6646 2245",
                Email: "elyse.stone@det.nsw.edu.au",
                UserNumber: "S7712",
                Comments: "Department of Education School Swimming & Water Safety Program.",
                ChargedAmount: 220.00
            },
            {
                BookingCalendarEventId: "BK-YCP-25M-02",
                FacilityBookingId: "FB-40102",
                Club: "Yamba Community Pool",
                ClubId: 2,
                Zone: "25m Pool - Lane 4",
                Status: "Confirmed",
                Type: "Internal Booking - Yamba 25m Pool",
                StartDateTime: dt(0, 9, 0),
                EndDateTime: dt(0, 14, 0),
                EntireZoneBooking: false,
                FullName: "Yamba Public School (Teacher Elyse Stone)",
                Phone: "02 6646 2245",
                Email: "elyse.stone@det.nsw.edu.au",
                UserNumber: "S7712",
                Comments: "Department of Education School Swimming & Water Safety Program.",
                ChargedAmount: 220.00
            },
            {
                BookingCalendarEventId: "BK-YCP-25M-03",
                FacilityBookingId: "FB-40103",
                Club: "Yamba Community Pool",
                ClubId: 2,
                Zone: "25m Pool - Lane 5",
                Status: "Confirmed",
                Type: "Internal Booking - Yamba 25m Pool",
                StartDateTime: dt(0, 9, 0),
                EndDateTime: dt(0, 14, 0),
                EntireZoneBooking: false,
                FullName: "Yamba Public School (Teacher Elyse Stone)",
                Phone: "02 6646 2245",
                Email: "elyse.stone@det.nsw.edu.au",
                UserNumber: "S7712",
                Comments: "Department of Education School Swimming & Water Safety Program.",
                ChargedAmount: 220.00
            },
            {
                BookingCalendarEventId: "BK-YCP-25M-04",
                FacilityBookingId: "FB-40104",
                Club: "Yamba Community Pool",
                ClubId: 2,
                Zone: "25m Pool - Lane 6",
                Status: "Confirmed",
                Type: "Internal Booking - Yamba 25m Pool",
                StartDateTime: dt(0, 9, 0),
                EndDateTime: dt(0, 14, 0),
                EntireZoneBooking: false,
                FullName: "Yamba Public School (Teacher Elyse Stone)",
                Phone: "02 6646 2245",
                Email: "elyse.stone@det.nsw.edu.au",
                UserNumber: "S7712",
                Comments: "Department of Education School Swimming & Water Safety Program.",
                ChargedAmount: 220.00
            },
            {
                BookingCalendarEventId: "BK-YCP-25M-05",
                FacilityBookingId: "FB-40105",
                Club: "Yamba Community Pool",
                ClubId: 2,
                Zone: "25m Pool - Lane 2",
                Status: "Confirmed",
                Type: "Internal Booking - Yamba 25m Pool",
                StartDateTime: dt(0, 14, 0),
                EndDateTime: dt(0, 15, 30),
                EntireZoneBooking: false,
                FullName: "Chatsworth Island Public School",
                Phone: "02 6646 4344",
                Email: "chatswort-p.school@det.nsw.edu.au",
                UserNumber: "S8019",
                Comments: "Chatsworth swim intensive stage 2.",
                ChargedAmount: 85.00
            },

            // --- YAMBA AFTERNOON SWIM SCHOOL & SQUADS (LTS) ---
            // Note: Lanes 5 & 6 remain open for general public lap swimming!
            {
                BookingCalendarEventId: "BK-YCP-25M-LTS01",
                FacilityBookingId: "FB-40111",
                Club: "Yamba Community Pool",
                ClubId: 2,
                Zone: "25m Pool - Lane 1",
                Status: "Confirmed",
                Type: "Learn to Swim",
                StartDateTime: dt(0, 15, 30),
                EndDateTime: dt(0, 17, 30),
                EntireZoneBooking: false,
                FullName: "YCP Swim School - Starfish & Seahorses",
                Phone: "02 6646 1750",
                Email: "yambapool@clarence.nsw.gov.au",
                UserNumber: "YCP-LTS-01",
                Comments: "Afternoon infant and toddler Learn to Swim classes.",
                ChargedAmount: 0.00
            },
            {
                BookingCalendarEventId: "BK-YCP-25M-LTS02",
                FacilityBookingId: "FB-40112",
                Club: "Yamba Community Pool",
                ClubId: 2,
                Zone: "25m Pool - Lane 2",
                Status: "Confirmed",
                Type: "Learn to Swim",
                StartDateTime: dt(0, 15, 30),
                EndDateTime: dt(0, 17, 30),
                EntireZoneBooking: false,
                FullName: "YCP Swim School - Crabs & Turtles",
                Phone: "02 6646 1750",
                Email: "yambapool@clarence.nsw.gov.au",
                UserNumber: "YCP-LTS-02",
                Comments: "Junior Learn to Swim stroke proficiency.",
                ChargedAmount: 0.00
            },
            {
                BookingCalendarEventId: "BK-YCP-25M-LTS03",
                FacilityBookingId: "FB-40113",
                Club: "Yamba Community Pool",
                ClubId: 2,
                Zone: "25m Pool - Lane 3",
                Status: "Confirmed",
                Type: "Learn to Swim",
                StartDateTime: dt(0, 15, 30),
                EndDateTime: dt(0, 17, 30),
                EntireZoneBooking: false,
                FullName: "YCP Swim School - Seals & Stingrays",
                Phone: "02 6646 1750",
                Email: "yambapool@clarence.nsw.gov.au",
                UserNumber: "YCP-LTS-03",
                Comments: "Intermediate Learn to Swim classes.",
                ChargedAmount: 0.00
            },
            {
                BookingCalendarEventId: "BK-YCP-25M-SQ01",
                FacilityBookingId: "FB-40114",
                Club: "Yamba Community Pool",
                ClubId: 2,
                Zone: "25m Pool - Lane 4",
                Status: "Confirmed",
                Type: "Swim Club",
                StartDateTime: dt(0, 16, 0),
                EndDateTime: dt(0, 17, 30),
                EntireZoneBooking: false,
                FullName: "Yamba Junior Squads",
                Phone: "02 6646 1750",
                Email: "yambapool@clarence.nsw.gov.au",
                UserNumber: "YCP-SQ-01",
                Comments: "Junior squad endurance and technique coaching.",
                ChargedAmount: 0.00
            },

            // --- EXCLUDED NON-POOL BOOKINGS IN RAW API ---
            // (These exist in the raw PGM database but MUST be filtered out as per instructions)
            {
                BookingCalendarEventId: "BK-RAW-NON-POOL-01",
                FacilityBookingId: "FB-9901",
                Club: "Clarence Aquatic",
                ClubId: 1,
                Zone: "Lawns",
                Status: "Confirmed",
                Type: "Internal Booking - Lawns",
                StartDateTime: dt(0, 15, 0),
                EndDateTime: dt(0, 17, 0),
                EntireZoneBooking: true,
                FullName: "Latia Williams (0431569587) - Birthday Party",
                Phone: "0431 569 587",
                Email: "latia@example.com",
                UserNumber: "M9901",
                Comments: "Kids birthday party with 15 guests at BBQ.",
                ChargedAmount: 75.00
            },
            {
                BookingCalendarEventId: "BK-RAW-NON-POOL-02",
                FacilityBookingId: "FB-9902",
                Club: "Yamba Community Pool",
                ClubId: 2,
                Zone: "Court 1",
                Status: "Confirmed",
                Type: "Court Hire",
                StartDateTime: dt(0, 17, 0),
                EndDateTime: dt(0, 19, 0),
                EntireZoneBooking: true,
                FullName: "Yamba Tennis Social",
                Phone: "0400 998 776",
                Email: "tennis@yamba.org.au",
                UserNumber: "C901",
                Comments: "Court lights requested.",
                ChargedAmount: 40.00
            }
        ];
    };

    // --- 3. PRIVACY SANITISER & ZONE NORMALISER ---
    class PrivacySanitiser {
        /**
         * Resolves the target pool and normalises the lane name based on raw PGM Club and Zone.
         * Returns null if the zone is not one of the authorized pools.
         */
        static resolvePoolAndLane(rawBooking) {
            const clubId = rawBooking.ClubId;
            const rawZone = (rawBooking.Zone || '').trim();

            if (clubId === 1 || rawBooking.Club === "Clarence Aquatic") {
                // CRAC POOL 1: 50m Pool
                if (rawZone === '50m Pool') {
                    return {
                        poolId: '50m Pool',
                        lanes: Array.from({length: 8}, (_, i) => `Lane ${i+1}`),
                        isEntirePool: true
                    };
                }
                if (/^Lane\s+[1-8]$/i.test(rawZone)) {
                    return {
                        poolId: '50m Pool',
                        lanes: [rawZone],
                        isEntirePool: false
                    };
                }

                // CRAC POOL 2: 25m Pool
                if (rawZone === '25m Pool') {
                    return {
                        poolId: '25m Pool',
                        lanes: Array.from({length: 8}, (_, i) => `Lane ${i+1}`),
                        isEntirePool: true
                    };
                }
                const match25 = rawZone.match(/25m\s+Pool\s+Lane\s+([1-8])/i);
                if (match25) {
                    return {
                        poolId: '25m Pool',
                        lanes: [`Lane ${match25[1]}`],
                        isEntirePool: false
                    };
                }

                // CRAC POOL 3: Program Pool
                if (rawZone === 'Program Pool') {
                    return {
                        poolId: 'Program Pool',
                        lanes: ['Zone 1', 'Zone 2', 'Zone 3'],
                        isEntirePool: true
                    };
                }
                const matchProg = rawZone.match(/Program\s+Pool\s*-\s*Zone\s+([1-3])/i);
                if (matchProg) {
                    return {
                        poolId: 'Program Pool',
                        lanes: [`Zone ${matchProg[1]}`],
                        isEntirePool: false
                    };
                }

                // Any other zone (Lawns, Splashpad, Multi-Purpose Room) is filtered out
                return null;
            }

            if (clubId === 2 || rawBooking.Club === "Yamba Community Pool") {
                // YCP POOL 1: 25m Pool
                if (rawZone === '25m Pool') {
                    return {
                        poolId: '25m Pool',
                        lanes: Array.from({length: 6}, (_, i) => `Lane ${i+1}`),
                        isEntirePool: true
                    };
                }
                const matchYcp = rawZone.match(/25m\s+Pool\s*-\s*Lane\s+([1-6])/i);
                if (matchYcp) {
                    return {
                        poolId: '25m Pool',
                        lanes: [`Lane ${matchYcp[1]}`],
                        isEntirePool: false
                    };
                }

                // Any other zone (Court 1..4) is filtered out
                return null;
            }

            return null;
        }

        /**
         * Converts raw PGM booking into an anonymous public classification:
         * 'Learn to Swim', 'Squads', 'Aqua Fitness', 'School Carnival', or 'Bookings'.
         * Strictly sanitised to protect patron privacy and ensure clear patron communication.
         */
        static classifyCategory(rawBooking) {
            const type = (rawBooking.Type || rawBooking.type || rawBooking.bookingType || '').toLowerCase();
            const comments = (rawBooking.Comments || rawBooking.comments || rawBooking.description || '').toLowerCase();
            const name = (rawBooking.FullName || rawBooking.name || rawBooking.title || '').toLowerCase();
            const combined = `${type} ${comments} ${name}`;

            // 1. School Carnivals (Whole pool hire events)
            if (combined.includes('carnival')) {
                return 'School Carnival';
            }

            // 2. Aqua Fitness
            if (combined.includes('aqua') || combined.includes('aerobics')) {
                return 'Aqua Fitness';
            }

            // 3. Squads (Dedicated stroke development, endurance and squad coaching)
            if (combined.includes('squad') || combined.includes('swimfit') || combined.includes('swim club')) {
                return 'Squads';
            }

            // 4. External School Group Hire (e.g. Yamba PS, Chatsworth Island PS, Grafton HS, CVC)
            // School swimming, sport, and water safety schemes are classified as 'Bookings' to differentiate from centre swim school
            const isSchoolBooking = !combined.includes('swim school') && !combined.includes('swim academy') && (
                combined.includes('public school') ||
                combined.includes('high school') ||
                combined.includes('primary school') ||
                combined.includes('p.school') ||
                combined.includes('h.school') ||
                combined.includes('secondary') ||
                combined.includes('cvc') ||
                name.includes('school')
            );
            if (isSchoolBooking) {
                return 'Bookings';
            }

            // 5. Learn to Swim (Centre Swim School curriculum levels & lessons)
            if (
                combined.includes('learn to swim') ||
                combined.includes('swim school') ||
                combined.includes('swim academy') ||
                combined.includes('swimming lesson') ||
                combined.includes('swim lesson') ||
                combined.includes('lesson') ||
                combined.includes('lessons') ||
                combined.includes('lts') ||
                combined.includes('starfish') ||
                combined.includes('seahorse') ||
                combined.includes('crab') ||
                combined.includes('turtle') ||
                combined.includes('seal') ||
                combined.includes('stingray') ||
                combined.includes('dolphin') ||
                combined.includes('shark') ||
                combined.includes('orca') ||
                combined.includes('tadpole') ||
                combined.includes('platypus')
            ) {
                return 'Learn to Swim';
            }

            // 6. Bookings (Default for all community group hires, council hires, and lane reservations)
            return 'Bookings';
        }

        /**
         * Sanitises a raw booking into a strictly safe public availability block.
         * Returns null if booking is for a non-pool zone.
         */
        static sanitise(rawBooking) {
            const resolution = PrivacySanitiser.resolvePoolAndLane(rawBooking);
            if (!resolution) return null; // Non-pool zone filtered out!

            const start = new Date(rawBooking.StartDateTime);
            const end = new Date(rawBooking.EndDateTime);
            const category = PrivacySanitiser.classifyCategory(rawBooking);

            const lanesText = resolution.isEntirePool 
                ? `All ${resolution.lanes.length} ${resolution.poolId === 'Program Pool' ? 'zones' : 'lanes'}` 
                : resolution.lanes.join(', ');

            // Strictly map public title to canonical facility category
            // Purges all high-detail institutional names, school identifiers, squad participant counters, and PII.
            const publicTitle = category;

            return {
                id: `sync_${rawBooking.BookingCalendarEventId}`,
                rawRefId: rawBooking.BookingCalendarEventId,
                title: publicTitle,
                venue: (rawBooking.ClubId === 2 || rawBooking.Club === "Yamba Community Pool") ? 'YCP' : 'CRAC',
                pool: resolution.poolId,
                zones: resolution.lanes,
                isEntirePool: resolution.isEntirePool,
                startDateTime: start.toISOString(),
                endDateTime: end.toISOString(),
                startTime: start.toTimeString().substring(0, 5),
                endTime: end.toTimeString().substring(0, 5),
                category,
                status: rawBooking.Status || 'Confirmed',
                source: 'api_sync',
                isManualOverride: false,
                publicNote: `${lanesText} allocated for ${category}. Not available for general public lap swimming.`
            };
        }

        /**
         * Verifies that the public payload contains zero PII.
         */
        static auditPayload(sanitisedList) {
            const forbiddenKeys = [
                'fullname', 'full_name', 'name', 'phone', 'email', 
                'usernumber', 'user_number', 'comments', 'chargedamount', 
                'amount', 'invoice', 'parent', 'student'
            ];

            let piiViolations = 0;
            sanitisedList.forEach(item => {
                const keys = Object.keys(item).map(k => k.toLowerCase());
                for (const fk of forbiddenKeys) {
                    if (keys.includes(fk)) piiViolations++;
                }
            });

            return {
                checkedRecords: sanitisedList.length,
                piiViolations,
                isCompliant: piiViolations === 0,
                auditTimestamp: new Date().toISOString()
            };
        }
    }

    // --- 4. SYNCHRONISATION CONTROLLER ---
    class SyncEngine {
        constructor(options = {}) {
            this.storageKey = typeof options === 'string' ? options : (options.storageKey || 'crac_manual_closures_v2');
            this.defaultVenue = options.venue || 'CRAC';
            this.rawBookings = generateSeedRawBookings();
            this.manualClosures = [];
            this.listeners = [];
            this.syncHistory = [];
            this.isAutoSyncEnabled = true;
            this.syncIntervalMs = 15000;
            this.timer = null;

            this.loadLocalOverrides();
            this.startAutoSync();
        }

        loadLocalOverrides() {
            try {
                if (typeof localStorage !== 'undefined') {
                    const stored = localStorage.getItem(this.storageKey);
                    if (stored) {
                        this.manualClosures = JSON.parse(stored);
                        return;
                    }
                }
                
                // Default: Clean state so initial load reflects 100% pure live API synchronisation.
                // Staff or simulations can add manual overrides anytime.
                this.manualClosures = [];
                this.saveLocalOverrides();
            } catch (e) {
                console.warn("Storage notice:", e);
            }
        }

        saveLocalOverrides() {
            try {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem(this.storageKey, JSON.stringify(this.manualClosures));
                }
            } catch (e) {
                console.warn("Storage save notice:", e);
            }
        }

        subscribe(callback) {
            this.listeners.push(callback);
            callback(this.getConsolidatedSchedule());
            return () => {
                this.listeners = this.listeners.filter(cb => cb !== callback);
            };
        }

        notify() {
            const data = this.getConsolidatedSchedule(this.defaultVenue);
            this.listeners.forEach(cb => cb(data));
        }

        getRawApiBookings(venueFilter = 'CRAC') {
            const targetClubId = venueFilter === 'YCP' ? 2 : 1;
            return this.rawBookings.filter(b => b.ClubId === targetClubId);
        }

        getConsolidatedSchedule(venueFilter) {
            const activeVenue = venueFilter || this.defaultVenue || 'CRAC';
            const targetClubId = activeVenue === 'YCP' ? 2 : 1;
            
            // 1. Ingest raw bookings and filter down through Privacy Sanitiser
            // Non-pool bookings are naturally excluded because sanitise() returns null
            // Real PGM statuses observed in export: Absent, Cancelled, Finished (no "Confirmed").
            // Only Cancelled bookings free the lane; everything else still occupies it.
            const rawClub = this.rawBookings.filter(b => b.ClubId === targetClubId && String(b.Status || '').toLowerCase() !== 'cancelled');
            const sanitised = rawClub
                .map(PrivacySanitiser.sanitise)
                .filter(Boolean); // Drop nulls (non-pools)

            // 2. Fetch manual staff closures for this venue
            const venueClosures = this.manualClosures.filter(c => c.venue === activeVenue);

            // 3. Verify privacy compliance
            const audit = PrivacySanitiser.auditPayload(sanitised);

            return {
                venue: activeVenue,
                lastSyncTime: new Date().toLocaleTimeString('en-AU', { hour12: true }),
                totalRawIngested: rawClub.length,
                totalSanitised: sanitised.length,
                totalManualClosures: venueClosures.length,
                nonPoolsPurged: rawClub.length - sanitised.length,
                audit,
                // Merged schedule: Manual closures take precedence over API bookings
                events: [...venueClosures, ...sanitised]
            };
        }

        addManualClosure(arg1, arg2) {
            let closureData = arg1;
            let venueOverride = this.defaultVenue;
            if (typeof arg1 === 'string' && arg2 && typeof arg2 === 'object') {
                venueOverride = arg1;
                closureData = { ...arg2, venue: arg1 };
            }
            if (!closureData || typeof closureData !== 'object') {
                console.error("Invalid closureData passed to addManualClosure:", arg1, arg2);
                return null;
            }

            const isEntire = Boolean(
                closureData.isEntirePool || 
                (Array.isArray(closureData.zones) && (closureData.zones.includes('Entire Zone') || closureData.zones.includes('All Lanes') || closureData.zones.includes('All Zones'))) ||
                (Array.isArray(closureData.zones) && closureData.zones.length >= 6)
            );

            const now = new Date();
            const sDate = closureData.startDateTime ? new Date(closureData.startDateTime) : now;
            const eDate = closureData.endDateTime ? new Date(closureData.endDateTime) : new Date(now.getTime() + 30 * 60000);

            const sValid = !isNaN(sDate.getTime()) ? sDate : now;
            const eValid = !isNaN(eDate.getTime()) ? eDate : new Date(now.getTime() + 30 * 60000);

            const pad = (n) => String(n).padStart(2, '0');
            const startTimeStr = closureData.startTime || `${pad(sValid.getHours())}:${pad(sValid.getMinutes())}`;
            const endTimeStr = closureData.endTime || `${pad(eValid.getHours())}:${pad(eValid.getMinutes())}`;

            const newClosure = {
                id: closureData.id || `manual_${Date.now()}`,
                venue: closureData.venue || venueOverride || 'CRAC',
                pool: closureData.pool || (closureData.venue === 'YCP' ? '25m Pool' : '50m Pool'),
                zones: Array.isArray(closureData.zones) ? closureData.zones : (closureData.zones ? [closureData.zones] : ['All Lanes']),
                isEntirePool: isEntire,
                startDateTime: sValid.toISOString(),
                endDateTime: eValid.toISOString(),
                startTime: startTimeStr,
                endTime: endTimeStr,
                category: closureData.category || 'Maintenance Closure',
                title: closureData.title || 'Scheduled Pool Closure',
                reason: closureData.reason || 'Operational maintenance.',
                severity: closureData.severity || 'alert',
                source: 'manual_override',
                isManualOverride: true,
                isDirective: true,
                createdAt: new Date().toISOString()
            };

            this.manualClosures.unshift(newClosure);
            this.saveLocalOverrides();
            this.logSyncAction('Manual Closure Added', `${newClosure.title} (${newClosure.pool})`);
            this.notify();
            return newClosure;
        }

        removeManualClosure(arg1, arg2) {
            const closureId = arg2 !== undefined ? arg2 : arg1;
            this.manualClosures = this.manualClosures.filter(c => c.id !== closureId);
            this.saveLocalOverrides();
            this.logSyncAction('Manual Closure Removed', closureId);
            this.notify();
        }

        clearAllManualClosures(venue = null) {
            if (venue) {
                this.manualClosures = this.manualClosures.filter(c => c.venue !== venue);
            } else {
                this.manualClosures = [];
            }
            this.saveLocalOverrides();
            this.logSyncAction('Manual Closures Cleared', venue || 'All Venues');
            this.notify();
        }

        simulateNewApiBooking(venue = 'CRAC') {
            const today = new Date();
            const y = today.getFullYear();
            const m = today.getMonth();
            const d = today.getDate();
            const randomHour = Math.floor(Math.random() * 8) + 8; // 8am - 4pm

            const isCrac = venue === 'CRAC';
            const poolChoice = isCrac ? (Math.random() > 0.5 ? '50m Pool' : '25m Pool') : '25m Pool';
            const laneNum = Math.floor(Math.random() * (isCrac ? 8 : 6)) + 1;
            const eventId = `BK-SIM-${Date.now().toString().slice(-4)}`;

            let zoneName = `Lane ${laneNum}`;
            if (isCrac && poolChoice === '25m Pool') zoneName = `25m Pool Lane ${laneNum}`;
            if (!isCrac) zoneName = `25m Pool - Lane ${laneNum}`;

            const mock = {
                BookingCalendarEventId: eventId,
                FacilityBookingId: `FB-SIM-${Math.floor(Math.random() * 9000 + 1000)}`,
                Club: isCrac ? "Clarence Aquatic" : "Yamba Community Pool",
                ClubId: isCrac ? 1 : 2,
                Zone: zoneName,
                Status: "Confirmed",
                Type: isCrac ? "Internal Booking - Pool Lane" : "Internal Booking - Yamba 25m Pool",
                StartDateTime: new Date(y, m, d, randomHour, 0).toISOString(),
                EndDateTime: new Date(y, m, d, randomHour + 1, 0).toISOString(),
                EntireZoneBooking: false,
                // SENSITIVE PII IN RAW API
                FullName: "Simulated Community Booking (Raw API)",
                Phone: "0499 778 899",
                Email: "simulated@valleycommunity.org",
                UserNumber: `M${Math.floor(Math.random() * 80000 + 10000)}`,
                Comments: "Simulated booking injected via API sync.",
                ChargedAmount: 32.00
            };

            this.rawBookings.push(mock);
            this.logSyncAction('API Booking Ingested', `${eventId} on ${poolChoice} (${zoneName})`);
            this.notify();
            return mock;
        }

        triggerManualSync() {
            this.logSyncAction('Manual Sync Triggered', 'Refreshed all pool availability');
            this.notify();
        }

        logSyncAction(action, detail) {
            this.syncHistory.unshift({
                time: new Date().toLocaleTimeString('en-AU'),
                action,
                detail
            });
            if (this.syncHistory.length > 20) this.syncHistory.pop();
        }

        startAutoSync() {
            if (this.timer) clearInterval(this.timer);
            this.timer = setInterval(() => {
                if (this.isAutoSyncEnabled) {
                    this.notify();
                }
            }, this.syncIntervalMs);
            if (this.timer && typeof this.timer.unref === 'function') {
                this.timer.unref();
            }
        }
    }

    return {
        FACILITY_SPECIFICATIONS,
        PrivacySanitiser,
        SyncEngine,
        createSyncEngine: (options) => new SyncEngine(options)
    };
}));
