import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API = "https://6953a084a319a928023c1129.mockapi.io/users";

const Edit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [avatar, setAvatar] = useState("");
    const [loading, setLoading] = useState(true);

    // Получение пользователя
    const getUser = async () => {
        try {
            const response = await axios.get(`${API}/${id}`);

            setName(response.data.name || "");
            setTitle(response.data.title || "");
            setAvatar(response.data.avatar || "");

        } catch (error) {
            console.log("Ошибка загрузки:", error);
        } finally {
            setLoading(false);
        }
    };


    // Обновление пользователя
    const updateUser = async () => {
        try {
            const response = await axios.put(
                `${API}/${id}`,
                {
                    name,
                    title,
                    avatar
                }
            );


            // обновляем localStorage
            localStorage.setItem(
                "user",
                JSON.stringify(response.data)
            );


            alert("Данные успешно изменены");

            navigate("/profile");


        } catch (error) {
            console.log("Ошибка обновления:", error);
            alert("Ошибка при сохранении");
        }
    };


    useEffect(() => {
        getUser();
    }, [id]);


    if (loading) {
        return (
            <h2 className="text-center mt-5">
                Загрузка...
            </h2>
        );
    }


    return (
        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-6">

                    <div className="card shadow border-0 rounded-4">


                        <div className="card-header bg-success text-white text-center">
                            <h3>
                                Edit Profile
                            </h3>
                        </div>


                        <div className="card-body">


                            <div className="text-center mb-3">

                                <img
                                    src={avatar}
                                    alt="avatar"
                                    width="120"
                                    height="120"
                                    className="rounded-circle border"
                                />

                            </div>



                            <label className="fw-bold">
                                Name
                            </label>

                            <input
                                className="form-control mb-3"
                                type="text"
                                value={name}
                                onChange={(e)=>setName(e.target.value)}
                            />



                            <label className="fw-bold">
                                Title
                            </label>

                            <input
                                className="form-control mb-3"
                                type="text"
                                value={title}
                                onChange={(e)=>setTitle(e.target.value)}
                            />



                            <label className="fw-bold">
                                Avatar URL
                            </label>

                            <input
                                className="form-control mb-4"
                                type="text"
                                value={avatar}
                                onChange={(e)=>setAvatar(e.target.value)}
                            />



                            <button
                                className="btn btn-success w-100"
                                onClick={updateUser}
                            >
                                💾 Save changes
                            </button>


                        </div>


                    </div>

                </div>

            </div>

        </div>
    );
};


export default Edit;
