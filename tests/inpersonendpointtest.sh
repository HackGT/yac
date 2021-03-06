#NOTE: YOU HAVE TO SET THE AUTH KEY YOURSELF
#TODO: rewrite in less cancerous way
# Ideal output:
# no uuid x2
# no eventID x2
# no interactionType x2
# incorrect interactionType
# no eventType *2
# incorrect eventType
# eventid not in cms but event is cms event
# eventid not synced with cms 
# event alrady over
# Incorrect auth token
# 200 create cms interaction + push inperson
# 200 push another interaction same
# 200 push another interaction hetero
# 200 create non-cms interaction + push virtual 
# 200 push another interaction same
# 200 push another interaction hetero
# 200 cms meal event, add interaction  
# 201 cms meal event, returns but warns

#no uuid
curl -X POST http://localhost:3000/log/interaction -H 'Content-Type: application/json' -H 'Authorization: Bearer test' -d '{"eventID":"60c2a0c7063b3d002254f588", "interactionType": "inperson", "eventType":"important"}'

#empty uuid
curl -X POST http://localhost:3000/log/interaction -H 'Content-Type: application/json' -H 'Authorization: Bearer test' -d '{"uuid":"","eventID":"60c2a0c7063b3d002254f588", "interactionType": "inperson", "eventType":"important"}'

#no eventID
curl -X POST http://localhost:3000/log/interaction -H 'Content-Type: application/json' -H 'Authorization: Bearer test' -d '{"uuid":"606e25a1-9b86-4af1-b849-8e0f0ec51b1c", "interactionType": "inperson", "eventType":"important"}'

#empty eventID
curl -X POST http://localhost:3000/log/interaction -H 'Content-Type: application/json' -H 'Authorization: Bearer test' -d '{"uuid":"606e25a1-9b86-4af1-b849-8e0f0ec51b1c","eventID":"", "interactionType": "inperson", "eventType":"important"}'

#no interactionType
curl -X POST http://localhost:3000/log/interaction -H 'Content-Type: application/json' -H 'Authorization: Bearer test' -d '{"uuid":"606e25a1-9b86-4af1-b849-8e0f0ec51b1c","eventID":"60c2a0c7063b3d002254f588", "eventType":"important"}'

#empty interactionType
curl -X POST http://localhost:3000/log/interaction -H 'Content-Type: application/json' -H 'Authorization: Bearer test' -d '{"uuid":"606e25a1-9b86-4af1-b849-8e0f0ec51b1c","eventID":"60c2a0c7063b3d002254f588", "interactionType": "", "eventType":"important"}'

#incorrect interactionType
curl -X POST http://localhost:3000/log/interaction -H 'Content-Type: application/json' -H 'Authorization: Bearer test' -d '{"uuid":"606e25a1-9b86-4af1-b849-8e0f0ec51b1c","eventID":"60c2a0c7063b3d002254f588", "interactionType": "enrgr", "eventType":"important"}'

#no eventType 
curl -X POST http://localhost:3000/log/interaction -H 'Content-Type: application/json' -H 'Authorization: Bearer test' -d '{"uuid":"606e25a1-9b86-4af1-b849-8e0f0ec51b1c", "interactionType": "inperson", "eventID":"60c2a0c7063b3d002254f588"}'

#empty eventType 
curl -X POST http://localhost:3000/log/interaction -H 'Content-Type: application/json' -H 'Authorization: Bearer test' -d '{"uuid":"606e25a1-9b86-4af1-b849-8e0f0ec51b1c","eventID":"60c2a0c7063b3d002254f588", "interactionType": "inperson", "eventType":""}'

#incorrect eventType 
curl -X POST http://localhost:3000/log/interaction -H 'Content-Type: application/json' -H 'Authorization: Bearer test' -d '{"uuid":"606e25a1-9b86-4af1-b849-8e0f0ec51b1c","eventID":"60c2a0c7063b3d002254f588", "interactionType": "inperson", "eventType":"Epo"}'


#event id not cms
curl -X POST http://localhost:3000/log/interaction -H 'Content-Type: application/json' -H 'Authorization: Bearer test' -d '{"uuid":"606e25a1-9b86-4af1-b849-8e0f0ec51b1c","eventID":"61562b7b1c038002fc7457", "interactionType": "inperson", "eventType":"important"}'

#eventtype not same as cms
curl -X POST http://localhost:3000/log/interaction -H 'Content-Type: application/json' -H 'Authorization: Bearer test' -d '{"uuid":"606e25a1-9b86-4af1-b849-8e0f0ec51b1c","eventID":"60c2a0c7063b3d002254f588", "interactionType": "inperson", "eventType":"important"}'

#event already over 
curl -X POST http://localhost:3000/log/interaction -H 'Content-Type: application/json' -H 'Authorization: Bearer test' -d '{"uuid":"606e25a1-9b86-4af1-b849-8e0f0ec51b1c","eventID":"5f8093dc8f6dd100221f9293", "interactionType": "inperson", "eventType":"workshop"}'

#no auth
curl -X POST http://localhost:3000/log/interaction -H 'Content-Type: application/json' -H 'Authorization: Bearer te' -d '{"uuid":"606e25a1-9b86-4af1-b849-8e0f0ec51b1c", "eventID":"60c2a0c7063b3d002254f588", "interactionType": "inperson", "eventType":"important"}'

# cms inperson create
curl -X POST http://localhost:3000/log/interaction -H 'Content-Type: application/json' -H 'Authorization: Bearer test' -d '{"uuid":"606e25a1-9b86-4af1-b849-8e0f0ec51b1c", "eventID":"60c2a0c7063b3d002254f588", "interactionType": "inperson", "eventType":"workshop"}'

# cms inperson push
curl -X POST http://localhost:3000/log/interaction -H 'Content-Type: application/json' -H 'Authorization: Bearer test' -d '{"uuid":"606e25a1-9b86-4af1-b849-8e0f0ec51b1c", "eventID":"60c2a0c7063b3d002254f588", "interactionType": "inperson", "eventType":"workshop"}'

# cms virtual push 
curl -X POST http://localhost:3000/log/interaction -H 'Content-Type: application/json' -H 'Authorization: Bearer test' -d '{"uuid":"606e25a1-9b86-4af1-b849-8e0f0ec51b1c", "eventID":"60c2a0c7063b3d002254f588", "interactionType": "virtual", "eventType":"workshop"}'

# noncms virtual create
curl -X POST http://localhost:3000/log/interaction -H 'Content-Type: application/json' -H 'Authorization: Bearer test' -d '{"uuid":"606e25a1-9b86-4af1-b849-8e0f0ec51b1c", "eventID":"test", "interactionType": "virtual", "eventType":"insight"}'

# noncms virtual push
curl -X POST http://localhost:3000/log/interaction -H 'Content-Type: application/json' -H 'Authorization: Bearer test' -d '{"uuid":"606e25a1-9b86-4af1-b849-8e0f0ec51b1c", "eventID":"test", "interactionType": "virtual", "eventType":"insight"}'

# noncms inperson push 
curl -X POST http://localhost:3000/log/interaction -H 'Content-Type: application/json' -H 'Authorization: Bearer test' -d '{"uuid":"606e25a1-9b86-4af1-b849-8e0f0ec51b1c", "eventID":"test", "interactionType": "inperson", "eventType":"insight"}'

# cms meal create
curl -X POST http://localhost:3000/log/interaction -H 'Content-Type: application/json' -H 'Authorization: Bearer test' -d '{"uuid":"606e25a1-9b86-4af1-b849-8e0f0ec51b1c", "eventID":"616b29851c03860022fc7493", "interactionType": "inperson", "eventType":"food"}'

# cms meal push
curl -X POST http://localhost:3000/log/interaction -H 'Content-Type: application/json' -H 'Authorization: Bearer test' -d '{"uuid":"606e25a1-9b86-4af1-b849-8e0f0ec51b1c", "eventID":"616b29851c03860022fc7493", "interactionType": "inperson", "eventType":"food"}'

