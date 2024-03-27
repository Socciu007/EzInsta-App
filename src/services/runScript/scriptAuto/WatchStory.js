export const watchStory = (setting) => {
  const strSetting = `
    {
      numsStoryStart: ${setting.numsStoryStart},
      numsStoryEnd: ${setting.numsStoryEnd},
      timeStart: ${setting.timeStart},
      timeEnd: ${setting.timeEnd},
      delayTimeStart: ${setting.delayTimeStart},
      delayTimeEnd: ${setting.delayTimeEnd},
      isComment: ${setting.isComment},
      commentText: ${JSON.stringify(setting.commentText)},
      typeComment: ${JSON.stringify(setting.typeComment)},
      commentStart: ${setting.commentStart},
      commentEnd: ${setting.commentEnd},
      isLike: ${setting.isLike},
      likeStart: ${setting.likeStart},
      likeEnd: ${setting.likeEnd},
      isShare: ${setting.isShare},
      shareStart: ${setting.shareStart},
      shareEnd: ${setting.shareEnd},
      typeShare: ${JSON.stringify(setting.typeShare)},
      userList: ${JSON.stringify(setting.userList)},
      shareText: ${JSON.stringify(setting.shareText)},
      isMessage: ${setting.isMessage},
    }`;
  console.log(strSetting);
  return `
  const testScroll = async (page, element, container) => {
    try {
      await page.evaluate(async (element, container) => {
        const getRandomIntBetween = (min, max) => {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        const isInViewport = (elem, container) => {
          const bounding = elem.getBoundingClientRect();
          return (
            bounding.top >= 0 &&
            bounding.left >= 0 &&
            bounding.bottom <=
              (container.innerHeight || document.documentElement.clientHeight) &&
            bounding.right <=
              (container.innerWidth || document.documentElement.clientWidth)
          );
        };
 
        if (!container) return; // Kiểm tra xem container có tồn tại không

        if (!element || isInViewport(element, container)) return;
  
        const smoothScrollByStep = (targetPosition, duration, container) => {
          const startPosition = container.scrollTop;
          const distance = targetPosition - startPosition;
          let startTime = null;
          const ease = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return (c / 2) * t * t + b;
            t--;
            return (-c / 2) * (t * (t - 2) - 1) + b;
          };
          const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            container.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
          };
          requestAnimationFrame(animation);
        };
  
        const elementRect = element.getBoundingClientRect();
        console.log("check1");
        const viewportHeight =
          container.innerHeight || document.documentElement.clientHeight;
        const targetPosition =
          container.scrollTop +
          elementRect.top -
          (elementRect.top > viewportHeight ? viewportHeight : 0);
        let currentPosition = container.scrollTop;
        while (
          Math.abs(currentPosition - targetPosition) > 0 &&
          !isInViewport(element, container)
        ) {
          const stepSize =
            getRandomIntBetween(100, 200) *
            (currentPosition > targetPosition ? -1 : 1);
          const durationPerStep = getRandomIntBetween(1000, 2000);
          const nextPosition = currentPosition + stepSize;
          smoothScrollByStep(nextPosition, durationPerStep, container);
          await delay(getRandomIntBetween(1000, 2000));
          if (Math.random() < 0.3) {
            await delay(getRandomIntBetween(3000, 5000));
          }
          currentPosition = container.scrollTop; // Sử dụng container.scrollTop thay vì window.scrollTop
        }
      }, element, container);
      return true;
    } catch (error) {
      logger(error);
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
  const likeStory = async page => {
    try {
      const likedEle = await getElement(
        page,
        '[d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"]'
      );
      if (likedEle) {
        logger("Liked story");
        return true;
      } else {
        let likeEle = await getElement(
          page,
          '[d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"]'
        );
        if (!likeEle) {
          likeEle = await getElement(
            page,
            'span [class="x1lliihq x1n2onr6 xq3z1fi"]'
          );
        }
        if (likeEle) {
          await clickElement(likeEle);
          await delay(getRandomIntBetween(3000, 5000));
          logger("Done like story");
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      logger("Err like story");
      return false;
    }
  };
  
  const commentStory = async (page, watchStoryObj) => {
    try {
      if (
        watchStoryObj.typeComment === "text" &&
        watchStoryObj.commentText.length > 0
      ) {
        const contentComment =
          watchStoryObj.commentText[
            getRandomInt(watchStoryObj.commentText.length)
          ];
        let commentEle = await getElement(page, '[class="_abx0 _abx1"] textarea');
        if (!commentEle) {
          commentEle = await getElement(page, '[class="_abx2"]');
        }
        if (commentEle) {
          await commentEle.type(contentComment, { delay: 200 });
          await delay(getRandomIntBetween(3000, 5000));
          await page.keyboard.press("Enter");
          logger("Comment story success");
          return true;
        } else {
          logger("No find comment input");
          return true;
        }
      } else {
        logger("Can not you select type comment or write content comment?");
        return true;
      }
    } catch (error) {
      logger("Err comment story");
      return false;
    }
  };
  
  const shareStory = async (page, watchStoryObj) => {
    try {
      if (
        watchStoryObj.typeShare === "user" &&
        watchStoryObj.userList.length > 0
      ) {
        const shareEle = await getElement(
          page,
          '[points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"]'
        );
        if (!shareEle) {
          return false;
        }
        await clickElement(shareEle);
        await delay(getRandomIntBetween(3000, 5000));
        for (let i = 0; i < watchStoryObj.userList.length; i++) {
          const searchEle = await getElement(page, '[name="queryBox"]');
          const closeEle = await getElement(
            page,
            '[class="x1lliihq x1n2onr6 x5n08af"] [points="20.643 3.357 12 12 3.353 20.647"]'
          );
          if (searchEle) {
            await searchEle.type(watchStoryObj.userList[i], { delay: 200 });
            await delay(getRandomIntBetween(3000, 5000));
            const selectEle = await getElement(
              page,
              '[name="ContactSearchResultCheckbox"]'
            );
            if (selectEle) {
              await clickElement(selectEle);
              await delay(getRandomIntBetween(3000, 5000));
              // import content share
              if (watchStoryObj.isMessage && watchStoryObj.shareText.length > 0) {
                const contentShare =
                  watchStoryObj.shareText[
                    getRandomInt(watchStoryObj.shareText.length)
                  ];
                const importShareEle = await getElement(
                  page,
                  'input[name="shareCommentText"]'
                );
                await delay(getRandomIntBetween(3000, 5000));
                await importShareEle.type(contentShare, { delay: 200 });
                await delay(getRandomIntBetween(3000, 5000));
              }
              //send share post
              let sendButtonEle = await getElement(
                page,
                '[class="x1i10hfl xjqpnuy xa49m3k xqeqjp1 x2hbi6w x972fbf xcfux6l x1qhh985 xm0m39n xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli xexx8yu x18d9i69 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x1lku1pv x1a2a7pz x6s0dn4 xjyslct x1lq5wgf xgqcy7u x30kzoy x9jhf4c x1ejq31n xd10rxx x1sy0etr x17r0tee x9f619 x9bdzbf x1ypdohk x1f6kntn xwhw2v2 x10w6t97 xl56j7k x17ydfre x1swvt13 x1pi30zi x1n2onr6 x2b8uid xlyipyv x87ps6o xcdnw81 x1i0vuye xh8yej3 x1tu34mt xzloghq x3nfvp2"]'
              );
              if (!sendButtonEle) {
                sendButtonEle = await getElement(
                  page,
                  '[class="x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh xktsk01 x1yztbdb x1d52u69 xdj266r x1uhb9sk x1plvlek xryxfnj x1c4vz4f x2lah0s xdt5ytf xqjyukv x1qjc9v5 x1oa3qoh x1nhvcw1"]'
                );
              }
              if (sendButtonEle) {
                await clickElement(sendButtonEle);
                await delay(getRandomIntBetween(1000, 3000));
                logger("Share post success");
                return true;
              } else {
                await clickElement(closeEle);
                await delay(getRandomIntBetween(3000, 5000));
                logger("No send share post interaction");
                return false;
              }
            } else {
              await clickElement(closeEle);
              await delay(getRandomIntBetween(3000, 5000));
              return true;
            }
          } else {
            await clickElement(closeEle);
            await delay(getRandomIntBetween(3000, 5000));
            return true;
          }
        }
      }
      if (watchStoryObj.typeShare === "suggested") {
        const shareEle = await getElement(
          page,
          '[points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"]'
        );
        if (!shareEle) {
          return false;
        }
        await clickElement(shareEle);
        await delay(getRandomIntBetween(3000, 5000));
        const selectEle = await getElements(
          page,
          '[name="ContactSearchResultCheckbox"]'
        );
        const closeEle = await getElement(
          page,
          '[class="x1lliihq x1n2onr6 x5n08af"] [points="20.643 3.357 12 12 3.353 20.647"]'
        );
        if (selectEle.length > 0) {
          const index = getRandomInt(selectEle.length);
          const container = await getElement(page, '[class="x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh x1uhb9sk x6ikm8r x1rife3k x1iyjqo2 x2lwn1j xeuugli xdt5ytf xqjyukv x1qjc9v5 x1oa3qoh x1nhvcw1"]')
          if (container) {
            await testScroll(page, selectEle[index], container)
          }
          await delay(3000);
          await clickElement(selectEle[index]);
          await delay(getRandomIntBetween(3000, 5000));
          // import content share
          if (watchStoryObj.isMessage && watchStoryObj.shareText.length > 0) {
            const contentShare =
              watchStoryObj.shareText[
                getRandomInt(watchStoryObj.shareText.length)
              ];
            const importShareEle = await getElement(
              page,
              'input[name="shareCommentText"]'
            );
            await delay(getRandomIntBetween(3000, 5000));
            await importShareEle.type(contentShare, { delay: 200 });
            await delay(getRandomIntBetween(3000, 5000));
          }
          //send share post
          let sendButtonEle = await getElement(
            page,
            '[class="x1i10hfl xjqpnuy xa49m3k xqeqjp1 x2hbi6w x972fbf xcfux6l x1qhh985 xm0m39n xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli xexx8yu x18d9i69 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x1lku1pv x1a2a7pz x6s0dn4 xjyslct x1lq5wgf xgqcy7u x30kzoy x9jhf4c x1ejq31n xd10rxx x1sy0etr x17r0tee x9f619 x9bdzbf x1ypdohk x1f6kntn xwhw2v2 x10w6t97 xl56j7k x17ydfre x1swvt13 x1pi30zi x1n2onr6 x2b8uid xlyipyv x87ps6o xcdnw81 x1i0vuye xh8yej3 x1tu34mt xzloghq x3nfvp2"]'
          );
          if (!sendButtonEle) {
            sendButtonEle = await getElement(
              page,
              '[class="x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh xktsk01 x1yztbdb x1d52u69 xdj266r x1uhb9sk x1plvlek xryxfnj x1c4vz4f x2lah0s xdt5ytf xqjyukv x1qjc9v5 x1oa3qoh x1nhvcw1"]'
            );
          }
          if (sendButtonEle) {
            await clickElement(sendButtonEle);
            await delay(getRandomIntBetween(1000, 3000));
            logger("Share post success");
            return true;
          } else {
            await clickElement(closeEle);
            await delay(getRandomIntBetween(3000, 5000));
            logger("No send share post interaction");
            return false;
          }
        } else {
          for (let i = 0; i < watchStoryObj.userList.length; i++) {
            const searchEle = await getElement(page, '[name="queryBox"]');
            const closeEle = await getElement(
              page,
              '[class="x1lliihq x1n2onr6 x5n08af"] [points="20.643 3.357 12 12 3.353 20.647"]'
            );
            if (searchEle) {
              await searchEle.type(watchStoryObj.userList[i], { delay: 200 });
              await delay(getRandomIntBetween(3000, 5000));
              const selectEle = await getElement(
                page,
                '[name="ContactSearchResultCheckbox"]'
              );
              if (selectEle) {
                await clickElement(selectEle);
                await delay(getRandomIntBetween(3000, 5000));
                // import content share
                if (watchStoryObj.isMessage && watchStoryObj.shareText.length > 0) {
                  const contentShare =
                    watchStoryObj.shareText[
                      getRandomInt(watchStoryObj.shareText.length)
                    ];
                  const importShareEle = await getElement(
                    page,
                    'input[name="shareCommentText"]'
                  );
                  await delay(getRandomIntBetween(3000, 5000));
                  await importShareEle.type(contentShare, { delay: 200 });
                  await delay(getRandomIntBetween(3000, 5000));
                }
                //send share post
                let sendButtonEle = await getElement(
                  page,
                  '[class="x1i10hfl xjqpnuy xa49m3k xqeqjp1 x2hbi6w x972fbf xcfux6l x1qhh985 xm0m39n xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli xexx8yu x18d9i69 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x1lku1pv x1a2a7pz x6s0dn4 xjyslct x1lq5wgf xgqcy7u x30kzoy x9jhf4c x1ejq31n xd10rxx x1sy0etr x17r0tee x9f619 x9bdzbf x1ypdohk x1f6kntn xwhw2v2 x10w6t97 xl56j7k x17ydfre x1swvt13 x1pi30zi x1n2onr6 x2b8uid xlyipyv x87ps6o xcdnw81 x1i0vuye xh8yej3 x1tu34mt xzloghq x3nfvp2"]'
                );
                if (!sendButtonEle) {
                  sendButtonEle = await getElement(
                    page,
                    '[class="x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh xktsk01 x1yztbdb x1d52u69 xdj266r x1uhb9sk x1plvlek xryxfnj x1c4vz4f x2lah0s xdt5ytf xqjyukv x1qjc9v5 x1oa3qoh x1nhvcw1"]'
                  );
                }
                if (sendButtonEle) {
                  await clickElement(sendButtonEle);
                  await delay(getRandomIntBetween(1000, 3000));
                  logger("Share post success");
                  return true;
                } else {
                  await clickElement(closeEle);
                  await delay(getRandomIntBetween(3000, 5000));
                  logger("No send share post interaction");
                  return false;
                }
              } else {
                await clickElement(closeEle);
                await delay(getRandomIntBetween(3000, 5000));
                return true;
              }
            } else {
              await clickElement(closeEle);
              await delay(getRandomIntBetween(3000, 5000));
              return true;
            }
          }
        }
      }
    } catch (error) {
      logger("Err share story");
      return false;
    }
  };
  
  const gotoStory = async page => {
    try {
      let storyEle = await getElements(
        page,
        'button[class="x6s0dn4 xamitd3 xjbqb8w x1ejq31n xd10rxx x1sy0etr x17r0tee x1ypdohk x78zum5 xdt5ytf x18d9i69 xexx8yu x2b8uid x1fu8urw"]'
      );
      if (!storyEle) {
        storyEle = await getElements(
          page,
          '[class="_acaz"] [class="_aauk _aegn"]'
        );
      }
      await delay(getRandomIntBetween(3000, 5000));
      if (storyEle.length > 0) {
        const index = getRandomInt(storyEle.length - 2)
        await clickElement(storyEle[index]);
        await delay(getRandomIntBetween(3000, 5000));
        const isUrlStory = await checkUrlPage(page, "instagram.com/stories");
        await delay(getRandomIntBetween(3000, 5000));
        if (!isUrlStory) {
          await clickElement(storyEle[index]);
        }
        await delay(getRandomIntBetween(3000, 5000));
        return true;
      } else {
        logger("No have story on your screen");
        return false;
      }
    } catch (error) {
      logger("Err go to story " + error.message);
      return false;
    }
  };
  let watchStoryObj = ${strSetting};
  try {
    const isLive = await checkIsLive(page);
    if (!isLive) {
      logger("Page is die");
      return;
    }
    await returnHomePage(page);
    await delay(getRandomIntBetween(3000, 5000));
    await turnOffNoti(page);
    watchStoryObj = await checkObject(watchStoryObj);
    let arrLike = [];
    let arrComment = [];
    let arrShare = [];
    let countStory = 0;
    let countLike = 0;
    let countComment = 0;
    let countShare = 0;
    const timeWatch =
      getRandomIntBetween(watchStoryObj.timeStart, watchStoryObj.timeEnd) *
      1000;
    const delayTime =
      getRandomIntBetween(
        watchStoryObj.delayTimeStart,
        watchStoryObj.delayTimeEnd
      ) * 1000;
    const numsStory = getRandomIntBetween(
      watchStoryObj.numsStoryStart,
      watchStoryObj.numsStoryEnd
    );
    let numsLike = getRandomIntBetween(
      watchStoryObj.likeStart,
      watchStoryObj.likeEnd
    );
    let numsComment = getRandomIntBetween(
      watchStoryObj.commentStart,
      watchStoryObj.commentEnd
    );
    let numsShare = getRandomIntBetween(
      watchStoryObj.shareStart,
      watchStoryObj.shareEnd
    );

    if(numsStory < 1) {
      logger("Debug|WatchStory|Quantity of story less than 1.You need re-enter.")
      return
    }
    logger("Need watch " + numsStory + " story");

    if (watchStoryObj.isLike) {
      if (numsLike < numsStory) {
        while (numsLike > 0) {
          const index = getRandomIntBetween(0, numsStory);
          if (arrLike.includes(index)) {
            continue;
          }
          arrLike.push(index);
          numsLike--;
        }
      } else {
        for (let i = 0; i < numsStory; i++) {
          arrLike.push(i);
        }
      }
      logger("Need like " + arrLike.length + " story");
    }

    if (watchStoryObj.isComment) {
      if (numsComment < numsStory) {
        while (numsComment > 0) {
          const index = getRandomIntBetween(0, numsStory);
          if (arrComment.includes(index)) {
            continue;
          }
          arrComment.push(index);
          numsComment--;
        }
      } else {
        for (let i = 0; i < numsStory; i++) {
          arrComment.push(i);
        }
      }
      logger("Need comment " + arrComment.length + " story");
    }
    if (watchStoryObj.isShare) {
      if (numsShare < numsStory) {
        while (numsShare > 0) {
          const index = getRandomIntBetween(0, numsStory);
          if (arrShare.includes(index)) {
            continue;
          }
          arrShare.push(index);
          numsShare--;
        }
      } else {
        for (let i = 0; i < numsStory; i++) {
          arrShare.push(i);
        }
      }
      logger("Need share " + arrShare.length + " story");
    }

    const isGotoStory = await gotoStory(page);
    if (isGotoStory) {
      const soundEle = await getElement(page, '[d="M1.5 13.3c-.8 0-1.5.7-1.5 1.5v18.4c0 .8.7 1.5 1.5 1.5h8.7l12.9 12.9c.9.9 2.5.3 2.5-1v-9.8c0-.4-.2-.8-.4-1.1l-22-22c-.3-.3-.7-.4-1.1-.4h-.6zm46.8 31.4-5.5-5.5C44.9 36.6 48 31.4 48 24c0-11.4-7.2-17.4-7.2-17.4-.6-.6-1.6-.6-2.2 0L37.2 8c-.6.6-.6 1.6 0 2.2 0 0 5.7 5 5.7 13.8 0 5.4-2.1 9.3-3.8 11.6L35.5 32c1.1-1.7 2.3-4.4 2.3-8 0-6.8-4.1-10.3-4.1-10.3-.6-.6-1.6-.6-2.2 0l-1.4 1.4c-.6.6-.6 1.6 0 2.2 0 0 2.6 2 2.6 6.7 0 1.8-.4 3.2-.9 4.3L25.5 22V1.4c0-1.3-1.6-1.9-2.5-1L13.5 10 3.3-.3c-.6-.6-1.5-.6-2.1 0L-.2 1.1c-.6.6-.6 1.5 0 2.1L4 7.6l26.8 26.8 13.9 13.9c.6.6 1.5.6 2.1 0l1.4-1.4c.7-.6.7-1.6.1-2.2z"]')
      if (soundEle) {
        await clickElement(soundEle);
      }
      while (countStory < numsStory) {
        let pauseEle = await getElement(
          page,
          '[d="M5.888 22.5a3.46 3.46 0 0 1-1.721-.46l-.003-.002a3.451 3.451 0 0 1-1.72-2.982V4.943a3.445 3.445 0 0 1 5.163-2.987l12.226 7.059a3.444 3.444 0 0 1-.001 5.967l-12.22 7.056a3.462 3.462 0 0 1-1.724.462Z"]'
        );
        if (!pauseEle) {
          pauseEle = await getElement(
            page,
            '[d="M15 1c-3.3 0-6 1.3-6 3v40c0 1.7 2.7 3 6 3s6-1.3 6-3V4c0-1.7-2.7-3-6-3zm18 0c-3.3 0-6 1.3-6 3v40c0 1.7 2.7 3 6 3s6-1.3 6-3V4c0-1.7-2.7-3-6-3z"]'
          );
        }
        await delay(timeWatch);
        logger("view story");
        const isUrlStory = await checkUrlPage(page, "instagram.com/stories");
        await delay(getRandomIntBetween(3000, 5000));
        if (!isUrlStory) {
          await gotoStory(page);
          await delay(getRandomIntBetween(3000, 5000));
          continue;
        } 
        if (pauseEle) {
          await clickElement(pauseEle);
        }
        await delay(getRandomIntBetween(3000, 5000));
        //like, comment, share
        if (watchStoryObj.isLike && arrLike.includes(countStory)) {
          const isLike = await likeStory(page);
          await delay(getRandomIntBetween(3000, 5000));
          if (isLike) {
            countLike++;
            logger("Done like " + countLike + " story");
          } else {
            let nextEle = await getElement(page, '[class=" _9zm2"]');
            if (!nextEle) {
              nextEle = await getElement(page, 'button[class="_ac0d"]');
            }
            const isUrlStory = await checkUrlPage(page, "instagram.com/stories");
            await delay(getRandomIntBetween(3000, 5000));
            if (nextEle && isUrlStory) {
              await clickElement(nextEle);
              await delay(getRandomIntBetween(3000, 5000));
            } else {
              await gotoStory(page);
              await delay(getRandomIntBetween(3000, 5000));
            }
            continue;
          }
        }

        if (watchStoryObj.isComment && arrComment.includes(countStory)) {
          const isComment = await commentStory(page, watchStoryObj);
          await delay(getRandomIntBetween(3000, 5000));
          if (isComment) {
            countComment++;
            logger("Done comment " + countComment + " story");
          } else {
            let nextEle = await getElement(page, '[class=" _9zm2"]');
            if (!nextEle) {
              nextEle = await getElement(page, 'button[class="_ac0d"]');
            }
            const isUrlStory = await checkUrlPage(page, "instagram.com/stories");
            await delay(getRandomIntBetween(3000, 5000));
            if (nextEle && isUrlStory) {
              await clickElement(nextEle);
              await delay(getRandomIntBetween(3000, 5000));
            } else {
              await gotoStory(page);
              await delay(getRandomIntBetween(3000, 5000));
            }
            continue;
          }
        }

        if (watchStoryObj.isShare && arrShare.includes(countStory)) {
          const isShare = await shareStory(page, watchStoryObj);
          await delay(getRandomIntBetween(3000, 5000));
          if (isShare) {
            countShare++;
            logger("Done share " + countShare + " story");
          } else {
            let nextEle = await getElement(page, '[class=" _9zm2"]');
            if (!nextEle) {
              nextEle = await getElement(page, 'button[class="_ac0d"]');
            }
            const isUrlStory = await checkUrlPage(page, "instagram.com/stories");
            await delay(getRandomIntBetween(3000, 5000));
            if (nextEle && isUrlStory) {
              await clickElement(nextEle);
              await delay(getRandomIntBetween(3000, 5000));
            } else {
              await gotoStory(page);
              await delay(getRandomIntBetween(3000, 5000));
            }
            continue;
          }
        }

        //next story
        if (countStory + 1 < numsStory) {
          await delay(delayTime);
          let nextEle = await getElement(page, '[class=" _9zm2"]');
          if (!nextEle) {
            nextEle = await getElement(page, 'button[class="_ac0d"]');
          }
          const isUrlStory = await checkUrlPage(page, "instagram.com/stories");
          await delay(getRandomIntBetween(3000, 5000));
          if (nextEle && isUrlStory) {
            await clickElement(nextEle);
            await delay(getRandomIntBetween(3000, 5000));
          } else {
            await gotoStory(page);
            await delay(getRandomIntBetween(3000, 5000));
          }
        }
        countStory++;
        logger("Complete watch " + countStory + " story");
      }
    } else {
      logger("Debug|WatchStory|Err go to story");
      return;
    }
  } catch (error) {
    logger("Debug|WatchStory|Err watch story " + error.message);
    return;
  }
  `;
};
