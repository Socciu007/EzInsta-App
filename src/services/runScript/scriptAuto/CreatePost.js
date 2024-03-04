export const createPost = (setting) => {
  const strSetting = `
  {
    UID: ${JSON.stringify(setting.UID)},
    delayTimeEnd: ${setting.delayTimeEnd},
    delayTimeStart: ${setting.delayTimeStart},
    isTag:${setting.isTag},
    numberFriendTagEnd: ${setting.numberFriendTagEnd},
    numberFriendTagStart: ${setting.numberFriendTagStart},
    option: ${JSON.stringify(setting.option)},
    photoEnd: ${setting.photoEnd},
    photoStart: ${setting.photoStart},
    photos:${JSON.stringify(setting.photos)},
    postEnd: ${setting.postEnd},
    postStart: ${setting.postStart},
    text: ${JSON.stringify(setting.text)},
    typeTag: ${JSON.stringify(setting.typeTag)},
  }`;
  console.log(strSetting);
  return `
  const isElementVisible = async (page, element) => {
    try {
      // Evaluate if the element is visible by checking its bounding box
      const isElementVisible = await element.evaluate((el) => {
        const boundingBox = el.getBoundingClientRect();
        return (
          boundingBox.top >= 0 &&
          boundingBox.left >= 0 &&
          boundingBox.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          boundingBox.right <= (window.innerWidth || document.documentElement.clientWidth)
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
      const numberFriendTag = getRandomIntBetween(CreatePost.numberFriendTagStart, CreatePost.numberFriendTagEnd);
      if (numberFriendTag > 0) {
        const tagBtn = await findBtn(page, '󱤇');
        if (!(await isElementVisible(page, tagBtn))) {
          await scrollSmoothIfElementNotExistOnScreen(page, tagBtn);
          await delay(2000);
        }
        await clickElement(tagBtn);
        await delay(5000);

        const url = await page.url();
        if (url == 'https://m.facebook.com/') {
          if (CreatePost.typeTag === 'UIDList') {
            // Tag UID
            logger("Debug" + "|" + "Create post" + "|" + "Can't tag friend by UID!");
            // await tagFriendsByUIDList(page, CreatePost);
          } else {
            // tag random
            await tagFriendsRandomly(page, numberFriendTag);
          }
        }
        else{
          logger("Debug" + "|" + "Create post" + "|" + "Tag friend not success!");
          return false;
        }
  
        // Click "Done" button after tag
        if (
          (await checkExistElementOnScreen(
            page,
            '#screen-root > div > div.m.fixed-container.bottom > div > div.m.bg-s3 > div',
          )) === 0
        ) {
          const doneBtn = await getElement(
            page,
            '#screen-root > div > div.m.fixed-container.bottom > div > div.m.bg-s3 > div',
            5,
          );
          await clickElement(doneBtn);
          await delay(6000);
          return true;
        } else {
          logger("Debug" + "|" + "Create post" + "|" + "Can't find done tag!");
          return false;
        }
      } else {
        logger("Debug" + "|" + "Create post" + "|" + "Don't tag friend!");
      }
      return true;
    } catch (error) {
      logger(error);
      return false;
    }
  };
  const tagFriendsRandomly = async (page, numberFriendTag) => {
    try {
      let count = 0;
      let selector = 'div.m.bg-s3[data-action-id]';
      // Kiểm tra danh sách bạn bè
      const listFriend = await getElements(page, selector, 3);
      if (listFriend.length < 1) {
        selector = 'div.m.bg-s4[data-action-id]';
        listFriend = await getElements(page, selector, 3);
        if (listFriend.length < 1) {
          logger("Debug" + "|" + "Create post" + "|" + "Have not friend to tag");
          return false;
        }
      }
      let temp = [];
      logger('numberFriendTag', numberFriendTag);
      while (count < numberFriendTag) {
        // Chọn một bạn bè ngẫu nhiên từ danh sách và click vào
        let randomFriend = getRandomIntBetween(0, listFriend.length);
        let index = temp.indexOf(randomFriend);
        if (index == -1) {
          temp.push(randomFriend);
        } else {
          continue;
        }
        if (!(await isElementVisible(page, listFriend[randomFriend]))) {
          await scrollSmoothIfElementNotExistOnScreen(page, listFriend[randomFriend]);
          await delay(2000);
        }
        logger('randomFriend', randomFriend);
        await clickElement(listFriend[randomFriend]);
        logger('Clicked friend tag');
        await delay(3000);
        count++;
        await delay(5000);
      }
    } catch (err) {
      logger(err);
    }
  };
 
  const uploadImg = async (page, CreatePost) => {
    try {
      const numberPhoto =
        getRandomIntBetween(CreatePost.photoStart, CreatePost.photoEnd) > CreatePost.photos.length
          ? CreatePost.photos.length
          : getRandomIntBetween(CreatePost.photoStart, CreatePost.photoEnd);

      if (CreatePost.photos.length > 0 && numberPhoto > 0) {
        if (
          (await checkExistElementOnScreen(
            page,
            '#screen-root > div > div:nth-child(2) > div:nth-child(7) > div:nth-child(1)',
          )) === 0
        ) {
           let select = await findBtn(page, "󱢻");
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
              const [fileChooser] = await Promise.all([page.waitForFileChooser(), await clickElement(select)]);
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
      } else {
        logger('Debug' + '|' + 'Create post' + '|' + 'So anh random khong hop le!');
        return false;
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
        (await checkExistElementOnScreen(page, '#screen-root > div > div:nth-child(2) > div:nth-child(5) > div')) === 0
      ) {
        let inputTextSelector = '#screen-root > div > div:nth-child(2) > div:nth-child(5) > div > div';
        const InputTextContent = await getElement(page, inputTextSelector);
  
        if (CreatePost.text.length > 0) {
          const randomTextIndex = getRandomIntBetween(0, CreatePost.text.length);
          logger('randomTextIndex ' + randomTextIndex);
          await clickElement(InputTextContent);
          logger('Clicked input content');
          await InputTextContent.type(CreatePost.text[randomTextIndex], { delay: 150 });
          logger('Hoan tat nhap content');
          await delay(5000);
          return randomTextIndex;
        } else {
          logger("Debug" + "|" + "Create post" + "|" + "Text is empty!");
          return -1;
        }
      } else {
        logger("Debug" + "|" + "Create post" + "|" + "Can't input content!");
        return -1;
      }
    } catch (error) {
      logger(error);
      return -1;
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
    } catch (err) {
      logger(err);
    }
  };

  const object = ${strSetting}
  try {
    //Check obj start < end ? random(start,end) : random(end,start)
    let CreatePost = await checkObject(object);
    // check page is live reutrn -1, return 1, return 0
    const checkPageIsLive = checkIsLive(page);
    if (!checkPageIsLive) return -1;
    await returnHomePage(page);
    await delay(2000);
    let count = 0;
    const numberOfPost = getRandomIntBetween(CreatePost.postStart, CreatePost.postEnd);
    logger('can create ' + numberOfPost + 'bai');
    let arrContent = [];
    let countUploadImg = 0;
    let countTagFriend = 0;
    while (count < numberOfPost) {
      await returnHomePage(page);
      await delay(3000);

      if (
        (await checkExistElement(
          page,
          '#screen-root > div > div:nth-child(1) > div > div > div:nth-child(3) > div > div:nth-child(2) > div',
        )) != 0
      ) {
        const redictCreatePost = await getElement(
          page,
          '#screen-root > div > div:nth-child(1) > div > div > div:nth-child(3) > div > div:nth-child(2) > div',
        );

        await scrollSmoothIfNotExistOnScreen(
          page,
          '#screen-root > div > div:nth-child(1) > div > div > div:nth-child(3) > div > div:nth-child(2) > div',
        );
        await delay(3000);

        await clickElement(redictCreatePost);
        await delay(1000);

        // Text/photo
        if (CreatePost.option === 'text/photo') {
          const inputContentResult = await inputContent(page, CreatePost);
          if (inputContentResult != -1) {
            logger('Done input content');
          } else {
            logger("Debug" + "|" + "Create post" + "|" + "Can't input content!");
            return 0;
          }

          const uploadImgResult = await uploadImg(page, CreatePost);
          const checkImg = await getElements(page, '[class="img cover"][data-client-image="true"]');
          if (uploadImgResult && checkImg != null) {
            logger('Upload image successful');
          } else {
            logger("Debug" + "|" + "Create post" + "|" + "Can't upload image");

            countUploadImg++;
            if(countUploadImg >= 3) return 0;
            continue;
          }

          await delay(5000);
          // TAG
          if (CreatePost.isTag) {
            
            const rsTag = await tagFriend(page, CreatePost);
            if(rsTag){
              logger('Tag ban be thanh cong');
            }
            else{
              logger("Debug" + "|" + "Create post" + "|" + "Tag friend is not success!");
              countTagFriend++;
              if(countTagFriend >= 3) return 0;
              continue;
            }
          } else {
            logger('Khong tag ban be');
          }
        } else {
          await delay(5000);
          // Using background
          const background = await getElements(
            page,
            '#screen-root > div > div:nth-child(2) > div.m.hscroller.no-hscroller > div > div:nth-child(2)',
            5,
          );
          await delay(3000);
          const listBackground = [6, 8, 9, 10];
          let randomBackground = getRandomIntBetween(1, background.length);
          while (listBackground.includes(randomBackground)) {
            randomBackground = getRandomIntBetween(1, background.length);
          }
          if ((await checkExistElementOnScreen(page, background[randomBackground])) !== 0) {
            await background[randomBackground].evaluate((el) => {
              el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            });
            await delay(2000);
          }
          logger('randomBackground', randomBackground);
          await clickElement(background[randomBackground]);
          await delay(2000);
          const inputContentResult = await inputContent(page, CreatePost);

          if (inputContentResult != -1) {
            logger('Done input content');
          } else {
            logger("Debug" + "|" + "Create post" + "|" + "Can't input content!");

            return 0;
          }

          logger('arrContent', arrContent);

          if (inputContentResult === arrContent[0]) {
            logger('Content giong voi bai dang truoc do');
            continue;
          }

          // Nếu không trùng lặp, thêm vào mảng
          arrContent.unshift(inputContentResult);
        }
        // Click Post content
        let PostBtnSelector =
          '#screen-root > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > div > span';
        let PostBtn = await getElement(page, PostBtnSelector);

        if ((await checkExistElementOnScreen(page, PostBtnSelector)) !== 0) {
          PostBtnSelector = '#screen-root > div > div >div:nth-child(1) > div:nth-child(3) > div > div > span  ';
          PostBtn = await getElement(page, PostBtnSelector);
          if (!PostBtn) return 0;
        }
        await delay(5000);
        if (PostBtn) {
          await clickElement(PostBtn);
          logger('Da click post');
          await delay(5000);
        } else {
          logger("Debug" + "|" + "Create post" + "|" + "Button choose image is empty!");
          return 0;
        }
      } else {
        logger("Can't post status");
        break;
      }

      count++;
      logger('Creat post done');
      await delay(getRandomIntBetween(CreatePost.delayTimeStart, CreatePost.delayTimeEnd) * 1000);
    }
    return 1;
  } catch (error) {
    logger(error);
  }
`;
};
