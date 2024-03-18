export const directMsg = (setting) => {
  const strSetting = `
      {
        typeDirectMSg: ${JSON.stringify(setting.typeDirectMSg)},
        numberStart: ${setting.numberStart},
        numberEnd: ${setting.numberEnd},
        typeNew: ${JSON.stringify(setting.typeNew)},
        UIDList: ${JSON.stringify(setting.userList)},
        messageList: ${JSON.stringify(setting.messageList)}
      }`;
  console.log(strSetting);
  return `
  
const accessChat = async page => {
    try {
      let chatEle = await selectorHref(page, "/direct/inbox/");
      await delay(getRandomIntBetween(1000, 3000));
      if (!chatEle) {
        chatEle = await getElement(
          page,
          '[d="M12.003 1.131a10.487 10.487 0 0 0-10.87 10.57 10.194 10.194 0 0 0 3.412 7.771l.054 1.78a1.67 1.67 0 0 0 2.342 1.476l1.935-.872a11.767 11.767 0 0 0 3.127.416 10.488 10.488 0 0 0 10.87-10.57 10.487 10.487 0 0 0-10.87-10.57Zm5.786 9.001-2.566 3.983a1.577 1.577 0 0 1-2.278.42l-2.452-1.84a.63.63 0 0 0-.759.002l-2.556 2.049a.659.659 0 0 1-.96-.874L8.783 9.89a1.576 1.576 0 0 1 2.277-.42l2.453 1.84a.63.63 0 0 0 .758-.003l2.556-2.05a.659.659 0 0 1 .961.874Z"]'
        );
        await delay(getRandomIntBetween(1000, 3000));
      }
      if (chatEle) {
        await clickElement(chatEle);
        await delay(getRandomIntBetween(1000, 3000));
        return true;
      } else {
        await navigateToUrl(page, "https://www.instagram.com/direct/inbox/");
        await delay(getRandomIntBetween(1000, 3000));
        return true;
      }
    } catch (error) {
      logger("Err access chat " + error.message);
      return false;
    }
  };
  
  const accessProfile = async (page, type) => {
    try {
      const profileEle = await getElement(page, 'span a [role="link"]');
      if (!profileEle) {
        logger("Err find profile button");
        return false;
      }
      await profileEle.click();
      await delay(getRandomIntBetween(3000, 5000));
      if (type === "following") {
        let followingEle = await selectorHref(page, "/following/");
        if (!followingEle) {
          logger("Err find following button");
          return false;
        }
        await clickElement(followingEle);
        await delay(getRandomIntBetween(3000, 5000));
        return true;
      }
      if (type === "follower") {
        let followersEle = await selectorHref(page, "/followers/");
        if (!followersEle) {
          logger("Err find followers button");
          return false;
        }
        await clickElement(followersEle);
        await delay(getRandomIntBetween(3000, 5000));
        return true;
      }
    } catch (error) {
      logger("Err access profile " + error.message);
      return false;
    }
  };
  
  const actionChatUser = async (page, directMsgObj, quantityChat, err) => {
    try {
      let countChat = 0;
      if (directMsgObj.UIDList.length > 0) {
        const quantityNeedChat =
          quantityChat < directMsgObj.UIDList.length
            ? quantityChat
            : directMsgObj.UIDList.length;
        const arrIdUser = directMsgObj.UIDList.sort(() => Math.random() - 0.5);
        for (let i = 0; i < quantityNeedChat; i++) {
          let msgNewEle = await getElement(
            page,
            '[d="M10.002 17.226H6.774v-3.228L18.607 2.165a1.417 1.417 0 0 1 2.004 0l1.224 1.225a1.417 1.417 0 0 1 0 2.004Z"]'
          );
          if (!msgNewEle) {
            msgNewEle = await getElement(
              page,
              '[class="xsag5q8 x7sb2j6"] [class="x6s0dn4 x78zum5 xdt5ytf xl56j7k"]'
            );
            if (!msgNewEle) {
              msgNewEle = await getElement(
                page,
                '[class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w x6s0dn4 x1swvt13 x1pi30zi x1cnzs8"] [role="button"]'
              );
            }
          }
          await delay(getRandomIntBetween(3000, 5000));
          if (msgNewEle) {
            await clickElement(msgNewEle);
            await delay(getRandomIntBetween(3000, 5000));
          }
          const searchEle = await getElement(page, '[name="queryBox"]');
          const closeEle = await getElement(
            page,
            '[points="20.643 3.357 12 12 3.353 20.647"]'
          );
          await delay(getRandomIntBetween(3000, 5000));
          if (searchEle) {
            await searchEle.type(arrIdUser[i], { delay: 200 });
            await delay(getRandomIntBetween(3000, 5000));
            const selectEle = await getElement(
              page,
              '[name="ContactSearchResultCheckbox"]'
            );
            await delay(getRandomIntBetween(3000, 5000));
            if (selectEle) {
              await clickElement(selectEle);
              await delay(getRandomIntBetween(3000, 5000));
              const chatUserEle = await getElement(
                page,
                '[class="x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh xw7yly9 xktsk01 x1yztbdb x1d52u69 x1uhb9sk x1plvlek xryxfnj x1c4vz4f x2lah0s xdt5ytf xqjyukv x1qjc9v5 x1oa3qoh x1nhvcw1"]'
              );
              if (chatUserEle) {
                await clickElement(chatUserEle);
                await delay(getRandomIntBetween(3000, 5000));
                const isChat = await actionChat(page, directMsgObj);
                if (isChat) {
                  countChat++;
                  logger("Done send " + countChat + " message");
                } else {
                  i--;
                  continue;
                }
              } else {
                logger("No select chat with user")
                await clickElement(closeEle);
              }
            } else {
              logger("No find person to chat")
              await clickElement(closeEle);
            }
          } else {
            logger("No find search element")
            await clickElement(closeEle);
          }
        }
        logger("Done direct message");
      } else {
        err["err"] = "Debug|DirectMessage|UserId is null. You need import ID"
        return     
      }
    } catch (error) {
      err["err"] = 'Debug|DirectMessage|Err action chat with user ' + error.message
      return
    }
  };
  
  const actionChatWithFollowing = async (
    page,
    directMsgObj,
    quantityChat,
    arrIndex,
    indexOfUID
  ) => {
    try {
      if (directMsgObj.typeNew === "random") {
        let followingEle = await getElements(
          page,
          '[class="_ap3a _aaco _aacw _aacx _aad7 _aade"]'
        );
        if (!followingEle) {
          followingEle = await getElements(page, '[class="_aarh"]');
        }
        await delay(getRandomIntBetween(3000, 5000));
       
        if (followingEle.length > 0) {
          let index = getRandomInt(followingEle.length);  
          const loopIndex = Math.ceil(quantityChat / followingEle.length);
          let isDuplicate = await checkDuplicate(arrIndex, index, loopIndex - 1);
          while (isDuplicate) {
            index = getRandomInt(followingEle.length);
            isDuplicate = await checkDuplicate(arrIndex, index, loopIndex - 1);
          }
          
          arrIndex.push(index);
          await followingEle[index].scrollIntoView({
            behavior: "smooth",
            // block: "center",
            inline: "center",
          });
          await delay(getRandomIntBetween(3000, 5000));
          await clickElement(followingEle[index]);
          await delay(getRandomIntBetween(3000, 5000));
          let messageEle = await getElement(
            page,
            '[class="x1i10hfl xjqpnuy xa49m3k xqeqjp1 x2hbi6w x972fbf xcfux6l x1qhh985 xm0m39n xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli xexx8yu x18d9i69 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x1lku1pv x1a2a7pz x6s0dn4 xjyslct x1lq5wgf xgqcy7u x30kzoy x9jhf4c x1ejq31n xd10rxx x1sy0etr x17r0tee x9f619 x1ypdohk x78zum5 x1f6kntn xwhw2v2 x10w6t97 xl56j7k x17ydfre x1swvt13 x1pi30zi x1n2onr6 x2b8uid xlyipyv x87ps6o x14atkfc xcdnw81 x1i0vuye x1gjpkn9 x5n08af xsz8vos"]'
          );
          if (!messageEle) {
            messageEle = await getElement(
              page,
              '[class="x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh x1i64zmx x1n2onr6 x6ikm8r x10wlt62 x1iyjqo2 x2lwn1j xeuugli xdt5ytf xqjyukv x1qjc9v5 x1oa3qoh x1nhvcw1"] [role="button"]'
            );
          }
          if (messageEle) {
            await delay(getRandomIntBetween(3000, 5000));
            await clickElement(messageEle);
            await delay(getRandomIntBetween(3000, 7000));
            const isChat = await actionChat(page, directMsgObj);
            if (isChat) {
              logger("Done send message");
              await delay(getRandomIntBetween(3000, 5000));
          
            }
          }
        } else {
          logger("Debug|DirectMessage|No following to direct message");
          return;
        }
      }
  
      if (directMsgObj.typeNew === "user") {
        let searchEle = await getElement(
          page,
          'input[class="x1lugfcp x19g9edo x1lq5wgf xgqcy7u x30kzoy x9jhf4c x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x5n08af x5yr21d x1a2a7pz xyqdw3p x1pi30zi xg8j3zb x1swvt13 x1yc453h xh8yej3 xhtitgo xs3hnx8 xoy4bel x7xwk5j xvs91rp xp001vz"]'
        );
        if (!searchEle) {
          searchEle = await getElement(
            page,
            '[class="xwib8y2 x1swvt13 x1pi30zi x1y1aw1k"] input'
          );
          if (!searchEle) {
            searchEle = await getElement(
              page,
              '[class="xwib8y2 x1swvt13 x1pi30zi x1y1aw1k"]'
            );
          }
        }
        if (searchEle) {
          await searchEle.type(directMsgObj.UIDList[indexOfUID], { delay: 200 });
          await delay(getRandomIntBetween(3000, 5000));
          let followingEle = await getElement(page, '[class="_ap3a _aaco _aacw _aacx _aad7 _aade"]');
          if (!followingEle) {
            followingEle = await getElement(
              page,
              '[class="_aarh"]'
            );
          }
          await delay(getRandomIntBetween(3000, 5000));
          if (followingEle) {
            await clickElement(followingEle);
            await delay(getRandomIntBetween(3000, 5000));
            let messageEle = await getElement(
              page,
              '[class="x1i10hfl xjqpnuy xa49m3k xqeqjp1 x2hbi6w x972fbf xcfux6l x1qhh985 xm0m39n xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli xexx8yu x18d9i69 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x1lku1pv x1a2a7pz x6s0dn4 xjyslct x1lq5wgf xgqcy7u x30kzoy x9jhf4c x1ejq31n xd10rxx x1sy0etr x17r0tee x9f619 x1ypdohk x78zum5 x1f6kntn xwhw2v2 x10w6t97 xl56j7k x17ydfre x1swvt13 x1pi30zi x1n2onr6 x2b8uid xlyipyv x87ps6o x14atkfc xcdnw81 x1i0vuye x1gjpkn9 x5n08af xsz8vos"]'
            );
            if (!messageEle) {
              messageEle = await getElement(
                page,
                '[class="x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh x1i64zmx x1n2onr6 x6ikm8r x10wlt62 x1iyjqo2 x2lwn1j xeuugli xdt5ytf xqjyukv x1qjc9v5 x1oa3qoh x1nhvcw1"] [role="button"]'
              );
            }
            if (messageEle) {
              await delay(getRandomIntBetween(3000, 5000));
              await clickElement(messageEle);
              await delay(getRandomIntBetween(3000, 7000));
              const isChat = await actionChat(page, directMsgObj);
              if (isChat) {
                logger("Done send message");
              }
              await delay(getRandomIntBetween(3000, 5000));
            }
          } else {
            logger("Debug|DirectMessage|No find following to direct message");
            return ;
          }
        }
      } 
    } catch (error) {
      logger("Debug|DirectMessage|Err action chat with user " + error.message);
      return ;
    }
  };
  
  const actionChatWithFollowers = async (
    page,
    directMsgObj,
    quantityChat,
    arrIndex,
    indexOfUID
  ) => {
    try {
      if (directMsgObj.typeNew === "random") {
        const listFollower = await getElements(
          page,
          '[class="x1i10hfl xjqpnuy xa49m3k xqeqjp1 x2hbi6w x972fbf xcfux6l x1qhh985 xm0m39n xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli xexx8yu x18d9i69 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x1lku1pv x1a2a7pz x6s0dn4 xjyslct x1lq5wgf xgqcy7u x30kzoy x9jhf4c x1ejq31n xd10rxx x1sy0etr x17r0tee x9f619 x1ypdohk x78zum5 x1f6kntn xwhw2v2 x10w6t97 xl56j7k x17ydfre x1swvt13 x1pi30zi x1n2onr6 x2b8uid xlyipyv x87ps6o x14atkfc xcdnw81 x1i0vuye x1gjpkn9 x5n08af xsz8vos"]'
        );
        const followingEle = await getElements(
          page,
          '[class="_ap3a _aaco _aacw _aacx _aad7 _aade"]'
        );
        await delay(getRandomIntBetween(3000, 5000));
        if (listFollower.length > 0 && followingEle.length > 0) {
          let index = getRandomInt(listFollower.length);
          const loopIndex = Math.ceil(quantityChat / listFollower.length);
          logger('loop', loopIndex)
          let isDuplicate = await checkDuplicate(arrIndex, index, loopIndex - 1);
          while (isDuplicate) {
            index = getRandomInt(listFollower.length);
            isDuplicate = await checkDuplicate(arrIndex, index, loopIndex -1 );
          }
          arrIndex.push(index);
          await followingEle[index].scrollIntoView({
            behavior: "smooth",
            // block: "center",
            inline: "center",
          });
          await delay(getRandomIntBetween(3000, 5000));
          await clickElement(followingEle[index]);
          await delay(getRandomIntBetween(3000, 5000));
          //follow back user
          const followBackEle = await getElement(
            page,
            'button[class=" _acan _acap _acas _aj1- _ap30"]'
          );
          await delay(getRandomIntBetween(3000, 5000));
          if (followBackEle) {
            await clickElement(followBackEle);
            await delay(getRandomIntBetween(3000, 5000));
          }
          //message of user
          let messageEle = await getElement(
            page,
            '[class="x1i10hfl xjqpnuy xa49m3k xqeqjp1 x2hbi6w x972fbf xcfux6l x1qhh985 xm0m39n xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli xexx8yu x18d9i69 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x1lku1pv x1a2a7pz x6s0dn4 xjyslct x1lq5wgf xgqcy7u x30kzoy x9jhf4c x1ejq31n xd10rxx x1sy0etr x17r0tee x9f619 x1ypdohk x78zum5 x1f6kntn xwhw2v2 x10w6t97 xl56j7k x17ydfre x1swvt13 x1pi30zi x1n2onr6 x2b8uid xlyipyv x87ps6o x14atkfc xcdnw81 x1i0vuye x1gjpkn9 x5n08af xsz8vos"]'
          );
          if (!messageEle) {
            messageEle = await getElement(
              page,
              '[class="x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh x1i64zmx x1n2onr6 x6ikm8r x10wlt62 x1iyjqo2 x2lwn1j xeuugli xdt5ytf xqjyukv x1qjc9v5 x1oa3qoh x1nhvcw1"] [role="button"]'
            );
          }
          if (messageEle) {
            await delay(getRandomIntBetween(3000, 5000));
            await clickElement(messageEle);
            await delay(getRandomIntBetween(3000, 7000));
            const isChat = await actionChat(page, directMsgObj);
            if (isChat) {
              logger("Done send message");
              await delay(getRandomIntBetween(3000, 5000));
            }
          }
        } else {
          logger("Debug|DirectMessage|No following to direct message");
          return;
        }
      }
  
      if (directMsgObj.typeNew === "user") {
        let searchEle = await getElement(
          page,
          'input[class="x1lugfcp x19g9edo x1lq5wgf xgqcy7u x30kzoy x9jhf4c x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x5n08af x5yr21d x1a2a7pz xyqdw3p x1pi30zi xg8j3zb x1swvt13 x1yc453h xh8yej3 xhtitgo xs3hnx8 xoy4bel x7xwk5j xvs91rp xp001vz"]'
        );
        if (!searchEle) {
          searchEle = await getElement(
            page,
            '[class="xwib8y2 x1swvt13 x1pi30zi x1y1aw1k"] input'
          );
          if (!searchEle) {
            searchEle = await getElement(
              page,
              '[class="xwib8y2 x1swvt13 x1pi30zi x1y1aw1k"]'
            );
          }
        }
        if (searchEle) {
          await searchEle.type(directMsgObj.UIDList[indexOfUID], { delay: 200 });
          await delay(getRandomIntBetween(3000, 5000));
          let followingEle = await getElement(
            page,
            '[class="_ap3a _aaco _aacw _aacx _aad7 _aade"]'
          );
          if (!followingEle) {
            followingEle = await getElement(page, '[class="_aarh"]');
          }
          await delay(getRandomIntBetween(3000, 5000));
          if (followingEle) {
            await clickElement(followingEle);
            await delay(getRandomIntBetween(3000, 5000));
            //follow back user
            const followBackEle = await getElement(
              page,
              'button[class=" _acan _acap _acas _aj1- _ap30"]'
            );
            await delay(getRandomIntBetween(3000, 5000));
            if (followBackEle) {
              await clickElement(followBackEle);
              await delay(getRandomIntBetween(3000, 5000));
            }
            //message of user
            let messageEle = await getElement(
              page,
              '[class="x1i10hfl xjqpnuy xa49m3k xqeqjp1 x2hbi6w x972fbf xcfux6l x1qhh985 xm0m39n xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli xexx8yu x18d9i69 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x1lku1pv x1a2a7pz x6s0dn4 xjyslct x1lq5wgf xgqcy7u x30kzoy x9jhf4c x1ejq31n xd10rxx x1sy0etr x17r0tee x9f619 x1ypdohk x78zum5 x1f6kntn xwhw2v2 x10w6t97 xl56j7k x17ydfre x1swvt13 x1pi30zi x1n2onr6 x2b8uid xlyipyv x87ps6o x14atkfc xcdnw81 x1i0vuye x1gjpkn9 x5n08af xsz8vos"]'
            );
            if (!messageEle) {
              messageEle = await getElement(
                page,
                '[class="x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh x1i64zmx x1n2onr6 x6ikm8r x10wlt62 x1iyjqo2 x2lwn1j xeuugli xdt5ytf xqjyukv x1qjc9v5 x1oa3qoh x1nhvcw1"] [role="button"]'
              );
            }
            if (messageEle) {
              await delay(getRandomIntBetween(3000, 5000));
              await clickElement(messageEle);
              await delay(getRandomIntBetween(3000, 7000));
              const isChat = await actionChat(page, directMsgObj);
              if (isChat) {
                logger("Done send message");
              }
              await delay(getRandomIntBetween(3000, 5000));
            }
          } else {
            logger("Debug|DirectMessage|No find following to direct message");
            return;
          }
        }
      } 
    } catch (error) {
      logger("Debug|DirectMessage|Err action chat with user " + error.message);
      return;
    }
  };
  
  const actionChat = async (page, directMsgObj) => {
    try {
      const contentMsg =
        directMsgObj.messageList[getRandomInt(directMsgObj.messageList.length)];
      let importMsgEle = await getElement(page, '[contenteditable="true"]');
      if (!importMsgEle) {
        importMsgEle = await getElement(page, '[class="xat24cr xdj266r"]');
      }
      await delay(getRandomIntBetween(3000, 5000));
      if (importMsgEle) {
        await importMsgEle.type(contentMsg, { delay: 200 });
        await delay(getRandomIntBetween(3000, 5000));
        const sendEle = await getElement(
          page,
          '[class="x1i10hfl xjqpnuy xa49m3k xqeqjp1 x2hbi6w xdl72j9 x2lah0s xe8uvvx xdj266r xat24cr x1mh8g0r x2lwn1j xeuugli x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x1lku1pv x1a2a7pz x6s0dn4 xjyslct x1ejq31n xd10rxx x1sy0etr x17r0tee x9f619 x1ypdohk x1f6kntn xwhw2v2 xl56j7k x17ydfre x2b8uid xlyipyv x87ps6o x14atkfc xcdnw81 x1i0vuye xjbqb8w xm3z3ea x1x8b98j x131883w x16mih1h x972fbf xcfux6l x1qhh985 xm0m39n xt0psk2 xt7dq6l xexx8yu x4uap5 x18d9i69 xkhd6sd x1n2onr6 x1n5bzlp x173jzuc x1yc6y37 xfs2ol5"]'
        );
        if (sendEle) {
          await clickElement(sendEle);
          await delay(getRandomIntBetween(3000, 5000));
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      logger("Err chat message " + error.message);
      return false;
    }
  };
  
  const checkDuplicate = async (arrID, ID, max = 1) => {
    // Đếm số lần xuất hiện của ID
    const idCount = {};
  
    for (let i = 0; i < arrID.length; i++) {
      const currentID = arrID[i];
      // Tang số lần xuất hiện
      idCount[currentID] = (idCount[currentID] || 0) + 1;
  
      // Neu vuot qua so bai post
      if (idCount[currentID] > max && currentID === ID) {
        return true;
      }
    }
  
    // Neu chua vuot qua
    return false;
  };
  
  const navigateToUrl = async (page, link) => {
    try {
      const url = await page.url();
      if (!url.includes(link)) {
        await page.goto(link, {
          waitUntil: "networkidle2",
        });
      } else {
        logger("Debug|DirectMessage|Can't navigate");
        return;
      }
    } catch (error) {
      logger("Debug|DirectMessage|Error navigating to URL: " + error.message);
      return;
    }
  };
  
  const selectorHref = async (page, namePage = "", indexHref) => {
    try {
      const href = await page.$$eval("a", links => links.map(a => a.href));
      if (href.length > 0) {
        const hrefPage = href.filter(e => e.includes(namePage));
        if (hrefPage.length > 0) {
          const index = indexHref ? indexHref : getRandomInt(hrefPage.length);
          const selector = '[href="'+hrefPage[index].replace(
            "https://www.instagram.com",
            ""
          )+'"]';
          const clickBtn = await getElement(page, selector);
          if (clickBtn) {
            return clickBtn;
          } else {
            return null;
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      logger("Err access page by href " + error.message);
      return false;
    }
  };
  let directMsgObj = ${strSetting};
  try {
    const isLive = await checkIsLive(page);
    if (!isLive) {
      logger("Debug|DirectMessage|Page is die");
      return;
    }
    await returnHomePage(page);
  await delay(2000);
    directMsgObj = await checkObject(directMsgObj);
    const quantityChat = getRandomIntBetween(
      directMsgObj.numberStart,
      directMsgObj.numberEnd
    );
    let errMsg = {}
    if (directMsgObj.typeDirectMSg === "user") {
      const isAccessChat = await accessChat(page);
      if (isAccessChat) {
        await actionChatUser(page, directMsgObj, quantityChat, errMsg);
        await delay(getRandomIntBetween(3000, 5000));
        if (errMsg.err) {
          logger(errMsg.err);
          return;
        }
      } else {
        logger("Debug|DirectMessage|Can not access chat");
        return;
      }
    } else if (directMsgObj.typeDirectMSg === "following") {
      if (directMsgObj.typeNew === "random") {
        let arrIndex = [];
        for (let i = 0; i < quantityChat; i++) {
          const isAccessProfile = await accessProfile(
            page,
            directMsgObj.typeDirectMSg
          );
          if (isAccessProfile) {
            await actionChatWithFollowing(page, directMsgObj, quantityChat, arrIndex);
            await delay(getRandomIntBetween(3000, 5000));
          } else {
            i--;
            continue;
          }
        }
        logger("Done direct message by random following")
      } else if (directMsgObj.typeNew === "user") {
        if (directMsgObj.UIDList.length < 1 || quantityChat < 1) {
          logger("Debug|DirectMessage|User id following is null or quanlity greater than one person. You need import uid or quantity person");
          return;
        }
        const quantityNeedChat =
          quantityChat < directMsgObj.UIDList.length
            ? quantityChat
            : directMsgObj.UIDList.length;
        for (let i = 0; i < quantityNeedChat; i++) {
          const isAccessProfile = await accessProfile(
            page,
            directMsgObj.typeDirectMSg
          );
          if (isAccessProfile) {
            await actionChatWithFollowing(page, directMsgObj, 0, [], i);
            await delay(getRandomIntBetween(3000, 5000));
          } else {
            i--;
            continue;
          }
        }
        logger("Done direct message by user following")
      } else {
        logger("Debug|DirectMessage|You need import type of following. Ex: random, user,...");
        return;
      }
    } else if (directMsgObj.typeDirectMSg === "follower") {
      if (directMsgObj.typeNew === "random") {
        let arrIndex = [];
        for (let i = 0; i < quantityChat; i++) {
          logger('check', arrIndex)
          const isAccessProfile = await accessProfile(
            page,
            directMsgObj.typeDirectMSg
          );
          if (isAccessProfile) {
            await actionChatWithFollowers(page, directMsgObj, quantityChat, arrIndex);
            await delay(getRandomIntBetween(3000, 5000));
          } else {
            i--;
            continue;
          }
        } 
        logger("Done direct message by random follower")
      } else if (directMsgObj.typeNew === "user") {

        if (directMsgObj.UIDList.length < 1 || quantityChat < 1) {
          logger("Debug|DirectMessage|User id follower is null or quanlity greater than one person. You need import uid or quantity person");
          return;
        }
        const quantityNeedChat =
          quantityChat < directMsgObj.UIDList.length
            ? quantityChat
            : directMsgObj.UIDList.length;
        
        for (let i = 0; i < quantityNeedChat; i++) {
          const isAccessProfile = await accessProfile(
            page,
            directMsgObj.typeDirectMSg
          );
          if (isAccessProfile) {
            await actionChatWithFollowers(page, directMsgObj, i);
            await delay(getRandomIntBetween(3000, 5000));
          } else {
            i--;
            continue;
          }
        }
        logger("Done direct message by user follower")
      } else {
        logger("Debug|DirectMessage|You need import type of followers. Ex: random, user,...");
        return;
      }
    } else {
      logger(
        "Debug|DirectMessage|You need import type of direct message. Ex: user, following,..."
      );
      return;
    }
  } catch (error) {
    logger("Debug|DirectMessage|Err direct message " + error.message);
    return;
  }
  `;
};
