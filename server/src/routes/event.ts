import express from "express"
import { getCMSEvent } from "../cms"
import { createNew} from "../entity/database";
import { IUser, User} from "../entity/User"
import { Interaction, IInteractionInstance, IInteraction} from "../entity/Interaction"

import moment, {Moment} from "moment-timezone";
import dotenv from "dotenv"
import {InteractionType, EventType} from "../utils/utils";
import {Date} from "mongoose";
dotenv.config();
const fetch = require('node-fetch');

export let logRoutes = express.Router();


const requestParams = ['uuid', 'eventID', 'eventType', 'interactionType']

logRoutes.route("/interaction").post(async (req, res) => {
    try {
        //validate request to make sure types are there
        for (let param of requestParams){
            if (!req.body[param]){
                console.log(`no ${param}`);
                return res.status(400).send(`no ${param}`);
            }
        }

        console.log('got here');

        //check interactiontype is valid
        if (!Object.values(InteractionType).includes(req.body.interactionType)){
            console.log(`interactionType not valid `);
            return res.status(400).send(`interactionType not valid`);
        }

        const eventType = EventType[req.body.eventType]; 
        //check eventType is valid
        if (!eventType) {
            console.log(`eventType not valid `);
            return res.status(400).send(`eventType not valid`);
        }

        console.log('got here 2');

        let endTime: Moment;
        const now = moment.utc().tz("America/New_York");

        //cms stuff if its inperson
        let name;
        let eventstarttime;
        let eventendtime;
        let eventtotalduration;
        if (eventType.isCMSEvent) {
            //cms event validation
            const event = await getCMSEvent(req.body.eventID);
            if (!event) {
                console.log("eventID not CMS event but eventType is CMS event")
                return res.status(400).send("eventID not CMS event but eventType is CMS event")
            }
            //eventType validation
            if (event.type.name != req.body.eventType){
                console.log("cms eventType not same as req eventType")
                return res.status(400).send("cms eventType not same as req eventType")
            }
        
            console.log('got here 3a');

        endTime = moment(event.endDate).tz("America/New_York");
        let startTime = moment(event.startDate).tz("America/New_York");

        console.log(event.endDate) 
//             //event already over check
//             if (moment.duration(endTime.diff(now)).minutes() < 0) {
//                 console.log("Event already ended ")
//                 return res.status(400).send("Event already ended")
//             }

            name = event.name;
            eventstarttime = event.startDate;
            eventendtime = event.endDate;
            eventtotalduration = endTime.diff(startTime, "seconds");

        } else {
            endTime = now;
            name = req.body.eventID;
            eventstarttime = "";
            eventendtime = "";
            eventtotalduration = 0;
        }
        //gets user, adds user if it isn't already there
        //atomic so maybe shouldnt break
        try {
            let user = await User.findOneAndUpdate(
                {uuid:req.body.uuid},
                {$setOnInsert: 
                    createNew<IUser>(User, {
                        uuid: req.body.uuid,
                        admin: false
                })},
                { upsert: true, new: true, runValidators: true });
        } catch (e) {
            console.log(`Error when getting/inserting user: ${e} `) 
            return res.status(400).send("error when get/insert user");
        }

        console.log('got here 3b');

        if (eventType.warnOnDup) {
            console.log('got here 3c');
            try {
                let interaction = await Interaction.findOneAndUpdate(
                    {uuid:req.body.uuid, eventID: req.body.eventID},
                    {$setOnInsert: 
                        createNew<IInteraction>(Interaction, {
                            eventID: req.body.eventID,
                            uuid: req.body.uuid,
                            instances: [
                                {
                                    timeIn: now.toDate(),
                                    timeOut: endTime.toDate(),
                                    interactionType: req.body.interactionType
                                }  as IInteractionInstance
                            ], 
                            eventType: req.body.eventType,
                            eventName: name,
                            eventStartTime: eventstarttime,
                            eventEndTime: eventendtime,
                            eventTotalDuration: eventtotalduration
                    })},
                    { upsert: true, new: true, runValidators: true });

                //if the times are the same it means we just inserted it
                //TODO: make less jank, we don't need to be atomic if in person (race condition prob wont happen in time for it to matter)
                if (interaction.instances && interaction.instances[0].timeIn.getTime() == now.toDate().getTime()) {
                    return res.status(200).send("success");
                } else if (interaction.instances && interaction.instances[0].timeIn.getTime() != now.toDate().getTime()){
                    console.log(interaction.instances[0].timeIn.getTime());
                    console.log(now.toDate().getTime());
                    return res.status(201).send("WarnOnDup true, user already checked in");
                } else {
                    throw "interaction instances not found"
                }
            } catch (e) {
                console.log(`Error when getting/inserting user: ${e} `) 
                return res.status(400).send("error when get/insert user");
            }
        } else {
            //pushes interaction instance, adds if it isnt already there
            try {
                console.log('got here 4');
                let interaction = await Interaction.updateOne(
                    {uuid: req.body.uuid, eventID: req.body.eventID},
                    {$push:
                        {   instances:    
                            { 
                                timeIn: now.toDate(),
                                timeOut: endTime.toDate(),
                                interactionType: req.body.interactionType
                            }  as IInteractionInstance
                        },
                        $setOnInsert: {
                            eventType: req.body.eventType,
                            eventName: name,
                            eventStartTime: eventstarttime,
                            eventEndTime: eventendtime,
                            eventTotalDuration: eventtotalduration
                        },
                    $inc: {_v: 1}
                    },
                    { upsert: true, new: true, runValidators: true });

                    console.log('got here 5');
            } catch (e) {
                console.log(`Error when getting/inserting interaction: Error: ${e} `) 
                return res.status(400).send("error when get/insert interaction");
            }
        return res.status(200).send("success");
        }
    } catch(err) {
        console.log((err as Error).message);
        return res.sendStatus(500);
    }
    
})

// const requestParams2 = ['uuid', 'eventID', 'eventType', 'virtualDuration']
logRoutes.route("/virtualinteraction").post(async (req, res) => {
    try {
        // console.log(req.body)
        const requestParams2 = ['uuid', 'eventID', 'eventType', 'virtualDuration']
        //validate request to make sure types are there
        // console.log(req.body)
        for (let param of requestParams2){
            if (!req.body[param]){
                console.log(`no ${param} `);
                return res.status(400).send(`no ${param} `);
            }
        }

        // //check interactiontype is valid
        // if (!Object.values(InteractionType).includes(req.body.interactionType)) {
        //     console.log(`interactionType not valid`);
        //     return res.status(400).send(`interactionType not valid`);
        // }

        const eventType = EventType[req.body.eventType]; 
        //check eventType is valid
        if (!eventType) {
            console.log(`eventType not valid `);
            return res.status(400).send(`eventType not valid `);
        }

        let endTime: Moment;
        const now = moment.utc().tz("America/New_York");

        //cms stuff if its inperson



        const event = await getCMSEvent(req.body.eventID);
        if (!event) {
            console.log("eventID not CMS event but eventType is CMS event ")
            return res.status(400).send("eventID not CMS event but eventType is CMS event")
        }

        //eventType validation
        if (event.type.name != req.body.eventType) {
            console.log("cms eventType not same as req eventType ")
            return res.status(400).send("cms eventType not same as req eventType")
        }

        endTime = moment(event.endDate).tz("America/New_York");
        let startTime = moment(event.startDate).tz("America/New_York");

        console.log(event.endDate) 
        //event already over check
        if (moment.duration(endTime.diff(now)).minutes() < 0) {
            console.log("Event already ended ")
            return res.status(400).send("Event already ended")
        }


        let name = event.name;
        let eventstarttime = event.startDate;
        let eventendtime = event.endDate;
        let eventtotalduration = endTime.diff(startTime, "seconds");


        try {
            let interaction = await Interaction.findOneAndUpdate(
                {uuid:req.body.uuid, eventID: req.body.eventID},
                {$setOnInsert: 
                    createNew<IInteraction>(Interaction, {
                        eventID: req.body.eventID,
                        uuid: req.body.uuid,
                        instances: [
                            {
                                timeIn: now.toDate(),
                                timeOut: endTime.toDate(),
                                interactionType: InteractionType.Virtual
                            }  as IInteractionInstance
                        ],
                        virtualDuration: req.body.virtualDuration,
                        eventType: req.body.eventType,
                        eventName: name,
                        eventStartTime: eventstarttime,
                        eventEndTime: eventendtime,
                        eventTotalDuration: eventtotalduration
                })},
                { upsert: true, new: true, runValidators: true });
            
            //if the times are the same it means we just inserted it
            //TODO: make less jank, we don't need to be atomic if in person (race condition prob wont happen in time for it to matter)
            if (interaction.instances && interaction.instances[0].timeIn.getTime() == now.toDate().getTime()){
                return res.status(200).send("success");
            } else if (interaction.instances && interaction.instances[0].timeIn.getTime() != now.toDate().getTime()){
                console.log(interaction.instances[0].timeIn.getTime());
                console.log(now.toDate().getTime());
                return res.status(201).send("WarnOnDup true, user already checked in");
            } else {
                throw "interaction instances not found"
            }
        } catch (e) {
            console.log(`Error when getting/inserting user: ${e} `) 
            return res.status(400).send("error when get/insert user");
        }
    } catch(err) {
        console.log((err as Error).message);
        return res.sendStatus(500);
    }
    
})


logRoutes.route("/dailyeventlog/:eventID").get(async (req, res) => {

    // console.log(req.params.eventID)
    const event = await getCMSEvent(req.params.eventID);
    console.log('second')
    // console.log(event)


    if (!event ||  !event.url    || !event.url.includes('daily')) {
        return res.status(400).send("error not right");
    }

    let meetingurl = event.url
 
    let id = meetingurl.split("/").slice(-1)[0];
    var url = "https://api.daily.co/v1/meetings/" + '?room=' + id;
    const meetingInfo = await fetch(url, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + String(process.env.DAILY_KEY)
        }
    });

    const dailySessionInfo = await meetingInfo.json();
    // console.log(dailySessionInfo)
    const sessionInfo =  dailySessionInfo.data; // traverse through the sessions and only consider the ones that are with in time range of event

    if (sessionInfo) {
        for(var k = 0; k < sessionInfo.length; k++) {
                var sessionStartTime = new Date(sessionInfo[k]?.start_time * 1000);
                // var sessionEndTime = new Date( (sessionInfo[k]?.start_time + sessionInfo[k]?.duration) * 1000);
                var eventStartTime = new Date(event.startDate);
                var eventEndTime = new Date(event.endDate);
                var sessionEndTime = new Date(event.endDate);
                // if(sessionEndTime < eventStartTime) { // break loop cause array is already sorted in reverse chronological order
                //     break;
                // }
                // console.log(sessionInfo[k])
                // if(sessionStartTime >= eventStartTime && sessionStartTime <= eventEndTime) {
                if (sessionStartTime <= eventEndTime && sessionEndTime >= eventStartTime) {
                    // console.log(sessionStartTime, sessionEndTime, eventStartTime, eventEndTime, k)

                    const participants = sessionInfo[k].participants;
                    let map = new Map();

                    const startTime = moment(event.startDate).tz("America/New_York");
                    const endTime = moment(event.endDate).tz("America/New_York");

                    let totalduration = endTime.diff(startTime, "seconds")
                    for(var j = 0; j < participants.length; j++) {
                        if (participants[j].user_id) {
                            console.log('be user')
                            // try {
                            //     let user = await User.findOneAndUpdate(
                            //         {uuid: participants[j].user_id},
                            //         {$setOnInsert: 
                            //             createNew<IUser>(User, {
                            //                 uuid: participants[j].user_id,
                            //                 admin: false
                            //         })},
                            //         { upsert: true, new: true, runValidators: true });
                            // } catch (e) {
                            //     console.log(`Error when getting/inserting user: ${e} `) 
                            //     return res.status(400).send("error when get/insert user");
                            // }
                            let user = await User.findOne({uuid: participants[j].user_id})
                            if (!user) {
                                user = createNew<IUser>(User, {
                                            uuid: participants[j].user_id,
                                            admin: false
                                })
                            }
                            await user.save()

                            console.log(user, participants[j].user_id)
                            console.log('after')
                            // console.log(participants[j])
                            // console.log(j, participants.length)
                            let js_jointime = new Date(participants[j].join_time*1000)
                            let js_endtime = new Date((participants[j].join_time+ participants[j].duration)*1000)
                            let js_duration;
                            console.log(js_jointime, participants[j].duration, js_endtime, participants[j].join_time*1000)
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
                            console.log('hrerere')
                            if(map.has(participants[j].user_id)) { // update the duration
                                var current = map.get(participants[j].user_id);
                                current.virtualDuration += js_duration;
                                current.instances.push({
                                    timeIn: js_jointime,
                                    timeOut: js_endtime,
                                    eventType: 'virtual' 
                                })
                            } else {
                                let interaction = await Interaction.findOne({uuid: participants[j].user_id, 
                                    eventID: event.id })
                                if (!interaction) {
                                    interaction = createNew(Interaction, {
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
                                    })
                                } else {
                                    js_duration
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
                        // console.log(participants[j])
                        // console.log(j, participants.length)
                      
                    }
                    map.forEach((value)=> {
                        value.virtualDuration = Math.min(value.virtualDuration, endTime.diff(startTime, "seconds"))
                        value.save()
                        // console.log(value)
                    })
                    console.log('done')
                }
        }
    }

    
    
})
