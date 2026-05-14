# Multi-Channel Logic & Coding Standards

This document defines the logic and technical implementation for consuming AI-generated content across the **Newsletter** and **Website** channels.

---

## 1. Newsletter Logic (Manual/Copy-Paste)
**Tool**: `crac-email-templates.html`
**Logic**: The Admin Dashboard generates a narrative blurb formatted with standard HTML (`<p>`, `<strong>`, `<ul>`).

### Coding Standard:
*   **Encapsulation**: Content must be wrapped in a container that resets line-height to `1.6` for Outlook compatibility.
*   **Placeholder Logic**: Use `{Name}` or similar tags for bulk-sending platforms (Mailchimp/Vision6).
*   **Style Mirroring**:
    ```html
    <!-- Example Newsletter Container -->
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        [PASTE AI NEWSLETTER CONTENT HERE]
    </div>
    ```

---

## 2. Website Logic (Dynamic API)
**Logic**: The website pulls the latest approved updates where `channels` contains "Website".

### Coding Example (The "Live Alert Bar"):
This script can be embedded into your main website (homepage or facility pages) to show active alerts automatically.

```javascript
// --- WEBSITE ALERT FETCHER ---
async function fetchWebsiteAlerts(facilityName) {
    const db = firebase.firestore();
    const now = new Date().toISOString().split('T')[0];
    
    const snapshot = await db.collection("requests")
        .where("status", "==", "Approved")
        .where("channels", "array-contains", "Website")
        .where("date", "==", now) // Only show today's specific alerts
        .get();

    const alerts = snapshot.docs.map(doc => doc.data());
    renderAlertBar(alerts.filter(a => a.facility.includes(facilityName)));
}

function renderAlertBar(alerts) {
    if (alerts.length === 0) return;
    
    const container = document.getElementById('web-alert-bar');
    container.innerHTML = alerts.map(a => `
        <div class="alert-item bg-amber-50 border-b border-amber-200 p-2 text-center text-sm font-bold text-amber-900">
            <span class="mr-2">📢</span> ${a.rewrittenWebsite}
        </div>
    `).join('');
    container.classList.remove('hidden');
}
```

### Strategic Placement:
1.  **Homepage Top**: Critical alerts (Maintenance/Closures).
2.  **Facility Pages**: General updates (Squad/LTS Intensives).
3.  **Sidebar**: "Latest News" feed using `rewrittenWebsite` content.

---

## 3. Data Flow Architecture
One staff submission creates **three distinct logic paths**:

1.  **Staff Submission**: Facts + Facility + Channels selected.
2.  **Apps Script pass**: 
    *   `rewrittenPost` -> Punchy, Hashtags, Emojis (Social).
    *   `rewrittenNewsletter` -> Narrative, Professional, Informative (Email).
    *   `rewrittenWebsite` -> Concise, Factual, Alert-style (Web).
3.  **Admin Approval**: Reviewer checks all three tabs in the Dashboard.
4.  **Distribution**:
    *   **Social**: Manual copy-paste to Facebook/Instagram.
    *   **Newsletter**: Paste into Template Generator -> Mailchimp.
    *   **Website**: Automated fetch via Firestore API.
