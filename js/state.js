let commentID = 1;
export const defaultedata = 
  {
    currentUser: {
      image: {
        png: "image-juliusomo.png",
        webp: "image-juliusomo.webp",
      },
      username: "juliusomo",
    },
    comments: [
      {
        id: commentID++,
        content:
          "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
        startTime: 1678208551653, 
        createdAt: "",
        score: 12,
        upvoted: false,
        downvoted: false,
        user: {
          image: {
            png: "image-amyrobson.png",
            webp: "image-amyrobson.webp",
          },
          username: "amyrobson",
        },
        replies: [],
      },
      {
        id: commentID++,
        content:
          "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
          startTime: 1680195577183,
        createdAt: "",
        score: 5,
        upvoted: false,
        downvoted: false,
        user: {
          image: {
            png: "image-maxblagun.png",
            webp: "image-maxblagun.webp",
          },
          username: "maxblagun",
        },
        replies: [
          {
            id: commentID++,
            content:
              "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
              startTime: 1680195577183,
            createdAt: "",
            score: 4,
            upvoted: false,
            downvoted: false,
            replyingTo: "maxblagun",
            user: {
              image: {
                png: "image-ramsesmiron.png",
                webp: "image-ramsesmiron.webp",
              },
              username: "ramsesmiron",
            },
          },
          {
            id: commentID++,
            content:
              "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
            startTime: 1680628119850,
            createdAt: "",
            score: 2,
            upvoted: false,
            downvoted: false,
            replyingTo: "ramsesmiron",
            user: {
              image: {
                png: "image-juliusomo.png",
                webp: "image-juliusomo.webp",
              },
              username: "juliusomo",
            },
          },
        ],
      },
    ],
  };

export function setDefaultData(data) {
  // checking if the localstorage has the default comments
  if (!localStorage.getItem("comments")) {
    localStorage.setItem("comments", JSON.stringify(data));
    localStorage.setItem("id", JSON.stringify(commentID));
  }
}

export function setComment(comment ,name , date, png, webp, startTime) {
    let data = JSON.parse(localStorage.getItem("comments"));
    let id = JSON.parse(localStorage.getItem("id")) 
    data.comments.push({
        id: id++,
        content: comment,
      createdAt: date,
      startTime,
      score: 0,
      upvoted: false,
      downvoted: false,
        user: {
          image: { png , webp},
          username: name,
        },
        replies: [],
    })
    localStorage.setItem("comments", JSON.stringify(data));
    localStorage.setItem("id", JSON.stringify(id));
}
export function setReply(relpy ,name ,replyToName, png, webp, replyToId, startTime, date ) {
    let data = JSON.parse(localStorage.getItem("comments"));
    let id = JSON.parse(localStorage.getItem("id")) 
  data.comments.forEach(comment => {
    if (comment.id == replyToId) {
      comment.replies.push({
        startTime,
          id: id++,
          content: relpy,
          createdAt: date,
        score: 0,
        upvoted: false,
        downvoted: false,
        replyingTo: replyToName,
          user: {
            image: { png , webp},
            username: name,
          },
      })
      }
      
    });
    localStorage.setItem("comments", JSON.stringify(data));
    localStorage.setItem("id", JSON.stringify(id));
}
