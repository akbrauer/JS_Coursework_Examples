// const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
// const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

let calendarBody = document.querySelector('.calendar-body');
for(let m = 0; m < 5; m++){
    let week = document.createElement('div');
    week.classList.add('week');
    for(let d = 1; d < 8; d++){
        let day = document.createElement('div');
        day.classList.add('day');
        if(d === 7){
            day.classList.add('border-end');
        };
        let date = document.createElement('div');
        date.classList.add('date');
        date.innerText = d;
        day.appendChild(date);
        // let event1 = document.createElement('a');
        // event1.classList.add('btn');
        // event1.innerText = 'event 1';
        // event1.setAttribute('type', 'button');
        // event1.setAttribute('data-bs-toggle', 'popover');
        // event1.setAttribute('data-bs-title', 'Event Details');
        // event1.setAttribute('data-bs-content', 'Event details here');
        // day.appendChild(event1);
        week.appendChild(day);
    }
    calendarBody.appendChild(week);
}