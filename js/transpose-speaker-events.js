/* 2023-02-08

A short script to modify how speaker/event data is stored within the Tamarindo site
Previously each People item referenced a list of Event items that person was a speaker at.
However we want to instead have each Event item list the People that were speakers at that event.
This script takes two JSON objects with the keys mentioned below and does the conversion.

*/

var eventsJSON = []
var peopleJSON = []

for (var i = 0; i < eventsJSON.length; i++) {
    eventsJSON[i].speakers = [] //create new array property
    console.log(eventsJSON[i]['Slug'])
    for (var j = 0; j < peopleJSON.length; j++) {
        //if this event is named within this speaker item
        if (
            peopleJSON[j]['Speaker at events'].indexOf(
                eventsJSON[i]['Slug']
            ) !== -1
        ) {
            //then add this speaker to this event
            eventsJSON[i].speakers.push(peopleJSON[j]['Slug'])
            console.log('speaker added')
        }
    }

    //concatenate speakers into string
    eventsJSON[i]['Speakers - People'] = eventsJSON[i].speakers.join('; ')
    eventsJSON[i].speakers = ''
}

// console.log(eventsJSON)

console.log(JSON.stringify(eventsJSON))
