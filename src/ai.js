const { getGeneralData, getFlights } = require('./database');

function getDate(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

function formatDateTH(dateStr) {
  return new Date(dateStr).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('th-TH');
}

function isToday(dateStr) {
  const today = new Date().toISOString().split('T')[0];
  return dateStr === today;
}

function includesAny(text, keywords) {
  return keywords.some(k => text.includes(k));
}

function findNextFlight(flights) {
  const today = new Date();

  const future = flights
    .filter(f => new Date(f.date) > today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return future[0];
}

async function getAIResponse(q) {
  q = q.toLowerCase();

  const general = getGeneralData();
  const flights = getFlights();

  q = q.toLowerCase();

// ✅ ถาม "พรุ่งนี้"
if (q.includes("พรุ่งนี้") || q.includes("tomorrow")) {
  const todayStr = getDate(0);
  const tomorrowStr = getDate(1);

  const tomorrowFlights = flights.filter(f => f.date === tomorrowStr);

  if (tomorrowFlights.length > 0) {
    let msg = `สวัสดีค่ะ ทางฝ่ายบริการลูกค้า Thai Airways ✈️

📅 วันนี้: ${formatDateTH(todayStr)}
📅 วันพรุ่งนี้: ${formatDateTH(tomorrowStr)}

สำหรับเที่ยวบินใน "วันพรุ่งนี้" มีรายละเอียดดังนี้ค่ะ:\n`;

    tomorrowFlights.forEach(f => {
      msg += `\n✈️ เที่ยวบิน ${f.flightNumber}
🛫 ${f.from} → 🛬 ${f.to}
⏰ เวลา ${f.time}`;
    });

    msg += `\n\nหากต้องการจองหรือสอบถามเพิ่มเติม สามารถแจ้งได้เลยนะคะ 💜`;
    return msg;
  } else {
    return `สวัสดีค่ะ ทางฝ่ายบริการลูกค้า Thai Airways ✈️

📅 วันนี้: ${formatDateTH(todayStr)}
📅 วันพรุ่งนี้: ${formatDateTH(tomorrowStr)}

ขออภัยค่ะ ในวันพรุ่งนี้ยังไม่มีเที่ยวบินให้บริการ 😔`;
  }
}

  // ✅ FAQ
  for (let g of general) {
    if (includesAny(q, g.keywords)) {
      return `สวัสดีค่ะ ทางฝ่ายบริการลูกค้า Thai Airways Roblox ✈️

${g.answer}

หากท่านมีคำถามเพิ่มเติม สามารถสอบถามได้ตลอดเวลานะคะ ทางเรายินดีให้บริการค่ะ 😊`;
    }
  }

  // ✅ ถาม "วันนี้"
  if (includesAny(q, ["วันนี้", "today"])) {
    const todayFlights = flights.filter(f => isToday(f.date));

    if (todayFlights.length > 0) {
      let msg = `สวัสดีค่ะ ทางฝ่ายบริการลูกค้า Thai Airways Roblox ✈️

สำหรับเที่ยวบินของ "วันนี้" มีรายละเอียดดังนี้ค่ะ:\n`;

      todayFlights.forEach(f => {
        msg += `\n✈️ เที่ยวบิน ${f.flightNumber}
🛫 ${f.from} → 🛬 ${f.to}
⏰ เวลา ${f.time}
📅 วันที่ ${formatDate(f.date)}\n`;
      });

      msg += `\nหากต้องการจองหรือสอบถามเพิ่มเติม สามารถแจ้งได้เลยนะคะ 😊`;
      return msg;
    }

    // ❗ ถ้าวันนี้ไม่มี → หาเที่ยวบินถัดไป
    const next = findNextFlight(flights);

    if (next) {
      return `สวัสดีค่ะ ทางฝ่ายบริการลูกค้า Thai Airways Roblox ✈️

ขออภัยค่ะ ในวันนี้ยังไม่มีเที่ยวบินให้บริการ 😔

อย่างไรก็ตาม เที่ยวบินถัดไปที่มีให้บริการคือ:

✈️ เที่ยวบิน ${next.flightNumber}
🛫 ${next.from} → 🛬 ${next.to}
📅 วันที่ ${formatDate(next.date)}
⏰ เวลา ${next.time}

ท่านสามารถวางแผนการเดินทางล่วงหน้าได้เลยนะคะ หากต้องการความช่วยเหลือเพิ่มเติม ทางเรายินดีให้บริการค่ะ 💜`;
    }

    return `สวัสดีค่ะ ✈️\nขออภัยค่ะ ขณะนี้ยังไม่มีข้อมูลเที่ยวบินในระบบค่ะ`;
  }

  // ✅ ค้นเที่ยวบินทั่วไป
  for (let f of flights) {
    if (
      q.includes(f.flightNumber.toLowerCase()) ||
      q.includes(f.from.toLowerCase()) ||
      q.includes(f.to.toLowerCase())
    ) {
      return `สวัสดีค่ะ ทางฝ่ายบริการลูกค้า Thai Airways Roblox ✈️

พบข้อมูลเที่ยวบินที่ท่านสอบถามดังนี้ค่ะ:

✈️ เที่ยวบิน ${f.flightNumber}
🛫 ต้นทาง: ${f.from}
🛬 ปลายทาง: ${f.to}
📅 วันที่: ${formatDate(f.date)}
⏰ เวลา: ${f.time}

หากท่านต้องการดำเนินการจอง หรือสอบถามรายละเอียดเพิ่มเติม สามารถแจ้งได้เลยนะคะ ทางเรายินดีดูแลค่ะ 😊`;
    }
  }

  // ❌ fallback
  return `สวัสดีค่ะ ทางฝ่ายบริการลูกค้า Thai Airways Roblox ✈️

ขออภัยค่ะ ทางระบบไม่พบข้อมูลที่ท่านสอบถามในขณะนี้ 😔

กรุณาลองระบุรายละเอียดเพิ่มเติม เช่น:
- เลขเที่ยวบิน (เช่น TG001)
- วันที่ (เช่น วันนี้ / พรุ่งนี้)
- เส้นทาง (เช่น Bangkok → Tokyo)

แล้วสอบถามเข้ามาอีกครั้งนะคะ ทางเรายินดีให้บริการเสมอค่ะ 💜`;
}

module.exports = { getAIResponse };