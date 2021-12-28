import React, { useState } from "react";
import { Modal, Avatar } from "antd";
import { UserOutlined, CameraOutlined } from "@ant-design/icons";
import Axios from "axios";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { FileUpload, FormDiv ,Form} from "./Styled/NewUserModalStyled";
import OverflowScroll from "./Styled/OverflowScroll";
import { connect } from "react-redux";
import { newProfile } from "../actions/authActions";

const API_KEY = "985455412721885";
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/twittercloneapi/image/upload';
const CLOUDINARY_UPLOAD_PRESET  = "zitbuf77";


const Error = styled.p`
  color: #f32013;
  margin-top: 3%;
  margin-bottom: 3%;
`;

const NewUserModal = ({
  open,
  newProfile,
  user,
  loading,
  handleModal,
  error,
}) => {
  const { register, handleSubmit, errors } = useForm();


  const [image, setImage] = useState(null);
  // const [imageLoading, setImageLoading] = useState(false);

  const onSubmit = async (data) => {
    const profile = {
      ...data,
      avatar: image,
    };
    const res = await newProfile(profile, user._id);
    if (res === "OK") {
      handleModal();
      window.location.reload();
    }
  };

  const handleImage = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    data.append("api_key", API_KEY);
    data.append("timestamp", Date.now());
    // setImageLoading(true);
    const res = await Axios.post(
      CLOUDINARY_URL,
      data
    );

    setImage(res.data.url);
    // setImageLoading(false);
  };

  return (
    <Modal
      bodyStyle={{ height: "75vh" }}
      title={
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 400,
            marginTop: "2%",
            marginBottom: "2%",
            color: "#1DA1F2",
          }}
        >
          Create Your Profile
        </h1>
      }
      visible={open}
      footer={null}
      closable={false}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <OverflowScroll>
            <FormDiv>
              <h3>Profile Image</h3>
              <Error>{error}</Error>
              <Avatar
                size={96}
                icon={image === null ? <UserOutlined /> : <img src={image} alt="alt" />}
                style={{ marginBottom: "2%", marginTop: "2%" }}
              />
              <FileUpload>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  style={{ border: "none" }}
                  disabled={loading}
                />
                Choose A Rock On Picture <CameraOutlined />
              </FileUpload>
           
           
              <h3>Full Name</h3>
              <input
                type="text"
            placeholder="John Doe"
            name="fullName"
            ref={register({
              required: { value: true, message: "This field is required" },
            })}
                disabled={loading}
              />
              {errors.fullName && <Error>{errors.fullName.message}</Error>}


              <h3>Username</h3>
              <input
                type="text"
                placeholder="User name"
                name="username"
                ref={register({
                  required: { value: true, message: "This field is required" },
                  minLength: {
                    value: 3,
                    message: "Must be longer than 3 characters",
                  },
                  maxLength: {
                    value: 20,
                    message: "Must be less than 20 characters",
                  },
                })}
                disabled={loading}
              />  
              {errors.username && <Error>{errors.username.message}</Error>}


              <button type="submit" disabled={loading}>
                Create Profile
              </button>
            </FormDiv>
        </OverflowScroll>
      </Form>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.authReducer.user,
    loading: state.globalReducer.loading,
    error: state.authReducer.error,
  };
};

export default connect(mapStateToProps, { newProfile })(NewUserModal);
