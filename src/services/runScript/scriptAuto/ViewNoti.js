export const viewNoti = (setting) => {
  const strSetting = `{
      notificationStart: ${setting.notificationStart},
      notificationEnd: ${setting.notificationEnd},
      delayTimeStart: ${setting.delayTimeStart},
      delayTimeEnd: ${setting.delayTimeEnd},
      option: ${JSON.stringify(setting.option)},
    }`;
  console.log(setting);
  return `
  const scrollSmoothIfNotExistOnScreens = async (JSSelector) => {
    try {
      const isExistElementOnScreen = await checkExistElementOnScreens(JSSelector);
      if (!isExistElementOnScreen) {
        await JSSelector.evaluate((el) => {
          el.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
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
  const checkUrlPage = async (page, urlText) => {
    try {
      const url = page.url();
      if (url.includes(urlText)) return true;
      return false;
    } catch (error) {
      logger(error.message);
      return false;
    }
  };
  const scroll = async page => {
    let randomScrollTime = getRandomIntBetween(2, 5);
    try {
      while (randomScrollTime > 0) {
        await page.evaluate(async () => {
          const getRandomIntBetween = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
          };
          const delay = async time => {
            return new Promise(resolve => setTimeout(resolve, time));
          };
          const smoothScrollByStep = (targetPosition, duration) => {
            const startPosition = window.scrollY;
            const distance = targetPosition - startPosition;
            let startTime = null;
  
            const animation = currentTime => {
              if (startTime === null) startTime = currentTime;
              const timeElapsed = currentTime - startTime;
              const run = ease(timeElapsed, startPosition, distance, duration);
              window.scrollTo(0, run);
              if (timeElapsed < duration) requestAnimationFrame(animation);
            };
  
            const ease = (t, b, c, d) => {
              t /= d / 2;
              if (t < 1) return (c / 2) * t * t + b;
              t--;
              return (-c / 2) * (t * (t - 2) - 1) + b;
            };
  
            requestAnimationFrame(animation);
          };
          let scrollAmount = getRandomIntBetween(150, 500);
          const targetPosition = window.scrollY + scrollAmount;
          let currentPosition = window.scrollY;
          if (currentPosition < targetPosition) {
            const durationPerStep = getRandomIntBetween(500, 2000);
            const nextPosition = Math.max(
              currentPosition + scrollAmount,
              targetPosition
            );
            smoothScrollByStep(nextPosition, durationPerStep);
            await delay(getRandomIntBetween(1000, 3000));
            if(Math.random() < 0.3){
              await delay(getRandomIntBetween(2000, 4000));
            }
            currentPosition = nextPosition;
          }
        });
        randomScrollTime--;
      }
      await delay(getRandomIntBetween(1000, 3000));
    } catch (error) {
      logger('Debug|ViewNotification|Error scroll video');
      return 0;
    }
  };
  const checkExistElementOnScreens = async (JSSelector) => {
    try {
      const isElementVisible = await JSSelector.evaluate((el) => {
        const { top, left, bottom, right } = el.getBoundingClientRect();
        return (
          top >= 0 &&
          left >= 0 &&
          bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          right <= (window.innerWidth || document.documentElement.clientWidth)
        );
      });
      return isElementVisible;
    } catch (error) {
      logger(error.message);
      return false;
    }
  };
  const navigateToUrl = async (page, link) => {
    try {
      const url = await page.url();
      if (!url.includes(link)) {
        await page.goto(link, {
          waitUntil: 'networkidle2',
        });
      } else {
        logger('cant navigate');
      }
    } catch (error) {
      logger('Debug|ViewNotification|' + error.message);
      return 0;
    }
  };

  const returnPages = async (page, browser, lengthPage) => {
    try {
      const pages = await browser.pages();
      const isHaveUrlGroup = await checkUrlPage(page, "m.facebook.com/groups");
      const isHaveUrlStory = await checkUrlPage(page, "m.facebook.com/story");
      const isHaveUrlPost = await checkUrlPage(page, "/posts");
      const isHaveUrlFriends = await checkUrlPage(page, "/friends");
      if (pages.length > lengthPage) {
        await pages[pages.length].close();
        await delay(getRandomIntBetween(3000, 5000));
      } else if (isHaveUrlFriends) {
        await clickElementRandom(
          page,
          'div[data-comp-id="6"]',
          0,
          "https://m.facebook.com/notifications/"
        );
        logger("return prev page");
        return true;
      } else if (isHaveUrlGroup || isHaveUrlStory || isHaveUrlPost) {
        const JSSelector = await page.$(
          "div.m > div.m > div.fl.ac > div.native-text > span.f3"
        );
        const isExist = await checkExistElementOnScreens(JSSelector);
        if (isExist) {
          await delay(getRandomIntBetween(3000, 5000));
          await JSSelector.evaluate(b => b.click());
        } else {
          await delay(getRandomIntBetween(3000, 5000));
          await navigateToUrl(page, "https://m.facebook.com/notifications/");
        }
        logger("return prev page");
        return true;
      } else {
        // const JSSelectors = await page.$$(
        //   "div.m > div.m > div.native-text > span.f2"
        // );
        const JSSelectors = await page.$$(
          "div.m > div.m > div.fl.ac > div.native-text > span.f3"
        );
        const isExist = await checkExistElementOnScreens(JSSelectors[0]); //0 or 2
        if (isExist) {
          await delay(getRandomIntBetween(3000, 5000));
          await JSSelectors[0].evaluate(b => b.click()); //0 or 2
        } else {
          await delay(getRandomIntBetween(3000, 5000));
          await navigateToUrl(page, "https://m.facebook.com/notifications/");
        }
        logger("return prev page");
        return true;
      }
    } catch (error) {
      logger(error.message);
      return false;
    }
  };

  const scrollSmoothIfElementNotExistOnScreens = async (page, element) => {
    try {
      await page.evaluate(async element => {
        const getRandomIntBetween = (min, max) => {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        const delay = async time => {
          return new Promise(resolve => setTimeout(resolve, time));
        };
        const smoothScrollByStep = (targetPosition, duration) => {
          const startPosition = window.scrollY;
          const distance = targetPosition - startPosition;
          let startTime = null;
  
          const ease = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return (c / 2) * t * t + b;
            t--;
            return (-c / 2) * (t * (t - 2) - 1) + b;
          };
  
          const animation = currentTime => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
          };
  
          requestAnimationFrame(animation);
        };
  
        const isInViewport = elem => {
          const bounding = elem.getBoundingClientRect();
          return (
            bounding.top >= 0 &&
            bounding.left >= 0 &&
            bounding.bottom <=
              (window.innerHeight || document.documentElement.clientHeight) &&
            bounding.right <=
              (window.innerWidth || document.documentElement.clientWidth)
          );
        };
  
        if (element && !isInViewport(element)) {
          const elementRect = element.getBoundingClientRect();
          const viewportHeight =
            window.innerHeight || document.documentElement.clientHeight;
          const targetPosition =
            window.scrollY +
            elementRect.top -
            (elementRect.top > viewportHeight ? viewportHeight : 0);
  
          let currentPosition = window.scrollY;
          while (
            Math.abs(currentPosition - targetPosition) > 0 &&
            !isInViewport(element)
          ) {
            const stepSize =
              getRandomIntBetween(50, 500) *
              (currentPosition > targetPosition ? -1 : 1);
            const durationPerStep = getRandomIntBetween(500, 2000);
            const nextPosition = currentPosition + stepSize;
  
            smoothScrollByStep(nextPosition, durationPerStep);
            await delay(getRandomIntBetween(1000, 3000));
            if(Math.random() < 0.3){
              await delay(getRandomIntBetween(3000, 4000));
            }
            currentPosition = window.scrollY;
          }
        }
      }, element);
      return true;
    } catch (error) {
      logger(error);
      return false;
    }
  };
  
  const goToNotificationDetail = async (page) => {
    try {
      //check page live
      const isLive = checkIsLive(page);
      if (isLive) {
        await delay(getRandomIntBetween(3000, 5000));
        const notiSelectors = await page.$$('div.m > div.m > div.m > img.rounded.gray-border');
        const notiSelectors1 = await page.$$('div.m > div.m > div.m > div.native-text > span.f2');
  
        if (notiSelectors.length > 0) {
          const index = getRandomInt(notiSelectors.length);
          await scrollSmoothIfElementNotExistOnScreens(notiSelectors[index]);
          await delay(getRandomIntBetween(1000, 3000));
          await notiSelectors[index].evaluate((b) => b.click());
          logger("Read notification");
          return true;
        } else if (notiSelectors1.length > 0) {
          const index = getRandomInt(notiSelectors1.length);
          await scrollSmoothIfElementNotExistOnScreens(notiSelectors1[index]);
          await delay(getRandomIntBetween(1000, 3000));
          await notiSelectors1[index].evaluate((b) => b.click());
          logger("Read notification");
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      logger(error.message);
      return false;
    }
  };
  const clickElementRandom = async (page, element, index, urlPage) => {
    try {
      //check page live
      const isLive = checkIsLive(page);
      if (isLive) {
        await delay(getRandomIntBetween(3000, 5000));
        const selectors = await page.$$(element);
  
        if (selectors.length > 0) {
          const x = index !== undefined ? index : getRandomInt(selectors.length);
          await scrollSmoothIfNotExistOnScreens(selectors[x]);
          await delay(getRandomIntBetween(3000, 5000));
          await selectors[x].evaluate((b) => b.click());
          await delay(getRandomIntBetween(3000, 5000));
        const isNotification = await checkUrlPage(page, "m.facebook.com/notifications");
        if (!isNotification) {
          await navigateToUrl(page, urlPage);
        }
        return true;
          return true;
        } else {
          await delay(getRandomIntBetween(3000, 5000));
          const isNavigate = await navigateToUrl(page, urlPage);
          if (isNavigate) return true;
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      logger(error.message);
      return false;
    }
  };
  const notiObj = ${strSetting}
  try {
    //check page live
    const isLive = checkIsLive(page);
    if (isLive) {
      await returnHomePage(page);
      await delay(getRandomIntBetween(3000, 5000));
      const isLogin = await checkLogin(page);
      if (isLogin) {
        let notiCount = 0;
        const numsNoti =
          notiObj.notificationStart < notiObj.notificationEnd
            ? getRandomIntBetween(
                notiObj.notificationStart,
                notiObj.notificationEnd
              )
            : getRandomIntBetween(
                notiObj.notificationEnd,
                notiObj.notificationStart
              );
        const isGoToNoti = await clickElementRandom(
          page,
          'div[data-comp-id="7"]',
          0,
          "https://m.facebook.com/notifications/"
        );
        while (notiCount < numsNoti) {
          // wait time before read noti
          const waitTime =
            notiObj.delayTimeStart < notiObj.delayTimeEnd
              ? getRandomIntBetween(
                  notiObj.delayTimeStart * 1000,
                  notiObj.delayTimeEnd * 1000
                )
              : getRandomIntBetween(
                  notiObj.delayTimeEnd * 1000,
                  notiObj.delayTimeStart * 1000
                );
          await delay(waitTime);
          await scroll(page);
          if (isGoToNoti) {
            const pages = await browser.pages();
            const lengthPage = pages.length;
            await delay(getRandomIntBetween(3000, 5000));
            await goToNotificationDetail(page);
            await delay(getRandomIntBetween(10000, 15000));
      
            await returnPages(page, browser, lengthPage);
            await delay(getRandomIntBetween(3000, 5000));
          }

          notiCount++;
        }
      } else {
        logger("Debug|ViewNotification|You need log in");
        return 0;
      }
    }
  } catch (error) {
    logger('Debug|ViewNotification|' + error.message);
    return 0;
  }
    `;
};
