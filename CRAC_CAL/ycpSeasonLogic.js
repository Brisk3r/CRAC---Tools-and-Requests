window.YCP_SEASON_LOGIC = {
    // Re-opening date: 10 August 2026
    reopenDate: new Date(2026, 7, 10), // 10 August 2026
    tempClosedMessage: "Closed for Winter - Reopening 10 August",

    // Known closed holidays for YCP
    closedHolidays: [
        { month: 12, date: 25 }, // Christmas
        { month: 12, date: 26 }, // Boxing Day
        { month: 4, date: 3 }, // Good Friday 2026 (Apr 3)
    ],

    isClosedHoliday(date) {
        return this.closedHolidays.some(h => h.month === date.getMonth() + 1 && h.date === date.getDate());
    },

    getSeason(date) {
        const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        if (d < this.reopenDate) return 'WINTER_CLOSED';
        return 'OFF_PEAK';
    },

    getOperatingStatus(date, zoneStr = 'all') {
        const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        if (d < this.reopenDate) {
            return { open: false, reason: this.tempClosedMessage };
        }

        if (this.isClosedHoliday(date)) return { open: false, reason: 'Public Holiday Closure' };
        
        const day = date.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat

        let openHour = 6;
        let closeHour = 13; // 1pm

        if (day === 0 || day === 6) { // Weekends (Sat & Sun)
            openHour = 10;
            closeHour = 14; // 2pm
        } else { // Monday - Friday
            openHour = 6;
            closeHour = 13; // 1pm
        }

        return { open: true, openHour, closeHour };
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
