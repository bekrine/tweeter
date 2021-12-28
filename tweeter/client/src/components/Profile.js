import React, { useState, useEffect } from "react";
import Tweet from "./Tweet";
import { Empty } from "antd";
import styled from "styled-components";
import { connect } from "react-redux";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Moment from "react-moment";
import Axios from "axios";

 
const Container = styled.div`
  display: flex;
  flex-direction: column;

  font-family: "Mukta", sans-serif;
  border: 1px solid #e6ecf0;

  & h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 2%;
  }

  && .header {
    padding: 2%;
    display: flex;
    flex-direction: column;
    padding: 3%;
    border-bottom: 1px solid #e6ecf0;
    min-height: 8vh;
    width: 100%;
  }

  && .top {
    padding: 2%;
    border-bottom: 1px solid #e6ecf0;
    & h2 {
      margin-top: 5%;
    }

    & p {
      font-size: 1.2rem;
    }

    & .joined {
      color: black;
      margin-top: 2%;
    }
  }
`;

const Profile = ({ profile }) => {
  const [posts, setPosts] = useState([]);

  const mapPosts = () => {
    return posts.map((p) => <Tweet tweet={p} key={p._id} expandable={false} />);
  };

  const API_URL=process.env.REACT_APP_API_URL

  useEffect(() => {
    let mounted =true 
    Axios.get(
      `${API_URL}/posts/${profile.account}`
    )
    .then((res) => {
      mounted && setPosts(res.data);
    })
    .catch((err) => {
      console.log(err);
    });

    return ()=>mounted = false
  }, [profile.account,API_URL]);

  return (
    <Container>
      <div className="header">
        <h2>{profile.fullName}</h2>
        <p>
          {profile.likedPosts.length} Lifetime{" "}
          {profile.likedPosts.length === 1 ? "Interaction" : "Interactions"}
        </p>
      </div>
      <div className="top">
        <Avatar
          size={128}
          style={{ minWidth: "64px", marginTop: "5%" }}
          icon={
            profile.avatar === null ? (
              <UserOutlined />
            ) : (
              <img src={profile.avatar} alt="this is maageg" />
            )
          }
        />
        <h2>{profile.fullName}</h2>
        <p>@{profile.username}</p>
        <p className="joined">
          Joined <Moment fromNow>{profile.createdAt}</Moment>
        </p>
        <p style={{ marginTop: "2%" }}>Bio feature in development <span role="img" aria-label="emojii">🎉</span> </p>
      </div>
      <div className="feed">
        {posts.length <= 0 ? (
          <Empty
            style={{ marginTop: "5%" }}
            imageStyle={{ height: 150 }}
            description={
              <span style={{ fontSize: "1.2rem" }}>
                You have not made a tweet yet
              </span>
            }
          />
        ) : (
          mapPosts()
        )}
      </div>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    profile: state.authReducer.profile,
  };
};

export default connect(mapStateToProps, {})(Profile);
