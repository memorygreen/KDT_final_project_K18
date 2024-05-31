import { useState } from "react";
import axios from "axios";

const OpenAI = () => {
    const [prompt, setPrompt] = useState("");
    const [imageURL, setImageURL] = useState("");

    const createImg = async () => {
        try {
            const response = await axios.post("http://localhost:5000/generate-image", {
                prompt,
            });
            setImageURL(response.data);
        } catch (error) {
            console.error("Error generating image:", error);
        }
    };

    const handleChange = (e) => {
        setPrompt(e.target.value);
    };

    return (
        <div className="container-fluid">
            <div className="form">
                <h1>당신의 예술 작품을 만드세요!</h1>
                {imageURL && <img src={imageURL} alt="Generated from prompt" />}
                <div>
                    <textarea
                        type="text"
                        onChange={handleChange}
                        value={prompt}
                        placeholder="이미지 설명을 입력하세요">
                    </textarea>
                    <button type="submit" className="btn btn-primary" onClick={createImg}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OpenAI;
