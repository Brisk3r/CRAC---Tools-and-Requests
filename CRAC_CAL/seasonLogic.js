window.CRAC_SEASON_LOGIC = {
    // Known closed holidays for CRAC
    closedHolidays: [
        { month: 12, date: 25 }, // Christmas
        { month: 12, date: 26 }, // Boxing Day
        { month: 4, date: 3 }, // Good Friday 2026 (Apr 3)
        { month: 4, date: 5 }, // Easter Sunday 2026 (Apr 5)
        { month: 6, date: 8 }, // June Long Weekend (Mon Jun 8 2026)
        { month: 4, date: 25 } // Anzac Day (Apr 25)
    ],
    // Known open holidays
    openHolidays: [
        { month: 10, date: 5 }, // Oct Long Weekend (Mon Oct 5 2026)
        { month: 1, date: 26 } // Australia Day
    ],
    // NSW School Holidays (approx for 2026/2027 based on standard dates)
    nswSchoolHolidays: [
        { start: new Date('2026-04-13'), end: new Date('2026-04-24') },
        { start: new Date('2026-07-06'), end: new Date('2026-07-17') },
        { start: new Date('2026-09-28'), end: new Date('2026-10-09') },
        { start: new Date('2026-12-21'), end: new Date('2027-01-26') }
    ],

    isNSWHoliday(date) {
        return this.nswSchoolHolidays.some(h => date >= h.start && date <= h.end);
    },

    isClosedHoliday(date) {
        return this.closedHolidays.some(h => h.month === date.getMonth() + 1 && h.date === date.getDate());
    },

    isOpenHoliday(date) {
        return this.openHolidays.some(h => h.month === date.getMonth() + 1 && h.date === date.getDate());
    },

    getSeason(date) {
        const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const offPeak = new Date(date.getFullYear(), 5, 5); // Jun 5
        const regular = new Date(date.getFullYear(), 8, 7); // Sep 7
        
        if (d >= offPeak && d < regular) return 'OFF_PEAK';
        return 'REGULAR';
    },

    getOperatingStatus(date, zoneStr = 'all') {
        if (this.isClosedHoliday(date)) return { open: false };
        
        const isPH = this.isOpenHoliday(date);
        const season = this.getSeason(date);
        const day = date.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
        const isWeekendOrPH = (day === 0 || day === 6 || isPH);
        const isSundayOrPH = (day === 0 || isPH);
        const isSaturday = (day === 6 && !isPH);

        let openHour = 5;
        let closeHour = 19; // Default weekday

        if (season === 'OFF_PEAK') {
            if (isSaturday) { openHour = 7; closeHour = 18; }
            else if (isSundayOrPH) { openHour = 9; closeHour = 16; }
            else { openHour = 5; closeHour = 19; } 
        } else {
            if (isSaturday) { openHour = 7; closeHour = 19; } // Assume normal Saturday
            else if (isSundayOrPH) { openHour = 8; closeHour = 18; }
            else { openHour = 5; closeHour = 19; }
        }

        // Zone overrides
        const zoneLower = (zoneStr || '').toLowerCase();
        
        if (zoneLower.includes('50m pool')) {
            const startClosure = new Date(date.getFullYear(), 5, 5); // June 5
            const endClosure = new Date(date.getFullYear(), 9, 30); // Oct 30

            if (date >= startClosure && date <= endClosure) {
                const sept1 = new Date(date.getFullYear(), 8, 1);
                if (date >= sept1 && date <= endClosure) {
                    if (!this.isNSWHoliday(date)) {
                        openHour = 5.5; // Will be floored/checked dynamically
                        closeHour = 9;
                    }
                } else {
                    return { open: false }; // Closed completely between Jun 5 and Aug 31
                }
            }
        }

        if (zoneLower.includes('slide')) {
            const august1 = new Date(date.getFullYear(), 7, 1);
            if (date < august1) return { open: false }; // After July

            if (isWeekendOrPH) {
                openHour = 9; closeHour = 16; // sessions within this time
            } else {
                openHour = 15; closeHour = 18; // 3pm - 6pm
            }
        }

        return { open: true, openHour, closeHour };
    },

    getDisplayHoursLimits(date) {
        // Find min open and max close for a date, regardless of zone, to draw the grid
        const base = this.getOperatingStatus(date, 'all');
        const pool = this.getOperatingStatus(date, '50m pool');
        const slides = this.getOperatingStatus(date, 'slides');
        
        let minOpen = 24;
        let maxClose = 0;
        
        [base, pool, slides].forEach(s => {
            if (s.open) {
                if (s.openHour < minOpen) minOpen = Math.floor(s.openHour);
                if (s.closeHour > maxClose) maxClose = Math.ceil(s.closeHour);
            }
        });
        
        if (minOpen === 24) return { min: 7, max: 19 }; // fallback for fully closed days
        return { min: minOpen, max: maxClose };
    }
};
