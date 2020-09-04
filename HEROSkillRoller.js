//  Skill Roller for HERO Systems
//
//  Determine if a skill roll works and by how much.
//  John D. Allen
//  August, 2017
//
//  !skr {roll needed (no '-')} {modifiers} {optional SKill Roll Name}
//    Example:
//    !skr 11 ?{Perception Roll Modifiers} "Perception Roll"
//

var Player = "";
var result = "";
var rr = {};

on("chat:message", function(msg) {
    if(msg.type == "api" && msg.content.indexOf("!skr") != -1)
    {
        var dice = "";
        Player = msg.who;
        var n = msg.content.split(" ", 8);
        var r = parseInt(n[1]) || 11;
        var mods = parseInt(n[2]) || 0;
        var title = n.slice(3).join(' ') || "Skill Roll";
        //log(msg); 
        //log(n);
        
        var need = r + mods;
        sendChat(Player, '[[3d6]]', function(ops) {
            rr.rolls = ops[0].inlinerolls[0].results.rolls[0].results;
            rr.total = ops[0].inlinerolls[0].results.total;
            // setup dice output
            for(var j=0; j<rr.rolls.length; j++) {
               dice += rr.rolls[j].v + ", ";
            }
            dice = dice.slice(0, -2);
            if(rr.total <= need) {
                var over = need - rr.total;
                result = '<span style="color:black; font-weight:bold">Made It!</span> (by ' + over + ')';
            } else {
                result = '<span style="color:black; font-weight:bold">Missed</span>';
            }
            // Display results
            sendChat(Player, '<span style="background-color:green; color:white">   '+title+'   </span>');
            sendChat(Player, 'Base Roll: ' + r);
            sendChat(Player, 'Modifiers: ' + mods);            
            sendChat(Player, 'Needed: '+need+' or less');
            sendChat(Player, 'Dice: <span style="font-weight:bold">' + dice + '</span> Total=' + rr.total);
            sendChat(Player, 'Result: ' + result);
            return;
        });
    }
});

