function initialSync() {
  // Check related services
  if (!Calendar) {
    throw new Error("Calendar service is not available.");
  }

  const calendarId = getCalendarId();

  /** @type {string | undefined} */
  let nextPageToken = undefined;
  /** @type {string | undefined} */
  let nextSyncToken = undefined;

  const options = {
    maxResults: 100,
    timeMin: today().toISOString(),
  };

  do {
    /** @type {GoogleAppsScript.Calendar.Schema.Events} */
    const result = Calendar.Events.list(calendarId, { ...options, pageToken: nextPageToken });

    nextPageToken = result.nextPageToken;
    console.log("nextPageToken", nextPageToken);

    if (result.nextSyncToken) {
      nextSyncToken = result.nextSyncToken;
    }
  } while (nextPageToken);
  
  console.log("nextSyncToken", nextSyncToken);
  if (nextSyncToken) {
    setSyncToken(nextSyncToken);
  }
}

function onCalendarEdit() {
  if (!Calendar) {
    throw new Error("Calendar service is not available.");
  }

  const calendarId = getCalendarId();
  const ownerEmail = getOwnerEmail();

  let nextPageToken = null;
  let nextSyncToken = getSyncToken();
  console.log("nextSyncToken", nextSyncToken);
  
  if (!nextSyncToken) {
    throw new Error("nextSyncToken is empty.");
  }

  const options = {
    maxResults: 100,
    syncToken: nextSyncToken
  };

  const targetItems = [];

  do {
    /** @type {GoogleAppsScript.Calendar.Schema.Events} */
    const result = Calendar.Events.list(calendarId, { ...options, pageToken: nextPageToken ?? undefined });
    console.log("result", JSON.stringify({...result, items: "[truncated]"}));
    
    nextPageToken = result.nextPageToken;
    console.log("nextPageToken", nextPageToken);

    if (result.nextSyncToken) {
      nextSyncToken = result.nextSyncToken;
    }

    const items = _filterItems(result.items || [], {creatorEQ: ownerEmail, endGTEQ: yesterday().toISOString(), hasRecordingAttachments: true});
    console.log("hit!:", items.length);
    targetItems.push(...items);
  } while (nextPageToken);

  for (const item of targetItems) {
    console.log("_shareRecordingsToAttendees", item);
    _shareRecordingsToAttendees(item, { excludeEmails: [ownerEmail]});
  }

  console.log("nextSyncToken", nextSyncToken);
  setSyncToken(nextSyncToken);
}


/**
 * @param {GoogleAppsScript.Calendar.Schema.Event[]} items 
 * @param {{creatorEQ?: string, endGTEQ?: string, hasRecordingAttachments?: boolean}} conditions 
 * @returns {GoogleAppsScript.Calendar.Schema.Event[]}
 */
function _filterItems(items, conditions) {
  return (items || []).filter((item) => {
    let result = true;

    if (conditions.creatorEQ && item.creator?.email) {
      result = result && item.creator.email === conditions.creatorEQ;
    }

    if (conditions.endGTEQ && item.end?.dateTime) {
      result = result && Date.parse(item.end.dateTime) >= Date.parse(conditions.endGTEQ);
    }

    if (conditions.hasRecordingAttachments && item.attachments) {
      result = result && item.attachments.some(
        (attachment) => _isRecordingAttachment(attachment, item.summary));
    }

    return result;
  });
}

/**
 * @param {*} attachment 
 * @param {*} summary 
 * @returns {boolean}
 */
function _isRecordingAttachment(attachment, summary) {
  let result = true;
  result = result && attachment.mimeType === "video/mp4";
  result = result && attachment.title?.endsWith("Recording");
  result = result && attachment.title?.startsWith(summary);
  return result;
}

/** 
 * @param {GoogleAppsScript.Calendar.Schema.Event} item
 * @param {{excludeEmails?: string[]}} options
 */
function _shareRecordingsToAttendees(item, options = { excludeEmails: [] }) {
  if (!item.attendees) {
    return;
  }

  const attendeeEmails = item.attendees.flatMap((attendee) => {
    const email = attendee.email;
    return (email && !options.excludeEmails?.includes(email)) ? [email] : [];
  });
  console.log("attendeeEmails", attendeeEmails);

  for (const attachment of item.attachments || []) {
    if (_isRecordingAttachment(attachment, item.summary) && attachment.fileId) {
      const file = DriveApp.getFileById(attachment.fileId);
      console.log("title", file.getName());
      file.addViewers(attendeeEmails);
    }
  }
}