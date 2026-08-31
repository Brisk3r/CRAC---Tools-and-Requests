window.YCP_SEASON_LOGIC = {
    // 2026 Season Key Dates
    reopenDate: new Date(2026, 7, 10),     // Monday, 10 August 2026 (Off-Season Re-opening)
    fullSeasonDate: new Date(2026, 8, 26), // Saturday, 26 September 2026 (Full Season Starts)
    tempClosedMessage: "Closed for Winter - Reopening 10 August",

    // Public Holiday Closures for YCP
    closedHolidays: [
        { month: 12, date: 25 }, // Christmas Day
        { month: 12, date: 26 }, // Boxing Day
        { month: 4, date: 3 },  // Good Friday 2026 (Apr 3)
        { month: 4, date: 4 },  // Easter Saturday 2026 (Apr 4)
        { month: 4, date: 5 },  // Easter Sunday 2026 (Apr 5)
        { month: 4, date: 6 },  // Easter Monday 2026 (Apr 6)
        { month: 4, date: 25 }, // Anzac Day (Apr 25)
        { month: 6, date: 8 }   // June Long Weekend / King's Birthday 2026 (Jun 8)
    ],

    // Known Open Holidays (operate on Weekend & Public Holiday hours)
    openHolidays: [
        { month: 1, date: 26 }, // Australia Day (Jan 26)
        { month: 10, date: 5 }  // October Long Weekend / Labour Day 2026 (Oct 5)
    ],

    isClosedHoliday(date) {
        return this.closedHolidays.some(h => h.month === date.getMonth() + 1 && h.date === date.getDate());
    },

    isOpenHoliday(date) {
        return this.openHolidays.some(h => h.month === date.getMonth() + 1 && h.date === date.getDate());
    },

    getSeason(date) {
        const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        if (date.getFullYear() === 2026) {
            if (d < this.reopenDate) return 'WINTER_CLOSED';
            if (d < this.fullSeasonDate) return 'OFF_PEAK';
            return 'FULL_SEASON';
        }
        // Generic logic for subsequent years
        const reopen = new Date(date.getFullYear(), 7, 10);
        const fullSeason = new Date(date.getFullYear(), 8, 26);
        const winterClose = new Date(date.getFullYear(), 5, 1);
        if (d >= winterClose && d < reopen) return 'WINTER_CLOSED';
        if (d >= reopen && d < fullSeason) return 'OFF_PEAK';
        return 'FULL_SEASON';
    },

    getOperatingStatus(date, zoneStr = 'all') {
        const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const season = this.getSeason(d);

        if (season === 'WINTER_CLOSED') {
            return { open: false, reason: this.tempClosedMessage, season };
        }

        if (this.isClosedHoliday(d)) {
            return { open: false, reason: 'Public Holiday Closure', season };
        }

        const isPH = this.isOpenHoliday(d);
        const day = d.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
        const isWeekendOrPH = (day === 0 || day === 6 || isPH);

        let openHour = 6;
        let closeHour = 18;

        if (season === 'OFF_PEAK') {
            // Off-Season Hours:
            // Monday to Friday: 6:00 am - 1:00 pm
            // Weekend & Public Holidays: 10:00 am - 2:00 pm
            if (isWeekendOrPH) {
                openHour = 10;
                closeHour = 14; // 2:00 pm
            } else {
                openHour = 6;
                closeHour = 13; // 1:00 pm
            }
        } else {
            // Full Season Hours (Starts Saturday, 26 September 2026):
            // Monday to Friday: 6:00 am - 6:00 pm
            // Weekend & Public Holidays: 9:00 am - 4:00 pm
            if (isWeekendOrPH) {
                openHour = 9;
                closeHour = 16; // 4:00 pm
            } else {
                openHour = 6;
                closeHour = 18; // 6:00 pm
            }
        }

        return { open: true, openHour, closeHour, season };
    },

    getDisplayHoursLimits(date) {
        // Find min open and max close for a date
        const base = this.getOperatingStatus(date, 'all');
        
        let minOpen = 24;
        let maxClose = 0;
        
        if (base.open) {
            if (base.openHour < minOpen) minOpen = Math.floor(base.openHour);
            if (base.closeHour > maxClose) maxClose = Math.ceil(base.closeHour);
        }
        
        if (minOpen === 24) return { min: 6, max: 18 }; // fallback for fully closed days so the grid still renders 6am to 6pm
        return { min: minOpen, max: maxClose };
    }
};
