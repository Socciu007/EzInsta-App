export const cancelFriend = (setting) => {
  const strSetting = `
    {
      UID: ${JSON.stringify(setting.UID)},
      delayTimeEnd: ${setting.delayTimeEnd},
      delayTimeStart: ${setting.delayTimeStart},
      numberFriendStart: ${setting.numberFriendStart},
      numberFriendEnd: ${setting.numberFriendEnd},
      optionCancelFriend: ${JSON.stringify(setting.optionCancelFriend)},
      optionUnfriend:${JSON.stringify(setting.optionUnfriend)},
      requestsStart: ${setting.requestsStart},
      requestsEnd: ${setting.requestsEnd},
    }`;
  console.log(strSetting);
  return `
    const findBtn = async (page, content) => {
    try {
      let arr = [];
      const buttons = await getElements(page, '[class="native-text"]');
      for (let i = 0; i < buttons.length; i++) {
        const btn = await page.evaluate((el) => {
          return el.innerHTML;
        }, buttons[i]);
        if (btn.includes(content)) {
          arr.push( buttons[i]);
        }
      }
      return arr;
    } catch (err) {
      logger(err);
    }
  };
 const unfriendByUID = async (page, cancelObj) => {
  let randomDelay = getRandomIntBetween(
    cancelObj.delayTimeStart * 1000,
    cancelObj.delayTimeEnd * 1000
  );
  const isBtnAdd = await findBtn(page, "󱤇");
  if(isBtnAdd.length != 0) {
    return false;
  }
  const isAdded = await findBtn(page,"󱤈");
  if(isAdded.length != 0) {
    await clickElement(isAdded[0]);
    await delay(1000);
    const cancelFriend = await findBtn(page,"󱤉");
    if(cancelFriend.length != 0) {
      await clickElement(cancelFriend[0]);
      const confirmBtn = await getElement(page, "#screen-root > div.dialog-screen > div.dialog-vscroller > div > div > div > div > div:nth-child(4)");
      if(!confirmBtn) return false;
      await clickElement(confirmBtn) ;
      await delay(3000);
      return true;
    }
  } else {
    return false;
  }
};
  const unfriendByRandom = async (page, cancelObj) => {
    try {
      let randomDelay = getRandomIntBetween(cancelObj.delayTimeStart * 1000, cancelObj.delayTimeEnd * 1000);
      // click more
      const moreSelector = '#screen-root > div > div > div > div.m.bg-s3 > div > div > div > div > span';
      let moreBtns = await getElements(page, moreSelector, 10);
      if (!moreBtns || moreBtns.length < 1) {
        moreBtns = await findBtn(page, "󰟝");
        if(!moreBtns || moreBtns.length < 1){
          return false;
        }
      };

      // get more button on screen
      for (let i = 0; i < moreBtns.length; i++) {
        let randomIndex = getRandomInt(moreBtns.length);
        const moreId = await page.evaluate((el) => {
          return el.parentNode.parentNode.parentNode.parentNode.getAttribute('data-action-id');
        }, moreBtns[randomIndex]);
        const moreSelector = 'div[data-action-id="'+moreId+'"]';
        const moreBtn = await getElement(page, moreSelector, 10);
        if (!moreBtn) continue;
        await delay(1000);
        await scrollSmoothIfElementNotExistOnScreen(page, moreBtn);
        await delay(1000);
        await clickElement(moreBtn);
        await delay(1000);
        break;
      }
      // click unfriend
      const unfriendSelector =
        '#screen-root > div.dialog-screen > div > div > div > div > div > div.m.bg-s3 > div:nth-child(6)'
      let unfriendBtn = await getElement(page, unfriendSelector, 3);
      if (!unfriendBtn) {
        unfriendBtn = await findBtn(page, "󱤉");
        if(!unfriendBtn || unfriendBtn.length == 0) {
          return false
        } else {
          await delay(2000);
          await clickElement(unfriendBtn);
        }
      } else {
      await delay(2000);
      await clickElement(unfriendBtn);
       }
     
      await delay(randomDelay);
      const confirmBtn = await getElement(
        page,
        '#screen-root > div.dialog-screen > div.m > div > div > div.m > div > div:nth-child(4)',
        10,
      );
      if (!confirmBtn) {
        await page.goto('https://m.facebook.com/friends/?target_pivot_link=friends');
        return false;
      }
      await clickElement(confirmBtn);
      await delay(3000);
      return true;
    } catch (error) {
      logger(error);
      return false;
    }
  };
  const cancelFriendOnRequest = async (page, cancelObj, deleteBtns) => {
    try {
    let randomDelay = getRandomIntBetween(
      cancelObj.delayTimeStart * 1000,
      cancelObj.delayTimeEnd * 1000
    );

    let arr = [];
    let isCancel = false;
    for (let i = 0; i < deleteBtns.length; i++) {
      let randomIndex = getRandomInt(deleteBtns.length);
      let index = arr.indexOf(randomIndex);
      if (index == -1) {
        arr.push(randomIndex);
        logger("push");
      } else {
        continue;
      }
      const deleteId = await page.evaluate((el) => {
        return el.getAttribute("data-action-id");
      }, deleteBtns[randomIndex]);
      const deleteBtn = await getElement(
        page,
        'div[data-action-id="' + deleteId + '"]',
        10
      );
      if (!deleteBtn) continue;
      await scrollSmoothIfNotExistOnScreen(
        page,
        'div[data-action-id="' + deleteId + '"]'
      );
      await delay(randomDelay);
      await clickElement(deleteBtn);
      isCancel = true;
      await delay(2000);
      break;
    }

    return isCancel;
    } catch (error) {
      logger(error);
      return false;
    }
  };
  try {
    const cancelFriendObject = ${strSetting}
    //Check obj start < end ? random(start,end) : random(end,start)
    let cancelObj = await checkObject(cancelFriendObject);
    // check page is live reutrn -1, return 1, return 0
    const isLive = checkIsLive(page);
    logger('Tình trạng trang web:' + isLive);
    if (!isLive) {
      return -1;
    }
    await returnHomePage(page);
    let randomDelay = getRandomIntBetween(cancelObj.delayTimeStart * 1000, cancelObj.delayTimeEnd * 1000);
  
    if (cancelObj.optionCancelFriend == 'cancelRequest') {
      let numCancel = getRandomIntBetween(cancelObj.requestsStart, cancelObj.requestsEnd);
      logger("Cần hủy kết bạn với " + numCancel + " người");
      let attempt = true;
      const friendRequestSelector = '#screen-root > div > div:nth-child(1) > div:nth-child(4) > div:nth-child(2)';
      let friendRequestBtn = await getElement(page, friendRequestSelector, 3);
      if (!friendRequestBtn){
        friendRequestBtn = await findBtn(page, "󰤼");
        if(!friendRequestBtn || friendRequestBtn.length == 0){
          friendRequestBtn = await findBtn(page, "󰎍");
          if(!friendRequestBtn || friendRequestBtn.length == 0){
          await page.goto(
          "https://m.facebook.com/friends/?target_pivot_link=requests"
          );
          attempt = false;
          } else {
            await clickElement(friendRequestBtn[0]);
          }
        };
        await clickElement(friendRequestBtn[0]);
      } else {
        await clickElement(friendRequestBtn);
      };
      if(attempt != false) {
        await delay(3000);
           await page.goto(
        "https://m.facebook.com/friends/?target_pivot_link=requests"
      );
      } 
    await delay(randomDelay);
      let count = 0;
      const requestIconSelector =
      'img[src="https://static.xx.fbcdn.net/rsrc.php/v3/yi/r/9hZDJWHZ1Do.png"]';
      const requestIcon = await getElement(page, requestIconSelector, 10);
      if (requestIcon) return false;
      await delay(5000);
      let deleteSelector =
      "#screen-root > div > div:nth-child(2) > div > div:nth-child(6)";
      let deleteBtns = await getElements(page, deleteSelector, 10);
      if (!deleteBtns) return false;
      if (deleteBtns.length < numCancel) {
        numCancel = deleteBtns.length;
      }
      for (let i = 0; i < numCancel * 2; i++) {
        try {
          deleteBtns = await getElements(page, deleteSelector, 10);
          logger("có " + deleteBtns.length + " nút xóa")
          const rs = await cancelFriendOnRequest(page, cancelObj, deleteBtns);
          if (rs) {
            count++;
            logger('Đã hủy kết bạn với ' + count + ' người');
          } else {
            logger('Hủy kết bạn không thành công');
          }
          if (count == numCancel) {
            await delay(getRandomIntBetween(3000,5000));
            break;
          };
          await delay(randomDelay);
        } catch (error) {
          logger(error);
        }
      }
    }
    if (cancelObj.optionCancelFriend == 'unfriend') {
      const friendRequestSelector = '#screen-root > div > div:nth-child(1) > div:nth-child(4) > div:nth-child(2)';
      let friendRequestBtn = await getElement(page, friendRequestSelector, 3);
      if (!friendRequestBtn){
        friendRequestBtn = await findBtn(page, "󰤼");
        if(!friendRequestBtn || friendRequestBtn.length == 0){
          friendRequestBtn = await findBtn(page, "󰎍");
          if(!friendRequestBtn || friendRequestBtn.length == 0){
          await page.goto(
          "https://m.facebook.com/friends/"
          );
          } else {
            await clickElement(friendRequestBtn[0]);
          }
        };
        await clickElement(friendRequestBtn[0]);
      } else {
        await clickElement(friendRequestBtn);
      };
      let count = 0;
      await delay(randomDelay);
      if (cancelObj.optionUnfriend == 'random') {
      let numCancel = getRandomIntBetween(cancelObj.numberFriendStart, cancelObj.numberFriendEnd);
      logger('Cần hủy kết bạn với ' + numCancel + ' người');
        // click your friend
        const yourFriendSelector = '#screen-root > div > div:nth-child(2) > div:nth-child(4) > div > div:nth-child(2)';
        const yourFriendBtn = await getElement(page, yourFriendSelector, 10);
        if (!yourFriendBtn) return false;
        await clickElement(yourFriendBtn);
        await delay(3000);
        for (let i = 0; i < numCancel * 2; i++) {
          try {
            await delay(randomDelay);
            const rs = await unfriendByRandom(page, cancelObj);
            if (rs) {
              count++;
              logger('Đã hủy kết bạn với ' + count + ' người');
            } else {
              logger('Hủy kết bạn không thành công');
            }
            if (count == numCancel) {
              await delay(getRandomIntBetween(3000,5000));
              break;
            };
            await delay(5000);
          } catch (error) {
            logger(error);
          }
        }
      }
    if (cancelObj.optionUnfriend == "UID") {
      
    logger("Cần hủy kết bạn với " + cancelObj.UID.length + " người")
      for (let i = 0; i < cancelObj.UID.length; i++) {
        try {
          let UID = cancelObj.UID[i];
          await page.goto('https://m.facebook.com/profile.php/?id=' + UID, {
            waitUntil: "networkidle2",
          });
          await delay(randomDelay);
          const rs = await unfriendByUID(page, cancelObj);
          if (rs) {
            count++;
            logger("Đã hủy kết bạn với " + count + " người");
          } else {
            logger("Hủy kết bạn không thành công");
          }
          if (count == cancelObj.UID.length){
            await delay(getRandomIntBetween(3000,5000));
            break;
          };
          await delay(5000);
        } catch (error) {
          logger(error);
        }
      }
    }
    }
  } catch (err) {
    logger(err);
  }
  `;
};
