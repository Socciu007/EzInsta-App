export const addFriend = (setting) => {
  const strSetting = `
      {
        option: ${JSON.stringify(setting.option)},
        requestsStart: ${setting.requestsStart},
        requestsEnd: ${setting.requestsEnd},
        postStart: ${setting.postStart},
        postEnd: ${setting.postEnd},
        delayTimeStart: ${setting.delayTimeStart},
        delayTimeEnd: ${setting.delayTimeEnd},
        delayTimeInteractStart: ${setting.delayTimeInteractStart},
        delayTimeInteractEnd: ${setting.delayTimeInteractEnd},
        isOnlyAddFriend: ${setting.isOnlyAddFriend},
        isLiked: ${setting.isLiked},
        isInteract: ${setting.isInteract},
        isComment: ${setting.isComment},
        stopTime: ${setting.stopTime},
        comment: ${JSON.stringify(setting.comment)},
        text:${JSON.stringify(setting.text)},
      }`;
  console.log(strSetting);
  return `
  const isButtonAboveScreen = async (page, selector) => {
    const buttonPosition = await page.evaluate(selector => {
        const element = document.querySelector(selector);
        if (!element) {
            return null; // Element not found
        }
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top,
            isVisible: rect.top >= 0 && rect.bottom <= window.innerHeight
        };
    }, selector);

    if (buttonPosition === null) {
        logger('Button not found.');
        return false;
    } else if (buttonPosition.top < 0) {
        return true;
    } else if (!buttonPosition.isVisible) {
        return false;
    } else {
        return false;
    }
}
  const addFriendBySuggest = async (page, addFriendObject) => {
    try {
      const isLive = checkIsLive(page);
          if (!isLive) {
            logger("Debug"+"|"+"Add friend"+"|"+"Page is not alive!")
            return false;
      }
      let randomDelay = getRandomIntBetween(addFriendObject.delayTimeStart * 1000, addFriendObject.delayTimeEnd * 1000);
      // check mutual
    let mutualSelector =
      "#screen-root > div > div:nth-child(2) > div> div.m.bg-s3 > div:nth-child(3)";
    let mutualElement = await getElements(page, mutualSelector, 10);
    if (mutualElement.length < 1) {
      mutualSelector =
        "#screen-root > div > div:nth-child(2) > div> div.m.bg-s4 > div:nth-child(3)";
      mutualElement = await getElements(page, mutualSelector, 10);
      if (!mutualElement){
        logger("Debug" + "|" + "Add friend" + "|" + "Can not find friend button");
        return false;
      } 
    }
      let isAddMutual = false;
      for (let i = 0; i < mutualElement.length; i++) {
        const isLive = checkIsLive(page);
          if (!isLive) {
            logger("Debug"+"|"+"Add friend"+"|"+"Page is not alive!")
            return false;
          }
        let randomIndex = getRandomInt(mutualElement.length);
        // add friend
        const addId = await page.evaluate((el) => {
          return el.parentNode.childNodes[3].getAttribute('data-action-id');
        }, mutualElement[randomIndex]);
        if (!addId) continue;
        const addBtn = await getElement(page, 'div[data-action-id="'+addId+'"]', 10);
        if (!addBtn) continue;
        if (addFriendObject.isOnlyAddFriend == true) {
          const isMutual = await page.evaluate((el) => {
            if(!el) return 0;
            if(!el.childNodes) return 0;
            return el.childNodes.length;
          }, mutualElement[randomIndex]);
          if (isMutual < 2) continue;
          const isAbove = await isButtonAboveScreen(page, 'div[data-action-id="'+addId+'"]');
          if(isAbove) {
            logger("button nằm ở trên viewport !");
            if (Math.random() <= 0.2) { 
              await scrollSmoothIfNotExistOnScreen(page, 'div[data-action-id="'+addId+'"]');
            } else {
              logger("Không click add!")
              continue;
            }
          } else {
            await scrollSmoothIfNotExistOnScreen(page, 'div[data-action-id="'+addId+'"]');
          }
          
          await delay(getRandomIntBetween(2000,4000));
          await clickElement(addBtn);
          await delay(randomDelay);
          isAddMutual = true;
          break;
        }
        if (addFriendObject.isOnlyAddFriend == false) {
          const isAbove = await isButtonAboveScreen(page, 'div[data-action-id="'+addId+'"]');
          if(isAbove) {
            logger("button nằm ở trên viewport !");
            if (Math.random() <= 0.2) { 
              await scrollSmoothIfNotExistOnScreen(page, 'div[data-action-id="'+addId+'"]');
            } else {
              continue;
            }
          } else {
            await scrollSmoothIfNotExistOnScreen(page, 'div[data-action-id="'+addId+'"]');
          }
          await delay(getRandomIntBetween(2000,4000));
          await clickElement(addBtn);
          await delay(randomDelay);
          isAddMutual = true;
          break;
        }
      }
      return isAddMutual;
    } catch (error) {
      logger(error);
      return false;
    }
  };
  const addFriendByKeyWord = async (page, addFriendObject) => {
  try {
          const isLive = checkIsLive(page);
          if (!isLive) {
            logger("Debug"+"|"+"Add friend"+"|"+"Page is not alive!")
            return false;
      }
    let randomDelay = getRandomIntBetween(
      addFriendObject.delayTimeStart * 1000,
      addFriendObject.delayTimeEnd * 1000
    );
    const addFriendSelector =
      "#screen-root > div > div:nth-child(2) > div > div > div > div > div:nth-child(2)";
      // scroll before click more button
    let temp = getRandomIntBetween(1, 3);
    logger("số lần scroll " + temp);
    await scrollSmooth(page, temp);
    let addBtns = await getElements(page, addFriendSelector, 5);
    if (!addBtns) {
      logger("Can not find any add buttons!");
      return false;
    }
    let isAdd = false;
    let arr = [];
    let newIndex = -1;
    for (let i = 0; i < addBtns.length; i++) {
      const isLive = checkIsLive(page);
      if (!isLive) {
            logger("Debug"+"|"+"Add friend"+"|"+"Page is not alive!")
            return false;
      }
      if (newIndex > i) continue;
      addBtns = await getElements(page, addFriendSelector, 5);
      let randomIndex = getRandomInt(addBtns.length);
      const addId = await page.evaluate((el) => {
        return el.parentNode.getAttribute("data-action-id");
      }, addBtns[i]);
      if (!addId) continue;
      const addSelector = 'div[data-action-id="' + addId + '"]';
      const addBtn = await getElement(page, addSelector, 10);
      if (!addBtn) continue;
      const isOnScreen = await checkExistElementOnScreen(page, addSelector);
      if (isOnScreen == 0) {
        if (arr.length == 3) {
          newIndex = i;
          break;
        }
        const addBtn = await getElement(page, addSelector, 10);
        if (!addBtn) continue;
        arr.push(addBtns[i]);
        logger("push to array");
      }
    }
    if (arr.length == 0){
      logger("Can not click friend element!");
      return false;
    } 
    let randomIndex = getRandomInt(arr.length);
    await delay(1000);
    await scrollSmoothIfElementNotExistOnScreen(page, arr[randomIndex]);
    await delay(1000);
    const url = await page.url();
    await delay(1000);
    await clickElement(arr[randomIndex]);
    await delay(randomDelay);
    const urlAfter = await page.url();
    if(url !== urlAfter) {
      const rs = await clickAddBtn(page);
      if (!rs) {
      await delay(3000);
      await clickReturn(page);
      logger("click return 1")
      await delay(1000);
      return isAdd;
    }
    await delay(3000);
    await clickReturn(page);
    logger("click return 2")
    await delay(2000);
    isAdd = true;
    }


    return isAdd;
  } catch (error) {
    logger(error);
    return false;
  }
};
  const addFriendByAcceptRequest = async (page, addFriendObject, mutualElements, listMutualFriend) => {
    try {
      const isLive = checkIsLive(page);
          if (!isLive) {
            logger("Debug"+"|"+"Add friend"+"|"+"Page is not alive!")
            return false;
      }
      let randomDelay = getRandomIntBetween(addFriendObject.delayTimeStart * 1000, addFriendObject.delayTimeEnd * 1000);
      let isAdd = false;
      if (addFriendObject.isOnlyAddFriend == true) {
          for(let i = 0; i < listMutualFriend.length; i++){
             let randomMutual = getRandomInt(listMutualFriend.length)
             let confirmId = await page.evaluate((el) => {
              return el.parentNode.childNodes[4].getAttribute('data-action-id');
             }, listMutualFriend[randomMutual]);
             if (!confirmId) continue;
             const confirmSelector = 'div[data-action-id="'+confirmId+'"]';
             const confirmBtn = await getElement(page, confirmSelector, 10);
             if (!confirmBtn) continue;
             await scrollSmoothIfElementNotExistOnScreen(page, confirmBtn);
             await delay(getRandomIntBetween(2000,4000));
             await clickElement(confirmBtn);
             await delay(randomDelay);
             isAdd = true;
             break;
          }
       }
      let arr = [];
      if (addFriendObject.isOnlyAddFriend == false) {
      for (let i = 0; i < mutualElements.length; i++) {
        let randomIndex = getRandomInt(mutualElements.length);
        let index = arr.indexOf(randomIndex);
        if (index == -1) {
          arr.push(randomIndex);
        } else {
          continue;
        }
        let confirmId = await page.evaluate((el) => {
          return el.parentNode.childNodes[4].getAttribute('data-action-id');
        }, mutualElements[randomIndex]);
        if (!confirmId) continue;
        logger(confirmId);
        const confirmSelector = 'div[data-action-id="'+confirmId+'"]';
        const confirmBtn = await getElement(page, confirmSelector, 10);
        if (!confirmBtn) continue;
        await scrollSmoothIfNotExistOnScreen(page, confirmSelector);
        await delay(getRandomIntBetween(2000,4000));
        await clickElement(confirmBtn);
        await delay(randomDelay);
        isAdd = true;
        break;
      }
    }
      return isAdd;
    } catch (error) {
      logger(error);
      return false;
    }
  };
  const scroll = async (page, addFriendObject) => {
    let randomScrollTime = getRandomIntBetween(3, 7);
    try {
      let randomDelay = getRandomIntBetween(addFriendObject.delayTimeStart * 1000, addFriendObject.delayTimeEnd * 1000);
      while (randomScrollTime > 0) {
        await page.evaluate(async () => {
          const getRandomIntBetween = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
          };
          const delay = async (time) => {
            return new Promise((resolve) => setTimeout(resolve, time));
          };
          const smoothScrollByStep = (targetPosition, duration) => {
            const startPosition = window.scrollY;
            const distance = targetPosition - startPosition;
            let startTime = null;
  
            const animation = (currentTime) => {
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
          let scrollAmount = getRandomIntBetween(400, 800);
          const targetPosition = window.scrollY + scrollAmount;
          let currentPosition = window.scrollY;
          if (currentPosition < targetPosition) {
            const durationPerStep = getRandomIntBetween(500, 1000);
            const nextPosition = Math.max(currentPosition + scrollAmount, targetPosition);
            smoothScrollByStep(nextPosition, durationPerStep);
            await delay(getRandomIntBetween(1000, 5000));
            await new Promise((resolve) => setTimeout(resolve, durationPerStep));
            currentPosition = nextPosition;
          }
        });
        randomScrollTime--;
      }
      await delay(randomDelay);
      console.log('Đã scroll xong');
    } catch (error) {
      console.log(error);
    }
  };
  
const randomComment = async (page, addFriendObject, commentBtns, temp) => {
    try {
      let randomDelay = getRandomIntBetween(
      addFriendObject.delayTimeInteractStart * 1000,
      addFriendObject.delayTimeInteractEnd * 1000,
    );
    let isClick = false;
    if (commentBtns.length > 0) {
      await scrollSmoothIfElementNotExistOnScreen(commentBtns[temp]);
      await delay(1000);
      await clickElement(commentBtns[temp]);
      temp++;
        await delay(2000);
        // find comment area
        const commentAreaSelector = 'textarea[type="text"]';
        const commentArea = await getElement(page, commentAreaSelector, 10);
        if (!commentArea) return {
          isClick: isClick,
          newIndex: temp
        };
        await delay(1000);
        await clickElement(commentArea);
        logger('Đã chọn vùng comment');
        // comment
        let content = addFriendObject.comment;
        let randomString = content[getRandomInt(content.length)];
        await delay(2000);
        await page.keyboard.type(randomString, { delay: 100 });
        await delay(2000);
        const postBtn = await findBtn(page, "󱛅");
        if (!postBtn || postBtn.length == 0) {
                logger("Debug" + "|" + "addFriendByUIDList" + "|" + "Can not find post button");
                return {
                  isClick: isClick,
                  newIndex: temp
                };
          };
        
        await delay(2000);
        await clickElement(postBtn[0]);
        await delay(randomDelay);
        // return home
        const returnSelector = '#screen-root > div > div > div > div > div.m.bg-s3 > div:nth-child(1)';
        const returnBtn = await getElement(page, returnSelector, 10);
        if (!returnBtn) return {
          isClick: isClick,
          newIndex: temp
        };
       await delay(getRandomIntBetween(2000,4000));
        await clickElement(returnBtn);
        isClick = true;
        await delay(3000);
    }
     return {
      isClick: isClick,
      newIndex: temp
    };
    } catch (error) {
     logger("Debug" + "|" + "Add friend by UID List" + "|" + "Comment failed!");
     return false;
    }
  };
  const randomLike = async (page, addFriendObject, likeBtns, temp) => {
    try {
        let randomDelay = getRandomIntBetween(
        addFriendObject.delayTimeInteractStart * 1000,
        addFriendObject.delayTimeInteractEnd * 1000,
      );
      if (likeBtns.length > 0) {
          await scrollSmoothIfElementNotExistOnScreen(page,likeBtns[temp]);
          await delay(1000);
          await clickElement(likeBtns[temp]);
          await delay(randomDelay);
      }
      return {
        isClick: true,
        newIndex: temp
      };
    } catch (error) {
      logger("Debug" + "|" + "Add friend by UID List" + "|" + "Like failed!");
      return false;
    }
  };
  const addFriendByUIDList = async (page, addFriendObject) => {
    try {
            const isLive = checkIsLive(page);
          if (!isLive) {
            logger("Debug"+"|"+"Add friend"+"|"+"Page is not alive!")
            return false;
      }
      let randomDelay = getRandomIntBetween(addFriendObject.delayTimeStart * 1000, addFriendObject.delayTimeEnd * 1000);
      if (addFriendObject.isInteract == true) {
        let numPosts = getRandomIntBetween(addFriendObject.postStart, addFriendObject.postEnd);
        if (addFriendObject.isLiked == true) {
          logger('Cần like ' + numPosts + ' bài');
          let count = 0;
          let temp = 0;
          for (let i = 0; i < numPosts * 2; i++) {
            try {
             let likeBtns = await findBtn(page, "󰍸");
          if (!likeBtns || likeBtns.length == 0) {
            likeBtns = await findBtn(page, "󰤥");
            if(!likeBtns || likeBtns.length == 0){
            logger("Can not find any like buttons");
            break;
            }
          };
              if(likeBtns.length < numPosts) numPosts = likeBtns.length;
              logger("có " + likeBtns.length + " nút like");
              const objLike = await randomLike(page, addFriendObject, likeBtns,temp);
              if (objLike.isClick == true) {
                count++;
                logger('Đã like được ' + count + ' bài');
              } else {
                logger('Like không thành công');
              }
              if (count == numPosts) {
                logger('Xong like !');
                break;
              }
              temp = objLike.newIndex;
              await delay(randomDelay);
            } catch (error) {
              logger(error);
            }
          }
        }
        if (addFriendObject.isComment == true) {
          let count = 0;
          let temp = 0;
          if (!addFriendObject.comment.length) {
            logger('Không thể comment với nội dung rỗng!');
            return false;
          }
          logger('Cần comment ' + numPosts + ' bài');
  
          for (let i = 0; i < numPosts * 2; i++) {
            try {
              const isLive = checkIsLive(page);
              if (!isLive) {
                logger("Debug"+"|"+"Add friend"+"|"+"Page is not alive!")
                return false;
              }
              let commentBtns = await findBtn(page, "󰍹");
              if (!commentBtns || commentBtns.length == 0) {
               commentBtns = await findBtn(page, "󰤦");
                if (!commentBtns || commentBtns.length == 0) {
                logger("Can not find any comment buttons");
                break;
              }
              };
              logger("có " + commentBtns.length + " nút comment");
              if(commentBtns.length < numPosts) numPosts = commentBtns.length;
              const objComment = await randomComment(page, addFriendObject, commentBtns, temp);
              if (objComment.isClick == true) {
                count++;
                logger('Đã comment được ' + count + ' bài');
              } else {
                logger('Comment không thành công');
              }
              if (count == numPosts) {
                logger('Xong comment!');
                break;
              }
              temp = objComment.newIndex;
              await delay(randomDelay);
            } catch (error) {
              logger(error);
            }
          }
        }
      }
      const rs = await clickAddBtn(page);
      await delay(2000);
      if (!rs) return false;
      return true;
    } catch (error) {
      logger(error);
      return false;
    }
  };
 const addFriendByGroupMember = async (page, addFriendObject) => {
  try {
      const isLive = checkIsLive(page);
          if (!isLive) {
            logger("Debug"+"|"+"Add friend"+"|"+"Page is not alive!")
            return false;
      }
    let randomDelay = getRandomIntBetween(
      addFriendObject.delayTimeStart * 1000,
      addFriendObject.delayTimeEnd * 1000
    );
    let numsAdd = getRandomIntBetween(
      addFriendObject.requestsStart,
      addFriendObject.requestsEnd
    );
    let urlPrev = await page.url();
    let groupSelector =
      "#screen-root > div > div:nth-child(2) > div:nth-child(4) > div.m.bg-s4 > div:nth-child(1)";
    let groupBtn = await getElement(page, groupSelector, 3);
    if (!groupBtn) {
      groupSelector =
        "#screen-root > div > div:nth-child(2) > div:nth-child(4) > div.m.bg-s3 > div:nth-child(1)";
      groupBtn = await getElement(page, groupSelector, 3);
      if (groupBtn) {
        await clickElement(groupBtn);
        logger("Click vào group")
        await delay(randomDelay);
      } else {
        let selectorGroup =
          "#screen-root > div > div:nth-child(2) > div:nth-child(4) > div:nth-child(2)";
        let groupInfor = await getElement(page, selectorGroup, 3);
        if(!groupInfor) { 
          groupInfor = await findBtn(page, "󱙺");
          if(!groupInfor || groupInfor.length == 0) {
            await page.goto(urlPrev + "info");
          } else {
            await clickElement(groupInfor[0]);
            await delay(3000);
          }
         } else {
          await clickElement(groupInfor);
          await delay(3000);
         };
        const iconSelector = "#screen-root > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div > div"
        let icon = await getElement(page, iconSelector, 10);
        if(!icon) {
          icon = await findBtn(page,"󱚼");
          if(icon.length > 0){
          logger("Group private ! Không kết bạn..."); 
          return false; 
          }
        } else {
          const isPrivate = await page.evaluate((el) => {
          return el.innerHTML.includes('󱚼');
          }, icon);
          if(isPrivate) {logger("Group private ! Không kết bạn..."); return false }
        };

        let numsMemberSelector =
          "#screen-root > div > div:nth-child(2) > div:nth-child(4) > div:nth-child(3) > div";
        let member = await getElement(page, numsMemberSelector, 10);
        await clickElement(member);
        await delay(randomDelay);
      }
    } else {
      await clickElement(groupBtn);
      await delay(randomDelay);
    }
    let count = 0;
    let isAdd = false;
    let arr = [];
    let urlAfter = await page.url();
    await delay(2000);
    if(urlAfter === urlPrev){
      logger("không chuyển trang");
      await page.goto(urlAfter + "info");
      await delay(2000);
      let icon = await findBtn(page,"󱚼");
          if(icon.length > 0){
          logger("Group private ! Không kết bạn..."); 
          return false; 
          } else {
            logger("Group public !")
            await page.goto(urlAfter + "members");
            await delay(2000);
          }
      
    }

    var url = urlPrev;
    for (let i = 0; i < numsAdd * 2; i++) {
      // click member
      const isLive = checkIsLive(page);
      if (!isLive) {
            logger("Debug"+"|"+"Add friend"+"|"+"Page is not alive!")
            return false;
      }
      const pageUrl = await page.url();
      if(!pageUrl.includes("members")){
         await page.goto(url + "members");
         await delay(3000);
      }
      const memberSelectors = "#screen-root > div > div:nth-child(2) > div > div > div:nth-child(2)";
      let allMember = await getElements(page, memberSelectors);
      if (!allMember) return false;
      logger("Member length: " + allMember.length);
        let randomIndex = getRandomIntBetween(1, allMember.length);
        let index1 = arr.indexOf(randomIndex);
        if (index1 == -1) {
          logger("push: " + randomIndex);
          arr.push(randomIndex);
        } else {
          continue;
        }
        await scrollSmoothIfElementNotExistOnScreen(page,allMember[randomIndex])
        await delay(1000);
        const urlPrev = await page.url();
        await clickElement(allMember[randomIndex]);
        await delay(1000);
        const urlAfter = await page.url();
        if(urlPrev === urlAfter){
          i--;
          continue;
        }
        await delay(3000);
      const rs = await clickAddBtn(page);
      if (!rs) {
        logger("Không click được nút add");
        await delay(1000);
        await clickReturn(page);
        await delay(1000);
        i--;
        continue;
      }
      count++;
      logger("Đã kết bạn với " + count + " người");
      if (count == numsAdd) {
        isAdd = true;
        break;
      }
      await delay(1000);
      await clickReturn(page);
      await delay(2000);
    }
    return isAdd;
  } catch (error) {
    logger(error);
    return false;
  }
};
 const addFriendByFriendOfFriend = async (page, addFriendObject) => {
  try {
          const isLive = checkIsLive(page);
          if (!isLive) {
            logger("Debug"+"|"+"Add friend"+"|"+"Page is not alive!")
            return false;
      }
    let randomDelay = getRandomIntBetween(
      addFriendObject.delayTimeStart * 1000,
      addFriendObject.delayTimeEnd * 1000
    );
    const fofSelector =
      "#screen-root > div > div:nth-child(2) > div:nth-child(7) > div";
    const fofElements = await getElements(page, fofSelector, 3);
    await delay(2000);
    if (!fofElements) {
      logger("Can not find friend !");
      return false
    };
    for(let i = 3; i <= fofElements.length; i++){
       const check = await page.evaluate((el) => {
          return el.childNodes.length;
        }, fofElements[i-1]);
        if(!check || check < 2) {
          logger("Không có danh sách bạn !");
          return false;
        } else {
          break;
        }
    }
    let randomIndex = getRandomIntBetween(3, fofElements.length);
    const fof = '#screen-root > div > div:nth-child(2) > div:nth-child(7) > div:nth-child(' + randomIndex +')';
    const fofBtn = await getElement(page, fof, 3);
    if (!fofBtn) return false;
    await scrollSmoothIfNotExistOnScreen(page, fof);
    await delay(1000);
    await clickElement(fofBtn);
    await delay(randomDelay);
    const rs = await clickAddBtn(page);
    await delay(3000)
    if (!rs) {
    await clickReturn(page);
    await delay(2000);
    return false;
    }
    await clickReturn(page);
    await delay(2000);
    return true;
  } catch (error) {
    logger(error);
    return error;
  }
};
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
  const clickAddBtn = async (page) => {
    try {
      const isAdded = await findBtn(page,"󱤈");
      if(isAdded.length != 0) {
        logger("Đã kết bạn từ trước");
        return false;
      }
      const isBtnAdd = await findBtn(page, "󱤇");
      logger(isBtnAdd);
      if(isBtnAdd.length != 0) {
        await scrollSmoothIfElementNotExistOnScreen(isBtnAdd[0]);
        await clickElement(isBtnAdd[0]);
        await delay(1000);
        logger('Add thành công');
        await delay(1000);
        return true;
      } else {
        const moreBtn = await findBtn(page, "󰟝");
        if(moreBtn.length != 0) {
          if(moreBtn.length == 1){
          await scrollSmoothIfElementNotExistOnScreen(moreBtn[0]);
          await clickElement(moreBtn[0]);
          } else {
          await scrollSmoothIfElementNotExistOnScreen(moreBtn[1]);
          await clickElement(moreBtn[1]);
          }
          
          await delay(1000);
          const addBtn = await findBtn(page, "󱤇");
          if(addBtn.length != 0) {
            await scrollSmoothIfElementNotExistOnScreen(addBtn[0]);
            await clickElement(addBtn[0]);
            await delay(1000);
            logger('Add thành công');
            await delay(2000);
            await clickReturn(page);
            return true;
          } else {
            await clickReturn(page);
            return false;
          }
        }
      }
    } catch (error) {
      logger(error);
      return false;
    }
  };
  const clickReturn = async (page) => {
  try {
    let returnBtn = await findBtn(page, "󱜳");

    if (!returnBtn || returnBtn.length == 0) {
        await page.goto(
        "https://m.facebook.com/friends/?target_pivot_link=friends"
      );
    }
    await clickElement(returnBtn[0]);
    await delay(1000);
  } catch (error) {
    logger(error);
  }
};
  try {
      const addFriendObj = ${strSetting}
    //Check obj start < end ? random(start,end) : random(end,start)
    await returnHomePage(page);
    let addFriendObject = await checkObject(addFriendObj);
    // check page is live reutrn -1, return 1, return 0
    const isLive = checkIsLive(page);
    logger('Tình trạng trang web: ' + isLive);
    if (!isLive) {
      logger("Debug"+"|"+"Add friend"+"|"+"Page is not alive!")
      return -1;
    }

    let numsAdd = getRandomIntBetween(addFriendObject.requestsStart, addFriendObject.requestsEnd);
    logger('Cần kết bạn với ' + numsAdd + ' người');
    let randomDelay = getRandomIntBetween(addFriendObject.delayTimeStart * 1000, addFriendObject.delayTimeEnd * 1000);
    await delay(randomDelay);
    if (addFriendObject.option == 'suggestions') {
      let count = 0;
      await returnHomePage(page);
      const friendRequestSelector = '#screen-root > div > div:nth-child(1) > div:nth-child(4) > div:nth-child(2)';
      const friendRequestBtn = await getElement(page, friendRequestSelector, 10);
      if (!friendRequestBtn) return false;
      await clickElement(friendRequestBtn);
      await delay(randomDelay);
            // scroll before click
      let temp = getRandomIntBetween(2, 4);
      await scrollSmooth(page,temp)
      for (let i = 0; i < numsAdd * 2; i++) {
        try {
          const isLive = checkIsLive(page);
          if (!isLive) {
            logger("Debug"+"|"+"Add friend"+"|"+"Page is not alive!")
            return false;
          }
          await delay(randomDelay);
          const isAddFriend = await addFriendBySuggest(page, addFriendObject);
          if (isAddFriend) {
            count++;
            logger('Đã kết bạn với ' + count + ' người bằng gợi ý');
          } else {
            logger('Kết bạn không thành công');
          }
          if (count == numsAdd) break;
        } catch (error) {
          logger(error);
        }
      }
    }
  
    if (addFriendObject.option == 'keywords') {
      let count = 0;
      let arr = [];
      await returnHomePage(page);
      // click and search
      const searchSelector =
        '#screen-root > div > div:nth-child(1) > div:nth-child(3) > div > div > div:nth-child(2) > div > div';
      let searchBtn = await getElement(page, searchSelector, 10);
      if (!searchBtn){
        searchBtn = await findBtn(page, "󱥊");
        if(!searchBtn || searchBtn.length == 0){
          await page.goto("https://m.facebook.com/search/");
          await delay(randomDelay);
        } else {
          await clickElement(searchBtn[0]);
          await delay(randomDelay);
        }
      } else {
      await clickElement(searchBtn);
      await delay(randomDelay);
      }
      
      // Enter text
      for(let i = 0; i < addFriendObject.text.length * 2; i++){
      const randomIndex = getRandomInt(addFriendObject.text.length);
      let index = arr.indexOf(randomIndex);
      if(index == -1){
        arr.push(randomIndex);
      } else {
        continue;
      }
      const keyword = addFriendObject.text[randomIndex];
      await page.keyboard.type(keyword, { delay: 100 });
      await delay(1000);
      await page.keyboard.press('Enter');
      await delay(randomDelay);
      // click everyone
      let peopleSelector =
        '#screen-root > div > div:nth-child(2) > div.m.hscroller.no-hscroller > div > div:nth-child(2)';
      let peopleBtn = await getElement(page, peopleSelector, 10);
      if (!peopleBtn) return false;
      await clickElement(peopleBtn);
      await delay(randomDelay);
      const glassIcon = await findBtn(page, "󰛼");
      if(glassIcon.length > 0){
        await page.goto("https://m.facebook.com/search/");
        await delay(2000);
      } else {
        break;
      }
      }
      
      for (let i = 0; i < numsAdd * 2; i++) {
        try {
          const isLive = checkIsLive(page);
          if (!isLive) {
            logger("Debug"+"|"+"Add friend"+"|"+"Page is not alive!")
            return false;
          }
          const isAddFriend = await addFriendByKeyWord(page, addFriendObject);
          if (isAddFriend) {
            count++;
            logger('Đã kết bạn với ' + count + ' người bằng keyword');
          } else {
            logger('Kết bạn không thành công');
          }
          if (count == numsAdd) break;
          await delay(5000);
        } catch (error) {
          logger(error);
        }
      }
    }
  
    if (addFriendObject.option == 'acceptFriendRequests') {
      let count = 0;
      let attempt = true;
      await returnHomePage(page);
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
      await delay(5000);
      const check = await checkExistElement(
        page,
        'img[src="https://static.xx.fbcdn.net/rsrc.php/v3/yi/r/9hZDJWHZ1Do.png"]',
        10
      );
      if (check == 1) {
        return false;
      }
      await delay(5000);
      const isMutualSelector = '#screen-root > div > div:nth-child(2) > div > div:nth-child(4)';
      const mutualElements = await getElements(page, isMutualSelector);
      let listMutualFriend = [];
      if (!mutualElements)
      {
          logger("Debug" + "|" + "Add friend by accept request" + "|" + "Add friend failed!");
         return false;
      }
      if(mutualElements.length < numsAdd) {
        numsAdd = mutualElements.length;
      }
      
      if (addFriendObject.isOnlyAddFriend == true) { 
        let numsMutual = 0;
        
        for( let i = 0 ; i < mutualElements.length; i++){
        const isMutual = await page.evaluate((el) => {
          if(!el) return 0;
          if(!el.childNodes) return 0;
            return el.childNodes.length;
          }, mutualElements[i]);
          if (isMutual < 1){
            continue;
          } else {
            numsMutual++;
            listMutualFriend.push(mutualElements[i]);
            logger("Add mutual to array");
          }
        }
      if(numsMutual == 0) {
        logger("Debug" + "|" + "Add friend by accept request" + "|" + "Do not have mutual friend request!");
        return false;
      }
      if(numsMutual < numsAdd){
         numsAdd = numsMutual;
      }
      }
      logger("numsAdd " + numsAdd);
      for (let i = 0; i < numsAdd * 2; i++) {
        try {
          const isLive = checkIsLive(page);
          if (!isLive) {
            logger("Debug"+"|"+"Add friend"+"|"+"Page is not alive!")
            return false;
          }
          const isAddFriend = await addFriendByAcceptRequest(page, addFriendObject, mutualElements, listMutualFriend);
          if (isAddFriend) {
            count++;
            logger('Đã kết bạn với ' + count + ' người bằng accept request');
          } else {
            logger('Kết bạn không thành công');
          }
          if (count == numsAdd) {
            await delay(2000);
            break;
          };
          await delay(3000);
        } catch (error) {
          logger(error);
        }
      }
    }
  
    if (addFriendObject.option == 'UIDList') {
      let count = 0;
      let UIDList = addFriendObject.text;
      if(UIDList.length < numsAdd) { 
        numsAdd = UIDList.length
      }
      for (let i = 0; i < numsAdd; i++) {
        try {
          const isLive = checkIsLive(page);
          if (!isLive) {
            logger("Debug"+"|"+"Add friend"+"|"+"Page is not alive!")
            return false;
          }
          await returnHomePage(page);
          let UID = UIDList[getRandomInt(UIDList.length)];
          await page.goto('https://m.facebook.com/profile.php/?id='+UID);
          await delay(randomDelay);
          const isAdded = await findBtn(page,"󱤈");
          if(isAdded.length != 0) {
            logger("Đã kết bạn từ trước");
            UIDList = UIDList.filter((e) => e !== UID);
            continue;
          }
          const isAddFriend = await addFriendByUIDList(page, addFriendObject);
          if (isAddFriend) {
            count++;
            logger('Đã kết bạn với ' + count + ' người bằng UID');
          } else {
            logger('Kết bạn không thành công');
          }
          if (count == numsAdd) break;
          UIDList = UIDList.filter((e) => e !== UID);
          await delay(3000);
        } catch (error) {
          logger(error);
        }
      }
    }
  
    if (addFriendObject.option == 'groupMembers') {
      let count = 0;
      let UIDList = addFriendObject.text;
      await returnHomePage(page);
      for (let i = 0; i < UIDList.length; i++) {
        try {
          const isLive = checkIsLive(page);
          if (!isLive) {
            logger("Debug"+"|"+"Add friend"+"|"+"Page is not alive!")
            return false;
          }
          let UID = UIDList[i];
          await page.goto('https://m.facebook.com/groups/' + UID);
          await delay(4000);
          const isAddFriend = await addFriendByGroupMember(page, addFriendObject);
          if (isAddFriend) {
            count++;
            logger('Đã kết bạn trong ' + count + ' nhóm bằng group member');
          } else {
            logger('Kết bạn không thành công');
          }
          if (count == UIDList.length) {
            await delay(2000);
            break;
          };
          await delay(3000);
        } catch (error) {
          logger(error);
        }
      }
    }
  
    if (addFriendObject.option == 'friendOfFriends') {
      let count = 0;
      // check is in homepage
      await returnHomePage(page);
      const friendRequestSelector = '#screen-root > div > div:nth-child(1) > div:nth-child(4) > div:nth-child(2)';
      const friendRequestBtn = await getElement(page, friendRequestSelector, 3);
      if (!friendRequestBtn) return false;
      await clickElement(friendRequestBtn);
      await delay(2000);
      // see your friends
      const yourFriendSelector = '#screen-root > div > div:nth-child(2) > div:nth-child(4) > div > div:nth-child(2)';
      const yourFriendBtn = await getElement(page, yourFriendSelector, 10);
      if (!yourFriendBtn) return false;
      await clickElement(yourFriendBtn);
      await delay(2000);
      let index = 0;
      for (let i = 0; i < numsAdd * 2; i++) {
        try {
          const isLive = checkIsLive(page);
          if (!isLive) {
            logger("Debug"+"|"+"Add friend"+"|"+"Page is not alive!")
            return false;
          }
          const url = await page.url();
          if (
            url ===
              "https://m.facebook.com/friends/?target_pivot_link=friends" ||
            url.includes(
              "https://m.facebook.com/friends/?target_pivot_link=friends"
            )
          ) {
            logger("URL is correct");
          } else {
            await page.goto(
              "https://m.facebook.com/friends/?target_pivot_link=friends",
              {
                waitUntil: "networkidle2",
              }
            );
            logger("Redirect to list friend");
          }
    // scroll before click more button
    let temp = getRandomIntBetween(1, 3);
    logger("số lần scroll " + temp);
    await scrollSmooth(page,temp);
    await delay(1000);
          // get all friends
          let friendSelector =
            "#screen-root > div > div:nth-child(2) > div > div.m.bg-s3";
          let friendBtns = await getElements(page, friendSelector);
          if (!friendBtns) {
            friendSelector =
              "#screen-root > div > div:nth-child(2) > div > div.m.bg-s4";
            friendBtns = await getElements(page, friendSelector);
            if (!friendBtns) {
              logger("Can not find friend buttons")
              return false;
            }
          }
          let arr= [];
          for (let i = index; i < friendBtns.length; i++) {
            // choose one random friend
            const friendId = await page.evaluate((el) => {
              return el.getAttribute('data-action-id');
            }, friendBtns[i]);
            if(!friendId) continue;
            // check this friend is on screen
            const check = await checkExistElementOnScreen(page, 'div[data-action-id="'+friendId+'"]');
            if (check == 0) {
              if (arr.length == 3) {
                index = i;
                break;
              }
              const friendBtn = await getElement(page, 'div[data-action-id="'+friendId+'"]', 10);
              if (!friendBtn) continue;
              arr.push(friendBtn);
              logger("push to array");
              await delay(1000);
            }
          }
      if (arr.length < 3) return false;
      let randomIndex = getRandomInt(arr.length);
        await delay(1000);
       const nameFriend =  await page.evaluate((el) => {
              return el.childNodes[1].click();
        }, arr[randomIndex]);
        await delay(1000);
          const isAddFriend = await addFriendByFriendOfFriend(page, addFriendObject);
          if (isAddFriend) {
            count++;
            await clickReturn(page);
            logger('Đã kết bạn với ' + count + ' người bằng friend of friend');
          } else {
            await clickReturn(page);
            logger('Kết bạn không thành công');
          }
          if (count == numsAdd) break;
          await delay(3000);
        } catch (error) {
          logger(error);
        }
      }
    }
  
    if (addFriendObject.option == 'friendOfUID') {
      let count = 0;
      let UIDList = addFriendObject.text;
      for (let i = 0; i < numsAdd * 2; i++) {
        try {
          const isLive = checkIsLive(page);
          if (!isLive) {
            logger("Debug"+"|"+"Add friend"+"|"+"Page is not alive!")
            return false;
          }
          await returnHomePage(page);
          await delay(randomDelay);
          let UID = UIDList[getRandomInt(UIDList.length)];
          await page.goto('https://m.facebook.com/profile.php/?id='+UID);
          await delay(randomDelay);
          const isAddFriend = await addFriendByFriendOfFriend(page, addFriendObject);
          if (isAddFriend) {
            count++;
            logger('Đã kết bạn với ' + count + ' người bằng friend of UID');
          } else {
            logger('Kết bạn không thành công');
          }
          if (count == numsAdd) break;
          await delay(3000);
        } catch (error) {
          logger(error);
        }
      }
    }
  } catch (err) {
    logger(err);
  }

  
    `;
};
