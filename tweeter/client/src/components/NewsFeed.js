import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Axios from "axios";
import Moment from "react-moment";

const API_KEY = "b3d9037c88b686552ab2ca4bcbe6479f";

const Container = styled.div`
  font-family: "Mukta", sans-serif;
  width: 20%;
  min-width: 15%;
  padding: 1%;
  height: 100vh;
  margin-left: 75%;
  overflow: hidden;
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 1440px) {
    margin-left: 72%;
    width: 25%;
  }

  @media (max-width: 1050px) {
    display: none;
  }

  && .top-news {
    height: 75vh;
    background: #f5f8fa;
    padding: 5%;
    border-radius: 10px;

    & h2 {
      font-size: 1.5rem;
      width: 100%;
      font-weight: 700;
      padding-bottom: 2%;
      border-bottom: 1px solid #e6ecf0;
    }
    & p {
      color: gray;
      margin-bottom: 3%;
    }
  }

  && .article {
    padding: 2%;
    margin-top: 3%;

    & p {
      color: gray;
      margin-bottom: 3%;
    }

    & h2 {
      margin-top: 3%;
      font-size: 1.3rem;
    }
  }
`;

const NewsFeed = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true
    if (window.innerWidth > 1050) {
      Axios.get(`https://gnews.io/api/v3/top-news?token=${API_KEY}&max=10`)
        .then((res) => {
          mounted && setData(res.data.articles);
        })
        .catch((err) => {
          mounted && setData([]);
          mounted && setError(err.response.message);
        });
    }
    return ()=>mounted=false
  }, []);

  if (data === null) {
    return (
      <Container>
        <div className="top-news">
          <h2>What's Happening</h2>
          <Spin
            size="large"
            style={{
              marginTop: "25%",
              marginLeft: "40%",
            }}
            indicator={<LoadingOutlined spin />}
          />
        </div>
      </Container>
    );
  }

  console.log(data[0])
  return (
    <Container>
      <div className="top-news">
        <h2>What's Happening</h2>
        {error}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "scroll",
            height: "100%",
          }}
        >
          {data.map((article,index) => (
            <div key={index+article.url} className="article">
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <p>{article.source.name}</p>
                <p>
                  Published <Moment fromNow>{article.publishedAt}</Moment>
                </p>
                <h2>{article.title}</h2>
              </a>
            </div>
          ))}
        </div>
      </div>
      <div>
        <a href="https://saidfatah.com" target="_blank" rel="noopener noreferrer">
          Our Creator <span role="img" aria-label="emojii" >👑</span>{" "}
        </a>
        <p style={{ marginTop: "5%" }}>© 2020 Tweeter, Inc.</p>
      </div>
    </Container>
  );
};

export default NewsFeed;
