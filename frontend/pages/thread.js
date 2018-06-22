import React from "react";
import { Page } from "../components/Page";
import { Post } from "../components/Post";
import { Spacer } from "../components/Spacer";
import { SPACING } from "../lib/spacing";
import { COLORS } from "../lib/colors";
import { Gradient, GRADIENT_COLORS } from "../components/Gradient";
import { Text } from "../components/Text";
import GreenDot from "../components/GreenDot";
import { Button } from "../components/Button";
import { BOARD_LIST } from "../components/NavHeader";
import { CreatePostForm } from "../components/Post/CreatePost";
import { Icon, ICONS } from "../components/Icon";
import { withApollo } from "../components/ApolloProvider";

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
  },
  {
    id: 1235,
    author: {
      id: 0,
      name: "Anonymous"
    },
    body: `Saw this on sale for 50$. Worth it for a college student?
Specs: i5 3320m
4gb
500gb`,
    photo: {
      id: 12345,
      width: 770,
      height: 443,
      url: "http://is2.4chan.org/g/1529444147559.jpg"
    },
    timestamp: "2018-06-18T05:00:14.156Z"
  },
  {
    id: 12340,
    author: {
      id: 0,
      name: "Anonymous"
    },
    body: `
---
__Advertisement :)__

- __[pica](https://nodeca.github.io/pica/demo/)__ - high quality and fast image
  resize in browser.
- __[babelfish](https://github.com/nodeca/babelfish/)__ - developer friendly
  i18n with plurals support and easy syntax.

You will like those projects!

---

# h1 Heading 8-)
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading


## Horizontal Rules

___

---

***


## Typographic replacements

Enable typographer option to see result.

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

test.. test... test..... test?..... test!....

!!!!!! ???? ,,  -- ---

"Smartypants, double quotes" and 'single quotes'


## Emphasis

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

~~Strikethrough~~


## Blockquotes


> Blockquotes can also be nested...
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.


## Lists

Unordered

+ Create a list by starting a line with \`+\`, \`-\`, or \`*\`
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa


1. You can use sequential numbers...
1. ...or keep all the numbers as \`1.\`

Start numbering with offset:

57. foo
1. bar


## Code

Inline \`code\`

Indented code

    // Some comments
    line 1 of code
    line 2 of code
    line 3 of code


Block code "fences"

\`\`\`
Sample text here...
\`\`\`

Syntax highlighting

\`\`\` js
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));
\`\`\`

## Tables

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

Right aligned columns

| Option | Description |
| ------:| -----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |


## Links

[link text](http://dev.nodeca.com)

[link with title](http://nodeca.github.io/pica/demo/ "title text!")

Autoconverted link https://github.com/nodeca/pica (enable linkify to see)


## Images

![Minion](https://octodex.github.com/images/minion.png)
![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")

Like links, Images also have a footnote style syntax

![Alt text][id]

With a reference later in the document defining the URL location:

[id]: https://octodex.github.com/images/dojocat.jpg  "The Dojocat"


## Plugins

The killer feature of \`markdown-it\` is very effective support of
[syntax plugins](https://www.npmjs.org/browse/keyword/markdown-it-plugin).


### [Emojies](https://github.com/markdown-it/markdown-it-emoji)

> Classic markup: :wink: :crush: :cry: :tear: :laughing: :yum:
>
> Shortcuts (emoticons): :-) :-( 8-) ;)

see [how to change output](https://github.com/markdown-it/markdown-it-emoji#change-output) with twemoji.


### [Subscript](https://github.com/markdown-it/markdown-it-sub) / [Superscript](https://github.com/markdown-it/markdown-it-sup)

- 19^th^
- H~2~O


### [\<ins>](https://github.com/markdown-it/markdown-it-ins)

++Inserted text++


### [\<mark>](https://github.com/markdown-it/markdown-it-mark)

==Marked text==


### [Footnotes](https://github.com/markdown-it/markdown-it-footnote)

Footnote 1 link[^first].

Footnote 2 link[^second].

Inline footnote^[Text of inline footnote] definition.

Duplicated footnote reference[^second].

[^first]: Footnote **can have markup**

    and multiple paragraphs.

[^second]: Footnote text.


### [Definition lists](https://github.com/markdown-it/markdown-it-deflist)

Term 1

:   Definition 1
with lazy continuation.

Term 2 with *inline markup*

:   Definition 2

        { some code, part of Definition 2 }

    Third paragraph of definition 2.

_Compact style:_

Term 1
  ~ Definition 1

Term 2
  ~ Definition 2a
  ~ Definition 2b


### [Abbreviations](https://github.com/markdown-it/markdown-it-abbr)

This is HTML abbreviation example.

It converts "HTML", but keep intact partial entries like "xxxHTMLyyy" and so on.

*[HTML]: Hyper Text Markup Language

### [Custom containers](https://github.com/markdown-it/markdown-it-container)

::: warning
*here be dragons*
:::
    `
  }
];

const COMMENTS = {
  12340: [],
  1235: [
    {
      id: 12346,
      author: {
        id: 0,
        name: "Anonymous"
      },
      timestamp: "2018-06-18T05:00:14.156Z",
      body:
        "For 50 dollars I say go for it. Even if you end up dislike it you can sell it for at least 150 dollars."
    },
    {
      id: 12347,
      author: {
        id: 0,
        name: "Anonymous"
      },
      timestamp: "2018-06-18T05:00:14.156Z",
      body: `https://toads.app/tech/66417879
Yeah, they're nice little laptops. White background makes the specs hard to see. OpenSUSE Leap KDE, 12GB RAM, i5 3320M, 250GB SDD, and a 9 cell battery (9-12 hours depending on workload).

$50 is an absolute steal. Go for it dude.`
    },
    {
      id: 12347,
      author: {
        id: 0,
        name: "Anonymous"
      },
      timestamp: "2018-06-18T05:00:15.156Z",
      body: `https://toads.app/tech/66417942
> i5 3320M
what can you do with that?`
    }
  ],
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
      body: `https://toads.app/tech/66380579 (OP)
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
      body: `https://toads.app/tech/66380855
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

const NewPostButton = ({ classes, onPress }) => (
  <Button
    onClick={onPress}
    color={COLORS.white}
    icon={<Icon icon={ICONS.camera} color={COLORS.black} />}
  >
    New thread
  </Button>
);

class ViewBoardPage extends React.Component {
  state = {
    showCreatePost: false
  };

  handleHideCreatePost = () => this.setState({ showCreatePost: false });
  handleShowCreatePost = () => {
    this.setState({ showCreatePost: true }, () => {
      this.dropZoneRef.open();
    });
  };

  renderHeader = () => {
    const onlineCount = 12;
    const color = GRADIENT_COLORS.blue;
    const board = BOARD_LIST.find(
      ({ id }) => id === this.props.url.query.board
    );

    return (
      <form>
        <Gradient color={color}>
          <div className="Header">
            <Text
              size="24px"
              letterSpacing="0.33px"
              weight="bold"
              color={COLORS.white}
            >
              /{board.id}/ - {board.label}
            </Text>
            <Spacer height={SPACING.normal} />
            <div className="OnlineNowBar">
              <NewPostButton
                pressed={this.state.showCreatePost}
                onPress={this.handleShowCreatePost}
              />
              {this.state.showCreatePost && (
                <CreatePostForm
                  dropZoneRef={dropZoneRef => (this.dropZoneRef = dropZoneRef)}
                  onDismiss={this.handleHideCreatePost}
                />
              )}
              <Spacer width={SPACING.normal} />
              <GreenDot />
              <Spacer width={SPACING.small} />
              <Text
                size="14px"
                weight="bold"
                letterSpacing="0.22px"
                color={COLORS.white}
              >
                <Text underline weight="inherit" color="inherit" size="inherit">
                  {onlineCount} toads
                </Text>
                &nbsp;online now
              </Text>
            </div>
          </div>

          <style jsx>{`
            .Header {
              padding-left: ${SPACING.huge}px;
              padding-right: ${SPACING.huge}px;
              padding-top: ${SPACING.normal}px;
              padding-bottom: ${SPACING.normal}px;
              position: relative;
            }

            .OnlineNowBar {
              display: flex;
              align-items: center;
            }
          `}</style>
        </Gradient>
      </form>
    );
  };
  render() {
    const onlineCount = 12;
    const color = GRADIENT_COLORS.blue;
    const board = BOARD_LIST.find(
      ({ id }) => id === this.props.url.query.board
    );
    const { showCreatePost } = this.state;

    return (
      <Page renderSubheader={this.renderHeader}>
        <Spacer height={SPACING.large} />

        {POSTS.map(post => (
          <div className="PageWrapper PostWrapper" key={post.id}>
            <Spacer height={SPACING.large} />
            <Post comments={COMMENTS[post.id]} post={post} />
            <Spacer height={SPACING.large} />
          </div>
        ))}

        <style jsx>{`
          .PostWrapper {
            width: 100%;
            border-bottom: 1px solid ${COLORS.offwhite};
          }

          .PageWrapper {
            display: block;
            padding-left: ${SPACING.huge}px;
          }
        `}</style>
      </Page>
    );
  }
}

export default withApollo(ViewBoardPage);
