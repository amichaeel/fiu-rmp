window.onload = (event) => {
  const observer = new MutationObserver((mutationsList, observer) => {
    const table = document.getElementsByClassName('ps_grid-body')[2];
    if (table) {
      const rows = table.children;
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const nameElement = row.querySelector(`#SSR_CLSRCH_F_WK_SSR_INSTR_LONG_1\\$86\\$\\$${i}`);
        const name = nameElement?.textContent?.trim();

        if (name) {
          chrome.runtime.sendMessage({ professorName: name }, (response) => {
            if (response.success) {
              const htmlText = response.htmlText;
              const parser = new DOMParser();
              const doc = parser.parseFromString(htmlText, "text/html");
              const professorList = doc.querySelectorAll(
                "a.TeacherCard__StyledTeacherCard-syjs0d-0"
              );

              let foundProfessor = null;
              professorList.forEach((professorLink) => {
                const professorNameDiv = professorLink.querySelector("div.CardName__StyledCardName-sc-1gyrgim-0");
                const universityNameDiv = professorLink.querySelector("div.CardSchool__School-sc-19lmz2k-1");
                const ratingDiv = professorLink.querySelector("div > div > div > div:nth-child(2)");
                const profName = professorNameDiv?.textContent?.trim();
                const universityName = universityNameDiv?.textContent?.trim();
                const rating = ratingDiv?.textContent?.trim();
                if (profName === name && universityName === "Florida International University") {
                  console.log('Found')
                  foundProfessor = professorLink.href.split(".edu")[1];
                  const link = `https://www.ratemyprofessors.com${foundProfessor}`;

                  const parentElement = nameElement.parentElement;
                  const ratingElement = document.createElement('a');
                  let color = 'green'
                  if (rating < 3.0) {
                    color = 'red';
                  } else if (rating < 4.0) {
                    color = 'orange';
                  }

                  ratingElement.href = link;
                  parentElement.style.display = 'ruby';
                  ratingElement.style.color = 'white';
                  ratingElement.style.padding = '3px';
                  ratingElement.style.borderRadius = '5px';
                  ratingElement.style.backgroundColor = color;
                  ratingElement.innerText = `${rating}`;
                  nameElement.insertAdjacentElement("afterend", ratingElement);
                }
              });
            } else {
              console.log("Error: " + response.message);
            }
          });
        }
      }
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
};
