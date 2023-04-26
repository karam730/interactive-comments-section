import "/css/style.css";
import { defaultedata, setDefaultData, setComment, setReply } from "./state";

const getIconsSrc = (name) => {
  const path = `/images/${name}`;
  const modules = import.meta.glob("/images/*", { eager: true });
  const mod = modules[path];
  return mod.default;
};

const getAvatarsSrc = (name) => {
  const path = `/images/avatars/${name}`;
  const modules = import.meta.glob("/images/avatars/*", { eager: true });
  const mod = modules[path];
  return mod.default;
};

const ACTIVE_UPVOTE_ICON_SRC = "icon-plus-active.svg";
const UNACTIVE_UPVOTE_ICON_SRC = "icon-plus.svg";
const ACTIVE_DONWVOTE_ICON_SRC = "icon-minus-active.svg";
const UNACTIVE_DONWVOTE_ICON_SRC = "icon-minus.svg";
const REPLY_ICON_SRC = "icon-reply.svg";
const DELETE_ICON_SRC = "icon-delete.svg";
const EDIT_ICON_SRC = "icon-edit.svg";
const deleteBtn = document.querySelector(".delete-btn");
const comments = document.querySelector("main");
const addCommentBtn = document.querySelector("[data-add-comment]");

let idToDelete;
let commentToDeleteType;

const usersCommentCardTemplate = document.querySelector(
  "[data-user-comment-card]"
);
const curretnUserCommentCardTemplate = document.querySelector(
  "[data-curretn-user-comment-card]"
);
const usersReplyCommentCardTemplate = document.querySelector(
  "[data-user-reply-comment-card]"
);
const curretnUserReplyCommentCardTemplate = document.querySelector(
  "[data-currnt-user-reply-comment-card]"
);


function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value;
}

function setImg(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).src = value;
}

function setDataAttribute(selector, value, { parent = document } = {}) {
  parent
  .querySelector(`[data-${selector}]`)
  .setAttribute(`data-${selector}`, `${value}`);
  
}

function setDataAttributes(selector, value, { parent = document } = {}) {
  const elements = parent.querySelectorAll(`[data-${selector}]`);
  elements.forEach((element) => {
    element.setAttribute(`data-${selector}`, `${value}`);
  });
}

function elapesdTime(startTime) {
  const currentTime = new Date();
  const timeDiff = currentTime.getTime() - startTime;
  const secondPassed = timeDiff / 1000;
  const minutesPassed = Math.floor(secondPassed / 60);
  const hoursPassed = Math.floor( minutesPassed / 60);
  const daysPassed = Math.floor(hoursPassed / 24);
  const weeksPassed = Math.floor(daysPassed / 7);
  const monthesPassed = Math.floor(daysPassed / 30);
  if (minutesPassed === 0) {
    return "now"
  } else if (minutesPassed === 1) {
    return `${minutesPassed} minute ago`
  } else if (minutesPassed <= 59) {
    return `${minutesPassed} minutes ago`
  } else if (hoursPassed === 1 ) {
    return `${hoursPassed} hour ago`
  } else if ( hoursPassed < 24) {
    return `${hoursPassed} hours ago`
  } else if (daysPassed === 1) {
    return `${daysPassed} day ago`
  } else if (daysPassed <= 6) {
    return `${daysPassed} days ago`
  } else if (weeksPassed === 1) {
    return `${weeksPassed} week ago`
  } else if (weeksPassed <=  4 ) {
    return `${weeksPassed} weeks ago`
  } else if (monthesPassed === 1 ) {
    return `${monthesPassed} month ago`
  } else if (monthesPassed <= 11) {
    return `${monthesPassed} monthes ago`
  } else {
    return `more than one year`
    
  }
}

function renderAllComments() {
  const data = JSON.parse(localStorage.getItem("comments"));
  const body = document.querySelector("body");
  renderUserComments(data);
  renderCurentUserComments(data);
  body.classList.remove("loading")
}

function renderAllReplies(replies, data, replySection) {
  replies.forEach((reply) => {
    if (reply.user.username !== data.currentUser.username) {
      renderUserReplyCommnets(reply, replySection,data);
    } else {
      renderCurrentUserReplyCommnets(reply, replySection);
    }
  });
}

function renderUserComments(data) {
  data.comments.forEach((comment) => {
    if (comment.user.username !== data.currentUser.username) {
      const element = usersCommentCardTemplate.content.cloneNode(true);
      setDataAttributes("id", comment.id, { parent: element });
      setDataAttribute("upvoted", comment.upvoted, { parent: element });
      setDataAttribute("downvoted", comment.downvoted, { parent: element });
      setImg("upvoted", getIconsSrc(UNACTIVE_UPVOTE_ICON_SRC), { parent: element });
      setImg("downvoted", getIconsSrc(UNACTIVE_DONWVOTE_ICON_SRC), { parent: element });
      setImg("reply-icon", getIconsSrc(REPLY_ICON_SRC), { parent: element });
      if (comment.upvoted) {
        setImg("upvoted", getIconsSrc(ACTIVE_UPVOTE_ICON_SRC), { parent: element });
        element.querySelector("[data-upvoted").classList.add("active");
      }
      if (comment.downvoted) {
        setImg("downvoted", getIconsSrc(ACTIVE_DONWVOTE_ICON_SRC), {
          parent: element,
        });
        element.querySelector("[data-downvoted").classList.add("active");
      }
      setValue("upvotes", comment.score, { parent: element });
      setImg("img", getAvatarsSrc(comment.user.image.png), { parent: element });
      setImg("reply-eara-img", getAvatarsSrc(data.currentUser.image.png), { parent: element });
      setValue("name", comment.user.username, { parent: element });
      setDataAttributes("name", comment.user.username, { parent: element });
      comment.createdAt = elapesdTime(comment.startTime)
      setValue("date", comment.createdAt, { parent: element });
      setValue("comment", comment.content, { parent: element });
      const replySection = element.querySelector(".reply-section")
      comments.appendChild(element);
      if (comment.replies.length > 0) {
        renderAllReplies(comment.replies, data, replySection);
      }
      
    }
  });
  localStorage.setItem("comments", JSON.stringify(data));
}

function renderCurentUserComments(data) {
  data.comments.forEach((comment) => {
    if (comment.user.username === data.currentUser.username) {
      const element = curretnUserCommentCardTemplate.content.cloneNode(true);
      setDataAttribute("upvoted", comment.upvoted, { parent: element });
      setDataAttribute("downvoted", comment.downvoted, { parent: element });
      setImg("upvoted", getIconsSrc(UNACTIVE_UPVOTE_ICON_SRC), { parent: element });
      setImg("downvoted", getIconsSrc(UNACTIVE_DONWVOTE_ICON_SRC), { parent: element });
      setImg("delete-icon", getIconsSrc(DELETE_ICON_SRC), { parent: element });
      setImg("edit-icon", getIconsSrc(EDIT_ICON_SRC), { parent: element });
      if (comment.upvoted) {
        setImg("upvoted", getIconsSrc(ACTIVE_UPVOTE_ICON_SRC), { parent: element });
        element.querySelector("[data-upvoted]").classList.add("active");
      }
      if (comment.downvoted) {
        setImg("downvoted", getIconsSrc(ACTIVE_DONWVOTE_ICON_SRC), {
          parent: element,
        });
        element.querySelector("[data-downvoted]").classList.add("active");
      }
      setDataAttributes("id", comment.id, { parent: element });
      setDataAttributes("name",data.currentUser.username ,{parent:element})
      setValue("upvotes", comment.score, { parent: element });
      setImg("img", getAvatarsSrc(comment.user.image.png), { parent: element });
      setValue("name", comment.user.username, { parent: element });
      // updating the time
      comment.createdAt = elapesdTime(comment.startTime);
      setValue("date", comment.createdAt, { parent: element });
      setValue("comment", comment.content, { parent: element });
      comments.appendChild(element);
    }
  });
  localStorage.setItem("comments", JSON.stringify(data));
}

function renderUserReplyCommnets(reply, replySection, data) {
  const element = usersReplyCommentCardTemplate.content.cloneNode(true);
  setDataAttribute("upvoted", reply.upvoted, { parent: element });
  setDataAttribute("downvoted", reply.downvoted, { parent: element });
  setImg("upvoted", getIconsSrc(UNACTIVE_UPVOTE_ICON_SRC), { parent: element });
  setImg("downvoted", getIconsSrc(UNACTIVE_DONWVOTE_ICON_SRC), { parent: element });
  setImg("reply-icon", getIconsSrc(REPLY_ICON_SRC), { parent: element });
  if (reply.upvoted) {
    setImg("upvoted",getIconsSrc(ACTIVE_UPVOTE_ICON_SRC), { parent: element });
    element.querySelector("[data-upvoted]").classList.add("active");
  }
  if (reply.downvoted) {
    setImg("downvoted", getIconsSrc(ACTIVE_DONWVOTE_ICON_SRC), { parent: element });
    element.querySelector("[data-downvoted]").classList.add("active");
  }
  setDataAttributes("id", reply.id, { parent: element });
  setDataAttributes("name", reply.user.username, { parent: element });
  setValue("upvotes", reply.score, { parent: element });
  setImg("img", getAvatarsSrc(reply.user.image.png), { parent: element });
  setImg("reply-eara-img", getAvatarsSrc(data.currentUser.image.png), { parent: element });
  setValue("name", reply.user.username, { parent: element });
  reply.createdAt = elapesdTime(reply.startTime)
  setValue("date", reply.createdAt, { parent: element });
  setValue("comment", reply.content, { parent: element });
  setValue("reply-to", reply.replyingTo, { parent: element });
  replySection.appendChild(element);
}

function renderCurrentUserReplyCommnets(reply, replySection) {
  const element = curretnUserReplyCommentCardTemplate.content.cloneNode(true);
  setDataAttributes("id", reply.id, { parent: element })
  setDataAttribute("upvoted", reply.upvoted, { parent: element });
  setDataAttribute("downvoted", reply.downvoted, { parent: element });
  setImg("upvoted", getIconsSrc(UNACTIVE_UPVOTE_ICON_SRC), { parent: element });
  setImg("downvoted", getIconsSrc(UNACTIVE_DONWVOTE_ICON_SRC), { parent: element });
  setImg("delete-icon", getIconsSrc(DELETE_ICON_SRC), { parent: element });
  setImg("edit-icon", getIconsSrc(EDIT_ICON_SRC), { parent: element });
  if (reply.upvoted) {
    setImg("upvoted", getIconsSrc(ACTIVE_UPVOTE_ICON_SRC), { parent: element });
    element.querySelector("[data-upvoted]").classList.add("active");
  }
  if (reply.downvoted) {
    setImg("downvoted", getIconsSrc(ACTIVE_DONWVOTE_ICON_SRC), { parent: element });
    element.querySelector("[data-downvoted]").classList.add("active");
  }
  setValue("upvotes", reply.score, { parent: element });
  setImg("img", getAvatarsSrc(reply.user.image.png), { parent: element });
  setValue("name", reply.user.username, { parent: element });
  reply.createdAt = elapesdTime(reply.startTime);
  setValue("date", reply.createdAt, { parent: element });
  setValue("comment", reply.content, { parent: element });
  setValue("reply-to", reply.replyingTo, { parent: element });
  replySection.appendChild(element);
}

function addComment() {
  const data = JSON.parse(localStorage.getItem("comments"));
  let id = JSON.parse(localStorage.getItem("id"))
  const element = curretnUserCommentCardTemplate.content.cloneNode(true);
  const comment = document.querySelector("[data-send]").value;
  const startTime = new Date().getTime(); 

  // setting the comment in locslStorage
  setComment(
    comment,
    data.currentUser.username,
    elapesdTime(startTime),
    data.currentUser.image.png,
    data.currentUser.image.webp,
    startTime,
  );
  setDataAttributes("id", id++, { parent: element });
  setDataAttributes("name", data.currentUser.username, { parent: element });
  setDataAttribute("upvoted", false, { parent: element });
  setDataAttribute("downvoted", false, { parent: element });
  setValue("upvotes", 0, { parent: element });
  setValue("date", elapesdTime(startTime), { parent: element });
  setValue("name", data.currentUser.username, { parent: element });
  setImg("img", getAvatarsSrc(data.currentUser.image.png), { parent: element });
  setImg("upvoted", getIconsSrc(UNACTIVE_UPVOTE_ICON_SRC), { parent: element });
  setImg("downvoted", getIconsSrc(UNACTIVE_DONWVOTE_ICON_SRC), { parent: element });
  setImg("edit-icon", getIconsSrc(EDIT_ICON_SRC), { parent: element });
  setImg("delete-icon", getIconsSrc(DELETE_ICON_SRC), { parent: element });
  setValue("comment", comment, { parent: element });
  comments.appendChild(element);
    window.scrollTo({behavior:"smooth"},comments.scrollHeight)
  document.querySelector("[data-send]").value = "";
}

function upvote(e) {
  if (e.target.classList.contains("upvote-btn")) {
    const upvoteIcon = e.target;
    upvoteIcon.classList.toggle("active");
    const parent = upvoteIcon.parentElement;
    const downvoteIcon = parent.querySelector("[data-downvoted]");
    const isDownvoted = downvoteIcon.getAttribute("data-downvoted");
    const isUpvoted = upvoteIcon.getAttribute("data-upvoted");
    const upvotes = parent.querySelector("[data-upvotes]");
    let data = JSON.parse(localStorage.getItem("comments"));

    if (isUpvoted === "false" && isDownvoted === "false") {
      upvoteIcon.setAttribute("data-upvoted", "true");
      upvoteIcon.src = getIconsSrc(ACTIVE_UPVOTE_ICON_SRC);
      upvotes.textContent = parseInt(upvotes.textContent) + 1;
      data.comments.forEach((comment) => {
        if (upvoteIcon.dataset.reply === "reply") {
          comment.replies.forEach((relpy) => {
            if (relpy.id == parent.dataset.id) {
              relpy.score += 1;
              relpy.upvoted = true;
              localStorage.setItem("comments", JSON.stringify(data));
            }
          });
        } else if (comment.id == parent.dataset.id) {
          comment.score += 1;
          comment.upvoted = true;
          localStorage.setItem("comments", JSON.stringify(data));
        }
      });
    } else if (isUpvoted === "false" && isDownvoted === "true") {
      upvoteIcon.setAttribute("data-upvoted", "true");
      downvoteIcon.setAttribute("data-downvoted", "false");
      upvoteIcon.src = getIconsSrc(ACTIVE_UPVOTE_ICON_SRC);
      downvoteIcon.src = getIconsSrc(UNACTIVE_DONWVOTE_ICON_SRC);
      downvoteIcon.classList.remove("active");
      upvotes.textContent = parseInt(upvotes.textContent) + 2;
      data.comments.forEach((comment) => {
        if (upvoteIcon.dataset.reply === "reply") {
          comment.replies.forEach((relpy) => {
            if (relpy.id == parent.dataset.id) {
              relpy.score += 2;
              relpy.upvoted = true;
              relpy.downvoted = false;
              localStorage.setItem("comments", JSON.stringify(data));
            }
          });
        } else if (comment.id == parent.dataset.id) {
          comment.score += 2;
          comment.upvoted = true;
          comment.downvoted = false;
          localStorage.setItem("comments", JSON.stringify(data));
        }
      });
    } else if ((isUpvoted === "true", isDownvoted === "false")) {
      upvoteIcon.setAttribute("data-upvoted", "false");
      upvoteIcon.src = getIconsSrc(UNACTIVE_UPVOTE_ICON_SRC);
      upvotes.textContent = parseInt(upvotes.textContent) - 1;
      data.comments.forEach((comment) => {
        if (upvoteIcon.dataset.reply === "reply") {
          comment.replies.forEach((relpy) => {
            if (relpy.id == parent.dataset.id) {
              relpy.score -= 1;
              relpy.upvoted = false;
              localStorage.setItem("comments", JSON.stringify(data));
            }
          });
        } else if (comment.id == parent.dataset.id) {
          comment.score -= 1;
          comment.upvoted = false;
          localStorage.setItem("comments", JSON.stringify(data));
        }
      });
    }
  }
}

function downvote(e) {
  if (e.target.classList.contains("downvote-btn")) {
    const downvoteIcon = e.target;
    downvoteIcon.classList.toggle("active");
    const parent = downvoteIcon.parentElement;
    const upvoteIcon = parent.querySelector("[data-upvoted]");
    const isDownvoted = downvoteIcon.getAttribute("data-downvoted");
    const isUpvoted = upvoteIcon.getAttribute("data-upvoted");
    const upvotes = parent.querySelector("[data-upvotes]");
    let data = JSON.parse(localStorage.getItem("comments"));

    if (isDownvoted === "false" && isUpvoted === "false") {
      downvoteIcon.setAttribute("data-downvoted", "true");
      downvoteIcon.src = getIconsSrc(ACTIVE_DONWVOTE_ICON_SRC);
      upvotes.textContent = parseInt(upvotes.textContent) - 1;
      data.comments.forEach((comment) => {
        if (downvoteIcon.dataset.reply === "reply") {
          comment.replies.forEach((relpy) => {
            if (relpy.id == parent.dataset.id) {
              relpy.score -= 1;
              relpy.downvoted = true;
              localStorage.setItem("comments", JSON.stringify(data));
            }
          });
        } else if (comment.id == parent.dataset.id) {
          comment.score -= 1;
          comment.downvoted = true;
          localStorage.setItem("comments", JSON.stringify(data));
        }
      });
    } else if (isDownvoted === "false" && isUpvoted === "true") {
      downvoteIcon.setAttribute("data-downvoted", "true");
      upvoteIcon.setAttribute("data-upvoted", "false");
      downvoteIcon.src = getIconsSrc(ACTIVE_DONWVOTE_ICON_SRC);
      upvoteIcon.src = getIconsSrc(UNACTIVE_UPVOTE_ICON_SRC);
      upvoteIcon.classList.remove("active");
      upvotes.textContent = parseInt(upvotes.textContent) - 2;
      data.comments.forEach((comment) => {
        if (downvoteIcon.dataset.reply === "reply") {
          comment.replies.forEach((relpy) => {
            if (relpy.id == parent.dataset.id) {
              relpy.score -= 2;
              relpy.downvoted = true;
              relpy.upvoted = false;
              localStorage.setItem("comments", JSON.stringify(data));
            }
          });
        } else if (comment.id == parent.dataset.id) {
          comment.score -= 2;
          comment.downvoted = true;
          comment.upvoted = false;
          localStorage.setItem("comments", JSON.stringify(data));
        }
      });
    } else if (isDownvoted === "true" && isUpvoted === "false") {
      downvoteIcon.setAttribute("data-downvoted", "false");
      downvoteIcon.src = getIconsSrc(UNACTIVE_DONWVOTE_ICON_SRC);
      upvotes.textContent = parseInt(upvotes.textContent) + 1;
      data.comments.forEach((comment) => {
        if (downvoteIcon.dataset.reply === "reply") {
          comment.replies.forEach((relpy) => {
            if (relpy.id == parent.dataset.id) {
              relpy.score += 1;
              relpy.downvoted = false;
              localStorage.setItem("comments", JSON.stringify(data));
            }
          });
        }
        if (comment.id == parent.dataset.id) {
          comment.score += 1;
          comment.downvoted = false;
          localStorage.setItem("comments", JSON.stringify(data));
        }
      });
    }
  }
}


function showReplaycard(e) {
  if (e.target.dataset.showReplyCard === "show") {
    const cards = comments.querySelectorAll("[data-card]");
    const btn = e.target;
    cards.forEach((card) => {
      if (card.dataset.id === btn.dataset.id) {
        const replyErea = card.querySelector("[data-reply-eara]");
        replyErea.classList.toggle("hide-form");
        replyErea.classList.toggle("show-form");
        replyErea.scrollIntoView({block:"center",behavior:"smooth"})
      }
    });
  }
}

function addReplyToComment(e) {
  const data = JSON.parse(localStorage.getItem("comments"));
  let id = JSON.parse(localStorage.getItem("id"))
  const btn = e.target;
  const parent = btn.parentElement;
  const reply = parent.querySelector("[data-textarea]").value;
  const replySection = comments.querySelector(`section[data-id="${btn.dataset.id}"]`)
  const element = curretnUserReplyCommentCardTemplate.content.cloneNode(true);
  const startTime = new Date().getTime()
  setDataAttributes("id",id++ ,{parent: element})
  setDataAttribute("upvoted", false, { parent: element });
  setDataAttribute("downvoted", false, { parent: element });
  setValue("upvotes", 0, { parent: element });
  setValue("name", data.currentUser.username, { parent: element });
  setValue("reply-to", btn.dataset.name, { parent: element });
  setValue("date", elapesdTime(startTime), { parent: element });
  setImg("img", getAvatarsSrc(data.currentUser.image.png), { parent: element });
  setImg("upvoted", getIconsSrc(UNACTIVE_UPVOTE_ICON_SRC), { parent: element });
  setImg("downvoted", getIconsSrc(UNACTIVE_DONWVOTE_ICON_SRC), { parent: element });
  setImg("edit-icon", getIconsSrc(EDIT_ICON_SRC), { parent: element });
  setImg("delete-icon", getIconsSrc(DELETE_ICON_SRC), { parent: element });
  setValue("comment", reply, { parent: element });
  setDataAttributes("name", data.currentUser.username, { parent: element });
  replySection.appendChild(element)
  parent.querySelector("[data-textarea]").value = ""
  replySection.scrollIntoView({behavior:"smooth",block:"end"})
  setReply(
    reply,
    data.currentUser.username,
    btn.dataset.name,
    data.currentUser.image.png,
    data.currentUser.image.webp,
    btn.dataset.id,
    startTime,
    elapesdTime(startTime)
  );
  // hiding the reply form
  const parentSection = comments.querySelector(`div[data-id="${btn.dataset.id}"]`);
  parentSection.querySelector("[data-reply-eara]").classList.remove("show-form");
  parentSection.querySelector("[data-reply-eara]").classList.add("hide-form");
}

function addReplyToReply(e) {
  let data = JSON.parse(localStorage.getItem("comments"));
  let id = JSON.parse(localStorage.getItem("id"))
  const btn = e.target;
    const parent = btn.parentElement;
    const reply = parent.querySelector("[data-textarea]").value;
    const replyCard = comments.querySelector(`div[data-id="${btn.dataset.id}"]`);
  const replySection = replyCard.parentElement;
  const startTime = new Date().getTime()
  const element = curretnUserReplyCommentCardTemplate.content.cloneNode(true);
  setDataAttributes("id", id++, { parent: element });
  setDataAttributes("name", data.currentUser.username, { parent: element });
  setDataAttribute("upvoted", false, { parent: element });
  setDataAttribute("downvoted", false, { parent: element });
  setValue("upvotes", 0, { parent: element });
  setValue("name", data.currentUser.username, { parent: element });
  setValue("reply-to", btn.dataset.name, { parent: element });
  setValue("date", elapesdTime(startTime), { parent: element });
  setImg("img", getAvatarsSrc(data.currentUser.image.png), { parent: element });
  setImg("upvoted", getIconsSrc(UNACTIVE_UPVOTE_ICON_SRC), { parent: element });
  setImg("downvoted", getIconsSrc(UNACTIVE_DONWVOTE_ICON_SRC), { parent: element });
  setImg("edit-icon", getIconsSrc(EDIT_ICON_SRC), { parent: element });
  setImg("delete-icon", getIconsSrc(DELETE_ICON_SRC), { parent: element });
  setValue("comment", reply, { parent: element });
  replySection.appendChild(element);
  replySection.scrollIntoView({behavior:"smooth",block:"end"})
  parent.querySelector("[data-textarea]").value = "";
  setReply(reply,
    data.currentUser.username,
    btn.dataset.name,
    data.currentUser.image.png,
    data.currentUser.image.webp,
    replySection.dataset.id,
    startTime,
    elapesdTime(startTime)
  )
  // hiding the reply form
  const parentSection = comments.querySelector(`div[data-id="${btn.dataset.id}"]`);
  parentSection.querySelector("[data-reply-eara]").classList.remove("show-form");
  parentSection.querySelector("[data-reply-eara]").classList.add("hide-form");
}

function addReply(e) {
  e.preventDefault();
  if (e.target.classList.contains("add-reply-btn")) {
    addReplyToComment(e)
  } else if (e.target.classList.contains("add-reply-to-a-reply-btn")) {
    addReplyToReply(e)
  }
}

function makeCommentEditable(e) {
  if (e.target.dataset.edit) {
    const makeCommentEditedBtn = e.target;
    const parent = comments.querySelector(`div[data-id="${makeCommentEditedBtn.dataset.id}"]`);
    const comment = parent.querySelector("p[data-comment]");
    const editCommentTextArea = parent.querySelector(".edit-comment");
    const editCard = parent.querySelector(".edit");
    const updateBtn = parent.querySelector(".update-btn");
    makeCommentEditedBtn.disabled = true;
    editCard.style.opacity = ".5"
    editCommentTextArea.value = comment.textContent;
    editCommentTextArea.classList.toggle("hide");
    comment.classList.toggle("hide");
    updateBtn.classList.toggle("hide");
    editCommentTextArea.style.width = "100%"
    editCommentTextArea.focus();
    editCommentTextArea.scrollIntoView({behavior:"smooth",block:"center"})
  }
}

function updateComment(e) {
  if (e.target.matches("#update-btn")) {
    let data = JSON.parse(localStorage.getItem("comments"))
    const updateCommentBtn = e.target;
    const parent = comments.querySelector(`div[data-id="${updateCommentBtn.dataset.id}"]`);
    const makeCommentEditedBtn = parent.querySelector(".edit-btn")
    const comment = parent.querySelector("p[data-comment]");
    const editCommentTextArea = parent.querySelector(".edit-comment");
    const editCard = parent.querySelector(".edit");
    makeCommentEditedBtn.disabled = false;
    editCard.style.opacity = "1"
    comment.textContent = editCommentTextArea.value;
    editCommentTextArea.classList.toggle("hide");
    comment.classList.toggle("hide");
    updateCommentBtn.classList.toggle("hide");
    data.comments.forEach(comment => {
      if (comment.id == updateCommentBtn.dataset.id) {
        comment.content = editCommentTextArea.value
      }
    })
    localStorage.setItem("comments", JSON.stringify(data))
  }
}

function updateReply(e) {
  if (e.target.matches("#update-reply-btn")) {
    let data = JSON.parse(localStorage.getItem("comments"))
    const updateReplyBtn = e.target;
    const parent = comments.querySelector(`div[data-id="${updateReplyBtn.dataset.id}"]`);
    const makeCommentEditedBtn = parent.querySelector(".edit-btn")
    const comment = parent.querySelector("p[data-comment]");
    const editCommentTextArea = parent.querySelector(".edit-comment");
    const editCard = parent.querySelector(".edit");
    makeCommentEditedBtn.disabled = false;
    editCard.style.opacity = "1"
    comment.textContent = editCommentTextArea.value;
    editCommentTextArea.classList.toggle("hide");
    comment.classList.toggle("hide");
    updateReplyBtn.classList.toggle("hide");
    data.comments.forEach(comment => {
      if (comment.replies.length > 0) {
        comment.replies.forEach(reply => {
          if (reply.id == updateReplyBtn.dataset.id) {
            reply.content = editCommentTextArea.value
          }
        })
      }
      
    })
    localStorage.setItem("comments", JSON.stringify(data))
  }
}

function deleteComment(id ,type) {
  let data = JSON.parse(localStorage.getItem("comments"));
  document.querySelector(`div[data-id="${id}"]`).remove();
  if (type === "comment") {
    removeCommentFromState(data, id)
  } else if (type === "reply") {
    removeRemoveReplyFromState(data, id)
  }
}

function removeCommentFromState(data, id) {
  const filterdComments = data.comments.filter(comment => {
    return comment.id != id
  })
  data.comments = filterdComments;
  localStorage.setItem("comments",JSON.stringify(data))
}

function removeRemoveReplyFromState(data, id) {
  data.comments.map((comment, i) => {
    if (comment.replies.length > 0) {
      const filterdReplies = comment.replies.filter((reply) => {
        return reply.id != id
      })
      data.comments[i].replies = filterdReplies;
    }
  })
  localStorage.setItem("comments",JSON.stringify(data))
}

function getIdToDelete(e) {
  if (e.target.matches(".show-modal")) {
    idToDelete = e.target.dataset.id;
    commentToDeleteType = e.target.dataset.type
  }
}


window.addEventListener("load", () => setDefaultData(defaultedata),{once: true});
window.addEventListener("load", renderAllComments,{once: true});
addCommentBtn.addEventListener("click", addComment);
comments.addEventListener("click", addReply);
comments.addEventListener("click", upvote);
comments.addEventListener("click", downvote);
comments.addEventListener("click", showReplaycard);
comments.addEventListener("click", makeCommentEditable);
comments.addEventListener("click", updateComment);
comments.addEventListener("click", updateReply);
comments.addEventListener("click", getIdToDelete);
deleteBtn.addEventListener("click", () => deleteComment(idToDelete, commentToDeleteType));