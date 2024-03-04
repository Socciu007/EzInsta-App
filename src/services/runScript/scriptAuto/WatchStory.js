export const watchStory = (setting) => {
  const strSetting = `
    {
      numsStoryStart: ${setting.numberStoryStart},
      numsStoryEnd: ${setting.numberStoryEnd},
      timeViewStoryStart: ${setting.delayTimeStart},
      timeViewStoryEnd: ${setting.delayTimeEnd},
      isReact: ${JSON.stringify(setting.isReact)},
      isComment:${JSON.stringify(setting.isComment)},
      isLike: false,
      isLove: false,
      isWow: false,
      isHaha: false,
      isCare: false,
      isSad: false,
      isAngry: false,
      text: ${JSON.stringify(setting.text)}
    }`;
  console.log(strSetting);
  return `
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
          await selectors[x].evaluate(b => b.click());
          return true;
        } else if (urlPage) {
          await delay(getRandomIntBetween(3000, 5000));
          const isNavigate = await navigateToUrl(page, urlPage);
          return isNavigate;
        }
        return false;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };
  
  const reactStory = async (page, element, type) => {
    try {
      await delay(getRandomIntBetween(3000, 5000));
      await clickElementRandom(page, element, type);
    } catch (error) {
      logger("No can react story");
    }
  };
  
  const commentStory = async (page, inputElement, sendElement) => {
    try {
      const isClickComment = await clickElementRandom(
        page,
        "div.m.hscroller.no-hscroller > div.m.nb > div.m.bg-s1 > div.m > div.native-text",
        0
      );
      if (isClickComment) {
        const indexText = getRandomInt(watchStoryObj.text.length);
        const inputClick = await page.$(inputElement);
        const inputClick1 = await page.$(
          "input.internal-input.input-box.native-input"
        );
        const isCheckInput = await checkExistElementOnScreens(inputClick);
        if (isCheckInput) {
          await inputClick.type(watchStoryObj.text[indexText], {
            delay: 200,
          });
          const clickCmt = await page.$(sendElement);
          if (clickCmt) {
            await clickElement(clickCmt);
            logger("Da comment");
          }
        } else {
          await inputClick1.type(watchStoryObj.text[indexText], {
            delay: 200,
          });
          const clickCmt = await page.$(sendElement);
          if (clickCmt) {
            await clickElement(clickCmt);
            logger("Da comment");
          }
        }
      } else {
        logger("Comment button is not exist");
      }
    } catch (error) {
      logger("No can comment story");
    }
  };
  
  const goToStory = async page => {
    try {
      //check page live
      const isLive = checkIsLive(page);
      if (isLive) {
        await delay(getRandomIntBetween(1000, 3000));
        const storySelectors = await page.$$(
          "div.m.hscroller.no-hscroller > div.m.bg-s3 > div.m > div.m.bg-s3"
        );
  
        if (storySelectors.length > 0) {
          const index = getRandomInt(storySelectors.length);
          await scrollSmoothIfNotExistOnScreens(storySelectors[index]);
          await delay(getRandomIntBetween(3000, 5000));
          await clickElement(storySelectors[index]);
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
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
      logger('Error navigating to URL');
    }
  };
  
  const checkExistElementOnScreens = async JSSelector => {
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
      const isExistElementOnScreen = await checkExistElementOnScreens(JSSelector);
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
  let watchStoryObj = ${strSetting};
  try {
    //check page live
    const isLive = checkIsLive(page);
    if (isLive) {
      await delay(getRandomIntBetween(3000, 5000));
      const isLogin = await checkLogin(page);
      if (isLogin) {
        watchStoryObj = await checkObject(watchStoryObj);
        let countStory = 0;
        const numsStory = getRandomIntBetween(
          watchStoryObj.numsStoryStart,
          watchStoryObj.numsStoryEnd
        );
        await delay(getRandomIntBetween(7000, 15000));
        await goToStory(page);
        while (countStory < numsStory) {
          const isPlayBtn = await checkExistElementOnScreens(
            "div.inline-video-icon.play"
          );
          if (isPlayBtn) {
            await clickElementRandom(page, "div.inline-video-icon.play", 0);
          }
          const timeViewStory = getRandomIntBetween(
            watchStoryObj.timeViewStoryStart * 1000,
            watchStoryObj.timeViewStoryEnd * 1000
          );
          await delay(timeViewStory);
          logger("Done view story");
          //click react random
          if (watchStoryObj.isReact && watchStoryObj.isComment) {
            await delay(getRandomIntBetween(1000, 3000));
            const isClickReact = await clickElementRandom(
              page,
              "div.m.hscroller.no-hscroller > div.m > img.img.contain"
            );
            if (isClickReact) {
              logger("Done react story");
            } else {
              logger("React button is not exist");
            }
            await delay(getRandomIntBetween(3000, 5000));
            await commentStory(
              page,
              "textarea.textbox.multi-line-floating-textbox",
              "button.textbox-submit-button"
            );
          } else if (watchStoryObj.isReact) {
            // "love", "like", "haha", "Care", "Wow", "Sad", "Angry"
            if (
              watchStoryObj.isLove &&
              !watchStoryObj.isLike &&
              !watchStoryObj.isHaha &&
              !watchStoryObj.isCare &&
              !watchStoryObj.isCare &&
              !watchStoryObj.isWow &&
              !watchStoryObj.isSad &&
              !watchStoryObj.isAngry
            ) {
              await reactStory(
                page,
                "div.m.hscroller.no-hscroller > div.m > img.img.contain",
                0
              );
            } else if (
              !watchStoryObj.isLove &&
              watchStoryObj.isLike &&
              !watchStoryObj.isHaha &&
              !watchStoryObj.isCare &&
              !watchStoryObj.isCare &&
              !watchStoryObj.isWow &&
              !watchStoryObj.isSad &&
              !watchStoryObj.isAngry
            ) {
              await reactStory(
                page,
                "div.m.hscroller.no-hscroller > div.m > img.img.contain",
                1
              );
            } else if (
              !watchStoryObj.isLove &&
              !watchStoryObj.isLike &&
              watchStoryObj.isHaha &&
              !watchStoryObj.isCare &&
              !watchStoryObj.isCare &&
              !watchStoryObj.isWow &&
              !watchStoryObj.isSad &&
              !watchStoryObj.isAngry
            ) {
              await reactStory(
                page,
                "div.m.hscroller.no-hscroller > div.m > img.img.contain",
                2
              );
            } else if (
              !watchStoryObj.isLove &&
              !watchStoryObj.isLike &&
              !watchStoryObj.isHaha &&
              watchStoryObj.isCare &&
              !watchStoryObj.isCare &&
              !watchStoryObj.isWow &&
              !watchStoryObj.isSad &&
              !watchStoryObj.isAngry
            ) {
              await reactStory(
                page,
                "div.m.hscroller.no-hscroller > div.m > img.img.contain",
                3
              );
            } else {
              await reactStory(
                page,
                "div.m.hscroller.no-hscroller > div.m > img.img.contain"
              );
            }
            logger("Done react story");
          } else if (watchStoryObj.isComment) {
            await commentStory(
              page,
              "textarea.textbox.multi-line-floating-textbox",
              "button.textbox-submit-button"
            );
          }

          if (countStory + 1 < numsStory) {
            const nextBtn = await findBtn(
              page,
              "󰙺",
              "div.fl.ac > div.native-text > span.f3"
            );
            if (nextBtn) {
              await clickElement(nextBtn);
              logger("Next story");
            }
          } else {
            //return home
            await delay(getRandomIntBetween(3000, 5000));
            await clickElementRandom(
              page,
              "div.m > div.m > div.native-text > span.f2",
              2,
              "https://m.facebook.com/"
            );
          }
          countStory++;
        }
        logger("Watch story complete");
      } else {
        logger("Debug|WatchStory|You need log in");
        return;
      }
    }
  } catch (error) {
    logger('Debug|WatchStory|' + error.message);
  }
  `;
};
