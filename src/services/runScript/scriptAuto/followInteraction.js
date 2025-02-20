export const followInteraction = (setting) => {
  const strSetting = `
    {
      typeInteract: ${JSON.stringify(setting.typeInteract)},
      option: ${JSON.stringify(setting.option)},
      usernameList: ${JSON.stringify(setting.usernameList)},
      accountStart: ${setting.accountStart},
      accountEnd: ${setting.accountEnd},
      timeStart: ${setting.timeStart},
      timeEnd: ${setting.timeEnd},
      delayTimeStart: ${setting.delayTimeStart},
      delayTimeEnd: ${setting.delayTimeEnd},
      isLike: ${setting.isLike},
      likeStart: ${setting.likeStart},
      likeEnd: ${setting.likeEnd},
      isShare: ${setting.isShare},
      shareStart: ${setting.shareStart},
      shareEnd: ${setting.shareEnd},
      randomStart: ${setting.randomStart},
      randomEnd: ${setting.randomEnd},
      userStart: ${setting.userStart},
      userEnd: ${setting.userEnd},
      typeShare: ${JSON.stringify(setting.typeShare)},
      shareUserText: ${JSON.stringify(setting.shareUserText)},
      shareRandomText: ${JSON.stringify(setting.shareRandomText)},
      userMessage: ${JSON.stringify(setting.userMessage)},
      randomMessage: ${JSON.stringify(setting.randomMessage)},
      isRandomMessage:  ${setting.isRandomMessage},
      isUserMessage:  ${setting.isUserMessage},
      isComment: ${setting.isComment},
      commentStart: ${setting.commentStart},
      commentEnd: ${setting.commentEnd},
      commentText: ${JSON.stringify(setting.commentText)},
    }`;
  console.log(strSetting);
  return `
const randomShare = async (page, obj) => {
  const numsUser = getRandomIntBetween(obj.randomStart, obj.randomEnd);
    if(numsUser == 0) {
    return false;
  }
  let count = 0;
  for(let i = 0; i < numsUser * 2 ; i++){ 
    const isLive = checkIsLive(page);
    if (!isLive) {
    return false;
    }
    let search = await getElement(page, '[name="queryBox"]');
    if(!search) {
      logger("Can not find search button")
      return false;
    }
    await search.click();
    await delay(2000);
    let content = obj.shareRandomText;
    let randomIndex = getRandomInt(content.length);
    let randomString = content[randomIndex];
    await delay(2000);
    await page.keyboard.type(randomString, { delay: 100 });
    await delay(5000);
    let radioBtns = await findBtns(page, "radio");
    await delay(5000);
    if(!radioBtns) {
      await search.click();
      await page.keyboard.down('Control'); 
      await page.keyboard.press('A');
      await page.keyboard.up('Control'); 
      await page.keyboard.press('Backspace');
      await delay(3000);
      continue;
    }
    let rdIndex = getRandomInt(radioBtns.length);
    await page.evaluate((el) => {
       el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }, radioBtns[rdIndex]);
    await delay(2000);
    await radioBtns[rdIndex].click();
    await delay(2000);
    count++;
    logger("Đã gửi cho " + count +  " người");
    if(count == numsUser) {
      logger("Đã gửi cho đủ người");
      break;
    }
  }
   
  if(obj.isRandomMessage == true) {
    const messageArea = await getElement(page, '[name="shareCommentText"]');
    if(!messageArea) {
      logger("Không tìm thấy vùng ghi lời nhắn");
      return false;
    }
    await delay(2000);
    await messageArea.click();
    await delay(2000);
    let message = obj.randomMessage;
    let randomString = message[getRandomInt(message.length)];
    await delay(2000);
    await page.keyboard.type(randomString, { delay: 100 });
    await delay(2000);
  }

  const sendBtns = await findBtns(page, "send");
  if (!sendBtns || sendBtns.length == 0) {
    logger("Can not find any send buttons")
    return false;
  }
  await sendBtns[sendBtns.length - 1].click();
  await delay(3000);
  return true;
  
} 
const userShare = async (page, obj) => {
  const numsUser = getRandomIntBetween(obj.userStart, obj.userEnd);
   if(numsUser == 0) {
    return false;
  }
  let count = 0;
  for(let i = 0; i < numsUser * 2 ; i++){
    const isLive = checkIsLive(page);
    if (!isLive) {
      return false;
    }
    const search = await getElement(page, '[name="queryBox"]');
    if(!search) {
      logger("Can not find search button")
      return false;
    }
    await search.click();
    await delay(2000);
    let content = obj.shareUserText;
    let randomIndex = getRandomInt(content.length);
    let randomString = content[randomIndex];
    await delay(2000);
    await page.keyboard.type(randomString, { delay: 100 });
    await delay(5000);
    let radioBtns = await findBtns(page, "radio");
      logger(radioBtns.length)
    await delay(5000);
    if(!radioBtns) {
      await search.click();
      await page.keyboard.down('Control'); 
      await page.keyboard.press('A');
      await page.keyboard.up('Control'); 
      await page.keyboard.press('Backspace');
      await delay(3000);
      continue;
    }
    await page.evaluate((el) => {
       el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }, radioBtns[0]);
    await delay(2000);
    await radioBtns[0].click();
    await delay(2000);
    count++;
    logger("Đã gửi cho " + count +  " người");
    if(count == numsUser) {
      logger("Đã gửi cho đủ người");
      break;
    }
  }
  
  if(obj.isUserMessage == true) {
    const messageArea = await getElement(page, '[name="shareCommentText"]');
    if(!messageArea) {
      logger("Không tìm thấy vùng ghi lời nhắn");
      return false;
    }
    await delay(2000);
    await messageArea.click();
    await delay(2000);
    let message = obj.userMessage;
    let randomString = message[getRandomInt(message.length)];
    await delay(2000);
    await page.keyboard.type(randomString, { delay: 100 });
    await delay(2000);
  }
  const sendBtns = await findBtns(page, "send");
  if (!sendBtns || sendBtns.length == 0) {
    logger("Can not find any send buttons")
    return false;
  }
  await delay(2000);
  await sendBtns[sendBtns.length - 1].click();
  await delay(3000);
  return true;
  
} 
const findBtns = async (page, content) => {
  try {
    if (content === "like") {
      let buttons = await getElements(
        page,
        'span [d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"]'
      );
      return buttons;
    }
    if (content === "comment") {
      let buttons = await getElements(
        page,
        'textarea'
      );
      return buttons;
    }
    let arr = [];
    if (content === "share") {
      let buttons = await getElements(
        page,
        '[points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"]'
      );
      for (let i = 1; i <= buttons.length; i++) {
        if(i%2 == 0){
          arr.push(buttons[i-1]);
        }
      }
      return arr;
    }
    if(content === "radio") {
      let buttons = await getElements(
        page,
        '[type="checkbox"]'
      );
      let arr = [];
      for(let i = 0 ; i < buttons.length; i++){
        const check = await page.evaluate((el) => {
          if(el.hasAttribute('checked')){
            return false
          } else {
            return true
          }
        }, buttons[i]);
        if(check){
          arr.push(buttons[i]);
        }
      }
      return arr;
    }
    if(content === "send") {
      let buttons = await getElements(
        page,
        'div[role="button"]'
      );
      return buttons;
    }
  } catch (err) {
    logger(err);
  }
};

const clickClose = async (page) => {
  try {
    const closeBtn = await getElement(page, "polyline");
    if(!closeBtn) {
      await page.goBack();
    }
    await delay(2000);
    await closeBtn.click();
    await delay(2000);
    logger("click close");
  } catch(error) {
    logger(error);
  }
}

const clickReturn = async (page) => {
  try {
    const returnBtns = await getElements(page, '[d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z"]');
    if(!returnBtns) {
      await page.goBack();
    }
    await delay(2000);
    await returnBtns[returnBtns.length - 1].click();
    await delay(2000);
    logger("click return");
  } catch(error) {
    logger(error);
  }
}

const scrollSmooth1 = async (page, randomScrollTime, containerSelector) => {
      try {
        while(randomScrollTime > 0){
        const isLive = checkIsLive(page);
          if (!isLive) {
            return -2;
          }
        await page.evaluate((containerSelector) => {
            const getRandomIntBetween = (min, max) => {
              return Math.floor(Math.random() * (max - min + 1)) + min;
            };
            const container = document.querySelector(containerSelector);
            if (!container) return;
            const smoothScrollByStep = (targetPosition, duration, container) => {
              const startPosition = container.scrollTop;
              const distance = targetPosition - startPosition;
              let startTime = null;
              const animation = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const run = ease(timeElapsed, startPosition, distance, duration);
                container.scrollTo(0, run);
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
            let scrollAmount = getRandomIntBetween(100, 200);
            const targetPosition = container.scrollTop  + scrollAmount;
            let currentPosition = container.scrollTop ;
            if (currentPosition < targetPosition) {
              const durationPerStep = getRandomIntBetween(700, 1000);
              const nextPosition = Math.max(
                currentPosition + scrollAmount,
                targetPosition
              );
              smoothScrollByStep(nextPosition, durationPerStep, container);
            }
          }, containerSelector);
          await delay(getRandomIntBetween(2000, 5000));
          randomScrollTime--;
        }
          return 1;
      } catch (error) {
        return 0;
      }
    };

const interactWithFollower = async (page, obj, numAccounts) => {
    try {
        await delay(5000);
        const isLive = checkIsLive(page);
          if (!isLive) {
            return false;
          }
        const containerSelector = '[class="_aano"]';
        await scrollSmooth1(page, 5, containerSelector);
        let span = await getElements(page, '[role="dialog"] [role="link"] span'); 
        let button = await getElements(page, '[role="dialog"] [role="button"]'); 
        
        if(!span || span.length == 0) {
            return false;
        }
        if(!button || button.length == 0) {
            return false;
        }
        let numsFollower = button.length - span.length;
        logger(numsFollower);
        let randomDelay = getRandomIntBetween(obj.delayTimeStart, obj.delayTimeEnd)*1000;
        let viewTime = getRandomIntBetween(obj.timeStart, obj.timeEnd)*1000;
        let count = 0;
        let isInteract = false;
        if(numAccounts > numsFollower) {
          numAccounts = numsFollower;
          logger("numAccounts: " + numAccounts);
        }
        let a = [];
        let b = [];
        let attempt = 0;
        for(let i = 0 ; i < numsFollower; i++){
          const isLive = checkIsLive(page);
          if (!isLive) {
            return false;
          }
          let numLikes = getRandomIntBetween(obj.likeStart, obj.likeEnd);
          let numShares = getRandomIntBetween(obj.shareStart, obj.shareEnd);
          let numComments = getRandomIntBetween(obj.commentStart, obj.commentEnd);

          let span = await getElements(page, '[role="dialog"] [role="link"] span'); 
          let button = await getElements(page, '[role="dialog"] [role="button"]'); 
          if(!span || span.length == 0) {
            return false;
          }
          if(!button || button.length == 0) {
            return false;
          }
          let numsFollower = button.length - span.length;
          if(obj.option === 'random'){
            let randomIndex = getRandomInt(numsFollower);
              if(a.indexOf(randomIndex) == -1){
                a.push(randomIndex);
              } else {
                continue;
              }
            await page.evaluate((el) => {
               el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
            }, span[randomIndex]);
            await delay(5000);
            await span[randomIndex].click();
          }
          if(obj.option === 'username'){
            let search = await getElement(page, '[placeholder="Search"]');
              if(!search) {
                logger("Can not find search button");
                break;
              }
              await search.click();
              await delay(2000);
              let content = obj.usernameList;
              let randomIndex = getRandomInt(content.length);
              if(b.indexOf(randomIndex) == -1){
                b.push(randomIndex);
              } else {
                continue;
              }
              let randomString = content[randomIndex];
              await delay(2000);
              await page.keyboard.type(randomString, { delay: 100 });
              await delay(5000);
              let span = await getElements(page, '[role="dialog"] [role="link"] span');
              if(span){
                await span[0].click();
              } else {
                await search.click();
                await page.keyboard.down('Control'); 
                await page.keyboard.press('A');
                await page.keyboard.up('Control'); 
                await page.keyboard.press('Backspace');
                await delay(3000);
                attempt++;
              }
              if(attempt == content.length){
                logger("đã thử hết content");
                break;
              }
          }
          await delay(randomDelay);
          let check = await getElement(page, 'div[role="presentation"]');
          if(check){
            await delay(2000);
            await clickReturn(page);
            logger("không có bài viết")
            await delay(5000);
            continue;
          }
          let posts = await getElements(page, 'a[role="link"] img');
          if(!posts) {
            await delay(2000);
            await clickReturn(page);
            logger("không tìm thấy bài viết");
            await delay(5000);
            continue;
          }
          let arr = [];
          for(let i = 0 ; i < posts.length; i++){
            const isLive = checkIsLive(page);
            if (!isLive) {
              return false;
            }
            posts = await getElements(page, 'a[role="link"] img');
              let randomIndex = getRandomIntBetween(1, posts.length);
              if(arr.indexOf(randomIndex) == -1){
                arr.push(randomIndex);
              } else {
                continue;
              }
            await page.evaluate((el) => {
               el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
            }, posts[randomIndex])
            await delay(5000);
            await posts[randomIndex].click();
            await delay(viewTime);
            if(numLikes > posts.length - 1){
              numLikes = posts.length - 1;
            }
            if(numShares > posts.length - 1){
              numShares = posts.length - 1;
              logger("numShares " + numShares)
            }
            if(numComments > posts.length - 1){
              numComments = posts.length - 1;
               logger("numComments "+ numComments);
            }
            if(obj.isLike == true && numLikes > 0){
              const likeBtn = await getElement(page, '[d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"]');
              if(likeBtn){
                await likeBtn.click();
                numLikes--;
                logger("còn phải like " + numLikes + " bài");
                await delay(randomDelay);
              }
            }
            if(obj.isShare == true && numShares > 0){
              const shareBtns = await getElements(page, '[points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"]');
              if(shareBtns){
                await shareBtns[shareBtns.length - 1].click();
                await delay(randomDelay);
                if(obj.typeShare == "randomShare"){
                  const isShare = await randomShare(page, obj);
                  if(isShare){
                    numShares--;
                    logger("còn phải share " + numShares + " bài")
                  } else {
                    await clickClose(page);
                    logger("share failed!");
                    await delay(2000);
                  }
                }
                if(obj.typeShare == "user"){
                  const isShare = await userShare(page, obj);
                  if(isShare){
                    numShares--;
                    logger("còn phải share " + numShares + " bài")
                  } else {
                    await clickClose(page);
                    logger("share failed!");
                    await delay(2000);
                  }
                }
              }
            }
            if(obj.isComment == true && numComments > 0){
              const commentBtn = await getElement(page, 'textarea');
              if(commentBtn){
                await commentBtn.click();
                await delay(3000);
                let content = obj.commentText;
                let randomString = content[getRandomInt(content.length)];
                await delay(2000);
                await page.keyboard.type(randomString, { delay: 100 });
                await delay(2000);
                await page.keyboard.press("Enter");
                await delay(randomDelay);
                numComments--;
                logger("còn phải comment " + numComments + " bài")
              }
            }
            await clickClose(page);
            await delay(3000);
          }
          await delay(2000);
          await clickReturn(page);
          await delay(2000);
          count++;
          await delay(2000);
          if(count == numAccounts) {
            isInteract = true;
          }
        }
      return isInteract;
    } catch (error){
        logger(error);
    }
}

const interactWithFollowing = async (page, obj, numAccounts) => {
    try {
        await delay(5000);
        const containerSelector = '[class="_aano"]';
        await scrollSmooth1(page, 5, containerSelector);
        let numsFollowing = await getElements(page, '[role="dialog"] > div > div> div:nth-child(4) > div:nth-child(1) [role="link"] span'); 
        let randomDelay = getRandomIntBetween(obj.delayTimeStart, obj.delayTimeEnd)*1000;
        let viewTime = getRandomIntBetween(obj.timeStart, obj.timeEnd)*1000;
        let count = 0;
        let isInteract = false;
        if(numAccounts > numsFollowing.length) {
          numAccounts = numsFollowing.length;
          logger(numAccounts);
        }
        let a = [];
        let b = [];
        let attempt = 0;
        for(let i = 0 ; i < numsFollowing.length; i++){
          const isLive = checkIsLive(page);
          if (!isLive) {
            return false;
          }
          let numLikes = getRandomIntBetween(obj.likeStart, obj.likeEnd);
          let numShares = getRandomIntBetween(obj.shareStart, obj.shareEnd);
          let numComments = getRandomIntBetween(obj.commentStart, obj.commentEnd);

          numsFollowing = await getElements(page, '[role="dialog"] > div > div> div:nth-child(4) > div:nth-child(1) [role="link"] span'); 
          if(obj.option === 'random'){
            let randomIndex = getRandomInt(numsFollowing.length);
              if(a.indexOf(randomIndex) == -1){
                a.push(randomIndex);
              } else {
                continue;
              }
            await page.evaluate((el) => {
               el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
            }, span[randomIndex]);
            await delay(5000);
            await span[randomIndex].click();
          }
          if(obj.option === 'username'){
            let search = await getElement(page, '[placeholder="Search"]');
              if(!search) {
                logger("Can not find search button");
                break;
              }
              await search.click();
              await delay(2000);
              let content = obj.usernameList;
              let randomIndex = getRandomInt(content.length);
              if(b.indexOf(randomIndex) == -1){
                b.push(randomIndex);
              } else {
                continue;
              }
              let randomString = content[randomIndex];
              await delay(2000);
              await page.keyboard.type(randomString, { delay: 100 });
              await delay(5000);
              let span = await getElements(page, '[role="dialog"] > div > div> div:nth-child(4) > div:nth-child(1) [role="link"] span');
              if(span){
                await span[0].click();
              } else {
                await search.click();
                await page.keyboard.down('Control'); 
                await page.keyboard.press('A');
                await page.keyboard.up('Control'); 
                await page.keyboard.press('Backspace');
                await delay(3000);
                attempt++;
              }
              if(attempt == content.length){
                break;
              }
          }
          await delay(randomDelay);
          let check = await getElement(page, 'div[role="presentation"]');
          if(check){
            await delay(2000);
            await clickReturn(page);
            logger("không có bài viết")
            await delay(5000);
            continue;
          }
          let posts = await getElements(page, 'a[role="link"] img');
          if(!posts) {
            await delay(2000);
            await clickReturn(page);
            logger("không tìm thấy bài viết");
            await delay(5000);
            continue;
          }
          let arr = [];
          for(let i = 0 ; i < posts.length; i++){
            const isLive = checkIsLive(page);
            if (!isLive) {
              return false;
            }
            posts = await getElements(page, 'a[role="link"] img');
              let randomIndex = getRandomIntBetween(1, posts.length);
              if(arr.indexOf(randomIndex) == -1){
                arr.push(randomIndex);
              } else {
                continue;
              }
            await page.evaluate((el) => {
               el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
            }, posts[randomIndex])
            await delay(5000);
            await posts[randomIndex].click();
            await delay(viewTime);
            if(numLikes > posts.length - 1){
              numLikes = posts.length - 1;
              logger("numLikes " + numLikes)
            }
            if(numShares > posts.length - 1){
              numShares = posts.length - 1;
              logger("numShares " + numShares)
            }
            if(numComments > posts.length - 1){
              numComments = posts.length - 1;
               logger("numComments "+ numComments);
            }
            if(obj.isLike == true && numLikes > 0){
              const likeBtn = await getElement(page, '[d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"]');
              if(likeBtn){
                await likeBtn.click();
                numLikes--;
                logger("còn phải like " + numLikes + " bài");
                await delay(randomDelay);
              }
            }
            if(obj.isShare == true && numShares > 0){
              const shareBtns = await getElements(page, '[points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"]');
              if(shareBtns){
                await shareBtns[shareBtns.length - 1].click();
                await delay(randomDelay);
                if(obj.typeShare == "randomShare"){
                  const isShare = await randomShare(page, obj);
                  if(isShare){
                    numShares--;
                    logger("còn phải share " + numShares + " bài")
                  } else {
                    await clickClose(page);
                    logger("share failed");
                    await delay(2000);
                  }
                }
                if(obj.typeShare == "user"){
                  const isShare = await userShare(page, obj);
                  if(isShare){
                    numShares--;
                    logger("còn phải share " + numShares + " bài")
                  } else {
                    await clickClose(page);
                    logger("share failed");
                    await delay(2000);
                  }
                }
              }
            }
            if(obj.isComment == true && numComments > 0){
              const commentBtn = await getElement(page, 'textarea');
              if(commentBtn){
                await commentBtn.click();
                await delay(3000);
                let content = obj.commentText;
                let randomString = content[getRandomInt(content.length)];
                await delay(2000);
                await page.keyboard.type(randomString, { delay: 100 });
                await delay(2000);
                await page.keyboard.press("Enter");
                await delay(randomDelay);
                numComments--;
                logger("còn phải comment " + numComments + " bài")
              }
            }
            await clickClose(page);
            await delay(3000);
          }
          await delay(2000);
          await clickReturn(page);
          await delay(2000);
          count++;
          await delay(2000);
          if(count == numAccounts) {
            isInteract = true;
          }
        }
      return isInteract;
    } catch (error){
        logger(error);
    }
}




const followInteraction = ${strSetting};
try {
  //Check obj start < end ? random(start,end) : random(end,start)
  let obj = await checkObject(followInteraction);
  // check page is live return -1, return 1, return 0
  const isLive = checkIsLive(page);
  if (!isLive) {
    return false;
  }

  await returnHomePage(page);
        await delay(3000);
        const elProfile = await getElement(page, "a span img");
        if(!elProfile) {
           logger(
            "Debug" + "|" + "Follow Interaction" + "|" + "Cannot find profile button"
          );
            return false;
        }
        await elProfile.click();
        await delay(6000);

    const a = await getElements(page, 'a[role="link"]');
    let hrefFollower = '';
    let hrefFollowing = '';
    for(let i = 5 ; i < a.length - 1; i++){
        let href = await page.evaluate((el) => {
            if(el.getAttribute('href').includes('followers')){
                return el.getAttribute('href')
            } else {
                return 0;
            }
        }, a[i]);
        if(href != 0) {
            hrefFollower = href;
            break;
        } else {
            continue;
        }
    }
    for(let i = 5 ; i < a.length - 1; i++){
        let href = await page.evaluate((el) => {
            if(el.getAttribute('href').includes('following')){
                return el.getAttribute('href')
            } else {
                return 0;
            }
        }, a[i]);
        if(href != 0) {
            hrefFollowing = href;
            break;
        } else {
            continue;
        }
    }

    if(obj.typeInteract === 'follower'){
        const followerBtn = await getElement(page, '[href = "' + hrefFollower + '"]');
        if(!followerBtn){
           logger(
            "Debug" + "|" + "Follow Interaction" + "|" + "Cannot find follower button"
          );
            return false;
        }
        await delay(2000);
        await followerBtn.click();
        await delay(5000);
        let numAccounts = getRandomIntBetween(obj.accountStart, obj.accountEnd);
        if(numAccounts == 0){
          return false;
        }
        const rs = await interactWithFollower(page, obj, numAccounts);
        if(rs){
          logger("đã tương tác đủ ");
        } else {
           logger(
            "Debug" + "|" + "Follow Interaction" + "|" + "Follower interaction failed"
          );
        }
        
    } 
    
    if(obj.typeInteract === 'following'){
       const followingBtn = await getElement(page, '[href = "' + hrefFollowing + '"]');
        if(!followingBtn){
          logger(
            "Debug" + "|" + "Follow Interaction" + "|" + "Cannot find following button"
          );
            return false;
        }
        await delay(2000);
        await followingBtn.click();
        await delay(5000);
        let numAccounts = getRandomIntBetween(obj.accountStart, obj.accountEnd);
        if(numAccounts == 0){
          return false;
        }
        const rs = await interactWithFollowing(page, obj, numAccounts);
        if(rs){
          logger("đã tương tác đủ ");
        } else {
          logger(
            "Debug" + "|" + "Follow Interaction" + "|" + "Following interaction failed"
          );
        }
    }

} catch (err) {
  logger(err);
}
    `;
};
