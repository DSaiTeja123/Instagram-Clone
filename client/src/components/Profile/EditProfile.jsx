import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Textarea,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/index";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { setAuthUser } from "@/store/authSlice";

function EditProfile() {
  const { user, colorToggled } = useSelector((store) => store.auth);
  const imageRef = useRef();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const baseURL = import.meta.env.VITE_SERVER_URL;

  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender,
  });

  const changePhotoHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setInput({ ...input, profilePhoto: file });
  };

  const genderHandler = (value) => {
    setInput({ ...input, gender: value });
  };

  const editProfileHandler = async () => {
    const formData = new FormData();
    if (input.profilePhoto) formData.append("profilePhoto", input.profilePhoto);
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);

    try {
      setLoading(true);
      const res = await axios.post(
        `${baseURL}/api/v2/user/profile/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedUser = {
          ...user,
          bio: res.data.user?.bio,
          profilePicture: res.data.user?.profilePicture,
          gender: res.data.user?.gender,
        };
        dispatch(setAuthUser(updatedUser));
        navigate(`/profile/${user?._id}`);
        toast.success(res.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col min-h-screen max-w-2xl mx-auto pl-10 transition-all duration-500 ${
        colorToggled ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <section className="flex flex-col gap-6 w-full my-8">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-xl">Edit Profile</h1>
        </div>

        <div
          className={`flex items-center justify-between rounded-xl transition-all duration-500 p-4 ${
            colorToggled ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="post_image" />
              <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-sm">{user?.username}</h1>
              <span
                className={`transition-all duration-500 ${
                  colorToggled ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {user?.bio || "Bio here..."}
              </span>
            </div>
          </div>
          <input
            ref={imageRef}
            onChange={changePhotoHandler}
            type="file"
            className="hidden"
          />
          <Button
            onClick={() => imageRef?.current.click()}
            className="bg-[#0095F6] h-8 hover:bg-[#318bc7] rounded-full"
          >
            Change photo
          </Button>
        </div>

        <div>
          <h1 className="font-bold text-xl mb-2">Bio</h1>
          <Textarea
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            name="bio"
            className={`focus-visible:ring-transparent transition-all duration-500 ${
              colorToggled ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          />
        </div>

        <div>
          <h1 className="font-bold mb-2">Gender</h1>
          <Select defaultValue={input.gender} onValueChange={genderHandler}>
            <SelectTrigger
              className={`w-full transition-all duration-500 ${
                colorToggled ? "bg-gray-800 text-white" : "bg-white text-black"
              }`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end">
          {loading ? (
            <Button className="w-fit transition-all duration-500 bg-[#0095F6] hover:bg-[#2a8ccd] rounded-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              onClick={editProfileHandler}
              className="w-fit transition-all duration-500 bg-[#0095F6] hover:bg-[#2a8ccd] rounded-full"
            >
              Submit
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

export default EditProfile;
