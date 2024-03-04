export const joinGroup = (setting) => {
  const strSetting = `
      {
        delayTimeEnd: ${setting.delayTimeEnd},
        delayTimeStart: ${setting.delayTimeStart},
        groupEnd: ${setting.groupEnd},
        groupStart: ${setting.groupStart},
        isAutoAnswer: ${setting.isAutoAnswer},
        option: ${JSON.stringify(setting.option)},
        answer: ${JSON.stringify(setting.answer)},
        text:${JSON.stringify(setting.text)},
      }`;
  console.log(strSetting);
  return `

  const findBtn = async (page, content) => {
    try {
      const buttons = await getElements(page, '[class="native-text"]');
      for (let i = 0; i < buttons.length; i++) {
        const btn = await page.evaluate((el) => {
          return el.innerHTML;
        }, buttons[i]);
  
        if (btn.includes(content)) {
          return buttons[i];
        }
      }
    } catch (err) {
      logger(err);
    }
  };
    const findBtns = async (page, content) => {
    try {
      let arr = [];
      let buttons = await getElements(page, '[class="native-text"]');
      for (let i = 0; i < buttons.length; i++) {
        const btn = await page.evaluate((el) => {
          return el.innerHTML;
        }, buttons[i]);
        if (btn.includes(content)) {
          arr.push( buttons[i]);
        }
      }
      if(arr.length == 0){
        buttons = await getElements(page, '[class="internal-input native-text native-text non-native-input"]');
        for (let i = 0; i < buttons.length; i++) {
        const btn = await page.evaluate((el) => {
          return el.innerHTML;
        }, buttons[i]);
        if (btn.includes(content)) {
          arr.push( buttons[i]);
        }
      }
      }
      return arr;
    } catch (err) {
      logger(err);
    }
  };
const scrollAndJoin = async (page, selector, randomDelay, joinGroupObject) => {
  try {
    // scroll before click
    let temp = getRandomIntBetween(1, 3);
    logger("số lần scroll " + temp);
    await scrollSmooth(page,temp)
    let joinBtns = await getElements(page, selector, 10);
    if (joinBtns.length < 1 || !joinBtns) return false;
    let isJoin = false;
    let arr = [];
    let newIndex = -1;
    // thêm những nút join ở màn hình vào mảng
    for (let i = 0; i < joinBtns.length; i++) {
      if (newIndex > i) continue;
      // get length after scroll
      joinBtns = await getElements(page, selector, 10);
      const joinId = await page.evaluate((el) => {
        return el.parentNode.getAttribute("data-action-id");
      }, joinBtns[i]);
      if (!joinId) continue;
      // click join button on the screen
      const joinGroupSelector = 'div[data-action-id="' + joinId + '"]';
      const isOnScreen = await checkExistElementOnScreen(
        page,
        joinGroupSelector
      );
      if (isOnScreen == 0) {
        if (arr.length == 3) {
          newIndex = i;
          break;
        }
        const joinBtn = await getElement(page, joinGroupSelector, 10);
        if (!joinBtn) continue;
        arr.push(joinBtn);
        logger("Thêm vào mảng");
      }
    }
    // random nút có trên màn hình để click
    if (arr.length == 0) return false;
    let randomIndex = getRandomInt(arr.length);
    await delay(1000);
    await scrollSmoothIfElementNotExistOnScreen(arr[randomIndex]);
    await delay(1000);
    await clickElement(arr[randomIndex]);
    await delay(randomDelay);
    //   check if group have to answer question before join
    let submitSelector =
      "#screen-root > div > div.m.fixed-container.bottom > div > div> div";
    let submitBtn = await getElement(page, submitSelector, 2);
    //   if form answer does not appear => join successfull
    if (!submitBtn) {
      isJoin = true;
      return isJoin;
    }
    if (joinGroupObject.isAutoAnswer == true) {
      const rs = await answerGroupQuestion(page, joinGroupObject);
      if (!rs) return false;
      isJoin = true;
      return isJoin;
    } else {
      const rs = await joinWithoutAnswer(page);
      if (!rs) return false;
      isJoin = true;
      return isJoin;
    }
  } catch (error) {
    logger(error);
    return false;
  }
};
const joinGroupByRequest = async (page, joinGroupObject) => {
  try {
    let randomDelay = getRandomIntBetween(
      joinGroupObject.delayTimeStart * 1000,
      joinGroupObject.delayTimeEnd * 1000
    );
    let joinSelector =
      "#screen-root > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(4) > div";
    const rs = await scrollAndJoin(
      page,
      joinSelector,
      randomDelay,
      joinGroupObject
    );
    if (!rs) return false;
    return true;
  } catch (error) {
    logger(error);
    return false;
  }
};
const answerGroupQuestion = async (page, joinGroupObject) => {
  try {
     let isAnswer = false;
    // click radio button
    const radioBtns = await findBtns(page, "󰞰");
    for(let i = 0 ; i < radioBtns.length; i++){
      logger(radioBtns);
      if(i % 2 == 0){
        await scrollSmoothIfElementNotExistOnScreen(page,radioBtns[i]);
        await delay(1000);
        await clickElement(radioBtns[i]);
        isAnswer = true;
        await delay(1000);
      }
    }
    await delay(2000);
    let textareaSelector =
      "#screen-root > div > div > div > div > div > div> div > div > div > div > textarea";
    let textarea = await getElements(page, textareaSelector, 10);
      if (textarea) {
        logger("textarea.length " + textarea.length);
        for (let i = 0; i < textarea.length; i++) {
            const textAreaId = await page.evaluate((el) => {
              return el.parentNode.getAttribute(
                "data-keyboard-shown-visible-component-id"
              );
            }, textarea[i]);
            if (!textAreaId) {
              isAnswer = false;
              logger("không có textArea");
              break;
            }
            let areaSelector =
              'div[data-keyboard-shown-visible-component-id="' +
              textAreaId +
              '"]';
            let area = await getElement(page, areaSelector, 10);
            if (!area) {
              isAnswer = false;
              logger("không có area");
              break;
            }
            await scrollSmoothIfNotExistOnScreen(page, areaSelector);
            await delay(1000);
            await clickElement(area);
            await delay(2000);
            let randomText =
              joinGroupObject.answer[
                getRandomInt(joinGroupObject.answer.length)
              ];
            await page.keyboard.type(randomText, { delay: 200 });
            isAnswer = true;
            logger("answer " + i);
            await delay(2000);
        }
      }
    // click submit
    await delay(2000)
    let submitSelector =
      "#screen-root > div > div.m.fixed-container.bottom > div > div> div";
    const submitBtn = await getElement(page, submitSelector, 10);
    if (!submitBtn) return false;
    await scrollSmoothIfNotExistOnScreen(page, submitSelector);
    await delay(2000);
    await clickElement(submitBtn);
    await delay(1000);
    return isAnswer;
  } catch (error) {
    logger(error);
    return false;
  }
};
const joinWithoutAnswer = async (page) => {
  try {

    // click radio button
    let arrBtn = [];
    const buttons = await getElements(page, '[class="native-text"]');
      for (let i = 0; i < buttons.length; i++) {
        const btn = await page.evaluate((el) => {
          return el.innerHTML;
        }, buttons[i]);
         if (btn.includes("󱠲")) {
          arrBtn.push(button[i]);
        }
      }
      if(arrBtn.length > 0) {
        await clickElement(arrBtn[0]);
      }

    let returnSelector =
      "#screen-root > div > div.m.fixed-container.top > div > div > div:nth-child(1) > div";
    let returnBtn = await getElement(page, returnSelector, 10);
    if (!returnBtn) return fasle;
    await scrollSmoothIfNotExistOnScreen(page, returnSelector);
    await delay(1000);
    await clickElement(returnBtn);
    await delay(1000);
    const exitSelector =
      "#screen-root > div.m.bg-s1.dialog-screen > div.m.dialog-vscroller > div > div > div.m.nb > div > div:nth-child(3)";
    let exitBtn = await getElement(page, exitSelector, 10);
    if (!exitBtn) return fasle;
    await delay(1000);
    await clickElement(exitBtn);
    await delay(1000);
    return true;
  } catch (error) {
    logger(error);
    return false;
  }
};
const joinGroupByKeyword = async (page, joinGroupObject) => {
  try {
    let randomDelay = getRandomIntBetween(
      joinGroupObject.delayTimeStart * 1000,
      joinGroupObject.delayTimeEnd * 1000
    );
    let joinSelector =
      "#screen-root > div > div:nth-child(2) > div > div > div > div > div:nth-child(5) > div.m > div";
    const rs = await scrollAndJoin(
      page,
      joinSelector,
      randomDelay,
      joinGroupObject
    );
    if (!rs) return false;
    await delay(randomDelay);
    return true;
  } catch (error) {
    logger(error);
    return false;
  }
};
const joinGroupByUID = async (page, joinGroupObject) => {
  try {
    let randomDelay = getRandomIntBetween(
      joinGroupObject.delayTimeStart * 1000,
      joinGroupObject.delayTimeEnd * 1000
    );
    await delay(randomDelay);
    // check joined group before
    const checkSelector =
      " #screen-root > div > div:nth-child(2) > div:nth-child(4) > div > div:nth-child(2)";
    const check = await getElements(page, checkSelector, 10);
    if (!check || check.length >= 2) {
      logger("Đã vào nhóm từ trước");
      return false;
    }
    const joinSelector =
      "#screen-root > div > div:nth-child(2) > div:nth-child(4) > div:nth-child(3) > div";
    const joinBtn = await getElement(page, joinSelector, 10);
    if (!joinBtn) return false;
    await delay(2000);
    // if not pending , click join
    await clickElement(joinBtn);
    await delay(randomDelay);
    //   check if group have to answer question before join
    let submitSelector =
      "#screen-root > div > div.m.fixed-container.bottom > div > div> div";
    let submitBtn = await getElement(page, submitSelector, 2);
    //   if form answer does not appear => join successfull
    if (!submitBtn) return true;
    if (joinGroupObject.isAutoAnswer == true) {
      const rs = await answerGroupQuestion(page, joinGroupObject);
      if (!rs) return false;
      return true;
    } else {
      const rs = await joinWithoutAnswer(page);
      if (!rs) return false;
      return true;
    }
  } catch (error) {
    logger(error);
    return false;
  }
};

  const joinGroupObj = ${strSetting};
  //Check obj start < end ? random(start,end) : random(end,start)
  let joinGroupObject = await checkObject(joinGroupObj);
  // check page is live return -1, return 1, return 0
  const isLive = checkIsLive(page);
  logger("Tình trạng trang web:" + isLive);
  if (!isLive) {
    return -1;
  }
  await returnHomePage(page);
  let numGroup = getRandomIntBetween(
    joinGroupObject.groupStart,
    joinGroupObject.groupEnd
  );
  let randomDelay = getRandomIntBetween(
    joinGroupObject.delayTimeStart * 1000,
    joinGroupObject.delayTimeEnd * 1000
  );

  const moreIcon = await getElement(
    page,
    "#screen-root > div > div:nth-child(1) > div:nth-child(3) > div > div > div:nth-child(3)",
    10
  );
  if (!moreIcon) return false;
  await clickElement(moreIcon);
  await delay(2000);
  const groupIconSelector =
    'img[src="https://static.xx.fbcdn.net/rsrc.php/v3/yn/r/lH756t0xaFS.png"]';
  const groupIcon = await getElement(page, groupIconSelector, 10);
  if (!groupIcon) return false;
  const groupId = await page.evaluate((el) => {
    return el.parentNode.parentNode.getAttribute("data-action-id");
  }, groupIcon);
  if (!groupId) return false;
  const groupElement = await getElement(
    page,
    'div[data-action-id="' + groupId + '"]',
    10
  );
  if (!groupElement) return false;
  await clickElement(groupElement);
  await delay(randomDelay);
  logger("Cần tham gia " + numGroup + " group");
  if (joinGroupObject.option == "suggestions") {
    let count = 0;
    // click discover group
  const discoverGroupBtn = await findBtn(page, '󱠀');
  if (!discoverGroupBtn) return false;
  await delay(1000);
  await clickElement(discoverGroupBtn);
    await delay(2000);
    // click see all group suggestions
    let seeAllSelector =
      "#screen-root > div > div:nth-child(2) > div:nth-child(6) > div:nth-child(1) > div:nth-child(3)";
    let seeAllBtn = await getElement(page, seeAllSelector, 10);
    if (!seeAllBtn) {
      seeAllSelector =
        "#screen-root > div > div:nth-child(2) > div:nth-child(5) > div:nth-child(1) > div:nth-child(3)";
      seeAllBtn = await getElement(page, seeAllSelector, 10);
      if (!seeAllBtn) return false;
    }
    await clickElement(seeAllBtn);
    await delay(randomDelay);
    for (let i = 0; i < numGroup * 2; i++) {
      try {
        const rs = await joinGroupByRequest(page, joinGroupObject);
        if (rs) {
          count++;
          logger("Đã tham gia " + count + " nhóm");
        } else {
          logger("Tham gia nhóm không thành công");
        }
        if (count == numGroup) break;
        await delay(3000);
      } catch (error) {
        logger(error);
      }
    }
  }

  if (joinGroupObject.option == "keywords") {
    let count = 0;
    // click search icon
    let searchIconSelector =
      "#screen-root > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(7) > div:nth-child(2) > div:nth-child(2)";
    let searchIcon = await getElement(page, searchIconSelector, 10);
    if (!searchIcon) {
      searchIconSelector =
        "#screen-root > div > div > div > div > div:nth-child(4) > div";
      searchIcon = await getElement(page, searchIconSelector, 10);
      if (!searchIcon) return false;
    }
    await clickElement(searchIcon);
    await delay(randomDelay);
    let randomText =
      joinGroupObject.text[getRandomInt(joinGroupObject.text.length)];
    await page.keyboard.type(randomText, { delay: 200 });
    await delay(2000);
    await page.keyboard.press("Enter");
    await delay(randomDelay);
    for (let i = 0; i < numGroup * 2; i++) {
      try {
        const rs = await joinGroupByKeyword(page, joinGroupObject);
        if (rs) {
          count++;
          logger("Đã tham gia " + count + " nhóm");
        } else {
          logger("Tham gia nhóm không thành công");
        }
        if (count == numGroup) break;
        await delay(3000);
      } catch (error) {
        logger(error);
      }
    }
  }

  if (joinGroupObject.option == "UID") {
    let count = 0;
    let UIDList = joinGroupObject.text;
    for (let i = 0; i < numGroup * 2; i++) {
      try {
      const url = await page.url();
    if (
      url === "https://m.facebook.com/groups/" ||
      url.includes("https://m.facebook.com/groups/")
    ) {
      logger("URL is correct");
    } else {
      await page.goto("https://m.facebook.com/groups/", {
        waitUntil: "networkidle2",
      });
      logger("Go to group");
    }
    if(UIDList.length == 0) break;
    let randomIndex = getRandomInt(UIDList.length);
    let UID = UIDList[randomIndex];
    await page.goto(
      'https://m.facebook.com/groups/' + UID
      ,
      {
        waitUntil: "networkidle2",
      }
    );
        const rs = await joinGroupByUID(page, joinGroupObject);
        if (rs) {
          count++;
          logger("Đã tham gia " + count + " nhóm");
        } else {
          logger("Tham gia nhóm không thành công");
        }
        if (count == numGroup) break;
        UIDList = UIDList.filter((e) => e !== UID);
        logger(UIDList);
        await delay(3000);
      } catch (error) {
        logger(error);
      }
    }
  }
  `;
};
