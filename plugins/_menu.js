const plugins = require("../lib/plugins");
const { exbot, isPrivate, clockString } = require("../lib");
const { OWNER_NAME, BOT_NAME } = require("../config");
const { hostname, uptime } = require("os");
exbot(
  {
    pattern: "menu",
    fromMe: isPrivate,
    desc: "Show All commands",
    dontAddCommandList: true,
    type:"user",
  },
  async (message, match) => {
    if (match) {
      for (let i of plugins.commands) {
        if (i.pattern.test(message.prefix + match))
          message.reply(
            `\`\`\`exbot : ${message.prefix}${match.trim()}
Description : ${i.desc}\`\`\``
          );
      }
    } else {
      let { prefix } = message;
      let [date, time] = new Date()
        .toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
        .split(",");
      let menu = `╭━━━━━ᆫ ${BOT_NAME} ᄀ━━━
┃ ⎆  *OWNER* :  ${OWNER_NAME}
┃ ⎆  *PREFIX* : ${prefix}
┃ ⎆  *HOST NAME* :${hostname().split("-")[0]}
┃ ⎆  *DATE* : ${date}
┃ ⎆  *TIME* : ${time}
┃ ⎆  *COMMANDS* : ${plugins.commands.length} 
┃ ⎆  *UPTIME* : ${clockString(uptime())} 
╰━━━━━━━━━━━━━━━
╭╼╾╼╾╼╾╼╾╼╾╼╾╼╾╼\n╽`;
      let cmnd = [];
      let cmd;
      let category = [];
      plugins.commands.map((exbot, num) => {
        if (exbot.pattern) {
          cmd = exbot.pattern
            .toString()
            .match(/(\W*)([A-Za-züşiğ öç1234567890]*)/)[2];
        }

        if (!exbot.dontAddCommandList && cmd !== undefined) {
          let type;
          if (!exbot.type) {
            type = "misc";
          } else {
            type = exbot.type.toLowerCase();
          }

          cmnd.push({ cmd, type: type });

          if (!category.includes(type)) category.push(type);
        }
      });
      cmnd.sort();
      category.sort().forEach((cmmd) => {
        menu += `
┃  ╭─────────────◆
┃  │ ⦿---- ${cmmd} ----⦿
┃  ╰┬────────────◆
┃  ┌┤`;
        let comad = cmnd.filter(({ type }) => type == cmmd);
        comad.forEach(({ cmd }, num) => {
          menu += `\n┃  │ ⛥  ${cmd.trim()}`;
        });
        menu += `\n┃  ╰─────────────◆`;
      });

      menu += ` ╰━━━━━━━━━━━──⊷\n`;
      menu += `_🔖Send ${prefix}menu <exbot name> to get detailed information of specific exbot._\n*📍Eg:* _${prefix}menu plugin_`;
      return await message.sendMessage(menu);
    }
  }
);

exbot(
  {
    pattern: "list",
    fromMe: isPrivate,
    desc: "Show All commands",
    type:"user",
    dontAddCommandList: true,
  },
  async (message, match, { prefix }) => {
    let menu = `╭───〔 ${tiny("x-asena exbot list")} 〕────\n`;

    let cmnd = [];
    let cmd, desc;
    plugins.commands.map((exbot) => {
      if (exbot.pattern) {
        cmd = exbot.pattern
          .toString()
          .match(/(\W*)([A-Za-züşiğ öç1234567890]*)/)[2];
      }
      if (exbot.desc) {
        desc = exbot.desc;
      } else {
        desc = false;
      }
      if (!exbot.dontAddCommandList && cmd !== undefined) {
        cmnd.push({ cmd, desc });
      }
    });
    cmnd.sort();
    cmnd.forEach(({ cmd, desc }, num) => {
      menu += `├ ${(num += 1)} *${cmd.trim()}*\n`;
      if (desc) menu += `├ ${"use : " + desc}\n`;
    });
    menu += `╰──────────────────────────`;
    return await message.reply(menu);
  }
);
