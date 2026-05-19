function today() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate());
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function yesterday() {
  const d = new Date(today().getTime() - 1000*60*60*24);
  return d;
}

function getCalendarId() {
  const calendarId = PropertiesService.getScriptProperties().getProperty("calendarId");
  console.log("getCalendarId", calendarId);  

  if (!calendarId) {
    throw new Error("calendarId is empty.");
  }

  return calendarId;
}

function getOwnerEmail() {
  const ownerEmail = PropertiesService.getScriptProperties().getProperty("ownerEmail");
  console.log("getOwnerEmail", ownerEmail);
  
  if (!ownerEmail) {
    throw new Error("ownerEmail is empty.");
  }

  return ownerEmail;
}

function getSyncToken() {
  const syncToken = PropertiesService.getScriptProperties().getProperty("syncToken");
  console.log("getSyncToken", syncToken);
  
  if (!syncToken) {
    throw new Error("syncToken is empty.");
  }

  return syncToken;
}

/**
 * @param {string} syncToken 
 */
function setSyncToken(syncToken) {
  console.log("setSyncToken", syncToken);
  PropertiesService.getScriptProperties().setProperty("syncToken", syncToken);
}