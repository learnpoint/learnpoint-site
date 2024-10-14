const MAX_CALENDAR_MONTHS = 2;
const MAX_CALENDAR_MONTHS_PAGE = 1;

document.addEventListener('DOMContentLoaded', async event => {

    const res = await fetch('/status/outages.json');
    const outages = await res.json();

    const calendarElement = document.querySelector('.status-page__calendar');

    // Approximate start timestamp is fine here
    const calendarTimestampStart = Date.now() - MAX_CALENDAR_MONTHS * 30.44 * 24 * 60 * 60 * 1000;
    const calendarTimestampEnd = Date.now();

    // Start performance timer
    const start = performance.now();

    const calendarHTML = createCalendarHTML(calendarTimestampStart, calendarTimestampEnd, outages);

    // Stop performance timer and log
    const end = performance.now();
    console.log('Calculation time:', Math.ceil(end - start), 'ms');

    // Render
    calendarElement.innerHTML = calendarHTML;
});

function createCalendarHTML(calendarTimestampStart, calendarTimestampEnd, outages) {

    let html = '';

    const calendar = createCalendar(calendarTimestampStart, calendarTimestampEnd);
    const calendarWithOutages = insertOutagesIntoCalendar(calendar, outages);

    console.log(calendarWithOutages)

    let month = null;

    for (const day of calendarWithOutages) {
        if (month === null) {
            month = day.date.slice(5, 7);
            html += `<div month="${month}">${getMonthName(month)}`;
        } else {
            const dMonth = day.date.slice(5, 7);
            if (dMonth === month) {
            } else {
                html += `</div>`;
                html += `<div month="${dMonth}">${getMonthName(dMonth)}`;
                month = dMonth;
            }
        }
    }

    html += `</div>`;

    return html;
}

function createCalendar(timestampStart, timestampEnd) {
    const calendar = [];

    for (const dt = new Date(timestampStart); dt <= new Date(timestampEnd); dt.setDate(dt.getDate() + 1)) {
        calendar.push(new Date(dt));
    }

    return calendar;
}

function insertOutagesIntoCalendar(calendar, outages) {

    const calendarWithOutages = [];

    for (const day of calendar) {
        const isoDateOnly = day.toISOString().split('T')[0];
        calendarWithOutages.push({
            date: isoDateOnly,
            outage: outages.find(o => o.date === isoDateOnly) || null
        });
    }

    return calendarWithOutages;
}

function getMonthName(monthNumber) {
    const n = parseInt(monthNumber)
    switch (n) {
        case 1: return 'Jan';
        case 2: return 'Feb';
        case 3: return 'Mar';
        case 4: return 'Apr';
        case 5: return 'May';
        case 6: return 'Jun';
        case 7: return 'Jul';
        case 8: return 'Aug';
        case 9: return 'Sep';
        case 10: return 'Oct';
        case 11: return 'Nov';
        case 12: return 'Dec';
    }

    return 'NULL';
}
