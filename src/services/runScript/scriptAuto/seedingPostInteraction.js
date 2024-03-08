export const seedingPostInteraction = (setting) => {
  const strSetting = `
      {
        viewTimeStart: ${setting.viewTimeStart},
  viewTimeEnd: ${setting.viewTimeEnd},
  delayTimeStart: ${setting.delayTimeStart},
  delayTimeEnd: ${setting.delayTimeEnd},
  isLike: ${setting.isLike},
  likeStart: ${setting.likeStart},
  likeEnd: ${setting.likeEnd},
  isShare: ${setting.isShare},
  typeShare: ${JSON.stringify(setting.typeShare)},
  userList: ${JSON.stringify(setting.userList)},
  isComment: ${setting.isComment},
  commentText: ${JSON.stringify(setting.commentText)},
  commentStart: ${setting.commentStart},
  commentEnd: ${setting.commentEnd},
  postUID: ${JSON.stringify(setting.postUID)},
      }`;
  console.log(strSetting);
  return `
  const accessPost = async (page, postInteractionObj, arrComment, arrLike) => {
    try {
      const viewPostTime = getRandomIntBetween(
        postInteractionObj.viewTimeStart * 1000,
        postInteractionObj.viewTimeStart * 1000
      );
      const delayPostTime = getRandomIntBetween(
        postInteractionObj.delayTimeStart * 1000,
        postInteractionObj.delayTimeEnd * 1000
      );
      let countLike = 0;
      let countComment = 0;
      for (let i = 0; i < postInteractionObj.postUID.length; i++) {
        await delay(delayPostTime);
        const link = 'https://www.instagram.com/p/' + postInteractionObj.postUID[i] + '/';
        await navigateToUrl(page, link);
        await delay(viewPostTime);
        logger("Done view post");
        if (postInteractionObj.isLike && arrLike.includes(i)) {
          await likePost(page, countLike);
          await delay(getRandomIntBetween(1000, 3000));
        }
        if (postInteractionObj.isComment && arrComment.includes(i)) {
          await commentPost(page, countComment);
          await delay(getRandomIntBetween(1000, 3000));
        }
        if (
          postInteractionObj.userList.length > 0 &&
          postInteractionObj.typeShare === "user"
        ) {
          await sharePost(page, postInteractionObj);
          await delay(getRandomIntBetween(1000, 3000));
        }
        await delay(1000);
      }
      logger("Post interaction complete");
    } catch (error) {
      logger("Err access" + error.message);
    }
  };
  
  const likePost = async (page, countLike) => {
    try {
      let likedEle = await getElement(
        page,
        'span[class="xp7jhwk"] [class="x1lliihq x1n2onr6 xxk16z8"]'
      );
      if (!likedEle) {
        likedEle = await getElement(
          page,
          'span[class="xp7jhwk"] [d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"]'
        );
      }
      if (likedEle) {
        logger("Liked this post");
      } else {
        let likeEle = await getElement(page, '[class="xp7jhwk"]');
        if (!likeEle) {
          likeEle = await getElement(
            page,
            'svg[class="x1lliihq x1n2onr6 xyb1xck"] [d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"]'
          );
          if (!likeEle) {
            likeEle = await getElement(
              page,
              '[class="x1lliihq x1n2onr6 xyb1xck"]'
            );
          }
        }
        if (likeEle) {
          await scrollSmoothIfNotExistOnScreen1(likeEle);
          await clickElement(likeEle);
          await delay(getRandomIntBetween(1000, 3000));
          ++countLike;
          logger("Like " + countLike + " post success");
        } else {
          logger("Can't find like element");
        }
      }
    } catch (error) {
      logger("Err like post" + error.message);
    }
  };
  
  const commentPost = async (page, countComment, postInteractionObj) => {
    try {
      if (postInteractionObj.commentText.length > 0) {
        const contentComment =
          postInteractionObj.commentText[
            getRandomInt(postInteractionObj.commentText.length)
          ];
        let commentEle = await getElement(page, '[class="_akhn"] textarea');
        if (!commentEle) {
          commentEle = await getElement(
            page,
            '[class="x1i0vuye xvbhtw8 x1ejq31n xd10rxx x1sy0etr x17r0tee x5n08af x78zum5 x1iyjqo2 x1qlqyl8 x1d6elog xlk1fp6 x1a2a7pz xexx8yu x4uap5 x18d9i69 xkhd6sd xtt52l0 xnalus7 xs3hnx8 x1bq4at4 xaqnwrm"]'
          );
        }
        if (commentEle) {
          await scrollSmoothIfNotExistOnScreen1(commentEle);
          await clickElement(commentEle);
          await delay(getRandomIntBetween(1000, 3000));
          await commentEle.type(contentComment, { delay: 500 });
          await delay(getRandomIntBetween(1000, 3000));
          let postCommentEle = getElement(page, '[class="_aidp"]');
          if (postCommentEle.length === 0) {
            postCommentEle = getElement(
              page,
              '[class="x1i10hfl xjqpnuy xa49m3k xqeqjp1 x2hbi6w xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x1lku1pv x1a2a7pz x6s0dn4 xjyslct x1ejq31n xd10rxx x1sy0etr x17r0tee x9f619 x1ypdohk x1f6kntn xwhw2v2 xl56j7k x17ydfre x2b8uid xlyipyv x87ps6o x14atkfc xcdnw81 x1i0vuye xjbqb8w xm3z3ea x1x8b98j x131883w x16mih1h x972fbf xcfux6l x1qhh985 xm0m39n xt0psk2 xt7dq6l xexx8yu x4uap5 x18d9i69 xkhd6sd x1n2onr6 x1n5bzlp x173jzuc x1yc6y37"]'
            );
          }
          if (postCommentEle.length > 0) {
            await clickElement(postCommentEle);
            await delay(getRandomIntBetween(1000, 3000));
            ++countComment;
            logger("Comment " + countComment + " post success");
          } else {
            logger("Can not post comment");
          }
        } else {
          logger("Can not find comment element");
        }
      } else {
        logger("Not content comment");
      }
    } catch (error) {
      logger("Err comment post " + error.message);
    }
  };
  
  const sharePost = async (page, postInteractionObj) => {
    try {
      //select and click button share
      let shareEle = await getElement(page, '[class="_abm0 _abl_"]');
      if (!shareEle) {
        const listShareEle = await getElements(
          page,
          '[points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"]'
        );
        shareEle = listShareEle[1];
      }
      if (shareEle && postInteractionObj.userList.length > 0) {
        const userShare =
          postInteractionObj.userList[
            getRandomIntBetween(0, postInteractionObj.userList.length)
          ];
        await scrollSmoothIfNotExistOnScreen1(shareEle);
        await clickElement(shareEle);
        await delay(getRandomIntBetween(1000, 3000));
        //search user and click user need share
        const searchUserShare = await getElement(page, 'input[name="queryBox"]');
        if (!searchUserShare) {
          logger("Can not find search input");
        }
        await searchUserShare.type(userShare, { delay: 200 });
        await delay(getRandomIntBetween(1000, 3000));
        const selectUserEle = await getElement(
          page,
          'input[name="ContactSearchResultCheckbox"]'
        );
        if (!selectUserEle) {
          logger("Can not select user to share");
        }
        await clickElement(selectUserEle);
        await delay(getRandomIntBetween(1000, 3000));
        //input[name="shareCommentText"] nhap noi dung muon share
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
        } else {
          logger("Can not send share post");
        }
      } else {
        logger("Can not find share button or user list none");
      }
    } catch (error) {
      logger("Err share post " + error.message);
    }
  };
  
  const navigateToUrl = async (page, link) => {
    try {
      const url = await page.url();
      if (!url.includes(link)) {
        await page.goto(link, {
          waitUntil: "networkidle2",
        });
        await delay(getRandomIntBetween(1000, 3000));
      } else {
        logger("Can't navigate");
      }
    } catch (error) {
      throw new Error("Error navigating to URL:" + error.message);
    }
  };
  
  const scrollSmoothIfNotExistOnScreen1 = async element => {
    try {
      const isExistElementOnScreen = await checkExistElementOnScreen1(element);
      if (!isExistElementOnScreen) {
        await element.evaluate(el => {
          el.scrollIntoView({
            behavior: "smooth",
            inline: "nearest",
            block: "center",
          });
        });
        await delay(getRandomIntBetween(1000, 3000));
        return true;
      }
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const checkExistElementOnScreen1 = async element => {
    try {
      const isElementVisible = await element.evaluate(el => {
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
 let postInteractionObj = ${strSetting};

 try {
  const isLive = await checkIsLive(page);
  if (!isLive) {
    logger("Page is die");
    return;
  }
  await returnHomePage(page);
  await delay(2000);
  postInteractionObj = await checkObject(postInteractionObj);
  logger("length", postInteractionObj["postUID"].length);
  let arrLike = [];
  let arrComment = [];
  let numsLike = getRandomIntBetween(
    postInteractionObj.likeStart,
    postInteractionObj.likeEnd
  );
  let numsComment = getRandomIntBetween(
    postInteractionObj.commentStart,
    postInteractionObj.commentEnd
  );

  if (numsLike < postInteractionObj["postUID"].length) {
    while (numsLike > 0) {
      const index = getRandomIntBetween(0, postInteractionObj.postUID.length);
      if (arrLike.includes(index)) {
        continue;
      }
      arrLike.push(index);
      numsLike--;
    }
  } else {
    for (let i = 0; i < postInteractionObj.postUID.length; i++) {
      arrLike.push(i);
    }
  }
  logger("Need like " + arrLike.length + " post");
  if (numsComment < postInteractionObj.postUID.length) {
    while (numsComment > 0) {
      const index = getRandomIntBetween(0, postInteractionObj.postUID.length);
      if (arrComment.includes(index)) {
        continue;
      }
      arrComment.push(index);
      numsComment--;
    }
  } else {
    for (let i = 0; i < postInteractionObj.postUID.length; i++) {
      arrComment.push(i);
    }
  }
  logger("Need comment " + arrComment.length + " post");
  await delay(getRandomIntBetween(1000, 3000));
  await accessPost(page, postInteractionObj, arrComment, arrLike);
} catch (error) {
  logger("Err post interaction " + error.message);
}
  `;
};
