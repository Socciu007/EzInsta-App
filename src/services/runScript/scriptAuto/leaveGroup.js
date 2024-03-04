export const leftGroup = (setting) => {
  const strSetting = `
      {
        groupEnd: ${setting.groupEnd},
        groupStart: ${setting.groupStart},
        delayTimeEnd: ${setting.delayTimeEnd},
        delayTimeStart: ${setting.delayTimeStart},
        member: ${setting.member},
        text:${JSON.stringify(setting.text)},
        option: ${JSON.stringify(setting.option)}
      }`;
  console.log(strSetting);
  return `
const leaveGroupByRandom = async (page, leaveGroupObject) => {
  try {
    let randomDelay = getRandomIntBetween(
      leaveGroupObject.delayTimeStart * 1000,
      leaveGroupObject.delayTimeEnd * 1000
    );
    const isJoin = await joinGroup(page);

    if (isJoin == true) {
      const rs = await clickLeave(page);
      if (rs) {
        return true;
      }
    }
    await delay(randomDelay);
    return false;
  } catch (error) {
    logger(error);
    return false;
  }
};
const leaveGroupByApprove = async (page, leaveGroupObject) => {
  try {
    let randomDelay = getRandomIntBetween(
      leaveGroupObject.delayTimeStart * 1000,
      leaveGroupObject.delayTimeEnd * 1000
    );
    const isJoin = await joinGroup(page);
    logger("Đã click vào nhóm");
    if (isJoin) {
      // check moderator in group
      let memberSelector =
        "#screen-root > div > div:nth-child(2) > div:nth-child(4) > div.m.bg-s3 > div:nth-child(1)";
      let member = await getElement(page, memberSelector);
      if (!member) {
        memberSelector =
          "#screen-root > div > div:nth-child(2) > div:nth-child(4) > div.m.bg-s4 > div:nth-child(1)";
        member = await getElement(page, memberSelector);
        if (!member) return false;
      }
      await delay(1000);
      await scrollSmoothIfNotExistOnScreen(page, memberSelector);
      await clickElement(member);
      await delay(2000);
      let moderatorSelector =
        "#screen-root > div > div:nth-child(2) > div:nth-child(6) > div > div > div:nth-child(3) > div";
      let moderator = await getElements(page, moderatorSelector, 10);
      if (moderator.length < 1) return false;
      // loop through member
      for (let i = 0; i < moderator.length; i++) {
        const moderatorIcon = await page.evaluate((el) => {
          return el.innerHTML.includes("󱥞");
        }, moderator[i]);
        if (moderatorIcon) {
          logger("Có kiểm duyệt viên");
          await delay(1000);
          await clickReturn(page);
          await delay(1000);
          const rs = await clickLeave(page);
          if (rs) {
            logger("Rời thành công");
            return true;
          } else {
            break;
          }
        }
      }
    }
    await delay(randomDelay);
    return false;
  } catch (error) {
    logger(error);
    return false;
  }
};
const leaveGroupByConditional = async (page, leaveGroupObject) => {
  try {
    let randomDelay = getRandomIntBetween(
      leaveGroupObject.delayTimeStart * 1000,
      leaveGroupObject.delayTimeEnd * 1000
    );
    const isJoin = await joinGroup(page);

    if (isJoin == true) {
      // check number of members
      let groupInforSelector =
        "#screen-root > div > div:nth-child(2) > div:nth-child(4) > div:nth-child(2)";
      let groupInfor = await getElement(page, groupInforSelector, 10);
      if (!groupInfor) return false;
      await delay(1000);
      await clickElement(groupInfor);
      await delay(1000);
      let numsMemberSelector =
        "#screen-root > div > div:nth-child(2) > div:nth-child(4) > div:nth-child(3) > div";
      let numsMember = await getElement(page, numsMemberSelector, 10);
      let nums = await page.evaluate((el) => {
        const numberText = el.innerHTML.replace(/[^0-9]/g, "");
        return parseInt(numberText);
      }, numsMember);
      await delay(1000);
      logger("Số thành viên của nhóm: " + nums);
      logger("....");
      if (nums > leaveGroupObject.member){
        logger("Số lượng thành viên không thỏa mãn điều kiện");
        return false;
      };
      let groupNameSelector =
        "#screen-root > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div > h3";
      let groupName = await getElement(page, groupNameSelector, 10);
      if (!groupName) {
        logger("không có group name");
        return false
      };
      let isContainKeyword = false;
      for( let i = 0 ; i < leaveGroupObject.text.length ; i++){
        let keyword = leaveGroupObject.text[i].toLowerCase();
        let name = await page.evaluate(
          (el, keyword) => {
            return el.innerHTML.toLowerCase().includes(keyword);
          },
          groupName,
          keyword
        );
        if (name) {
          isContainKeyword = true;
        };
      }
      if(!isContainKeyword) {
        logger("tên không chứa keyword");
       return false
      }
      await delay(1000);
      await clickReturn(page);
      await delay(3000);
      const rs = await clickLeave(page);
      await delay(1000)
      if (rs) {
        return true;
      }
    }
    await delay(randomDelay);
    return false;
  } catch (error) {
    logger(error);
    return false;
  }
};
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

const clickReturn = async (page) => {
  try {
    // return your group list
    let returnSelector =
      "#screen-root > div > div.m.fixed-container.top > div > div > div:nth-child(1) > div";
    let returnBtn = await getElement(page, returnSelector, 10);
    if (!returnBtn){
      logger("không có nút return");
      return fasle
    };
    await scrollSmoothIfNotExistOnScreen(page, returnSelector);
    await delay(1000);
    await clickElement(returnBtn);
    await delay(1000);
    return true;
  } catch (error) {
    logger(error);
    return false;
  }
};
// click group and go to group page
const joinGroup = async (page) => {
  try {
    // scroll before click
    let temp = getRandomIntBetween(2, 4);
    logger("số lần scroll " + temp);
    await scrollSmooth(page,temp)
    let nameSelector =
      "#screen-root > div > div:nth-child(2) > div > div> div:nth-child(2) > div.native-text";
   
    let nameGroup = await getElements(page, nameSelector, 10);
    if (!nameGroup) return false;
    let isJoin = false;
    let arr = [];
    let newIndex = -1;
    for (let i = 1; i < nameGroup.length; i++) {
      if (newIndex > i) continue;
      nameGroup = await getElements(page, nameSelector, 10);
      const groupId = await page.evaluate((el) => {
        return el.parentNode.parentNode.getAttribute("data-action-id");
      }, nameGroup[i]);
      if (!groupId) continue;
      // click group on the screen
      const groupSelector = 'div[data-action-id="' +  groupId + '"]';
      const isOnScreen = await checkExistElementOnScreen(page, groupSelector);
      if (isOnScreen == 0) {
        if (arr.length == 3) {
          newIndex = i;
          break;
        }
        const groupBtn = await getElement(page, groupSelector, 10);
        if (!groupBtn) continue;
        arr.push(groupBtn);
        logger("push to array");
      }
    }
    if (arr.length == 0) return false;
    let randomIndex = getRandomInt(arr.length);
    await delay(1000);
    await clickElement(arr[randomIndex]);
    isJoin = true;
    await delay(2000);
    return isJoin;
  } catch (error) {
    logger(error);
    return false;
  }
};
const clickLeave = async (page) => {
  try {
    const moreIcon = await getElement(
      page,
      "#screen-root > div > div.m.fixed-container.top > div > div > div:nth-child(3) > div",
      10
    );
    if (!moreIcon) {
      await clickReturn(page);
      // tiếp tục lướt tìm lại hay tính là 1 lượt leave k thành công ?
      return false;
    }
    await clickElement(moreIcon);
    await delay(2000);
    const dialogSelector =
      "#screen-root > div.m.bg-s1.dialog-screen > div.m.fixed-container.bottom > div > div > div > div > div > div";
    const dialog = await getElement(page, dialogSelector, 10);
    if (!dialog) {
      await clickReturn(page);
      return false;
    }
    await delay(2000);

    const leaveBtn = await getElement(
      page,
      "#screen-root > div > div > div > div > div > div > div > div > div:nth-child(9)",
      10
    );
    if (!leaveBtn) return false;
    await delay(1000);
    await clickElement(leaveBtn);
    const confirmSelector =
      " #screen-root > div.m.bg-s1.dialog-screen > div.m.dialog-vscroller > div > div > div > div > div:nth-child(4)";
    const confirmBtn = await getElement(page, confirmSelector, 10);
    if (!confirmBtn) return false;
    await clickElement(confirmBtn);
    await delay(5000);
    await delay(2000);
    return true;
  } catch (error) {
    logger(error);
    return false;
  }
};
const GotoGroup = async (page) => {
  const url = await page.url();
  if (
    url === "https://m.facebook.com/groups_browse/your_groups/" ||
    url.includes("https://m.facebook.com/groups_browse/your_groups/")
  ) {
    logger("URL is correct");
  } else {
    await page.goto("https://m.facebook.com/groups_browse/your_groups/", {
      waitUntil: "networkidle2",
    });
    logger("Go to group");
  }
};
const leaveGroupObj = ${strSetting};

  //Check obj start < end ? random(start,end) : random(end,start)
  let leaveGroupObject = await checkObject(leaveGroupObj);
  // check page is live return -1, return 1, return 0
  const isLive = checkIsLive(page);
  logger("Tình trạng trang web: " + isLive);
  if (!isLive) {
    return -1;
  }
  await returnHomePage(page);
  let numGroup = getRandomIntBetween(
    leaveGroupObject.groupStart,
    leaveGroupObject.groupEnd
  );
  let randomDelay = getRandomIntBetween(
    leaveGroupObject.delayTimeStart * 1000,
    leaveGroupObject.delayTimeEnd * 1000
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
  logger(groupId);
  const groupElement = await getElement(
    page,
    'div[data-action-id="' +  groupId + '"]',
    10
  );
  if (!groupElement) return false;
  await clickElement(groupElement);
  await delay(randomDelay);
  // click your group
  const yourGroupBtn = await findBtn(page, '󱟶');
  if (!yourGroupBtn) return false;
  await delay(1000);
  await clickElement(yourGroupBtn);
  await delay(randomDelay);
  logger("Cần rời " + numGroup + " group");
  if (leaveGroupObject.option == "random") {
    let count = 0;
    for (let i = 0; i < numGroup * 2; i++) {
      try {
        await GotoGroup(page);
        const rs = await leaveGroupByRandom(page, leaveGroupObject);
        if (rs) {
          count++;
          logger("Đã rời " + count + " nhóm");
        } else {
          logger("Rời nhóm không thành công");
        }
        if (count == numGroup) break;
        await delay(3000);
      } catch (error) {
        logger(error);
      }
    }
  }
  if (leaveGroupObject.option == "approve") {
    let count = 0;
    for (let i = 0; i < numGroup * 2; i++) {
      try {
        await GotoGroup(page);
        const rs = await leaveGroupByApprove(page, leaveGroupObject);
        if (rs) {
          count++;
          logger("Đã rời " + count + " nhóm");
        } else {
          logger("Rời nhóm không thành công");
        }
        if (count == numGroup) break;
        await delay(3000);
      } catch (error) {
        logger(error);
      }
    }
  }
  if (leaveGroupObject.option == "conditional") {
    let count = 0;
    for (let i = 0; i < numGroup * 2; i++) {
      try {
        await GotoGroup(page);
        const rs = await leaveGroupByConditional(page, leaveGroupObject);
        if (rs) {
          count++;
          logger("Đã rời " + count + " nhóm");
        } else {
          logger("Rời nhóm không thành công");
        }
        if (count == numGroup) break;
        await delay(3000);
      } catch (error) {
        logger(error);
      }
    }
  }
  `;
};
