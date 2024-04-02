function sendLeftMenu() {
    const menuButtonsArray = [{"id":"mainPage","text": "Strona główna", "onclick": "showMainPage()"}, {"id":"addNewHuman","href": "add_human.html", "text": "Dodaj nowego człowieka"}, {"id": "calendar","href": "calendar.html", "text": "Zobacz kalendarz"}, {"id": "showAllCliques","onclick": "menuShowAllCliques()", "text": "Pokaż wszystkie kliki"}, {"id": "showAllPeople","onclick": "getPeople()", "text": "Zobacz wszystkich ludzi"}, {"id": "addNewMeeting", "href": "add_meeting.html", "text": "Dodaj nowe spotanie"}, {"id": "addNewClique", "href": "add_new_clique.html", "text": "Dodaj nową klikę"}, {"id": "addHumansToMeeting", "text": "Dodaj ludzi do spotkania", "href": "add_humans_to_meeting.html"}]
    return menuButtonsArray
}
module.exports = sendLeftMenu