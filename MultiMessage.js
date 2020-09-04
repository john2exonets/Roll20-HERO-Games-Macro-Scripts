//
//  MultiMessage.js  --  Send the same message to multiple players...or one.
//    Using this with a macro allows for cut/paste of pre-canned messages.
//
//  John D. Allen
//  September 2017
//
//   !mmsg  {list of players to send to} ^^  {message}
//     - the '^^' is the seperator between the list of players receiving the
//       message, and the message itself.
//

on("chat:message", function(msg) {
    if(msg.type == "api" && msg.content.indexOf("!mmsg") != -1)
    {
        var w = [];
        var m = [];
        var f = false
        msg.content.split(/ /).forEach(function(n) {
          if (n == "!mmsg") { return; }
          if (!f) {
              if (n == "^^") {
                  f = true;
              } else {
                  w.push(n);
              }
          } else {
              m.push(n);
          }
        });
        log("Who=" + w.join(" ") + "  Msg=" + m.join(" "));
        var mm = m.join(" ");
        
        // Send the messages
        w.forEach(function(n) {
           sendChat(n, "/w " + n + " " + mm); 
        });
    }
});


