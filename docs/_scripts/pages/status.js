(function () {

    /* =====================================================================
       Constants & Variables
       ===================================================================== */

    let useLocalDataSource = false; // Temporarily set true for local development

    if (location.hostname !== '127.0.0.1' && location.hostname !== 'localhost') {
        // Safe guard: Don't use local data source if not on local dev machine
        useLocalDataSource = false;
    }

    let dataSourceBaseUrl = 'https://status.learnpoint.io/';

    if (useLocalDataSource) {

        dataSourceBaseUrl = '/status/';

    } else if (document.currentScript.dataset.dataSourceBaseUrl) {

        dataSourceBaseUrl = document.currentScript.dataset.dataSourceBaseUrl;
    }

    const STATUS_URL = dataSourceBaseUrl + 'status.json';
    const INCIDENTS_URL = dataSourceBaseUrl + 'incidents.json';

    const MAX_CALENDAR_MONTHS = 24; // Must be multiple of MONTHS_PER_PAGINATION_PAGE
    const MONTHS_PER_PAGINATION_PAGE = 3;

    const FIRST_DAY_OF_WEEK_IS_MONDAY = true;

    let paginationPage = 1;



    /* =====================================================================
       DOMContentLoaded
       ===================================================================== */

    document.addEventListener('DOMContentLoaded', async event => {
        renderStatus();
        await renderCalendar(); // Must be rendered before pagination
        renderPagination();
    });



    /* =====================================================================
       Status
       ===================================================================== */

    async function renderStatus() {

        const statusElement = document.querySelector('.status-page__status');

        statusElement.innerHTML = getStatusDefaultMarkup();

        const [status, error] = await getStatus();

        if (error) {
            statusElement.innerHTML = '<p style="text-align: center;margin-top:2em;">Error: Could not retrieve status information.</p>';
            return;
        }

        try {

            if (status.fullyOperational === true) {
                statusElement.classList.add('UP');
                return;
            }

            const message = status.messages[status.notFullyOperationalMessage]

            const statusMessageElementEn = document.querySelector('.status-page__status-message[lang=en]');
            const statusMessageElementSv = document.querySelector('.status-page__status-message[lang=sv]');

            statusMessageElementEn.textContent = message.en;
            statusMessageElementSv.textContent = message.sv;

            statusElement.classList.add('DOWN');

        } catch (error) {

            console.error(error);
            statusElement.innerHTML = '<p style="text-align: center;margin-top:2em;">Error: Could not interpret status information.</p>';
        }
    }

    async function getStatus() {
        try {

            const res = await fetch(STATUS_URL);

            if (!res.ok) {
                console.error('Could not fetch status information from', STATUS_URL);
                return [undefined, true];
            }

            return [await res.json(), undefined];

        } catch (error) {

            console.error(error);
            return [undefined, true];
        }
    }

    function getStatusDefaultMarkup() {
        return `
            <div class="status-page__status-up">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path
                        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                </svg>
                <h1 class="status-page__heading">
                    <span lang="en">Learnpoint is up and running</span>
                    <span lang="sv">Learnpoint är igång och fungerar</span>
                </h1>
                <p class="status-page__preamble">
                    <span lang="en">Having trouble? Reach out to <a href="https://learnpoint.se/help/">our support</a>.</span>
                    <span lang="sv">Upplever du problem? Kontakta <a href="https://learnpoint.se/help/">vår support</a>.</span>
                </p>
            </div>
            <div class="status-page__status-down">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path
                        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                </svg>
                <h1 class="status-page__heading">
                    <span lang="en">Learnpoint is having problems</span>
                    <span lang="sv">Learnpoint har problem</span>
                </h1>
                <p class="status-page__preamble">
                    <span lang="en" class="status-page__status-message"></span>
                    <span lang="en">For further information or assistance, please contact <a href="https://learnpoint.se/help/">our support</a>.</span>
                    <span lang="sv" class="status-page__status-message"></span>
                    <span lang="sv">För mer information eller hjälp, kontakta <a href="https://learnpoint.se/help/">vår support</a>.</span>
                </p>
            </div>`;
    }



    /* =====================================================================
       Calendar
       ===================================================================== */

    async function renderCalendar() {

        const calendarElement = document.querySelector('.status-page__calendar');

        const [calendarHTML, error] = await createCalendarHTML();

        if (error) {
            calendarElement.innerHTML = `<p style="text-align: center;margin-top:2em;">Error: ${error}</p>`;
            return;
        }

        calendarElement.innerHTML = calendarHTML;
    }

    async function createCalendarHTML() {

        let html = '';

        const [incidents, error] = await getIncidents();

        if (error) {
            return [undefined, 'Could not retrieve incident information.'];
        }

        try {

            const months = getMonths();

            const today = new Date();

            let monthIndex = 0;
            let pageIndex = 0;

            for (const month of months) {

                monthIndex++;

                pageIndex = Math.floor(MAX_CALENDAR_MONTHS / MONTHS_PER_PAGINATION_PAGE) - Math.ceil(monthIndex / MONTHS_PER_PAGINATION_PAGE) + 1;

                html += '<div class="status-page__month" data-page="' + pageIndex + '">';
                html += `<div class="status-page__month-header">`;
                html += `<div class="status-page__month-name">
                    <span lang="en">${getMonthName(month.month, "en")} ${month.year}</span>
                    <span lang="sv">${getMonthName(month.month, "sv")} ${month.year}</span>
                 </div>`;
                html += `<div class="status-page__month-uptime">${getMonthUptimePercentage(month.year, month.month, incidents)}%</div>`;
                html += `</div>`;
                html += '<div class="status-page__days">';

                for (const day of month.days) {

                    const isoDate = day.getFullYear() + '-' + paddedNumber(month.month + 1) + '-' + paddedNumber(day.getDate());

                    if (day.getMonth() === month.month) {

                        if (day.getFullYear() === today.getFullYear() && day.getMonth() === today.getMonth() && day.getDate() >= today.getDate()) {

                            html += `<div title="${isoDate}" class="status-page__day FUTURE">`;

                        } else {

                            const incident = getIncident(day, incidents);

                            if (incident) {

                                const title = incident.title;
                                const description = incident.description;
                                const minutes = incident.minutes;

                                html += `<div
                                    title="${isoDate}"
                                    data-date="${isoDate}"
                                    data-minutes="${minutes}"
                                    data-title-en="${title.en}"
                                    data-title-sv="${title.sv}"
                                    data-description-en="${description.en}"
                                    data-description-sv="${description.sv}"`;

                                if (incident.major) {
                                    html += `class="status-page__day INCIDENT MAJOR">`
                                } else {
                                    html += `class="status-page__day INCIDENT">`
                                }

                            } else {

                                html += `<div title="${isoDate}" class="status-page__day">`;
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

            return [html, undefined];

        } catch (error) {

            console.log(error);
            return [undefined, 'Could not interpret incident information.']
        }
    }

    async function getIncidents() {
        try {

            const res = await fetch(INCIDENTS_URL);
            if (!res.ok) {
                console.error('Could not fetch', INCIDENTS_URL);
                return [undefined, true];
            }

            return [await res.json(), undefined];

        } catch (error) {

            console.log(error);
            return [undefined, true];
        }
    }

    function getIncident(date, incidents) {
        return incidents.find(incident => incident.date === getISOFormattedDate(date));
    }

    function getMonthUptimePercentage(year, month, incidents) {

        const monthIncidents = incidents.filter(incident => {
            const incidentYear = incident.date.slice(0, 4);
            if (incidentYear !== year.toString()) {
                return false;
            }

            const incidentMonth = incident.date.slice(5, 7);
            if (incidentMonth !== paddedNumber(month + 1)) {
                return false;
            }

            return true;
        });

        const incidentMinutes = monthIncidents.reduce((acc, incident) => acc + incident.minutes, 0);
        const monthMinutes = new Date(year, month + 1, 0).getDate() * 24 * 60;

        const uptime = (1 - incidentMinutes / monthMinutes) * 100;

        if (uptime === 100) {
            return uptime.toFixed(0);
        } else {
            return uptime.toFixed(2);
        }
    }



    /* =====================================================================
       Pagination
       ===================================================================== */

    function renderPagination() {
        const pagination = document.querySelector('.status-page__pagination');
        pagination.innerHTML = getPaginationDefaultMarkup();
        updatePagination();
    }

    document.addEventListener('click', event => {
        const paginateButton = event.target.closest('.status-page__pagination-button');
        if (!paginateButton) {
            return;
        }

        const directionForward = paginateButton.classList.contains('FORWARD');

        if (directionForward) {
            if (paginationPage > 1) {
                paginationPage--;
            }
        } else {
            if (paginationPage < MAX_CALENDAR_MONTHS / MONTHS_PER_PAGINATION_PAGE) {
                paginationPage++;
            }
        }

        updatePagination();
    });

    function updatePagination() {

        const forwardButton = document.querySelector('.status-page__pagination-button.FORWARD');
        const backButton = document.querySelector('.status-page__pagination-button.BACK');

        if (paginationPage > 1) {
            forwardButton.classList.remove('DISABLED');
        } else {
            forwardButton.classList.add('DISABLED');
        }

        if (paginationPage < MAX_CALENDAR_MONTHS / MONTHS_PER_PAGINATION_PAGE) {
            backButton.classList.remove('DISABLED');
        } else {
            backButton.classList.add('DISABLED');
        }

        const months = document.querySelectorAll('.status-page__month');
        months.forEach(month => {
            const pageIndex = month.dataset.page;
            if (pageIndex === paginationPage.toString()) {
                month.style.display = 'block';
            } else {
                month.style.display = 'none';
            }
        });
    }

    function getPaginationDefaultMarkup() {
        return `
            <button type="button" class="status-page__pagination-button BACK">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5" />
                </svg>
            </button>
            <button type="button" class="status-page__pagination-button FORWARD">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8" />
            </svg>
        </button>`;
    }



    /* =====================================================================
       Incident Tooltip
       ===================================================================== */

    document.addEventListener('click', event => {
        const clickedOnTooltip = event.target.closest('.status-page__incident-tooltip');
        if (clickedOnTooltip) {
            return;
        }

        const incidentDay = event.target.closest('.status-page__day.INCIDENT');
        if (!incidentDay) {
            closeTooltips();
            return;
        }

        const openTooltip = document.querySelector('.status-page__incident-tooltip');
        if (openTooltip) {
            if (openTooltip.dataset.date == incidentDay.dataset.date) {
                openTooltip.remove();
                return;
            }
        }

        closeTooltips();

        const incidentTooltip = createIncidentTooltip(incidentDay);

        showTooltip(incidentTooltip, incidentDay);
    });

    document.addEventListener('keyup', event => {
        if (event.key === 'Escape') {
            closeTooltips();
        }
    });

    function showTooltip(incidentTooltip, incidentDay) {

        const rect = incidentDay.getBoundingClientRect();

        const leftSpace = rect.left;
        const rightSpace = document.documentElement.clientWidth - rect.right;

        if (isMobile) {

            incidentTooltip.style.left = document.documentElement.clientWidth / 2 - 168 + 'px';
            incidentTooltip.classList.add('MOBILE');

        } else if (leftSpace < 180) {

            incidentTooltip.style.left = rect.left - 28 + 'px';
            incidentTooltip.classList.add('LEFT');

        } else if (rightSpace < 180) {

            incidentTooltip.style.left = rect.left - 276 + 'px';
            incidentTooltip.classList.add('RIGHT');

        } else {

            incidentTooltip.style.left = rect.left - 160 + 'px';
        }

        incidentTooltip.style.top = rect.top + + scrollY + 42 + 'px';

        document.body.append(incidentTooltip);
    }

    function closeTooltips() {
        const openTooltips = document.querySelectorAll('.status-page__incident-tooltip');
        openTooltips.forEach(tt => tt.remove());
    }

    function createIncidentTooltip(incidentDay) {
        const date = incidentDay.dataset.date;
        const displayDateEn = isoDateToDisplayDate(date, 'en');
        const displayDateSv = isoDateToDisplayDate(date, 'sv');
        const minutes = incidentDay.dataset.minutes;
        const titleEn = incidentDay.dataset.titleEn;
        const titleSv = incidentDay.dataset.titleSv;
        const descriptionEn = incidentDay.dataset.descriptionEn;
        const descriptionSv = incidentDay.dataset.descriptionSv;

        const html = `<div class="status-page__incident-tooltip" data-date="${date}">
                      <div class="status-page__incident-tooltip-header">
                          <div class="status-page__incident-tooltip-date">
                              <span lang="en">${displayDateEn}</span>
                              <span lang="sv">${displayDateSv}</span>
                          </div>
                          <div class="status-page__incident-tooltip-minutes">
                              <span lang="en">${minutes} min</span>
                              <span lang="sv">${minutes} min</span>
                          </div>
                      </div>
                      <div class="status-page__incident-tooltip-title">
                          <span lang="en">${titleEn}</span>
                          <span lang="sv">${titleSv}</span>
                      </div>
                      <div class="status-page__incident-tooltip-descripton">
                          <span lang="en">${descriptionEn}</span>
                          <span lang="sv">${descriptionSv}</span>
                      </div>
                  </div>`;

        return createElementFromHtml(html);
    }


    /* =====================================================================
       Date & Calendar Helpers
       ===================================================================== */

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
        dateCursor.setDate(1);

        for (let i = 0; i < MAX_CALENDAR_MONTHS; i++) {
            monthIndexes.push({
                year: dateCursor.getFullYear(),
                month: dateCursor.getMonth()
            });
            dateCursor.setMonth(dateCursor.getMonth() - 1);
        }

        return monthIndexes.toReversed();
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

        let firstDayOfWeekOffset = 0;

        if (FIRST_DAY_OF_WEEK_IS_MONDAY) {

            if (firstDayOfMonth.getDay() === 0) {
                firstDayOfWeekOffset = -6;
            } else {
                firstDayOfWeekOffset = 1;
            }
        }

        return new Date(firstDayOfMonth.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay() + firstDayOfWeekOffset));
    }

    function lastDayOfLastWeekOfMonth(year, month) {
        const lastDayOfMonth = new Date(year, month + 1, 0);

        let lastDayOfWeekOffset = 0;

        if (FIRST_DAY_OF_WEEK_IS_MONDAY) {

            if (lastDayOfMonth.getDay() === 0) {
                lastDayOfWeekOffset = -6;
            } else {
                lastDayOfWeekOffset = 1;
            }
        }


        return new Date(lastDayOfMonth.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay() + lastDayOfWeekOffset)));
    }

    function getMonthName(monthNumber, lang) {
        const n = parseInt(monthNumber);
        switch (n) {
            case 0: return lang === 'sv' ? 'Januari' : 'January';
            case 1: return lang === 'sv' ? 'Februari' : 'February';
            case 2: return 'Mars';
            case 3: return 'April';
            case 4: return lang === 'sv' ? 'Maj' : 'May';
            case 5: return lang === 'sv' ? 'Juni' : 'June';
            case 6: return lang === 'sv' ? 'Juli' : 'July';
            case 7: return lang === 'sv' ? 'Augusti' : 'August';
            case 8: return 'September';
            case 9: return lang === 'sv' ? 'Oktober' : 'October';
            case 10: return 'November';
            case 11: return 'December';
        }

        return null;
    }

    function isoDateToDisplayDate(isoDate, lang) {
        let [year, month, date] = isoDate.split('-');


        if (date.startsWith('0')) {
            date = date.slice(1);
        }

        let displayMonth = getMonthName(parseInt(month) - 1, lang);

        if (lang == 'sv') {
            displayMonth = displayMonth.toLowerCase();
        }

        return `${date} ${displayMonth} ${year}`;
    }



    /* =====================================================================
       DOM Helpers
       ===================================================================== */

    function createElementFromHtml(html) {

        // REQUIREMENT: Single root element in html markup
        // createElementFromHtml('<div></div><p></p>'); => Will not work
        // createElementFromHtml('<div><p></p></div>'); => OK

        const template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content.firstChild;
    };


})();
