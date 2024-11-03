# Create userBoxs with the photo,name,lastmessage etc...

# When you click one of those, send a post request to this route with the params

-userID which includes the id of the user you just clicked and want to start a conversation

-isGroup a boolean,
-members an array with the values of the ids of the group members, each id is inside a single object?
-name the name of the group in a single string

# Inside this route, create a POST handler that gets the user logged in in the db, the currentUser logged in and all the params we mentioned before

# first, handle the creation of the conversation("cv" from now on) if the param isGroup is true, in which case it have to validates if the members are correct and are more than 1, I mean x >= 2 and if the name is correct

## db.conversation.create, add the data:{ here add the isGroup,members and the name, then users:{where a connect:[which has the work of relationate some values, in this case all the members ids except yours, you add yours later as a simple object{id:dbUser.id}]}}

## second, handle the creation of a single conversation, in there you have search of that conversation already exists first, using findMany:{{where:OR:{userIds:{firstid,secondid}} and at reverse {userIds:secondId,firstId}}} if that exists, just return it, in case it doesnt exist just create a newSingleConversation , similar to the group but connecting just 2 objects your id, and the other userId , then return it
