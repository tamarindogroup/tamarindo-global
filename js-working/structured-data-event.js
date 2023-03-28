
/* can only create structured data if location is confirmed */
if (!myLocation) {return;}

/* if location address is set to Online, set event as online only */
if (myLocation == "Online") {
    var modeStr = '\"eventAttendanceMode\": \"https://schema.org/OnlineEventAttendanceMode\"';
    var locStr = '\"location\": {\"@type\": \"VirtualLocation\", \"url\": \"' + myURL + '"}';
}

else { /* else its a real event */
  var modeStr = "\"eventAttendanceMode\": \"https://schema.org/OfflineEventAttendanceMode\"";
  var locStr = "\"location\": { \"@type\": \"Place\", \"name\": \"\"}";   
  }

var eventStr = '\
      \"@context\": \"https://schema.org\",\
      \"@type\": \"Event\",\
      \"name\": \"' + myName + '\",\
      \"startDate\": \"' + myDate + '\",\
      \"endDate\": \"' + myDate + '\",\
      \"image\": [\"' + myImg + '\"],\
      \"description\": \"' + myDesc + '\",\
      \"organizer\": {\
        \"@type\": \"Organization\",\
        \"name\": \"Tamarindo\",\
        \"url\": \"https://www.tamarindo.global\"\
      }'

eventStr = "{" + eventStr + "," + modeStr + "," + locStr + "}";

var s = document.createElement("script");
s.type = "application/ld+json";
// escape double-quotes with backslash
s.innerHTML = eventStr;
var head = document.getElementsByTagName("head")[0];
head.appendChild(s);




<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Financing Wind 2023",
  "description": "For the people creating the future of global wind.",
  "image": "https://uploads-ssl.webflow.com/6361890e4c4a65d7854edebd/63caa44c44df80f5ec014891_FW-0668-edit-crop-1800-compressed.jpeg",
  "startDate": "2023-05-25",
  "endDate": "2023-05-25",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {		
    "@type": "Place",
    "name": "8 Northumberland Ave",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "8 Northumberland Avenue",
      "addressLocality": "London",
      "postalCode": "WC2N 5BY",
      "addressCountry": "GB"
    }
  }
}
</script>


<html>
  <head>
    <title>The Adventures of Kira and Morrison</title>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": "The Adventures of Kira and Morrison",
      "startDate": "2025-07-21T19:00-05:00",
      "endDate": "2025-07-21T23:00-05:00",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "eventStatus": "https://schema.org/EventScheduled",
      "location": {
        "@type": "Place",
        "name": "Snickerpark Stadium",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "100 West Snickerpark Dr",
          "addressLocality": "Snickertown",
          "postalCode": "19019",
          "addressRegion": "PA",
          "addressCountry": "US"
        }
      },
      "image": [
        "https://example.com/photos/1x1/photo.jpg",
        "https://example.com/photos/4x3/photo.jpg",
        "https://example.com/photos/16x9/photo.jpg"
       ],
      "description": "The Adventures of Kira and Morrison is coming to Snickertown in a can't miss performance.",
      "offers": {
        "@type": "Offer",
        "url": "https://www.example.com/event_offer/12345_201803180430",
        "price": "30",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "validFrom": "2024-05-21T12:00"
      },
      "performer": {
        "@type": "PerformingGroup",
        "name": "Kira and Morrison"
      },
      "organizer": {
        "@type": "Organization",
        "name": "Kira and Morrison Music",
        "url": "https://kiraandmorrisonmusic.com"
      }
    }
    </script>
  </head>
  <body>
  </body>
</html>







// if ("".match(/([dD]igital|[vV]irtual|[oO]nline)/)) { /* if location contains one of these words, assume its an online event */
//   var modeStr = "\"eventAttendanceMode\": \"https://schema.org/OnlineEventAttendanceMode\"";
//   var locStr = "\"location\": {\"@type\": \"VirtualLocation\", \"url\": \"https://www.awordaboutwind.com\"}";
//   }

// else { /* else its a real event */
//   var modeStr = "\"eventAttendanceMode\": \"https://schema.org/OfflineEventAttendanceMode\"";
//   var locStr = "\"location\": { \"@type\": \"Place\", \"name\": \"\"}";   
//   }

// var eventStr = "\
//       \"@context\": \"https://schema.org\",\
//       \"@type\": \"Event\",\
//       \"name\": \"Financing Wind 2023\",\
//       \"startDate\": \"May 25, 2023\",\
//       \"endDate\": \"\",\
//       \"eventStatus\": \"https://schema.org/EventScheduled\",\
//       \"image\": [\"https://assets.website-files.com/5e961df2f7ade512596f7bd4/6363db491f7aa625a054fb74_FW-NewLook-Vertical-Blue-RGB-01.png\"],\
//       \"description\": \"For the people creating the future of global wind.\",\
//       \"organizer\": {\
//         \"@type\": \"Organization\",\
//         \"name\": \"A Word About Wind\",\
//         \"url\": \"https://www.awordaboutwind.com\"\
//       }"

// eventStr = "{" + eventStr + "," + modeStr + "," + locStr + "}";

// var s = document.createElement("script");
// s.type = "application/ld+json";
// // escape double-quotes with backslash
// s.innerHTML = eventStr;
// var head = document.getElementsByTagName("head")[0];
// head.appendChild(s);

