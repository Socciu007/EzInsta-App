export const boostLikeComment = (setting) => {
  const strSetting = `{
    viewTimeStart: ${setting.viewTimeStart},
    viewTimeEnd: ${setting.viewTimeEnd},
    delayTimeStart: ${setting.delayTimeStart},
    delayTimeEnd: ${setting.delayTimeEnd},
    isLike: ${setting.isLike},
    isShare: ${setting.isShare},
    postQuantityStart: ${setting.postQuantityStart},
    postQuantityEnd: ${setting.postQuantityEnd},
    postID: ${JSON.stringify(setting.postID)},
    isComment: ${setting.isComment},
    photoVideoQuantityStart: ${setting.photoVideoQuantityStart},
    photoVideoQuantityEnd: ${setting.photoVideoQuantityEnd},
    file: ${JSON.stringify(setting.file)},
    isTag: ${setting.isTag},
    tagFriendStart: ${setting.tagFriendStart},
    tagFriendEnd: ${setting.tagFriendEnd},
    textComment: ${JSON.stringify(setting.textComment)},
  }`;
  console.log('strSetting', strSetting);
  return `
  const getPostID = async (page, boostObj) => {
    try {
      const numsTag = getRandomIntBetween(
        boostObj.tagFriendStart,
        boostObj.tagFriendEnd
      );
      let numsPostPerID = getRandomIntBetween(
        boostObj.postQuantityStart,
        boostObj.postQuantityEnd
      );
      let arrPostID = boostObj.postID.sort(() => Math.random() - 0.5);
      numsPostPerID = arrPostID.length > numsPostPerID ? numsPostPerID : arrPostID.length;
      let arrID = [];
      for (let i = 0; i < numsPostPerID; i++) {
        const [id, fbid] = arrPostID[i].split("|");
        // const isDuplicate = await checkDuplicate(arrID, id, numsPostPerID);
        // if (!isDuplicate) {
          const urlPost = 'https://m.facebook.com/story.php/?id='+id+'&story_fbid='+fbid;
          await navigateToUrl(page, urlPost);
          await delay(getRandomIntBetween(3000, 5000));
          const notAvailableBtn = await findBtn(
            page,
            "Page Not Available",
            "h2.native-text > span.f2"
          );
          const notAvailableBtn1 = await findBtn(
            page,
            "Không thể hiển thị",
            "h2.native-text > span.f2"
          );
          if (notAvailableBtn || notAvailableBtn1) {
            arrID.push(id);
            continue;
          }
          await viewPost(page, boostObj, urlPost);
          await delay(getRandomIntBetween(3000, 5000));
          await likePost(page, boostObj);
          await delay(getRandomIntBetween(3000, 5000));
          await commentPost(page, boostObj, numsTag);
          await delay(getRandomIntBetween(3000, 5000));
          await sharePost(page, boostObj);
          await delay(getRandomIntBetween(3000, 5000));
        //   arrID.push(id);
        // } else {
        //   logger("Exceeds posts per uid, go to new uid");
        //   continue;
        // }
      }
    } catch (error) {
      logger("Debug|BoostLikeComment|No can access UID or Post UID of user");
      return;
    }
  };
  
  const viewPost = async (page, boostObj, urlPost) => {
    try {
      const timeViewPost = getRandomIntBetween(
        boostObj.viewTimeStart * 1000,
        boostObj.viewTimeEnd * 1000
      );
      const element = await checkExistElement(
        page,
        "div.m > div.m > div.m.dtf",
        3
      );
      if (element === 1) {
        const elementBtn = await page.$("div.m > div.m > div.m.dtf");
        await delay(getRandomIntBetween(3000, 5000));
        await clickElement(elementBtn);
        await delay(getRandomIntBetween(3000, 5000));
        await delay(timeViewPost);
        await navigateToUrl(page, urlPost);
        logger("Done view post");
      } else {
        await delay(timeViewPost);
        logger("Done view post");
      }
    } catch (error) {
      logger('Debug|BoostLikeComment|' + error.message);
      return;
    }
  };
  
  const likePost = async (page, boostObj) => {
    try {
      if (boostObj.isLike) {
        const likeBtn = await findBtn(
          page,
          "󰍸",
          "div.fl.ac.am > button.native-text > span"
        );
        if (likeBtn) {
          await scrollSmoothIfNotExistOnScreens0(likeBtn);
          await delay(3000);
          await clickElement(likeBtn);
          logger("Done like post");
        } else {
          logger("Liked post");
        }
      } else {
        logger("Liked enough posts");
      }
    } catch (error) {
      logger('Debug|BoostLikeComment|' + error.message);
      return;
    }
  };
  
  const commentPost = async (page, boostObj, numsTag) => {
    try {
      let countTag = 0;
      if (boostObj.isComment && boostObj.file.length > 0) {
        await uploadImg(page, boostObj);
      } else if (boostObj.isComment && boostObj.textComment.length > 0) {
        const element = await checkExistElement(
          page,
          "textarea.internal-input.input-box.native-input",
          3
        );
        if (element === 1) {
          while (countTag < numsTag) {
            const randomLetter = await getRandomLetter();
            const tag = '@'+randomLetter;
            await page.type(
              "textarea.internal-input.input-box.native-input",
              tag
            );
            await delay(getRandomIntBetween(3000, 5000));
            const listTag1 = await page.$$(
              "div.mentions-suggestion-row native-text"
            );
            const listTag = await page.$$('div[data-testid="tag_name"]');
            await delay(getRandomIntBetween(3000, 5000));
            if (listTag.length > 0) {
              const elementTag = await listTag[getRandomInt(listTag.length)];
              await scrollSmoothIfNotExistOnScreens0(elementTag);
              await delay(getRandomIntBetween(3000, 5000));
              await clickElement(elementTag);
              await delay(getRandomIntBetween(3000, 5000));
            } else if (listTag1.length) {
              const elementTag = await listTag1[getRandomInt(listTag1.length)];
              await scrollSmoothIfNotExistOnScreens0(elementTag);
              await delay(getRandomIntBetween(3000, 5000));
              await clickElement(elementTag);
              await delay(getRandomIntBetween(3000, 5000));
            }
            countTag++;
          }
          logger("Done tag friend");
          const commentBtn = await page.$(
            "textarea.internal-input.input-box.native-input"
          );
          await delay(getRandomIntBetween(3000, 5000));
          await commentBtn.type(
            boostObj.textComment[getRandomInt(boostObj.textComment.length)],
            { delay: 200 }
          );
          await delay(getRandomIntBetween(3000, 5000));
          const sendBtn = await findBtn(
            page,
            "󱛅",
            "div.fl.ac > div.native-text > span.f3"
          );
          if (sendBtn) {
            await clickElement(sendBtn);
            await delay(getRandomIntBetween(3000, 5000));
            logger("Done comment post");
          }
        }
      } else {
        logger("No comment content or enough comment");
      }
    } catch (error) {
      logger('Debug|BoostLikeComment|' + error.message);
      return;
    }
  };
  
  const sharePost = async (page, boostObj) => {
    try {
      if (boostObj.isShare) {
        //click share
        const shareBtn = await findBtn(
          page,
          "󰍺",
          '[class="native-text"]'
        );
        const shareBtn1 = await findBtn(
          page,
          "󰍺",
          '[class="native-text"]'
        );
        if (shareBtn) {
          await delay(getRandomIntBetween(3000, 5000));
          await scrollSmoothIfElementNotExistOnScreens(page, shareBtn);
          await delay(getRandomIntBetween(3000, 5000));
          await shareBtn.evaluate(b => b.click());
          //click type of share
          await delay(getRandomIntBetween(3000, 5000));
          const typeShareBtn = await findBtn(
            page,
            "󱤱",
            '[class="native-text"]'
          );
          await delay(getRandomIntBetween(3000, 5000));
          await clickElement(typeShareBtn);
          await delay(getRandomIntBetween(3000, 5000));
          //click share post
          const isCheckClick = await checkExistElement(
            page,
            "div.m > div.fl.ar.am > button.native-text.rtl > span.f2",
            3
          );
          await delay(getRandomIntBetween(3000, 5000));
          if (isCheckClick === 1) {
            const postBtn = await page.$(
              "div.m > div.fl.ar.am > button.native-text.rtl > span.f2"
            );
            await delay(getRandomIntBetween(3000, 5000));
            await clickElement(postBtn);
            await delay(getRandomIntBetween(3000, 5000));
            logger("Done share post");
          } else {
            const postBtn = await page.$(
              "div.fl.ac.am > button.native-text > span.f2"
            );
            await delay(getRandomIntBetween(3000, 5000));
            await clickElement(postBtn);
            await delay(getRandomIntBetween(3000, 5000));
            logger("Done share post");
          }
        } else if (shareBtn1) {
          await delay(getRandomIntBetween(3000, 5000));
          await scrollSmoothIfElementNotExistOnScreens(page, shareBtn1);
          await delay(getRandomIntBetween(3000, 5000));
          await shareBtn1.evaluate(b => b.click());
          //click type of share
          await delay(getRandomIntBetween(3000, 5000));
          const typeShareBtn = await findBtn(
            page,
            "󱤱",
            '[class="native-text"]'
          );
          await delay(getRandomIntBetween(3000, 5000));
          await clickElement(typeShareBtn);
          await delay(getRandomIntBetween(3000, 5000));
          //click share post
          const isCheckClick = await checkExistElement(
            page,
            "div.m > div.fl.ar.am > button.native-text.rtl > span.f2",
            3
          );
          await delay(getRandomIntBetween(3000, 5000));
          if (isCheckClick === 1) {
            const postBtn = await page.$(
              "div.m > div.fl.ar.am > button.native-text.rtl > span.f2"
            );
            await delay(getRandomIntBetween(3000, 5000));
            await clickElement(postBtn);
            await delay(getRandomIntBetween(3000, 5000));
            logger("Done share post");
          } else {
            const postBtn = await page.$(
              "div.fl.ac.am > button.native-text > span.f2"
            );
            await delay(getRandomIntBetween(3000, 5000));
            await clickElement(postBtn);
            await delay(getRandomIntBetween(3000, 5000));
            logger("Done share post");
          }
        } else {
          logger('Debug|BoostLikeComment|No have button share');
          return;
        }
      } else {
        logger("shared enough posts");
      }
    } catch (error) {
      logger('Debug|BoostLikeComment|' + error.message);
      return;
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
        const smoothScrollByStep = async (targetPosition, duration) => {
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
            bounding.top >= 50 &&
            bounding.left >= 0 &&
            bounding.bottom - bounding.top <=
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
              getRandomIntBetween(200, 700) *
              (currentPosition > targetPosition ? -1 : 1);
            const durationPerStep = getRandomIntBetween(500, 2000);
            const nextPosition = currentPosition + stepSize;
            await smoothScrollByStep(nextPosition, durationPerStep);
            await delay(getRandomIntBetween(1000, 2000));
            currentPosition = window.scrollY;
          }
  
          await delay(getRandomIntBetween(1000, 3000));
        }
      }, element);
      return true;
    } catch (error) {
      logger(error);
      return false;
    }
  };
  
  const findBtn = async (page, content, selector) => {
    try {
      const buttons = await page.$$(selector);
      for (let i = 0; i < buttons.length; i++) {
        const btn = await page.evaluate(el => {
          return el.innerHTML;
        }, buttons[i]);
        if (btn.includes(content)) {
          return buttons[i];
        }
      }
    } catch (err) {
      logger(error.message);
      return false;
    }
  };
  
  const uploadImg = async (page, boostObj) => {
    try {
      const numberPhoto =
        getRandomIntBetween(
          boostObj.photoVideoQuantityStart,
          boostObj.photoVideoQuantityEnd
        ) > boostObj.file.length
          ? boostObj.file.length
          : getRandomIntBetween(
              boostObj.photoVideoQuantityStart,
              boostObj.photoVideoQuantityEnd
            );
      if (numberPhoto > 0 && boostObj.file.length > 0) {
        const upload = await findBtn(
          page,
          "󰘋",
          "div.fl.ac > div.native-text > span.f3"
        );
        if (upload) {
          const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            await clickElement(upload),
          ]);
          await delay(3000);
          // Accept multiple files
          await fileChooser.accept([
            boostObj.file[getRandomInt(boostObj.file.length)],
          ]);
          await delay(getRandomIntBetween(3000, 5000));
          const element = await checkExistElement(
            page,
            "div.m > div.native-text",
            3
          );
          if (element === 1) {
            const uploadBtn = await page.$("div.m > div.native-text");
            await clickElement(uploadBtn);
            await delay(10000);
            logger("Done upload img");
          }
          //cmt text
          if (boostObj.textComment.length > 0) {
            const elementText = await checkExistElement(
              page,
              "textarea.textbox.multi-line-floating-textbox",
              3
            );
            if (elementText === 1) {
              const commentBtn = await page.$(
                "textarea.textbox.multi-line-floating-textbox"
              );
  
              await delay(getRandomIntBetween(3000, 5000));
              await commentBtn.type(
                boostObj.textComment[getRandomInt(boostObj.textComment.length)],
                { delay: 200 }
              );
              await delay(getRandomIntBetween(3000, 5000));
            }
          }
          //send commnent
          const elementSend = await checkExistElement(
            page,
            "button.textbox-submit-button",
            3
          );
          if (elementSend === 1) {
            const sendBtn = await page.$("button.textbox-submit-button");
            await clickElement(sendBtn);
            await delay(getRandomIntBetween(3000, 5000));
            logger("Done comment post");
          }
        } else {
          return false;
        }
      } else {
        logger("So anh random khong hop le");
        return false;
      }
      return true;
    } catch (error) {
      logger(error);
      return false;
    }
  };
  
  const checkExistElementOnScreens0 = async (JSSelector) => {
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

  const scrollSmoothIfNotExistOnScreens0 = async (JSSelector) => {
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
  
  const checkDuplicate = async (arrID, ID, numsPostPerID) => {
    // Đếm số lần xuất hiện của ID
    const idCount = {};
  
    for (let i = 0; i < arrID.length; i++) {
      const currentID = arrID[i];
      // Tang số lần xuất hiện
      idCount[currentID] = (idCount[currentID] || 0) + 1;
  
      // Neu vuot qua so bai post
      if (idCount[currentID] > numsPostPerID && currentID === ID) {
        return true;
      }
    }
  
    // Neu chua vuot qua
    return false;
  };
  
  const getRandomLetter = async () => {
    const alphabet = "abcdeghklmnopstuvy";
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    return alphabet[randomIndex];
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
      logger('Debug|BoostLikeComment|' + error.message);
      return;
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
          if (boostObj.postID.length > 0) {
            await getPostID(page, boostObj);
          }
        }
      }
    } catch (error) {
      logger('Debug|BoostLikeComment|' + error.message);
      return;
    }
      `;
};
