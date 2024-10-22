const STATUS_URL = '/status/status.json';
const OUTAGES_URL = '/status/outages.json';
const MAX_CALENDAR_MONTHS = 3;
const MAX_CALENDAR_MONTHS_PAGE = 3;

// TODO: Prefetch outages and status

document.addEventListener('DOMContentLoaded', async event => {
    setStatus();

    const calendarHTML = await createCalendarHTML();
    const calendarElement = document.querySelector('.status-page__calendar');
    calendarElement.innerHTML = calendarHTML;
});

async function setStatus() {

    const statusElement = document.querySelector('.status-page__status');

    const status = await getStatus();

    if (status.status === 1) {
        statusElement.classList.add('UP');
    } else {
        statusElement.classList.add('DOWN');
    }
}

async function createCalendarHTML() {

    let html = '';

    const outages = await getOutages();

    const months = getMonths();

    for (const month of months) {

        html += '<div class="status-page__month">';
        html += `<div class="status-page__month-header">`;
        html += `<div class="status-page__month-name">${getMonthName(month.month)} ${month.year}</div>`;
        html += `<div class="status-page__month-uptime">${getMonthUptimePercentage(month.year, month.month, outages)}%</div>`;
        html += `</div>`;
        html += '<div class="status-page__days">';

        for (const day of month.days) {

            if (day.getMonth() === month.month) {

                if (day > Date.now()) {

                    const title = day.getDate() + ' ' + getMonthName(month.month) + ' ' + day.getFullYear();
                    html += `<div title="${title}" class="status-page__day FUTURE">`;

                } else {

                    const outage = getOutage(day, outages);

                    if (outage) {

                        if (outage.major) {

                            const title = outage.title;
                            html += `<div title="${title}" class="status-page__day OUTAGE MAJOR">`;

                        } else {

                            const title = outage.title;
                            html += `<div title="${title}" class="status-page__day OUTAGE">`;
                        }

                    } else {

                        const title = day.getDate() + ' ' + getMonthName(month.month) + ' ' + day.getFullYear();
                        html += `<div title="${title}" class="status-page__day">`;
                    }
                }

            } else {

                html += `<div class="status-page__day OUTSIDE">`;
            }

            html += '</div>';
        }

        html += '</div>';
        html += '</div>';
    }

    return html;
}

async function getOutages() {
    const res = await fetch('/status/outages.json');
    return await res.json();
}

async function getStatus() {
    const res = await fetch('/status/status.json');
    return await res.json();
}

function getMonthUptimePercentage(year, month, outages) {

    const monthOutages = outages.filter(outage => {
        const outageYear = outage.date.slice(0, 4);
        if (outageYear !== year.toString()) {
            return false;
        }

        const outageMonth = outage.date.slice(5, 7);
        if (outageMonth !== paddedNumber(month + 1)) {
            return false;
        }

        return true;
    });

    const outageMinutes = monthOutages.reduce((acc, outage) => acc + outage.minutes, 0);
    const monthMinutes = new Date(year, month + 1, 0).getDate() * 24 * 60;

    const uptime = (1 - outageMinutes / monthMinutes) * 100;

    if (uptime === 100) {
        return uptime.toFixed(0);
    } else {
        return uptime.toFixed(2);
    }
}

function getMonths() {

    const monthIndexes = createMonthIndexes();

    const months = [];

    for (const monthIndex of monthIndexes) {
        const startDate = firstDayOfFirstWeekOfMonth(monthIndex.year, monthIndex.month);
        const endDate = lastDayOfLastWeekOfMonth(monthIndex.year, monthIndex.month);

        const days = [];

        for (let dateCursor = new Date(startDate); dateCursor <= endDate; dateCursor.setDate(dateCursor.getDate() + 1)) {
            days.push(new Date(dateCursor));
        }

        months.push({
            year: monthIndex.year,
            month: monthIndex.month,
            days: days
        });
    }

    return months;
}

function createMonthIndexes() {

    const monthIndexes = [];
    let dateCursor = today = new Date();

    for (let i = 0; i < MAX_CALENDAR_MONTHS; i++) {
        monthIndexes.push({
            year: dateCursor.getFullYear(),
            month: dateCursor.getMonth()
        });
        dateCursor.setMonth(dateCursor.getMonth() - 1);
    }

    return monthIndexes.toReversed();
}

function getOutage(date, outages) {
    return outages.find(outage => outage.date === getISOFormattedDate(date));
}

function getISOFormattedDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${paddedNumber(month)}-${paddedNumber(day)}`
}

function paddedNumber(i) {
    if (i > 9) {
        return i.toString();
    } else {
        return '0' + i.toString();
    }
}

function firstDayOfFirstWeekOfMonth(year, month) {
    const firstDayOfMonth = new Date(year, month, 1);
    return new Date(firstDayOfMonth.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay()));
}

function lastDayOfLastWeekOfMonth(year, month) {
    const lastDayOfMonth = new Date(year, month + 1, 0);
    return new Date(lastDayOfMonth.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay())));
}

function getMonthName(monthNumber) {
    const n = parseInt(monthNumber);
    switch (n) {
        case 0: return 'January';
        case 1: return 'February';
        case 2: return 'Mars';
        case 3: return 'April';
        case 4: return 'May';
        case 5: return 'June';
        case 6: return 'July';
        case 7: return 'August';
        case 8: return 'September';
        case 9: return 'October';
        case 10: return 'November';
        case 11: return 'December';
    }

    return null;
}
