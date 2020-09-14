var showPrettyDonut = 1;

window.onload = (event) => {
    pullAPOD();
    pullHistoricalEvent();
    var donut = document.getElementById("donut"); // Or whatever method to get the element
    $("#donut").scrollLeft = 400;
};

// bit wonky on larger resolutions
$(window).scroll(function() {
    var scroll = $(window).scrollTop();
    var scrollFactor = scroll / 5; 
    //console.log("scroll: " + scroll + "\n scrollFactor: " + scrollFactor)
    $(".hero").css({
      "background-position" : '0%' + scrollFactor / 30 + "%;"
        //transform: 'translate3d(-50%, -'+(scroll/100)+'%, 0) scale('+(100 + scroll/5)/100+')',
        //Blur suggestion from @janwagner: https://codepen.io/janwagner/ in comments
      //   "-webkit-filter": "blur(" + (scroll/200) + "px)",
      //   filter: "blur(" + (scroll/200) + "px)",
        //transform: "scale(" +  scaleFactor + ")",
        //"-webkit-transform": "scale(" +  scaleFactor + ")",
        //"moz-transform": "scale(" +  scaleFactor + ")",
        //"background-size" : scaleFactor + "vw " + scaleFactor + "vh ",
    });
  });

function pullWeatherPic() {
    // manually track and eventually scrape? 
    // or 
    //https://www.eldoradoweather.com/noaa-pic-o-day.html

} 

// This handler will be executed every time the cursor
// is moved over a different list item
// apod_img.addEventListener("mouseover", function( event ) {
//     console.log('apod')
//     // highlight the mouseover target
//     event.target.style.color = "orange";
  
//     // reset the color after a short delay
//     setTimeout(function() {
//       event.target.style.color = "";
//     }, 500);
//   }, false);

// $('img').hover(function() {
//     //$(this).attr('src', '');
//     document.getElementById(this.id).classList.add('img_full');
//   }, function() {
//     document.getElementById(this.id).classList.remove('img_full');
//   });


// TODO: remove citation if present
function pullHistoricalEvent() {
  var today = new Date();
  var curMonth = today.getMonth();
  var curDay   = today.getDate();
  var curYear  = today.getFullYear();
  const monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];

  const searchQuery = `${monthNames[curMonth]}_${curDay}`

  const undesirableContext = ["crash", "killing", "accident", "rampage", "destruction", "defeat", "assassination", "shot"] // seems (recorded) history is a bit grim
  console.log("happy " + String(today))

  $.ajax({
    url: `https://en.wikipedia.org/api/rest_v1/page/html/${searchQuery}`,
    cache: false,
    success: function(data) {
        var storageElement = document.createElement('html');
        storageElement.innerHTML = data;
        var eventsUL = storageElement.getElementsByTagName('ul')[0].innerText.split("\n"); 
        var birthsUL = storageElement.getElementsByTagName('ul')[1].innerText.split("\n"); 
        var deathsUL = storageElement.getElementsByTagName('ul')[2].innerText.split("\n"); 
        let randomEvent = "";
        const suffixes = ["st", "nd", "rd", "th"];
        let randomBday  = birthsUL[Math.floor(Math.random() * birthsUL.length)];
        console.log(randomBday)
        var invalidEvent = 1;

        do {
          randomEvent = eventsUL[Math.floor(Math.random() * eventsUL.length)];
          //console.log(randomEvent)
          invalidEvent = undesirableContext.some(substring=>randomEvent.includes(substring));
        } while (invalidEvent)
        
        var birthdayEE;
        let isAlive = 1;
        if (randomBday.includes("d."))
          isAlive = 0
        if (!isAlive)
          birthdayEE = randomBday.slice(0, randomBday.lastIndexOf("(d."))
        
        birthdayEE = randomBday.slice(randomBday.indexOf("–")+1);

        let birthYear = parseInt(randomBday.split(" ")[0])
        let deathYear = -1

        if (randomBday.includes("d. "))
          deathYear = parseInt(randomBday.split("d. ")[0][-1])
        
        let numLaps = curYear - birthYear;
        let properSuffix = "";

        if ((numLaps % 10) == 1)
          properSuffix = 'st';
        else if ((numLaps % 10) == 2) 
          properSuffix = 'nd';
        else if ((numLaps % 10) == 3)
          properSuffix = 'rd';
        else if ((numLaps % 10) >= 4)
          properSuffix = 'th';

        const waysToSayBirthday = [`congratulations to ${birthdayEE} for their ${numLaps}${properSuffix} lap around the sun!`, `happy ${numLaps}${properSuffix} b-day to ${birthdayEE}!`]
        var bdayHTML = waysToSayBirthday[Math.floor(Math.random() * waysToSayBirthday.length)];
        //document.getElementById("todayInHistory").innerHTML = `${monthNames[curMonth]} ${curDay} ` + randomEvent + '<br>';
        document.getElementById("todayInHistory").innerHTML = bdayHTML;
    },  
    error: function() {
        return console.log("error!");
    }
  });
}


function pullAPOD() {
    //https://apod.nasa.gov/apod/astropix.html
    // var apod_url = "https://apod.nasa.gov/apod/astropix.html";
    // var request = makeHttpObject();
    // request.open("GET", apod_url, true);
    // request.send(null);
    // request.onreadystatechange = function() {
    //   if (request.readyState == 4)
    //     console.log(request.responseText);
    // };
    apod = "https://apod.nasa.gov/apod/image/2008/PerseidBridge_Zhang_4032.jpg";
    document.getElementById("apod_img").src = apod;
}

function makeHttpObject() {
    try {return new XMLHttpRequest();}
    catch (error) {}
    try {return new ActiveXObject("Msxml2.XMLHTTP");}
    catch (error) {}
    try {return new ActiveXObject("Microsoft.XMLHTTP");}
    catch (error) {}
  
    throw new Error("Could not create HTTP request object.");
  }
  
function updateZip(form) {
  let newZip = $("#zip_input").val();

  console.log("updating to " + newZip)
    $("#windy_iframe").src = "";
    console.log(form)
}

var pretag = document.getElementById('donut');
$('#donut').scrollLeft(2000);
//var canvastag = document.getElementById('canvasdonut');

var tmr1 = undefined, tmr2 = undefined;
var A=1, B=1;

// shoutout to Andy Sloane for this js port of his beautiful self-rotating C code
// shader portion is my own
// https://www.a1k0n.net/2011/07/20/donut-math.html
var asciiframe=function() {
  var b=[];
  var z=[];
  A += 0.04;
  B += 0.03;
  var cA=Math.cos(A), sA=Math.sin(A),
      cB=Math.cos(B), sB=Math.sin(B);
  for(var k=0;k<1760;k++) {
    b[k]=k%80 == 79 ? "\n" : " ";
    z[k]=0;
  }
  for(var j=0;j<6.28;j+=0.07) { // j <=> theta
    var ct=Math.cos(j),st=Math.sin(j);
    for(i=0;i<6.28;i+=0.02) {   // i <=> phi
      var sp=Math.sin(i),cp=Math.cos(i),
          h=ct+2, // R1 + R2*cos(theta)
          D=1/(sp*h*sA+st*cA+5), // this is 1/z
          t=sp*h*cA-st*sA; // this is a clever factoring of some of the terms in x' and y'

      var x=0|(40+30*D*(cp*h*cB-t*sB)),
          y=0|(12+15*D*(cp*h*sB+t*cB)),
          o=x+80*y,
          N=0|(8*((st*sA-sp*ct*cA)*cB-sp*ct*sA-st*cA-cp*ct*sB));
      if(y<22 && y>=0 && x>=0 && x<79 && D>z[o])
      {
        z[o]=D;
        b[o]=".,-~:;=!*#$@"[N>0?N:0];
      }
    }
  }

  if (showPrettyDonut) {
    var colors = ["#efca46","#f6b041","#f89644","#f57d4c","#ed6557","#df4f62","#cb3d6c","#b33175","#952c7c","#732b7f","#4a2b7e", "#7621a1"]
    colours = colors.reverse();
    //console.log(b)
    var gradient_b = [];
    var ascii_chars = [".",",", "-", "~", ":", ";","=", "!", "*", "#", "$", "@"]
    var this_char_index = 0;
    var colored_char = "";
  
    b.forEach(function(char) {
      this_char_index = ascii_chars.indexOf(char);
      colored_char = "<span style=\"color: " + colours[this_char_index] + "\">" + char + "</span>"
  
      // bit expensive but Highly Neat. adds 'glow' to corresponding level of illumination
      //if (this_char_index === ascii_chars.length - 1) 
      //  colored_char = "<span style=\"color: " + colours[this_char_index] + "; text-shadow: -4px 0px 12px rgba(245, 210, 181, 0.658);\">" + char + "</span>"
      //else if (this_char_index === 0) 
      //  colored_char = `<span style="color: ${colours[this_char_index]}; text-shadow: -4px 0px 12px rgba(189, 131, 255, 0.521);">${char}</span>`
      gradient_b.push(colored_char)
    })
    //console.log(gradient_b)
  
    pretag.innerHTML = gradient_b.join("");
  }
  else {
    pretag.innerHTML = b.join("");

  }

};

window.anim1 = function() {

};


//asciiframe();
//canvasframe();
setInterval(asciiframe, 50);
