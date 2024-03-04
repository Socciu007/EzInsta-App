export const boostView = (setting) => {
  const strSetting = `{
        viewTimeEnd: ${setting.viewTimeEnd},
        viewTimeStart: ${setting.viewTimeStart},
        videoID: ${JSON.stringify(setting.videoID)},
      }`;
  console.log(setting);
  return `
  const getPostID = async (page, browser, boostObj) => {
    try {
      for (let i = 0; i < boostObj.videoID.length; i++) {
        const url = 'https://mbasic.facebook.com/'+boostObj.videoID[i];
        await navigateToUrl(page, url);
        await delay(getRandomIntBetween(3000, 5000));
        await viewPost(page, browser, boostObj);
        await delay(getRandomIntBetween(3000, 5000));
      }
    } catch (error) {
      logger('Debug|BoostViewVideo|' + error.message);
      return;
    }
  };
  
  const viewPost = async (page, browser, boostObj) => {
    try {
      // Lưu lai index hien tai cua tab
      const pages = await browser.pages();
      const timeViewPost = getRandomIntBetween(
        boostObj.viewTimeStart * 1000,
        boostObj.viewTimeEnd * 1000
      );
      let hrefs = await page.$$eval("a", links => links.map(a => a.href));
      await delay(getRandomIntBetween(3000, 5000));
      const isPlay = await clickByHref(page, "/video_redirect", hrefs, 0);
      if (isPlay) {
        await delay(timeViewPost);
        await (await browser.pages())[pages.length].close();
        logger("Done view video");
      } else {
        await delay(timeViewPost);
        logger("Done view video");
      }
    } catch (error) {
      logger('Debug|BoostViewVideo|'+error.message);
      return;
    }
  };
  const checkExistElementOnScreens0 = async JSSelector => {
    try {
      const isElementVisible = await JSSelector.evaluate(el => {
        const { top, left, bottom, right } = el.getBoundingClientRect();
        return (
          top >= 0 &&
          left >= 0 &&
          bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
          right <= (window.innerWidth || document.documentElement.clientWidth)
        );
      });
      return isElementVisible;
    } catch (error) {
      return false;
    }
  };

  const scrollSmoothIfNotExistOnScreens = async JSSelector => {
    try {
      const isExistElementOnScreen = await checkExistElementOnScreens0(JSSelector);
      if (!isExistElementOnScreen) {
        await JSSelector.evaluate(el => {
          el.scrollIntoView({
            behavior: "smooth",
            inline: "nearest",
            block: "center",
          });
        });
        return true;
      }
      return true;
    } catch (error) {
      logger(error.message);
      return false;
    }
  };
  
  const clickByHref = async (page, namePage = "", href, indexHref) => {
    if (href.length > 0) {
      const hrefPage = href.filter(e => e.includes(namePage));
      if (hrefPage.length > 0) {
        const index =
          indexHref !== undefined ? indexHref : getRandomInt(hrefPage.length);
        const selector = 'a[href="'+hrefPage[index].replace('https://mbasic.facebook.com', '')+'"]';
        const videoEl = await page.$(selector);
        if (videoEl) {
          await scrollSmoothIfNotExistOnScreens(videoEl);
          await clickElement(videoEl);
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
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
      logger('Debug|BoostViewVideo|Error navigating to URL: ' + error.message);
      return;
    }
  };
  
    let boostObj = ${strSetting}
    try {
      const isLive = checkIsLive(page);
      if (isLive) {
        await returnHomePage(page);
        await delay(getRandomIntBetween(3000, 5000));
        // const login = await checkLogin(page, "https://m.facebook.com/");
        // if (login.isLogin) {
          boostObj = await checkObject(boostObj);
        if (boostObj.videoID.length > 0) {
          await getPostID(page, browser, boostObj);
        }
        // }
      }
    } catch (error) {
      logger('Debug|BoostViewVideo|' + error.message);
      return;
    }
      `;
};
