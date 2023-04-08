
$(document).ready(async function () {

  const response = await fetch(
    'https://emoji-api.com/emojis?access_key=7ca7649d287b5cc9368e676ef16442cfaf5742b5',
    {
      method: 'GET',
    }
  );
  const data = await response.json();


  data.forEach(emoji => {
    let square = $("<div class='emoji'>" + emoji.character.split("/")[0] + "</div>");
    $("#emojibox #containeremoji").append(square);
  });
});

$(document).ready(function () {
  $("#newEmoji").click(function () {
    $("#emojibox").removeClass("nascondi");
    $("#emojibox").addClass("mostra");
  });

  $("#chiudiemoji").click(function () {
    $("#emojibox").removeClass("mostra");
    $("#emojibox").addClass("nascondi");
  });


  $("#newImg").click(function () {
    $("#imagebox").removeClass("nascondi");
    $("#imagebox").addClass("mostra");
  });

  $("#chiudiImg").click(function () {
    $("#imagebox").removeClass("mostra");
    $("#imagebox").addClass("nascondi");
  });

  $("#imagebox input").on("change", function () {
    console.log($("#imagebox input").val());

    if ($("#imagebox input").val() != "") {
      $("#imagebox #caricafirst").removeClass("mostra");
      $("#imagebox #caricafirst").removeClass("centra");
      $("#imagebox #caricafirst").addClass("nascondi");
      $("#moreImg").removeClass("nascondi");
      $("#moreImg").addClass("mostra");
      $("#footerImgbox").removeClass("nascondi");
      $("#footerImgbox").addClass("mostra");
      $("#sendImg").removeClass("nascondi");
      $("#sendImg").addClass("mostra");

      let img = $("<div class='photo'><img src='https://random.imagecdn.app/200/300' widht='200px' height='300px'/><span class='nophoto'>Elimina foto</span></div>");
      $("#containerImg").prepend(img);
    }

  });
});

$(document).on('click', '.emoji', function (e) {
  $("#dataMessage input").val($("#dataMessage input").val() + e.target.innerHTML);
});

$(document).on('click', '.nophoto', function (e) {
  console.log(e.target.parentElement);
  e.target.parentElement.remove();

  if ($("#containerImg img").length == 0) {
    $("#imagebox #caricafirst").removeClass("nascondi");
    $("#imagebox #caricafirst").addClass("mostra");
    $("#imagebox #caricafirst").addClass("centra");

    $("#moreImg").removeClass("mostra");
    $("#moreImg").addClass("nascondi");

    $("#footerImgbox").removeClass("mostra");
    $("#footerImgbox").addClass("nascondi");
    $("#sendImg").removeClass("mostra");
    $("#sendImg").addClass("nascondi");
  }
});

