window.CRAC_SEASON_LOGIC = {
    // Known closed holidays for CRAC (as per official Centre Hours)
    closedHolidays: [
        { month: 12, date: 25 }, // Christmas Day
        { month: 12, date: 26 }, // Boxing Day
        { month: 4, date: 3 },   // Good Friday 2026 (Apr 3)
        { month: 4, date: 5 },   // Easter Sunday 2026 (Apr 5)
        { month: 4, date: 25 },  // Anzac Day (Apr 25)
        { month: 6, date: 8 }    // June Long Weekend Public Holiday (King's Birthday 2026)
    ],

    // Known open holidays (operate on Sunday & Public Holiday hours)
    openHolidays: [
        { month: 1, date: 26 },  // Australia Day
        { month: 10, date: 5 }   // October Long Weekend / Labour Day 2026
    ],

    // NSW School Holidays (approx for 2026/2027 based on standard NSW Department of Education dates)
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
        // Off-Peak Season: Starts Friday, 5 June 2026
        // Regular Season: Starts Monday, 7 September 2026
        const offPeak = new Date(date.getFullYear(), 5, 5); // June 5
        const regular = new Date(date.getFullYear(), 8, 7); // September 7
        
        if (d >= offPeak && d < regular) return 'OFF_PEAK';
        return 'REGULAR';
    },

    getOperatingStatus(date, zoneStr = 'all') {
        if (this.isClosedHoliday(date)) return { open: false, reason: 'Public Holiday Closure' };
        
        const isPH = this.isOpenHoliday(date);
        const season = this.getSeason(date);
        const day = date.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
        const isSundayOrPH = (day === 0 || isPH);
        const isSaturday = (day === 6 && !isPH);

        let openHour = 5.5; // Default weekday 5:30 am
        let closeHour = 19;  // Default weekday 7:00 pm

        if (season === 'OFF_PEAK') {
            // Off-Peak Season:
            // Monday to Friday: 5:30 am - 7:00 pm
            // Saturday: 7:00 am - 6:00 pm
            // Sunday & Public Holidays: 8:00 am - 4:00 pm
            if (isSaturday) { 
                openHour = 7; 
                closeHour = 18; 
            } else if (isSundayOrPH) { 
                openHour = 8; 
                closeHour = 16; 
            } else { 
                openHour = 5.5; 
                closeHour = 19; 
            }
        } else {
            // Regular Season:
            // Monday to Friday: 5:30 am - 7:00 pm
            // Saturday: 7:00 am - 7:00 pm
            // Sunday & Public Holidays: 8:00 am - 6:00 pm
            if (isSaturday) { 
                openHour = 7; 
                closeHour = 19; 
            } else if (isSundayOrPH) { 
                openHour = 8; 
                closeHour = 18; 
            } else { 
                openHour = 5.5; 
                closeHour = 19; 
            }
        }

        // Zone-Specific Overrides
        const zoneLower = (zoneStr || '').toLowerCase();
        
        // 50m Pool: Closed during Off-Peak Season (5 June to 6 September), Fully Open during Regular Season (from 7 September)
        if (zoneLower.includes('50m')) {
            const startClosure = new Date(date.getFullYear(), 5, 5); // Friday, 5 June 2026
            const endClosure = new Date(date.getFullYear(), 8, 6);   // Sunday, 6 September 2026

            if (date >= startClosure && date <= endClosure) {
                return { open: false, reason: 'Winter Season Closure' };
            }
            // Once Regular Season starts (Monday 7 September onwards), 50m pool operates on full facility hours
        }

        // Waterslides:
        // Off-Peak: Weekends only (9:00 am - 4:00 pm)
        // Regular: Weekdays 3:00 pm - 6:00 pm, Weekends/School Holidays 9:00 am - 4:00 pm
        if (zoneLower.includes('slide')) {
            const isWeekendOrHoliday = (day === 0 || day === 6 || isPH || this.isNSWHoliday(date));
            if (season === 'OFF_PEAK') {
                if (!isWeekendOrHoliday) return { open: false, reason: 'Weekends Only' };
                openHour = 9; 
                closeHour = 16;
            } else {
                if (isWeekendOrHoliday) {
                    openHour = 9; 
                    closeHour = 16;
                } else {
                    openHour = 15; 
                    closeHour = 18;
                }
            }
        }

        return { open: true, openHour, closeHour, season };
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
