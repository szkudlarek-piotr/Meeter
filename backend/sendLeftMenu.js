function sendLeftMenu() {
    const menuButtonsArray = [{"id":"mainPage","text": "Strona główna", "href": "index.html"}, {"id":"addNewHuman","href": "add_human.html", "text": "Dodaj nowego człowieka"},
     {"id": "calendar","href": "new_calendar.html", "text": "Zobacz kalendarz"},
      {"id": "showAllCliques","href": "all_cliques.html", "text": "Pokaż wszystkie kliki"},
       {"id": "showAllPeople","href": "all_humans.html", "text": "Zobacz wszystkich ludzi"}, 
       {"id": "addNewMeeting", "href": "add_meeting.html", "text": "Dodaj nowe spotanie"}, 
       {"id": "addNewClique", "href": "add-clique.html", "text": "Dodaj nową klikę"}, 
       {"id": "addHumansToMeeting", "text": "Dodaj ludzi do spotkania", "href": "add_humans_to_meeting.html"},
        {"id": "addVisit", "href": "add_visit.html", "text": "Dodaj wizytę!"}, 
        {"id": "addQuote", "href": "add-golden-quote.html", "text": "Dodaj Złoty Cytat"}, 
        {"id": "addEvent", "href": "add-event.html", "text": "Dodaj wydarzenie"}]
    return menuButtonsArray
}
module.exports = sendLeftMenu