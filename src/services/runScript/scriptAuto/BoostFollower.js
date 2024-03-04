export const boostFollower = (setting) => {
  const strSetting = `{
        delayTimeStart: ${setting.delayTimeStart},
        delayTimeEnd: ${setting.delayTimeStart},
        selectTypeFollow: ${JSON.stringify(setting.selectTypeFollow)},
        UIDList: ${JSON.stringify(setting.UIDList)},
        isLike: ${setting.isLike},
        isFollow: ${setting.isFollow},
      }`;
  console.log(setting);
  return `  
  const getUID = async (page, boostObj) => {
    try {
      const delayTime = getRandomIntBetween(
        boostObj.delayTimeStart * 1000,
        boostObj.delayTimeEnd * 1000
      );
      for (let i = 0; i < boostObj.UIDList.length; i++) {
        const url = 'https://www.facebook.com/profile.php/?id='+boostObj.UIDList[i];
        await navigateToUrl(page, url);
        await delay(getRandomIntBetween(3000, 5000));
        if (boostObj.selectTypeFollow === "profile") {
          await followProfile(page);
        } else if (boostObj.selectTypeFollow === "fanpage") {
          if (boostObj.isLike) {
            await likeFanpage(page, boostObj);
            await delay(getRandomIntBetween(3000, 5000));
          } else if (boostObj.isFollow) {
            await followFanpage(page, boostObj);
            await delay(getRandomIntBetween(3000, 5000));
          }
        }
        await delay(delayTime);
      }
    } catch (error) {
      logger('Debug|BoostFollower|' + error.message);
    }
  };
  
  const followProfile = async page => {
    try {
      const followBtn = await findBtn(
        page,
        "󱤇",
        "div.fl.ac > div.native-text > span.f2"
      );
      const follow1Btn = await findBtn(
        page,
        "󱙶",
        "div.fl.ac > div.native-text > span.f2"
      );
      await delay(getRandomIntBetween(3000, 5000));
      if (followBtn) {
        await clickElement(followBtn);
        logger("Done follow profile");
      } else if (follow1Btn) {
        await clickElement(follow1Btn);
        logger("Done follow profile");
      } else {
        logger("Followed profile");
      }
      await delay(getRandomIntBetween(5000, 10000));
    } catch (error) {
      logger('Debug|BoostFollower|' + error.message);
    }
  };
  
  const likeFanpage = async (page, boostObj) => {
    try {
      if (boostObj.isLike) {
        const likeBtn = await findBtn(
          page,
          "󱘆",
          "div.fl.ac > div.native-text > span.f2"
        );
        await delay(getRandomIntBetween(3000, 5000));
        if (likeBtn) {
          await clickElement(likeBtn);
          await delay(getRandomIntBetween(3000, 5000));
          logger("Done like and follow page");
        } else {
          logger("Liked page");
        }
      }
    } catch (error) {
      logger('Debug|BoostFollower|' + error.message);
    }
  };
  
  const followFanpage = async (page, boostObj) => {
    try {
      let isFollow = false;
      if (boostObj.isFollow) {
        const dotsBtn = await findBtn(
          page,
          "󰟝",
          "div.fl.ac > div.native-text > span.f2"
        );
        if (dotsBtn) {
          await clickElement(dotsBtn);
          await delay(getRandomIntBetween(3000, 5000));
          const follow1Btn = await findBtn(
            page,
            "Theo dõi",
            "div.m > div.native-text"
          );
          const follow2Btn = await findBtn(
            page,
            "Follow",
            "div.m > div.native-text"
          );
          await delay(getRandomIntBetween(3000, 5000));
          if (follow1Btn) {
            await clickElement(follow1Btn);
            await delay(getRandomIntBetween(3000, 5000));
            logger("Done follow page");
            isFollow = true;
          } else if (follow2Btn) {
            await clickElement(follow2Btn);
            await delay(getRandomIntBetween(3000, 5000));
            isFollow = true;
            logger("Done follow page");
          } else {
            const closeSelect = await page.$(
              "div.m.dialog-vscroller > div.m.dtf"
            );
            logger("Followed page");
            await clickElement(closeSelect);
            await delay(getRandomIntBetween(3000, 5000));
          }
        } else {
          logger("No button to select follow");
        }
        await delay(getRandomIntBetween(3000, 5000));
      }
  
      if (boostObj.isLike && isFollow) {
        const dotsBtn = await findBtn(
          page,
          "󰟝",
          "div.fl.ac > div.native-text > span.f2"
        );
        if (dotsBtn) {
          await clickElement(dotsBtn);
          await delay(getRandomIntBetween(3000, 5000));
          const likeBtn = await findBtn(page, "󱘆", "div.fl.ac > div.native-text");
          if (likeBtn) {
            await clickElement(likeBtn);
            await delay(getRandomIntBetween(3000, 5000));
            logger("Done like page");
          } else {
            const closeSelect = await page.$(
              "div.m.dialog-vscroller > div.m.dtf"
            );
            logger("Liked page");
            await clickElement(closeSelect);
            await delay(getRandomIntBetween(3000, 5000));
          }
        } else {
          logger("No button to select like");
        }
      } else {
        logger("User is not select like or liked page");
      }
    } catch (error) {
      logger('Debug|BoostFollower|' + error.message);
    }
  };
  
  const navigateToUrl = async (page, link) => {
    try {
      const url = await page.url();
      if (!url.includes(link)) {
        await page.goto(link, {
          waitUntil: "networkidle2",
        });
      } else {
        logger("cant navigate");
      }
    } catch (error) {
      logger('Error navigating to URL:'+ error.message);
    }
  };
  
  const findBtn = async (page, content, selector) => {
    try {
      const buttons = await getElements(page, selector);
      for (let i = 0; i < buttons.length; i++) {
        const btn = await page.evaluate(el => {
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
    let boostObj = ${strSetting}
    try {
      const isLive = checkIsLive(page);
      if (isLive) {
        await returnHomePage(page);
        await delay(getRandomIntBetween(3000, 5000));
        const login = await checkLogin(page, "https://m.facebook.com/");
        if (login.isLogin) {
          boostObj = await checkObject(boostObj);
          await getUID(page, boostObj);
        }
      }
    } catch (error) {
      logger('Debug|BoostFollower|' + error.message);
    }
      `;
};
