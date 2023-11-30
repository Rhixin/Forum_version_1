var user_obj;
var all;
var password = 123;

function get_all() {
  $.get("http://hyeumine.com/forumGetPosts.php", function (data) {
    all = JSON.parse(data);
  });
}

$(function () {
  $("#inv_acc").hide();
  //$(".Sign_in").hide();
  $(".Page").hide();
});

function log_in() {
  let first = $("#first_name_log").val();
  let last = $("#last_name_log").val();

  $.post(
    "http://hyeumine.com/forumLogin.php",
    {
      username: first + last,
    },
    function (data, status) {
      data = JSON.parse(data);

      if (data["success"] == false || first == "" || last == "") {
        $("#inv_acc").show();
      } else {
        user_obj = data["user"];
        $(".Sign_in").hide();
        $(".Page").fadeIn();
        $("#mind").attr(
          "placeholder",
          "What's on your mind " + user_obj.username + "?"
        );
        $("#name_indication1").html(`<b>You: ${user_obj.username}</b>`);

        $.get("http://hyeumine.com/forumGetPosts.php", function (data) {
          all = JSON.parse(data);
          let x, y, z;

          for (i = 0; i < all.length; i++) {
            if (user_obj.username == all[i].user) {
              x = "profile_logo.png";
              y = "#82c4f7";
              z = true;
            } else {
              x = "profile_logo2.png";
              y = "#fff";
              z = false;
            }

            create_box(all[i], x, y, z, user_obj.id);
          }
        });
      }
    }
  );
}

function sign_in() {
  let first = $("#first_name_sign").val();
  let last = $("#last_name_sign").val();

  $.post(
    "http://hyeumine.com/forumCreateUser.php",
    {
      username: first + last,
    },
    function (data) {
      console.log(data);
    }
  );
}

function new_post() {
  let input = $("#mind").val();
  let b = {
    user: user_obj["username"],
    post: input,
  };

  $.post(
    "http://hyeumine.com/forumNewPost.php",
    {
      id: user_obj["id"],
      post: input,
    },
    function (data) {
      $.get("http://hyeumine.com/forumGetPosts.php", function (data) {
        all = JSON.parse(data);

        create_box(
          all[all.length - 1],
          "profile_logo.png",
          "#82c4f7",
          true,
          125
        );
      });
    }
  );
}

function reply_something(uid_x, id_x, username, rep_id) {
  // http://hyeumine.com/forumReplyPost.php
  var reply_text = $("#reply" + id_x).val();

  $.post(
    "http://hyeumine.com/forumReplyPost.php",
    {
      user_id: uid_x,
      post_id: id_x,
      reply: reply_text,
    },
    function (data) {
      //`<div class="post_description"><b>${buff.reply[i].user}: </b> ${buff.reply[i].reply}</div>`;
      //log_in();
      //console.log(data.id);
      $(`#replynew${id_x}`).prepend(
        `<div class="post_description" id="r${rep_id}"><span style="text-align: right;"><b>${user_obj.username}: </b> ${reply_text}</span><button type="button" class="btn-close" aria-label="Close" style="float: left"></button></div><div style = "display: flex; justify-content: left; width: 97%; margin-bottom: 15px" id="reps${rep_id}"><span style="font-size: xx-small">2023-11-07 07:26:01</span></div>`
      );
      $("#no_comment" + id_x).remove();
    }
  ).fail(function (jqXHR, textStatus, errorThrown) {
    console.error("AJAX request failed: " + textStatus, errorThrown);
  });
}

function create_box(buff, x, y, z, user_id, log_in_name) {
  let guardian = "ALERT!SCRIPT DETECTED!!!!";
  let reppp;
  if (buff.user === "samplesample") {
    //alert(buff.id);
  }
  let cool = "";
  if (buff?.reply) {
    for (let i = 0; i < buff.reply.length; i++) {
      cool += `<div class="post_description" id="r${buff.reply[i].id}"><span style="text-align: right;"><b>${buff.reply[i].user}: </b> ${buff.reply[i].reply}</span><button type="button" class="btn-close" aria-label="Close" style="float: left" id="rep${buff.reply[i].id}" onclick="delete_reply(${buff.reply[i].id})"></button></div><div style = "display: flex; justify-content: left; width: 97%; margin-bottom: 15px" id="reps${buff.reply[i].id}"><span style="font-size: xx-small">${buff.reply[i].date}</span></div>`;
    }
  }

  $("#profile_box").after(`
  <div class=" popup-div post_model " style = "background-color: ${y}" id="box${
    buff.id
  }" >
    <div class="other_user_header">
      <img src=${x} width="42px" />
      <div style="width: 700px">
        <p style="line-height: 40px; margin-left: 10px">
          <b>${z ? "You: " : "Username: "} ${buff.user}</b>
        </p>
      </div>
      <div style="width: 560px; padding-top: 10px; text-align: right" >
      <b>Date: </b>${buff.date}
    
      </div>
    </div>
    <div class="post_description" ><span style="font-size: xxx-large;">${
      buff.post[0] == "<" ? guardian : buff.post
    }</span></div>
    <div class="post_description" ><b>Comments</b></div>
    <div id = "replynew${
      buff.id
    }"class="post_description comments" style="display: flex; flex-direction: column; background-color: ${
    z ? `#d4d1d1` : `#d4d1d1`
  }; border-radius: 7px;" id="comment_section">
      ${
        buff?.reply
          ? cool
          : `<div class="post_description" id="no_comment${buff.id}">No Comments Available</div>`
      }
    </div>
    <div class="other_user_footer">

    
    
        ${
          z
            ? `<input type="text" class="form-control" id="reply${buff.id}" placeholder="Comment Something..." style="margin-top: 10px; margin-left: 0px; width: 1190px"/><button
            type="button"
            class="btn btn-primary" 
            style="
              background-color: #1977f3;
              border-color: #1977f3;
              width: 100px;
              margin-top: 10px;
              margin-left: 8px;
            "
            id="reply${buff.id}"
            onclick = "reply_something(${user_id},${buff.id},${log_in_name},${reppp})"
          >
            Reply
          </button><button
        type="button"
        class="btn btn-primary" 
        style="
          background-color: #1977f3;
          border-color: #1977f3;
          width: 100px;
          margin-top: 10px;
          margin-left: 10px;
        "
        id="${buff.id}"
        onclick = "delete_post()"
      >
        Delete
      </button>`
            : `<input type="text" class="form-control" id="reply${buff.id}" placeholder="Comment Something..." style="margin-top: 10px; margin-left: 0px; width: 1190px"/><button
      type="button"
      class="btn btn-primary" 
      style="
        background-color: #1977f3;
        border-color: #1977f3;
        width: 100px;
        margin-top: 10px;
        margin-left: 8px;
      "
      id="reply${buff.id}"
      onclick = "reply_something(${user_id},${buff.id},${log_in_name},${reppp})"
    >
      Reply
    </button>`
        }


      
    </div>
  </div>`);
}

function delete_post() {
  var buttonId = event.target.id;
  $(`#box${buttonId}`).remove();
  console.log(buttonId);

  $.get(
    `http://hyeumine.com/forumDeletePost.php?id=${buttonId}`,
    function (data) {
      const response = JSON.parse(data);

      console.log(response);

      if (response.success === true) {
        // Post was successfully deleted
        console.log("Post deleted successfully");
        // You can also perform any additional actions or UI updates here
      } else {
        // Deletion was not successful
        console.log("Failed to delete the post");
        // You can handle errors or display a message to the user here
      }
    }
  );
}

const toastTrigger = document.getElementById("liveToastBtn");
const toastLiveExample = document.getElementById("liveToast");

if (toastTrigger) {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
  toastTrigger.addEventListener("click", () => {
    toastBootstrap.show();
  });
}

function log_out() {
  $("#inv_acc").hide();
  $(".Sign_in").fadeIn();
  $(".Page").hide();
}

function delete_reply(reply_id) {
  //alert(1);
  //alert(reply_id);
  $("#r" + reply_id).remove();
  $("#reps" + reply_id).remove();
  //$("#no_comment" + id_x).remove();

  $.get(
    `http://hyeumine.com/forumDeleteReply.php?id=${reply_id}`,
    function (data) {}
  );
}
