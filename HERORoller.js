//
//  HERO Games Dice Roller
//  -- Compute  BODY + STUN for Normal Attacks & Killing Attacks
//
//  John D. Allen
//  August 2017
//  
//----------------------------------------------------------------------------
// Usage:  In the Chat box:
//    !hrn {# of dice}
//     --  This does a 'Normal' (IE> Energy Blast) attack with the specified
//         number of dice. [+1] pip and/or [HD] a half-die.
//    !hrk {# of dice}  [+1(Yes|No)] [HD(Yes|No)] [+1STUN(Yes|No)]
//     --  This does a 'Killing' attach with the specified number of dice.
//         [+1] pip and/or [HD] a half-die.
//----------------------------------------------------------------------------

// Set this varible to true to force the STUN multipler roll to a fixed value.
var FORCEDKILLINGMULTIPLYER = false;
// This is the fixed value to use.
var FKM_VALUE = 3;

var Player = "";

on("chat:message", function(msg) {
   if(msg.type == "api" && msg.content.startsWith("!hrn") !== false) {
       Player = msg.who;
       var numdice = msg.content.replace("!hrn ", "");
       var rr = {};
       var Body = 0;
       var Stun = 0;
       sendChat(msg.who, '[['+numdice+'d6sd]]', function(ops) {
           rr.rolls = ops[0].inlinerolls[0].results.rolls[0].results;
           var out = "";
           var dice = "";
           Stun = ops[0].inlinerolls[0].results.total;
           for(var j=0; j<rr.rolls.length; j++) {
               if (rr.rolls[j].v == 6) { Body += 2; }
               if (rr.rolls[j].v > 1 && rr.rolls[j].v < 6) { Body += 1; }
               dice += rr.rolls[j].v + ", ";
           }
           out = "STUN = " + Stun + " BODY = " + Body;
           dice = dice.slice(0, -2);
           sendChat(Player, '<span style="background-color:red; color:white;">   Normal Attack   </span>')
           sendChat(Player, "Roll: " + ops[0].inlinerolls[0].expression);
           sendChat(Player, 'Dice: <span style="font-weight:bold">'+dice+'</span>');           
           sendChat(Player, '<span style="color:blue; font-weight:bold;">STUN = ' + Stun + '</span>');
           sendChat(Player, '<span style="color:green; font-weight:bold;">BODY = ' + Body + '</span>');
           //log(out);
           return;
       });
   }
   if(msg.type == 'api' && msg.content.startsWith("!hrk") === true) {
       //log(msg.content);
       var n = msg.content.split(/ /,5);
       var numdice = n[1];
       var rr = {};
       var Body = 0;
       var Stun = 0;
       var rollstr = "[[" + numdice + "d6sd";
       if(n[2] == "Yes") {    // +1 PIP
           rollstr += "+1";
       }
       if(n[3] == "Yes") {    // +1/2d6
           rollstr += "+1d3";
       }
       rollstr += "]]";
       //sendChat(msg.who, '[['+numdice+'d6sd]]', function(ops) {
       sendChat(msg.who, rollstr, function(ops) {
           //log(ops[0]);
           rr.rolls = ops[0].inlinerolls[0].results.rolls
           var out = "";
           var dice = "";
           var roll = ops[0].inlinerolls[0].expression;
           Body = ops[0].inlinerolls[0].results.total;
           rr.rolls.forEach(function(r) {     // There can be multiple "R"olls
              if(r.type == "R") {
                  r.results.forEach(function(d) {
                     dice += d.v + ", "; 
                  });
              } 
           });
           // Roll STUN multiple
           sendChat(msg.who, '[[1d6]]', function(ops) {
               if(FORCEDKILLINGMULTIPLYER) {
                   rr.mul = FKM_VALUE;
               } else {
                   rr.mul = ops[0].inlinerolls[0].results.rolls[0].results[0].v;
               }
               if(n[4] != "Yes") {   // -1
                   Stun = Body * (rr.mul == 1 ? rr.mul : (rr.mul - 1));
               } else {
                   Stun = Body * rr.mul;
               }
               out = "STUN = " + Stun + " BODY = " + Body;
               dice = dice.slice(0, -2);
               sendChat(Player, '<span style="background-color:red; color:white;">   Killing Attack   </span>')
               sendChat(Player, "Roll: " + roll);
               sendChat(Player, 'Dice: <span style="font-weight:bold">'+dice+'</span>'); 
               sendChat(Player, "Multiplyer Roll: " + rr.mul);
               if(n[4] == "Yes") {
                   sendChat(Player, "   +1 STUN");
               }
               sendChat(Player, '<span style="color:blue; font-weight:bold;">STUN = ' + Stun + '</span>');
               sendChat(Player, '<span style="color:green; font-weight:bold;">BODY = ' + Body + '</span>');
               //log(out);
           })
       })
       return;
   }
});

