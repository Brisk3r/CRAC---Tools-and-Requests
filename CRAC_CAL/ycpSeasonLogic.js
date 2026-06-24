window.YCP_SEASON_LOGIC = {
    // Current Global Status - Off Season
    isTemporarilyClosed: true,
    tempClosedMessage: "Temporarily Closed - opening in August *subject to change*",

    // Known closed holidays for YCP
    closedHolidays: [
        { month: 12, date: 25 }, // Christmas
        { month: 12, date: 26 }, // Boxing Day
        { month: 4, date: 3 }, // Good Friday 2026 (Apr 3)
    ],

    isClosedHoliday(date) {
        return this.closedHolidays.some(h => h.month === date.getMonth() + 1 && h.date === date.getDate());
    },

    getOperatingStatus(date, zoneStr = 'all') {
        if (this.isTemporarilyClosed) {
            return { open: false, reason: this.tempClosedMessage };
        }

        if (this.isClosedHoliday(date)) return { open: false, reason: 'Public Holiday Closure' };
        
        const day = date.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat

        let openHour = 6;
        let closeHour = 18; // 6pm

        if (day === 0) { // Sunday
            openHour = 10;
            closeHour = 16;
        } else if (day === 6) { // Saturday
            openHour = 8;
            closeHour = 17;
        } else { // Monday - Friday
            openHour = 6;
            closeHour = 18;
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
