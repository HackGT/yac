// import { getEndedEvents } from "./cms"

const fetch = require('node-fetch');
import { IInteraction, IInteractionInstance } from "./entity/Interaction";
import { createNew} from "./entity/database";
import moment from "moment-timezone";

import { getCMSEvent } from "./cms"


// const MONGO_URL = String(process.env.MONGO_URL); "mongodb://localhost/yac-2021"
// const MONGO_URL = "mongodb://localhost/yac-2021"

// import mongoose from "mongoose";
// console.log(MONGO_URL)
// mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => {
//     throw err;
// });

// getEndedEvents(5)

// export const getMeetingInfo = async(event) =>  {
//     let meetingurl = event.url
//     if (!meetingurl || !meetingurl.includes('daily')) {
//         return {
//             'success': 'failure!'
//         };
//     }
//     let id = meetingurl.split("/").slice(-1)[0];
//     var url = "https://api.daily.co/v1/meetings/" + '?room=' + id;
//     const meetingInfo = await fetch(url, {
//         method: "GET",
//         headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//             Authorization: 'Bearer ' + String(process.env.DAILY_KEY)
//         }
//     });

//     const dailySessionInfo = await meetingInfo.json();
//     const sessionInfo =  dailySessionInfo.data; // traverse through the sessions and only consider the ones that are with in time range of event
    
//     for(var k = 0; k < sessionInfo.length; k++) {
//         if(sessionInfo != undefined) {
//             var sessionStartTime = new Date(sessionInfo[k]?.start_time * 1000);
//             var sessionEndTime = new Date(sessionInfo[k]?.end_time * 1000);
//             var eventStartTime = new Date(event.startDate);
//             var eventEndTime = new Date(event.endDate);
//             if(sessionEndTime < eventStartTime) { // break loop cause array is already sorted in reverse chronological order
//                 break;
//             }
//             // if(sessionStartTime >= eventStartTime && sessionStartTime <= eventEndTime) {
//             if (sessionStartTime <= eventEndTime && sessionEndTime >= eventStartTime) {

//                 const participants = sessionInfo.participants;
//                 let map = new Map();



//                 const startTime = moment(event.startDate).tz("America/New_York");
//                 const endTime = moment(event.endDate).tz("America/New_York");

//                 let totalduration = endTime.diff(startTime, "seconds")
//                 for(var j = 0; j < participants.length; j++) {
//                     let js_jointime = new Date(participants[j].join_time*1000)
//                     let js_endtime = new Date((participants[j].join_time+ participants[j].duration)*1000)
//                     let js_duration;
//                     if (moment(js_endtime).tz("America/New_York").diff(startTime, "seconds") < 0) {
//                         js_duration = 0
//                     } else {
//                         // js_duration = moment(js_jointime).tz("America/New_York").diff(startTime, "seconds") 
//                         js_duration = startTime.diff(moment(js_jointime).tz("America/New_York"), "seconds") 
//                         if (js_duration > 0) {
//                             js_duration = participants[j].duration - js_duration
//                         } else {
//                             js_duration = participants[j].duration
//                         }
//                     }
        
//                     if (moment(js_jointime).tz("America/New_York").diff(endTime, "seconds") > 0) {
//                         js_duration = 0
//                     } else {
//                         let js_duration_end = moment(js_endtime).tz("America/New_York").diff(endTime, "seconds") 
//                         if (js_duration > 0) {
//                             js_duration = js_duration - js_duration_end
//                         }
//                     }
        
//                     if(map.has(participants[j].user_id)) { // update the duration
//                         var current = map.get(participants[j].user_id);
//                         current.virtualDuration += js_duration;
//                         current.instances.push({
//                             timeIn: js_jointime,
//                             timeOut: js_endtime,
//                             eventType: 'virtual' 
//                         })
//                     } else {
//                         let interaction = await Interaction.findOne({uuid: participants[j].user_id, 
//                             eventID: event.id })
//                         if (!interaction) {
//                             interaction = createNew(Interaction, {
//                                 uuid: participants[j].user_id,
//                                 eventID: event.id,
//                                 instances: [{
//                                     timeIn: js_jointime,
//                                     timeOut: js_endtime,
//                                     interactionType: 'virtual'
//                                 } as IInteractionInstance],
//                                 virtualDuration: js_duration,
//                                 eventTotalDuration: totalduration,
//                                 eventName: event.name,
//                                 eventType: event.type.name,
//                                 eventStartTime: event.startDate,
//                                 eventEndTime: event.endDate
//                             })
//                         } else {
//                             interaction.instances = [{
//                                 timeIn: js_jointime,
//                                 timeOut: js_endtime,
//                                 interactionType: 'virtual'
//                             } as IInteractionInstance]
//                             interaction.virtualDuration =  js_duration
//                         }
//                         map.set(participants[j].user_id, interaction);
//                     }
//                 }

//                 map.forEach((value)=> {
//                     value.virtualDuration = Math.min(value.virtualDuration, endTime.diff(startTime, "seconds"))
//                     value.save()
//                 })
//             }
//         }
//     }
// }

export const getMeetingInfo = async(event) =>  {
    let meetingurl = event.url
    if (!meetingurl || !meetingurl.includes('daily')) {
        return {
            'success': 'failure!'
        };
    }
    let id = meetingurl.split("/").slice(-1)[0];
    var url = "https://api.daily.co/v1/meetings/" + '?room=' + id;
    const meetingInfo = await fetch(url, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + 'badf13551a98cd601e9d00e4e068633edb0b2a4375cf08dc2b9b1237de09a003'
        }
    });

    const dailySessionInfo = await meetingInfo.json();
    const sessionInfo =  dailySessionInfo.data; // traverse through the sessions and only consider the ones that are with in time range of event
    console.log(dailySessionInfo)
    for(var k = 0; k < sessionInfo.length; k++) {
        if(sessionInfo != undefined) {
            var sessionStartTime = new Date(sessionInfo[k]?.start_time * 1000);
            var sessionEndTime = new Date(sessionInfo[k]?.end_time * 1000);
            var eventStartTime = new Date(event.startDate);
            var eventEndTime = new Date(event.endDate);
            if(sessionEndTime < eventStartTime) { // break loop cause array is already sorted in reverse chronological order
                break;
            }
            // if(sessionStartTime >= eventStartTime && sessionStartTime <= eventEndTime) {
            if (sessionStartTime <= eventEndTime && sessionEndTime >= eventStartTime) {

                const participants = sessionInfo.participants;
                let map = new Map();



                const startTime = moment(event.startDate).tz("America/New_York");
                const endTime = moment(event.endDate).tz("America/New_York");

                let totalduration = endTime.diff(startTime, "seconds")
                for(var j = 0; j < participants.length; j++) {
                    let js_jointime = new Date(participants[j].join_time*1000)
                    let js_endtime = new Date((participants[j].join_time+ participants[j].duration)*1000)
                    let js_duration;
                    let interactions:IInteraction[] = []
                    if (moment(js_endtime).tz("America/New_York").diff(startTime, "seconds") < 0) {
                        js_duration = 0
                    } else {
                        // js_duration = moment(js_jointime).tz("America/New_York").diff(startTime, "seconds") 
                        js_duration = startTime.diff(moment(js_jointime).tz("America/New_York"), "seconds") 
                        if (js_duration > 0) {
                            js_duration = participants[j].duration - js_duration
                        } else {
                            js_duration = participants[j].duration
                        }
                    }
        
                    if (moment(js_jointime).tz("America/New_York").diff(endTime, "seconds") > 0) {
                        js_duration = 0
                    } else {
                        let js_duration_end = moment(js_endtime).tz("America/New_York").diff(endTime, "seconds") 
                        if (js_duration > 0) {
                            js_duration = js_duration - js_duration_end
                        }
                    }
        
                    if(map.has(participants[j].user_id)) { // update the duration
                        var current = map.get(participants[j].user_id);
                        current.virtualDuration += js_duration;
                        current.instances.push({
                            timeIn: js_jointime,
                            timeOut: js_endtime,
                            eventType: 'virtual' 
                        })
                    } else {
                        // let interaction = await Interaction.findOne({uuid: participants[j].user_id, 
                        //     eventID: event.id })

                        let interaction

                        for (var index = 0; index < interactions.length; index++) {
                            var obj1 = interactions[index];
                            if ( obj1["uuid"] == participants[j].user_id &&  obj1["eventID"] ==event.id  ) {
                                interaction = obj1;
                                break;
                            }
                           }

                        if (!interaction) {
                            interaction =  {
                                uuid: participants[j].user_id,
                                eventID: event.id,
                                instances: [{
                                    timeIn: js_jointime,
                                    timeOut: js_endtime,
                                    interactionType: 'virtual'
                                } as IInteractionInstance],
                                virtualDuration: js_duration,
                                eventTotalDuration: totalduration,
                                eventName: event.name,
                                eventType: event.type.name,
                                eventStartTime: event.startDate,
                                eventEndTime: event.endDate
                            }
                            interactions.push(interaction)
                        } else {
                            interaction.instances = [{
                                timeIn: js_jointime,
                                timeOut: js_endtime,
                                interactionType: 'virtual'
                            } as IInteractionInstance]
                            interaction.virtualDuration =  js_duration
                        }
                        map.set(participants[j].user_id, interaction);
                    }
                }

                map.forEach((value)=> {
                    value.virtualDuration = Math.min(value.virtualDuration, endTime.diff(startTime, "seconds"))
                    console.log(value)
                })
            }
        }
    }
}

export interface ICMSEvent {
    id: string
    name: string
    startDate: string
    endDate: string
    type: {
        name: string
        points: number
    }
    url: string
}


const query = `
    query eventData($id: ID!) {
        Event(where: { id: $id }) {
            id
            name
            startDate
            endDate
            type {
                name
                points
            }
            url
        }
    }
`;


export const getCMSEvent2 = async (eventId) => {
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    const variables = {
        "id": eventId
    }

    const res = await fetch(process.env.CMS_URL || "https://cms.hack.gt/admin/api", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    });

    const data = await res.json();

    return data.data?.Event as ICMSEvent | null;
}


export let queryCMS = async function() {
    let eventid = "616f21b6d020f00022987226"
    const event = await getCMSEvent2(eventid);
    await getMeetingInfo(event)
}
queryCMS()
    