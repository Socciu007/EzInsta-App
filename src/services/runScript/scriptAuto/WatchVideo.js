export const watchVideo = (setting) => {
  const strSetting = `
      {
        videoStart: ${setting.videoStart},
        videoEnd: ${setting.videoEnd},
        delayTimeStart: ${setting.delayTimeStart},
        delayTimeEnd: ${setting.delayTimeEnd},
        isLike: ${setting.isLiked},
        likeStart: ${setting.likeStart},
        likeEnd: ${setting.likeEnd},
        isShare: ${setting.isShare},
        shareStart: ${setting.shareStart},
        shareEnd: ${setting.shareEnd},
        isComment: ${setting.isComment},
        option: ${JSON.stringify(setting.option)},
        text:${JSON.stringify(setting.text)},
        photos:${JSON.stringify(setting.photos)},
        photoStart: ${setting.photoStart},
        photoEnd: ${setting.photoEnd},
        commentStart: ${setting.commentStart},
        commentEnd: ${setting.commentEnd},
       
      }`;
  console.log(strSetting);
  return `
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
  
  const uploadImg = async (page, watchVideoObj) => {
    try {
      let isHaveComment = false;
      if (watchVideoObj.photos.length > 0) {
        const upload = await findBtn(page, "󰘋", '[class="f3"]');
        logger("uploade", upload);
        if (upload) {
          const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            await clickElement(upload),
          ]);
          await delay(3000);
          // Accept multiple files
          await fileChooser.accept([
            watchVideoObj.photos[getRandomInt(watchVideoObj.photos.length)],
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
            await delay(6000);
            logger("Done upload img");
            isHaveComment = true;
          }
        }
      }
  
      //cmt text
      if (
        watchVideoObj.text.length > 0 &&
        watchVideoObj.option !== "photoOrVideo"
      ) {
        const elementInput = await checkExistElement(
          page,
          "textarea.textbox.multi-line-floating-textbox",
          3
        );
        if (elementInput == 1) {
          const commentBtn = await page.$(
            "textarea.textbox.multi-line-floating-textbox"
          );
          await delay(getRandomIntBetween(3000, 5000));
          await commentBtn.type(
            watchVideoObj.text[getRandomInt(watchVideoObj.text.length)],
            { delay: 200 }
          );
          await delay(getRandomIntBetween(3000, 5000));
          isHaveComment = true;
        } else {
          const commentBtn1 = await page.$(
            "textarea.internal-input.input-box.native-input"
          );
          await delay(getRandomIntBetween(3000, 5000));
          await commentBtn1.type(
            watchVideoObj.text[getRandomInt(watchVideoObj.text.length)],
            { delay: 200 }
          );
          await delay(getRandomIntBetween(3000, 5000));
          isHaveComment = true;
        }
      }
      //send commnent
      if (isHaveComment) {
        const elementSend = await checkExistElement(
          page,
          "button.textbox-submit-button",
          3
        );
        const sendBtn1 = await findBtn(
          page,
          "󱛅",
          "div.m > div.fl.ac > div.native-text > span.f3"
        );
  
        if (elementSend === 1) {
          const sendBtn = await page.$("button.textbox-submit-button");
          await delay(getRandomIntBetween(3000, 5000));
          await clickElement(sendBtn);
          await delay(getRandomIntBetween(3000, 5000));
        } else if (sendBtn1) {
          await delay(getRandomIntBetween(3000, 5000));
          await clickElement(sendBtn1);
        }
      }
      return true;
    } catch (error) {
      logger(error);
      return false;
    }
  };
  
  const clickElementRandom = async (page, element, index, urlPage) => {
    try {
      const selectors = await page.$$(element);
      if (selectors.length > 0) {
        const x = index !== undefined ? index : getRandomInt(selectors.length);
        await scrollSmoothIfNotExistOnScreens(selectors[x]);
        await delay(getRandomIntBetween(1000, 3000));
        await clickElement(selectors[x]);
        await delay(getRandomIntBetween(1000, 3000));
        const isWatchVideo = await checkUrlPage(page, "m.facebook.com/watch");
        if (!isWatchVideo) {
          await navigateToUrl(page, urlPage);
        }
        return true;
      } else {
        await delay(getRandomIntBetween(1000, 3000));
        const isNavigate = await navigateToUrl(page, urlPage);
        if (isNavigate) return true;
        return false;
      }
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
          waitUntil: "networkidle2",
        });
        return true;
      } else {
        logger("cant navigate");
        return false;
      }
    } catch (error) {
      logger("Err navigate:" + error.message);
      return false;
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
  
  const goToVideo = async (page, elVideo) => {
    try {
      await scrollSmoothIfElementNotExistOnScreens(page, elVideo);
      await delay(getRandomIntBetween(1000, 3000));
      await clickElement(elVideo);
      await delay(getRandomIntBetween(1000, 3000));
      const isWatchPage = await checkUrlPage(page, "facebook.com/watch/");
      if (isWatchPage) {
        await clickElement(elVideo);
        logger("Click to video");
      }
    } catch (error) {
      logger("Debug|WatchVideo|No access to video");
      return;
    }
  };
  
  const scroll = async page => {
    let randomScrollTime = getRandomIntBetween(5, 10);
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
            if (Math.random() < 0.3) {
              await delay(getRandomIntBetween(2000, 4000));
            }
            currentPosition = nextPosition;
          }
        });
        randomScrollTime--;
      }
      await delay(getRandomIntBetween(1000, 5000));
    } catch (error) {
      logger("Debug|WatchVideo|Error scroll video");
    }
  };
  
  const checkUrlPage = async (page, urlText) => {
    try {
      await delay(getRandomIntBetween(3000, 5000));
      const url = page.url();
      if (url.includes(urlText)) return true;
      return false;
    } catch (error) {
      logger(error.message);
      return false;
    }
  };
  
  const scrollSmoothIfNotExistOnScreens = async JSSelector => {
    try {
      const isExistElementOnScreen = await checkExistElementOnScreens0(
        JSSelector
      );
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
            bounding.top >= 80 &&
            bounding.left >= 0 &&
            bounding.bottom - bounding.top - 200 <=
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
              getRandomIntBetween(150, 500) *
              (currentPosition > targetPosition ? -1 : 1);
            const durationPerStep = getRandomIntBetween(500, 2000);
            const nextPosition = currentPosition + stepSize;
            await smoothScrollByStep(nextPosition, durationPerStep);
            await delay(getRandomIntBetween(1000, 3000));
            if (Math.random() < 0.3) {
              await delay(getRandomIntBetween(2000, 4000));
            }
            currentPosition = window.scrollY;
          }
          await delay(getRandomIntBetween(2000, 3000));
        }
      }, element);
      return true;
    } catch (error) {
      logger(error);
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
  
  let watchVideoObj = ${strSetting}
  try {
    //check page live
    const isLive = checkIsLive(page);
    if (isLive) {
      await returnHomePage(page);
      await delay(getRandomIntBetween(1000, 3000));
  
      watchVideoObj = await checkObject(watchVideoObj);
      let countVideo = 0;
      let countLike = 0;
      let countShare = 0;
      let countComment = 0;
      let arrLike = [];
      let arrComment = [];
      let arrShare = [];
  
      const numsVideo = getRandomIntBetween(
        watchVideoObj.videoStart,
        watchVideoObj.videoEnd
      );
      let numsLike = getRandomIntBetween(
        watchVideoObj.likeStart,
        watchVideoObj.likeEnd
      );
      let numsShare = getRandomIntBetween(
        watchVideoObj.shareStart,
        watchVideoObj.shareEnd
      );
      let numsComment = getRandomIntBetween(
        watchVideoObj.commentStart,
        watchVideoObj.commentEnd
      );
  
      if (numsLike <= numsVideo) {
        while (numsLike > 0) {
          const index = getRandomIntBetween(0, numsVideo);
          if (arrLike.includes(index)) {
            continue;
          }
          arrLike.push(index);
          numsLike--;
        }
      } else {
        for (let i = 0; i < numsVideo; i++) {
          arrLike.push(i);
        }
      }
      logger("cần like " + arrLike.length + " Video");
      if (numsShare <= numsVideo) {
        while (numsShare > 0) {
          const index = getRandomIntBetween(0, numsVideo);
          if (arrShare.includes(index)) {
            continue;
          }
          arrShare.push(index);
          numsShare--;
        }
      } else {
        for (let i = 0; i < numsVideo; i++) {
          arrShare.push(i);
        }
      }
      logger("cần share " + arrShare.length + " Video");
      if (numsComment <= numsVideo) {
        while (numsComment > 0) {
          const index = getRandomIntBetween(0, numsVideo);
          if (arrComment.includes(index)) {
            continue;
          }
          arrComment.push(index);
          numsComment--;
        }
      } else {
        for (let i = 0; i < numsVideo; i++) {
          arrComment.push(i);
        }
      }
  
      logger("cần comment " + arrComment.length + " Video");
  
      //navigate video page
      await delay(getRandomIntBetween(1000, 3000));
      const videoIcon = await findBtn(
        page,
        "󰤹",
        '[class="f3"]'
      ); 
      if(videoIcon) {
        await clickElement(videoIcon);
      } else {
        await clickElementRandom(
          page,
          'div[data-comp-id="7"]',
          0,
          "https://m.facebook.com/watch/"
        );
      }
      await delay(getRandomIntBetween(3000, 5000));
      const languageBtn = await findBtn(
        page,
        "English (US)",
        '[class="native-text"]'
      );
      const languageBtn1 = await findBtn(page, "󰠂", '[class="native-text"]');
  
      if (languageBtn) {
        await clickElement(languageBtn);
      } else if (languageBtn1) {
        await clickElement(languageBtn1);
      }
      await delay(getRandomIntBetween(1000, 3000));
      const cfLanguageEle = await findBtn(
        page,
        "Confirm languages",
        "div.m > div.fl.ac > div.native-text > span.f2"
      );
      const cfLanguageEle1 = await page.$('[aria-label="Confirm languages"]');
      const cfLanguageEle0 = await findBtn(
        page,
        "Xác nhận ngôn ngữ",
        "div.m > div.fl.ac > div.native-text > span.f2"
      );
      const cfLanguageEle2 = await page.$('[aria-label="Xác nhận ngôn ngữ"]');
      if (cfLanguageEle) {
        await clickElement(cfLanguageEle);
      } else if (cfLanguageEle0) {
        await clickElement(cfLanguageEle0);
      } else if (cfLanguageEle1) {
        await clickElement(cfLanguageEle1);
      } else if (cfLanguageEle2) {
        await clickElement(cfLanguageEle2);
      } else if (languageBtn || languageBtn1) {
        await clickElementRandom(
          page,
          "div.m > div.fl.ac > div.native-text > span.f2",
          -1,
          "https://m.facebook.com/watch/"
        );
      }
      await delay(getRandomIntBetween(1000, 3000));
      await scroll(page);
      let arrIndexVideo = [];
      let playVideoElement = await page.$$("div.inline-video-container");
      let indexVideo = 4;
      for (let i = 0; i < numsVideo; i++) {
        await scroll(page);
        playVideoElement = await page.$$("div.inline-video-container");
        const index = getRandomIntBetween(
          indexVideo + 1 < playVideoElement.length
            ? indexVideo + 1
            : playVideoElement.length,
          playVideoElement.length > indexVideo + 5
            ? indexVideo + 5
            : playVideoElement.length
        );
        if (index == indexVideo) {
          indexVideo = 0;
          i--;
          continue;
        }
        indexVideo = index;
        await goToVideo(page, playVideoElement[index]);
        const timeViewVideo = getRandomIntBetween(
          watchVideoObj.delayTimeStart * 1000,
          watchVideoObj.delayTimeEnd * 1000
        );
        await delay(timeViewVideo);
        logger("Done view video");
        if (watchVideoObj.isLike && arrLike.includes(i)) {
          try {
            await delay(getRandomIntBetween(3000, 5000));
            let likeBtn = await findBtn(page, "󰍸", '[class="native-text"]');
            if (!likeBtn) {
              likeBtn = await findBtn(page, "󱍸", '[class="native-text"]');
            }
            if (likeBtn) {
              await scrollSmoothIfNotExistOnScreens(likeBtn);
              await delay(getRandomIntBetween(3000, 5000));
              await clickElement(likeBtn);
              countLike++;
              logger("Đã Like " + countLike + " video ");
            } else {
              logger("No can find like button");
            }
          } catch (err) {
            logger("No can find like button");
          }
        }
  
        if (watchVideoObj.isComment && arrComment.includes(i)) {
          try {
            if (
              watchVideoObj.option == "all" ||
              watchVideoObj.option == "photoOrVideo"
            ) {
              const button = await findBtn(page, "󰍹", '[style="color:#ffffff;"]');
              await scrollSmoothIfNotExistOnScreens(button);
              await delay(getRandomIntBetween(3000, 5000));
              if (button) {
                await clickElement(button);
                await delay(3000);
                await uploadImg(page, watchVideoObj);
                //return page
                await delay(getRandomIntBetween(3000, 5000));
                const returnBtn = await findBtn(
                  page,
                  "󰟙",
                  "div.m > div.fl.ac > div.native-text > span.f3"
                );
                await delay(getRandomIntBetween(3000, 5000));
                if (returnBtn) {
                  await clickElement(returnBtn);
                  countComment++;
                  logger("Đã comment " + countComment + " video");
                } else {
                  i--;
                  const returnIcon = await findBtn(
                    page,
                    "󱜳",
                    '[class="f3"]'
                  ); 
                  if(returnIcon) {
                    await scrollSmoothIfNotExistOnScreens(returnIcon);
          await delay(getRandomIntBetween(3000, 5000));
          await clickElement(returnIcon);
                  } else {
                    await clickElementRandom(
                      page,
                      "div.m > div.fl.ac > div.native-text > span.f3",
                      0,
                      "https://m.facebook.com/watch/"
                    );
                  }
                  await delay(getRandomIntBetween(1000, 3000));
                  continue;
                }
              } else {
                i--;
                const returnIcon = await findBtn(
                  page,
                  "󱜳",
                  '[class="f3"]'
                ); 
                if(returnIcon) {
                  await delay(getRandomIntBetween(3000, 5000));
                  await scrollSmoothIfNotExistOnScreens(returnIcon);
          await delay(getRandomIntBetween(3000, 5000));
          await clickElement(returnIcon);
                } else {
                  await delay(getRandomIntBetween(3000, 5000));
                  await clickElementRandom(
                    page,
                    "div.m > div.fl.ac > div.native-text > span.f3",
                    0,
                    "https://m.facebook.com/watch/"
                  );
                }
                await delay(getRandomIntBetween(1000, 3000));
                continue;
              }
            } else if (watchVideoObj.option == "text") {
              if (watchVideoObj.text.length > 0) {
                const button = await findBtn(
                  page,
                  "󰍹",
                  '[style="color:#ffffff;"]'
                );
                if (button) {
                  await scrollSmoothIfNotExistOnScreens(button);
                  await delay(getRandomIntBetween(3000, 5000));
                  await clickElement(button);
                  await delay(getRandomIntBetween(3000, 5000));
                  await page.type(
                    "div.m.mentions-text > textarea.internal-input.input-box.native-input",
                    watchVideoObj.text[getRandomInt(watchVideoObj.text.length)],
                    { delay: 200 }
                  );
                  await delay(getRandomIntBetween(3000, 5000));
                  const sendBtn = await findBtn(
                    page,
                    "󱛅",
                    "div.m > div.fl.ac > div.native-text > span.f3"
                  );
                  await delay(getRandomIntBetween(3000, 5000));
                  await clickElement(sendBtn);
                  //return page
                  await delay(getRandomIntBetween(3000, 5000));
                  const returnBtn = await findBtn(
                    page,
                    "󰟙",
                    "div.m > div.fl.ac > div.native-text > span.f3"
                  );
                  if (returnBtn) {
                    await delay(getRandomIntBetween(3000, 5000));
                    await clickElement(returnBtn);
                    countComment++;
                    logger("Đã Comment " + countComment + " video ");
                  } else {
                    i--;
                    const returnIcon = await findBtn(
                      page,
                      "󱜳",
                      '[class="f3"]'
                    ); 
                    if(returnIcon) {
                      await delay(getRandomIntBetween(3000, 5000));
                      await scrollSmoothIfNotExistOnScreens(returnIcon);
          await delay(getRandomIntBetween(3000, 5000));
          await clickElement(returnIcon);
                    } else {
                      await delay(getRandomIntBetween(3000, 5000));
                      await clickElementRandom(
                        page,
                        "div.m > div.fl.ac > div.native-text > span.f3",
                        0,
                        "https://m.facebook.com/watch/"
                      );
                    }
                    await delay(getRandomIntBetween(3000, 5000));
                    continue;
                  }
                } else {
                  i--;
                  const returnIcon = await findBtn(
                    page,
                    "󱜳",
                    '[class="f3"]'
                  ); 
                  if(returnIcon) {
                    await delay(getRandomIntBetween(3000, 5000));
                    await scrollSmoothIfNotExistOnScreens(returnIcon);
                    await delay(getRandomIntBetween(3000, 5000));
                    await clickElement(returnIcon);
                  } else {
                    await delay(getRandomIntBetween(3000, 5000));
                    await clickElementRandom(
                      page,
                      "div.m > div.fl.ac > div.native-text > span.f3",
                      0,
                      "https://m.facebook.com/watch/"
                    );
                  }
                  await delay(getRandomIntBetween(3000, 5000));
                  continue;
                }
              } else {
                logger("Text is empty");
              }
            }
          } catch (err) {
            i--;
            const returnIcon = await findBtn(
              page,
              "󱜳",
              '[class="f3"]'
            ); 
            if(returnIcon) {
              await delay(getRandomIntBetween(3000, 5000));
              await scrollSmoothIfNotExistOnScreens(returnIcon);
          await delay(getRandomIntBetween(3000, 5000));
          await clickElement(returnIcon);
            } else {
              await delay(getRandomIntBetween(3000, 5000));
              await clickElementRandom(
                page,
                "div.m > div.fl.ac > div.native-text > span.f3",
                0,
                "https://m.facebook.com/watch/"
              );
            }
            await delay(getRandomIntBetween(3000, 5000));
            continue;
          }
        }
  
        if (watchVideoObj.isShare && arrShare.includes(i)) {
          try {
            let isShare = false;
            const shareBtn = await findBtn(page, "󰍺", '[style="color:#ffffff;"]');
            await delay(getRandomIntBetween(3000, 5000));
            await clickElement(shareBtn);
            await delay(getRandomIntBetween(3000, 5000));
            const typeShareBtn = await findBtn(
              page,
              "󱘣",
              "div.m > div.fl.ac > div.native-text > span.f3"
            );
            await delay(getRandomIntBetween(3000, 5000));
            await clickElement(typeShareBtn);
            await delay(getRandomIntBetween(3000, 5000));
            const isCheckClickPost = await checkExistElement(
              page,
              "div.m > div.fl.ar.am > button.native-text.rtl > span.f2",
              3
            );
            if (isCheckClickPost === 1) {
              const postBtn = await page.$(
                "div.m > div.fl.ar.am > button.native-text.rtl > span.f2"
              );
              if (postBtn) {
                await clickElement(postBtn);
                isShare = true;
              }
            } else {
              const postBtn = await page.$(
                "div.fl.ac.am > button.native-text > span.f2"
              );
              if (postBtn) {
                await clickElement(postBtn);
                isShare = true;
              }
            }
            if (isShare) {
              countShare++;
              logger("Đã Share " + countShare + " video ");
            } else {
              i--;
            }
          } catch (err) {
            logger("No can find share button");
            i--;
          }
        }
        //return watch video
        await delay(getRandomIntBetween(3000, 5000));
        const returnIcon = await findBtn(
          page,
          "󱜳",
          '[class="f3"]'
        ); 
        if(returnIcon) {
          await delay(getRandomIntBetween(3000, 5000));
          await scrollSmoothIfNotExistOnScreens(returnIcon);
          await delay(getRandomIntBetween(3000, 5000));
          await clickElement(returnIcon);
        } else {
          await delay(getRandomIntBetween(3000, 5000));
          await clickElementRandom(
            page,
            "div.m > div.fl.ac > div.native-text > span.f3",
            0,
            "https://m.facebook.com/watch/"
          );
        }
        await delay(getRandomIntBetween(3000, 5000));
        countVideo++;
        logger("Complete watch video " + countVideo);
      }
      await delay(getRandomIntBetween(3000, 5000));
    }
  } catch (error) {
    logger("Debug|WatchVideo|" + error.message);
    return;
  }
  
    `;
};
