import React from "react";
import { Page } from "../components/Page";
import { Post } from "../components/Post";

const POSTS = [
  {
    id: 1234,
    author: {
      id: 0,
      name: "Anonymous"
    },
    body: `> Google released its latest annual diversity report this week, with the results showing that the search giant is still predominantly male and white

> Black and Latinx employees left the company more than any other race

> The firm made incremental improvements in hiring more females overall

> The results come after former employee James Damore was fired from the company for sharing a controversial memo about female employees at the firm

http://www.dailymail.co.uk/news/article-5852069/Google-struggling-hold-black-Hispanic-employees-diversity-report-reveals.html`,
    photo: {
      id: 12345,
      width: 576,
      height: 228,
      url:
        "http://i.dailymail.co.uk/i/newpix/2018/06/15/19/4D3E017200000578-5846563-image-a-1_1529088620434.jpg"
    },
    timestamp: "2018-06-17T05:00:14.156Z"
  }
];

const COMMENTS = {
  1234: [
    {
      id: 12345,
      author: {
        id: 0,
        name: "Anonymous"
      },
      timestamp: "2018-06-17T05:00:14.156Z",
      body:
        "Leaving implies they were struggling with performance. Maybe they couldn't make the cut and when you hire people for their race instead of their skill maybe that will happen."
    },
    {
      id: 12346,
      author: {
        id: 0,
        name: "Anonymous"
      },
      timestamp: "2018-06-17T05:00:14.157Z",
      body:
        "Yo Google, unironically hire me. I only know first year CS shit, some C, some Racket, some HTML/CSS/JS, and I can learn more on the job."
    },
    {
      id: 12347,
      author: {
        id: 0,
        name: "Anonymous"
      },
      timestamp: "2018-06-17T05:00:14.158Z",
      body: `>>66380579 (OP)
>Latinx
This shit triggers me so much as a Latino. STOP CHANGING MY LANGUAGE REEEEEEEEEEEEEEEEEEEE`
    },
    {
      id: 12347,
      author: {
        id: 0,
        name: "Anonymous"
      },
      timestamp: "2018-06-17T05:00:14.158Z",
      body: `>>66380855
> when you hire people for their race instead of their skill`,
      photo: {
        id: 12346,
        width: 660,
        height: 440,
        url: "https://i.imgflip.com/1bcey5.jpg"
      }
    }
  ]
};

class ViewBoardPage extends React.Component {
  render() {
    return (
      <Page>
        {POSTS.map(post => (
          <Post key={post.id} comments={COMMENTS[post.id]} post={post} />
        ))}
      </Page>
    );
  }
}

export default ViewBoardPage;
