//
//  Hit Roller for HERO Systems
//
//  Determine if an attack HTIS for MISSES.
//  John D. Allen
//  August, 2017
//
//  !ahit {DCV} {OCV} {DsLvl} {OsLvl} {Sum of other mods}

on("chat:message", function(msg) {
    if(msg.type == "api" && msg.content.indexOf("!ahit") != -1)
    {

        //log(msg);   
        Player = msg.who;
        var n = msg.content.split(" ", 6)
        //var cmd = n[0];
        var dcv = parseInt(n[1]) || -1;
        var ocv = parseInt(n[2]) || -1;
        var dlvls = parseInt(n[3]) || 0;
        var olvls = parseInt(n[4]) || 0;
        var mods = parseInt(n[5]) || 0;
        
        if(dcv == -1) {
          showError("No DCV was Entered!\nMust be > 0!");
          return;
        }
        if(ocv == -1) {
          showError("No OCV was Entered!\nMust be > 0!");
          return;
        }
        
        var base = 11;
        var result = "";
        var dice = "";
        var rr = {};
        
        log("dcv="+dcv+" ocv="+ocv+" Dlvls="+dlvls+" Olvls="+olvls+" Mods="+mods);
        //if (((ocv + olvls) - (dcv + dlvls)) + base + mods <= dieroll) { //HIT! } else { //MISS }
        // What roll do we need:
        var r = (ocv + olvls) - (dcv + dlvls) + base + mods;
        // Roll the dice:
        sendChat(Player, '[[3d6]]', function(ops) {
            rr.rolls = ops[0].inlinerolls[0].results.rolls[0].results;
            rr.total = ops[0].inlinerolls[0].results.total;
            if(rr.total <= r) {
                result = '<span style="color:red; font-weight:bold">HIT</span>';
            } else {
                result = '<span style="color:blue; font-weight:bold">MISS</span>';
            }
            // setup dice output
            for(var j=0; j<rr.rolls.length; j++) {
               dice += rr.rolls[j].v + ", ";
            }
            dice = dice.slice(0, -2);
            // Display results
            sendChat(Player, '<span style="background-color:green; color:white">   To Hit Roll   </span>');
            sendChat(Player, '<span style="color:red; font-weight:bold;">OCV: </span>' + ocv + ' + Skill Lvls: ' + olvls);
            sendChat(Player, '<span style="color:blue; font-weight:bold">DCV: </span>' + dcv + ' + SKill Lvls: ' + dlvls);
            sendChat(Player, 'Modifiers: ' + mods);
            sendChat(Player, '<span style="color:green; font-weight:bold;">Need: '+r+ ' or less</span>');
            sendChat(Player, 'Dice: <span style="font-weight:bold">' + dice + '</span> Total=' + rr.total);
            sendChat(Player, 'Result: ' + result);
            return;
        });
    }
});

function showError(msg) {
    sendChat(Player, '<span style="background-color:red; color:white">   ERROR!!   </span>');
    sendChat(Player, msg);
    return;
}

