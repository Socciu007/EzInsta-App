export const createPostGroup = (setting) => {
  const strSetting = `
      {             
        postStart: ${setting.postStart},
        postEnd: ${setting.postEnd},
        delayTimeStart: ${setting.delayTimeStart},
        delayTimeEnd: ${setting.delayTimeEnd},
        option: ${JSON.stringify(setting.option)},
        text:  ${JSON.stringify(setting.text)},
        photos:  ${JSON.stringify(setting.photos)},
        photoStart: ${setting.photoStart},
        photoEnd:${setting.photoEnd},
        isTag: ${setting.isTag},
        typeTag:  ${JSON.stringify(setting.typeTag)},
        numberFriendTagStart: ${setting.numberFriendTagStart},
        numberFriendTagEnd: ${setting.numberFriendTagEnd},
        UID: ${JSON.stringify(setting.UID)},
        UIDGroup: ${JSON.stringify(setting.UIDGroup)},
      }`;
  console.log(strSetting);
  return `
const tagFriendsRandomly = async (page, numberFriendTag) => {
  try {
    let count = 0;
    let selector = "div.m.bg-s3[data-action-id]";
    // Kiểm tra danh sách bạn bè
    let listFriend = await getElements(page, selector, 3);
    if (!listFriend) {
      selector = "div.m.bg-s4[data-action-id]";
      listFriend = await getElements(page, selector, 3);
      if (!listFriend) return false;
    }
    let temp = [];
    for (let i = 0; i < numberFriendTag * 2; i++) {
      const isLive = checkIsLive(page);
          if (!isLive) {   
            return false;
          }
      // Chọn một bạn bè ngẫu nhiên từ danh sách và click vào
      let randomFriend = getRandomIntBetween(0, listFriend.length);
      let index = temp.indexOf(randomFriend);
      if (index == -1) {
        temp.push(randomFriend);
      } else {
        continue;
      }
      await scrollSmoothIfElementNotExistOnScreen(page, listFriend[randomFriend]);
      await delay(1000);
      await clickElement(listFriend[randomFriend]);
      logger("Tag thành công");
      count++;
      await delay(3000);
      if (count == numberFriendTag) {
        return true;
      }
    }
    return false;
  } catch (err) {
    logger(err);
  }
};
const isElementVisible = async (page, element) => {
  try {
    // Evaluate if the element is visible by checking its bounding box
    const isElementVisible = await element.evaluate((el) => {
      const boundingBox = el.getBoundingClientRect();
      return (
        boundingBox.top >= 0 &&
        boundingBox.left >= 0 &&
        boundingBox.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        boundingBox.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    });
    return isElementVisible;
  } catch (error) {
    return false;
  }
};
const tagFriend = async (page, CreatePost) => {
  // TAG
  try {
    const numberFriendTag = getRandomIntBetween(
      CreatePost.numberFriendTagStart,
      CreatePost.numberFriendTagEnd
    );
    if (numberFriendTag > 0) {
      let tagBtn = await findBtn(page, "󰤇");
      if(!tagBtn || tagBtn.length == 0) {
        tagBtn = await findBtn(page, "󱤇");
      }
      await scrollSmoothIfElementNotExistOnScreen(page, tagBtn);
      await delay(1000);
      await clickElement(tagBtn);
      await delay(2000);
      if (CreatePost.typeTag === "UIDL") {
        // Tag UID
        logger("Không tag bằng UID");
        // await tagFriendsByUIDList(page, CreatePost);
      } else {
        // tag random
        const rs = await tagFriendsRandomly(page, numberFriendTag);
        if (!rs) return false;
      }
      // Click "Done" button after tag
      let doneSelector =
        "#screen-root > div > div.m.fixed-container.bottom > div > div.m.bg-s4 > div";
      let doneBtn = await getElement(page, doneSelector);
      if (!doneBtn) {
        doneSelector =
          "#screen-root > div > div.m.fixed-container.bottom > div > div.m.bg-s3 > div";
        doneBtn = await getElement(page, doneSelector);
        if (!doneBtn) return false;
      }
      if ((await checkExistElementOnScreen(page, doneSelector)) === 0) {
        await clickElement(doneBtn);
        await delay(6000);
        return true;
      } else {
        logger("Không thể nhấn Done");
        return false;
      }
    } else {
      logger("Không chọn tag bạn bè");
    }
    return true;
  } catch (error) {
    logger(error);
    return false;
  }
};
const uploadImg = async (page, CreatePost) => {
    try {
      const numberPhoto =
        getRandomIntBetween(CreatePost.photoStart, CreatePost.photoEnd) > CreatePost.photos.length
          ? CreatePost.photos.length
          : getRandomIntBetween(CreatePost.photoStart, CreatePost.photoEnd);
      logger(numberPhoto);
      if(CreatePost.photos.length == 0) {
        logger("Không thấy nguồn ảnh");
        return true;
      }
      if (CreatePost.photos.length > 0 && numberPhoto > 0) {
        if (
          (await checkExistElementOnScreen(
            page,
            '#screen-root > div > div:nth-child(2) > div:nth-child(7) > div:nth-child(1)',
          )) === 0
        ) {
          let select = await findBtn(page, "󰘄");
          if(!select || select.length == 0) return false;
          let arrImg = [];
          for (let i = 0; i < numberPhoto; i++) {
            const isLive = checkIsLive(page);
            if (!isLive) {
            return false;
            }
            let randomImg = getRandomIntBetween(0, CreatePost.photos.length);
            arrImg.push(CreatePost.photos[randomImg]);
            if (select) {
              const [fileChooser] = await Promise.all([page.waitForFileChooser(), clickElement(select)]);
              await fileChooser.accept(arrImg);
              await delay(10000);
              arrImg = [];
            } else {
              return false;
            }
          }
        } else {
          logger('Debug' + '|' + 'Create post' + '|' + "Can't find click photo btn!");
          return false;
        }
      }
      return true;
    } catch (error) {
      logger(error);
      return false;
    }
  };
  
const inputContent = async (page, CreatePost) => {
  try {
    // Input text
    if (
      (await checkExistElementOnScreen(
        page,
        "#screen-root > div > div:nth-child(2) > div:nth-child(5) > div"
      )) === 0
    ) {
      let inputTextSelector =
        "#screen-root > div > div:nth-child(2) > div:nth-child(5) > div > div";
      const InputTextContent = await getElement(page, inputTextSelector);
      if (CreatePost.text.length > 0) {
        const randomTextIndex = getRandomIntBetween(0, CreatePost.text.length);
        logger("randomText: " + randomTextIndex);
        await clickElement(InputTextContent);
        await delay(1000);
        await InputTextContent.type(CreatePost.text[randomTextIndex], {
          delay: 100,
        });
        await delay(5000);
        return true;
      } else {
        logger("Nội dung rỗng");
        return false;
      }
    } else {
      logger("Không nhập được nội dung");
      return false;
    }
  } catch (error) {
    logger(error);
    return false;
  }
};
const findBtn = async (page, content) => {
  try {
    const buttons = await getElements(page, '[class="native-text"]');
    for (let i = 0; i < buttons.length; i++) {
      const btn = await page.evaluate((el) => {
        return el.innerHTML;
      }, buttons[i]);
      if (btn.includes(content)) {
        return buttons[i];
      }
    }
    return false;
  } catch (err) {
    logger(err);
  }
};
const createPost = async (page, CreatePost) => {
  try {
    let isFillInput = false;
    let isCreatePost = false;
    let count = 0;
    const numberOfPost = getRandomIntBetween(
      CreatePost.postStart,
      CreatePost.postEnd
    );
    const randomDelay = getRandomIntBetween(
      CreatePost.delayTimeStart * 1000,
      CreatePost.delayTimeEnd * 1000
    );
    logger("Cần đăng " + numberOfPost + " bài");
    for (let i = 0; i < numberOfPost * 2; i++) {
            const isLive = checkIsLive(page);
          if (!isLive) {
            return false;
      }
      // click post area in group
      let postAreaSelector =
        "#screen-root > div > div:nth-child(2) > div:nth-child(6) > div:nth-child(2) > div";
      let postArea = await getElement(page, postAreaSelector, 2);
      if (!postArea) {
         postAreaSelector =
        "#screen-root > div > div:nth-child(2) > div:nth-child(6) > div:nth-child(1) > div:nth-child(2)";
        postArea = await getElement(page, postAreaSelector, 2);
        if(!postArea) {
          postArea = await findBtn(page, "...");
          if(postArea == false) {
            logger("Debug" + "|" + "Create post group" + "|" + "Can not find post area!");
            return false;
          }
        }
      };
      await delay(3000);
      await scrollSmoothIfElementNotExistOnScreen(page, postArea);
      await delay(1000);
      await clickElement(postArea);
      await delay(3000);
        // Text/photo
        if (CreatePost.option === "text/photo") {
          const rs = await inputContent(page, CreatePost);
          if (rs) {
            logger("Nhập xong nội dung !");
          } else {
            logger("Không thể nhập nội dung");
            break;
          }
          const uploadImgResult = await uploadImg(page, CreatePost);
          if (uploadImgResult) {
            logger("Tải ảnh lên thành công");
          } else {
            logger("Không thể tải ảnh lên");
            break;
          }
          await delay(4000);
          // TAG
          if (CreatePost.isTag) {
            const rs = await tagFriend(page, CreatePost);
            if (!rs) break;
          }
          isFillInput = true;
        } else {
          await delay(2000);
          const rs = await inputContent(page, CreatePost);
          if (rs) {
            logger("Nhập xong nội dung !");
          } else {
            logger("Không thể nhập nội dung");
            break;
          }
          
        
          await delay(2000);
          const scrollX = await page.evaluate(() => window.scrollX);
          await page.mouse.click(scrollX , 100);
          await delay(1000);

          // Using background
          const background = await getElements(
            page,
            "#screen-root > div > div:nth-child(2) > div.m.hscroller.no-hscroller > div > div:nth-child(2)",
            5
          );
          await delay(2000);
          const randomBackground = getRandomIntBetween(1, background.length);
          if (
            (await checkExistElementOnScreen(
              page,
              background[randomBackground]
            )) !== 0
          ) {
            await background[randomBackground].evaluate((el) => {
              el.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center",
              });
            });
            await delay(2000);
          }
          await clickElement(background[randomBackground]);
          await delay(2000);
          isFillInput = true;
        }
        if (isFillInput == false) break;
        // Click Post content
        const PostBtn = await getElement(
          page,
          "#screen-root > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > div > span"
        );
        if (
          (await checkExistElementOnScreen(
            page,
            "#screen-root > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > div > span"
          )) !== 0
        ) {
          await PostBtn.evaluate((el) => {
            el.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "nearest",
            });
          });
          await delay(2000);
        }
        if (PostBtn) {
          await delay(1000);
          await clickElement(PostBtn);
          count++;
          logger("Đăng thành công " + count + " bài");
          isCreatePost = true;
          await delay(5000);
        } else {
          logger("Button choose image is empty");
          break;
        }
      
      if (count == numberOfPost) break;
      await delay(randomDelay);
    }
    return isCreatePost;
  } catch (error) {
    logger(error);
    return false;
  }
};  
 const createPostObj = ${strSetting};
 try {
    //Check obj start < end ? random(start,end) : random(end,start)
    let CreatePost = await checkObject(createPostObj);
    // check page is live return -1, return 1, return 0
    const checkPageIsLive = checkIsLive(page);
    if (!checkPageIsLive) return false;
    await returnHomePage(page);
    await delay(2000);
    const randomDelay = getRandomIntBetween(
      CreatePost.delayTimeStart * 1000,
      CreatePost.delayTimeEnd * 1000
    );
    let count = 0;
    let UIDList = CreatePost.UIDGroup;
    for (let i = 0; i < UIDList.length; i++) {
      try {
        const isLive = checkIsLive(page);
          if (!isLive) {
            logger("Debug"+"|"+"Create post group"+"|"+"Page is not alive!")
            return false;
        }
        let UID = UIDList[i];
        await page.goto('https://m.facebook.com/groups/' + UID);
        await delay(5000);
        const rs = await createPost(page, CreatePost);
        if (rs) {
          count++;
          logger("Đã đăng bài thành công trong " + count + " nhóm");
        } else {
          logger("Đăng bài trong nhóm không thành công");
        }
        if (count == UIDList.length) break;
        await delay(randomDelay);
      } catch (error) {
        logger(error);
      }
    }
  } catch (error) {
    logger(error);
  }
  `;
};
