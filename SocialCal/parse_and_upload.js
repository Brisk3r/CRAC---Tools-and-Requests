/**
 * General Purpose Markdown & JSON Bulk Importer for SocialCal / Marketing Comms Hub
 * Usage:
 *   node parse_and_upload.js --file=campaign_plan.md
 *   node parse_and_upload.js --json=campaign_plan.json
 */

const fs = require('fs');
const path = require('path');

const FIREBASE_PROJECT_ID = 'opsf---comms-task-tracker';
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/requests`;

function parseMarkdownBriefs(content) {
  const entries = [];
  const rawEntries = content.split(/Entry\s+\d+:/i).slice(1);

  for (const raw of rawEntries) {
    const lines = raw.split('\n');
    let staffName = 'Avram Parker';
    let dateStr = '';
    let facility = 'Clarence Regional Aquatic Centre';
    let category = 'Important Notice';
    let channels = [];
    let generateSign = false;
    let title = '';
    let keyMessage = '';

    // Extract Date Needed
    const dateMatch = raw.match(/DATE\s+NEEDED:\s*(\d{1,2}\/\d{1,2}\/\d{4})/i);
    if (dateMatch) {
      const parts = dateMatch[1].split('/');
      const d = parts[0].padStart(2, '0');
      const m = parts[1].padStart(2, '0');
      const y = parts[2];
      dateStr = `${y}-${m}-${d}`;
    }

    // Extract Staff Name
    const staffMatch = raw.match(/STAFF\s+NAME:\s*([^\n\r]+)/i);
    if (staffMatch) staffName = staffMatch[1].trim();

    // Extract Facility
    const facMatch = raw.match(/FACILITY:\s*([^\n\r]+)/i);
    if (facMatch) {
      const facRaw = facMatch[1].trim();
      if (/yamba/i.test(facRaw)) facility = 'Yamba Community Pool';
      else facility = 'Clarence Regional Aquatic Centre';
    }

    // Extract Category
    const catMatch = raw.match(/PRIMARY\s+CATEGORY:\s*([^\n\r]+)/i);
    if (catMatch) {
      const c = catMatch[1].trim();
      if (/fitness|aqua|health/i.test(c)) category = 'Health Fitness';
      else if (/squad/i.test(c)) category = 'Squad Training';
      else if (/intensive/i.test(c)) category = 'Swim School Intensive';
      else if (/swim school/i.test(c)) category = 'Swim School General';
      else if (/event|bbq/i.test(c)) category = 'Community Event';
      else category = 'Important Notice';
    }

    // Extract Channels
    if (/\[x\]\s*SOCIAL/i.test(raw)) channels.push('Social');
    if (/\[x\]\s*NEWS/i.test(raw)) channels.push('Newsletter');
    if (/\[x\]\s*WEB/i.test(raw)) channels.push('Website');

    // Physical Sign
    if (/Need physical sign\?:\s*\[x\]/i.test(raw)) generateSign = true;

    // Specific Topic / Detail
    const topicMatch = raw.match(/SPECIFIC\s+TOPIC\s*\/\s*DETAIL:\s*([^\n\r]+)/i);
    if (topicMatch) title = topicMatch[1].trim();

    // Raw Message Details
    const rawMsgMatch = raw.match(/RAW\s+MESSAGE\s+DETAILS\s*\(FACTS ONLY\):\s*([\s\S]*)/i);
    if (rawMsgMatch) {
      keyMessage = rawMsgMatch[1].trim();
    }

    if (dateStr && title) {
      entries.push({
        staffName,
        date: dateStr,
        facility,
        category,
        channels,
        generateSign,
        title,
        keyMessage
      });
    }
  }

  return entries;
}

async function uploadEntries(entries) {
  console.log(`\n🚀 Uploading ${entries.length} requests to Firestore (${FIREBASE_PROJECT_ID})...\n`);
  const now = new Date().toISOString();

  for (let i = 0; i < entries.length; i++) {
    const item = entries[i];
    const payload = {
      fields: {
        staffName: { stringValue: item.staffName || 'Staff' },
        date: { stringValue: item.date },
        title: { stringValue: item.title },
        category: { stringValue: item.category || 'Important Notice' },
        facility: { stringValue: item.facility || 'Clarence Regional Aquatic Centre' },
        keyMessage: { stringValue: item.keyMessage || '' },
        channels: {
          arrayValue: {
            values: (item.channels || []).map(c => ({ stringValue: c }))
          }
        },
        generateSign: { booleanValue: !!item.generateSign },
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
        console.log(`✅ [${i + 1}/${entries.length}] ${item.date} | "${item.title}" -> ID: ${id}`);
      } else {
        console.error(`❌ [${i + 1}/${entries.length}] FAILED: "${item.title}"`, data);
      }
    } catch (err) {
      console.error(`❌ [${i + 1}/${entries.length}] ERROR: "${item.title}"`, err);
    }
  }
  console.log('\n✨ Batch processing completed!\n');
}

module.exports = { parseMarkdownBriefs, uploadEntries };

if (require.main === module) {
  const args = process.argv.slice(2);
  const fileArg = args.find(a => a.startsWith('--file='));
  if (fileArg) {
    const filePath = fileArg.split('=')[1];
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = parseMarkdownBriefs(content);
    uploadEntries(parsed);
  } else {
    console.log("Usage: node parse_and_upload.js --file=<path_to_markdown_file>");
  }
}
