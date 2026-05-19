
/** 
 * @param {GoogleAppsScript.Events.DoPost} e 
 * @returns {GoogleAppsScript.Content.TextOutput}
 */
function doPost(e) {
  console.log("doPost", JSON.stringify({ pathInfo: e.pathInfo, postData: e.postData }));

  // JSON response
  try {
    let body = null;
    switch (e.pathInfo) {
      case "api/admin/setScriptProperties":
        body = _setScriptProperties(JSON.parse(e.postData.contents));
        break;
      case "api/admin/tryCreateTriggers":
        body = _tryCreateTriggers();
        break;
      case "api/admin/tryInitialSync":
        body = _tryInitialSync();
        break;
      default:
        throw new Error(`Unknown path: ${e.pathInfo}`);
    }

    const response = ContentService.createTextOutput(JSON.stringify({ status: "success", body }));
    response.setMimeType(ContentService.MimeType.JSON);
    return response;
  } catch (error) {
    console.error("Error in doPost:", error);
    if (error instanceof Error) {
      error = error.toString();
    }
    const response = ContentService.createTextOutput(JSON.stringify({ status: "error", error }));
    response.setMimeType(ContentService.MimeType.JSON);
    return response;
  }
}

/**
 * @param {GoogleAppsScript.Events.DoGet} e 
 * @returns {GoogleAppsScript.Content.TextOutput | GoogleAppsScript.HTML.HtmlOutput}
 */
function doGet(e) {
  console.log("doGet", JSON.stringify({ pathInfo: e.pathInfo, parameter: e.parameter }));

  // HTML response
  try {
    switch (e.pathInfo) {
      case undefined:
        return HtmlService
          .createTemplateFromFile('index')
          .evaluate();
      default:
        throw new Error(`Unknown path: ${e.pathInfo}`);
    }
  } catch (error) {
    console.error("Error in doGet:", error);
    if (error instanceof Error) {
      error = error.toString();
    }
    const response = ContentService.createTextOutput(JSON.stringify({ status: "error", error }));
    response.setMimeType(ContentService.MimeType.JSON);
    return response;
  }
}

/**
 * @param {{string: string} | {}} params 
 */
function _setScriptProperties(params = {}) {
  for (const [key, value] of Object.entries(params)) {
    console.log(`Setting script property: ${key} = ${value}`);
    PropertiesService.getScriptProperties().setProperty(key, value);
  }
  return {};
}

function _tryCreateTriggers() {
  ScriptApp.getProjectTriggers().forEach(trigger => {
    if (trigger.getHandlerFunction() === 'onCalendarEdit') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger('onCalendarEdit')
    .timeBased()
    .atHour(0)
    .everyDays(1)
    .create();

  ScriptApp.newTrigger('onCalendarEdit')
    .forUserCalendar(getCalendarId())
    .onEventUpdated()
    .create();

  return {};
}

function _tryInitialSync() {
  initialSync();
  return { message: "synced" };
}