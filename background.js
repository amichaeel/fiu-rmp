chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.professorName) {
    const professorName = message.professorName.trim();
    const url = `https://www.ratemyprofessors.com/search/professors/18445?q=${professorName.split(" ").join("+")}`;

    fetch(url)
      .then(response => response.text())
      .then(htmlText => {
        sendResponse({ success: true, htmlText });
      })
      .catch(error => {
        console.error('Error fetching the page:', error);
        sendResponse({ success: false, message: "Error fetching page" });
      });

    return true;
  }
});
